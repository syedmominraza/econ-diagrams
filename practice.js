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
  {id:'satisfice', th:'3', spec:'3.2.1', view:'ob_sat',
   q:'Draw supernormal profit against output with a minimum profit constraint. Show the output a manager who wants to maximise sales volume would choose.',
   check:['Profit rises to a peak where MR = MC, then falls to zero where AR = AC','The minimum profit constraint is a horizontal line below the peak','The manager produces where profit falls to the constraint, to the right of the profit-maximising output','That output is below the sales-maximising output, where profit reaches zero']},
  {id:'tr-hill', th:'3', spec:'3.3.1', view:'rv_tr', two:true,
   q:'Draw AR and MR for a price maker, with the total revenue curve beside it. Show where total revenue is highest.',
   check:['AR slopes down, and MR starts at the same point and is twice as steep','TR rises, peaks and then falls','TR is highest at the output where MR = 0','At that output PED = 1 (unit elastic)']},
  {id:'costs-sr', th:'3', spec:'3.3.2', view:'co_avg',
   q:'Draw a firm’s short-run AFC, AVC, ATC and MC curves.',
   check:['AFC falls all the way and never reaches the output axis','AVC and ATC are U-shaped, with ATC above AVC','The gap between ATC and AVC (which is AFC) narrows as output rises','MC cuts AVC and then ATC at their lowest points']},
  {id:'lrac-mes', th:'3', spec:'3.3.3', view:'sc_lrac',
   q:'Draw a long-run average cost curve. Label economies of scale, diseconomies of scale and the minimum efficient scale.',
   check:['Axes labelled Costs and Output','LRAC falls, reaches a minimum, then rises','Economies of scale on the falling part, diseconomies on the rising part','MES is the output at the lowest point of LRAC']},
  {id:'ext-eos', th:'3', spec:'3.3.3', view:'sc_ext', shift:true,
   q:'An industry grows and its firms gain external economies of scale. Show the effect on a firm’s long-run average cost.',
   check:['The whole LRAC curve shifts down, LRAC₁ to LRAC₂','Average cost is lower at every level of output','Caused by the industry growing (skilled labour, suppliers, infrastructure), not the firm itself']},
  {id:'shutdown', th:'3', spec:'3.3.4', view:'pf_shut',
   q:'Show a firm’s short-run and long-run shut-down points.',
   check:['MC, AVC and ATC drawn, with MC cutting both at their lowest points','Short-run shut-down point at the lowest point of AVC','Long-run shut-down point at the lowest point of ATC','The price at each point labelled on the vertical axis']},
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
  {id:'x-ineff', th:'3', spec:'3.4.1', view:'ef_x',
   q:'Illustrate X-inefficiency.',
   check:['Two AC curves: AC (attainable) and AC (actual) above it','The vertical gap between them is the X-inefficiency','Explained by slack, such as over-staffing, caused by a lack of competition']},
  {id:'ppf-dyn', th:'3', spec:'3.4.1', view:'ef_ppf', shift:true,
   q:'Use a production possibility frontier to show productive and dynamic efficiency.',
   check:['A point inside the PPF is productively inefficient','Any point on the PPF is productively efficient','Dynamic efficiency shown as the PPF shifting out, PPF₁ to PPF₂']},
  {id:'limit-eos', th:'3', spec:'3.4.7', view:'br_limit', shift:true,
   q:'Using a long-run average cost curve, show how an incumbent can use limit pricing to keep a new firm out.',
   check:['LRAC drawn, with the incumbent at a large output and low average cost','The new firm at a small output with a higher average cost','The limit price is below the new firm’s average cost but above the incumbent’s','The new firm would make a loss, so it stays out']},
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
  as:  {label:'AS',   col:'ac', d:[['M',0,0.9],['L',0.45,0.9],['C',0.75,0.9,0.9,0.65,0.93,0]], end:[0.93,0]},
  ppc: {label:'PPC',  col:'ar', d:[['M',0,0],['C',0.58,0,1,0.42,1,1]], end:[0.82,0.3]}
};
var COLOURS = [['ink','Black'],['ar','Blue'],['mr','Purple'],['mc','Red'],['ac','Green']];
var FILLS = [['profit','Profit','#FFDD33'],['cost','Loss / cost','#FF8DBA'],['dwl','Welfare loss','#FF9A3D'],['cs','Consumer surplus','#6FB8FF'],['gain','Gain','#74D99A']];
var W=1000, H=700;
var AXES = {
  one:[{ox:160,oy:610,top:80,right:940}],
  two:[{ox:140,oy:610,top:80,right:450},{ox:620,oy:610,top:80,right:950}]
};

