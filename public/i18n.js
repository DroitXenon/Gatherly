const LANGUAGE_KEY = 'gatherly-language';

// The browser exposes the user's preferred system/browser language, not OS settings directly.
function detectLanguage(client) {
  const preferred = client.languages?.[0] || client.language || 'en';
  return /^zh(?:[-_]|$)/i.test(preferred) ? 'zh' : 'en';
}

let savedLanguage;
try { savedLanguage = localStorage.getItem(LANGUAGE_KEY); } catch {}
let hasLanguagePreference = savedLanguage === 'en' || savedLanguage === 'zh';
let language = hasLanguagePreference ? savedLanguage : detectLanguage(navigator);

function t(message, values = {}) {
  let copy = language === 'zh' ? (chineseMessages[message] ?? message) : message;
  if (language === 'en' && values.count === 1) copy = copy.replace(' plans ', ' plan ');
  return copy.replace(/\{(\w+)\}/g, (match, key) => String(values[key] ?? match));
}

function setLanguage(next) {
  if (next !== 'en' && next !== 'zh') return;
  language = next;
  hasLanguagePreference = true;
  try { localStorage.setItem(LANGUAGE_KEY, next); } catch {}
}

// Capture only the original static shell before app.js renders any user content.
// Retain the original text so switching back restores exactly the English shell.
const staticTranslations = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  const original = node.textContent;
  const key = original.trim();
  if (Object.hasOwn(chineseMessages, key)) staticTranslations.push(() => {
    if (node.isConnected) node.textContent = original.replace(key, t(key));
  });
}
for (const element of document.querySelectorAll('[aria-label], [placeholder], meta[name="description"]')) {
  for (const attribute of ['aria-label', 'placeholder', 'content']) {
    const original = element.getAttribute(attribute);
    if (original && Object.hasOwn(chineseMessages, original)) {
      staticTranslations.push(() => element.setAttribute(attribute, t(original)));
    }
  }
}

function applyStaticLanguage() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = t('Gatherly — Good plans. Great people.');
  staticTranslations.forEach(update => update());
  document.querySelector('#language').value = language;
}
