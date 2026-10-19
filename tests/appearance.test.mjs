import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../public/appearance.js', import.meta.url), 'utf8');
function setup({dark=false,saved=null,blocked=false}={}) {
  const store = new Map(saved ? [['gatherly-appearance', saved]] : []);
  const events = {}, systemEvents = {}, controlEvents = {};
  const root = {dataset:{},style:{}};
  const control = {value:'',addEventListener:(name,cb)=>controlEvents[name]=cb};
  let color;
  const media = {matches:dark,addEventListener:(name,cb)=>systemEvents[name]=cb};
  const context = vm.createContext({
    window:{matchMedia:()=>media,addEventListener:(name,cb)=>events[name]=cb},
    localStorage:{getItem:key=>{if(blocked)throw Error();return store.get(key);},setItem:(key,value)=>{if(blocked)throw Error();store.set(key,value);}},
    document:{documentElement:root,querySelector:selector=>selector==='#appearance'?control:{setAttribute:(_,value)=>color=value},addEventListener:(name,cb)=>events[name]=cb}
  });
  vm.runInContext(source,context);
  return {root,control,store,color:()=>color,bind:()=>events.DOMContentLoaded(),choose:value=>controlEvents.change({target:{value}}),system:dark=>{media.matches=dark;systemEvents.change();},storage:value=>events.storage({key:'gatherly-appearance',newValue:value})};
}
test('applies system appearance before DOM ready to prevent a light flash',()=>{
  const c=setup({dark:true});assert.equal(c.root.dataset.theme,'dark');assert.equal(c.root.style.colorScheme,'dark');assert.equal(c.color(),'#0b0c10');c.bind();assert.equal(c.control.value,'system');
});
test('system changes apply live, but never override explicit appearance',()=>{
  const c=setup();c.bind();assert.equal(c.root.dataset.theme,'light');c.system(true);assert.equal(c.root.dataset.theme,'dark');c.choose('light');c.system(true);assert.equal(c.root.dataset.theme,'light');assert.equal(c.store.get('gatherly-appearance'),'light');c.choose('system');assert.equal(c.root.dataset.theme,'dark');c.system(false);assert.equal(c.root.dataset.theme,'light');
});
test('saved dark and light override system at startup',()=>{
  assert.equal(setup({saved:'dark'}).root.dataset.theme,'dark');assert.equal(setup({saved:'light',dark:true}).root.dataset.theme,'light');
});
test('invalid stored value falls back to system',()=>assert.equal(setup({saved:'invalid',dark:true}).root.dataset.theme,'dark'));
test('blocked storage still supports appearance changes',()=>{
  const c=setup({blocked:true,dark:true});c.bind();c.choose('light');assert.equal(c.root.dataset.theme,'light');
});
test('other tabs can update preference or return to system',()=>{
  const c=setup({dark:true});c.bind();c.storage('light');assert.equal(c.root.dataset.theme,'light');assert.equal(c.control.value,'light');c.storage(null);assert.equal(c.root.dataset.theme,'dark');assert.equal(c.control.value,'system');
});