/* ======================================================================
   STATE
   ====================================================================== */
var st = {q:0, pieces:[], axes:{}, mode:'one', sel:null, revealed:false, n:0, editing:null, tool:'select'};
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
function drawPath(pts){
  if(!pts.length) return '';
  var d='M'+r1(pts[0][0])+' '+r1(pts[0][1]);
  if(pts.length<3){ for(var i=1;i<pts.length;i++) d+='L'+r1(pts[i][0])+' '+r1(pts[i][1]); return d; }
  for(var j=1;j<pts.length-1;j++){
    var mx=(pts[j][0]+pts[j+1][0])/2, my=(pts[j][1]+pts[j+1][1])/2;
    d+='Q'+r1(pts[j][0])+' '+r1(pts[j][1])+' '+r1(mx)+' '+r1(my);
  }
  var l=pts[pts.length-1]; return d+'L'+r1(l[0])+' '+r1(l[1]);
}
function bbox(p){
  var xs=p.pts.map(function(v){return v[0];}), ys=p.pts.map(function(v){return v[1];});
  var x=Math.min.apply(null,xs), y=Math.min.apply(null,ys);
  return {x:x-8, y:y-8, w:Math.max.apply(null,xs)-x+16, h:Math.max.apply(null,ys)-y+16};
}
function labelAnchor(p){
  if(p.t==='draw') return p.pts[p.pts.length-1];
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
      shades+=eraseMask(p)+'<rect class="shade f-'+p.fill+'" data-id="'+p.id+'"'+maskAttr(p)+' x="'+r1(p.x)+'" y="'+r1(p.y)+'" width="'+r1(p.w)+'" height="'+r1(p.h)+'"/>';
    } else if(p.t==='tri'){
      shades+=eraseMask(p)+'<polygon class="shade f-'+p.fill+'" data-id="'+p.id+'"'+maskAttr(p)+' points="'+p.p.map(function(v){return r1(v[0])+','+r1(v[1]);}).join(' ')+'"/>';
    } else if(p.t==='pt'){
      strokes+='<g><circle class="pdot t-'+col+'" cx="'+r1(p.x)+'" cy="'+r1(p.y)+'" r="7"/><circle class="hit-dot" data-id="'+p.id+'" cx="'+r1(p.x)+'" cy="'+r1(p.y)+'" r="20"/></g>';
      if(p.label && !isEditing(p.id)) texts+='<text class="lab t-'+col+'" data-id="'+p.id+'" data-role="label" x="'+r1(p.x+p.lx)+'" y="'+r1(p.y+p.ly)+'">'+fmt(p.label)+'</text>';
    } else if(p.t==='text'){
      if(!isEditing(p.id)) texts+='<text class="lab t-'+col+'" data-id="'+p.id+'" x="'+r1(p.x)+'" y="'+r1(p.y)+'">'+fmt(p.label||'')+'</text>';
    } else {
      var d = p.t==='line' ? 'M'+r1(p.x1)+' '+r1(p.y1)+'L'+r1(p.x2)+' '+r1(p.y2) : p.t==='draw' ? drawPath(p.pts) : curvePath(p);
      strokes+='<g><path class="pc k-'+col+(p.dash?' dash':'')+'" d="'+d+'"/><path class="hit" data-id="'+p.id+'" d="'+d+'"/>';
      if(p.label && !isEditing(p.id)){ var an=labelAnchor(p); texts+='<text class="lab t-'+col+'" data-id="'+p.id+'" data-role="label" x="'+r1(an[0]+p.lx)+'" y="'+r1(an[1]+p.ly)+'">'+fmt(p.label)+'</text>'; }
      strokes+='</g>';
    }
  });
  /* a selected curve can be grabbed anywhere inside its dotted box */
  var gb = sel ? (CURVES[sel.t] ? sel : sel.t==='draw' ? bbox(sel) : null) : null;
  var grab = gb ? '<rect class="grab" data-id="'+sel.id+'" x="'+r1(gb.x)+'" y="'+r1(gb.y)+'" width="'+r1(gb.w)+'" height="'+r1(gb.h)+'"/>' : '';
  s+=shades+grab+strokes+texts;
  if(sel) s+=handlesFor(sel);
  if(st.tool==='eraser' && st.cursor) s+='<circle id="eraser-cur" class="eraser-cur" cx="'+r1(st.cursor[0])+'" cy="'+r1(st.cursor[1])+'" r="'+ER_R+'"/>';
  svg.innerHTML=s;
  renderSel();
}
function isEditing(id){ return st.editing && st.editing.kind==='piece' && st.editing.id===id; }
function isStroke(p){ return !!CURVES[p.t] || p.t==='line' || p.t==='draw'; }
/* where each axis label goes: the vertical one beside the arrow, the horizontal one under the arrow */
function axisGeom(key){
  var ax=AXES[st.mode][(+key.charAt(1))-1]; if(!ax) return null;
  if(key.charAt(0)==='y'){ var bw=Math.min(ax.ox-24, 140); return {x:ax.ox-14, y:ax.top+4, anchor:'end', bx:ax.ox-14-bw, by:ax.top-20, bw:bw, wrap:Math.max(6, Math.floor(bw/11.5))}; }
  return {x:ax.right+12, y:ax.oy+52, anchor:'end', bx:ax.right+18-200, by:ax.oy+22, bw:200};
}
function axisLabel(key){
  var g=axisGeom(key); if(!g || (st.editing && st.editing.kind==='axis' && st.editing.key===key)) return '';
  var v=st.axes[key];
  if(v){
    var lines=g.wrap ? wrapWords(v, g.wrap) : [v];
    return '<text class="ax-lab" data-axis="'+key+'" x="'+g.x+'" y="'+g.y+'" text-anchor="'+g.anchor+'">'
      + lines.map(function(l,i){ return '<tspan x="'+g.x+'" dy="'+(i?26:0)+'">'+fmt(l)+'</tspan>'; }).join('') + '</text>';
  }
  return '<rect class="ax-empty" data-axis="'+key+'" x="'+g.bx+'" y="'+g.by+'" width="'+g.bw+'" height="40" rx="5"/>'
       + '<text class="ax-ph" data-axis="'+key+'" x="'+(g.bx+12)+'" y="'+(g.by+28)+'">label?</text>';
}
function wrapWords(t, max){
  var words=String(t).split(/\s+/), lines=[], cur='';
  words.forEach(function(w){ if(cur && (cur+' '+w).length>max){ lines.push(cur); cur=w; } else cur = cur ? cur+' '+w : w; });
  if(cur) lines.push(cur);
  return lines;
}
function labelPos(p){
  if(p.t==='text') return [p.x, p.y];
  var an=labelAnchor(p); return [an[0]+p.lx, an[1]+p.ly];
}
function handlePts(p){
  if(p.t==='line') return [['p1',p.x1,p.y1],['p2',p.x2,p.y2]];
  if(p.t==='tri') return p.p.map(function(v,i){ return ['v'+i,v[0],v[1]]; });
  if(p.t==='text' || p.t==='draw' || p.t==='pt') return [];
  return [['nw',p.x,p.y],['ne',p.x+p.w,p.y],['sw',p.x,p.y+p.h],['se',p.x+p.w,p.y+p.h]];
}
function handlesFor(p){
  var s='';
  if(p.t==='pt') s+='<circle class="selbox-outline" cx="'+r1(p.x)+'" cy="'+r1(p.y)+'" r="16"/>';
  if(p.t==='draw'){ var b=bbox(p); s+='<rect class="selbox-outline" x="'+r1(b.x)+'" y="'+r1(b.y)+'" width="'+r1(b.w)+'" height="'+r1(b.h)+'"/>'; }
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
  else if(t==='pt'){ p.x=480+k; p.y=340+k; p.label=''; p.col='ink'; p.lx=12; p.ly=-14; }
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
  /* labels are <text> with <tspan>s inside (for subscripts and wrapped lines), so look at the parents too */
  var t=e.target;
  function up(attr){ var el=t.closest ? t.closest('['+attr+']') : null; return el && svg.contains(el) ? el : null; }
  var hEl=up('data-h'), idEl=up('data-id'), axEl=up('data-axis');
  var h=hEl && hEl.getAttribute('data-h'), id=idEl && idEl.getAttribute('data-id');
  var axk=axEl && axEl.getAttribute('data-axis'), role=idEl && idEl.getAttribute('data-role');
  if(st.tool==='eraser'){
    if(st.editing) commitEdit();
    var e0=pt(e), a0=[e0.x,e0.y];
    drag={mode:'erase', before:snapshot(), last:a0, sh:{}};
    eraseSeg(drag, a0, a0);
    svg.setPointerCapture(e.pointerId); e.preventDefault(); return;
  }
  if(axk){ commitEdit(); drag={mode:'axis', key:axk}; svg.setPointerCapture(e.pointerId); e.preventDefault(); return; }
  if(st.editing) commitEdit();
  var p0=pt(e);
  if(st.tool==='pencil'){
    st.sel=null; render();
    drag={mode:'draw', pts:[[p0.x,p0.y]], before:snapshot()};
    var tmp=document.createElementNS('http://www.w3.org/2000/svg','path'); tmp.setAttribute('class','pc k-ink'); tmp.setAttribute('id','ink-now'); svg.appendChild(tmp);
    svg.setPointerCapture(e.pointerId); e.preventDefault(); return;
  }
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
  if(!drag || drag.mode==='axis') return;
  if(drag.mode==='erase'){
    var q1=pt(e), b1=[q1.x,q1.y];
    if(dist(b1, drag.last)<2) return;
    eraseSeg(drag, drag.last, b1); drag.last=b1; return;
  }
  if(drag.mode==='draw'){
    var q0=pt(e), last=drag.pts[drag.pts.length-1];
    if(Math.abs(q0.x-last[0])+Math.abs(q0.y-last[1])<5) return;
    drag.pts.push([clamp(q0.x,0,W), clamp(q0.y,0,H)]);
    var tmp=document.getElementById('ink-now'); if(tmp) tmp.setAttribute('d', drawPath(drag.pts));
    return;
  }
  var p=get(st.sel); if(!p) return;
  var q=pt(e), dx=q.x-drag.start.x, dy=q.y-drag.start.y, o=drag.orig;
  if(!drag.moved && Math.abs(dx)+Math.abs(dy)<4) return;
  drag.moved=true;
  if(drag.mode==='label'){ p.lx=o.lx+dx; p.ly=o.ly+dy; }
  else if(drag.mode==='move'){
    if(p.t==='line'){ p.x1=o.x1+dx; p.y1=o.y1+dy; p.x2=o.x2+dx; p.y2=o.y2+dy; }
    else if(p.t==='tri'){ p.p=o.p.map(function(v){ return [v[0]+dx, v[1]+dy]; }); }
    else if(p.t==='draw'){ p.pts=o.pts.map(function(v){ return [v[0]+dx, v[1]+dy]; }); }
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
  /* an empty axis box opens with one click; a placed axis label needs a double-click */
  if(d.mode==='axis'){ if(!st.axes[d.key] || isDouble('ax:'+d.key)) openEditor({kind:'axis', key:d.key}); return; }
  if(d.mode==='erase'){ if(snapshot()!==d.before){ pushUndo(d.before); save(); } return; }
  if(d.mode==='draw'){
    if(d.pts.length<3){ render(); return; }
    var np={id:uid(), t:'draw', pts:d.pts, col:'ink', dash:false, label:'', lx:10, ly:-12};
    st.pieces.push(np); st.sel=np.id; pushUndo(d.before); save(); render();
    openEditor({kind:'piece', id:np.id});   /* every new line gets a label box */
    return;
  }
  if(snapshot()!==d.before){ pushUndo(d.before); save(); }
  /* one click selects (and a drag moves); a double-click on a piece or its label edits the label */
  if(!d.moved && d.id){
    if(isDouble('p:'+d.id)){
      var p=get(d.id);
      if(p && (isStroke(p) || p.t==='text' || p.t==='pt')) openEditor({kind:'piece', id:p.id});
    }
  } else lastTap={key:null, t:0};
}
var lastTap={key:null, t:0};
function isDouble(key){
  var now=Date.now(), dbl=(lastTap.key===key && now-lastTap.t<450);
  lastTap = dbl ? {key:null, t:0} : {key:key, t:now};
  return dbl;
}
svg.addEventListener('pointerup', endDrag);
svg.addEventListener('pointercancel', endDrag);

/* ======================================================================
   ERASER: works like a real eraser. Lines and curves are cut where it
   passes and the pieces left behind stay on the board; shading is rubbed
   out under it; text, points and labels it touches are removed.
   ====================================================================== */
var ER_R=18, SVGNS='http://www.w3.org/2000/svg';
function dist(a,b){ return Math.sqrt((a[0]-b[0])*(a[0]-b[0])+(a[1]-b[1])*(a[1]-b[1])); }
function distToSeg(q,a,b){
  var dx=b[0]-a[0], dy=b[1]-a[1], L=dx*dx+dy*dy, t=L ? ((q[0]-a[0])*dx+(q[1]-a[1])*dy)/L : 0;
  t=Math.max(0, Math.min(1, t));
  return dist(q, [a[0]+t*dx, a[1]+t*dy]);
}
function bez(p0,p1,p2,p3,t){ var u=1-t; return [u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0], u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]]; }
function quad(p0,p1,p2,t){ var u=1-t; return [u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0], u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1]]; }
function lerp(a,b,t){ return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t]; }
function sampleInto(out, fn, len){ var n=Math.max(2, Math.ceil(len/3)); for(var i=1;i<=n;i++) out.push(fn(i/n)); }
/* dense points along a line, curve or freehand stroke, matching what is drawn */
function strokePoints(p){
  var out=[];
  if(p.t==='line'){ var a=[p.x1,p.y1], b=[p.x2,p.y2]; out.push(a); sampleInto(out, function(t){ return lerp(a,b,t); }, dist(a,b)); return out; }
  if(p.t==='draw'){
    var P=p.pts; out.push(P[0]);
    if(P.length<3){ for(var i=1;i<P.length;i++){ var s0=P[i-1], e0=P[i]; sampleInto(out, function(t){ return lerp(s0,e0,t); }, dist(s0,e0)); } return out; }
    var cur=P[0];
    for(var j=1;j<P.length-1;j++){
      var c=P[j], m=[(P[j][0]+P[j+1][0])/2, (P[j][1]+P[j+1][1])/2], st0=cur;
      sampleInto(out, function(t){ return quad(st0,c,m,t); }, dist(st0,c)+dist(c,m)); cur=m;
    }
    var last=P[P.length-1], c0=cur; sampleInto(out, function(t){ return lerp(c0,last,t); }, dist(c0,last));
    return out;
  }
  var cp=null;
  function map(u,v){ return [p.x+u*p.w, p.y+v*p.h]; }
  CURVES[p.t].d.forEach(function(seg){
    if(seg[0]==='M'){ cp=map(seg[1],seg[2]); out.push(cp); }
    else if(seg[0]==='L'){ var a1=cp, b1=map(seg[1],seg[2]); sampleInto(out, function(t){ return lerp(a1,b1,t); }, dist(a1,b1)); cp=b1; }
    else { var q0=cp, q1=map(seg[1],seg[2]), q2=map(seg[3],seg[4]), q3=map(seg[5],seg[6]);
      sampleInto(out, function(t){ return bez(q0,q1,q2,q3,t); }, dist(q0,q1)+dist(q1,q2)+dist(q2,q3)); cp=q3; }
  });
  return out;
}
function polyLen(r){ var t=0; for(var i=1;i<r.length;i++) t+=dist(r[i-1],r[i]); return t; }
function thin(r){
  var out=[r[0]];
  for(var i=1;i<r.length-1;i++) if(dist(r[i], out[out.length-1])>=5) out.push(r[i]);
  out.push(r[r.length-1]);
  return out.map(function(v){ return [Math.round(v[0]*10)/10, Math.round(v[1]*10)/10]; });
}
function rectDist(q,r){ var dx=Math.max(r[0]-q[0], 0, q[0]-r[2]), dy=Math.max(r[1]-q[1], 0, q[1]-r[3]); return Math.sqrt(dx*dx+dy*dy); }
function nearRect(a,b,r,R){ return rectDist(a,r)<R || rectDist(b,r)<R || rectDist(lerp(a,b,0.5),r)<R; }
function labelRect(p){
  var lp=labelPos(p), w=Math.max(16, String(p.label||'').replace(/_/g,'').length*13);
  return [lp[0]-2, lp[1]-24, lp[0]+w, lp[1]+6];
}
function axisRect(key){
  var g=axisGeom(key), v=st.axes[key]; if(!g || !v) return null;
  if(g.wrap){ var lines=wrapWords(v,g.wrap), w=Math.max.apply(null, lines.map(function(l){ return l.length; }))*12; return [g.x-w, g.y-22, g.x, g.y+(lines.length-1)*26+6]; }
  return [g.x-v.length*12, g.y-22, g.x, g.y+6];
}
/* shading keeps its rubbed-out marks in its own coordinates, so they move and stretch with it */
function toLocal(p,q){
  if(p.t==='box') return [(q[0]-p.x)/p.w, (q[1]-p.y)/p.h];
  var A=p.p[0], B=p.p[1], C=p.p[2], v0=[B[0]-A[0],B[1]-A[1]], v1=[C[0]-A[0],C[1]-A[1]], v2=[q[0]-A[0],q[1]-A[1]];
  var den=v0[0]*v1[1]-v1[0]*v0[1]; if(!den) return null;
  return [(v2[0]*v1[1]-v1[0]*v2[1])/den, (v0[0]*v2[1]-v2[0]*v0[1])/den];
}
function toAbs(p,l){
  if(p.t==='box') return [p.x+l[0]*p.w, p.y+l[1]*p.h];
  var A=p.p[0], B=p.p[1], C=p.p[2];
  return [A[0]+l[0]*(B[0]-A[0])+l[1]*(C[0]-A[0]), A[1]+l[0]*(B[1]-A[1])+l[1]*(C[1]-A[1])];
}
function shadeTouched(p,a,b){
  if(p.t==='box') return nearRect(a,b,[p.x,p.y,p.x+p.w,p.y+p.h],ER_R);
  function inside(q){ var l=toLocal(p,q); return l && l[0]>=0 && l[1]>=0 && l[0]+l[1]<=1; }
  if(inside(a) || inside(b)) return true;
  for(var i=0;i<3;i++){ var c=p.p[i], d=p.p[(i+1)%3]; if(distToSeg(a,c,d)<ER_R || distToSeg(b,c,d)<ER_R) return true; }
  return false;
}
function maskAttr(p){ return (p.er && p.er.length) ? ' mask="url(#mk-'+p.id+')"' : ''; }
function eraseMask(p){
  if(!p.er || !p.er.length) return '';
  return '<mask id="mk-'+p.id+'" maskUnits="userSpaceOnUse" x="0" y="0" width="'+W+'" height="'+H+'"><rect x="0" y="0" width="'+W+'" height="'+H+'" fill="#fff"/>'
    + p.er.map(function(m){
        var A=m.pts.map(function(l){ return toAbs(p,l); }); var z=A[A.length-1]; A.push([z[0]+0.1, z[1]]);
        return '<path d="M'+A.map(function(v){ return r1(v[0])+' '+r1(v[1]); }).join('L')+'" fill="none" stroke="#000" stroke-width="'+(2*m.r)+'" stroke-linecap="round" stroke-linejoin="round"/>';
      }).join('')
    + '</mask>';
}
/* rub out along the eraser's path from a to b */
function eraseSeg(dr, a, b){
  var changed=false, out=[];
  ['y1','x1','y2','x2'].forEach(function(k){ var r=axisRect(k); if(r && nearRect(a,b,r,ER_R*0.6)){ st.axes[k]=''; changed=true; } });
  st.pieces.forEach(function(p){
    if(p.t==='text'){
      if(nearRect(a,b,labelRect(p),ER_R*0.6)){ changed=true; if(st.sel===p.id) st.sel=null; return; }
      out.push(p); return;
    }
    if(p.t==='pt'){
      if(distToSeg([p.x,p.y],a,b)<ER_R+6){ changed=true; if(st.sel===p.id) st.sel=null; return; }
      if(p.label && nearRect(a,b,labelRect(p),ER_R*0.6)){ p.label=''; changed=true; }
      out.push(p); return;
    }
    if(p.t==='box' || p.t==='tri'){
      if(shadeTouched(p,a,b)){
        var la=toLocal(p,a), lb=toLocal(p,b);
        if(la && lb){
          if(!p.er) p.er=[];
          var k=dr.sh[p.id];
          if(k===undefined){ p.er.push({r:ER_R, pts:[la]}); k=dr.sh[p.id]=p.er.length-1; }
          p.er[k].pts.push(lb); changed=true;
        }
      }
      out.push(p); return;
    }
    if(!isStroke(p)){ out.push(p); return; }
    if(p.label && nearRect(a,b,labelRect(p),ER_R*0.6)){ p.label=''; changed=true; }
    var pts=strokePoints(p), keep=pts.map(function(q){ return distToSeg(q,a,b)>ER_R; });
    if(keep.every(function(x){ return x; })){ out.push(p); return; }
    changed=true;
    var runs=[], cur=[];
    pts.forEach(function(q,i){ if(keep[i]) cur.push(q); else { if(cur.length) runs.push(cur); cur=[]; } });
    if(cur.length) runs.push(cur);
    runs=runs.filter(function(r){ return r.length>1 && polyLen(r)>6; });
    var lp = p.label ? labelPos(p) : null;
    var frags=runs.map(function(r){
      var z=r[r.length-1];
      if(p.t==='line') return {id:uid(), t:'line', x1:r[0][0], y1:r[0][1], x2:z[0], y2:z[1], col:p.col, dash:p.dash, label:'', lx:10, ly:-12};
      return {id:uid(), t:'draw', pts:thin(r), col:p.col, dash:p.dash, label:'', lx:10, ly:-12};
    });
    /* the label stays where it was, on the nearest piece that is left */
    if(lp && frags.length){
      var best=frags[0], bd=1e9;
      frags.forEach(function(f){ var dd=dist(labelAnchor(f), lp); if(dd<bd){ bd=dd; best=f; } });
      var an=labelAnchor(best); best.label=p.label; best.lx=lp[0]-an[0]; best.ly=lp[1]-an[1];
    }
    if(st.sel===p.id) st.sel=null;
    out.push.apply(out, frags);
  });
  if(changed){ st.pieces=out; render(); }
}
/* the eraser's outline follows the pointer */
svg.addEventListener('pointermove', function(e){
  if(st.tool!=='eraser') return;
  var q=pt(e); st.cursor=[q.x,q.y];
  var c=document.getElementById('eraser-cur');
  if(!c){ c=document.createElementNS(SVGNS,'circle'); c.setAttribute('id','eraser-cur'); c.setAttribute('class','eraser-cur'); c.setAttribute('r', ER_R); svg.appendChild(c); }
  c.setAttribute('cx', r1(q.x)); c.setAttribute('cy', r1(q.y));
});
svg.addEventListener('pointerleave', function(){ st.cursor=null; var c=document.getElementById('eraser-cur'); if(c) c.parentNode.removeChild(c); });
function setTool(t){
  if(st.editing) commitEdit();
  st.tool = (st.tool===t && t!=='select') ? 'select' : t;
  board.classList.toggle('tool-pencil', st.tool==='pencil');
  board.classList.toggle('tool-eraser', st.tool==='eraser');
  var b=document.querySelectorAll('[data-tool]');
  for(var i=0;i<b.length;i++) b[i].setAttribute('aria-pressed', b[i].dataset.tool===st.tool?'true':'false');
  var hint=document.querySelector('.board-tools .hint');
  if(hint) hint.textContent = st.tool==='pencil' ? 'Pencil: drag to draw a line, then type its label and press Enter. Esc to stop.'
    : st.tool==='eraser' ? 'Eraser: rub over a line, curve or shading to remove just that part. Esc to stop.'
    : 'Drag to move a piece or its label. Double-click a line or label to type its label. Delete removes what is selected.';
  if(st.tool!=='eraser') st.cursor=null;
  st.sel=null; render();
}

