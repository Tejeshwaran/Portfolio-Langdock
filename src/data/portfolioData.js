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
// Rule: only put information here that is on the CV (July 2026, public/cv/)
// or visible in the projects themselves. No invented numbers or results.
// ─────────────────────────────────────────────────────────────

/** A text in two languages */
const L = (en, de) => ({ __bilingual: true, en, de })

const personal = {
  name: 'Tejeshwaran Manoharan',
  firstName: 'Tejeshwaran',
  // The professional direction, shown under the name
  role: L('Data & AI-focused developer', 'Data- & KI-orientierter Entwickler'),
  tagline: L('Data analytics · Web development · AI', 'Datenanalyse · Webentwicklung · KI'),
  location: L('Berlin, Germany', 'Berlin, Deutschland'),
  email: 'tejeshmanoharan@gmail.com',
  // Shown on purpose (Tejeshwaran asked for it, 2026-09-30). To hide one,
  // set it to '' — every place that shows it disappears automatically.
  phone: '+49 163 4916554',
  address: 'Am Kinderdorf 53, 14089 Berlin',
  birthDate: L('16 August 2002', '16. August 2002'),
  github: 'https://github.com/Tejeshwaran',
  repository: 'https://github.com/Tejeshwaran/Portfolio-Langdock',
  // Add your LinkedIn profile URL here. While it is empty, the LinkedIn
  // links are hidden automatically everywhere on the site.
  linkedin: '',
  // The CV in the site's language (files in public/cv/)
  cv: L('cv/Tejeshwaran-Manoharan-CV.pdf', 'cv/Tejeshwaran-Manoharan-Lebenslauf.pdf'),
  // The application this site was made for
  targetRole: 'AI Associate',
  targetCompany: 'Langdock',
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
      L('Front-end development: UI components and web applications', 'Frontend-Entwicklung: UI-Komponenten und Webanwendungen'),
      L(
        'Used HubSpot CRM to support marketing and sales processes',
        'Nutzung von HubSpot CRM zur Unterstützung von Marketing- und Vertriebsprozessen',
      ),
    ],
    tags: [L('Front-end', 'Frontend'), L('UI components', 'UI-Komponenten'), L('Web applications', 'Webanwendungen'), 'HubSpot CRM'],
  },
]

