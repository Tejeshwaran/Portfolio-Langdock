# Tejeshwaran AI Portfolio

A personal portfolio that behaves like an LLM chat.

- **Home screen:** a dark LLM start page — "Tejeshwaran is a Web Developer
  and Data Analyst" and an "Ask anything" prompt bar that really answers
  (from local résumé data), with a topic menu, a "Think" mode, dictation
  and a voice mode.
- **Scroll story:** as you scroll, each section plays as a small
  conversation: the question appears, the AI "thinks", types its answer,
  and then shows supporting cards.

Built with **React + Vite + JavaScript + Tailwind CSS + Framer Motion + Lucide React**.
No backend, no real AI API.

---

## 1. Install

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

Open the address that Vite prints (usually `http://localhost:5173`).

Other scripts:

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run build`   | Creates the production site in `dist/`        |
| `npm run preview` | Serves the `dist/` build locally to test it   |
| `npm run deploy`  | Builds and publishes to GitHub Pages (see §8) |

---

## Project structure

```
src/
  data/
    portfolioData.js      ← ALL personal information lives here
  utils/
    answerEngine.js       the keyword "AI" + the Think-mode steps
  i18n/
    LanguageContext.jsx   current language + useLanguage() hook
    uiText.js             interface words in English and German
  theme/
    ThemeContext.jsx      dark / light look + useTheme() hook
  hooks/
    usePortfolioChat.js   state of one chat (messages, thinking, Think mode, commands)
    useSpeechRecognition.js  voice input with the browser's Web Speech API
    useMediaQuery.js      true while a screen-size query matches
  components/
    AppShell.jsx          the app layout: sidebar + top bar + chat area
    Sidebar.jsx           left column: New chat, sections, projects, Today, progress, profile
    TopBar.jsx            title of the current part, EN | DE, dark/light, copy link
    SlideComposer.jsx     the prompt box at the bottom of every slide (not home)
    HomeChat.jsx          the one shared home chat (home screen, sidebar, top bar)
    appNav.js             which sidebar item belongs to which slide + titles
    MessageActions.jsx    copy / "write again" buttons under an AI answer
    PromptComposer.jsx    the "Ask anything" box (+ topics, Plugins, Auto/Think, mic, send)
    ComposerExtras.jsx    bar under the home box: Projects folder · Connect with him
    AssistantMark.jsx     the small solid mark in the AI avatar
    ChatThread.jsx        list of chat messages
    ThoughtTrace.jsx      "Thinking…" steps / "Thought for 1.8s" panel
    AIHeader.jsx          top bar of the old scrolling version (+ the EN | DE switch)
    FloatingNav.jsx       bottom menu of the old scrolling version
    ConversationBlock.jsx question → thinking → typing → cards (scroll-driven)
    ChatMessage.jsx       one user bubble or AI message
    TypewriterText.jsx    character-by-character typing
    Cursor.jsx            blinking caret
    ThinkingDots.jsx      "Thinking…" indicator
    motionVariants.js     the shared "pop" animation
    PopIn.jsx             makes items pop in one by one while scrolling
    ScrollProgress.jsx    thin progress line (replaces the hidden scrollbar)
    Badge.jsx             small pill for tags and levels
    EducationCard.jsx  ExperienceCard.jsx  ProjectCard.jsx
    SkillCard.jsx      LanguageCard.jsx    AskPortfolio.jsx      (not used on the page any more; kept for later)
    HackerLogo.jsx        the dotted hooded-figure logo in the top bar
  sections/
    Hero.jsx  About.jsx  Education.jsx  Experience.jsx  Projects.jsx
    Skills.jsx  Languages.jsx  WhyLangdock.jsx  AskPortfolioSection.jsx  Footer.jsx
  App.jsx                 puts all sections in order
  main.jsx                React entry point
  index.css               Tailwind + global styles (focus ring, reduced motion)
