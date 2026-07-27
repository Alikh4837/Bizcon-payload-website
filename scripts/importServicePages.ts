/**
 * importServicePages.ts
 *
 * One-off bulk importer: creates the 13 service pages (8 main services + 5
 * sub-services) as `pages` documents, using real copy migrated from the old
 * WordPress site (bizconglobal.com). Each page gets:
 *   - hero (type: lowImpact) with an H1 + short intro paragraph
 *   - one or more Content blocks with H2 sections + bullet lists (the real
 *     migrated body copy)
 *   - a ContactBlock at the end (reuses your existing contact form block —
 *     no new component needed)
 *
 * WHAT THIS DOES NOT DO
 *   - It does NOT populate ServicesStatsHeroBlock or ServicesFaqBlock. Those
 *     blocks require stats/ratings/FAQ content that doesn't exist on the
 *     source WordPress pages — adding them here would mean inventing facts
 *     about the business. Add those manually in /admin if you want them.
 *   - It does NOT download hero images from WordPress. The source images are
 *     low-res marketing banners (1024x200 text banners, not real photos) —
 *     not worth importing. Leave heroImage empty and add real photos later,
 *     or tell me and I'll add image download like the blog importer did.
 *
 * HOW TO RUN
 *   1. Drop this file in your project, e.g. at `src/scripts/importServicePages.ts`
 *   2. Make sure your .env / .env.local DATABASE_URL points at the database
 *      you actually want these pages to land in (production, presumably).
 *   3. Run: npx tsx src/scripts/importServicePages.ts
 *   4. Safe to re-run — skips any page whose slug already exists.
 */

import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

// ---------------------------------------------------------------------------
// Lexical helpers
// ---------------------------------------------------------------------------

type LexicalTextNode = {
  type: 'text'
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  version: number
}

const BOLD = 1

function textNodesFromMarkdown(md: string): LexicalTextNode[] {
  const nodes: LexicalTextNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  const push = (text: string, format: number) => {
    if (!text) return
    nodes.push({ type: 'text', detail: 0, format, mode: 'normal', style: '', text, version: 1 })
  }

  while ((match = regex.exec(md)) !== null) {
    if (match.index > lastIndex) push(md.slice(lastIndex, match.index), 0)
    push(match[1], BOLD)
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < md.length) push(md.slice(lastIndex), 0)
  if (nodes.length === 0) push(md, 0)
  return nodes
}

