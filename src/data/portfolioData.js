// ─────────────────────────────────────────────────────────────
// portfolioData.js — the SINGLE SOURCE OF TRUTH for the website.
//
// Every section and every card reads from this file.
// To update your résumé, change the values here — you should not
// need to touch any component.
//
// Two languages: text that differs between English and German is written
// as  L('English text', 'Deutscher Text').  Facts that are the same in both
// (names, dates, technologies) are written only once.
// createPortfolioData('en' | 'de') at the bottom picks the right language.
//
// Rule: only put information here that is on the résumé.
// ─────────────────────────────────────────────────────────────

/** A text in two languages */
const L = (en, de) => ({ __bilingual: true, en, de })

const personal = {
  name: 'Tejeshwaran Manoharan',
  firstName: 'Tejeshwaran',
  tagline: 'Data Analytics · Frontend · AI',
  location: L('Berlin, Germany', 'Berlin, Deutschland'),
  email: 'tejeshmanoharan@gmail.com',
  // Add your LinkedIn profile URL here. While it is empty, the LinkedIn
  // links are hidden automatically everywhere on the site.
  linkedin: '',
  portfolioUrl: 'https://tejeshwaran.github.io/portfolio-website/',
}

// In slide mode each degree is its own slide, with its own question and
// answer (question / answer below). The scrolling page shows both together
// under conversation.education.
const education = [
  {
    id: 'msc',
    question: L('What is his educational background?', 'Welche Ausbildung hat er?'),
    answer: L(
      'Most recently, he completed a Master of Science in Data Analytics at the Berlin School of Business and Innovation — with machine learning, predictive analytics, Tableau and AWS on the programme.',
      'Zuletzt hat er einen Master of Science in Data Analytics an der Berlin School of Business and Innovation abgeschlossen — mit Machine Learning, Predictive Analytics, Tableau und AWS im Studium.',
    ),
    level: L("Master's Degree", 'Masterabschluss'),
    degree: 'Master of Science — Data Analytics',
    school: 'Berlin School of Business and Innovation',
    start: '06/2024',
    end: '11/2025',
    grade: L('2.3', '2,3'),
    topics: [
      'Machine Learning',
      'Predictive Analytics',
      L('Data Visualization with Tableau', 'Datenvisualisierung mit Tableau'),
      L('Big Data Analysis with AWS', 'Big-Data-Analyse mit AWS'),
    ],
  },
  {
    id: 'bca',
    question: L('And before that?', 'Und davor?'),
    answer: L(
      'Before that, he earned a Bachelor of Computer Applications at Patrician College of Arts and Science, with a grade of 1.3 — covering software engineering, web design and data structures.',
      'Davor hat er einen Bachelor of Computer Applications am Patrician College of Arts and Science mit der Note 1,3 abgeschlossen — mit Softwareentwicklung, Webdesign und Datenstrukturen.',
    ),
    level: L("Bachelor's Degree", 'Bachelorabschluss'),
    degree: 'Bachelor of Computer Applications',
    school: 'Patrician College of Arts and Science',
    start: '06/2020',
    end: '07/2023',
    grade: L('1.3', '1,3'),
    topics: ['Software Engineering', L('Web Design', 'Webdesign'), L('Data Structures', 'Datenstrukturen')],
  },
]

const experience = [
  {
    id: 'hermitcrabs',
    company: 'HermitCrabs',
    role: L('Web Development Intern', 'Praktikant in der Webentwicklung'),
    start: '07/2022',
    end: '08/2022',
    responsibilities: [
      L('Front-end development', 'Frontend-Entwicklung'),
      L('Building UI components', 'Entwicklung von UI-Komponenten'),
      L('Working on web applications', 'Arbeit an Webanwendungen'),
      L('Working with HubSpot CRM', 'Arbeit mit HubSpot CRM'),
      L('Supporting marketing and sales processes', 'Unterstützung von Marketing- und Vertriebsprozessen'),
    ],
    tags: [
      'React / Frontend',
      L('UI Components', 'UI-Komponenten'),
      L('Web Applications', 'Webanwendungen'),
      'HubSpot CRM',
    ],
  },
]