// Each project is shown as its own question → answer (one slide each).
// A project is told as a small case study:
//   caseStudy.problem / approach / result  — three short sentences
//   pipeline      — how it works, as steps (shown as a flow)
//   capabilities  — the details behind the "Case study" button
// Only facts from the CV or the project itself — no invented results.
const projects = [
  {
    id: 'sales-dashboard',
    number: '01',
    type: 'dashboard',
    question: L('What has he built?', 'Was hat er gebaut?'),
    answer: L(
      'His main data project is an interactive sales dashboard. With SQL and Python he cleaned and prepared sales and customer data, then built KPI views in Tableau for reports and business insights.',
      'Sein wichtigstes Datenprojekt ist ein interaktives Sales-Dashboard. Mit SQL und Python hat er Vertriebs- und Kundendaten bereinigt und aufbereitet und daraus KPI-Ansichten in Tableau für Berichte und geschäftliche Erkenntnisse gebaut.',
    ),
    title: L('Sales Dashboard', 'Sales-Dashboard'),
    subtitle: L('Interactive BI dashboard for sales and customer data.', 'Interaktives BI-Dashboard für Vertriebs- und Kundendaten.'),
    tech: ['SQL', 'Python', 'Tableau'],
    caseStudy: {
      problem: L(
        'Sales and customer data had to be analysed in one place — for reports and business insights.',
        'Vertriebs- und Kundendaten sollten an einem Ort analysiert werden — für Berichte und geschäftliche Erkenntnisse.',
      ),
      approach: L(
        'Cleaned and processed the data with Python, then built an interactive BI dashboard in Tableau.',
        'Daten mit Python bereinigt und verarbeitet, dann ein interaktives BI-Dashboard in Tableau gebaut.',
      ),
      result: L(
        'KPI-based visualizations that make the numbers easy to read in reports.',
        'KPI-basierte Visualisierungen, die die Zahlen in Berichten leicht lesbar machen.',
      ),
    },
    pipeline: [
      L('Sales & customer data', 'Vertriebs- & Kundendaten'),
      L('Cleaning · Python', 'Bereinigung · Python'),
      L('Dashboard · Tableau', 'Dashboard · Tableau'),
      L('KPI reports', 'KPI-Berichte'),
    ],
    capabilities: [
      L('Data cleaning and processing with Python', 'Datenbereinigung und -verarbeitung mit Python'),
      L('KPI-based visualizations', 'KPI-basierte Visualisierungen'),
      L('Reports', 'Berichte'),
      L('Business insights', 'Geschäftliche Erkenntnisse'),
    ],
  },
  {
    id: 'pillo',
    number: '02',
    type: 'app',
    question: L('What is he building right now?', 'Woran arbeitet er gerade?'),
    answer: L(
      'Right now he is building Pillo for Windows, together with Claude AI: press a hotkey, speak, and your words appear wherever your cursor is. The speech model runs directly on the device.',
      'Gerade entwickelt er gemeinsam mit Claude AI „Pillo für Windows“: Tastenkürzel drücken, sprechen — und die Worte erscheinen dort, wo der Cursor steht. Das Sprachmodell läuft direkt auf dem Gerät.',
    ),
    title: L('Pillo for Windows', 'Pillo für Windows'),
    subtitle: L('On-device voice dictation for Windows.', 'Sprachdiktat für Windows, direkt auf dem Gerät.'),
    status: L('In development', 'In Entwicklung'),
    collaborator: 'Claude AI',
    tech: ['C#', '.NET 10', 'WPF', 'NAudio', 'sherpa-onnx', L('Parakeet speech model', 'Parakeet-Sprachmodell')],
    caseStudy: {
      problem: L(
        'Typing everything by hand is slow. The goal: dictate into any Windows app, with speech recognition running on the PC itself.',
        'Alles von Hand zu tippen ist langsam. Das Ziel: in jede Windows-App diktieren, mit Spracherkennung direkt auf dem PC.',
      ),
      approach: L(
        'Porting the macOS dictation app Pillo to Windows, together with Claude AI: C# and WPF for the app, NAudio for the microphone, sherpa-onnx to run the Parakeet speech model locally.',
        'Portierung der macOS-Diktier-App Pillo auf Windows, gemeinsam mit Claude AI: C# und WPF für die App, NAudio für das Mikrofon, sherpa-onnx für das lokale Parakeet-Sprachmodell.',
      ),
      result: L(
        'In development. The app already runs on Windows — onboarding, design and the text pipeline are in place.',
        'In Entwicklung. Die App läuft bereits unter Windows — Onboarding, Design und Text-Pipeline stehen.',
      ),
    },
    pipeline: [
      L('Hotkey', 'Tastenkürzel'),
      L('Microphone · NAudio', 'Mikrofon · NAudio'),
      L('Speech model on the device', 'Sprachmodell auf dem Gerät'),
      L('Text at the cursor', 'Text am Cursor'),
    ],
    capabilities: [
      L('Global hotkey to start dictation', 'Globales Tastenkürzel zum Starten des Diktats'),
      L('On-device speech recognition', 'Spracherkennung direkt auf dem Gerät'),
      L('Text typed at the cursor in any app', 'Text erscheint am Cursor in jeder App'),
      L('Dictionary, formatting and voice shortcuts', 'Wörterbuch, Formatierung und Sprachbefehle'),
      L('Floating pill overlay', 'Schwebendes Pill-Overlay'),
      L('Transcript history', 'Verlauf der Transkripte'),
    ],
  },
]

// Skill levels are written exactly as on the CV ("Advanced" / "Good").
// Items without a level show no badge. `learning: true` = learning it now,
// shown differently so nothing looks bigger than it is.
// `evidence` says where the group was actually used.
// `aliases` help the chat recognise a skill in a question ("Does he know React?").
const ADVANCED = { key: 'advanced', label: L('Advanced', 'Sehr gut') }
const GOOD = { key: 'good', label: L('Good', 'Gut') }

