import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = ['translations.js', 'i18n.js'].map(file => readFileSync(new URL('../public/' + file, import.meta.url), 'utf8')).join('\n');
function client({ preferred = 'en-GB', saved = null, blocked = false } = {}) {
  const storage = new Map(saved ? [['gatherly-language', saved]] : []);
  const select = {};
  const context = vm.createContext({
    navigator: { languages: [preferred], language: preferred },
    localStorage: {
      getItem(key) { if (blocked) throw Error('Storage blocked'); return storage.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw Error('Storage blocked'); storage.set(key, value); }
    },
    document: { body: {}, documentElement: {}, createTreeWalker: () => ({ nextNode: () => false }), querySelectorAll: () => [], querySelector: () => select },
    NodeFilter: { SHOW_TEXT: 4 }
  });
  vm.runInContext(source, context);
  return { run: script => vm.runInContext(script, context), storage, select };
}
for (const preferred of ['zh', 'zh-CN', 'zh-TW', 'zh-HK', 'zh-Hans-CN']) {
  test(`${preferred} defaults to Chinese`, () => assert.equal(client({ preferred }).run('language'), 'zh'));
}
test('non-Chinese primary language defaults to English, even with Chinese as a secondary preference', () => {
  assert.equal(client({ preferred: 'fr-FR' }).run("detectLanguage({languages:['fr-FR','zh-CN'], language:'zh-CN'})"), 'en');
});
test('falls back to navigator.language when the preferences list is empty', () => {
  assert.equal(client().run("detectLanguage({languages:[],language:'zh-TW'})"), 'zh');
});
test('saved selection overrides system language both ways', () => {
  assert.equal(client({preferred:'zh-CN',saved:'en'}).run('language'), 'en');
  assert.equal(client({preferred:'en-GB',saved:'zh'}).run('language'), 'zh');
});
test('invalid stored preference falls back to detection', () => {
  assert.equal(client({preferred:'zh-CN',saved:'fr'}).run('language'), 'zh');
});
test('manual switching persists, updates page language, and interpolates Chinese counts', () => {
  const c = client();
  c.run("setLanguage('zh'); applyStaticLanguage()");
  assert.equal(c.storage.get('gatherly-language'), 'zh');
  assert.equal(c.run('document.documentElement.lang'), 'zh-CN');
  assert.equal(c.select.value, 'zh');
  assert.equal(c.run("t('{count} spots left', {count: 3})"), '剩余 3 个名额');
  c.run("setLanguage('en'); applyStaticLanguage()");
  assert.equal(c.run('document.documentElement.lang'), 'en');
  assert.equal(c.run("t('Discover')"), 'Discover');
});
test('blocked storage still permits detection and manual switching', () => {
  const c = client({preferred:'zh-CN',blocked:true});
  assert.equal(c.run('language'), 'zh');
  c.run("setLanguage('en')");
  assert.equal(c.run('language'), 'en');
});