// Each project is shown as its own question → answer in the Projects
// section. To add a project, add an object here — nothing else to change.
//   type 'dashboard' → analytics-workspace preview + "Analyze project" panel
//   type 'web'       → browser-window preview + "View project" link
//   type 'app'       → desktop-app preview with the floating dictation pill
const projects = [
  {
    id: 'sales-dashboard',
    number: '01',
    type: 'dashboard',
    question: L('What has he built?', 'Was hat er gebaut?'),
    answer: L(
      'One of his projects is an interactive Tableau BI dashboard for analyzing sales and customer data. Open the analysis to see what it covers.',
      'Eines seiner Projekte ist ein interaktives BI-Dashboard in Tableau zur Analyse von Vertriebs- und Kundendaten. Öffne die Analyse, um zu sehen, was es abdeckt.',
    ),
    title: L('Sales Dashboard', 'Sales-Dashboard'),
    subtitle: L('A BI dashboard for analyzing sales data.', 'Ein BI-Dashboard zur Analyse von Vertriebsdaten.'),
    tech: ['SQL', 'Python', 'Tableau'],
    description: L(
      'Developed an interactive Tableau BI dashboard for analyzing sales and customer data.',
      'Entwicklung eines interaktiven BI-Dashboards in Tableau zur Analyse von Vertriebs- und Kundendaten.',
    ),
    capabilities: [
      L('Data cleaning and processing with Python', 'Datenbereinigung und -verarbeitung mit Python'),
      L('KPI-based visualizations', 'KPI-basierte Visualisierungen'),
      'Reporting',
      L('Business insights', 'Geschäftseinblicke'),
    ],
    link: null,
  },
  {
    id: 'portfolio-website',
    number: '02',
    type: 'web',
    question: L('Has he built a real web application?', 'Hat er eine echte Webanwendung gebaut?'),
    answer: L(
      'Yes. He built and deployed a personal portfolio website using React.js, Tailwind CSS and Vite.',
      'Ja. Er hat eine persönliche Portfolio-Website mit React.js, Tailwind CSS und Vite gebaut und veröffentlicht.',
    ),
    title: L('Personal Portfolio', 'Persönliches Portfolio'),
    subtitle: L('A personal website, built and deployed.', 'Eine persönliche Website, gebaut und veröffentlicht.'),
    tech: ['React JS', 'Tailwind CSS', 'Vite', 'GitHub'],
    description: L(
      'Built and deployed a personal portfolio website using React.js, Tailwind CSS and Vite.',
      'Persönliche Portfolio-Website mit React.js, Tailwind CSS und Vite gebaut und veröffentlicht.',
    ),
    capabilities: [],
    link: personal.portfolioUrl,
  },
  {
    id: 'pillo',
    number: '03',
    type: 'app',
    question: L('What is he building right now?', 'Woran arbeitet er gerade?'),
    answer: L(
      'He is building Pillo for Windows, together with Claude AI: a Windows version of the Pillo dictation app. You press a hotkey, speak, and your words are typed where your cursor is. Speech recognition runs on the device.',
      'Er entwickelt gemeinsam mit Claude AI „Pillo für Windows“: eine Windows-Version der Diktier-App Pillo. Du drückst ein Tastenkürzel, sprichst, und deine Worte erscheinen dort, wo dein Cursor steht. Die Spracherkennung läuft direkt auf dem Gerät.',
    ),
    title: L('Pillo for Windows', 'Pillo für Windows'),
    subtitle: L('On-device voice dictation for Windows.', 'Sprachdiktat für Windows, direkt auf dem Gerät.'),
    status: L('In development', 'In Entwicklung'),
    collaborator: 'Claude AI',
    tech: ['C#', '.NET 10', 'WPF', 'NAudio', 'sherpa-onnx', L('Parakeet speech model', 'Parakeet-Sprachmodell')],
    description: L(
      'A Windows port of Pillo, a macOS dictation app. Audio is captured on the PC and transcribed by an on-device speech model, then typed into the active app.',
      'Eine Windows-Portierung von Pillo, einer Diktier-App für macOS. Der Ton wird am PC aufgenommen, von einem Sprachmodell direkt auf dem Gerät transkribiert und dann in die aktive App getippt.',
    ),
    capabilities: [
      L('Global hotkey to start dictation', 'Globales Tastenkürzel zum Starten des Diktats'),
      L('On-device speech recognition', 'Spracherkennung direkt auf dem Gerät'),
      L('Text typed at the cursor in any app', 'Text erscheint am Cursor in jeder App'),
      L('Dictionary, formatting and voice shortcuts', 'Wörterbuch, Formatierung und Sprachbefehle'),
      L('Floating pill overlay', 'Schwebendes Pill-Overlay'),
      L('Transcript history', 'Verlauf der Transkripte'),
    ],
    link: null,
  },
]

