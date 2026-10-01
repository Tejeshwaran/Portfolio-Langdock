# Portfolio — Tejeshwaran Manoharan

**Live:** https://tejeshwaran-portfolio.vercel.app

My portfolio, built as a small AI workspace for my application to the
**AI Associate** program at [Langdock](https://www.langdock.com). You can
scroll through it like slides, or ask it questions in the chat. The chat
answers only from my CV data and runs fully in the browser — there is no
language model and no API key behind it.

## Why it looks like this

Langdock builds a platform that brings AI chat, agents, workflows and
integrations to whole organisations. The AI Associate role is about
understanding how these systems behave for real users and explaining it
clearly. So instead of a static page, the portfolio is shaped like the kind
of product I want to work on: a sidebar, a chat, suggested prompts, an
answer mode that shows its reasoning steps — built so that a recruiter still
gets the facts within a few seconds, even without typing anything.

Guiding rule: **clarity over decoration, real experience over big words.**
Every fact comes from my CV (`public/cv/`) or from the projects themselves.

## What it does

- **Welcome page** — a short note to the Langdock team about the AI
  Associate program, a quote on why I want to understand AI rather than
  just use it. Enter, a scroll or "Start the conversation" opens the
  portfolio.
- **Start page** — name, direction ("Data & AI-focused developer"), stack
  at a glance, direct actions (Explore my work · View CV · GitHub ·
  Contact) and six suggested prompts that work as navigation.
- **AI journey** — three slides that show how I approach AI instead of
  claiming expertise: the questions about AI systems I am exploring
  ("Why did the model give a different answer?"), what I have built or
  studied next to what I am still learning, and how I would work through
  a support ticket (clearly marked as an illustration).
- **Ask my portfolio** — a local answer engine (`src/utils/answerEngine.js`):
  keyword matching over answers generated from `portfolioData.js`, plus
  direct skill questions ("Does he know React?" → the level from the CV and
  where it was used). Unknown questions get an honest "that is not in his
  CV". Every answer can link to the matching part of the portfolio.
- **Think mode** — shows the steps the engine really takes (read the
  question → search the topics → matched keyword → write the answer).
- **Slides** — one scroll or swipe = one part (projects, experience, skills,
  education, why Langdock, …). The sidebar jumps anywhere.
- **Projects as case studies** — this portfolio, Pillo (on-device dictation,
  in development) and a Tableau sales dashboard: problem → approach →
  result, a "how it works" flow and expandable details.
- **Skills with honest labels** — CV level ("Advanced" / "Good"), "Learning"
  for things I am learning now, and where each group was used.
- **English / German**, **dark / light**, voice input (Web Speech API).

## Tech

React 18 · Vite 5 · Tailwind CSS 3 · Framer Motion 11 · Lucide icons.
No backend, no other runtime dependencies. Deployed on Vercel.

## Architecture

```
src/
  data/portfolioData.js   ← all content (EN + DE) and the generated chat answers
  utils/answerEngine.js   the local "AI": language commands, skill questions, keyword match
  utils/askEvents.js      lets any button ask the home chat a question
  hooks/                  usePortfolioChat (chat state), useSpeechRecognition,
                          useDismiss (close popups), useMediaQuery
  i18n/                   LanguageContext + uiText (interface words EN / DE)
  theme/ThemeContext.jsx  dark / light (colours are CSS variables in index.css)
  components/
    AppShell.jsx          layout: Sidebar + TopBar + slides + bottom prompt box
    SlideDeck.jsx         slide state, wheel / swipe / keyboard handling, fit-to-screen
    PromptComposer.jsx    the prompt box (+ topics, Plugins, Auto/Think, mic, send)
    ConversationBlock.jsx question → thinking → typed answer → cards
    ProjectCard.jsx  SkillCard.jsx  ChatThread.jsx  ContactDetails.jsx …
  sections/               one file per part: Hero, About, AiJourney, Projects,
                          Experience, Skills, Education, WhyLangdock, Languages,
                          BeyondWork, Footer
  onboarding/             the welcome page ("Hello, Langdock team."), lazy-loaded
public/cv/                CV as PDF (English and German)
```

**Data flow.** `portfolioData.js` holds every text once, in both languages
(`L('English', 'Deutsch')`). `createPortfolioData(language)` picks one
language and also builds the chat answers from the same data, so the chat
can never disagree with the page. Components read everything through
`useLanguage().data`.

**State.** The home chat is shared through a small context (`HomeChat.jsx`),
because the start page, the sidebar ("Today") and the top bar (title) all
show it. The slide deck is another context; everything else is local state.

## Design decisions

- **Local answer engine instead of an LLM API.** A real model would need a
  backend to keep the key secret and could invent facts about me. A
  structured-data engine is fast, free, cannot hallucinate, and still shows
  the conversational UX.
- **Slides instead of a long page.** Each answer gets the full screen; the
  sidebar and suggested prompts make every part one click away.
- **No fake numbers.** No skill percentages, no invented results; projects
  in progress are labelled as such.
- **Accessibility.** Semantic headings on every slide, keyboard navigation
  (arrows / Page keys / Home / End, `/` focuses the prompt box, Escape
  closes menus), visible focus rings, `prefers-reduced-motion` respected,
  hidden slides are `inert`.
- **Performance.** No images besides the link-preview image, fonts via
  Google Fonts with `display=swap`, the optional intro is code-split, and
  animations use transforms and opacity only.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Deploy

The site is deployed on Vercel from this folder:

```bash
npx vercel deploy --prod
```

## Change the content

- **Personal details, projects, skills, all texts:** `src/data/portfolioData.js`.
  Empty values (e.g. `linkedin: ''`) are hidden everywhere automatically.
- **Interface words (EN / DE):** `src/i18n/uiText.js`.
- **CV files:** replace the PDFs in `public/cv/` (keep the file names).
- **Colours:** `src/index.css` (one block for light, one for dark).
- **Welcome page:** switch off with `ONBOARDING_ENABLED` in `src/config/onboarding.js`
  (or add `?intro=0` to the address to skip it once).
- **The quote:** `personal.quote` in `src/data/portfolioData.js`.
