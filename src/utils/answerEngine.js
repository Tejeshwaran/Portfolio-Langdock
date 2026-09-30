// ─────────────────────────────────────────────────────────────
// answerEngine.js — the "AI" of this portfolio.
//
// It is a simple keyword search, not a language model:
//  1. Clean up the question (lower case, no punctuation).
//  2. Is it a request to change the website language? → a command.
//  3. Does it ask about one skill ("Does he know React?")? → that skill's
//     answer (askPortfolio.skillAnswers, built from the skill data).
//  4. Otherwise go through askPortfolio.responses in order;
//     the first response with a keyword inside the question wins.
//  5. Nothing matched → the fallback answer.
// Every answer is written from portfolioData.js, so it cannot invent facts.
// ─────────────────────────────────────────────────────────────

/**
 * Lower-case the text, turn punctuation into spaces and add a space at
 * both ends. The outer spaces let keywords like ' hi ' match whole words,
 * even at the very start or end of the question.
 */
function normalize(text) {
  const cleaned = text
    .toLowerCase()
    .replace(/\.(?=\s|$)/g, ' ') // sentence-ending dots (but keeps ".net")
    .replace(/[^a-z0-9äöüßé#+.\s-]/g, ' ') // other punctuation (but keeps "c#")
  return ` ${cleaned.replace(/\s+/g, ' ').trim()} `
}

// ── Language commands ("Change the entire website to German") ──
const SWITCH_WORDS = ['change', 'switch', 'translate', 'ändere', 'ändern', 'wechsel', 'übersetz', 'umstell']
const LANGUAGE_WORDS = {
  de: ['german', 'deutsch'],
  en: ['english', 'englisch'],
}

// Words that turn a question into "does he know X?"
const KNOW_WORDS = [
  'know', 'use ', 'uses', 'used', 'experience with', 'experienced', 'familiar', 'can he', 'does he', 'worked with',
  'work with', 'good at', 'skilled', 'kennt', 'kann er', 'beherrscht', 'erfahrung mit', 'nutzt', 'arbeitet er mit',
  'kenntnisse in',
]

/** The skill a "does he know …?" question is about, or null */
function findSkillAnswer(normalizedQuestion, skillAnswers = []) {
  if (!KNOW_WORDS.some((word) => normalizedQuestion.includes(word))) return null
  return skillAnswers.find((skill) => skill.names.some((name) => normalizedQuestion.includes(name))) || null
}

/**
 * Returns 'de' or 'en' if the question asks to switch the website language,
 * otherwise null. The language named LAST wins, so "from German to English"
 * means English.
 */
function detectLanguageCommand(normalizedQuestion) {
  if (!SWITCH_WORDS.some((word) => normalizedQuestion.includes(word))) return null

  let target = null
  let lastPosition = -1
  for (const [language, words] of Object.entries(LANGUAGE_WORDS)) {
    for (const word of words) {
      const position = normalizedQuestion.lastIndexOf(word)
      if (position > lastPosition) {
        lastPosition = position
        target = language
      }
    }
  }
  return target
}

/**
 * Find the answer for a question.
 *   askPortfolio  the chat data in the current language (portfolioData.js)
 *   language      the current website language
 *   t             the interface-text helper (uiText.js)
 *
 * Returns { answer, topic, keyword, link, details, command }:
 *  - topic / keyword: what matched (null when nothing matched)
 *  - link:     optional { label, href } button under the answer
 *  - details:  optional list of contact cards
 *  - command:  optional action, e.g. { type: 'set-language', language: 'de' }
 */
export function findAnswer(question, { askPortfolio, language, t }) {
  const normalizedQuestion = normalize(question)

  const targetLanguage = detectLanguageCommand(normalizedQuestion)
  if (targetLanguage) {
    const languageName = t('languageName')[targetLanguage]
    const isAlready = targetLanguage === language
    return {
      answer: isAlready ? t('alreadyIn', languageName) : t('switchingTo', languageName),
      topic: 'language',
      keyword: languageName,
      link: null,
      details: null,
      command: isAlready ? null : { type: 'set-language', language: targetLanguage },
    }
  }

  const skill = findSkillAnswer(normalizedQuestion, askPortfolio.skillAnswers)
  if (skill) {
    return { answer: skill.answer, topic: 'skill', keyword: skill.name, link: skill.link, details: null, command: null }
  }

  for (const response of askPortfolio.responses) {
    const keyword = response.keywords.find((word) => normalizedQuestion.includes(word))
    if (keyword) {
      return {
        answer: response.answer,
        topic: response.topic,
        keyword: keyword.trim(),
        link: response.link || null,
        details: response.details || null,
        command: null,
      }
    }
  }

  return { answer: askPortfolio.fallback, topic: null, keyword: null, link: null, details: null, command: null }
}

/**
 * The steps shown when "Think" mode is on.
 * They describe what findAnswer() really does — nothing is made up.
 */
export function buildThoughtSteps(question, result, { askPortfolio, t }) {
  let matchStep = t('thoughtNoMatch')
  if (result.topic === 'language') matchStep = t('thoughtCommand', result.keyword)
  else if (result.topic) matchStep = t('thoughtMatched', result.topic, result.keyword)

  return [
    t('thoughtRead', question),
    t('thoughtSearch', askPortfolio.responses.length),
    matchStep,
    t('thoughtWrite'),
  ]
}