// Skill levels are written exactly as on the résumé.
// Items without a level simply show no badge.
const VERY_GOOD = { key: 'very-good', label: L('Very good', 'Sehr gut') }
const GOOD = { key: 'good', label: L('Good', 'Gut') }

// In slide mode each skill group is its own slide (question / answer below).
const skills = [
  {
    id: 'data',
    question: L('What technologies does he work with?', 'Mit welchen Technologien arbeitet er?'),
    answer: L(
      'Let us start with data analytics: Python with Pandas, NumPy, Seaborn and pyplot, plus SQL, Tableau, R and Excel. Python, SQL and Tableau are rated "very good" on his résumé.',
      'Beginnen wir mit der Datenanalyse: Python mit Pandas, NumPy, Seaborn und pyplot, dazu SQL, Tableau, R und Excel. Python, SQL und Tableau sind in seinem Lebenslauf mit „sehr gut“ bewertet.',
    ),
    name: L('Data Analytics', 'Datenanalyse'),
    icon: 'chart', // mapped to a Lucide icon in SkillCard.jsx
    items: [
      { name: 'Python', level: VERY_GOOD },
      { name: 'Pandas' },
      { name: 'NumPy' },
      { name: 'Seaborn' },
      { name: 'pyplot' },
      { name: 'SQL', level: VERY_GOOD },
      { name: 'Tableau', level: VERY_GOOD },
      { name: 'R', level: GOOD },
      { name: 'Excel', level: GOOD },
    ],
  },
  {
    id: 'web',
    question: L('What about web development?', 'Und in der Webentwicklung?'),
    answer: L(
      'For the web he builds with React JS, HTML, CSS and Tailwind CSS — all rated "very good" — plus NodeJS and MongoDB.',
      'Im Web arbeitet er mit React JS, HTML, CSS und Tailwind CSS — alle mit „sehr gut“ bewertet — sowie mit NodeJS und MongoDB.',
    ),
    name: L('Web Development', 'Webentwicklung'),
    icon: 'code',
    items: [
      { name: 'React JS', level: VERY_GOOD },
      { name: 'HTML', level: VERY_GOOD },
      { name: 'CSS', level: VERY_GOOD },
      { name: 'Tailwind CSS', level: VERY_GOOD },
      { name: 'NodeJS', level: GOOD },
      { name: 'MongoDB', level: GOOD },
    ],
  },
  {
    id: 'cloud',
    question: L('And data science or cloud?', 'Und bei Data Science oder Cloud?'),
    answer: L(
      'From his master\'s degree he brings machine learning, predictive analytics, data visualization and AWS.',
      'Aus seinem Masterstudium bringt er Machine Learning, Predictive Analytics, Datenvisualisierung und AWS mit.',
    ),
    name: L('Data / Cloud', 'Daten / Cloud'),
    icon: 'cloud',
    items: [
      { name: 'Machine Learning' },
      { name: 'Predictive Analytics' },
      { name: 'AWS' },
      { name: L('Data Visualization', 'Datenvisualisierung') },
    ],
  },
]

// cefr: position on the A1–C2 scale (1–6). A native language fills the scale.
const languages = [
  {
    id: 'ta',
    name: 'Tamil',
    level: L('Native', 'Muttersprache'),
    description: L('Native speaker', 'Muttersprachler'),
    native: true,
    cefr: 6,
  },
  {
    id: 'en',
    name: L('English', 'Englisch'),
    level: 'C1',
    description: L('Fluent in speaking and writing', 'Fließend in Wort und Schrift'),
    cefr: 5,
  },
  { id: 'de', name: L('German', 'Deutsch'), level: 'B2', description: L('Good knowledge', 'Gute Kenntnisse'), cefr: 4 },
]

