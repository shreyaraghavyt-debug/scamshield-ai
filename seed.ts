import type { DatabaseSync } from 'node:sqlite';

interface SeedArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  read_time: string;
  summary: string;
  content: string[];
  example_scam: string;
  warning_signs: string[];
  prevention_tips: string[];
  quiz: {
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
  };
}

const ARTICLES: SeedArticle[] = [
  {
    id: 'art-1',
    slug: 'identify-fake-internship-offers',
    title: 'How to Identify Fake Internship Offers Before Applying',
    category: 'Internship Scams',
    read_time: '4 min read',
    summary: 'Learn how scammers target college students with guaranteed certificates, fake MNC affiliations, and hidden training charges.',
    content: [
      'College students seeking mandatory summer internships or final-year academic credits are primary targets for recruitment fraud. Scammers mimic popular tech companies and send mass messages promising remote internships with high stipends or guaranteed certificates.',
      'A genuine internship follows a structured evaluation: application review, technical or portfolio screening, and a formal interview with engineering or HR staff on a verifiable corporate email domain.',
      'Fraudulent internship portals frequently collect an initial "registration fee" or force students to purchase a "mandatory training kit" after declaring them "selected" within minutes of filling out a Google Form.'
    ],
    example_scam: 'Fictional Example: "Congratulations! You are shortlisted for our Remote Web Developer Internship (Stipend: Rs. 25,000/month). No interview required. Pay Rs. 999 portal registration fee via UPI within 3 hours to receive your offer letter."',
    warning_signs: [
      'Selection declared immediately without a technical or HR interview.',
      'Stipend is unusually high compared to standard entry-level internships.',
      'Requests for registration, portal, or certificate processing fees.',
      'Communication happens only through personal WhatsApp numbers or Gmail addresses.'
    ],
    prevention_tips: [
      'Verify the internship directly on the company’s official careers page.',
      'Ask your college placement cell before paying any third-party training partner.',
      'Never transfer money via personal UPI IDs to confirm an internship slot.'
    ],
    quiz: {
      question: 'An internship message says you are selected without an interview and asks for Rs. 750 for portal activation. What should you do?',
      options: [
        'Pay quickly so you do not miss the stipend',
        'Decline immediately and verify on the official company careers site',
        'Send your Aadhaar card instead of money to prove identity'
      ],
      correct_index: 1,
      explanation: 'Legitimate internships evaluate skills through interviews and never charge candidates to activate an offer or portal.'
    }
  },
  {
    id: 'art-2',
    slug: 'why-legitimate-employers-dont-charge-candidates',
    title: 'Why Legitimate Employers Do Not Charge Candidates for Recruitment',
    category: 'Payment Scams',
    read_time: '3 min read',
    summary: 'Understand the economics of real hiring and why requests for refundable deposits, onboarding fees, or kit charges signal fraud.',
    content: [
      'Real companies invest budget into recruiting talent. When an employer wants to hire you, they pay recruiters, job boards, and background-check vendors directly—candidates are never expected to subsidize hiring costs.',
      'Scammers invent plausible-sounding labels to lower your guard: "refundable security deposit", "laptop shipping insurance", "document verification fee", or "government compliance stamp duty".',
      'Even when a scammer promises the deposit will be refunded with your first salary, that first salary never arrives. Once a payment is sent via UPI or instant bank transfer, recovery is extremely difficult.'
    ],
    example_scam: 'Fictional Example: "Your work-from-home laptop is dispatched. Kindly pay Rs. 3,500 refundable courier insurance to our logistics partner account; it will be credited back in your first payroll."',
    warning_signs: [
      'Any upfront payment labeled as refundable deposit, security fee, or background check charge.',
      'Payment requested via personal UPI, QR code, or cryptocurrency.',
      'Pressure to pay before an offer letter can be released.'
    ],
    prevention_tips: [
      'Treat any recruitment-related payment demand as a critical warning sign.',
      'Remember that genuine employers deduct statutory items only through official payroll after joining.',
      'Report UPI handles used in job scams to your bank and cybercrime portals.'
    ],
    quiz: {
      question: 'A recruiter says a Rs. 2,000 security deposit is 100% refundable with your first month salary. Is this normal?',
      options: [
        'Yes, most remote companies charge refundable laptop deposits',
        'No, legitimate employers do not require advance deposits from candidates',
        'Yes, if they send a PDF receipt on WhatsApp'
      ],
      correct_index: 1,
      explanation: 'Promises of refunds in the first salary are a classic tactic used by advance-fee recruitment scammers.'
    }
  },
  {
    id: 'art-3',
    slug: 'how-registration-fee-scams-work',
    title: 'How Job Registration Fee Scams Operate Step by Step',
    category: 'Payment Scams',
    read_time: '4 min read',
    summary: 'See the exact psychological playbook scammers use—from fake shortlisting calls to escalating fee demands.',
    content: [
      'Registration fee scams often begin after you upload your resume on public job boards. Scammers scrape phone numbers and call candidates claiming to be from a known hiring agency or enterprise HR desk.',
      'Stage 1 builds excitement: they praise your resume and schedule a brief, easy phone call. Stage 2 creates urgency: you are told only two seats remain. Stage 3 introduces a small fee (Rs. 499 to Rs. 1,999) for "interview scheduling" or "assessment activation".',
      'If a victim pays once, scammers follow up with larger requests for "training clearance", "uniform charges", or "offer letter stamping" until the victim realizes the job does not exist.'
    ],
    example_scam: 'Fictional Example: "Dear Candidate, your profile is shortlisted for Airport Ground Staff. Pay Rs. 1,250 registration fee today to receive your gate pass and interview slot."',
    warning_signs: [
      'Unsolicited calls referencing resumes you posted months ago.',
      'Small initial fee followed by repeated secondary charges.',
      'Requests to keep the fee confidential from family or placement officers.'
    ],
    prevention_tips: [
      'Ask for the recruiter’s official corporate email and verify the domain independently.',
      'Never pay a fee to attend an interview or unlock a job application.',
      'Block and document numbers that escalate fee demands.'
    ],
    quiz: {
      question: 'What happens most often after a victim pays a small "interview registration fee"?',
      options: [
        'They are invited to an official campus interview',
        'Scammers demand additional larger fees for verification or onboarding',
        'The fee is automatically refunded within 24 hours'
      ],
      correct_index: 1,
      explanation: 'Scammers test compliance with a small fee first, then invent additional mandatory charges.'
    }
  },
  {
    id: 'art-4',
    slug: 'spot-fake-hr-emails',
    title: 'How to Identify Fake HR Emails and Lookalike Domains',
    category: 'Phishing & Spoofing',
    read_time: '4 min read',
    summary: 'Spot subtle domain typos, free webmail impersonation, and header clues in fraudulent recruiter emails.',
    content: [
      'Legitimate corporate recruiters write from their organization’s primary domain (for example, hr@company.com). Scammers either use free email providers (like @gmail.com or @outlook.com) while claiming to be a major firm, or register lookalike domains.',
      'Lookalike domains swap single characters—such as replacing "l" with "I", adding "-careers" or "-india-hr", or changing ".com" to ".co" or ".org".',
      'Always inspect the full sender address and reply-to field rather than trusting the display name alone, which anyone can set to "Infosys HR Team" or "Google Talent Acquisition".'
    ],
    example_scam: 'Fictional Example: Display name reads "Tata Consultancy HR Desk", but the actual address is hr.recruitment.tcsindia@gmail.com or careers@tcs-hiring-portal.xyz.',
    warning_signs: [
      'Display name shows a famous company while the domain is @gmail.com or @yahoo.com.',
      'Newly registered hyphenated domains like company-hr-desk.info.',
      'Reply-To address differs from the visible From address.'
    ],
    prevention_tips: [
      'Expand the sender header to inspect the exact domain after the @ symbol.',
      'Type the official company domain directly into your browser instead of clicking email links.',
      'Verify if the company lists an official recruitment fraud advisory page.'
    ],
    quiz: {
      question: 'An email displays "Wipro Talent Team" but comes from wipro.careers.hr@gmail.com. What does this indicate?',
      options: [
        'It is a genuine HR backup account',
        'High risk of impersonation because major companies do not hire from free Gmail accounts',
        'It is safe if the email signature includes a company logo'
      ],
      correct_index: 1,
      explanation: 'Anyone can paste a logo and set a display name; free webmail domains for enterprise HR are a major red flag.'
    }
  },
  {
    id: 'art-5',
    slug: 'recognize-fake-offer-letters',
    title: 'How to Recognize Fake Offer Letters and Employment PDFs',
    category: 'Document Fraud',
    read_time: '5 min read',
    summary: 'Examine formatting, compensation structure, signatory details, and legal clauses to spot forged offer letters.',
    content: [
      'Scammers routinely generate realistic-looking PDF offer letters by copying publicly available company logos and pasting generic legal paragraphs.',
      'Carefully review the details: genuine offer letters specify your exact reporting manager or department, detailed CTC/compensation breakup, probation terms, official office address, and an authentic HR signatory.',
      'Fake offer letters often contain stretched logos, inconsistent fonts, grammatical mistakes, missing tax/statutory breakdown, or a closing paragraph instructing you to pay a fee or click an unverified link to "accept" the document.'
    ],
    example_scam: 'Fictional Example: A 1-page PDF featuring a blurry multinational logo, promising Rs. 8.5 LPA for an entry-level data entry role, signed only as "Authorized HR Signatory" with no employee ID or corporate landline.',
    warning_signs: [
      'Offer letter arrives without prior multi-round interviews.',
      'Generic signatory ("HR Department") with no verifiable full name or title.',
      'Pixelated logos, mixed fonts, and vague job responsibilities.',
      'Document instructs you to deposit money to validate your acceptance.'
    ],
    prevention_tips: [
      'Cross-check the offer reference number with the company’s official candidate portal.',
      'Verify the office address and official HR contact independently.',
      'Upload suspicious offer letters to ScamShield AI before signing or sharing ID proofs.'
    ],
    quiz: {
      question: 'Which detail is commonly missing or suspicious in a fake PDF offer letter?',
      options: [
        'Prior interview confirmation and verifiable HR contact details',
        'A company logo at the top of the page',
        'A PDF file extension'
      ],
      correct_index: 0,
      explanation: 'Logos and PDF formatting are easy to copy, but scammers rarely survive scrutiny on interview history and official HR verification.'
    }
  },
  {
    id: 'art-6',
    slug: 'company-impersonation-tactics',
    title: 'How Scammers Impersonate Famous Companies',
    category: 'Brand Impersonation',
    read_time: '4 min read',
    summary: 'Learn how fraudsters clone career portals, spoof brand names, and exploit candidate trust in well-known employers.',
    content: [
      'Top IT firms, banks, e-commerce brands, and startups are frequently impersonated because job seekers naturally trust familiar names and hesitate to question them.',
      'Scammers clone career pages on lookalike URLs, run sponsored social media ads, and copy real employee photos onto fake LinkedIn profiles to appear credible.',
      'Many major employers publish official "Recruitment Fraud Alerts" explicitly stating that they never ask for money at any stage of hiring.'
    ],
    example_scam: 'Fictional Example: A clone website at amazon-india-careers-apply.com asks applicants to upload PAN, Aadhaar, and pay Rs. 1,499 for a "warehouse supervisor badge".',
    warning_signs: [
      'URL uses extra words or unusual top-level domains (.top, .xyz, .click).',
      'Website lacks HTTPS or has broken Privacy/Terms links.',
      'No matching job requisition ID on the brand’s official careers portal.'
    ],
    prevention_tips: [
      'Always navigate to the company’s official website via a clean search.',
      'Check if the job title and requisition ID appear on the official careers portal.',
      'Never upload identity documents on third-party lookalike forms.'
    ],
    quiz: {
      question: 'How can you confirm whether a job posting claiming to be from a major tech company is real?',
      options: [
        'Trust the ad if it uses the company’s official colors',
        'Check the company’s verified official careers website directly',
        'Ask the WhatsApp recruiter if they are genuine'
      ],
      correct_index: 1,
      explanation: 'Only the official corporate careers site or verified corporate domain can confirm a real opening.'
    }
  },
  {
    id: 'art-7',
    slug: 'suspicious-linkedin-recruiters',
    title: 'How to Identify Suspicious LinkedIn and Social Recruiters',
    category: 'Recruiter Verification',
    read_time: '4 min read',
    summary: 'Evaluate recruiter profiles, mutual connections, and off-platform chat requests before sharing your resume or phone number.',
    content: [
      'While LinkedIn is widely used by real talent teams, fake recruiter accounts also operate on professional networks. They target fresh graduates with enticing direct messages.',
      'Inspect the recruiter’s profile thoroughly: check how long the account has existed, whether they have authentic endorsements, past work history, posts, and a verifiable company email.',
      'A classic red flag is immediately pushing the conversation off LinkedIn onto Telegram or WhatsApp with vague "task-based income" or "pay-per-review" schemes.'
    ],
    example_scam: 'Fictional Example: A 2-week-old profile with 12 connections messages: "We are hiring Remote Analysts at Rs. 4,000/day. Message our manager on Telegram @hr_desk_official immediately."',
    warning_signs: [
      'Brand-new profile with few connections and stock headshot imagery.',
      'Immediate request to move to Telegram or unofficial WhatsApp groups.',
      'Vague role descriptions promising daily payouts for liking posts or rating apps.'
    ],
    prevention_tips: [
      'Check whether the recruiter is listed under the company’s official People tab.',
      'Keep initial screening communication on official corporate email or recognized platforms.',
      'Be wary of "task-based" Telegram jobs that ask you to deposit money to unlock higher commissions.'
    ],
    quiz: {
      question: 'A recruiter on LinkedIn asks you to message a manager on Telegram for a "daily payout task job". What is the likely risk?',
      options: [
        'High risk of a task/prepaid recruitment scam',
        'Standard fast-track hiring for freshers',
        'A harmless LinkedIn technical glitch'
      ],
      correct_index: 0,
      explanation: 'Moving candidates immediately to Telegram for daily-payout task roles is a hallmark of prepaid task scams.'
    }
  },
  {
    id: 'art-8',
    slug: 'protect-aadhaar-pan-information',
    title: 'How to Protect Your Aadhaar, PAN, and Banking Information',
    category: 'Identity & Privacy',
    read_time: '4 min read',
    summary: 'Know when employers legitimately request KYC documents and how to avoid identity theft and unauthorized loan fraud.',
    content: [
      'Identity documents like Aadhaar, PAN, passport, and bank passbooks are sensitive financial credentials. Scammers collect them under the guise of "pre-interview KYC" to open fraudulent accounts, take out digital loans, or impersonate you.',
      'During the application and interview stage, employers only need your resume, portfolio, and contact email/phone. Full KYC and bank details are collected ONLY after a verified offer is accepted and during formal onboarding.',
      'Never share OTPs, ATM PINs, CVV numbers, UPI PINs, or net-banking passwords with any recruiter under any circumstance.'
    ],
    example_scam: 'Fictional Example: "Before scheduling your interview, send clear front-and-back photos of your Aadhaar, PAN, and share the 6-digit OTP sent to your phone for e-KYC verification."',
    warning_signs: [
      'Request for Aadhaar/PAN photos prior to any formal interview or verified offer.',
      'Asking for bank account login, card details, or live OTP verification.',
      'Collecting documents over unsecured personal WhatsApp chats.'
    ],
    prevention_tips: [
      'Share Masked Aadhaar (hiding the first 8 digits) only when legally required after joining.',
      'Never share any OTP—no real HR process uses your banking or Aadhaar OTP over chat.',
      'Watermark document copies with the purpose and date when submitting to verified employers.'
    ],
    quiz: {
      question: 'When is it appropriate for an employer to request your PAN and bank details for payroll?',
      options: [
        'Before your first screening call',
        'Only after you have verified and accepted a formal job offer during onboarding',
        'Over WhatsApp along with an OTP'
      ],
      correct_index: 1,
      explanation: 'Payroll and tax KYC documents belong strictly to post-offer formal onboarding, never pre-interview chat messages.'
    }
  },
  {
    id: 'art-9',
    slug: 'common-whatsapp-job-scams-india',
    title: 'Common WhatsApp and Telegram Job Scams in India',
    category: 'Regional Trends',
    read_time: '5 min read',
    summary: 'Recognize part-time work-from-home, data-entry, hotel-rating, and prepaid task scams circulating on messaging apps.',
    content: [
      'Across India, millions of students and job seekers receive unsolicited WhatsApp messages offering part-time income of Rs. 2,000 to Rs. 8,000 per day from home using just a smartphone.',
      'Common variants include "YouTube video liking tasks", "Google Maps review tasks", and "form-filling / data entry contracts". In data-entry scams, victims are given massive typing targets with hidden errors and then threatened with legal notices unless they pay a "penalty fee".',
      'In prepaid task scams, victims receive small initial payouts (Rs. 150–Rs. 300) to build trust, before being added to VIP groups requiring Rs. 5,000 to Rs. 50,000 "merchant deposits" that get frozen.'
    ],
    example_scam: 'Fictional Example: "Hello! Part-time job from home. Earn Rs. 3,000 daily by rating hotels on your phone. Click wa.me link to join our HR Telegram channel."',
    warning_signs: [
      'Unsolicited WhatsApp messages from international numbers (+1, +44, +62, etc.) offering Indian part-time jobs.',
      'Promising high daily earnings for trivial tasks like liking videos or typing pages.',
      'Threatening legal action if you fail to complete an impossible data-entry quota.'
    ],
    prevention_tips: [
      'Do not engage with unsolicited part-time job offers on WhatsApp or Telegram.',
      'Ignore fake "legal notice" threats sent by data-entry scam operators—report them instead.',
      'Verify any company offering remote work via official corporate registries and careers pages.'
    ],
    quiz: {
      question: 'Why do Telegram task scammers sometimes pay Rs. 150–Rs. 300 for the very first task?',
      options: [
        'Because the business model is genuinely profitable',
        'To build false trust before convincing victims to deposit larger sums in "VIP tasks"',
        'Because it is a government-mandated trial wage'
      ],
      correct_index: 1,
      explanation: 'Initial micro-payouts are bait designed to overcome skepticism before the big financial trap.'
    }
  },
  {
    id: 'art-10',
    slug: 'what-to-do-if-you-already-paid-a-scammer',
    title: 'What to Do Immediately If You Already Paid or Shared Data with a Scammer',
    category: 'Incident Response',
    read_time: '5 min read',
    summary: 'Follow a clear, calm step-by-step recovery checklist to freeze accounts, report cybercrime, and protect your identity.',
    content: [
      'If you realized too late that a job offer was fraudulent, acting quickly makes a critical difference. Do not panic or feel embarrassed—recruitment fraud uses sophisticated social engineering.',
      'First, stop all communication and do not pay any further "unlock" or "refund processing" fees. Scammers often pose as recovery agents to extract a second payment.',
      'Second, preserve every screenshot, UPI transaction ID, bank reference number, email header, and phone number. Report financial fraud immediately to your bank’s fraud desk and national cybercrime reporting channels (such as India’s National Cyber Crime Reporting Portal at cybercrime.gov.in or helpline 1930).'
    ],
    example_scam: 'Fictional Example: After paying Rs. 2,500 for an offer letter, the scammer demands Rs. 4,000 more saying "your refund is stuck in RBI verification".',
    warning_signs: [
      'Anyone claiming they can recover lost money for an upfront fee.',
      'Requests for remote-access apps (AnyDesk, TeamViewer) to "process your refund".'
    ],
    prevention_tips: [
      'Contact your bank immediately to dispute the transaction or freeze compromised cards.',
      'File an official cybercrime complaint with transaction UTR numbers and screenshots.',
      'Monitor your credit report if you shared PAN or Aadhaar details, and change reused passwords.'
    ],
    quiz: {
      question: 'What is the most important first action if you transferred money via UPI to a fake recruiter?',
      options: [
        'Pay a second fee to unlock the refund',
        'Stop paying, save all evidence/UTR IDs, alert your bank, and file a cybercrime report immediately',
        'Delete the WhatsApp chat so they cannot contact you'
      ],
      correct_index: 1,
      explanation: 'Preserving evidence and alerting your bank and cybercrime authorities immediately gives you the best chance of freezing funds.'
    }
  }
];

export function seedAwarenessArticles(db: DatabaseSync): void {
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM awareness_articles').get() as { cnt: number };
  if (countRow && countRow.cnt >= ARTICLES.length) {
    return;
  }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO awareness_articles (
      id, slug, title, category, read_time, summary, content, example_scam, warning_signs, prevention_tips, quiz, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  for (const art of ARTICLES) {
    insert.run(
      art.id,
      art.slug,
      art.title,
      art.category,
      art.read_time,
      art.summary,
      JSON.stringify(art.content),
      art.example_scam,
      JSON.stringify(art.warning_signs),
      JSON.stringify(art.prevention_tips),
      JSON.stringify(art.quiz),
      now
    );
  }
}
