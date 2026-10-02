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
  // Add your LinkedIn profile URL here. While it is empty, the LinkedIn
  // links are hidden automatically everywhere on the site.
  linkedin: '',
  // His personal portfolio website (a separate project, on GitHub Pages)
  website: 'https://tejeshwaran.github.io/portfolio-website/',
  websiteRepository: 'https://github.com/Tejeshwaran/portfolio-website',
  // The current CV (German, October 2026) — file in public/cv/
  cv: 'cv/Tejeshwaran-Manoharan-Lebenslauf.pdf',
  // The application this site was made for
  targetRole: 'AI Associate',
  targetCompany: 'Langdock',
  targetPlace: 'Langdock, Berlin',
  // His own words on why he applies — shown on the welcome page and the
  // "Why Langdock" slide. It answers the program's line "for people who
  // want to understand AI rather than just use it".
  quote: L(
    "“I don't just want to use AI. I want to understand why it behaves the way it does — and explain it so others can use it with confidence.”",
    '„Ich will KI nicht nur benutzen. Ich will verstehen, warum sie sich so verhält — und es so erklären, dass andere sie mit Vertrauen nutzen können.“',
  ),
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
    tech: ['C#', '.NET 10', 'WPF', 'NAudio', 'sherpa-onnx', L('Parakeet speech model', 'Parakeet-Sprachmodell'), 'SQLite'],
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
      L('Voice activity detection', 'Sprachaktivitätserkennung'),
      L('Text typed at the cursor in any app (simulated keyboard input)', 'Text erscheint am Cursor in jeder App (simulierte Tastatureingabe)'),
      L('Control from the system tray', 'Steuerung über den Infobereich'),
      L('Dictionary, formatting and voice shortcuts', 'Wörterbuch, Formatierung und Sprachbefehle'),
      L('Floating pill overlay', 'Schwebendes Pill-Overlay'),
      L('Transcript history in SQLite', 'Transkriptionsverlauf in SQLite'),
    ],
  },
  {
    id: 'personal-website',
    number: '03',
    type: 'web',
    question: L('And on the web?', 'Und im Web?'),
    answer: L(
      'He built and published his personal website: a portfolio for his projects and technical skills, made with React, Tailwind CSS and Vite and hosted on GitHub Pages.',
      'Er hat seine persönliche Website gebaut und veröffentlicht: ein Portfolio für seine Projekte und technischen Kenntnisse, mit React, Tailwind CSS und Vite, gehostet auf GitHub Pages.',
    ),
    title: L('Personal website', 'Persönliche Website'),
    subtitle: L('A portfolio for his projects and technical skills.', 'Ein Portfolio für seine Projekte und technischen Kenntnisse.'),
    tech: ['React', 'Tailwind CSS', 'Vite', 'GitHub Pages'],
    caseStudy: {
      problem: L(
        'He wanted one place online that shows his projects and technical skills.',
        'Er wollte einen Ort im Netz, der seine Projekte und technischen Kenntnisse zeigt.',
      ),
      approach: L(
        'Built the site with React and Tailwind CSS, bundled with Vite.',
        'Die Website mit React und Tailwind CSS gebaut, gebündelt mit Vite.',
      ),
      result: L('Published on GitHub Pages — open it below.', 'Auf GitHub Pages veröffentlicht — unten öffnen.'),
    },
    pipeline: [
      L('React components', 'React-Komponenten'),
      'Tailwind CSS',
      L('Vite build', 'Vite-Build'),
      'GitHub Pages',
    ],
    capabilities: [],
    links: [
      { label: L('Open the website', 'Website öffnen'), href: personal.website },
      { label: L('Code on GitHub', 'Code auf GitHub'), href: personal.websiteRepository },
    ],
  },
]

// Skill levels as given by Tejeshwaran ("Advanced" / "Good" / "Basic").
// Items without a level show no badge. `learning: true` = learning it now,
// shown differently so nothing looks bigger than it is.
// `evidence` says where the group was actually used.
// `aliases` help the chat recognise a skill in a question ("Does he know React?").
const ADVANCED = { key: 'advanced', label: L('Advanced', 'Sehr gut') }
const GOOD = { key: 'good', label: L('Good', 'Gut') }
const BASIC = { key: 'basic', label: L('Basic', 'Grundkenntnisse') }