// ─────────────────────────────────────────────────────────────
// The conversation: every question and AI answer on the page.
// ─────────────────────────────────────────────────────────────
const conversation = {
  // The ChatGPT-style home screen
  hero: {
    heading: L('Tejeshwaran is a Web Developer and Data Analyst', 'Tejeshwaran ist Webentwickler und Datenanalyst'),
    placeholder: L('Typing ❌ Just scrolling ✅', 'Tippen ❌ Einfach scrollen ✅'),
  },
  about: {
    question: L('Who is Tejeshwaran?', 'Wer ist Tejeshwaran?'),
    answer: L(
      "Tejeshwaran Manoharan is a Data Analytics Master's graduate with a Bachelor's degree in Computer Applications. His background combines data analytics, machine learning, data visualization and web development.",
      'Tejeshwaran Manoharan hat einen Master in Data Analytics und einen Bachelor in Computer Applications. Sein Profil verbindet Datenanalyse, Machine Learning, Datenvisualisierung und Webentwicklung.',
    ),
    focusAreas: [L('Data Analytics', 'Datenanalyse'), 'Machine Learning', 'AI Engineer', L('Web Development', 'Webentwicklung')],
  },
  education: {
    question: L('What is his educational background?', 'Welche Ausbildung hat er?'),
    answer: L(
      'He holds a Master of Science in Data Analytics from Berlin and a Bachelor of Computer Applications. Here is the timeline:',
      'Er hat einen Master of Science in Data Analytics aus Berlin und einen Bachelor of Computer Applications. Hier ist der Zeitstrahl:',
    ),
  },
  experience: {
    question: L('What professional experience does he have?', 'Welche Berufserfahrung hat er?'),
    answer: L(
      'He worked as a Web Development Intern at HermitCrabs, where he focused on front-end development, UI components and web applications, and worked with HubSpot CRM.',
      'Er war Praktikant in der Webentwicklung bei HermitCrabs. Dort hat er sich auf Frontend-Entwicklung, UI-Komponenten und Webanwendungen konzentriert und mit HubSpot CRM gearbeitet.',
    ),
  },
  skills: {
    question: L('What technologies does he work with?', 'Mit welchen Technologien arbeitet er?'),
    answer: L(
      'His strongest technical areas are data analytics, visualization and frontend development. I grouped his skills into three categories:',
      'Seine größten technischen Stärken sind Datenanalyse, Visualisierung und Frontend-Entwicklung. Ich habe seine Kenntnisse in drei Kategorien eingeteilt:',
    ),
  },
  languages: {
    question: L('What languages does he speak?', 'Welche Sprachen spricht er?'),
    answer: L(
      'He speaks three languages: Tamil as his native language, fluent English and good German.',
      'Er spricht drei Sprachen: Tamil als Muttersprache, fließend Englisch und gut Deutsch.',
    ),
  },
  why: {
    sectionTitle: L('Why is this portfolio built differently?', 'Warum ist dieses Portfolio anders aufgebaut?'),
    question: L('Why did he build this portfolio as an AI interface?', 'Warum hat er dieses Portfolio als KI-Oberfläche gebaut?'),
    answer: L(
      'Because Tejeshwaran is interested in the intersection of data, software and AI. Instead of presenting his résumé as a static document, he wanted to turn the portfolio itself into an interactive AI experience.',
      'Weil Tejeshwaran sich für die Schnittstelle von Daten, Software und KI interessiert. Statt seinen Lebenslauf als statisches Dokument zu zeigen, wollte er das Portfolio selbst zu einem interaktiven KI-Erlebnis machen.',
    ),
    parts: [L('Data Analytics', 'Datenanalyse'), L('Frontend Development', 'Frontend-Entwicklung'), L('AI Interface', 'KI-Oberfläche')],
    result: L('Interactive Portfolio', 'Interaktives Portfolio'),
  },
  // "Apart from IT": the table tennis slide (sections/BeyondWork.jsx)
  beyond: {
    question: L('What does he do apart from IT?', 'Was macht er abseits der IT?'),
    answer: L(
      'Away from the screen, he is a table tennis player from Tamil Nadu. The game keeps him fit and healthy.',
      'Abseits des Bildschirms ist er Tischtennisspieler aus Tamil Nadu. Das Spiel hält ihn fit und gesund.',
    ),
    // The word that bursts out of the bouncing ball
    sport: L('Table Tennis', 'Tischtennis'),
    // Small tags under the animation. `icon` is mapped in BeyondWork.jsx.
    facts: [
      { icon: 'ball', text: L('Table tennis player', 'Tischtennisspieler') },
      { icon: 'location', text: L('Tamil Nadu, India', 'Tamil Nadu, Indien') },
      { icon: 'health', text: L('Fit & healthy', 'Fit & gesund') },
    ],
  },
  closing: {
    question: L('Is that everything?', 'Ist das alles?'),
    answer: L(
      "That's everything for now. Thanks for reading — here is how to reach him.",
      'Das ist erst einmal alles. Danke fürs Lesen — so erreichst du ihn.',
    ),
  },
}

