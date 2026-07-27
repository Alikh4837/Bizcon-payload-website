/**
 * importTrendingPosts.ts
 *
 * One-off bulk importer: pulls the 12 "Trending" WordPress posts from
 * bizconglobal.com content (already extracted below) and creates matching
 * `blog` documents via Payload's Local API. Also downloads each hero image
 * into the `media` collection, and — this is the important part — patches
 * the homepage's `trendingBlock` layout block so its `link` fields point to
 * `/blog/<slug>` instead of the old flat WordPress URLs. That link mismatch
 * is the actual reason the trending cards currently 404: TrendingBlock's
 * `link` field is plain text (not a relationship), so whoever built the
 * homepage typed in the raw WordPress URLs, which don't match this app's
 * `/blog/[slug]` route.
 *
 * HOW TO RUN
 *   1. Drop this file in your project, e.g. at `src/scripts/importTrendingPosts.ts`
 *   2. Make sure AUTHOR_NAME below matches a real user in your Users collection,
 *      or leave author resolution to fail gracefully (it will just skip authors).
 *   3. Run with tsx (already a transitive dep in most Payload projects):
 *        npx tsx src/scripts/importTrendingPosts.ts
 *      or add a package.json script:
 *        "import:trending": "tsx src/scripts/importTrendingPosts.ts"
 *   4. Re-running is safe — it skips any post whose slug already exists.
 *
 * WHAT IT DOES NOT DO
 *   - It does not assign `categories`. WordPress's rendered post pages don't
 *     expose which category each post belongs to, so categories are left
 *     empty. Bulk-assign them afterward in /admin — it's much faster than
 *     guessing wrong here.
 *   - It does not touch the services pages — that's a separate script,
 *     same pattern, once this one is confirmed working.
 */

import { config as loadEnv } from 'dotenv'

// Running via `tsx` skips Next.js's automatic .env loading, so PAYLOAD_SECRET /
// DATABASE_URI etc. would otherwise be undefined when payload.config.ts is
// evaluated. Load them explicitly, before anything imports the config.
loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

// ---------------------------------------------------------------------------
// Lexical helpers — build the same JSON shape @payloadcms/richtext-lexical
// expects, from lightweight markdown-ish strings (**bold**, *italic*,
// ***bolditalic***). This keeps the post data below readable, and this
// helper file is reusable for every future WordPress-to-Payload migration.
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
const ITALIC = 2