// In slide mode each skill group is its own slide (question / answer below).
const skills = [
  {
    id: 'data',
    question: L('What data tools does he work with?', 'Mit welchen Daten-Tools arbeitet er?'),
    answer: L(
      'Data is his core: Python, SQL and Tableau — all advanced. He used them in his Master\'s and in the Sales Dashboard.',
      'Daten sind sein Kern: Python, SQL und Tableau — alle auf sehr gutem Niveau. Er hat sie im Master und im Sales-Dashboard eingesetzt.',
    ),
    name: L('Data & analytics', 'Daten & Analyse'),
    icon: 'chart', // mapped to a Lucide icon in SkillCard.jsx
    evidence: L('Used in: Sales Dashboard · M.Sc. Data Analytics', 'Eingesetzt in: Sales-Dashboard · M.Sc. Data Analytics'),
    items: [
      { name: 'Python', level: ADVANCED, aliases: ['python', 'pandas', 'numpy', 'seaborn', 'pyplot', 'matplotlib'] },
      { name: 'SQL', level: ADVANCED, aliases: [' sql', 'sql '] },
      { name: 'Tableau', level: ADVANCED },
      { name: 'MySQL', level: GOOD },
      { name: 'Excel', level: GOOD },
    ],
  },
  {
    id: 'web',
    question: L('And web development?', 'Und Webentwicklung?'),
    answer: L(
      'For the web he works with React, JavaScript, HTML, CSS, Tailwind CSS, Vite and Git & GitHub — all advanced — plus Node.js and MongoDB. He did front-end work in his internship and built his personal website with React, Tailwind CSS and Vite.',
      'Im Web arbeitet er mit React, JavaScript, HTML, CSS, Tailwind CSS, Vite sowie Git & GitHub — alle auf sehr gutem Niveau — dazu Node.js und MongoDB. Im Praktikum hat er im Frontend gearbeitet, und seine persönliche Website hat er mit React, Tailwind CSS und Vite gebaut.',
    ),
    name: L('Web development', 'Webentwicklung'),
    icon: 'code',
    evidence: L('Used in: HermitCrabs internship · personal website', 'Eingesetzt in: Praktikum bei HermitCrabs · persönliche Website'),
    items: [
      { name: 'React', level: ADVANCED, aliases: ['react'] },
      { name: 'JavaScript', level: ADVANCED, aliases: ['javascript', ' js '] },
      { name: 'HTML', level: ADVANCED },
      { name: 'CSS', level: ADVANCED, aliases: [' css'] },
      { name: 'Tailwind CSS', level: ADVANCED, aliases: ['tailwind'] },
      { name: 'Node.js', level: GOOD, aliases: ['node'] },
      { name: 'MongoDB', level: GOOD, aliases: ['mongo'] },
      { name: 'Vite', level: ADVANCED },
      { name: L('Responsive design', 'Responsive Design'), level: GOOD, aliases: ['responsive'] },
      { name: 'Git & GitHub', level: ADVANCED, aliases: [' git ', 'github'] },
      { name: L('Figma · UI/UX', 'Figma · UI/UX'), learning: true, aliases: ['figma', 'ui/ux', 'ux design'] },
    ],
  },
  {
    id: 'ai',
    question: L('What about AI and machine learning?', 'Und KI und Machine Learning?'),
    answer: L(
      'He studied machine learning and predictive analytics in his Master\'s, data visualization is one of his strengths, and he knows the basics of AWS. With Pillo he works with a speech model that runs on the device, and right now he is learning how LLM applications, AI agents and MCP work.',
      'Im Master hat er Machine Learning und Predictive Analytics studiert, Datenvisualisierung ist eine seiner Stärken, und er kennt die Grundlagen von AWS. Mit Pillo arbeitet er mit einem Sprachmodell, das direkt auf dem Gerät läuft, und gerade lernt er, wie LLM-Anwendungen, KI-Agenten und MCP funktionieren.',
    ),
    name: L('AI & machine learning', 'KI & Machine Learning'),
    icon: 'ai',
    evidence: L('Studied in the M.Sc. · used in Pillo · learning now', 'Im M.Sc. studiert · in Pillo eingesetzt · lerne ich gerade'),
    items: [
      { name: 'Machine Learning', level: GOOD, aliases: ['machine learning', ' ml '] },
      { name: 'Predictive Analytics', level: GOOD, aliases: ['predictive'] },
      { name: L('Data Visualization', 'Datenvisualisierung'), level: ADVANCED, aliases: ['visuali'] },
      { name: 'AWS', level: BASIC, aliases: ['aws', 'amazon web'] },
      { name: L('On-device speech models', 'Sprachmodelle auf dem Gerät'), level: GOOD, aliases: ['speech model', 'sprachmodell', 'onnx'] },
      { name: 'C# / .NET', level: BASIC, aliases: ['c#', '.net', 'dotnet'] },
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
    // The start page: who, what, why — readable in a few seconds
    badge: L('Applying for AI Associate · Langdock, Berlin', 'Bewerbung als AI Associate · Langdock, Berlin'),
    heading: 'Tejeshwaran Manoharan',
    role: L('Data & AI-focused developer', 'Data- & KI-orientierter Entwickler'),
    subheading: L(
      'Building with data, web technologies and AI — and always trying to understand what happens under the hood.',
      'Mit Daten, Webtechnologien und KI bauen — und immer verstehen wollen, was unter der Haube passiert.',
    ),
    // Quick facts, shown as one line under the headline
    highlights: ['M.Sc. Data Analytics', 'Python · SQL · Tableau', 'React', L('English C1 · German B2', 'Englisch C1 · Deutsch B2')],
    placeholder: L('Typing ❌ Just scrolling ✅', 'Tippen ❌ Einfach scrollen ✅'),
  },
  about: {
    question: L('Who is Tejeshwaran?', 'Wer ist Tejeshwaran?'),
    answer: L(
      'Tejeshwaran Manoharan is a Data & AI-focused developer in Berlin, with a Master of Science in Data Analytics and a Bachelor of Computer Applications. He analyses data with Python, SQL and Tableau, builds web interfaces with React, and is now learning how LLMs, agents and AI applications work — by building things and asking why they behave the way they do.',
      'Tejeshwaran Manoharan ist ein Data- & KI-orientierter Entwickler in Berlin, mit einem Master of Science in Data Analytics und einem Bachelor of Computer Applications. Er analysiert Daten mit Python, SQL und Tableau, baut Web-Oberflächen mit React und lernt gerade, wie LLMs, Agenten und KI-Anwendungen funktionieren — indem er Dinge baut und fragt, warum sie sich so verhalten.',
    ),
    focusAreas: [
      L('Data analytics', 'Datenanalyse'),
      L('Web development', 'Webentwicklung'),
      L('Machine learning — studied', 'Machine Learning — studiert'),
      L('LLMs & agents — learning', 'LLMs & Agenten — lerne ich'),
    ],
  },
  // "AI journey" slide (sections/AiJourney.jsx)
  learning: {
    question: L('What is he learning right now?', 'Was lernt er gerade?'),
    answer: L(
      'He keeps a clear line between what he has built or studied and what he is still learning:',
      'Er trennt klar zwischen dem, was er gebaut oder studiert hat, und dem, was er gerade lernt:',
    ),
    known: [
      L('Machine learning & predictive analytics — M.Sc.', 'Machine Learning & Predictive Analytics — M.Sc.'),
      L('Big-data analysis on AWS — M.Sc.', 'Big-Data-Analyse auf AWS — M.Sc.'),
      L('Python data analysis — Sales Dashboard', 'Datenanalyse mit Python — Sales-Dashboard'),
      L('Running a speech model on the device — Pillo', 'Ein Sprachmodell auf dem Gerät betreiben — Pillo'),
      L('Building software together with an AI coding assistant', 'Software gemeinsam mit einem KI-Coding-Assistenten bauen'),
    ],
    exploring: [
      L('Tokens & context windows', 'Tokens & Kontextfenster'),
      L('Prompts & system prompts', 'Prompts & System-Prompts'),
      L('Non-determinism & hallucinations', 'Nicht-Determinismus & Halluzinationen'),
      L('AI agents & tool calling', 'KI-Agenten & Tool-Aufrufe'),
      'MCP',
      'Retrieval / RAG',
      L('APIs & AI application architecture', 'APIs & Architektur von KI-Anwendungen'),
      L('AI product UX', 'UX von KI-Produkten'),
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
    question: L('Why the AI Associate program?', 'Warum das AI-Associate-Programm?'),
    answer: L(
      'Because it treats AI as something to understand, investigate and explain — not only something to use. Langdock brings the leading models into one platform for whole organisations, so the real questions about how AI behaves arrive in support. He has not mastered every part of the AI stack yet. That is exactly why a role where understanding the stack is the job appeals to him.',
      'Weil es KI als etwas behandelt, das man verstehen, untersuchen und erklären muss — nicht nur benutzen. Langdock bringt die führenden Modelle in eine Plattform für ganze Organisationen, deshalb landen die echten Fragen dazu, wie sich KI verhält, im Support. Er beherrscht noch nicht jeden Teil des KI-Stacks. Genau deshalb reizt ihn eine Rolle, in der das Verstehen des Stacks die Aufgabe ist.',
    ),
    // His background → what it gives him → where it shows (only real things)
    story: [
      {
        from: L('Data analytics', 'Datenanalyse'),
        gives: L('Checks the data before drawing conclusions', 'Prüft die Daten, bevor er Schlüsse zieht'),
        evidence: L('M.Sc. Data Analytics · Sales Dashboard', 'M.Sc. Data Analytics · Sales-Dashboard'),
      },
      {
        from: L('Web development', 'Webentwicklung'),
        gives: L('Understands how software and interfaces fit together', 'Versteht, wie Software und Oberflächen zusammenspielen'),
        evidence: L('Front-end internship · personal website', 'Frontend-Praktikum · persönliche Website'),
      },
      {
        from: L('AI / ML learning', 'KI/ML lernen'),
        gives: L('Curious how intelligent systems really behave', 'Neugierig, wie intelligente Systeme sich wirklich verhalten'),
        evidence: L('ML in the M.Sc. · Pillo\'s on-device model', 'ML im M.Sc. · Pillos Modell auf dem Gerät'),
      },
      {
        from: 'UI/UX',
        gives: L('Makes technology easy to understand and use', 'Macht Technik leicht verständlich und nutzbar'),
        evidence: L('This site explains itself in English and German', 'Diese Website erklärt sich auf Englisch und Deutsch'),
      },
      {
        from: L('Projects', 'Projekte'),
        gives: L('Builds and experiments instead of only reading', 'Baut und experimentiert, statt nur zu lesen'),
        evidence: L('Sales Dashboard · Pillo · personal website', 'Sales-Dashboard · Pillo · persönliche Website'),
      },
    ],
    role: 'AI Associate',
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
// The welcome page shown before the portfolio
// (src/onboarding/Onboarding.jsx). Written to the Langdock team.
// ─────────────────────────────────────────────────────────────
const onboarding = {
  badge: L('Application · AI Associate', 'Bewerbung · AI Associate'),
  hello: {
    eyebrow: L('Application · AI Associate · Langdock', 'Bewerbung · AI Associate · Langdock'),
    title: L('Hello, Langdock team.', 'Hallo, Langdock-Team.'),
    body: L(
      'Thank you for opening my application for the AI Associate program. You are looking for people who want to understand AI rather than just use it — that is exactly what drives me. So instead of another PDF, I turned my CV into a small AI product: ask it anything, and it answers only from my real experience.',
      'Danke, dass Sie meine Bewerbung für das AI-Associate-Programm öffnen. Sie suchen Menschen, die KI verstehen wollen, statt sie nur zu benutzen — genau das treibt mich an. Statt eines weiteren PDFs habe ich meinen Lebenslauf deshalb in ein kleines KI-Produkt verwandelt: Fragen Sie es, was Sie wollen — es antwortet nur aus meiner echten Erfahrung.',
    ),
    signature: '— Tejeshwaran Manoharan, Berlin',
    // The little terminal that "boots" the portfolio
    bootLines: [
      { text: 'open tejeshwaran.portfolio', isCommand: true },
      { text: L('loading CV data', 'Lebenslaufdaten laden'), status: 'ok' },
      { text: L('position: AI Associate · Langdock, Berlin', 'Position: AI Associate · Langdock, Berlin'), status: 'ok' },
      { text: L('answer engine: local, grounded in the CV', 'Antwort-Engine: lokal, nur aus dem Lebenslauf'), status: L('ready', 'bereit') },
    ],
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
    { label: L('What is he learning?', 'Was lernt er gerade?'), icon: 'learning', question: L('What is he currently learning?', 'Was lernt er gerade?') },
    { label: L('Why this role?', 'Warum diese Rolle?'), icon: 'why', question: L('Why is he interested in Langdock?', 'Warum interessiert er sich für Langdock?') },
    { label: L('What has he built?', 'Was hat er gebaut?'), icon: 'projects', question: L('What projects has he built?', 'Welche Projekte hat er gebaut?') },
    { label: L('React experience?', 'React-Erfahrung?'), icon: 'skills', question: L('What is his React experience?', 'Welche Erfahrung hat er mit React?') },
    { label: L('Why AI?', 'Warum KI?'), icon: 'curiosity', question: L('Why is he interested in AI?', 'Warum interessiert er sich für KI?') },
  ],

  // Topics in the "+" menu of the prompt box
  topics: [
    { label: L('Education', 'Ausbildung'), icon: 'education', question: L('What did Tejeshwaran study?', 'Was hat Tejeshwaran studiert?') },
    { label: L('Experience', 'Erfahrung'), icon: 'experience', question: L('What professional experience does he have?', 'Welche Berufserfahrung hat er?') },
    { label: L('Projects', 'Projekte'), icon: 'projects', question: L('What projects has he built?', 'Welche Projekte hat er gebaut?') },
    { label: 'Pillo', icon: 'pillo', question: L('Tell me about Pillo.', 'Erzähl mir von Pillo.') },
    { label: L('Skills', 'Kenntnisse'), icon: 'skills', question: L('What technologies does he use?', 'Welche Technologien nutzt er?') },
    { label: L('Learning now', 'Lerne ich gerade'), icon: 'learning', question: L('What is he currently learning?', 'Was lernt er gerade?') },
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
  const website = work.find((project) => project.id === 'personal-website')
  const { learning } = data.conversation
  const projectSlide = (id) => {
    const index = work.findIndex((project) => project.id === id)
    return index === 0 ? 'projects' : `projects-${index + 1}`
  }
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
        ? 'Hier ist sein aktueller Lebenslauf als PDF — mit Ausbildung, Praktikum, Projekten und Kenntnissen.'
        : 'Here is his current CV as a PDF (in German) — with his education, internship, projects and skills.',
      link: { label: de ? 'Lebenslauf herunterladen (PDF)' : 'Download CV (PDF)', href: me.cv, download: true },
    },
    {
      topic: 'portfolio',
      keywords: [
        'portfolio', 'this website', 'this site', 'webseite', 'website', 'github', 'source code', 'quellcode', ' repo',
        'the code', 'his code', 'seinen code', 'den code',
      ],
      answer: de
        ? `${website.answer} Den Code dieser Bewerbungsseite findest du ebenfalls auf GitHub.`
        : `${website.answer} The code of this application site is on GitHub too.`,
      link: { label: de ? 'Website öffnen' : 'Open his website', href: me.website },
    },
    {
      topic: 'learning',
      keywords: [
        'currently learning', 'learning now', 'learning right now', 'is he learning', 'he learn', 'lernt er', 'gerade lern',
        'exploring', 'erkundet', 'studying now',
      ],
      answer: de
        ? `Gebaut oder studiert: ${learning.known.join('; ')}. Lernt er gerade: ${learning.exploring.join(', ')}.`
        : `Built or studied: ${learning.known.join('; ')}. Learning now: ${learning.exploring.join(', ')}.`,
      link: open('journey'),
    },
    {
      topic: 'curiosity',
      keywords: [
        'interested in ai', 'interest in ai', 'why ai', 'curious', 'neugier', 'interessiert er sich für ki', 'warum ki',
        'under the hood', 'unter der haube', 'how ai works', 'wie ki funktioniert',
      ],
      answer: de
        ? `${me.quote} Im Master hat er Machine Learning studiert, in Pillo arbeitet er mit einem Sprachmodell auf dem Gerät, und gerade lernt er: ${learning.exploring.slice(0, 5).join(', ')}.`
        : `${me.quote} He studied machine learning in his Master's, works with an on-device speech model in Pillo, and is now learning: ${learning.exploring.slice(0, 5).join(', ')}.`,
      link: open('journey'),
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
      link: open(projectSlide('pillo')),
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
      keywords: ['dashboard', 'sales', 'tableau', ' bi ', 'vertrieb', 'kpi', 'data project', 'datenprojekt', 'daten-projekt'],
      answer: `${dashboard.answer} ${de ? 'Technologien' : 'Built with'}: ${dashboard.tech.join(', ')}.`,
      link: open(projectSlide('sales-dashboard')),
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
        ? `Er zeigt ${work.length} Projekte: ${work.map((project) => `${project.title} (${project.tech.slice(0, 3).join(', ')})`).join('; ')}. Pillo ist noch in Entwicklung.`
        : `He shows ${work.length} projects: ${work.map((project) => `${project.title} (${project.tech.slice(0, 3).join(', ')})`).join('; ')}. Pillo is still in development.`,
      link: open('projects'),
    },
    {
      topic: 'skills',
      keywords: [
        'skill', 'kenntnis', 'technolog', 'technisch', 'stack', 'tool', 'strong', 'stärke', 'fähigkeit', 'good at',
        'data', 'daten',
      ],
      answer: de
        ? `Seine Stärken sind Datenanalyse und Webentwicklung. Sehr gut: ${advancedSkills}. Gerade lernt er: ${learningSkills}.`
        : `His strengths are data analytics and web development. Advanced: ${advancedSkills}. Learning now: ${learningSkills}.`,
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
          ? `Ja. Sein Niveau in ${item.name}: ${item.level.label}. ${group.evidence}.`
          : `Yes. His level in ${item.name}: ${item.level.label.toLowerCase()}. ${group.evidence}.`
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