// In slide mode each skill group is its own slide (question / answer below).
const skills = [
  {
    id: 'data',
    question: L('What data tools does he work with?', 'Mit welchen Daten-Tools arbeitet er?'),
    answer: L(
      'Data is his core: Python with pandas, NumPy, Seaborn and pyplot, plus SQL and Tableau — all rated advanced on his CV. He used them in his Master\'s and in the Sales Dashboard.',
      'Daten sind sein Kern: Python mit pandas, NumPy, Seaborn und pyplot, dazu SQL und Tableau — alle im Lebenslauf mit „sehr gut“ bewertet. Er hat sie im Master und im Sales-Dashboard eingesetzt.',
    ),
    name: L('Data & analytics', 'Daten & Analyse'),
    icon: 'chart', // mapped to a Lucide icon in SkillCard.jsx
    evidence: L('Used in: Sales Dashboard · M.Sc. Data Analytics', 'Eingesetzt in: Sales-Dashboard · M.Sc. Data Analytics'),
    items: [
      { name: 'Python', level: ADVANCED },
      { name: 'pandas' },
      { name: 'NumPy' },
      { name: 'Seaborn' },
      { name: 'pyplot' },
      { name: 'SQL', level: ADVANCED, aliases: [' sql', 'sql '] },
      { name: 'Tableau', level: ADVANCED },
      { name: 'MySQL', level: GOOD },
      { name: 'R', level: GOOD, aliases: [' r ', ' r?', 'r language', 'r-'] },
      { name: 'Excel', level: GOOD },
    ],
  },
  {
    id: 'web',
    question: L('And web development?', 'Und Webentwicklung?'),
    answer: L(
      'For the web he works with React, HTML, CSS and Tailwind CSS — rated advanced on his CV — plus Node.js and MongoDB. He did front-end work in his internship, and this portfolio is built with React, Tailwind CSS and Vite.',
      'Im Web arbeitet er mit React, HTML, CSS und Tailwind CSS — im Lebenslauf mit „sehr gut“ bewertet — sowie mit Node.js und MongoDB. Im Praktikum hat er im Frontend gearbeitet, und dieses Portfolio ist mit React, Tailwind CSS und Vite gebaut.',
    ),
    name: L('Web development', 'Webentwicklung'),
    icon: 'code',
    evidence: L('Used in: HermitCrabs internship · this portfolio', 'Eingesetzt in: Praktikum bei HermitCrabs · diesem Portfolio'),
    items: [
      { name: 'React', level: ADVANCED, aliases: ['react'] },
      { name: 'JavaScript', aliases: ['javascript', ' js '] },
      { name: 'HTML', level: ADVANCED },
      { name: 'CSS', level: ADVANCED, aliases: [' css'] },
      { name: 'Tailwind CSS', level: ADVANCED, aliases: ['tailwind'] },
      { name: 'Node.js', level: GOOD, aliases: ['node'] },
      { name: 'MongoDB', level: GOOD, aliases: ['mongo'] },
      { name: 'Vite' },
      { name: 'Git & GitHub', aliases: [' git ', 'github'] },
      { name: L('Figma · UI/UX', 'Figma · UI/UX'), learning: true, aliases: ['figma', 'ui/ux', 'ux design'] },
    ],
  },
  {
    id: 'ai',
    question: L('What about AI and machine learning?', 'Und KI und Machine Learning?'),
    answer: L(
      'He studied machine learning and predictive analytics in his Master\'s, including big-data analysis on AWS. With Pillo he runs a speech model on a normal PC, and right now he is learning how LLM applications, AI agents and MCP work.',
      'Im Master hat er Machine Learning und Predictive Analytics studiert, inklusive Big-Data-Analyse auf AWS. Mit Pillo lässt er ein Sprachmodell auf einem normalen PC laufen, und gerade lernt er, wie LLM-Anwendungen, KI-Agenten und MCP funktionieren.',
    ),
    name: L('AI & machine learning', 'KI & Machine Learning'),
    icon: 'ai',
    evidence: L('Studied in the M.Sc. · used in Pillo · learning now', 'Im M.Sc. studiert · in Pillo eingesetzt · lerne ich gerade'),
    items: [
      { name: 'Machine Learning', aliases: ['machine learning', ' ml '] },
      { name: 'Predictive Analytics', aliases: ['predictive'] },
      { name: L('Data Visualization', 'Datenvisualisierung'), aliases: ['visuali'] },
      { name: 'AWS', aliases: ['aws', 'amazon web'] },
      { name: L('On-device speech models', 'Sprachmodelle auf dem Gerät'), aliases: ['speech model', 'sprachmodell', 'onnx'] },
      { name: L('C# / .NET (basic)', 'C# / .NET (Grundlagen)'), aliases: ['c#', '.net', 'dotnet'] },
      { name: L('LLM applications', 'LLM-Anwendungen'), learning: true, aliases: ['llm'] },
      { name: L('AI agents', 'KI-Agenten'), learning: true, aliases: ['agent'] },
      { name: 'MCP', learning: true, aliases: [' mcp', 'model context'] },
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
    // The start page: who, what, where — readable in a few seconds
    badge: L('Applying for AI Associate at Langdock', 'Bewerbung als AI Associate bei Langdock'),
    heading: L("Hi, I'm Tejeshwaran.", 'Hallo, ich bin Tejeshwaran.'),
    subheading: L(
      'Data & AI-focused developer in Berlin. I analyse data, build web apps — and want to understand how AI really behaves.',
      'Data- & KI-orientierter Entwickler in Berlin. Ich analysiere Daten, baue Web-Apps — und will verstehen, wie KI wirklich funktioniert.',
    ),
    // Four quick facts under the headline
    highlights: ['M.Sc. Data Analytics', 'Python · SQL · Tableau', 'React', L('English C1 · German B2', 'Englisch C1 · Deutsch B2')],
    placeholder: L('Typing ❌ Just scrolling ✅', 'Tippen ❌ Einfach scrollen ✅'),
  },
  about: {
    question: L('Who is Tejeshwaran?', 'Wer ist Tejeshwaran?'),
    answer: L(
      'Tejeshwaran Manoharan is a Data & AI-focused developer in Berlin. He holds a Master of Science in Data Analytics and a Bachelor of Computer Applications, analyses data with Python, SQL and Tableau, and builds web interfaces with React. Right now he is building Pillo, an on-device dictation app, together with Claude AI.',
      'Tejeshwaran Manoharan ist ein Data- & KI-orientierter Entwickler in Berlin. Er hat einen Master of Science in Data Analytics und einen Bachelor of Computer Applications, analysiert Daten mit Python, SQL und Tableau und baut Web-Oberflächen mit React. Gerade entwickelt er gemeinsam mit Claude AI Pillo, eine Diktier-App, die direkt auf dem Gerät läuft.',
    ),
    focusAreas: [
      L('Data analytics', 'Datenanalyse'),
      L('Web development', 'Webentwicklung'),
      'Machine Learning',
      L('LLM apps — learning', 'LLM-Apps — lerne ich'),
    ],
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
    sectionTitle: L('Why Langdock?', 'Warum Langdock?'),
    question: L('Why Langdock — and why the AI Associate program?', 'Warum Langdock — und warum das AI-Associate-Programm?'),
    answer: L(
      'Langdock brings the leading AI models into one secure platform for whole organisations — so the real questions about how AI behaves arrive in support. That is the part he wants to understand: why a model answers differently, where an agent breaks, why an integration fails. He brings an analyst\'s habit of finding out what is really happening, a web developer\'s feel for interfaces, and clear explanations in English and German.',
      'Langdock bringt die führenden KI-Modelle in eine sichere Plattform für ganze Organisationen — deshalb landen die echten Fragen dazu, wie sich KI verhält, im Support. Genau das will er verstehen: warum ein Modell anders antwortet, wo ein Agent scheitert, warum eine Integration abbricht. Er bringt die Gewohnheit eines Analysten mit, herauszufinden, was wirklich passiert, das Gespür eines Webentwicklers für Oberflächen und klare Erklärungen auf Englisch und Deutsch.',
    ),
    // What the program asks for → where he has shown it (only real things)
    fits: [
      {
        need: L('Curious how AI really works', 'Neugierig, wie KI wirklich funktioniert'),
        proof: L(
          'Studied machine learning; runs a speech model on a normal PC in Pillo; this chat\'s Think mode shows every step of an answer.',
          'Hat Machine Learning studiert; lässt in Pillo ein Sprachmodell auf einem normalen PC laufen; der Nachdenk-Modus dieses Chats zeigt jeden Schritt einer Antwort.',
        ),
      },
      {
        need: L('Thinks in systems, loves analysis', 'Denkt in Systemen, analysiert gern'),
        proof: L(
          'M.Sc. Data Analytics; cleaned and analysed sales and customer data for a Tableau dashboard.',
          'M.Sc. Data Analytics; hat Vertriebs- und Kundendaten für ein Tableau-Dashboard bereinigt und analysiert.',
        ),
      },
      {
        need: L('Experiments with new tools', 'Probiert neue Tools aus'),
        proof: L(
          'Builds Pillo together with Claude AI, and turned his CV into this interactive portfolio.',
          'Entwickelt Pillo gemeinsam mit Claude AI und hat seinen Lebenslauf in dieses interaktive Portfolio verwandelt.',
        ),
      },
      {
        need: L('Explains clearly — German is a plus', 'Erklärt klar — Deutsch ist ein Plus'),
        proof: L('English C1 and German B2 — this site answers in both.', 'Englisch C1 und Deutsch B2 — diese Website antwortet in beiden Sprachen.'),
      },
    ],
    // The small equation under the cards
    parts: [L('Data analysis', 'Datenanalyse'), L('Web development', 'Webentwicklung'), L('Curiosity about AI', 'Neugier auf KI')],
    result: 'AI Associate',
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
      "That's the overview. If it sounds like a fit, let's talk — here is how to reach him.",
      'Das ist der Überblick. Wenn es passt, lass uns reden — so erreichst du ihn.',
    ),
    // The call to action on the contact card
    cta: L("Let's build something useful.", 'Lass uns etwas Nützliches bauen.'),
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
  // Typed into the home prompt box by the contact and EN | DE buttons
  contactQuestion: L('How can I contact Tejeshwaran?', 'Wie kann ich Tejeshwaran kontaktieren?'),
  languageQuestions: {
    toGerman: 'Change the entire website to German',
    toEnglish: 'Change the language from German to English',
  },

  // The chips on the start page: the main ways into the portfolio.
  // Each asks the chat; the answer has a button to the matching part.
  // `icon` is mapped to a Lucide icon in PromptComposer.jsx (TOPIC_ICONS).
  suggestions: [
    { label: L('Tell me about him', 'Erzähl mir von ihm'), icon: 'about', question: L('Tell me about Tejeshwaran.', 'Erzähl mir von Tejeshwaran.') },
    { label: L('Show his projects', 'Zeig seine Projekte'), icon: 'projects', question: L('What projects has he built?', 'Welche Projekte hat er gebaut?') },
    { label: L('Experience', 'Erfahrung'), icon: 'experience', question: L('What professional experience does he have?', 'Welche Berufserfahrung hat er?') },
    { label: L('Why Langdock?', 'Warum Langdock?'), icon: 'why', question: L('Why is he interested in Langdock?', 'Warum interessiert er sich für Langdock?') },
    { label: L('Skills', 'Kenntnisse'), icon: 'skills', question: L('What technologies does he use?', 'Welche Technologien nutzt er?') },
    { label: L('Contact him', 'Kontakt'), icon: 'contact', question: L('How can I contact Tejeshwaran?', 'Wie kann ich Tejeshwaran kontaktieren?') },
  ],

  // Topics in the "+" menu of the prompt box
  topics: [
    { label: L('Education', 'Ausbildung'), icon: 'education', question: L('What did Tejeshwaran study?', 'Was hat Tejeshwaran studiert?') },
    { label: L('Experience', 'Erfahrung'), icon: 'experience', question: L('What professional experience does he have?', 'Welche Berufserfahrung hat er?') },
    { label: L('Projects', 'Projekte'), icon: 'projects', question: L('What projects has he built?', 'Welche Projekte hat er gebaut?') },
    { label: 'Pillo', icon: 'pillo', question: L('Tell me about Pillo.', 'Erzähl mir von Pillo.') },
    { label: L('Skills', 'Kenntnisse'), icon: 'skills', question: L('What technologies does he use?', 'Welche Technologien nutzt er?') },
    { label: L('Why Langdock?', 'Warum Langdock?'), icon: 'why', question: L('Why is he interested in Langdock?', 'Warum interessiert er sich für Langdock?') },
    { label: 'CV', icon: 'cv', question: L('Can I download his CV?', 'Kann ich seinen Lebenslauf herunterladen?') },
    { label: L('Contact', 'Kontakt'), icon: 'contact', question: L('How can I contact Tejeshwaran?', 'Wie kann ich Tejeshwaran kontaktieren?') },
  ],
  fallback: L(
    'I only answer from his CV and projects, and that is not in there. Try his projects, skills, experience or education — or ask why Langdock.',
    'Ich antworte nur auf Basis seines Lebenslaufs und seiner Projekte, und dazu steht dort nichts. Frag nach Projekten, Kenntnissen, Erfahrung oder Ausbildung — oder warum Langdock.',
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
 *
 * `link` is an optional button under the answer:
 *   { label, slide } → fades to that part of the portfolio
 *   { label, href }  → opens a page or file (download: true for the CV)
 */
function buildResponses(data, language) {
  const de = language === 'de'
  const { personal: me, education: degrees, experience: jobs, projects: work, skills: skillGroups } = data
  const [masters, bachelors] = degrees
  const job = jobs[0]
  const dashboard = work.find((project) => project.id === 'sales-dashboard')
  const pillo = work.find((project) => project.id === 'pillo')
  const advancedSkills = skillGroups
    .flatMap((group) => group.items)
    .filter((item) => item.level?.key === 'advanced')
    .map((item) => item.name)
    .join(', ')
  const learningSkills = skillGroups
    .flatMap((group) => group.items)
    .filter((item) => item.learning)
    .map((item) => item.name)
    .join(', ')
  const open = (slide) => ({ label: de ? 'Diesen Teil öffnen' : 'Open this part', slide })

  return [
    {
      topic: 'cv',
      keywords: [' cv', 'resume', 'résumé', 'lebenslauf', 'download'],
      answer: de
        ? 'Hier ist sein Lebenslauf als PDF — mit allen Details zu Ausbildung, Praktikum, Projekten und Kenntnissen.'
        : 'Here is his CV as a PDF — with all details on his education, internship, projects and skills.',
      link: { label: de ? 'Lebenslauf herunterladen (PDF)' : 'Download CV (PDF)', href: me.cv, download: true },
    },
    {
      topic: 'portfolio',
      keywords: ['portfolio', 'this website', 'this site', 'webseite', 'website', 'github', 'source code', 'quellcode', ' repo'],
      answer: de
        ? 'Du bist gerade darin: Dieses Portfolio ist mit React, Tailwind CSS und Vite gebaut. Der Chat antwortet nur aus seinen Lebenslaufdaten — ohne externe KI-API. Der Code liegt auf GitHub.'
        : 'You are looking at it: this portfolio is built with React, Tailwind CSS and Vite. The chat answers only from his CV data — no external AI API. The code is on GitHub.',
      link: { label: de ? 'Auf GitHub öffnen' : 'Open on GitHub', href: me.repository },
    },
    {
      topic: 'langdock',
      keywords: ['langdock', 'associate', 'motivation', 'motivier', 'why him', 'warum er', 'hire him', 'einstellen', 'a fit', 'passt'],
      answer: data.conversation.why.answer,
      link: open('why'),
    },
    {
      topic: 'pillo',
      keywords: [
        'pillo', 'dictation', 'diktier', 'voice app', 'right now', 'working on', 'currently', 'gerade', 'woran', 'aktuell',
      ],
      answer: `${pillo.answer} ${pillo.caseStudy.result}`,
      link: open('projects-2'),
    },
    {
      topic: 'hobbies',
      keywords: [
        'hobby', 'hobbies', 'free time', 'spare time', 'sport', 'table tennis', 'ping pong', 'apart from',
        'outside of', 'freizeit', 'tischtennis', 'abseits', 'neben der',
      ],
      answer: data.conversation.beyond.answer,
      link: open('beyond'),
    },
    {
      topic: 'dashboard',
      keywords: ['dashboard', 'sales', 'tableau', ' bi ', 'vertrieb', 'kpi'],
      answer: `${dashboard.answer} ${de ? 'Technologien' : 'Built with'}: ${dashboard.tech.join(', ')}.`,
      link: open('projects'),
    },
    {
      topic: 'ai',
      keywords: [' ai ', ' ki ', 'llm', 'agent', ' mcp', 'machine learning', 'artificial', 'künstlich', ' model'],
      answer: de
        ? `Im Master hat er Machine Learning und Predictive Analytics studiert. In Pillo arbeitet er mit einem Sprachmodell, das direkt auf dem Gerät läuft, und gerade lernt er: ${learningSkills}. In einem KI-Job hat er noch nicht gearbeitet — genau dafür ist das AI-Associate-Programm da.`
        : `He studied machine learning and predictive analytics in his Master's. In Pillo he works with a speech model that runs on the device, and he is learning ${learningSkills}. He has not worked in an AI job yet — that is exactly what the AI Associate program is for.`,
      link: open('skills-3'),
    },
    {
      topic: 'frontend',
      keywords: ['frontend', 'front-end', 'front end', 'web dev', 'webentwicklung', 'user interface', 'oberfläche'],
      answer: `${skillGroups.find((group) => group.id === 'web').answer}`,
      link: open('skills-2'),
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
      link: open('languages'),
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
      link: open('education'),
    },
    {
      topic: 'experience',
      keywords: ['experience', 'erfahrung', 'work', 'arbeit', 'job', 'intern', 'praktik', 'beruf', 'hermitcrabs', 'hubspot', 'crm', 'employ'],
      answer: de
        ? `Er war ${job.role} bei ${job.company} (${job.start} – ${job.end}): ${job.responsibilities.join('; ')}.`
        : `He was a ${job.role} at ${job.company} (${job.start} – ${job.end}): ${job.responsibilities.map(lowerFirst).join('; ')}.`,
      link: open('experience'),
    },
    {
      topic: 'projects',
      keywords: ['project', 'projekt', 'built', 'build', 'gebaut', 'entwickelt', 'made', 'create'],
      answer: de
        ? `Er zeigt ${work.length} Projekte: das ${dashboard.title} (${dashboard.tech.join(', ')}) und ${pillo.title}, das er gerade gemeinsam mit ${pillo.collaborator} entwickelt (C#, .NET, Sprachmodell auf dem Gerät).`
        : `He shows ${work.length} projects: the ${dashboard.title} (${dashboard.tech.join(', ')}) and ${pillo.title}, which he is building right now together with ${pillo.collaborator} (C#, .NET, an on-device speech model).`,
      link: open('projects'),
    },
    {
      topic: 'skills',
      keywords: [
        'skill', 'kenntnis', 'technolog', 'technisch', 'stack', 'tool', 'strong', 'stärke', 'fähigkeit', 'good at',
        'data', 'daten',
      ],
      answer: de
        ? `Seine Stärken sind Datenanalyse und Webentwicklung. Im Lebenslauf mit „sehr gut“ bewertet: ${advancedSkills}. Gerade lernt er: ${learningSkills}.`
        : `His strengths are data analytics and web development. Rated "advanced" on his CV: ${advancedSkills}. Learning now: ${learningSkills}.`,
      link: open('skills'),
    },
    {
      topic: 'contact',
      keywords: [
        'contact', 'kontakt', 'email', 'e-mail', 'mail', 'phone', 'telefon', 'call', 'anruf', 'reach', 'erreich',
        'hire', 'linkedin', 'where', ' wo ', 'location', 'standort', 'berlin', 'address', 'adresse',
      ],
      answer: de
        ? `Du erreichst ${me.firstName} per E-Mail unter ${me.email}${me.phone ? ` oder telefonisch unter ${me.phone}` : ''}. Er wohnt in Berlin.`
        : `You can reach ${me.firstName} by email at ${me.email}${me.phone ? ` or by phone at ${me.phone}` : ''}. He lives in Berlin.`,
      // Shown under the answer as contact cards
      details: buildContactDetails(me, de),
    },
    {
      topic: 'about',
      keywords: [
        'who ', 'wer ', 'about him', 'über ihn', 'tell me about', 'erzähl mir von', 'summary', 'zusammenfassung',
        'introduce', 'vorstell', 'background', 'tejeshwaran',
      ],
      answer: data.conversation.about.answer,
      link: open('about'),
    },
    {
      topic: 'greeting',
      keywords: [' hi ', ' hello ', ' hey ', ' hallo ', ' moin ', ' servus ', ' thanks ', ' thank you ', ' danke '],
      answer: de
        ? 'Hallo! Frag mich nach seinen Projekten, Kenntnissen, seiner Erfahrung — oder warum Langdock. Oder scroll einfach weiter.'
        : 'Hello! Ask me about his projects, skills, experience — or why Langdock. Or just keep scrolling.',
    },
  ]
}

/**
 * The contact cards (under the contact answer and on the contact card).
 * Empty values are left out automatically. `icon` is mapped in ContactDetails.jsx.
 */
export function buildContactDetails(me, de) {
  return [
    { id: 'email', label: de ? 'E-Mail' : 'Email', value: me.email, href: `mailto:${me.email}`, icon: 'email' },
    { id: 'phone', label: de ? 'Telefon' : 'Phone', value: me.phone, href: `tel:${me.phone.replace(/\s/g, '')}`, icon: 'phone' },
    { id: 'address', label: de ? 'Adresse' : 'Address', value: me.address, icon: 'location' },
    { id: 'birth', label: de ? 'Geburtsdatum' : 'Date of birth', value: me.birthDate, icon: 'birth' },
    { id: 'github', label: 'GitHub', value: me.github.replace(/^https?:\/\//, ''), href: me.github, icon: 'github' },
    { id: 'linkedin', label: 'LinkedIn', value: me.linkedin.replace(/^https?:\/\/(www\.)?/, ''), href: me.linkedin, icon: 'linkedin' },
  ].filter((card) => card.value)
}

/**
 * "Does he know React?" — one short, honest answer per skill, built from
 * the skill groups. answerEngine.js uses these when a question asks about
 * a skill by name (see KNOW_WORDS there).
 */
function buildSkillAnswers(skillGroups, language) {
  const de = language === 'de'
  return skillGroups.flatMap((group) =>
    group.items.map((item) => {
      let answer
      if (item.learning) {
        answer = de
          ? `${item.name} lernt er gerade — Berufserfahrung damit hat er noch nicht.`
          : `He is learning ${item.name} right now — no professional experience with it yet.`
      } else if (item.level) {
        answer = de
          ? `Ja. ${item.name} ist in seinem Lebenslauf mit „${item.level.label.toLowerCase()}“ bewertet. ${group.evidence}.`
          : `Yes. ${item.name} is rated "${item.level.label.toLowerCase()}" on his CV. ${group.evidence}.`
      } else {
        answer = de
          ? `Ja, ${item.name} gehört zu seinem Bereich „${group.name}“. ${group.evidence}.`
          : `Yes, ${item.name} is part of his ${lowerFirst(group.name)} work. ${group.evidence}.`
      }
      const names = item.aliases || [item.name.toLowerCase()]
      return { names, answer, name: item.name, link: { label: de ? 'Diesen Teil öffnen' : 'Open this part', slide: groupSlideIdOf(group, skillGroups) } }
    }),
  )
}

/** Slide id of a skill group: first → 'skills', second → 'skills-2' … */
function groupSlideIdOf(group, skillGroups) {
  const index = skillGroups.indexOf(group)
  return index === 0 ? 'skills' : `skills-${index + 1}`
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
  data.askPortfolio.skillAnswers = buildSkillAnswers(data.skills, language)
  return data
}