// ─────────────────────────────────────────────────────────────
// The onboarding: three short pages shown before the portfolio
// (src/onboarding/Onboarding.jsx). Written to the Langdock team.
// The "short version" table on page 3 is built from the data above.
// ─────────────────────────────────────────────────────────────
const onboarding = {
  badge: L('Application for Langdock', 'Bewerbung bei Langdock'),
  hello: {
    eyebrow: 'Portfolio', // small label above the intro headline and the home-screen headline
    title: L('Hello, Langdock team.', 'Hallo, Langdock-Team.'),
    body: L(
      'Thank you for opening my application. Instead of sending another PDF, I turned my résumé into a small AI product — you can ask it anything, and it answers from my real experience.',
      'Danke, dass Sie meine Bewerbung öffnen. Statt eines weiteren PDFs habe ich meinen Lebenslauf in ein kleines KI-Produkt verwandelt — Sie können ihm jede Frage stellen, und es antwortet aus meiner echten Erfahrung.',
    ),
    signature: '— Tejeshwaran Manoharan, Berlin',
    // The little terminal that "boots" the portfolio
    bootLines: [
      { text: 'open tejeshwaran.portfolio', isCommand: true },
      { text: L('loading résumé data', 'Lebenslaufdaten laden'), status: 'ok' },
      { text: L('languages: en · de', 'Sprachen: en · de'), status: 'ok' },
      { text: L('answer engine: local, no API', 'Antwort-Engine: lokal, keine API'), status: L('ready', 'bereit') },
    ],
  },
  summary: {
    eyebrow: L('TL;DR', 'Kurz gesagt'),
    title: L('The short version.', 'Die Kurzfassung.'),
    role: L('Web Developer & Data Analyst', 'Webentwickler & Datenanalyst'),
    closing: L(
      'That is the summary. The details are one conversation away.',
      'Das ist die Zusammenfassung. Die Details sind nur ein Gespräch entfernt.',
    ),
  },
}