function paragraph(md: string) {
  return {
    type: 'paragraph',
    children: textNodesFromMarkdown(md),
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

function heading(tag: 'h1' | 'h2' | 'h3', md: string) {
  return {
    type: 'heading',
    tag,
    children: textNodesFromMarkdown(md),
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

function bulletList(items: string[]) {
  return {
    type: 'list',
    listType: 'bullet',
    start: 1,
    tag: 'ul',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: items.map((md, i) => ({
      type: 'listitem',
      value: i + 1,
      children: textNodesFromMarkdown(md),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    })),
  }
}

function richTextDoc(children: any[]) {
  return {
    root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 },
  }
}

// ---------------------------------------------------------------------------
// Source data — real copy migrated from bizconglobal.com service pages
// ---------------------------------------------------------------------------

type Section = { heading: string; intro?: string; bullets?: string[] }

type SourcePage = {
  title: string
  slug: string
  heroHeading: string
  heroIntro: string
  metaDescription: string
  sections: Section[]
  closing?: string
}

const pages: SourcePage[] = [
  {
    title: 'Accounting Services',
    slug: 'accounting-services',
    heroHeading: "Numbers Got You Stressed? Unleash the Power of BizCon Global's Accounting Magic!",
    heroIntro:
      'Welcome to BizCon Global, your trusted partner in accountancy consulting services. With expertise in both cost accounting and financial accounting, we offer comprehensive solutions tailored to meet your business needs and objectives.',
    metaDescription:
      "Numbers Got You Stressed? Unleash the Power of BizCon Global's Accounting Magic! Comprehensive cost accounting and financial accounting services.",
    sections: [
      {
        heading: 'Cost Accounting Services',
        intro:
          'At BizCon Global, we understand the critical role cost accounting plays in driving business success. Our team specializes in various facets of cost accounting, including:',
        bullets: [
          '**Activity-Based Costing:** We analyze your business activities to accurately allocate costs and improve cost management.',
          '**Environmental Accounting:** We help businesses track and manage environmental costs to promote sustainability and compliance.',
          '**Project Accounting:** Our experts assist in tracking project costs, ensuring accurate budgeting and profitability analysis.',
          '**Resource Consumption Accounting:** We identify and allocate costs based on resource consumption, optimizing resource utilization.',
          '**Standard Cost Accounting:** We establish standard costs for products or services, enabling better cost control and variance analysis.',
          '**Target Costing:** We help set target costs for products or services to meet customer expectations while ensuring profitability.',
          '**Throughput Accounting:** Our solutions focus on maximizing throughput and improving operational efficiency.',
          '**Life Cycle Costing:** We analyze costs throughout the product life cycle, from inception to disposal, to support strategic decision-making.',
        ],
      },
      {
        heading: 'Financial Accounting Services',
        intro:
          'BizCon Global offers a range of financial accounting services designed to streamline your financial processes and ensure compliance. Our services include:',
        bullets: [
          '**Bookkeeping:** Our qualified professionals provide accurate and timely bookkeeping services, maintaining your financial records with precision.',
          '**Reconciliations:** We conduct thorough reconciliations to ensure the accuracy and integrity of your financial data.',
          '**Preparation of Accounts:** Our team prepares comprehensive accounts, including income statements, balance sheets, and cash flow statements.',
          '**Payroll Management:** We manage all aspects of payroll processing, ensuring compliance with regulations.',
          '**Inventory Management:** Our solutions help optimize inventory levels, reduce carrying costs, and improve inventory turnover.',
          '**Fixed Asset Register:** We maintain a detailed register of your fixed assets, facilitating asset tracking and depreciation calculation.',
          '**Financial Statements:** We prepare accurate and compliant financial statements for stakeholders.',
          '**Stock Taking:** Our experts conduct regular stock-taking exercises to ensure inventory accuracy.',
        ],
      },
      {
        heading: 'Ready to Ditch the Financial Anxiety?',
        bullets: [
          "**Say Goodbye to Data Mountains:** Our bookkeeping ninjas will meticulously handle all your day-to-day transactions, freeing you up to focus on what matters most – growing your business.",
          '**Unlock the Secrets of Your Finances:** We analyze your financial landscape and help you make data-driven decisions that maximize profitability.',
          '**Compliance with Confidence:** We stay current on ever-changing regulations, keeping your business compliant.',
          '**Strategic Planning Made Simple:** We create customized financial reports and forecasts, giving you the insights you need for the future.',
        ],
      },
    ],
    closing:
      "BizCon Global is more than just an accounting firm – we're your trusted financial partner, working collaboratively with you to achieve your business goals.",
  },
  {
    title: 'Taxation Services',
    slug: 'taxation-services',
    heroHeading: 'Taxed Out? BizCon Global: Your Stress-Busting Tax Partner',
    heroIntro:
      "Feeling overwhelmed by tax season and complex regulations? Don't let taxes hinder your business growth! BizCon Global offers comprehensive Taxation Services in Pakistan, empowering you to navigate the complexities with confidence.",
    metaDescription:
      'BizCon Global offers comprehensive Taxation Services, empowering you to navigate tax complexities with confidence.',
    sections: [
      {
        heading: 'Tax Savvy, Business Savvy: Plan for Profitability',
        bullets: [
          '**Minimize Your Tax Burden:** Our tax planning and structuring experts help you identify legal strategies to minimize your tax liabilities and maximize profitability.',
          '**Proactive Tax Advice:** We provide personalized tax advice tailored to your specific industry and business activities.',
          '**Stay Ahead of the Curve:** Our team possesses a deep understanding of federal and provincial tax laws, keeping you informed about changes.',
        ],
      },
      {
        heading: 'Compliance & Reporting Simplified',
        bullets: [
          '**Efficient Filing & Reporting:** We streamline your tax compliance with efficient filing and reporting services, including accurate computations and timely return preparation.',
          '**Free Yourself from Administrative Burdens:** Eliminate the time and stress of managing tax complexities.',
          '**Proactive & Responsive Approach:** We believe in open communication and proactive guidance.',
        ],
      },
      {
        heading: 'Why Choose BizCon Global for Your Taxation Services?',
        bullets: [
          '**One-Stop Solution:** Consolidate your tax needs under one roof.',
          '**Proven Track Record:** Our highly qualified and experienced tax professionals deliver successful outcomes for businesses of all sizes.',
          '**Client-Centric Approach:** We tailor our services to your specific needs and industry.',
        ],
      },
    ],
    closing:
      "Ready to unlock your business potential with strategic tax planning and streamlined compliance? Contact BizCon Global today and schedule a consultation with our tax experts.",
  },
  {
    title: 'ERP and IT Services',
    slug: 'erp-and-it-services',
    heroHeading: 'BizCon Global: Your One-Stop Shop for Business Technology Solutions',
    heroIntro:
      'Feeling overwhelmed by the ever-evolving tech landscape? BizCon Global is your trusted partner, here to navigate the complexities of IT systems and empower your business to thrive.',
    metaDescription:
      'BizCon Global: Your One-Stop Shop for Business Technology Solutions — BI & data analytics, accounting software, ERP implementation.',
    sections: [
      {
        heading: "Here's How We Can Help",
        bullets: [
          '**Business Intelligence (BI) & Data Analytics:** Transform raw data into actionable insights with our BI expertise, implementing tools like SAP, Xero, and QuickBooks.',
          '**Accounting Software Implementation:** We help you select the best accounting software for your needs and ensure seamless implementation.',
          '**ERP Implementation & Review:** We guide you through the entire implementation process, ensuring smooth integration and maximizing your ERP investment.',
          '**Data Modeling & Review:** We design and review your data models, ensuring accurate data capture, storage, and analysis.',
        ],
      },
      {
        heading: 'Beyond the Basics',
        bullets: [
          '**Macroeconomic Research:** Gain a competitive edge with our in-depth research into capital markets and macroeconomic trends.',
          '**Research Services for Institutional Investors:** Tailored research solutions with comprehensive analysis and data-driven recommendations.',
          "**Custom MS Excel Solutions:** Need a specific solution but don't require a full-fledged software implementation? We build powerful custom Excel solutions.",
        ],
      },
      {
        heading: 'Why Choose BizCon Global?',
        bullets: [
          '**One-Stop Shop:** A comprehensive range of System Advisory services under one roof.',
          '**Unparalleled Expertise:** In-depth knowledge of the latest technologies and industry best practices.',
          '**Technology Agnostic:** We recommend the best solutions based on your unique requirements, not specific vendors.',
          '**Cost-Effective Solutions:** Flexible engagement models and competitive rates.',
        ],
      },
    ],
    closing:
      'Ready to unlock the power of technology and transform your business? Contact BizCon Global today and schedule a consultation with our IT specialists.',
  },
  {
    title: 'Startup Incubation Services',
    slug: 'startup-incubation-services',
    heroHeading: 'Launch into Success: BizCon Consultants - Your Startup Incubation Powerhouse',
    heroIntro:
      "Do you have a brilliant business idea brimming with potential? At BizCon Consultants, we're your expert guides, equipping you with the resources, mentorship, and support you need to transform your vision into a thriving reality.",
    metaDescription:
      'BizCon Consultants - Your Startup Incubation Powerhouse. Mentorship, networking, business model development, and funding support.',
    sections: [
      {
        heading: 'What We Offer',
        bullets: [
          '**Expert Mentorship:** Access a diverse pool of seasoned entrepreneurs providing tailored guidance from ideation to scaling.',
          '**Networking & Relationship Building:** Immerse yourself in a vibrant ecosystem of like-minded, ambitious founders.',
          "**Business Model Development:** We work closely with you to analyze market trends and craft a comprehensive growth strategy.",
          '**Funding & Investor Relations:** From pitch decks to term sheets, we provide hands-on support at every stage of the investment lifecycle.',
          '**Accounting and Finance Guidelines:** Workshops covering budgeting, cash flow forecasting, and financial reporting for early-stage ventures.',
          '**Tax and Legal Guidelines:** Expert guidance on regulatory compliance, IP protection, and contractual agreements.',
        ],
      },
      {
        heading: 'Why Choose BizCon Consultants for Startup Incubation?',
        bullets: [
          '**Proven Track Record:** A history of nurturing successful startups across diverse industries.',
          '**Tailored Support:** No two startups are identical — we tailor the program to your specific needs and goals.',
          '**Focus on Growth:** Our program equips you with the tools and resources to achieve sustainable growth.',
          '**Network of Resources:** We connect you with investors, mentors, and service providers.',
          '**Cost-Effective Solutions:** An affordable launchpad for your startup journey.',
        ],
      },
    ],
  },
  {
    title: 'Remote Monitoring Services',
    slug: 'remote-monitoring-services',
    heroHeading: 'Remote Monitoring Services: Empowering Businesses Worldwide',
    heroIntro:
      'In an increasingly interconnected world, businesses need reliable solutions to monitor and manage their operations efficiently, regardless of industry or location. BizCon Global offers comprehensive Remote Monitoring Services tailored to businesses across the globe.',
    metaDescription:
      "BizCon Global's Remote Monitoring Services cover marketing, accounting, finance, and internal audit functions worldwide.",
    sections: [
      {
        heading: 'Our Remote Monitoring Capabilities Include',
        bullets: [
          '**CEO Services:** Track executive-level functions including strategic planning and stakeholder management.',
          '**CFO Services:** Monitor financial performance metrics, budgeting, cash flow, and reporting processes.',
          '**Chief Accountant Services:** Oversee accounting operations and compliance with accounting standards.',
          '**Internal Auditor Services:** Monitor audit processes, risk assessment, and compliance audits.',
          '**Marketing Monitoring:** Track marketing campaign performance and customer engagement metrics.',
          '**Accounting Oversight:** Monitor financial transactions and ensure compliance with accounting regulations.',
        ],
      },
      {
        heading: 'Why Partner with BizCon Global for Remote Monitoring Services?',
        bullets: [
          '**Customized Solutions:** Remote monitoring tailored to the specific needs of each client.',
          '**Comprehensive Coverage:** Beyond legal and accountancy — marketing, finance, and internal audit too.',
          '**Global Reach:** Serving clients across industries and continents.',
          '**Expertise:** A team with diverse backgrounds in legal, accountancy, and finance.',
          '**Flexibility:** Services that scale up or down as your needs change.',
        ],
      },
    ],
    closing:
      "Take control of your business operations with BizCon Global's Remote Monitoring Services. Contact us today to learn more.",
  },
  {
    title: 'Legal Advisory Services',
    slug: 'legal-advisory-services',
    heroHeading: 'BizCon Global: Your Trusted Partner for Navigating Legal Complexities',
    heroIntro:
      "At BizCon Global, we understand that legal matters can be intricate and daunting. Whether you're facing a complex merger, a contract dispute, or a customer-vendor conflict, our team of experienced legal professionals is here to help.",
    metaDescription:
      'BizCon Global: Your Trusted Partner for Navigating Legal Complexities — M&A support, contract drafting, and dispute resolution.',
    sections: [
      {
        heading: 'Mergers and Acquisitions (M&A) Support',
        bullets: [
          '**Due Diligence:** A thorough assessment of the target company to identify risks and opportunities.',
          '**Negotiation and Structuring:** Skillful negotiation of terms favorable to your business objectives.',
          '**Regulatory Compliance:** Ensuring all regulatory requirements are met throughout the M&A process.',
          '**Post-Merger Integration:** Facilitating a smooth integration to maximize the value of your transaction.',
        ],
      },
      {
        heading: 'Contract and Agreement Formulation',
        bullets: [
          '**Sales and Purchase Agreements:** Clear terms for the sale or purchase of goods and services.',
          '**Non-Disclosure Agreements (NDAs):** Safeguarding your confidential information.',
          '**Employment Contracts:** Legally sound agreements with your employees.',
          '**Joint Venture Agreements:** Defining the rights and responsibilities of all parties involved.',
        ],
      },
      {
        heading: 'Why Choose BizCon Global?',
        bullets: [
          '**Experience and Expertise:** Extensive experience handling a wide range of legal issues.',
          '**Client-Centric Approach:** Understanding your unique needs to craft tailored solutions.',
          '**Strategic and Proactive:** We help you anticipate and mitigate risks, not just react to problems.',
          '**Cost-Effective Solutions:** Competitive rates and transparent fee structures.',
        ],
      },
    ],
    closing:
      "Don't navigate legal complexities alone. Contact BizCon Global today and schedule a consultation with our legal specialists.",
  },
  {
    title: 'HRM Services',
    slug: 'hrm-services',
    heroHeading: "BizCon Global: Empowering Your Business Through Strategic Human Resource Management",
    heroIntro:
      "In today's competitive business landscape, your people are your greatest asset. BizCon Global's HRM services offer a comprehensive suite of solutions designed to optimize your workforce and unlock your organization's full potential.",
    metaDescription:
      "BizCon Global's HRM services: compensation and benefits, employee relations, and employee engagement.",
    sections: [
      {
        heading: 'Why HRM Matters',
        bullets: [
          '**Enhanced Productivity and Performance:** Effective HRM leads to a more skilled, motivated, and engaged workforce.',
          '**Reduced Costs:** Streamlined recruitment, minimized turnover, and proactive conflict resolution save on costs.',
          '**Improved Employer Branding:** A strong employer brand attracts top talent and improves retention.',
        ],
      },
      {
        heading: 'Our Services',
        bullets: [
          '**Compensation and Benefits:** Competitive packages including salary administration, bonus structures, and health insurance plans.',
          '**Employee Relations:** Conflict resolution, grievance procedures, and compliance with labor laws.',
          '**Employee Engagement:** Recognition programs, team-building activities, and open communication channels.',
        ],
      },
    ],
  },
  {
    title: 'Audit and Assurance Services',
    slug: 'audit-and-assurance-services',
    heroHeading: 'Need Audit or Advisory Services? Get Expert Assurance & Support at BizCon Global.',
    heroIntro:
      'At BizCon Global, we specialize in providing comprehensive Internal Audit services designed to enhance organizational performance, mitigate risks, and promote operational excellence.',
    metaDescription:
      'BizCon Global provides Internal Audit, risk assessment, compliance, and fraud detection services.',
    sections: [
      {
        heading: 'Our Internal Audit Services',
        bullets: [
          '**Risk Assessment and Management:** Thorough assessments to identify and evaluate risks across your organization.',
          '**Internal Control Evaluation:** Evaluating the effectiveness of your internal controls with actionable recommendations.',
          '**Financial Audit Excellence:** Meticulous examination of financial statements and accounting records.',
          '**Compliance Assurance:** Verifying adherence to applicable laws, regulations, and contractual obligations.',
          '**Operational Efficiency Enhancement:** Optimizing efficiency and developing Standard Operating Procedures.',
          '**Fraud Detection and Prevention:** Fraud risk assessments and investigation of allegations of fraud.',
        ],
      },
      {
        heading: 'Why Choose BizCon Global?',
        bullets: [
          '**Experienced Professionals:** Chartered Accountants from ICAP and ICAEW.',
          '**Personalized Approach:** We take the time to understand your business and its specific needs.',
          '**Quality and Efficiency:** High-quality services delivered efficiently and cost-effectively.',
          '**Industry Expertise:** Extensive experience across a variety of industries.',
        ],
      },
    ],
    closing:
      'Ready to take your business to the next level? Contact BizCon Global today to discuss how our assurance services can help.',
  },
  {
    title: 'IFRS Services',
    slug: 'ifrs-services',
    heroHeading: 'Confused by IFRS? We are here for you!',
    heroIntro:
      'Feeling lost in the International Financial Reporting Standards (IFRS)? At BizCon Global, we help businesses navigate the ever-changing world of IFRS with clarity and precision.',
    metaDescription:
      'BizCon Global helps businesses navigate IFRS implementation, updates, and technical accounting support.',
    sections: [
      {
        heading: 'We Offer You Our Services',
        bullets: [
          '**IFRS Implementation:** Guiding you through the entire IFRS adoption process, minimizing disruption to your operations.',
          '**IFRS Updates and Monitoring:** Continuous monitoring of the latest IFRS updates and interpretations.',
          '**IFRS Interpretations and Expert Opinions:** Clear interpretations from our in-house IFRS specialists.',
          '**Customized IFRS Advisory:** Tailored advisory services for your specific industry, size, and reporting needs.',
          '**Technical Accounting Support:** Comprehensive support on intricate accounting issues from IFRS implementation.',
        ],
      },
      {
        heading: 'Benefits of Partnering with BizCon Global',
        bullets: [
          '**Enhanced Transparency and Credibility:** Gain trust from investors and stakeholders worldwide.',
          '**Improved Decision-Making:** Leverage accurate, comparable financial data for strategic decisions.',
          '**Reduced Risk of Non-Compliance:** Avoid costly penalties and reputational damage.',
          '**Increased Efficiency:** Streamlined financial reporting processes.',
        ],
      },
    ],
    closing:
      'Ready to unlock the power of IFRS with BizCon? Contact BizCon Global and schedule a free consultation with our IFRS experts.',
  },
  {
    title: 'Financial Modeling Services',
    slug: 'financial-modeling-services',
    heroHeading: 'Need a Financial Model? We Build the Best. Get Your Quote Today!',
    heroIntro:
      "In today's dynamic business landscape, making informed financial decisions is crucial for success. BizCon Global empowers you with a comprehensive suite of financial modeling services designed to provide clarity and confidence.",
    metaDescription:
      'BizCon Global builds business valuation, investment analysis, and financial forecasting models.',
    sections: [
      {
        heading: 'Our Tailored Financial Modeling Solutions',
        bullets: [
          '**Business Valuation Modeling:** Meticulous business valuation models considering market trends, financial performance, and growth potential.',
          '**Investment Analysis Modeling:** Robust models assessing risk, ROI, and projected cash flow.',
          "**Financial Projections:** A data-driven roadmap of your company's potential growth trajectory.",
          '**Budgeting and Forecasting Models:** User-friendly models to track income, expenses, and cash flow.',
          '**Financial Feasibility Studies:** In-depth analysis of the potential financial viability of your project.',
        ],
      },
    ],
    closing:
      'Partner with BizCon Global today and unlock the power of financial clarity for your business success! Book your consultation now.',
  },
  {
    title: 'Cost Accounting Services',
    slug: 'cost-accounting-services',
    heroHeading: 'BizCon Global: Unveiling the Power of Cost Efficiency – Your Guide to Strategic Cost Accounting',
    heroIntro:
      'Feeling lost in a sea of numbers? BizCon Global can be your lighthouse! We unlock the true potential of cost accounting, empowering you to make data-driven decisions that optimize your business and drive profitability.',
    metaDescription:
      'BizCon Global offers cost analysis, cost control strategies, activity-based costing, and project accounting.',
    sections: [
      {
        heading: 'How Can BizCon Global Help?',
        bullets: [
          '**Cost Analysis & Reporting:** Clear and concise reports that translate complex numbers into actionable insights.',
          '**Cost Control Strategies:** Effective strategies to optimize resource utilization, minimize waste, and maximize profits.',
          '**Activity-Based Costing (ABC):** Understand the true cost of your products and services for better pricing decisions.',
          '**Project Accounting:** Efficient cost tracking systems for each project, keeping you on budget.',
          '**Standard Costing & Target Costing:** Systems that compare actual costs to predetermined standards.',
        ],
      },
      {
        heading: 'Why Choose BizCon Global?',
        bullets: [
          '**Experienced Team:** Qualified chartered accountants from ICAP and ICAEW.',
          '**Customized Solutions:** Tailored to your specific needs and industry best practices.',
          '**Clear Communication:** Complex data translated into actionable, easy-to-understand insights.',
          '**Technology Integration:** State-of-the-art technology to streamline cost accounting processes.',
        ],
      },
    ],
    closing:
      "Ready to unlock the power of cost accounting and transform your business performance? Contact BizCon Global today for a free consultation.",
  },
  {
    title: 'Bookkeeping and Allied Services',
    slug: 'bookkeeping-and-allied-services',
    heroHeading: 'Bookkeeping Headaches? Get Expert Hassle-Free Services Here.',
    heroIntro:
      'Feeling overwhelmed by spreadsheets and financial complexities? At BizCon Global, we take your bookkeeping headaches so that you can focus on business expansion and development.',
    metaDescription:
      'BizCon Global offers bookkeeping, accounts preparation, cash flow management, and payroll services using ERP software like SAP, Xero, and QuickBooks.',
    sections: [
      {
        heading: 'Our Financial Accounting Services',
        bullets: [
          '**Effortless Bookkeeping:** Meticulously recording all your financial transactions with accurate, up-to-date records.',
          '**Accounts Preparation:** Accounts payable/receivable management, bank reconciliations, and general ledger maintenance.',
          '**Cash Flow Management:** Forecasting future needs and managing receivables and payables efficiently.',
          '**Reconciliations:** Reconciling bank statements, credit cards, and other accounts with confidence.',
          '**Streamlined Payroll Management:** Timely and accurate payroll processing adhering to tax regulations.',
          '**Inventory Management with Clarity:** Real-time insights into inventory levels for informed purchasing decisions.',
          '**Fixed Asset Management:** A detailed fixed asset register for depreciation calculations and asset tracking.',
          '**Chart of Accounts:** A clearly defined, industry-specific Chart of Accounts for strong financial management.',
          '**Preparation of Financial Statements:** Accurate, timely financial statements with insightful reports.',
          '**Expert & Customized Accounting Advisory:** Guidance from chartered accountants (ICAP, ICAEW) and CPAs.',
        ],
      },
      {
        heading: 'Why Choose BizCon Global?',
        bullets: [
          '**Experienced and Qualified Professionals:** Chartered Accountants and experienced bookkeepers.',
          '**Accuracy and Efficiency:** Meticulous accuracy and efficient service delivery.',
          '**Technology-Driven Solutions:** Cutting-edge accounting technology for real-time access to your financial information.',
          '**Proactive Communication and Collaboration:** Ongoing support to ensure your financial well-being.',
        ],
      },
    ],
    closing: 'Focus on Your Business Growth, Leave the Financials to Us. Contact BizCon Global for a free consultation.',
  },
  {
    title: 'Financial Accounting Services',
    slug: 'financial-accounting-services',
    heroHeading: 'Beyond Bookkeeping for Business Growth',
    heroIntro:
      'Many businesses mistakenly believe financial accounting services are synonymous with bookkeeping. While bookkeeping forms the foundation, financial accounting offers a broader spectrum of services crucial for informed decision-making and growth.',
    metaDescription:
      'BizCon Global offers financial reporting, financial analysis, tax planning, and budgeting/forecasting services.',
    sections: [
      {
        heading: 'Financial Accounting: A Strategic Partner',
        bullets: [
          '**Advanced Financial Reporting:** Comprehensive reports like income statements, balance sheets, and cash flow statements.',
          '**Financial Analysis:** Identifying trends, assessing performance against goals, and uncovering risks and opportunities.',
          '**Tax Planning and Compliance:** Navigating tax regulations, minimizing liabilities, and capitalizing on tax benefits.',
          '**Financial Budgeting and Forecasting:** Realistic budgets and forecasts that guide resource allocation.',
        ],
      },
      {
        heading: 'The Benefits of Investing in Financial Accounting',
        bullets: [
          '**Enhanced Decision-Making:** Accurate data and analysis empower informed decisions, increasing profitability.',
          '**Improved Financial Control:** Identify cost savings and gain greater control over your resources.',
          '**Mitigated Financial Risks:** Proactively analyze trends and navigate challenges.',
          '**Increased Access to Funding:** Comprehensive reports increase credibility with investors and lenders.',
        ],
      },
    ],
    closing: 'Contact BizCon Global today and book a free consultation.',
  },
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function getContactFormId(payload: any): Promise<string> {
  const result = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Contact Form' } },
    limit: 1,
  })

  if (!result.docs.length) {
    throw new Error(
      'No form found with title "Contact Form" — check the title matches exactly in /admin/collections/forms',
    )
  }

  return result.docs[0].id as string
}

async function main() {
  const { getPayload } = await import('payload')
  const config = (await import('@payload-config')).default
  const payload = await getPayload({ config })

  console.log('DB HOST:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0])

  const contactFormId = await getContactFormId(payload)
  console.log('Using Contact Form id:', contactFormId)

  for (const page of pages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`SKIP (already exists): ${page.title}`)
      continue
    }

    // Build the Content block(s): one column per section, each with an H2
    // heading + intro paragraph (if any) + bullet list.
    const contentColumns = page.sections.map((section) => {
      const children: any[] = [heading('h2', section.heading)]
      if (section.intro) children.push(paragraph(section.intro))
      if (section.bullets) children.push(bulletList(section.bullets))
      return {
        size: 'full' as const,
        richText: richTextDoc(children),
      }
    })

    if (page.closing) {
      contentColumns.push({
        size: 'full' as const,
        richText: richTextDoc([paragraph(`**${page.closing}**`)]),
      })
    }

    const created = await payload.create({
      collection: 'pages',
      context: {
        disableRevalidate: true,
      },
      data: {
        title: page.title,
        slug: page.slug,
        hero: {
          type: 'lowImpact',
          richText: richTextDoc([heading('h1', page.heroHeading), paragraph(page.heroIntro)]),
        },
        layout: [
          {
            blockType: 'content',
            columns: contentColumns,
          },
          {
            blockType: 'contactBlock',
            form: contactFormId,
          },
        ],
        meta: {
          title: page.title,
          description: page.metaDescription,
        },
        _status: 'published',
      } as any,
    })

    console.log(`CREATED: ${page.title} -> /${page.slug}  (id: ${created.id})`)
  }

  console.log('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})