/* ======================================================================
   LABEL BOX ON THE BOARD: type, press Enter, and the label is placed
   ====================================================================== */
var editForm=document.createElement('form');
editForm.className='edit-form'; editForm.setAttribute('autocomplete','off');
var editor=document.createElement('input');
editor.type='text'; editor.className='board-edit'; editor.maxLength=28; editor.hidden=true; editor.setAttribute('autocomplete','off');
editor.setAttribute('enterkeyhint','done');
editForm.appendChild(editor); board.appendChild(editForm);
editForm.addEventListener('submit', function(e){ e.preventDefault(); commitEdit(false); });
function openEditor(ed){
  var x, y, w=20, val;
  if(ed.kind==='axis'){
    var g=axisGeom(ed.key); if(!g) return;
    x=g.bx; y=g.by; val=st.axes[ed.key]||''; w=g.bw/W*100;
    editor.placeholder= ed.key.charAt(0)==='y' ? 'e.g. Costs / revenue' : 'e.g. Output';
    editor.setAttribute('aria-label', (ed.key.charAt(0)==='y'?'Vertical':'Horizontal')+' axis label. Press Enter to place it.');
  } else {
    var p=get(ed.id); if(!p) return;
    var lp=labelPos(p); x=lp[0]-6; y=lp[1]-32; w=17; val=p.label||'';
    editor.placeholder= p.t==='text' ? 'e.g. P_1' : p.t==='pt' ? 'e.g. X or E' : 'e.g. AR = D';
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
  if(e.key==='Enter' || e.keyCode===13){ e.preventDefault(); commitEdit(false); }
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
  var stroke=isStroke(p), shade=p.t==='box'||p.t==='tri', lab=stroke||p.t==='text'||p.t==='pt';
  show('relabel', lab); show('row-style', stroke); show('row-colour', lab); show('row-fill', shade);
  document.getElementById('sel-kind').textContent = p.t==='box'?'Shade box':p.t==='tri'?'Shade triangle':p.t==='text'?'Text label':p.t==='line'?'Straight line':p.t==='draw'?'Freehand line':p.t==='pt'?'Point':(CURVES[p.t].label+' curve');
  document.getElementById('sel-style').value=p.dash?'dash':'solid';
  var sw=document.querySelectorAll('[data-col]'); for(var i=0;i<sw.length;i++) sw[i].setAttribute('aria-pressed', sw[i].dataset.col===(p.col||'ink')?'true':'false');
  var fl=document.querySelectorAll('[data-fill]'); for(var j=0;j<fl.length;j++) fl[j].setAttribute('aria-pressed', fl[j].dataset.fill===p.fill?'true':'false');
}
document.getElementById('relabel').addEventListener('click', function(){
  var p=get(st.sel); if(p && (isStroke(p)||p.t==='text'||p.t==='pt')) openEditor({kind:'piece', id:p.id});
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
  else if(c.t==='draw'){ c.pts=c.pts.map(function(v){return [v[0]+24,v[1]+24];}); }
  else { c.x+=24; c.y+=24; }
  st.pieces.push(c); st.sel=c.id; render(); save();
});
function undo(){ if(!undoStack.length) return; restore(undoStack.pop()); st.sel=null; buildAxisInputs(); render(); save(); }
document.getElementById('undo').addEventListener('click', undo);
document.addEventListener('keydown', function(e){
  var tag=(document.activeElement&&document.activeElement.tagName)||'';
  if(tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA') return;
  if((e.ctrlKey||e.metaKey) && (e.key==='z'||e.key==='Z')){ e.preventDefault(); undo(); return; }
  if(e.key==='Escape' && st.tool!=='select'){ setTool('select'); return; }
  if(!st.sel) return;
  if(e.key==='Delete'||e.key==='Backspace'){ e.preventDefault(); del(); return; }
  var d={ArrowLeft:[-5,0],ArrowRight:[5,0],ArrowUp:[0,-5],ArrowDown:[0,5]}[e.key];
  if(d){
    e.preventDefault(); var p=get(st.sel); pushUndo();
    if(p.t==='line'){ p.x1+=d[0]; p.x2+=d[0]; p.y1+=d[1]; p.y2+=d[1]; }
    else if(p.t==='tri'){ p.p=p.p.map(function(v){return [v[0]+d[0],v[1]+d[1]];}); }
    else if(p.t==='draw'){ p.pts=p.pts.map(function(v){return [v[0]+d[0],v[1]+d[1]];}); }
    else { p.x+=d[0]; p.y+=d[1]; }
    render(); save();
  }
  if(e.key==='Escape'){ st.sel=null; render(); }
});

/* ======================================================================
   PALETTE
   ====================================================================== */
function icon(t){
  var box={x:8,y:5,w:60,h:30}, o='<svg viewBox="0 0 76 40" aria-hidden="true">';
  if(CURVES[t]) return o+'<path class="ic" d="'+curvePath({t:t,x:box.x,y:box.y,w:box.w,h:box.h})+'"/></svg>';
  if(t==='line') return o+'<path class="ic" d="M10 34L66 6"/></svg>';
  if(t==='dline') return o+'<path class="ic dash" d="M10 34L66 6"/></svg>';
  if(t==='pt') return o+'<circle cx="38" cy="20" r="7" fill="currentColor"/></svg>';
  if(t==='select') return o+'<path d="M31 4V33L38 26L43 37L48 35L43 24H53Z" fill="currentColor"/></svg>';
  if(t==='pencil') return o+'<path class="ic" d="M14 30c8-14 14 6 22-6s12-10 18-2"/><path class="icf" d="M52 6l10 10-6 6-10-10z" fill="#FFDD33"/></svg>';
  if(t==='eraser') return o+'<path class="icf" d="M24 30l16-20 16 12-12 14H28z" fill="#FF8DBA"/><path class="ic" d="M18 36h40"/></svg>';
  if(t==='box') return o+'<rect class="icf" x="12" y="8" width="52" height="24" fill="#FFDD33" opacity=".75"/></svg>';
  if(t==='tri') return o+'<polygon class="icf" points="18,6 18,34 60,34" fill="#FF9A3D" opacity=".75"/></svg>';
  return o+'<text x="38" y="30" text-anchor="middle" font-family="Kalam, cursive" font-weight="700" font-size="24" fill="currentColor">P\u2081</text></svg>';
}
var pal=[['mc','MC'],['ac','AC'],['lrac','LRAC'],['lrmc','LRMC'],['as','AS'],['ppc','PPC'],['line','Straight line'],['dline','Dotted line'],['pt','Point'],['box','Shade box'],['tri','Shade triangle'],['text','Text label']];
var tools=[['select','Select'],['pencil','Pencil'],['eraser','Eraser']];
document.getElementById('palette').innerHTML=pal.map(function(t){
  return '<button type="button" class="tile" data-add="'+t[0]+'" aria-label="Add '+t[1]+'">'+icon(t[0])+'<span>'+t[1]+'</span></button>';
}).join('');
document.getElementById('tools').innerHTML=tools.map(function(t){
  return '<button type="button" class="tile tooltile" data-tool="'+t[0]+'" aria-pressed="'+(t[0]==='select')+'" aria-label="'+t[1]+' tool">'+icon(t[0])+'<span>'+t[1]+'</span></button>';
}).join('');
document.getElementById('palette').addEventListener('click', function(e){
  var b=e.target.closest('[data-add]'); if(!b) return;
  if(st.tool!=='select') setTool('select');
  if(b.dataset.add==='dline') add('line', {dash:true}); else add(b.dataset.add);
});
document.getElementById('tools').addEventListener('click', function(e){
  var b=e.target.closest('[data-tool]'); if(b) setTool(b.dataset.tool);
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
  if(st.tool!=='select') setTool('select');
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