// ─────────────────────────────────────────────────────────────
// "Ask the Portfolio" — the simulated LLM used on the home screen
// and in the Ask section. The answers are built in buildResponses()
// below; the matching lives in src/utils/answerEngine.js.
// ─────────────────────────────────────────────────────────────
const askPortfolio = {
  heading: L("Ask Tejeshwaran's Portfolio", 'Frag Tejeshwarans Portfolio'),
  placeholder: L('Ask anything about my experience...', 'Frag mich etwas zu meiner Erfahrung …'),
  greeting: L(
    "Hi! I'm a small assistant that answers from Tejeshwaran's résumé. I run fully in your browser — no real LLM involved. Try a question below.",
    'Hallo! Ich bin ein kleiner Assistent und antworte auf Basis von Tejeshwarans Lebenslauf. Ich laufe komplett in deinem Browser — ohne echtes LLM. Probier eine der Fragen unten aus.',
  ),

  // Typed into the home prompt bar by the header buttons
  contactQuestion: L('How can I contact Tejeshwaran?', 'Wie kann ich Tejeshwaran kontaktieren?'),
  languageQuestions: {
    toGerman: 'Change the entire website to German',
    toEnglish: 'Change the language from German to English',
  },

  // Topics in the "+" menu of the prompt bar. `icon` is mapped to a
  // Lucide icon in PromptComposer.jsx.
  topics: [
    { label: L('Education', 'Ausbildung'), icon: 'education', question: L('What did Tejeshwaran study?', 'Was hat Tejeshwaran studiert?') },
    { label: L('Experience', 'Erfahrung'), icon: 'experience', question: L('What professional experience does he have?', 'Welche Berufserfahrung hat er?') },
    { label: L('Projects', 'Projekte'), icon: 'projects', question: L('What projects has he built?', 'Welche Projekte hat er gebaut?') },
    { label: 'Pillo', icon: 'pillo', question: L('Tell me about Pillo.', 'Erzähl mir von Pillo.') },
    { label: L('Skills', 'Kenntnisse'), icon: 'skills', question: L('What are his strongest technical skills?', 'Was sind seine größten technischen Stärken?') },
    { label: L('Languages', 'Sprachen'), icon: 'languages', question: L('What languages does he speak?', 'Welche Sprachen spricht er?') },
    { label: L('Contact', 'Kontakt'), icon: 'contact', question: L('How can I contact Tejeshwaran?', 'Wie kann ich Tejeshwaran kontaktieren?') },
  ],
  suggestions: [
    L('What did Tejeshwaran study?', 'Was hat Tejeshwaran studiert?'),
    L('What are his strongest technical skills?', 'Was sind seine größten technischen Stärken?'),
    L('Tell me about the Sales Dashboard.', 'Erzähl mir vom Sales-Dashboard.'),
    L('What frontend technologies does he know?', 'Welche Frontend-Technologien kennt er?'),
    L('What languages does he speak?', 'Welche Sprachen spricht er?'),
    L('Where can I see his portfolio?', 'Wo kann ich sein Portfolio sehen?'),
    L('What is he building right now?', 'Woran arbeitet er gerade?'),
  ],
  fallback: L(
    "I don't have that in my résumé data. Try asking about his education, experience, projects, skills or languages.",
    'Dazu habe ich nichts in seinem Lebenslauf. Frag mich nach seiner Ausbildung, Erfahrung, seinen Projekten, Kenntnissen oder Sprachen.',
  ),
}

// ─────────────────────────────────────────────────────────────
// Building the data for one language
// ─────────────────────────────────────────────────────────────

/** Walk through the data and replace every L(en, de) with one language */
function pickLanguage(value, language) {
  if (Array.isArray(value)) return value.map((item) => pickLanguage(item, language))
  if (value && typeof value === 'object') {
    if (value.__bilingual) return value[language]
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, pickLanguage(item, language)]))
  }
  return value
}

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1)

/**
 * The chat answers, written from the data so they never disagree with it.
 * Each response has keywords in BOTH languages, so visitors can ask in
 * English or German. The FIRST response with a keyword inside the question
 * wins, so the order matters (specific topics come first).
 * Tip: put spaces around a keyword (' hi ') to match only the whole word.
 */
