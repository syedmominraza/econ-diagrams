/* Slaude Economics: shared page behaviour (colour mode, footer year) */
(function(){
'use strict';
var root=document.documentElement;
function currentMode(){
  var a=root.getAttribute('data-theme');
  if(a==='light'||a==='dark') return a;
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}
function showMode(){
  var m=currentMode(), l=document.getElementById('theme-light'), d=document.getElementById('theme-dark');
  if(l) l.setAttribute('aria-pressed', m==='light'?'true':'false');
  if(d) d.setAttribute('aria-pressed', m==='dark'?'true':'false');
}
function setMode(m){
  root.setAttribute('data-theme', m);
  try{ localStorage.setItem('tof-theme', m); }catch(e){}
  showMode();
  /* keep embedded diagrams (same site) in the same mode */
  var fr=document.querySelectorAll('iframe');
  for(var i=0;i<fr.length;i++){ try{ fr[i].contentDocument.documentElement.setAttribute('data-theme', m); }catch(e){} }
}
var t=document.querySelector('.site-head .theme');
if(t) t.addEventListener('click', function(e){
  var b=e.target.closest ? e.target.closest('[data-mode]') : null;
  if(b) setMode(b.dataset.mode);
});
showMode();
if(window.matchMedia){
  var mq=window.matchMedia('(prefers-color-scheme: dark)');
  if(mq.addEventListener) mq.addEventListener('change', showMode);
}
/* another tab changed the mode */
window.addEventListener('storage', function(e){
  if(e.key==='tof-theme' && (e.newValue==='light'||e.newValue==='dark')){ root.setAttribute('data-theme', e.newValue); showMode(); }
});
var y=document.getElementById('year'); if(y) y.textContent=String(new Date().getFullYear());
})();
