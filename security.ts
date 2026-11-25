import type { Request, Response, NextFunction } from 'express';
import dns from 'node:dns/promises';
import net from 'node:net';

interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();

export function createRateLimiter(options: { windowMs: number; max: number; keyPrefix: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${options.keyPrefix}:${ip}`;
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (existing.count >= options.max) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: `Too many requests. Please wait ${retryAfter} seconds before trying again.`,
      });
    }

    existing.count += 1;
    next();
  };
}

export function sanitizeTextInput(input: unknown, maxLength = 25000): string {
  if (typeof input !== 'string') return '';
  // Strip null bytes and control chars except newlines/tabs
  return input
    .replace(/\0/g, '')
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function isPrivateOrReservedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === 'ip6-localhost' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }
  const ipVersion = net.isIP(hostname);
  if (ipVersion === 4) {
    const parts = hostname.split('.').map(Number);
    if (parts[0] === 10 || parts[0] === 127 || parts[0] === 0) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
  }
  if (ipVersion === 6) {
    if (lower === '::1' || lower.startsWith('fe80:') || lower.startsWith('fc') || lower.startsWith('fd')) {
      return true;
    }
  }
  return false;
}

export function validateSafeHttpUrl(rawUrl: string): { valid: boolean; normalized?: string; reason?: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed) return { valid: false, reason: 'Empty URL' };
  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, reason: 'Only HTTP and HTTPS protocols are permitted.' };
    }
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return { valid: false, reason: 'Hostname appears incomplete.' };
    }
    if (isPrivateOrReservedHost(parsed.hostname)) {
      return { valid: false, reason: 'Private or loopback addresses are blocked.' };
    }
    return { valid: true, normalized: parsed.toString() };
  } catch {
    return { valid: false, reason: 'Invalid URL format.' };
  }
}

export interface ExternalVerificationResult {
  checkedFacts: string[];
  unverifiedItems: string[];
  domainSignalsSummary: string;
}

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'yahoo.in',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'rediffmail.com',
  'yandex.com',
  'mail.com',
]);

export async function inspectSupplyMetadata(params: {
  recruiterEmail?: string;
  websiteUrl?: string;
  companyName?: string;
}): Promise<ExternalVerificationResult> {
  const checkedFacts: string[] = [];
  const unverifiedItems: string[] = [];

  const email = sanitizeTextInput(params.recruiterEmail, 254).toLowerCase();
  const websiteRaw = sanitizeTextInput(params.websiteUrl, 500);
  const company = sanitizeTextInput(params.companyName, 200);

  let emailDomain = '';
  const tasks: Array<Promise<void>> = [];

  if (email && email.includes('@')) {
    emailDomain = email.split('@')[1] || '';
    if (FREE_EMAIL_DOMAINS.has(emailDomain)) {
      checkedFacts.push(`Recruiter email (${email}) uses public webmail domain "${emailDomain}", not a dedicated corporate domain.`);
    } else if (emailDomain && !isPrivateOrReservedHost(emailDomain)) {
      tasks.push(
        (async () => {
          try {
            const mx = await Promise.race([
              dns.resolveMx(emailDomain),
              new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 1200)),
            ]);
            if (mx && mx.length > 0) {
              checkedFacts.push(`DNS MX records exist for email domain "${emailDomain}" (mail servers configured; does not confirm company ownership).`);
            } else {
              checkedFacts.push(`No DNS MX records found for email domain "${emailDomain}".`);
            }
          } catch {
            unverifiedItems.push(`Could not verify mail server DNS records for "${emailDomain}".`);
          }
        })()
      );
    }
  } else {
    unverifiedItems.push('Recruiter email address was not provided or could not be independently verified.');
  }

  if (websiteRaw) {
    const check = validateSafeHttpUrl(websiteRaw);
    if (!check.valid || !check.normalized) {
      checkedFacts.push(`Supplied URL "${websiteRaw}" failed safe URL validation (${check.reason}).`);
    } else {
      const parsed = new URL(check.normalized);
      const usesHttps = websiteRaw.trim().toLowerCase().startsWith('https://');
      if (!usesHttps && websiteRaw.trim().toLowerCase().startsWith('http://')) {
        checkedFacts.push(`Supplied URL uses unencrypted HTTP rather than HTTPS.`);
      } else {
        checkedFacts.push(`Supplied website hostname parsed as "${parsed.hostname}" (HTTPS scheme ${usesHttps ? 'present' : 'assumed'}).`);
      }

      if (emailDomain && !FREE_EMAIL_DOMAINS.has(emailDomain)) {
        const hostClean = parsed.hostname.replace(/^www\./, '').toLowerCase();
        if (hostClean !== emailDomain && !hostClean.endsWith(`.${emailDomain}`) && !emailDomain.endsWith(`.${hostClean}`)) {
          checkedFacts.push(`Domain mismatch observed: recruiter email domain "${emailDomain}" differs from website host "${hostClean}".`);
        } else {
          checkedFacts.push(`Recruiter email domain "${emailDomain}" aligns syntactically with website host "${hostClean}".`);
        }
      }

      tasks.push(
        (async () => {
          try {
            const dnsAddrs = await Promise.race([
              dns.lookup(parsed.hostname),
              new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 1200)),
            ]);
            if (dnsAddrs?.address) {
              checkedFacts.push(`Public DNS A/AAAA resolution succeeded for "${parsed.hostname}".`);
            }
          } catch {
            checkedFacts.push(`Public DNS lookup failed or timed out for "${parsed.hostname}".`);
          }
        })()
      );
    }
  } else {
    unverifiedItems.push('No official website URL was supplied to check domain consistency.');
  }

  await Promise.all(tasks);

  if (company) {
    unverifiedItems.push(`Corporate legal registration and official HR employment of the sender at "${company}" were not independently verified.`);
  } else {
    unverifiedItems.push('Official company registration and HR directory listing could not be verified.');
  }

  return {
    checkedFacts,
    unverifiedItems,
    domainSignalsSummary: [...checkedFacts, ...unverifiedItems].join(' '),
  };
}