tailwind.config.js        colours, fonts, shadows, keyframes
```

---

## 3. How the scroll animation works

Everything happens in `src/components/ConversationBlock.jsx`.

1. `useInView` from Framer Motion (a wrapper around the browser's
   **IntersectionObserver**) watches the block.
   The option `margin: '0px 0px -20% 0px'` means "count as visible once the
   top of the block passes 80% of the screen height".
   `once: true` means the sequence plays only the first time.
2. When the block becomes visible, a few `setTimeout`s move it through
   **stages**:

   | Stage      | What you see                        |
   | ---------- | ----------------------------------- |
   | `IDLE`     | nothing yet                         |
   | `QUESTION` | the user bubble slides in           |
   | `THINKING` | AI avatar + "Thinking…" dots        |
   | `TYPING`   | the answer types out                |
   | `DONE`     | cards pop in one by one (PopIn)     |

3. `TYPING → DONE` happens when `TypewriterText` calls `onComplete`.
4. The timing constants (`QUESTION_TO_THINKING`, `THINKING_DURATION`,
   `TYPING_SPEED`) are at the top of the file — change them to make it
   faster or slower.

**Why the page never jumps:** every message and card is *always* rendered.
Before its turn it is only transparent (`opacity: 0`, `visibility: hidden`),
so it already takes up its final space. Scrolling is never blocked.

**Scroll-linked drift:** each block also moves up by a few pixels as it
travels into the screen (`useScroll` + `useTransform`). It follows the scroll
position in both directions and never re-renders React.

**One-by-one pop (`src/components/PopIn.jsx`):** wrap anything in
`<PopIn as="li">…</PopIn>` and it pops (fade + rise + tiny scale, with a
spring) when it scrolls into view — but only after its ConversationBlock has
finished typing (`RevealContext`). Items that become visible at the same
moment are put in page order and started 0.07 s apart, so skills,
responsibilities, topics and badges appear one after another. An item that
scrolls into view alone pops at once, so scrolling never feels slow.

**Slide mode (default, `src/components/SlideDeck.jsx`):** the page itself
never moves. Every part is a full-screen slide — each degree, each project
and each skill group gets its own slide, with its own question and answer
(`question` / `answer` on each item in `portfolioData.js`).
One mouse-wheel roll, swipe or arrow key fades the current slide out and the
next one in. If a slide is taller than the screen, it is first shrunk a
little to fit (down to 80 %, on tablets and computers); on phones you scroll
inside the slide, and at its end the next swipe changes the slide. A
trackpad flick moves exactly one slide (input is ignored during the fade
and until the "glide" stops). Keys: ↓ / ↑, Page Down / Up, Space, Home, End.
Dots on the right show where you are; the blue top line shows progress.

Choose the mode in `src/config/scrollEffect.js` (`'slides'`, `'fade'` or
`'classic'`), or try one without editing: add `?scroll=slides`,
`?scroll=fade` or `?scroll=classic` to the address.

**Fade scroll (`src/config/scrollEffect.js`):** with the `'fade'` effect,
each segment fades out (and lifts a little) as its bottom moves from the
middle of the screen to the top, while the next segment fades in
(`hooks/useScrollFade.js`). Two soft gradients at the screen edges
(`components/EdgeFade.jsx`) let text dissolve instead of being cut off.
Set `DEFAULT_SCROLL_EFFECT = 'classic'` to go back to the version without
fading, or compare both by adding `?scroll=classic` / `?scroll=fade` to the
address.

**Scroll progress:** the scrollbar is hidden (`index.css`). A thin accent line
at the top (`ScrollProgress.jsx`) shows how far down you are instead.

**Smooth on phones:** only `transform` and `opacity` are animated, scroll
effects use motion values (no React re-render per frame), typing runs on
`requestAnimationFrame`, and the header and nav skip the costly background
blur on small screens.

## 4. How the typewriter works

`src/components/TypewriterText.jsx`

- Props: `text`, `speed` (ms per character), `delay`, `start`,
  `onComplete`, `restartKey`.
- When `start` becomes `true`, a `requestAnimationFrame` loop runs once
  per screen refresh. Each frame it checks how much time has passed and
  shows that many characters (`elapsed / speed`). The component shows
  `text.slice(0, visibleCount)` plus a blinking `<Cursor />`. This keeps
  the speed equal on slow phones and fast PCs.
- A second `useEffect` calls `onComplete` once when the counter reaches
  the end.
- Change `restartKey` to type the same text again.
- The full text is rendered invisibly underneath to reserve its size, and
  screen readers get the full text at once (not letter by letter).
- With "reduce motion" turned on, the text appears instantly.

## The intro (onboarding)

Before the portfolio, a visitor sees two short pages with small
"command prompt" details (mono labels, a boot log) in the same light
theme as the rest of the site.

1. **Hello** — a short note to the Langdock team, and a small terminal that
   "boots" the portfolio.
2. **The short version** — the résumé in seven lines, built from
   `portfolioData.js`, then "Start the conversation".

- Move with Enter, arrow keys, the mouse wheel or a swipe; Esc or
  "Skip intro" goes straight to the portfolio. EN | DE works here too.
- Shown on every page load (opening the link or reloading). For quick
  testing, hide it with `?intro=0`.
- **Turn it off completely:** `ONBOARDING_ENABLED = false` in
  `src/config/onboarding.js`.
- Texts: `onboarding` in `portfolioData.js` (English + German) and the
  intro words in `uiText.js`. Code: `src/onboarding/Onboarding.jsx`.
- The intro uses the same light theme as the site (see "Where to change
  colours"); its `term.*` colours are the same values.

## Beyond IT (table tennis)

`sections/BeyondWork.jsx` asks "What does he do apart from IT?". After the
answer, `components/TableTennisStage.jsx` plays: a ball is served, bounces
over a small table, flies up and pops — and the word "Table Tennis"
("Tischtennis") bursts out of it, letter by letter from the middle. Then a
small rally keeps going. Texts and tags: `conversation.beyond` in
`portfolioData.js`.

## The app layout (AppShell.jsx)

The portfolio looks like an AI workspace app:

- **Sidebar (left):** logo, "New chat", one item per part (About,
  Education, Experience, Skills, Languages, Beyond IT, Why this portfolio,
  Contact), the three projects, "Today" (the current chat, named after its
  first question), an "Explore the portfolio" card that shows how much has
  been seen (click it for the next unseen part), and the name at the
  bottom (click → asks for the contact details).
  - Computers (1024px and wider): a column; the button next to the logo
    collapses it. Phones and tablets: a drawer that slides in from the
    left (☰ in the top bar).
  - Wheel and swipe gestures on the sidebar scroll the sidebar, not the
    slides (`data-deck-ignore`).
- **Top bar:** the title of what you are looking at (at home: the chat's
  first question), EN | DE, ☀/☾ for the dark / light look, and a button
  that copies the portfolio link.
- **Chat area:** the slides. Scrolling still moves one slide at a time.
  Every slide except home has a prompt box at the bottom; a question sent
  there fades back to the home chat and is answered there.
- **Messages:** round visitor bubbles on the right; AI answers with a
  round avatar, and copy / "write again" buttons underneath.

## Dark and light

Dark is the default. The ☀/☾ button switches, and the choice is
remembered (localStorage `portfolio-theme`). The colours are CSS
variables in `src/index.css` — one set for light, one for dark — so every
component works in both without changes (see "Where to change colours").
Where the browser supports it, the switch cross-fades the whole page.

## The home screen (Hero.jsx)

- **Start page (like an AI workspace's "new chat").** A pill at the top
  ("Application for Langdock · Contact"), the headline, the prompt box in a
  panel with a small bar underneath, and topic chips with icons.
  - **Projects folder** (under the box): a list of the projects; a click
    fades to that project's slide.
  - **Connect with him**: asks the chat for the contact details; the small
    icons next to it are direct links (email, portfolio website, LinkedIn
    when its URL is filled in). File: `components/ComposerExtras.jsx`.
- **Two states.** Empty: the start page above. After the first question:
  the chat thread fills the screen and the prompt box moves to the bottom
  (the panel and bar fold away). The move is animated with Framer Motion's
  `layout` prop, which measures the old and new position and slides between
  them with transforms.
- **Heading.** Each word fades in after the previous one (variants with
  `staggerChildren`), like generated text.
- **Prompt box** (`PromptComposer.jsx`):
  - `+` opens a menu of topics (from `askPortfolio.topics`).
  - **Plugins** (the three small icons): what the assistant can use —
    Résumé data (always on), Voice mode (on/off switch) and English /
    German (asks the chat to switch the language). All of them really work.
  - **Auto** (the "model" picker, with the assistant's mark): the answer
    mode. Auto answers directly; Think first shows its steps (read the
    question → search the topics → which keyword matched → write the
    answer). These steps describe what `answerEngine.js` really does. No
    real AI model is used — the answers come from `portfolioData.js`.
  - Microphone: dictation — your speech is typed into the field. With the
    Voice mode plugin on, it becomes voice mode: speak, the question is
    sent automatically and the answer is read aloud (`speechSynthesis`).
  - Send: gray until there is text.
  - Voice uses the browser's built-in Web Speech API (Chrome, Edge, Safari).
    Other browsers show a short message in the box instead.
- **Answers** have a round avatar with the assistant's mark
  (`AssistantMark.jsx`, a simple hooded figure like the logo), and copy /
  "write again" buttons underneath.
- **Shortcut:** press `/` anywhere to jump into the prompt box (on the
  other slides: into the box at the bottom).
- **Buttons type for the visitor:** the name in the sidebar (contact) and
  the EN | DE switch don't open anything directly. Each one types a question
  into the prompt bar and sends it ("How can I contact Tejeshwaran?", "Change the entire
  website to German"). The questions are in `askPortfolio` in
  `portfolioData.js` (`contactQuestion`, `languageQuestions`).
- **Email in the last part ("Is that everything?"):** they don't
  open anything either. A small chat pops open inside the contact card,
  types the question, and shows the answer with the contact cards
  (`sections/Footer.jsx`).
- **Contact (the name in the sidebar):** it does not open an email. It
  goes to the home chat, types "How can I contact Tejeshwaran?" into the
  prompt box letter by letter (`typeAndSubmit` in `PromptComposer.jsx`),
  sends it, and the answer shows contact cards with copy buttons
  (`ContactDetails.jsx`). The sidebar talks to the home screen through a
  small browser event
  (`src/utils/askEvents.js` → `requestAsk(question)`), so any other button
  can do the same. The question text is `askPortfolio.contactQuestion` and the
  cards come from `contactDetails` in `portfolioData.js`.

## English / German

The whole website exists in English and German.

- **Résumé texts:** in `portfolioData.js`, text that differs between the
  languages is written as `L('English', 'Deutsch')`. Facts that are the same
  (names, dates, technologies) are written once.
  `createPortfolioData(language)` picks one language.
- **Interface words** (buttons, labels): `src/i18n/uiText.js`.
- **`src/i18n/LanguageContext.jsx`** shares the current language with every
  component: `const { data, t, language } = useLanguage()`.
- **Switching:** the EN | DE button asks the chat to "Change the entire
  website to German". `answerEngine.js` recognises this as a command, the
  AI answers, and 1.2 s later `usePortfolioChat.js` calls `setLanguage('de')`.
  Every text on the page re-renders (the answers type themselves again).
  The chat then clears and the home screen shows its headline again, in the
  new language (`announceLanguageSwitch` / `onLanguageSwitch` in
  `utils/askEvents.js`).
  Visitors can also type the request themselves, in English or German.
- The choice is remembered in the browser for the next visit.

## 5. Where to change personal information

**Only in `src/data/portfolioData.js`** (English and German side by side,
see above). It contains:

- `personal` – name, email, location, LinkedIn, portfolio URL
- `education`, `experience`, `projects`, `skills`, `languages`
- `conversation` – every question and AI answer on the page
- `askPortfolio` – suggestions and keyword answers for the chat widget

> **LinkedIn:** `personal.linkedin` is empty right now. Paste your profile
> URL there and the LinkedIn links appear automatically in the header and
> the footer.

The chat answers (home screen and Ask section) are built from the same
data in `buildResponses()`, so they stay in sync. Keywords are listed in
both languages. The matching logic is `findAnswer()` in
`src/utils/answerEngine.js`: clean up the question, then return the first
response whose keyword appears in it. Order matters — put specific topics
before general ones. Put spaces around a keyword (`' hi '`) to match only
the whole word. A response can have an optional `link` button.

The home heading and placeholder are in `conversation.hero`.

## 6. Where to change colours

The colour values are CSS variables in `src/index.css`: `:root` holds the
light look, `:root[data-theme='dark']` the dark look. Each value is
"red green blue" (e.g. `31 32 38`). `tailwind.config.js` →
`theme.extend.colors` only gives them names.

| Name          | Used for                   |
| ------------- | -------------------------- |
| `canvas`      | chat area background       |
| `sidebar`     | the sidebar                |
| `surface`     | cards                      |
| `subtle`      | quiet fills (chips)        |
| `composer`    | the "Ask anything" bar     |
| `bubble`      | user chat bubbles          |
| `line`        | borders                    |
| `ink`         | headings, main text        |
| `body`        | paragraph text             |
| `muted`       | labels, placeholders       |
| `accent`      | accent: soft blue (dark) / deep teal (light); `accent.fill` = voice button |
| `success`     | green "online" dots, "copied" ticks |

Dark: near-black sidebar, graphite chat area, soft blue accent. Light:
soft gray page, near-black text, flat white cards, deep-teal accent.
Layout and feel follow the Langdock app, but only the feeling is
borrowed — no Langdock logo, text or font. Fonts: Geist (text and headlines, `font-display`, with tight
letter spacing) and Geist Mono (terminal-style labels), both free on
Google Fonts.

Components only use these names (`bg-canvas`, `text-accent` …), so one
change updates the whole site. Fonts are set in the same file and loaded
in `index.html`.

## 7. Where to add projects

Add an object to the `projects` array in `portfolioData.js`. That is all —
`src/sections/Projects.jsx` turns every project into its own question and
answer (`question` and `answer` fields).

- `type: 'dashboard'` → analytics-workspace preview with an
  "Analyze project" panel (uses `capabilities`).
- `type: 'web'` → browser-window preview and a "View project" link
  (uses `link`).
- `type: 'app'` → desktop-app preview with the floating dictation pill and a
  capability list (used by Pillo).
- Optional: `status` (e.g. "In development") and `collaborator`
  (e.g. "Claude AI", shown as "Built together with Claude AI").

Adding any other section works the same way: a new `ConversationBlock`
with a `question`, an `answer` and cards as `children`.

## 8. Deploy to GitHub Pages

`vite.config.js` uses `base: './'`, so the build works under any repository
name.

1. Create a GitHub repository and push this project.
   ```bash
   git init
   git add .
   git commit -m "AI portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-user>/<repo-name>.git
   git push -u origin main
   ```
2. Deploy:
   ```bash
   npm run deploy
   ```
   This builds the site and pushes `dist/` to a `gh-pages` branch
   (using the `gh-pages` package).
3. On GitHub: **Settings → Pages → Source: Deploy from a branch →
   `gh-pages` / root**.
4. After a minute the site is live at
   `https://<your-user>.github.io/<repo-name>/`.

---

## Accessibility and performance notes

- Semantic sections, one `h1`, labelled navigation, skip link.
- Visible focus ring on every interactive element (`index.css`).
- `prefers-reduced-motion`: typing is skipped, conversations appear
  finished, movement is removed (`<MotionConfig reducedMotion="user">`)
  and CSS animations stop.
- Scroll animations only change `opacity` and `transform` (GPU-friendly).
- The chat widget is lazy-loaded (`React.lazy`) in its own small file.