function textNodesFromMarkdown(md: string): LexicalTextNode[] {
  const nodes: LexicalTextNode[] = []
  // Order matters: match *** before ** before *
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  const push = (text: string, format: number) => {
    if (!text) return
    nodes.push({
      type: 'text',
      detail: 0,
      format,
      mode: 'normal',
      style: '',
      text,
      version: 1,
    })
  }

  while ((match = regex.exec(md)) !== null) {
    if (match.index > lastIndex) {
      push(md.slice(lastIndex, match.index), 0)
    }
    if (match[2] !== undefined) {
      push(match[2], BOLD | ITALIC)
    } else if (match[3] !== undefined) {
      push(match[3], BOLD)
    } else if (match[4] !== undefined) {
      push(match[4], ITALIC)
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < md.length) {
    push(md.slice(lastIndex), 0)
  }
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

function heading(tag: 'h2' | 'h3' | 'h4', md: string) {
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

function horizontalRule() {
  return { type: 'horizontalrule', version: 1 }
}

function richTextDoc(children: any[]) {
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

// ---------------------------------------------------------------------------
// Post data — extracted from the live WordPress pages.
// `blocks` is a simple ordered list; 'p' = paragraph, 'h' = heading.
// ---------------------------------------------------------------------------

type SourcePost = {
  title: string
  slug: string
  heroImage: string
  publishedAt: string // ISO date
  metaDescription: string
  authorName: string
  blocks: Array<{ kind: 'p' | 'h2' | 'h3' } & { text: string }>
}

const AUTHOR_NAME = 'Daniyal Ahmed' // used for every trending post on the source site

const posts: SourcePost[] = [
  {
    title:
      'How Does Political Instability In The Middle East Affect Global Oil Markets And Economics?',
    slug: 'how-does-political-instability-in-the-middle-east-affect-global-oil-markets-and-economics',
    heroImage:
      'https://bizconglobal.com/wp-content/uploads/2024/04/Screenshot-2024-04-19-at-1.10.38-PM.png',
    publishedAt: '2024-04-19',
    metaDescription:
      "Will Your Wallet Feel the Burn? The world runs on oil, and nowhere is that more evident than when the Middle East, the world's gasoline godfather with nearly 30% of global production, throws a political tantrum.",
    authorName: AUTHOR_NAME,
    blocks: [
      { kind: 'p', text: '*Will Your Wallet Feel the Burn?*' },
      {
        kind: 'p',
        text: "The world runs on oil, and nowhere is that more evident than when the Middle East, the world's gasoline godfather with nearly 30% of global production, throws a political tantrum. This volatility can turn into an economic nightmare for companies and consumers alike, sending gas prices spiraling and triggering a domino effect across industries.",
      },
      {
        kind: 'p',
        text: "Imagine a war erupting near a major oil field. Production sputters, pipelines get damaged, and investors panic. This isn't just a hypothetical scenario. During the Arab Spring of 2011, the threat of disruption in the Middle East caused oil prices to jump nearly 30% in just two months, even without actual supply cuts. Why? Because oil is the lifeblood of our globalized world. It fuels our transportation systems, keeps factories humming, and even heats our homes. When oil prices rise, transportation costs shoot up, impacting everything from the delivery of your groceries to the cost of the clothes on your back.",
      },
      {
        kind: 'p',
        text: 'Companies across the board feel the pinch. Imagine a shipping company facing a sudden surge in fuel costs. Their profit margins shrink, forcing them to make tough decisions – raise prices, cut corners, or lay off employees. This ripples through the entire supply chain, impacting manufacturers who rely on timely deliveries and retailers struggling to maintain their bottom lines.',
      },
      {
        kind: 'p',
        text: 'The good news? Companies can take steps to shield themselves from the storm. Diversifying their energy sources, from solar to wind power, can lessen their dependence on volatile oil markets. Another tactic is to become more energy efficient, squeezing every drop of productivity out of their operations. Financial instruments can also act as an economic umbrella, allowing companies to hedge against price fluctuations.',
      },
      {
        kind: 'p',
        text: "The world's energy dance is a complex one, and the music is often dictated by the political climate of the Middle East. While the future remains uncertain, with ongoing tensions and a growing global thirst for oil, one thing is clear: the link between political instability in the Middle East and economic tremors worldwide is undeniable.",
      },
    ],
  },
  {
    title: 'Can Machines Turn Evil? AI Safety Summit Seeks Answers',
    slug: 'can-machines-turn-evil-ai-safety-summit-seeks-answers',
    heroImage: 'https://bizconglobal.com/wp-content/uploads/2024/04/20230607PHT95601_original.jpg',
    publishedAt: '2024-04-19',
    metaDescription:
      'South Korea is stepping up to host the second global AI Safety Summit, following the inaugural event held at Bletchley Park, UK.',
    authorName: AUTHOR_NAME,
    blocks: [
      {
        kind: 'p',
        text: 'Artificial intelligence (AI) is rapidly transforming our world, from facial recognition software to self-driving cars. While the potential benefits are vast, concerns linger about the potential pitfalls. To address these anxieties and chart a responsible path forward, South Korea is stepping up to host the second global AI Safety Summit on May 21st-22nd, following the inaugural event held at Bletchley Park, UK, last year.',
      },
      { kind: 'h3', text: 'Why Does This Matter?' },
      {
        kind: 'p',
        text: 'The upcoming summit in South Korea is a crucial step in operationalizing the Bletchley Declaration. Imagine it as a brainstorming session for the entire planet! This virtual event, co-hosted by South Korea and the UK, will be a melting pot of ideas and solutions. Government representatives, leading AI companies, academics, and civil society organizations will all have a seat at the table.',
      },
      {
        kind: 'p',
        text: 'Their primary focus? Delving deeper into the potential capabilities of cutting-edge AI models and identifying potential risks associated with their development and use.',
      },
      {
        kind: 'p',
        text: 'Worries about AI safety will be at the forefront of the South Korea summit. One concern is super-intelligent AI, machines that might become smarter than us, while another is bias in AI algorithms, which can lead to unfair outcomes based on skewed data.',
      },
      { kind: 'h3', text: 'A Global Conversation: France Takes the Torch' },
      {
        kind: 'p',
        text: "The South Korea summit isn't the only piece of the puzzle. Following this virtual event, France will hold the next in-person AI Safety Summit in November 2024. This geographically diverse approach highlights the international commitment to safe AI development.",
      },
      {
        kind: 'p',
        text: 'A team of 32 international experts has prepped the groundwork for the South Korea summit by compiling a critical report on AI safety challenges and solutions, titled "International Scientific Report on Advanced AI Safety." This report will be unveiled before the summit itself. The South Korea summit marks the first step in a continuous journey to ensure AI development benefits humanity for generations to come.',
      },
    ],
  },
  {
    title: 'Should we fear hackers? Is your company data really safe?',
    slug: 'should-we-fear-hackers-is-your-company-data-really-safe',
    heroImage:
      'https://bizconglobal.com/wp-content/uploads/2024/04/shutterstock_1155674893-min-1200x800-1.jpg',
    publishedAt: '2024-04-19',
    metaDescription:
      "Cyber-Security is much more than a matter of IT. In the wake of COVID-19, remote work opened the floodgates to a host of cybersecurity challenges.",
    authorName: AUTHOR_NAME,
    blocks: [
      { kind: 'p', text: '*Cyber-Security is much more than a matter of IT*' },
      {
        kind: 'p',
        text: "In the wake of the COVID-19 pandemic, the concept of 'work' underwent a radical transformation. The traditional office space, once a hub of daily activity, has been largely replaced by the home office. This shift to remote work has been embraced for its flexibility and convenience, but it has also opened the floodgates to a host of cybersecurity challenges.",
      },
      {
        kind: 'p',
        text: "As we navigate this new terrain, cybersecurity has become the guardian of our virtual frontiers. It's the digital armor that shields our personal and professional data from the relentless onslaught of cyber threats.",
      },
      {
        kind: 'p',
        text: 'Yet, despite its critical role, the transition to remote work has revealed glaring vulnerabilities. Employees are often working on personal devices, connected to potentially unsecured Wi-Fi networks, and accessing sensitive company data through cloud services. These practices have inadvertently laid out a welcome mat for cybercriminals.',
      },
      {
        kind: 'p',
        text: 'The rise in phishing attacks is a testament to this new vulnerability. These deceptively simple schemes have become increasingly sophisticated, preying on remote workers who are beyond the protective gaze of corporate IT security. The result? A surge in stolen credentials and compromised systems.',
      },
      {
        kind: 'p',
        text: 'The statistics are alarming. According to a recent Egress report, an overwhelming 94% of organizations have suffered from data loss and exfiltration incidents.',
      },
      {
        kind: 'p',
        text: 'The impact of these breaches extends far beyond mere inconvenience. They carry heavy financial repercussions, with 57% of affected companies reporting significant monetary losses. Nearly half of these organizations have seen a dip in revenue due to customer attrition. The damage to reputation is equally severe, with 40% of companies experiencing a tarnished public image.',
      },
      {
        kind: 'p',
        text: 'Operational disruptions are another consequence, with over half of the breached organizations forced to pause operations to address the fallout.',
      },
      {
        kind: 'p',
        text: "This begs the question: Are traditional security measures still effective? With 91% of cybersecurity leaders expressing dissatisfaction with Secure Email Gateways, it's clear that a reassessment is overdue.",
      },
      {
        kind: 'p',
        text: "As we continue to adapt to the remote work landscape, it's imperative that we fortify our digital defenses.",
      },
      {
        kind: 'p',
        text: 'In light of these challenges, businesses must adopt a proactive stance towards cybersecurity. By prioritizing user-centric security awareness training and implementing advanced threat detection mechanisms, organizations can fortify their defenses against data breaches.',
      },
      { kind: 'p', text: '*As the world is increasingly interconnected, everyone shares the responsibility of securing cyberspace.*' },
      { kind: 'p', text: '*An ounce of prevention is worth a pound of cure.*' },
    ],
  },
  {
    title: 'How to register trademark Internationally',
    slug: 'how-to-register-trademark-internationally',
    heroImage: 'https://bizconglobal.com/wp-content/uploads/2024/04/shutterstock_1421346197-1.jpg',
    publishedAt: '2024-04-19',
    metaDescription:
      'Protecting your brand identity in the global marketplace is crucial. This guide focuses on the Madrid Protocol.',
    authorName: AUTHOR_NAME,
    blocks: [
      {
        kind: 'p',
        text: '**Registering Your Trademark Internationally: A Step-by-Step Guide**',
      },
      {
        kind: 'p',
        text: 'Protecting your brand identity in the global marketplace is crucial. There are two main approaches to international trademark registration: filing individual applications in each target country or utilizing the Madrid Protocol for a more streamlined process. This guide focuses on the Madrid Protocol, outlining the steps involved:',
      },
      { kind: 'h3', text: 'Preparation' },
      {
        kind: 'p',
        text: '**Base Trademark Registration:** Ensure you have a registered trademark in your home country or another member of the Madrid Protocol. This serves as the foundation for your international application.',
      },
      {
        kind: 'p',
        text: '**Market Research:** Identify the specific countries where you require trademark protection. Consider factors like your current and future markets, potential for infringement, and business expansion plans.',
      },
      {
        kind: 'p',
        text: '**Classification of Goods and Services:** Determine the relevant classification of goods and services your trademark applies to using the International Classification System (Nice Classification). The WIPO website provides a helpful search tool for classification.',
      },
      { kind: 'h3', text: 'Filing the International Application' },
      {
        kind: 'p',
        text: '**National or Regional IP Office:** Contact your national or regional trademark office (e.g., USPTO in the United States) to initiate the Madrid Protocol application process.',
      },
      {
        kind: 'p',
        text: '**Application Formalities:** Complete the official Madrid Protocol application form, ensuring accurate information about your base trademark registration, applicant details, designated countries, and a clear representation of your trademark.',
      },
      {
        kind: 'p',
        text: '**Fees:** Pay the required fees associated with filing the international application. These fees cover both the application process through WIPO and national fees for each designated country.',
      },
      { kind: 'h3', text: 'WIPO Examination and Publication' },
      {
        kind: 'p',
        text: '**Formal Examination:** WIPO will conduct a formal examination to ensure your application meets the basic requirements of the Madrid Protocol.',
      },
      {
        kind: 'p',
        text: '**International Register Publication:** If your application passes the formal check, WIPO will publish it in the International Register of Marks.',
      },
      { kind: 'h3', text: 'National Phase' },
      {
        kind: 'p',
        text: '**Individual Country Examination:** Each designated country will receive your application from WIPO and conduct its independent examination based on their national trademark laws.',
      },
      {
        kind: 'p',
        text: "**Potential Objections:** If any designated country identifies issues with your trademark, you'll receive an official notification and an opportunity to respond.",
      },
      {
        kind: 'p',
        text: "**Grant or Rejection:** Based on the examination and any addressed objections, each designated country will decide to grant or reject your trademark registration.",
      },
      { kind: 'h3', text: 'Maintaining Your International Trademark Registrations' },
      {
        kind: 'p',
        text: "**Renewal Requirements:** Each country will have its own renewal requirements for maintaining your trademark registration.",
      },
      {
        kind: 'p',
        text: '**Centralized Management:** While the Madrid Protocol offers a centralized application process, each designated country maintains its independent register.',
      },
      {
        kind: 'p',
        text: 'Consulting an intellectual property lawyer with expertise in international trademark registration is highly recommended, especially for complex situations or a large number of designated countries. Remember, protecting your brand identity in key markets is essential for successful global expansion.',
      },
    ],
  },
  {
    title: 'How to register trademark in US',
    slug: 'how-to-register-trademark-in-us',
    heroImage:
      'https://bizconglobal.com/wp-content/uploads/2024/04/US-Trademark-All-You-Need-To-Know-–-USPTO.jpg',
    publishedAt: '2024-04-19',
    metaDescription:
      "The United States trademark registration process unfolds through the United States Patent and Trademark Office (USPTO).",
    authorName: AUTHOR_NAME,
    blocks: [
      {
        kind: 'p',
        text: "The United States trademark registration process unfolds through the United States Patent and Trademark Office (USPTO). Here's a breakdown of the steps:",
      },
      {
        kind: 'p',
        text: '**Trademark Selection and Search:** Choose a trademark that represents your brand uniquely, then conduct a trademark search through the USPTO\'s Trademark Electronic Search System (TESS) to identify potential conflicts.',
      },
      {
        kind: 'p',
        text: '**Application Preparation:** Determine your filing option (TEAS Standard vs. TEAS Plus), gather your details and a clear description of goods/services, and prepare the application fee.',
      },
      {
        kind: 'p',
        text: "**Electronic Application System (TEAS):** The USPTO recommends filing electronically through TEAS for faster processing and easier tracking.",
      },
      {
        kind: 'p',
        text: "**Examination Stage:** A USPTO attorney reviews your application. If there are issues, you'll receive an \"office action\" requesting a response within a specific timeframe.",
      },
      {
        kind: 'p',
        text: "**Publication and Opposition:** If approved, your trademark is published in the Trademark Official Gazette for public review, during which anyone can challenge the registration.",
      },
      {
        kind: 'p',
        text: "**Registration and Maintenance:** If no opposition is filed, your trademark is registered. Maintenance documents are due between years 5–6 and again between years 9–10, with a fee.",
      },
      {
        kind: 'p',
        text: 'Consider seeking guidance from a trademark attorney, especially for complex situations. Remember, this is a general guideline — contact a legal professional for the latest requirements.',
      },
    ],
  },
  {
    title: 'How to register trademark in Ireland',
    slug: 'how-to-register-trademark-in-ireland',
    heroImage: 'https://bizconglobal.com/wp-content/uploads/2024/04/trademarks-in-india.jpg',
    publishedAt: '2024-04-19',
    metaDescription:
      "Here's a step-by-step guide on how to register a trademark in Ireland through the Intellectual Property Office of Ireland (IPOI).",
    authorName: AUTHOR_NAME,
    blocks: [
      {
        kind: 'p',
        text: "Here's a step-by-step guide on how to register a trademark in Ireland:",
      },
      {
        kind: 'p',
        text: "**Conduct a Trademark Search:** Before applying, check if a similar trademark already exists using the Intellectual Property Office of Ireland's (IPOI) search tool.",
      },
      {
        kind: 'p',
        text: '**Prepare Your Application:** Fill out the formal application form with your details, a clear image of your trademark, the classification of goods/services, and the application fee (currently €50).',
      },
      {
        kind: 'p',
        text: '**Submit Your Application:** Submit the completed application, along with the fee, to the Controller of the IPOI.',
      },
      {
        kind: 'p',
        text: '**Examination Process:** The IPOI examines your application for distinctiveness and potential conflicts with existing trademarks.',
      },
      {
        kind: 'p',
        text: "**Potential Objections:** If issues are identified, you'll have the opportunity to address them, potentially by modifying your application.",
      },
      {
        kind: 'p',
        text: "**Registration Approval:** If your application clears examination, your trademark is registered and you'll receive an official certificate.",
      },
      {
        kind: 'p',
        text: 'Consider seeking advice from an intellectual property lawyer for a smoother process. If you plan to operate across the EU, consider registering with the European Union Intellectual Property Office (EUIPO) for wider protection.',
      },
    ],
  },
  {
    title: 'How to register trademark in Dubai',
    slug: 'how-to-register-trademark-in-dubai',
    heroImage: 'https://bizconglobal.com/wp-content/uploads/2024/04/how-to-register-trademark-in-uae.jpg',
    publishedAt: '2024-04-19',
    metaDescription:
      "Here's a step-by-step procedure on how to register a trademark in Dubai, part of the United Arab Emirates (UAE).",
    authorName: AUTHOR_NAME,
    blocks: [
      {
        kind: 'p',
        text: "Here's a step-by-step procedure on how to register a trademark in Dubai, which is part of the United Arab Emirates (UAE):",
      },
      {
        kind: 'p',
        text: "**Conduct a Trademark Search:** Before applying, check if your desired trademark already exists in the UAE to avoid wasting time on a registration that might be rejected.",
      },
      {
        kind: 'p',
        text: "**Prepare the Application and Documents:** Download the application form from the Ministry of Economy (MOE) website. Required documents include a sample of your trademark, a list of covered goods/services, a copy of your trading license (if applicable), power of attorney (if using an agent), and a passport copy.",
      },
      {
        kind: 'p',
        text: "**Submit the Application and Pay Fees:** Submit electronically through the MOE website or in person at their service centers, and pay the relevant registration fees.",
      },
      {
        kind: 'p',
        text: "**Application Review and Publication:** The MOE reviews for completeness and distinctiveness. If accepted, it's published in the UAE Trademark Bulletin and two local Arabic newspapers for a 30-day opposition period.",
      },
      {
        kind: 'p',
        text: "**Address Oppositions (if any):** Other parties can challenge your registration during the opposition period, which is handled through MOE's procedures.",
      },
      {
        kind: 'p',
        text: "**Trademark Registration:** If there are no oppositions, or after successful resolution, your trademark is registered and you'll receive a certificate.",
      },
      {
        kind: 'p',
        text: 'Consider using a trademark registration agent if unfamiliar with the process. Trademark registration in the UAE is valid for ten years and can be renewed for additional ten-year terms.',
      },
    ],
  },
  {
    title: 'How to Write an Agreement',
    slug: 'how-to-write-an-agreement',
    heroImage:
      'https://bizconglobal.com/wp-content/uploads/2024/04/service-agreement-signing-1024x576-1.jpg',
    publishedAt: '2024-04-19',
    metaDescription:
      'The Art of the Agreement: Crafting Clear Contracts for Business Success.',
    authorName: AUTHOR_NAME,
    blocks: [
      { kind: 'p', text: '**The Art of the Agreement: Crafting Clear Contracts for Business Success**' },
      {
        kind: 'p',
        text: 'In the dynamic world of business, to avoid any conflict and litigation, sound and clear agreements are the foundation of trust and collaboration. A well-written agreement acts as a roadmap, outlining expectations, safeguarding interests, and minimizing the risk of misunderstandings. Common clauses worth considering include confidentiality, indemnification, termination, force majeure, jurisdiction, dispute resolution, damages, severability, intellectual property, cancellation, payment terms, liability, warranties, assignment, consideration, copyright, amendment, scope of work, arbitration, parties, and an integration clause.',
      },
      { kind: 'h3', text: 'Laying the Groundwork: Identify Parties and Purpose' },
      {
        kind: 'p',
        text: 'The first step is establishing the who and why of your agreement. Clearly identify all parties involved, including their legal names and designations. Outline the purpose — is it a service agreement, a non-disclosure agreement (NDA), or a sales contract? Specificity is key.',
      },
      { kind: 'h3', text: 'Defining the Scope of Work and Deliverables' },
      {
        kind: 'p',
        text: 'Outline the specific tasks, duties, roles, objectives, deliverables, and timelines. Clearly define success metrics to ensure all parties are on the same page. Also clearly define both parties\' responsibilities and potential liabilities to avoid misunderstandings.',
      },
      { kind: 'h3', text: 'Confidentiality: Protecting Sensitive Information' },
      {
        kind: 'p',
        text: 'If your agreement involves sensitive information, a non-disclosure agreement (NDA) becomes crucial, specifying what information is protected, for how long, and permissible uses. It\'s also important to define intellectual property rights and who is responsible for damages in case of negligence.',
      },
      { kind: 'h3', text: 'Dispute Resolution: Charting a Course for Conflict Resolution' },
      {
        kind: 'p',
        text: 'Agreements should anticipate potential disagreements. Include a dispute resolution clause outlining the preferred method — mediation, arbitration, or litigation.',
      },
      { kind: 'h3', text: 'Termination Clause: Defining Exit Strategies' },
      {
        kind: 'p',
        text: 'A well-defined termination clause outlines the circumstances under which either party can terminate the agreement, the notice period required, and any associated fees. Include a force majeure clause to remove liability for unforeseeable catastrophes like natural disasters or wars.',
      },
      { kind: 'h3', text: 'Payment Terms: Leaving No Room for Ambiguity' },
      {
        kind: 'p',
        text: 'Specify the payment schedule, timelines, total amount, payment milestones, and accepted payment methods, plus any late payment penalties. An accounts and finance clause may be necessary for profit or commission distribution.',
      },
      { kind: 'h3', text: 'Governing Law' },
      {
        kind: 'p',
        text: 'Specify the governing law that will apply in case of disputes — typically the law of the jurisdiction where the agreement is signed or where the work is performed.',
      },
      { kind: 'h3', text: 'Signatures, The Final Touches' },
      {
        kind: 'p',
        text: 'Once all parties are satisfied, formalize the agreement with authorized signatures and dates. Witnesses from all parties should also sign.',
      },
      {
        kind: 'p',
        text: 'While this article provides a foundational framework, consulting with a qualified legal professional is highly recommended to tailor the agreement to your specific needs.',
      },
      {
        kind: 'p',
        text: '*At BizCon Global we have a team of legal expertise that can help you craft a winning agreement. Consult today!*',
      },
    ],
  },
  {
    title: "Is Your Wallet Feeling the Squeeze? Inflation's Unexpected Return",
    slug: 'is-your-wallet-feeling-the-squeeze-inflations-unexpected-return',
    heroImage:
      'https://bizconglobal.com/wp-content/uploads/2024/05/Gemini_Generated_Image_sel5y4sel5y4sel5.jpeg',
    publishedAt: '2024-05-07',
    metaDescription:
      'Inflation unexpectedly reared its head in March, jumping to 3.5% and casting doubt on the Federal Reserve\'s plans to cut interest rates.',
    authorName: AUTHOR_NAME,
    blocks: [
      {
        kind: 'p',
        text: "Remember that pesky inflation monster we thought we'd slayed in 2023? Well, it seems the beast might be stirring again. After a dramatic plunge from its terrifying 9.1% peak in 2022, inflation unexpectedly reared its head in March, jumping to 3.5% – a seemingly small bump, but enough to send chills down the spines of Wall Street investors and cast doubt on the Federal Reserve's plans to cut interest rates.",
      },
      {
        kind: 'p',
        text: "So, what gives? Wasn't the party supposed to be over? Analysts were all but clinking champagne glasses, celebrating the return of a semblance of normalcy after the pandemic's wild ride. Turns out, the celebration might have been a tad premature.",
      },
      {
        kind: 'p',
        text: "The culprit this time around seems to be a familiar foe – rising fuel costs. Oil prices have seen an uptick in recent months, translating to higher prices at the pump. But it's not just filling up your car that's getting pricier. Housing, a major contributor to inflation, continues to be a thorn in everyone's side.",
      },
      {
        kind: 'p',
        text: "Remember all those optimistic predictions about the Fed slashing interest rates this year? Those seem to be on hold for now. The strong jobs report released last week certainly threw a wrench into those plans. A booming job market can also fuel inflation as businesses compete for a limited pool of talent, often by offering higher wages.",
      },
      {
        kind: 'p',
        text: "The Fed, tasked with keeping inflation in check, now finds itself in a bit of a bind. High inflation is the enemy, but so is a sluggish economy. Raising interest rates might cool inflation, but it could also slow down the job market.",
      },
      {
        kind: 'p',
        text: "One thing's for sure, the Fed's decision will be watched with bated breath by central banks around the world. A rate hike in the US could trigger similar moves elsewhere, impacting global financial markets.",
      },
    ],
  },
  {
    title: 'Is Samsung Making America a Chip Powerhouse Again?',
    slug: 'is-samsung-making-america-a-chip-powerhouse-again',
    heroImage:
      'https://bizconglobal.com/wp-content/uploads/2024/05/Gemini_Generated_Image_3awnwe3awnwe3awn.jpeg',
    publishedAt: '2024-05-10',
    metaDescription:
      'Samsung is set to invest $44 billion in building chip factories in Texas, aligning with the US plan to revitalize domestic chip production.',
    authorName: AUTHOR_NAME,
    blocks: [
      { kind: 'p', text: '*South Korean Tech Giant Invests $44 Billion in US Chip Production*' },
      {
        kind: 'p',
        text: "The global chip shortage sent shockwaves through the tech industry, highlighting America's dependence on foreign chip manufacturers. But a new contender is stepping onto the field – and it's a big one. Samsung, a tech titan known for its smartphones and TVs, is set to invest a whopping $44 billion in building chip factories in Texas. This move aligns perfectly with the US government's ambitious plan to revitalize domestic chip production and reduce reliance on Asia.",
      },
      { kind: 'p', text: '*A $44 Billion Bet on American Chips!*' },
      {
        kind: 'p',
        text: "This investment isn't just pocket change. $44 billion is a serious commitment, and it's sure to shake up the chip-making landscape. Samsung isn't going it alone either — they've already secured over $6 billion in grants from the US government, thanks to the CHIPS and Science Act, a 2022 law aimed at boosting American chip production. Samsung's investment will be centered in Taylor, Texas, which is quickly becoming a chip-making hotspot, alongside other investors like Texas Instruments.",
      },
      { kind: 'p', text: '*Building a Secure Future, One Chip at a Time!*' },
      {
        kind: 'p',
        text: "The road ahead isn't without its hurdles. Finalizing the deal and getting chips rolling off the production line will take time. But Samsung's investment is a significant step towards making America a chip powerhouse again — strengthening national security, creating jobs, and boosting the overall tech industry.",
      },
    ],
  },
  {
    title: 'Is America Blacklisting China Out of Business?',
    slug: 'is-america-blacklisting-china-out-of-business',
    heroImage: 'https://bizconglobal.com/wp-content/uploads/2024/05/Gemini_Generated_Image_e9vl0ye9vl0ye9vl.jpeg',
    publishedAt: '2024-05-10',
    metaDescription:
      "The US-China trade war just got an AI upgrade, as the Biden administration adds more Chinese companies to its export blacklist than ever before.",
    authorName: AUTHOR_NAME,
    blocks: [
      {
        kind: 'p',
        text: "The US-China trade war just got an AI upgrade. The Biden administration is flexing its economic muscles, adding more Chinese companies to a blacklist than ever before. This move aims to curb China's access to advanced tech, but will it cripple the Asian giant or spark a tech Cold War?",
      },
      {
        kind: 'p',
        text: "The US government is wielding a powerful tool: the Commerce Department's entity list. This list acts like a trade black hole, restricting American companies from exporting crucial technology to listed entities. The goal? To hobble China's ability to develop advanced tech, especially in areas with military applications like Artificial Intelligence (AI).",
      },
      {
        kind: 'p',
        text: "President Biden has significantly expanded this list, surpassing the number blacklisted under Trump. This bipartisan effort reflects a growing concern in Washington – China's military ambitions and its leader, Xi Jinping's assertive stance towards Taiwan.",
      },
      { kind: 'h3', text: 'China Fumes, But Can They Counterpunch?' },
      {
        kind: 'p',
        text: "China isn't taking this lying down. They see the blacklist as a form of economic bullying and vow to defend their companies. They've even blacklisted a couple of American firms in retaliation, but these moves are mostly symbolic. The real bite comes from limited access to cutting-edge American technology.",
      },
      {
        kind: 'p',
        text: 'However, the US has made some concessions — for example, removing a Chinese lab from the list to collaborate on tackling the fentanyl crisis. The overall trend is clear: America wants to maintain its technological lead, especially in "dual-use" technologies with both civilian and military applications.',
      },
      {
        kind: 'p',
        text: 'The US tightening its grip on tech exports will undoubtedly strain US-China relations. Both nations are deeply intertwined economically, and a complete decoupling is unlikely — a bumpy road with continued friction, punctuated by occasional cooperation, is the more probable scenario.',
      },
    ],
  },
  {
    title: 'Is Elon Musk Worth $56 Billion? Tesla Shareholders Get to Decide (Again)',
    slug: 'is-elon-musk-worth-56-billion-tesla-shareholders-get-to-decide-again',
    heroImage: 'https://bizconglobal.com/wp-content/uploads/2024/05/LO.jpg',
    publishedAt: '2024-05-10',
    metaDescription:
      "Tesla is once again asking shareholders to approve a record-breaking $56 billion pay package for Elon Musk, a deal already struck down once by a judge.",
    authorName: AUTHOR_NAME,
    blocks: [
      {
        kind: 'p',
        text: "Elon Musk, the world's richest person (for now), is back in the spotlight, but not for the reasons he might like. Tesla is once again asking shareholders to approve a record-breaking $56 billion pay package for their CEO — a deal that was already struck down by a judge in January.",
      },
      {
        kind: 'p',
        text: "This hefty compensation plan doesn't involve a salary or bonus. Instead, it hinges on Tesla's stock performance. If the electric carmaker reaches a market cap of $650 billion within a decade, Musk unlocks a massive payout. That's a big \"if,\" considering Tesla's stock has dipped recently, and the company is facing its lowest EV deliveries since 2022.",
      },
      {
        kind: 'p',
        text: "So, what's the controversy? Critics argue the initial deal was unfair to shareholders. The judge who blocked it felt Tesla's board, perhaps dazzled by Musk's celebrity, didn't properly explain the terms to investors. Tesla, however, maintains Musk deserves the reward for his leadership in growing the company into a clean energy powerhouse — pointing out he hasn't taken a salary in six years and is already immensely wealthy.",
      },
      {
        kind: 'p',
        text: "This re-vote comes at a crucial time for Tesla. Not only are they facing production challenges, but Musk's reputation has taken some hits after car recalls, social media controversies, and a turbulent year for Tesla overall.",
      },
      {
        kind: 'p',
        text: "The question remains: will shareholders approve the record-breaking pay package? Only time, and their vote, will tell.",
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function downloadImage(url: string): Promise<{ data: Buffer; mimetype: string; filename: string }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  const mimetype = res.headers.get('content-type') || 'image/jpeg'
  const filename = decodeURIComponent(url.split('/').pop() || 'image.jpg')
  return { data: Buffer.from(arrayBuffer), mimetype, filename }
}

async function main() {
  const { getPayload } = await import('payload')
  const config = (await import('@payload-config')).default
  const payload = await getPayload({ config })

  // Resolve author once (best-effort — many projects lock down the Users
  // collection to a single admin, in which case this just won't match and
  // the post will be created with no author, which is fine).
  let authorId: string | number | undefined
  try {
    const authorResult = await payload.find({
      collection: 'users',
      where: { name: { equals: AUTHOR_NAME } },
      limit: 1,
    })
    authorId = authorResult.docs[0]?.id
    if (!authorId) {
      console.warn(`No user found matching "${AUTHOR_NAME}" — posts will be created without an author.`)
    }
  } catch {
    console.warn('Could not query users collection for author resolution — continuing without author.')
  }

  const slugToId: Record<string, string | number> = {}

  for (const post of posts) {
    const existing = await payload.find({
      collection: 'blog',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`SKIP (already exists): ${post.title}`)
      slugToId[post.slug] = existing.docs[0].id
      continue
    }

    console.log(`Downloading hero image for: ${post.title}`)
    const { data, mimetype, filename } = await downloadImage(post.heroImage)

    const media = await payload.create({
      collection: 'media',
      data: { alt: post.title },
      file: {
        data,
        mimetype,
        name: filename,
        size: data.length,
      },
    })

    const contentChildren = post.blocks.flatMap((b) => {
      if (b.kind === 'h2') return [heading('h2', b.text)]
      if (b.kind === 'h3') return [heading('h3', b.text)]
      return [paragraph(b.text)]
    })

    const created = await payload.create({
      collection: 'blog',
      data: {
        title: post.title,
        slug: post.slug,
        heroImage: media.id,
        content: richTextDoc(contentChildren),
        publishedAt: new Date(post.publishedAt).toISOString(),
        authors: authorId ? [authorId] : undefined,
        meta: {
          title: post.title,
          description: post.metaDescription,
          image: media.id,
        },
        _status: 'published',
      } as any,
    })

    slugToId[post.slug] = created.id
    console.log(`CREATED: ${post.title} -> /blog/${post.slug}`)
  }

  // ---------------------------------------------------------------------
  // Patch the homepage's trendingBlock link fields to point at /blog/<slug>
  // instead of the old flat WordPress URLs (this is the actual 404 fix).
  // ---------------------------------------------------------------------
  const pagesWithTrending = await payload.find({
    collection: 'pages',
    limit: 100,
  })

  for (const page of pagesWithTrending.docs as any[]) {
    if (!Array.isArray(page.layout)) continue
    let changed = false

    const newLayout = page.layout.map((block: any) => {
      if (block.blockType !== 'trendingBlock' || !Array.isArray(block.items)) return block

      const newItems = block.items.map((item: any) => {
        const matchedPost = posts.find((p) => p.title.trim() === (item.title || '').trim())
        if (matchedPost && item.link !== `/blog/${matchedPost.slug}`) {
          changed = true
          return { ...item, link: `/blog/${matchedPost.slug}` }
        }
        return item
      })

      return { ...block, items: newItems }
    })

    if (changed) {
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: { layout: newLayout },
        context: { disableRevalidate: true },
      })
      console.log(`Patched trendingBlock links on page: ${page.title || page.slug}`)
    }
  }

  console.log('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})