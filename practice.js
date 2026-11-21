/* Slaude Economics: practice board.
   Add curve pieces, move and stretch them, label the axes, then reveal the answer. */
(function(){
'use strict';

/* ======================================================================
   QUESTIONS
   view = the note on learn.html that shows the model answer.
   ====================================================================== */
var QUESTIONS = [
  {id:'mono-snp', th:'3', spec:'3.4.5', view:'profit',
   q:'Draw a profit-maximising monopolist making supernormal profit. Label the price and output, and shade the supernormal profit.',
   check:['Axes labelled Costs / revenue and Output','AR (= D) slopes down, with MR below it and twice as steep','MC is a tick shape that cuts AC at the lowest point of AC','Output Q₁ is where MR = MC','Price P₁ is read off AR, not off MC','The profit box runs from P₁ down to AC at Q₁']},
  {id:'mono-alloc', th:'3', spec:'3.4.1', view:'alloc',
   q:'On a monopoly diagram, show the monopolist’s price and output, and the allocatively efficient price and output.',
   check:['Monopoly output where MR = MC, price read off AR','Allocative efficiency where AR meets MC (P = MC)','Allocatively efficient output is higher and its price lower','Both prices and outputs labelled']},
  {id:'mono-dwl', th:'3', spec:'3.4.5', view:'dwl',
   q:'Show the deadweight welfare loss caused by a monopoly.',
   check:['Monopoly output Q₁ where MR = MC','Efficient output Q₂ where AR = MC','The triangle sits between AR and MC, from Q₁ to Q₂','It does not touch MR or AC']},
  {id:'mono-prod', th:'3', spec:'3.4.1', view:'prod',
   q:'Show that a profit-maximising monopolist is productively inefficient.',
   check:['MC cuts AC at the lowest point of AC (the MES)','The monopolist’s output Q₁ is to the left of the MES','Average cost at Q₁ is above the minimum']},
  {id:'mono-costup', th:'3', spec:'3.4.5', view:'costup', shift:true,
   q:'A monopolist’s variable costs rise. Show the effect on price, output and profit.',
   check:['MC and AC both shift up (MC₁ to MC₂, AC₁ to AC₂)','New MR = MC at a lower output, Q₂','Price rises from P₁ to P₂, read off AR','The profit box shrinks']},
  {id:'mono-fixed', th:'3', spec:'3.4.5', view:'fixed', shift:true,
   q:'A lump-sum tax raises a monopolist’s fixed costs. Show the effect on price, output and profit.',
   check:['Only AC shifts up; MC does not move','MR = MC at the same output, so price and output are unchanged','The profit box shrinks from below']},
  {id:'revmax', th:'3', spec:'3.2.1', view:'revmax',
   q:'Show profit maximisation and revenue maximisation on the same monopoly diagram.',
   check:['Profit maximisation where MR = MC','Revenue maximisation where MR = 0','Revenue-maximising output is higher and its price lower','Both prices read off AR']},
  {id:'pc-snp', th:'3', spec:'3.4.2', view:'pc_snp', two:true,
   q:'Draw the industry and a firm in perfect competition, with the firm making supernormal profit in the short run.',
   check:['Industry S and D set the price P₁','The firm’s AR = MR is horizontal at P₁','The firm produces where MC = MR','AR is above AC at that output, and the profit is shaded']},
  {id:'pc-entry', th:'3', spec:'3.4.2', view:'pc_entry', two:true, shift:true,
   q:'Firms in a perfectly competitive market are making supernormal profit. Show what happens in the long run as new firms enter.',
   check:['Industry supply shifts right, S₁ to S₂','The price falls from P₁ to P₂','The firm’s AR = MR line falls with it','The new price is at the lowest point of AC: normal profit only']},
  {id:'mc-lr', th:'3', spec:'3.4.3', view:'mc_lr',
   q:'Draw a firm in monopolistic competition in long-run equilibrium.',
   check:['AR slopes down, flatter than a monopolist’s','AR just touches AC, directly above where MR = MC','Price equals average cost: normal profit','The tangency is on the falling part of AC']},
  {id:'mc-entry', th:'3', spec:'3.4.3', view:'mc_entry', shift:true,
   q:'A firm in monopolistic competition is making supernormal profit. Show the effect of new firms entering the market.',
   check:['AR and MR shift left (AR₁ to AR₂)','Entry continues until AR is tangent to AC','Price and output fall','Only normal profit is left']},
  {id:'kink', th:'3', spec:'3.4.4', view:'eqm',
   q:'Draw the kinked demand curve with its marginal revenue, and show the profit-maximising price.',
   check:['AR kinks at the current price P₁: shallow above, steep below','MR has a vertical gap directly below the kink','MC passes through the gap','The price stays at P₁, the kink']},
  {id:'rigid', th:'3', spec:'3.4.4', view:'rigid', shift:true,
   q:'Use the kinked demand curve to show that a small rise in costs does not change the price.',
   check:['MC shifts up but still cuts MR inside the gap','Price and output stay at P₁ and Q₁','Profit falls instead']},
  {id:'nat-reg', th:'3', spec:'3.4.5', view:'nm_reg',
   q:'Draw a natural monopoly, and show what happens if it is regulated to charge P = MC.',
   check:['AC falls across the whole of demand, with MC below it','Unregulated output where MR = MC','Regulated price where AR = MC','The price is below AC, so the loss (subsidy) is shaded']},
  {id:'contest', th:'3', spec:'3.4.7', view:'cm_threat', shift:true,
   q:'A monopolist operates in a perfectly contestable market. Show the price it charges compared with the profit-maximising price.',
   check:['Profit maximisation at Pₘ, Qₘ where MR = MC','The contestable price is where AR = AC','Lower price and higher output','Normal profit only']},
  {id:'tariff', th:'4', spec:'4.1.6', view:'tf_areas',
   q:'Show the effect of a tariff on the domestic market, and label the four areas of consumer surplus that are lost.',
   check:['World supply is horizontal at P₁, below where domestic S and D cross','The tariff lifts world supply to P₂','Domestic output rises (Q₁ to Q₃), consumption falls (Q₂ to Q₄)','A is producer surplus, C is tariff revenue, B and D are deadweight loss']},
  {id:'quota', th:'4', spec:'4.1.6', view:'qt',
   q:'Show the effect of an import quota on the domestic market.',
   check:['S total is domestic supply plus the quota, starting from the world price','The price rises to where S total meets demand','Area C goes to the foreign firms still selling, not the government']},
  {id:'subsidy', th:'4', spec:'4.1.6', view:'sb', shift:true,
   q:'Show the effect of a subsidy to domestic producers of an imported good.',
   check:['Domestic supply shifts right','The price stays at the world price','Domestic output rises and imports fall','The cost of the subsidy is shaded']},
  {id:'create', th:'4', spec:'4.1.5', view:'bl_create',
   q:'Show trade creation when a country joins a customs union.',
   check:['Before joining, imports carry a tariff at P₁','Inside the union the price falls to P₂','Consumption rises and domestic output falls','The net gain to society is B + D']},
  {id:'fx-dep', th:'4', spec:'4.1.8', view:'fx_sup', shift:true,
   q:'Draw the market for pounds and show a depreciation caused by a cut in UK interest rates.',
   check:['Axes: Price of £ (in $) and Quantity of £','Hot money leaves, so the supply of pounds shifts right','The exchange rate falls from e₁ to e₂']},
  {id:'fx-fix', th:'4', spec:'4.1.8', view:'fx_fix_buy', shift:true,
   q:'Speculators sell pounds. Show how the central bank keeps the pound at its fixed rate.',
   check:['Supply of pounds shifts right, pushing the rate down','The central bank buys pounds (or raises interest rates)','Demand for pounds shifts right','The rate returns to e₁']},
  {id:'fx-adas', th:'4', spec:'4.1.8', view:'fx_adas', shift:true,
   q:'Show the effect of a depreciation of the pound on real GDP and the price level.',
   check:['Axes: Price level and Real GDP','AS flat at first, then curving up to vertical','Net exports rise, so AD shifts right','Real GDP and the price level both rise']},
  {id:'ppc', th:'4', spec:'4.1.2', view:'ca_gain', two:true,
   q:'The UK and Senegal specialise and trade. Draw each country’s production possibility curve and trading possibility curve.',
   check:['Each PPC is a straight line between its two maximum outputs','Each country specialises in its comparative advantage good','The TPC pivots out from the specialised good','The TPC lies outside the PPC: gains from trade']}
];

/* ======================================================================
   PIECES
   ====================================================================== */
var CURVES = {
  mc:  {label:'MC',   col:'mc', d:[['M',0,0.62],['C',0.1,0.95,0.32,1.02,0.5,0.82],['C',0.68,0.62,0.86,0.3,1,0]], end:[1,0]},
  ac:  {label:'AC',   col:'ac', d:[['M',0,0],['C',0.12,0.75,0.32,1,0.52,1],['C',0.72,1,0.88,0.75,1,0.25]], end:[1,0.25]},
  lrac:{label:'LRAC', col:'ac', d:[['M',0,0],['C',0.12,0.65,0.35,0.92,1,0.95]], end:[1,0.95]},
  lrmc:{label:'LRMC', col:'mc', d:[['M',0,1],['C',0.45,0.95,0.78,0.65,1,0]], end:[1,0]},
  as:  {label:'AS',   col:'ac', d:[['M',0,0.9],['L',0.45,0.9],['C',0.75,0.9,0.9,0.65,0.93,0]], end:[0.93,0]}
};
var COLOURS = [['ink','Black'],['ar','Blue'],['mr','Purple'],['mc','Red'],['ac','Green']];
var FILLS = [['profit','Profit','#FFDD33'],['cost','Loss / cost','#FF8DBA'],['dwl','Welfare loss','#FF9A3D'],['cs','Consumer surplus','#6FB8FF'],['gain','Gain','#74D99A']];
var W=1000, H=700;
var AXES = {
  one:[{ox:110,oy:610,top:80,right:940}],
  two:[{ox:90,oy:610,top:80,right:462},{ox:572,oy:610,top:80,right:945}]
};

/* ======================================================================
   STATE
   ====================================================================== */
var st = {q:0, pieces:[], axes:{}, mode:'one', sel:null, revealed:false, n:0, editing:null};
var undoStack = [];
var svg = document.getElementById('svg'), board = document.getElementById('board');

function snapshot(){ return JSON.stringify({pieces:st.pieces, axes:st.axes, mode:st.mode}); }
function restore(s){ var o=JSON.parse(s); st.pieces=o.pieces; st.axes=o.axes||{}; st.mode=o.mode||'one'; }
function pushUndo(s){ undoStack.push(s||snapshot()); if(undoStack.length>60) undoStack.shift(); }
function key(){ return 'slaude-practice:'+QUESTIONS[st.q].id; }
function save(){ try{ localStorage.setItem(key(), snapshot()); }catch(e){} }
function uid(){ return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function r1(n){ return Math.round(n*10)/10; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
/* "P_1" becomes P with a subscript 1 */
function fmt(s){
  var out='', down=false;
  String(s).split(/(_[A-Za-z0-9]+)/).forEach(function(part){
    if(!part) return;
    if(part.charAt(0)==='_'){ out+='<tspan class="sub" dy="'+(down?0:6)+'">'+esc(part.slice(1))+'</tspan>'; down=true; }
    else { out+= down ? '<tspan dy="-6">'+esc(part)+'</tspan>' : esc(part); down=false; }
  });
  return out;
}

/* ======================================================================
   DRAWING
   ====================================================================== */
function curvePath(p){
  var c=CURVES[p.t];
  return c.d.map(function(seg){
    var s=seg[0];
    for(var i=1;i<seg.length;i+=2) s+=(i>1?' ':'')+r1(p.x+seg[i]*p.w)+','+r1(p.y+seg[i+1]*p.h);
    return s;
  }).join(' ');
}
function labelAnchor(p){
  if(CURVES[p.t]){ var e=CURVES[p.t].end; return [p.x+e[0]*p.w, p.y+e[1]*p.h]; }
  if(p.t==='line') return [p.x2, p.y2];
  return [p.x, p.y];
}
function render(){
  var a=AXES[st.mode], s='';
  /* grid and axes */
  a.forEach(function(ax){
    for(var x=ax.ox+25; x<ax.right; x+=25) s+='<line class="g-line" x1="'+x+'" x2="'+x+'" y1="'+ax.top+'" y2="'+ax.oy+'"/>';
    for(var y=ax.oy-25; y>ax.top; y-=25) s+='<line class="g-line" y1="'+y+'" y2="'+y+'" x1="'+ax.ox+'" x2="'+ax.right+'"/>';
  });
  a.forEach(function(ax){
    s+='<path class="g-axis" d="M'+ax.ox+' '+(ax.top-12)+'V'+ax.oy+'H'+(ax.right+10)+'"/>'
      +'<path class="g-axis" d="M'+(ax.ox-8)+' '+(ax.top-2)+'L'+ax.ox+' '+(ax.top-14)+'L'+(ax.ox+8)+' '+(ax.top-2)+'"/>'
      +'<path class="g-axis" d="M'+(ax.right-2)+' '+(ax.oy-8)+'L'+(ax.right+12)+' '+ax.oy+'L'+(ax.right-2)+' '+(ax.oy+8)+'"/>'
      +'<text class="g-o" x="'+(ax.ox-14)+'" y="'+(ax.oy+30)+'" text-anchor="end">O</text>';
  });
  a.forEach(function(ax,i){ s+=axisLabel('y'+(i+1))+axisLabel('x'+(i+1)); });
  var shades='', strokes='', texts='', sel=null;
  st.pieces.forEach(function(p){
    if(p.id===st.sel) sel=p;
    var col=p.col||'ink';
    if(p.t==='box'){
      shades+='<rect class="shade f-'+p.fill+'" data-id="'+p.id+'" x="'+r1(p.x)+'" y="'+r1(p.y)+'" width="'+r1(p.w)+'" height="'+r1(p.h)+'"/>';
    } else if(p.t==='tri'){
      shades+='<polygon class="shade f-'+p.fill+'" data-id="'+p.id+'" points="'+p.p.map(function(v){return r1(v[0])+','+r1(v[1]);}).join(' ')+'"/>';
    } else if(p.t==='text'){
      if(!isEditing(p.id)) texts+='<text class="lab t-'+col+'" data-id="'+p.id+'" x="'+r1(p.x)+'" y="'+r1(p.y)+'">'+fmt(p.label||'')+'</text>';
    } else {
      var d = p.t==='line' ? 'M'+r1(p.x1)+' '+r1(p.y1)+'L'+r1(p.x2)+' '+r1(p.y2) : curvePath(p);
      strokes+='<g><path class="pc k-'+col+(p.dash?' dash':'')+'" d="'+d+'"/><path class="hit" data-id="'+p.id+'" d="'+d+'"/>';
      if(p.label && !isEditing(p.id)){ var an=labelAnchor(p); texts+='<text class="lab t-'+col+'" data-id="'+p.id+'" data-role="label" x="'+r1(an[0]+p.lx)+'" y="'+r1(an[1]+p.ly)+'">'+fmt(p.label)+'</text>'; }
      strokes+='</g>';
    }
  });
  /* a selected curve can be grabbed anywhere inside its dotted box */
  var grab = (sel && CURVES[sel.t]) ? '<rect class="grab" data-id="'+sel.id+'" x="'+r1(sel.x)+'" y="'+r1(sel.y)+'" width="'+r1(sel.w)+'" height="'+r1(sel.h)+'"/>' : '';
  s+=shades+grab+strokes+texts;
  if(sel) s+=handlesFor(sel);
  svg.innerHTML=s;
  renderSel();
}
function isEditing(id){ return st.editing && st.editing.kind==='piece' && st.editing.id===id; }
function isStroke(p){ return !!CURVES[p.t] || p.t==='line'; }
/* where each axis label goes: the vertical one beside the arrow, the horizontal one under the arrow */
function axisGeom(key){
  var ax=AXES[st.mode][(+key.charAt(1))-1]; if(!ax) return null;
  if(key.charAt(0)==='y') return {x:ax.ox+18, y:ax.top-30, anchor:'start', bx:ax.ox+12, by:ax.top-62, bw:200};
  return {x:ax.right+12, y:ax.oy+52, anchor:'end', bx:ax.right+18-200, by:ax.oy+22, bw:200};
}
function axisLabel(key){
  var g=axisGeom(key); if(!g || (st.editing && st.editing.kind==='axis' && st.editing.key===key)) return '';
  var v=st.axes[key];
  if(v) return '<text class="ax-lab" data-axis="'+key+'" x="'+g.x+'" y="'+g.y+'" text-anchor="'+g.anchor+'">'+fmt(v)+'</text>';
  return '<rect class="ax-empty" data-axis="'+key+'" x="'+g.bx+'" y="'+g.by+'" width="'+g.bw+'" height="40" rx="5"/>'
       + '<text class="ax-ph" data-axis="'+key+'" x="'+(g.bx+12)+'" y="'+(g.by+28)+'">label?</text>';
}
function labelPos(p){
  if(p.t==='text') return [p.x, p.y];
  var an=labelAnchor(p); return [an[0]+p.lx, an[1]+p.ly];
}
function handlePts(p){
  if(p.t==='line') return [['p1',p.x1,p.y1],['p2',p.x2,p.y2]];
  if(p.t==='tri') return p.p.map(function(v,i){ return ['v'+i,v[0],v[1]]; });
  if(p.t==='text') return [];
  return [['nw',p.x,p.y],['ne',p.x+p.w,p.y],['sw',p.x,p.y+p.h],['se',p.x+p.w,p.y+p.h]];
}
function handlesFor(p){
  var s='';
  if(p.w!==undefined && p.t!=='text') s+='<rect class="selbox-outline" x="'+r1(p.x)+'" y="'+r1(p.y)+'" width="'+r1(p.w)+'" height="'+r1(p.h)+'"/>';
  handlePts(p).forEach(function(h){
    s+='<circle class="handle-hit" data-h="'+h[0]+'" cx="'+r1(h[1])+'" cy="'+r1(h[2])+'" r="24"/>'
     + '<circle class="handle" data-h="'+h[0]+'" cx="'+r1(h[1])+'" cy="'+r1(h[2])+'" r="9"/>';
  });
  return s;
}

/* ======================================================================
   ADDING PIECES
   ====================================================================== */
function add(t, opt){
  pushUndo();
  var k=(st.n++%6)*22, p={id:uid(), t:t, lx:10, ly:-12};
  if(CURVES[t]){ p.x=330+k; p.y=150+k; p.w=330; p.h=340; p.label=CURVES[t].label; p.col=CURVES[t].col; p.dash=false; }
  else if(t==='line'){ p.x1=200+k; p.y1=130+k; p.x2=760+k; p.y2=560+k; p.label=''; p.col='ink'; p.dash=!!(opt&&opt.dash); }
  else if(t==='box'){ p.x=150+k; p.y=300+k; p.w=230; p.h=90; p.fill='profit'; }
  else if(t==='tri'){ p.p=[[470+k,330+k],[470+k,450+k],[600+k,450+k]]; p.fill='dwl'; }
  else if(t==='text'){ p.x=150+k; p.y=280+k; p.label=''; p.col='ink'; }
  st.pieces.push(p); st.sel=p.id;
  render(); save();
  if(p.t==='text' || p.t==='line') openEditor({kind:'piece', id:p.id});
}
function get(id){ for(var i=0;i<st.pieces.length;i++) if(st.pieces[i].id===id) return st.pieces[i]; return null; }

/* ======================================================================
   POINTER: move, stretch, move labels
   ====================================================================== */
var drag=null;
function pt(e){
  var m=svg.getScreenCTM(); if(!m) return {x:0,y:0};
  var q=svg.createSVGPoint(); q.x=e.clientX; q.y=e.clientY; q=q.matrixTransform(m.inverse());
  return {x:q.x, y:q.y};
}
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
svg.addEventListener('pointerdown', function(e){
  if(e.button!==undefined && e.button!==0) return;
  var t=e.target, h=t.getAttribute && t.getAttribute('data-h'), id=t.getAttribute && t.getAttribute('data-id');
  var axk=t.getAttribute && t.getAttribute('data-axis'), role=t.getAttribute && t.getAttribute('data-role');
  if(axk){ e.preventDefault(); commitEdit(); openEditor({kind:'axis', key:axk}); return; }
  if(st.editing) commitEdit();
  var p0=pt(e);
  if(h && st.sel){ drag={mode:'handle', h:h, start:p0, before:snapshot(), orig:JSON.parse(JSON.stringify(get(st.sel)))}; }
  else if(id){
    st.sel=id; var p=get(id);
    drag={mode: role==='label' ? 'label' : 'move', id:id, role:role, start:p0, before:snapshot(), orig:JSON.parse(JSON.stringify(p))};
    render();
  } else { if(st.sel){ st.sel=null; render(); } return; }
  svg.setPointerCapture(e.pointerId);
  e.preventDefault();
});
svg.addEventListener('pointermove', function(e){
  if(!drag) return;
  var p=get(st.sel); if(!p) return;
  var q=pt(e), dx=q.x-drag.start.x, dy=q.y-drag.start.y, o=drag.orig;
  if(!drag.moved && Math.abs(dx)+Math.abs(dy)<4) return;
  drag.moved=true;
  if(drag.mode==='label'){ p.lx=o.lx+dx; p.ly=o.ly+dy; }
  else if(drag.mode==='move'){
    if(p.t==='line'){ p.x1=o.x1+dx; p.y1=o.y1+dy; p.x2=o.x2+dx; p.y2=o.y2+dy; }
    else if(p.t==='tri'){ p.p=o.p.map(function(v){ return [v[0]+dx, v[1]+dy]; }); }
    else { p.x=clamp(o.x+dx,-(p.w||0)+30,W-30); p.y=clamp(o.y+dy,-(p.h||0)+30,H-30); }
  } else {
    var h=drag.h, x=clamp(q.x,0,W), y=clamp(q.y,0,H);
    if(h==='p1'){ p.x1=x; p.y1=y; } else if(h==='p2'){ p.x2=x; p.y2=y; }
    else if(h.charAt(0)==='v'){ p.p[+h.charAt(1)]=[x,y]; }
    else {
      var L=o.x, T=o.y, R=o.x+o.w, B=o.y+o.h, MIN=30;
      if(h.indexOf('w')>=0) L=Math.min(x, R-MIN); else R=Math.max(x, L+MIN);
      if(h.indexOf('n')>=0) T=Math.min(y, B-MIN); else B=Math.max(y, T+MIN);
      p.x=L; p.y=T; p.w=R-L; p.h=B-T;
    }
  }
  render();
});
function endDrag(){
  if(!drag) return;
  var d=drag; drag=null;
  if(snapshot()!==d.before){ pushUndo(d.before); save(); }
  /* a click (no drag) on a label, a text piece, or an unlabelled line opens the label box */
  if(!d.moved && d.id){
    var p=get(d.id);
    if(p && (d.role==='label' || p.t==='text' || (isStroke(p) && !p.label))) openEditor({kind:'piece', id:p.id});
  }
}
svg.addEventListener('pointerup', endDrag);
svg.addEventListener('pointercancel', endDrag);

/* ======================================================================
   LABEL BOX ON THE BOARD: type, press Enter, and the label is placed
   ====================================================================== */
var editor=document.createElement('input');
editor.type='text'; editor.className='board-edit'; editor.maxLength=28; editor.hidden=true; editor.setAttribute('autocomplete','off');
board.appendChild(editor);
function openEditor(ed){
  var x, y, w=20, val;
  if(ed.kind==='axis'){
    var g=axisGeom(ed.key); if(!g) return;
    x=g.bx; y=g.by; val=st.axes[ed.key]||'';
    editor.placeholder= ed.key.charAt(0)==='y' ? 'e.g. Costs / revenue' : 'e.g. Output';
    editor.setAttribute('aria-label', (ed.key.charAt(0)==='y'?'Vertical':'Horizontal')+' axis label. Press Enter to place it.');
  } else {
    var p=get(ed.id); if(!p) return;
    var lp=labelPos(p); x=lp[0]-6; y=lp[1]-32; w=17; val=p.label||'';
    editor.placeholder= p.t==='text' ? 'e.g. P_1' : 'e.g. AR = D';
    editor.setAttribute('aria-label', 'Label. Press Enter to place it.');
  }
  st.editing=ed; editor._before=snapshot(); editor.value=val;
  editor.style.width=w+'%';
  editor.style.left=clamp(x/W*100, 0, 100-w-0.5)+'%';
  editor.style.top=clamp(y/H*100, 0, 93)+'%';
  editor.hidden=false; render();
  /* keep the whole box inside the board on narrow screens */
  var bw=board.clientWidth, ew=editor.offsetWidth;
  if(editor.offsetLeft+ew>bw-4) editor.style.left=Math.max(0,bw-ew-4)+'px';
  editor.focus(); editor.select();
}
function commitEdit(cancel){
  var ed=st.editing; if(!ed) return;
  st.editing=null; editor.hidden=true;
  if(!cancel){
    var v=editor.value.trim();
    if(ed.kind==='axis') st.axes[ed.key]=v;
    else {
      var p=get(ed.id);
      if(p){ if(p.t==='text' && !v){ st.pieces=st.pieces.filter(function(x){return x!==p;}); st.sel=null; } else p.label=v; }
    }
  } else {
    var q=get(ed.id); if(q && q.t==='text' && !q.label){ st.pieces=st.pieces.filter(function(x){return x!==q;}); st.sel=null; }
  }
  if(snapshot()!==editor._before){ pushUndo(editor._before); save(); }
  render();
}
editor.addEventListener('keydown', function(e){
  if(e.key==='Enter'){ e.preventDefault(); commitEdit(false); }
  else if(e.key==='Escape'){ e.preventDefault(); commitEdit(true); }
});
editor.addEventListener('blur', function(){ commitEdit(false); });

/* ======================================================================
   SELECTION PANEL
   ====================================================================== */
var selTools=document.getElementById('sel-tools'), selEmpty=document.getElementById('sel-empty');
document.getElementById('swatches').innerHTML=COLOURS.map(function(c){
  return '<button type="button" class="sw" data-col="'+c[0]+'" title="'+c[1]+'" aria-label="'+c[1]+'" style="background:'+(c[0]==='ink'?'var(--ink)':'var(--pen-'+c[0]+')')+'"></button>';
}).join('');
document.getElementById('fills').innerHTML=FILLS.map(function(f){
  return '<button type="button" class="sw fillsw" data-fill="'+f[0]+'" style="background:'+f[2]+'">'+f[1]+'</button>';
}).join('');
function show(id, on){ document.getElementById(id).hidden=!on; }
function renderSel(){
  var p=st.sel?get(st.sel):null;
  selTools.hidden=!p; selEmpty.hidden=!!p;
  if(!p) return;
  var stroke=!!CURVES[p.t]||p.t==='line', shade=p.t==='box'||p.t==='tri';
  show('relabel', stroke||p.t==='text'); show('row-style', stroke); show('row-colour', stroke||p.t==='text'); show('row-fill', shade);
  document.getElementById('sel-kind').textContent = p.t==='box'?'Shade box':p.t==='tri'?'Shade triangle':p.t==='text'?'Text label':p.t==='line'?'Straight line':(CURVES[p.t].label+' curve');
  document.getElementById('sel-style').value=p.dash?'dash':'solid';
  var sw=document.querySelectorAll('[data-col]'); for(var i=0;i<sw.length;i++) sw[i].setAttribute('aria-pressed', sw[i].dataset.col===(p.col||'ink')?'true':'false');
  var fl=document.querySelectorAll('[data-fill]'); for(var j=0;j<fl.length;j++) fl[j].setAttribute('aria-pressed', fl[j].dataset.fill===p.fill?'true':'false');
}
document.getElementById('relabel').addEventListener('click', function(){
  var p=get(st.sel); if(p && (isStroke(p)||p.t==='text')) openEditor({kind:'piece', id:p.id});
});
document.getElementById('sel-style').addEventListener('change', function(e){
  var p=get(st.sel); if(!p) return; pushUndo(); p.dash=e.target.value==='dash'; render(); save();
});
document.getElementById('row-colour').addEventListener('click', function(e){
  var b=e.target.closest('[data-col]'), p=get(st.sel); if(!b||!p) return; pushUndo(); p.col=b.dataset.col; render(); save();
});
document.getElementById('row-fill').addEventListener('click', function(e){
  var b=e.target.closest('[data-fill]'), p=get(st.sel); if(!b||!p) return; pushUndo(); p.fill=b.dataset.fill; render(); save();
});
function del(){ var p=get(st.sel); if(!p) return; pushUndo(); st.pieces=st.pieces.filter(function(x){return x!==p;}); st.sel=null; render(); save(); }
document.getElementById('del').addEventListener('click', del);
document.getElementById('dup').addEventListener('click', function(){
  var p=get(st.sel); if(!p) return; pushUndo();
  var c=JSON.parse(JSON.stringify(p)); c.id=uid();
  if(c.t==='line'){ c.x1+=24; c.y1+=24; c.x2+=24; c.y2+=24; }
  else if(c.t==='tri'){ c.p=c.p.map(function(v){return [v[0]+24,v[1]+24];}); }
  else { c.x+=24; c.y+=24; }
  st.pieces.push(c); st.sel=c.id; render(); save();
});
function undo(){ if(!undoStack.length) return; restore(undoStack.pop()); st.sel=null; buildAxisInputs(); render(); save(); }
document.getElementById('undo').addEventListener('click', undo);
document.addEventListener('keydown', function(e){
  var tag=(document.activeElement&&document.activeElement.tagName)||'';
  if(tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA') return;
  if((e.ctrlKey||e.metaKey) && (e.key==='z'||e.key==='Z')){ e.preventDefault(); undo(); return; }
  if(!st.sel) return;
  if(e.key==='Delete'||e.key==='Backspace'){ e.preventDefault(); del(); return; }
  var d={ArrowLeft:[-5,0],ArrowRight:[5,0],ArrowUp:[0,-5],ArrowDown:[0,5]}[e.key];
  if(d){
    e.preventDefault(); var p=get(st.sel); pushUndo();
    if(p.t==='line'){ p.x1+=d[0]; p.x2+=d[0]; p.y1+=d[1]; p.y2+=d[1]; }
    else if(p.t==='tri'){ p.p=p.p.map(function(v){return [v[0]+d[0],v[1]+d[1]];}); }
    else { p.x+=d[0]; p.y+=d[1]; }
    render(); save();
  }
  if(e.key==='Escape'){ st.sel=null; render(); }
});

/* ======================================================================
   PALETTE
   ====================================================================== */
function icon(t){
  var box={x:8,y:5,w:60,h:30};
  if(CURVES[t]) return '<svg viewBox="0 0 76 40" aria-hidden="true"><path class="ic" d="'+curvePath({t:t,x:box.x,y:box.y,w:box.w,h:box.h})+'"/></svg>';
  if(t==='line') return '<svg viewBox="0 0 76 40" aria-hidden="true"><path class="ic" id="line-ic" d="M10 34L66 6"/></svg>';
  if(t==='box') return '<svg viewBox="0 0 76 40" aria-hidden="true"><rect class="icf" x="12" y="8" width="52" height="24" fill="#FFDD33" opacity=".75"/></svg>';
  if(t==='tri') return '<svg viewBox="0 0 76 40" aria-hidden="true"><polygon class="icf" points="18,6 18,34 60,34" fill="#FF9A3D" opacity=".75"/></svg>';
  return '<svg viewBox="0 0 76 40" aria-hidden="true"><text x="38" y="30" text-anchor="middle" font-family="Kalam, cursive" font-weight="700" font-size="24" fill="currentColor">P₁</text></svg>';
}
var pal=[['mc','MC'],['ac','AC'],['lrac','LRAC'],['lrmc','LRMC'],['as','AS'],['line','Straight line'],['box','Shade box'],['tri','Shade triangle'],['text','Text label']];
document.getElementById('palette').innerHTML=pal.map(function(t){
  var tile='<button type="button" class="tile" data-add="'+t[0]+'" aria-label="Add '+t[1]+'">'+icon(t[0])+'<span>'+t[1]+'</span></button>';
  if(t[0]==='line') return '<div class="linepick">'+tile+'<select id="line-kind" aria-label="Line style for new lines"><option value="solid">Solid</option><option value="dash">Dotted</option></select></div>';
  return tile;
}).join('');
document.getElementById('palette').addEventListener('click', function(e){
  var b=e.target.closest('[data-add]'); if(!b) return;
  add(b.dataset.add, {dash: document.getElementById('line-kind').value==='dash'});
});
document.getElementById('line-kind').addEventListener('change', function(e){
  document.getElementById('line-ic').setAttribute('class','ic'+(e.target.value==='dash'?' dash':''));
});

/* ======================================================================
   AXES: one diagram or two side by side, with typed labels
   ====================================================================== */
function buildAxisInputs(){
  document.getElementById('axes1').setAttribute('aria-pressed', st.mode==='one'?'true':'false');
  document.getElementById('axes2').setAttribute('aria-pressed', st.mode==='two'?'true':'false');
}
function setMode(m){ if(st.mode===m) return; commitEdit(); pushUndo(); st.mode=m; buildAxisInputs(); render(); save(); }
document.getElementById('axes1').addEventListener('click', function(){ setMode('one'); });
document.getElementById('axes2').addEventListener('click', function(){ setMode('two'); });

/* ======================================================================
   QUESTIONS AND THE REVEAL
   ====================================================================== */
var qsel=document.getElementById('qsel');
qsel.innerHTML=['3','4'].map(function(th){
  return '<optgroup label="Theme '+th+'">'+QUESTIONS.map(function(q,i){
    if(q.th!==th) return '';
    var short=q.q.split(/[.,:]/)[0];
    return '<option value="'+i+'">'+q.spec+' · '+esc(short.length>70?short.slice(0,68)+'…':short)+'</option>';
  }).join('')+'</optgroup>';
}).join('');
function loadQuestion(i, fromHash){
  st.q=(i+QUESTIONS.length)%QUESTIONS.length;
  var Q=QUESTIONS[st.q];
  qsel.value=String(st.q);
  document.getElementById('qtext').textContent=Q.q;
  document.getElementById('qmeta').innerHTML='<span class="status full">Theme '+Q.th+'</span><span class="status part">'+Q.spec+'</span>'
    + (Q.shift?'<span class="status part">Shift: the answer animates</span>':'')
    + (Q.two?'<span class="status part">Two diagrams</span>':'');
  if(st.editing){ st.editing=null; editor.hidden=true; }
  undoStack=[]; st.sel=null; st.n=0;
  var saved=null; try{ saved=localStorage.getItem(key()); }catch(e){}
  if(saved){ try{ restore(saved); }catch(e){ saved=null; } }
  if(!saved){ st.pieces=[]; st.axes={}; st.mode=Q.two?'two':'one'; }
  hideAnswer();
  buildAxisInputs(); render();
  if(!fromHash){ try{ history.replaceState(null,'','#q='+Q.id); }catch(e){} }
}
qsel.addEventListener('change', function(){ loadQuestion(+qsel.value); });
document.getElementById('qprev').addEventListener('click', function(){ loadQuestion(st.q-1); });
document.getElementById('qnext').addEventListener('click', function(){ loadQuestion(st.q+1); });
document.getElementById('clear').addEventListener('click', function(){
  if(!st.pieces.length && !Object.keys(st.axes).some(function(k){return st.axes[k];})) return;
  commitEdit(true); pushUndo(); st.pieces=[]; st.axes={}; st.sel=null; buildAxisInputs(); render(); save();
});

var answer=document.getElementById('answer'), frame=document.getElementById('ans-frame'), revealBtn=document.getElementById('reveal');
function hideAnswer(){ answer.hidden=true; frame.removeAttribute('src'); revealBtn.textContent='Reveal answer'; st.revealed=false; }
function showAnswer(){
  var Q=QUESTIONS[st.q];
  frame.src='learn.html?embed&r='+Date.now()+'#'+Q.view;
  document.getElementById('ans-link').href='learn.html#'+Q.view;
  document.getElementById('checklist').innerHTML=Q.check.map(function(c,i){
    return '<li><label><input type="checkbox" id="ck-'+i+'"><span>'+esc(c)+'</span></label></li>';
  }).join('');
  score();
  answer.hidden=false; revealBtn.textContent='Hide answer'; st.revealed=true;
  var narrow = window.matchMedia && window.matchMedia('(max-width:900px)').matches;
  (narrow ? answer : document.querySelector('.pgrid')).scrollIntoView({behavior:'smooth', block:'start'});
}
function score(){
  var all=document.querySelectorAll('#checklist input'), n=0;
  for(var i=0;i<all.length;i++) if(all[i].checked) n++;
  document.getElementById('score').textContent=n+' of '+all.length;
}
document.getElementById('checklist').addEventListener('change', score);
revealBtn.addEventListener('click', function(){ if(st.revealed) hideAnswer(); else showAnswer(); });
window.addEventListener('message', function(e){
  if(e.origin!==location.origin && location.origin!=='null') return;
  if(e.data && e.data.type==='econ-embed-height' && e.source===frame.contentWindow) frame.style.height=Math.max(220, Math.ceil(e.data.h))+'px';
});

/* start on the question in the address, if any */
function fromHash(){
  var m=(location.hash||'').match(/q=([\w-]+)/);
  if(m){ for(var i=0;i<QUESTIONS.length;i++) if(QUESTIONS[i].id===m[1]) return i; }
  return -1;
}
window.addEventListener('hashchange', function(){ var i=fromHash(); if(i>=0 && i!==st.q) loadQuestion(i, true); });
var start=fromHash(); loadQuestion(start>=0?start:0, start>=0);
})();
