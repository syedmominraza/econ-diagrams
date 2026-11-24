/* Slaude Economics: home page (spec index, live demo) */
(function(){
'use strict';

/* Old links pointed at the diagrams page with #topic or #view. Send them there. */
var TOPIC_IDS=['growth','objectives','revenue','costs','scale','profits','efficiency','barriers','perfect','monopoly','monopolistic','oligopoly','contestable','global','trade','protect','blocs','fx','bop','nature','demand','supply','elastic','price','taxsub','behave','extern','failure','intervene','govfail','measures','agg_d','agg_s','natinc','growth2','policy','e_growth','e_pc','e_fiscal','e_monetary','e_macro','e_mfail','e_gov','e_firms','e_micro','t1','t2','micro','macro','ev'];
var h=(location.hash||'').slice(1);
if(h && (TOPIC_IDS.indexOf(h)>=0 || (window.VIEW_NAMES && VIEW_NAMES[h]))){ location.replace('learn.html#'+h); return; }

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function firstView(p){ return p.items && p.items.length ? p.items[0][1][0] : null; }
var CHEV='<svg class="chev" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function sectionStatus(sec, th){
  if(th && th.brief) return ['part','Key topics'];   /* Themes 1 and 2 list only what the site covers */
  var built=0, all=sec.points.length;
  sec.points.forEach(function(p){ if(p.items) built++; });
  if(built===0) return ['soon','Coming soon'];
  if(sec.partial) return ['part','Some notes'];
  var full = sec.points.every(function(p){ return p.items; }) && sec.full!==false;
  if(sec.code==='3.4'||sec.code==='4.1') full = built===all;
  return full ? ['full','Covered'] : ['part', built+' of '+all+' points'];
}

var n=0, views=0, pointsBuilt=0;
var html=SPEC.map(function(th){
  var secs=th.sections.map(function(sec){
    var st=sectionStatus(sec, th);
    var pts=sec.points.map(function(p){
      var fv=firstView(p), id='pt-'+(n++);
      if(!fv) return '<li class="pt"><div class="pt-row"><span class="pt-link"><span class="code">'+p.code+'</span><span>'+esc(p.name)+' <span class="soon-note">coming soon</span></span></span></div></li>';
      pointsBuilt++;
      var body=p.items.map(function(it){
        views+=it[1].length;
        return '<div class="pt-item"><span>'+esc(it[0])+'</span><div class="pt-chips">'
          + it[1].map(function(v){ return '<a href="learn.html#'+v+'">'+esc(VIEW_NAMES[v]||v)+'</a>'; }).join('')
          + '</div></div>';
      }).join('');
      return '<li class="pt"><div class="pt-row">'
        + '<a class="pt-link" href="learn.html#'+fv+'"><span class="code">'+p.code+'</span><span class="pt-name">'+esc(p.name)+'</span></a>'
        + '<button type="button" class="pt-more" aria-expanded="false" aria-controls="'+id+'">What&#39;s covered</button></div>'
        + '<div class="pt-body" id="'+id+'" hidden>'+body+'</div></li>';
    }).join('');
    return '<details class="sect"'+(sec.open?' open':'')+'><summary><span class="code">'+sec.code+'</span><span class="sect-name">'+esc(sec.name)+'</span>'
      + '<span class="status '+st[0]+'">'+st[1]+'</span>'+CHEV+'</summary><ul class="pts">'+pts+'</ul></details>';
  }).join('');
  return '<article class="theme-card"><header><span>'+th.title+'</span><h3>'+esc(th.name)+'</h3>'+(th.note?'<p class="theme-note"><b>'+esc(th.note)+'</b></p>':'')+'</header>'+secs+'</article>';
}).join('');
var grid=document.getElementById('spec-grid');
grid.innerHTML=html;
grid.addEventListener('click', function(e){
  var b=e.target.closest ? e.target.closest('.pt-more') : null;
  if(!b) return;
  var body=document.getElementById(b.getAttribute('aria-controls')), open=b.getAttribute('aria-expanded')==='true';
  b.setAttribute('aria-expanded', open?'false':'true');
  body.hidden=open;
});

var uniq={}; SPEC.forEach(function(th){ th.sections.forEach(function(s){ s.points.forEach(function(p){ (p.items||[]).forEach(function(it){ it[1].forEach(function(v){ uniq[v]=1; }); }); }); }); });
document.getElementById('facts').innerHTML=
  '<li><b>'+Object.keys(uniq).length+'</b>notes</li><li><b>'+(TOPIC_IDS.length-5)+'</b>topics</li><li><b>'+pointsBuilt+'</b>spec points covered</li>';

/* size the live demo to its content */
var fr=document.getElementById('hero-frame');
window.addEventListener('message', function(e){
  if(e.origin!==location.origin && location.origin!=='null') return;
  if(e.data && e.data.type==='econ-embed-height' && e.source===fr.contentWindow) fr.style.height=Math.max(240, Math.ceil(e.data.h))+'px';
});
})();