function buildResponses(data, language) {
  const de = language === 'de'
  const { personal: me, education: degrees, experience: jobs, projects: work, skills: skillGroups } = data
  const [masters, bachelors] = degrees
  const job = jobs[0]
  const dashboard = work.find((project) => project.id === 'sales-dashboard')
  const pillo = work.find((project) => project.id === 'pillo')
  const listSkills = (groupId) =>
    skillGroups
      .find((group) => group.id === groupId)
      .items.map((item) => item.name)
      .join(', ')
  const veryGoodSkills = skillGroups
    .flatMap((group) => group.items)
    .filter((item) => item.level?.key === 'very-good')
    .map((item) => item.name)
    .join(', ')

  // Contact cards shown under an answer. `icon` is mapped in ContactDetails.jsx.
  const contactCards = [
    { id: 'email', label: de ? 'E-Mail' : 'Email', value: me.email, href: `mailto:${me.email}`, icon: 'email' },
    { id: 'location', label: de ? 'Standort' : 'Location', value: me.location, icon: 'location' },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: me.linkedin.replace(/^https?:\/\/(www\.)?/, ''),
      href: me.linkedin,
      icon: 'linkedin',
    },
  ].filter((card) => card.value)

  return [
    {
      topic: 'portfolio',
      keywords: ['portfolio', 'website', 'webseite', 'site', 'github pages', 'deployed', 'veröffentlicht'],
      answer: de
        ? `Seine persönliche Portfolio-Website findest du unter ${me.portfolioUrl}. Er hat sie mit React.js, Tailwind CSS und Vite gebaut und veröffentlicht.`
        : `You can see his personal portfolio website at ${me.portfolioUrl}. He built and deployed it with React.js, Tailwind CSS and Vite.`,
      // Optional button shown under the answer
      link: { label: de ? 'Portfolio öffnen' : 'Open portfolio', href: me.portfolioUrl },
    },
    {
      topic: 'pillo',
      keywords: [
        'pillo', 'dictation', 'diktier', 'voice app', 'speech', 'sprachmodell', 'c#', '.net', 'wpf', 'windows',
        'claude', 'right now', 'working on', 'currently', 'gerade', 'woran', 'aktuell',
      ],
      answer: de
        ? `${pillo.title} ist ${lowerFirst(pillo.description)} Er entwickelt es gemeinsam mit ${pillo.collaborator} und nutzt ${pillo.tech.join(', ')}. Status: ${pillo.status}.`
        : `${pillo.title} is ${lowerFirst(pillo.description)} He builds it together with ${pillo.collaborator}, using ${pillo.tech.join(', ')}. Status: ${lowerFirst(pillo.status)}.`,
    },
    {
      topic: 'hobbies',
      keywords: [
        'hobby', 'hobbies', 'free time', 'spare time', 'sport', 'table tennis', 'ping pong', 'apart from',
        'outside of', 'freizeit', 'tischtennis', 'abseits', 'neben der',
      ],
      answer: data.conversation.beyond.answer,
    },
    {
      topic: 'dashboard',
      keywords: ['dashboard', 'sales', 'tableau', 'bi ', 'vertrieb'],
      answer: de
        ? `${dashboard.description} Es umfasst: ${dashboard.capabilities.join(', ')}. Technologien: ${dashboard.tech.join(', ')}.`
        : `The ${dashboard.title} is ${lowerFirst(dashboard.description)} It includes ${dashboard.capabilities.join(', ').toLowerCase()}. Built with ${dashboard.tech.join(', ')}.`,
    },
    {
      topic: 'frontend',
      keywords: ['frontend', 'front-end', 'front end', 'react', 'web', 'tailwind', 'html', 'css', 'javascript'],
      answer: de
        ? `Für Frontend und Webentwicklung arbeitet er mit ${listSkills('web')}. React JS, HTML, CSS und Tailwind CSS sind in seinem Lebenslauf mit „sehr gut“ bewertet.`
        : `For frontend and web development he works with ${listSkills('web')}. React JS, HTML, CSS and Tailwind CSS are rated "very good" on his résumé.`,
    },
    {
      topic: 'languages',
      keywords: ['speak', 'language', 'german', 'english', 'tamil', 'deutsch', 'englisch', 'sprach', 'spricht'],
      answer: `${de ? 'Er spricht' : 'He speaks'} ${data.languages
        .map((lang) =>
          lang.native
            ? `${lang.name} (${de ? lang.level : lowerFirst(lang.level)})` // German nouns stay capitalised
            : `${lang.name} (${lang.level}, ${lowerFirst(lang.description)})`,
        )
        .join(', ')}.`,
    },
    {
      topic: 'education',
      keywords: [
        'study', 'studied', 'studi', 'education', 'ausbildung', 'degree', 'abschluss', 'university', 'universität',
        'hochschule', 'master', 'bachelor', 'grade', ' note ', 'school', 'college',
      ],
      answer: de
        ? `Er hat einen ${masters.degree} abgeschlossen (${masters.school}, ${masters.start} – ${masters.end}, Note ${masters.grade}) und davor einen ${bachelors.degree} (${bachelors.school}, ${bachelors.start} – ${bachelors.end}, Note ${bachelors.grade}).`
        : `He completed a ${masters.degree} at ${masters.school} (${masters.start} – ${masters.end}, grade ${masters.grade}), and before that a ${bachelors.degree} at ${bachelors.school} (${bachelors.start} – ${bachelors.end}, grade ${bachelors.grade}).`,
    },
    {
      topic: 'experience',
      keywords: ['experience', 'erfahrung', 'work', 'arbeit', 'job', 'intern', 'praktik', 'beruf', 'hermitcrabs', 'hubspot', 'crm', 'employ'],
      answer: de
        ? `Er war ${job.role} bei ${job.company} (${job.start} – ${job.end}). Seine Aufgaben: ${job.responsibilities.join(', ')}.`
        : `He was a ${job.role} at ${job.company} (${job.start} – ${job.end}). His work covered ${job.responsibilities.join(', ').toLowerCase()}.`,
    },
    {
      topic: 'projects',
      keywords: ['project', 'projekt', 'built', 'build', 'gebaut', 'entwickelt', 'made', 'create'],
      answer: de
        ? `Er hat ${work.length} Projekte: ${work.map((project) => `${project.title} (${project.tech.join(', ')})`).join('; ')}.`
        : `He has ${work.length} projects: ${work.map((project) => `${project.title} (${project.tech.join(', ')})`).join('; ')}.`,
    },
    {
      topic: 'skills',
      keywords: [
        'skill', 'kenntnis', 'technolog', 'technisch', 'stack', 'tool', 'python', 'sql', 'strong', 'stärke',
        'fähigkeit', 'good at', 'data', 'daten', 'machine learning', 'aws',
      ],
      answer: de
        ? `Seine größten Stärken sind Datenanalyse, Visualisierung und Frontend-Entwicklung. Mit „sehr gut“ bewertet: ${veryGoodSkills}. Außerdem: ${listSkills('cloud')}.`
        : `His strongest areas are data analytics, visualization and frontend development. Rated "very good": ${veryGoodSkills}. Also: ${listSkills('cloud')}.`,
    },
    {
      topic: 'contact',
      keywords: [
        'contact', 'kontakt', 'email', 'e-mail', 'mail', 'reach', 'erreich', 'hire', 'linkedin', 'where', ' wo ',
        'location', 'standort', 'berlin',
      ],
      answer: de
        ? `Du erreichst ${me.firstName} per E-Mail unter ${me.email}. Er ist in ${me.location} ansässig.`
        : `You can reach ${me.firstName} by email at ${me.email}. He is based in ${me.location}.`,
      // Shown under the answer as contact cards (email, location …)
      details: contactCards,
    },
    {
      topic: 'about',
      keywords: [
        'who ', 'wer ', 'about him', 'über ihn', 'tell me about', 'summary', 'zusammenfassung', 'introduce',
        'vorstell', 'background', 'tejeshwaran',
      ],
      answer: data.conversation.about.answer,
    },
    {
      topic: 'greeting',
      keywords: [' hi ', ' hello ', ' hey ', ' hallo ', ' moin ', ' servus ', ' thanks ', ' thank you ', ' danke '],
      answer: de
        ? 'Hallo! Frag mich nach seiner Ausbildung, Erfahrung, seinen Projekten, Kenntnissen oder Sprachen — oder scroll nach unten, um das ganze Gespräch zu lesen.'
        : 'Hello! Ask me about his education, experience, projects, skills or languages — or scroll down to read the full conversation.',
    },
  ]
}

/**
 * Everything the website needs, in one language ('en' or 'de').
 * Components get it through useLanguage().data (src/i18n/LanguageContext.jsx).
 */
export function createPortfolioData(language) {
  const data = pickLanguage(
    { personal, education, experience, projects, skills, languages, conversation, askPortfolio, onboarding },
    language,
  )
  data.askPortfolio.responses = buildResponses(data, language)
  return data
}
