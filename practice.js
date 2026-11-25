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
   check:['Each PPC is a straight line between its two maximum outputs','Each country specialises in its comparative advantage good','The TPC pivots out from the specialised good','The TPC lies outside the PPC: gains from trade']},
  /* Year 12: Themes 1 and 2 */
  {id:'ext-negprod', th:'1', spec:'1.3.2', view:'ex_negprod',
   q:'Draw a negative externality of production. Show the market output, the socially optimal output and the welfare loss.',
   check:['Axes labelled Costs / benefits and Quantity','MSC above MPC; MPB = MSB','Market output Qₘ where MPB = MPC; social optimum Q* where MSB = MSC','The welfare loss triangle sits between MSC and MSB, from Q* to Qₘ']},
  {id:'ext-negcons', th:'1', spec:'1.3.2', view:'ex_negcons',
   q:'Draw a negative externality of consumption, such as smoking. Show the over-consumption and the welfare loss.',
   check:['MSB below MPB; MPC = MSC','Market output where MPB = MPC is above Q*, where MSB = MSC','Over-consumption marked from Q* to Qₘ','The welfare loss triangle sits between MPC and MSB']},
  {id:'ext-poscons', th:'1', spec:'1.3.2', view:'ex_poscons',
   q:'Draw a positive externality of consumption, such as vaccinations. Show the under-consumption and the welfare loss.',
   check:['MSB above MPB; MPC = MSC','Market output Qₘ where MPB = MPC is below Q*, where MSB = MSC','Under-consumption marked from Qₘ to Q*','The welfare loss triangle sits between MSB and MPC, from Qₘ to Q*']},
  {id:'ext-posprod', th:'1', spec:'1.3.2', view:'ex_posprod',
   q:'Draw a positive externality of production. Show the under-production and the welfare loss.',
   check:['MSC below MPC; MPB = MSB','Market output Qₘ where MPB = MPC is below Q*, where MSB = MSC','The welfare loss triangle sits between MSB and MSC, from Qₘ to Q*']},
  {id:'ext-tax', th:'1', spec:'1.4.1', view:'ex_tax', shift:true,
   q:'Show how an indirect tax equal to the external cost corrects a negative externality of production.',
   check:['MPC shifts up by the tax until it lies on MSC','Output falls from Qₘ to Q* and the price rises','The welfare loss disappears','Tax = external cost: the polluter pays']},
  {id:'gov-fail', th:'1', spec:'1.4.2', view:'ev_govfail',
   q:'Show how a tax set above the external cost causes government failure.',
   check:['MPC + tax lies above MSC','Output falls below Q*, the social optimum','A new welfare loss appears between Q and Q*','Caused by an information gap: the external cost is hard to measure']},
  {id:'ped-tax', th:'1', spec:'1.2.9', view:'ev_ped', two:true,
   q:'Use two diagrams to show how the effect of an indirect tax depends on the price elasticity of demand.',
   check:['The same upward shift in supply in both diagrams','Inelastic demand: a large rise in price, a small fall in quantity','Elastic demand: a small rise in price, a large fall in quantity','Consumers bear most of the tax when demand is inelastic']},
  {id:'adas-dpull', th:'2', spec:'2.4.3', view:'ad_dpull', shift:true,
   q:'Draw an AD/AS diagram to show demand-pull inflation.',
   check:['Axes labelled Price level and Real GDP','AD shifts right from AD₁ to AD₂','The price level rises from P₁ to P₂ and real GDP from Y₁ to Y₂','LRAS drawn vertical at full capacity']},
  {id:'adas-cpush', th:'2', spec:'2.3.2', view:'ad_cpush', shift:true,
   q:'Draw an AD/AS diagram to show cost-push inflation.',
   check:['SRAS shifts left from SRAS₁ to SRAS₂','The price level rises and real GDP falls','This is stagflation']},
  {id:'keynes-as', th:'2', spec:'2.3.3', view:'ev_capacity', shift:true,
   q:'Use a Keynesian AS curve to show why the effect of an increase in AD depends on spare capacity.',
   check:['AS is flat at low output, curves up, and becomes vertical at full capacity','With spare capacity, AD rising raises output with little inflation','Near full capacity, the same AD rise is mostly inflation']},
  {id:'laffer', th:'2', spec:'2.6.2', view:'ev_laffer',
   q:'Draw the Laffer curve and mark the revenue-maximising tax rate.',
   check:['Axes labelled Tax revenue and Tax rate (0% to 100%)','Revenue is zero at 0% and at 100%','The curve peaks at t*, the revenue-maximising rate','Above t*, cutting the rate can raise revenue']},
  {id:'lrpc', th:'2', spec:'2.6.4', view:'ev_lrpc', shift:true,
   q:'Use short-run and long-run Phillips curves to show why demand-side policy cannot permanently reduce unemployment below the NAIRU.',
   check:['LRPC vertical at the NAIRU','A move along SRPC₁ from A to B: lower unemployment, higher inflation','SRPC shifts up as inflation expectations rise','The economy ends at C: back at the NAIRU with higher inflation']},
  {id:'kuznets', th:'2', spec:'2.5.4', view:'ev_kuz_env',
   q:'Draw the environmental Kuznets curve and explain what it suggests about growth and the environment.',
   check:['Environmental damage on the vertical axis, GDP per capita on the horizontal','An inverted U shape','A turning point, after which damage falls as incomes rise']}
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
var st = {q:0, pieces:[], axes:{}, mode:'one', sel:null, revealed:false, n:0, editing:null, tool:'select', eraser:'part', lift:null};
try{ if(localStorage.getItem('slaude-practice:eraser')==='whole') st.eraser='whole'; }catch(err){}
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
/* freehand lines are smoothed; snapped boxes, triangles and circles (sharp) keep straight edges */
function drawPath(pts, sharp){
  if(!pts.length) return '';
  var d='M'+r1(pts[0][0])+' '+r1(pts[0][1]);
  if(sharp || pts.length<3){ for(var i=1;i<pts.length;i++) d+='L'+r1(pts[i][0])+' '+r1(pts[i][1]); return d; }
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
    /* a piece picked up with a press and hold is drawn lifted while it moves */
    var up=(st.lift && st.lift.id===p.id), lf=(up && !st.lift.label)?' lifted':'', llf=(up && st.lift.label)?' lifted':'';
    if(p.t==='box'){
      shades+=eraseMask(p)+'<rect class="shade f-'+p.fill+lf+'" data-id="'+p.id+'"'+maskAttr(p)+' x="'+r1(p.x)+'" y="'+r1(p.y)+'" width="'+r1(p.w)+'" height="'+r1(p.h)+'"/>';
    } else if(p.t==='tri'){
      shades+=eraseMask(p)+'<polygon class="shade f-'+p.fill+lf+'" data-id="'+p.id+'"'+maskAttr(p)+' points="'+p.p.map(function(v){return r1(v[0])+','+r1(v[1]);}).join(' ')+'"/>';
    } else if(p.t==='pt'){
      strokes+='<g><circle class="pdot t-'+col+lf+'" cx="'+r1(p.x)+'" cy="'+r1(p.y)+'" r="7"/><circle class="hit-dot" data-id="'+p.id+'" cx="'+r1(p.x)+'" cy="'+r1(p.y)+'" r="20"/></g>';
      if(p.label && !isEditing(p.id)) texts+='<text class="lab t-'+col+llf+'" data-id="'+p.id+'" data-role="label" x="'+r1(p.x+p.lx)+'" y="'+r1(p.y+p.ly)+'">'+fmt(p.label)+'</text>';
    } else if(p.t==='text'){
      if(!isEditing(p.id)) texts+='<text class="lab t-'+col+lf+'" data-id="'+p.id+'" x="'+r1(p.x)+'" y="'+r1(p.y)+'">'+fmt(p.label||'')+'</text>';
    } else {
      var d = p.t==='line' ? 'M'+r1(p.x1)+' '+r1(p.y1)+'L'+r1(p.x2)+' '+r1(p.y2) : p.t==='draw' ? drawPath(p.pts, p.sharp) : curvePath(p);
      strokes+='<g><path class="pc k-'+col+(p.dash?' dash':'')+lf+'" d="'+d+'"/><path class="hit" data-id="'+p.id+'" d="'+d+'"/>';
      if(p.label && !isEditing(p.id)){ var an=labelAnchor(p); texts+='<text class="lab t-'+col+llf+'" data-id="'+p.id+'" data-role="label" x="'+r1(an[0]+p.lx)+'" y="'+r1(an[1]+p.ly)+'">'+fmt(p.label)+'</text>'; }
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
  /* every empty label box on the board is the same size: as wide as fits left of the narrowest vertical axis */
  var bw=Math.min(140, Math.min.apply(null, AXES[st.mode].map(function(a){ return a.ox-24; })));
  if(key.charAt(0)==='y') return {x:ax.ox-14, y:ax.top+4, anchor:'end', bx:ax.ox-14-bw, by:ax.top-20, bw:bw, wrap:Math.max(6, Math.floor(bw/11.5))};
  return {x:ax.right+12, y:ax.oy+52, anchor:'end', bx:ax.right+18-bw, by:ax.oy+22, bw:bw};
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
  /* only a text label asks for its words straight away; a line is labelled later with a double-tap */
  if(p.t==='text') openEditor({kind:'piece', id:p.id});
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
/* capture fails if the pointer has already gone; the drag still works without it */
function capture(id){ try{ svg.setPointerCapture(id); }catch(err){} }
svg.addEventListener('pointerdown', function(e){
  if(e.button!==undefined && e.button!==0) return;
  if(drag) clearHold(drag);
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
    capture(e.pointerId); e.preventDefault(); return;
  }
  if(axk){ commitEdit(); drag={mode:'axis', key:axk}; capture(e.pointerId); e.preventDefault(); return; }
  if(st.editing) commitEdit();
  var p0=pt(e);
  /* the round handles of a selected piece stretch it, with any tool */
  if(h && st.sel){ drag={mode:'handle', h:h, start:p0, before:snapshot(), orig:JSON.parse(JSON.stringify(get(st.sel)))}; }
  else if(st.tool==='pencil'){
    if(st.sel){ st.sel=null; render(); }
    /* hit and role remember what was under the pen: a press and hold there picks it up, a double-tap labels it */
    drag={mode:'draw', pts:[[p0.x,p0.y]], cur:[p0.x,p0.y], before:snapshot(), hit:id, role:role, anchor:[e.clientX,e.clientY], moved:false};
    var tmp=document.createElementNS(SVGNS,'path'); tmp.setAttribute('class','pc k-ink'); tmp.setAttribute('id','ink-now'); svg.appendChild(tmp);
    armHold(drag, LIFT_MS);
  }
  else if(id){
    st.sel=id; var p=get(id);
    drag={mode: role==='label' ? 'label' : 'move', id:id, role:role, start:p0, before:snapshot(), orig:JSON.parse(JSON.stringify(p))};
    render();
  } else { if(st.sel){ st.sel=null; render(); } return; }
  capture(e.pointerId);
  e.preventDefault();
});
svg.addEventListener('pointermove', function(e){
  if(!drag || drag.mode==='axis') return;
  if(drag.mode==='erase'){
    var q1=pt(e), b1=[q1.x,q1.y];
    if(dist(b1, drag.last)<2) return;
    eraseSeg(drag, drag.last, b1); drag.last=b1; return;
  }
  if(drag.mode==='draw'){ penMove(drag, e); return; }
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
  var d=drag; drag=null; clearHold(d);
  if(st.lift){ st.lift=null; board.classList.remove('lifting'); }
  /* an empty axis box opens with one click; a placed axis label needs a double-click */
  if(d.mode==='axis'){ if(!st.axes[d.key] || isDouble('ax:'+d.key)) openEditor({kind:'axis', key:d.key}); return; }
  if(d.mode==='erase'){ if(snapshot()!==d.before){ pushUndo(d.before); save(); } return; }
  if(d.mode==='draw'){ endStroke(d); return; }
  if(snapshot()!==d.before){ pushUndo(d.before); save(); }
  /* a press and hold is not a tap; the piece stays selected so its handles and options show */
  if(d.lifted){ lastTap={key:null, t:0}; render(); return; }
  /* one click selects (and a drag moves); a double-click on a piece or its label edits the label */
  if(!d.moved && d.id){
    if(isDouble('p:'+d.id)){
      var p=get(d.id);
      if(p && canLabel(p)) openEditor({kind:'piece', id:p.id});
    }
  } else lastTap={key:null, t:0};
}
var lastTap={key:null, t:0};
function isDouble(key){
  var now=Date.now(), dbl=(lastTap.key===key && now-lastTap.t<450);
  lastTap = dbl ? {key:null, t:0} : {key:key, t:now};
  return dbl;
}
function canLabel(p){ return isStroke(p) || p.t==='text' || p.t==='pt'; }
svg.addEventListener('pointerup', endDrag);
svg.addEventListener('pointercancel', endDrag);
/* only when the board itself loses the pointer: on touch screens the line first touched holds it,
   and handing it to the board fires (and bubbles) this event from the line, which must not end the drag */
svg.addEventListener('lostpointercapture', function(e){ if(e.target===svg) endDrag(); });
/* a long press must not open the browser's own menu over the board */
board.addEventListener('contextmenu', function(e){ e.preventDefault(); });

/* ======================================================================
   PENCIL: draw freely. Hold the pen still at the end of a stroke and it
   snaps to a clean straight line, smooth curve, box, triangle or circle,
   as on an iPad; a light preview shows what it will become first. Press
   and hold a line without moving to pick it up and move it. A double-tap
   opens its label box: nothing asks for a label straight after drawing.
   ====================================================================== */
var SNAP_MS=1000, PREVIEW_MS=300, LIFT_MS=500, STILL_PX=6;
/* a tiny buzz on phones that support it (the browser only allows it once the page has been tapped) */
function buzz(){
  try{ if(navigator.vibrate && !(navigator.userActivation && !navigator.userActivation.hasBeenActive)) navigator.vibrate(12); }catch(err){}
}
/* restart the countdown: a hold of LIFT_MS before moving lifts a piece, a pause of SNAP_MS after moving snaps the stroke */
function armHold(d, ms){
  clearHold(d);
  d.hold=setTimeout(function(){ onHold(d); }, ms);
  if(d.moved) d.prev=setTimeout(function(){ preview(d); }, PREVIEW_MS);
}
function clearHold(d){ clearTimeout(d.hold); clearTimeout(d.prev); hidePreview(); }
function strokeNow(d){
  var P=d.pts.slice();
  if(dist(P[P.length-1], d.cur)>0.5) P.push(d.cur.slice());
  return P;
}
function penMove(d, e){
  var q=pt(e), c=[clamp(q.x,0,W), clamp(q.y,0,H)];
  d.cur=c;
  /* once a line has snapped, keep holding and move to swing its end round */
  if(d.snapped){ if(d.snapped.t==='line'){ d.snapped.b=straighten(d.snapped.a, c); showSnap(d); } return; }
  /* small wobbles of the hand do not count as moving */
  var mx=e.clientX-d.anchor[0], my=e.clientY-d.anchor[1];
  if(mx*mx+my*my>STILL_PX*STILL_PX){ d.anchor=[e.clientX,e.clientY]; d.moved=true; armHold(d, SNAP_MS); }
  var last=d.pts[d.pts.length-1];
  if(Math.abs(c[0]-last[0])+Math.abs(c[1]-last[1])<5) return;
  d.pts.push(c);
  var tmp=document.getElementById('ink-now'); if(tmp) tmp.setAttribute('d', drawPath(d.pts));
}
function preview(d){
  if(drag!==d || d.snapped) return;
  var s=recognise(strokeNow(d)); if(!s) return;
  var g=document.createElementNS(SVGNS,'path');
  g.setAttribute('id','snap-ghost'); g.setAttribute('class','snap-ghost'); g.setAttribute('d', shapePath(s));
  g.style.animationDuration=(SNAP_MS-PREVIEW_MS)+'ms';
  svg.appendChild(g);
}
function hidePreview(){ var g=document.getElementById('snap-ghost'); if(g) g.parentNode.removeChild(g); }
function onHold(d){
  if(drag!==d || d.snapped) return;
  hidePreview();
  if(!d.moved){ if(d.hit) liftPiece(d); return; }
  var s=recognise(strokeNow(d)); if(!s) return;
  d.snapped=s; buzz(); showSnap(d);
}
function showSnap(d){
  var tmp=document.getElementById('ink-now'); if(!tmp) return;
  tmp.setAttribute('d', shapePath(d.snapped)); tmp.setAttribute('class','pc k-ink snapped');
}
function shapePath(s){ return s.t==='line' ? 'M'+r1(s.a[0])+' '+r1(s.a[1])+'L'+r1(s.b[0])+' '+r1(s.b[1]) : drawPath(s.pts, s.sharp); }
/* press and hold on a piece without moving: pick it up, then drag to move it */
function liftPiece(d){
  var p=get(d.hit); if(!p) return;
  var lab=(d.role==='label');
  drag={mode: lab?'label':'move', id:p.id, role:d.role, start:{x:d.cur[0], y:d.cur[1]}, before:d.before, orig:JSON.parse(JSON.stringify(p)), lifted:true};
  st.sel=p.id; st.lift={id:p.id, label:lab};
  board.classList.add('lifting');
  buzz(); render();
}
function endStroke(d){
  var s=d.snapped, np=null;
  if(s && s.t==='line') np={id:uid(), t:'line', x1:r1(s.a[0]), y1:r1(s.a[1]), x2:r1(s.b[0]), y2:r1(s.b[1]), col:'ink', dash:false, label:'', lx:10, ly:-12};
  else if(s) np={id:uid(), t:'draw', pts:s.pts, sharp:!!s.sharp, col:'ink', dash:false, label:'', lx:10, ly:-12};
  else if(d.moved) np={id:uid(), t:'draw', pts:strokeNow(d), col:'ink', dash:false, label:'', lx:10, ly:-12};
  if(np){ st.pieces.push(np); pushUndo(d.before); save(); render(); lastTap={key:null, t:0}; return; }
  render();
  /* a tap rather than a line: a second tap on the same line or label opens its label box */
  if(d.hit && isDouble('p:'+d.hit)){ var p=get(d.hit); if(p && canLabel(p)) openEditor({kind:'piece', id:p.id}); }
}

/* ---------- recognising the shape ---------- */
function extent(P){
  var b={x0:1e9, y0:1e9, x1:-1e9, y1:-1e9};
  P.forEach(function(q){ b.x0=Math.min(b.x0,q[0]); b.x1=Math.max(b.x1,q[0]); b.y0=Math.min(b.y0,q[1]); b.y1=Math.max(b.y1,q[1]); });
  b.w=b.x1-b.x0; b.h=b.y1-b.y0; return b;
}
/* Ramer-Douglas-Peucker: keep only the points where the stroke really bends */
function rdp(P, eps){
  if(P.length<3) return P.slice();
  var a=P[0], b=P[P.length-1], k=0, m=-1;
  for(var i=1;i<P.length-1;i++){ var dd=distToSeg(P[i],a,b); if(dd>m){ m=dd; k=i; } }
  if(m<=eps) return [a,b];
  return rdp(P.slice(0,k+1),eps).slice(0,-1).concat(rdp(P.slice(k),eps));
}
function turnAt(u,v,w){ var t=Math.abs(Math.atan2(w[1]-v[1],w[0]-v[0])-Math.atan2(v[1]-u[1],v[0]-u[0]))*180/Math.PI; return t>180?360-t:t; }
function edgeAngle(u,v){ return Math.abs(Math.atan2(v[1]-u[1], v[0]-u[0])*180/Math.PI); }
function nearFlat(g,tol){ return g<tol || g>180-tol; }
function nearUp(g,tol){ return Math.abs(g-90)<tol; }
function rounded(P){ return P.map(function(v){ return [r1(v[0]), r1(v[1])]; }); }
/* a nearly level or nearly upright line is made exactly level or upright */
function straighten(a,b){
  var g=edgeAngle(a,b);
  if(nearFlat(g,6)) return [b[0], a[1]];
  if(nearUp(g,6)) return [a[0], b[1]];
  return b.slice();
}
function recognise(P){
  if(P.length<3) return null;
  var len=polyLen(P), px=W/(board.clientWidth||W);   /* board units per screen pixel */
  if(len<20*px) return null;
  var a=P[0], b=P[P.length-1], bb=extent(P), size=Math.max(bb.w,bb.h,1), chord=dist(a,b);
  /* a straight line: every point stays close to the line from start to end */
  var dev=0; P.forEach(function(q){ dev=Math.max(dev, distToSeg(q,a,b)); });
  if(chord>0.8*len && dev<=Math.max(4*px, 0.05*chord)) return {t:'line', a:a.slice(), b:straighten(a,b)};
  /* a closed shape: in its second half the pen comes back to the start, or runs a little past it */
  var ci=-1, cd=1e9, run=0;
  for(var i=1;i<P.length;i++){ run+=dist(P[i-1],P[i]); if(run>0.5*len){ var dd=dist(P[i],a); if(dd<cd){ cd=dd; ci=i; } } }
  if(ci>0 && cd<0.2*size && Math.min(bb.w,bb.h)>0.15*size) return closedShape(P.slice(0,ci+1), a);
  return smoothCurve(P, size, px);
}
function closedShape(L, start){
  var bb=extent(L), size=Math.max(bb.w,bb.h), spread=radialSpread(L,bb), c=corners(L,size);
  var straightSides=(c.length===3 || c.length===4) && polyFit(L,c)<0.09*size;
  if(spread>0.07 && straightSides){
    if(c.length===3 && triArea(c)>0.2*bb.w*bb.h) return {t:'poly', sharp:true, pts:closeLoop(tidyPoly(c))};
    if(c.length===4){
      var square=c.every(function(v,i){ return Math.abs(turnAt(c[(i+3)%4], v, c[(i+1)%4])-90)<25; });
      var level=c.every(function(v,i){ var g=edgeAngle(v, c[(i+1)%4]); return nearFlat(g,15) || nearUp(g,15); });
      return {t:'poly', sharp:true, pts:(square && level) ? boxPts(extent(c)) : closeLoop(tidyPoly(c))};
    }
  }
  if(spread<0.13) return {t:'poly', sharp:true, pts:ovalPts(bb, start)};
  return null;
}
/* the corners of a closed stroke: split it at the point furthest from the start, simplify each half */
function corners(L, size){
  var k=0, m=-1;
  for(var i=1;i<L.length;i++){ var dd=dist(L[0],L[i]); if(dd>m){ m=dd; k=i; } }
  var eps=Math.max(4, 0.07*size);
  var c=rdp(L.slice(0,k+1),eps).slice(0,-1).concat(rdp(L.slice(k),eps));
  c.pop();   /* the last point is back at the start */
  var j=0;
  while(c.length>3 && j<c.length){ if(dist(c[j], c[(j+1)%c.length])<0.12*size) c.splice((j+1)%c.length,1); else j++; }
  while(c.length>3){
    var mi=-1, mt=1e9;
    for(var q=0;q<c.length;q++){ var tt=turnAt(c[(q+c.length-1)%c.length], c[q], c[(q+1)%c.length]); if(tt<mt){ mt=tt; mi=q; } }
    if(mt>=35) break;
    c.splice(mi,1);
  }
  return c;
}
/* how far the stroke strays from the straight sides joining its corners */
function polyFit(L, c){
  var worst=0;
  L.forEach(function(q){ var best=1e9; for(var i=0;i<c.length;i++) best=Math.min(best, distToSeg(q, c[i], c[(i+1)%c.length])); worst=Math.max(worst, best); });
  return worst;
}
/* how evenly the stroke sits round the centre of its box: small for an ellipse, larger for corners */
function radialSpread(L, bb){
  var cx=(bb.x0+bb.x1)/2, cy=(bb.y0+bb.y1)/2, rx=Math.max(1,bb.w/2), ry=Math.max(1,bb.h/2), s=0, s2=0;
  L.forEach(function(q){ var u=(q[0]-cx)/rx, v=(q[1]-cy)/ry, r=Math.sqrt(u*u+v*v); s+=r; s2+=r*r; });
  var mean=s/L.length; return Math.sqrt(Math.max(0, s2/L.length-mean*mean))/mean;
}
function triArea(c){ return Math.abs((c[1][0]-c[0][0])*(c[2][1]-c[0][1])-(c[2][0]-c[0][0])*(c[1][1]-c[0][1]))/2; }
/* sides that are nearly level or upright are made exactly so */
function tidyPoly(c){
  c=c.map(function(v){ return v.slice(); });
  for(var i=0;i<c.length;i++){
    var u=c[i], v=c[(i+1)%c.length], g=edgeAngle(u,v);
    if(nearFlat(g,8)){ var y=(u[1]+v[1])/2; u[1]=y; v[1]=y; }
    else if(nearUp(g,8)){ var x=(u[0]+v[0])/2; u[0]=x; v[0]=x; }
  }
  return c;
}
function closeLoop(c){ return rounded(c.concat([c[0]])); }
function boxPts(b){
  var x0=b.x0, y0=b.y0, w=b.w, h=b.h;
  if(Math.abs(w-h)<0.1*Math.max(w,h)){ var s=(w+h)/2; x0+=(w-s)/2; y0+=(h-s)/2; w=h=s; }   /* nearly square: square */
  return rounded([[x0,y0],[x0+w,y0],[x0+w,y0+h],[x0,y0+h],[x0,y0]]);
}
function ovalPts(b, start){
  var cx=(b.x0+b.x1)/2, cy=(b.y0+b.y1)/2, rx=b.w/2, ry=b.h/2, out=[];
  if(Math.abs(rx-ry)<0.12*Math.max(rx,ry)){ rx=ry=(rx+ry)/2; }   /* nearly round: a circle */
  var t0=Math.atan2((start[1]-cy)/ry, (start[0]-cx)/rx);         /* begin where the pen began */
  for(var i=0;i<=72;i++){ var t=t0+i/72*2*Math.PI; out.push([cx+rx*Math.cos(t), cy+ry*Math.sin(t)]); }
  return rounded(out);
}
/* an open stroke that is not straight becomes one smooth curve, if a single curve fits it well */
function smoothCurve(P, size, px){
  var f=fitCubic(P); if(!f || f.err>Math.max(6*px, 0.06*size)) return null;
  var A=P[0], B=P[P.length-1], n=Math.max(12, Math.min(64, Math.round(polyLen(P)/14))), out=[];
  for(var i=0;i<=n;i++) out.push(bez(A, f.c1, f.c2, B, i/n));
  return {t:'curve', pts:rounded(out)};
}
/* least-squares cubic Bezier with the ends fixed, refining where each point sits along it */
function fitCubic(P){
  var n=P.length, A=P[0], B=P[n-1], T=[0], L=0, c1=null, c2=null;
  for(var i=1;i<n;i++){ L+=dist(P[i-1],P[i]); T.push(L); }
  if(!L) return null;
  T=T.map(function(t){ return t/L; });
  for(var it=0; it<4; it++){
    var a11=0, a12=0, a22=0, x1=0, y1=0, x2=0, y2=0;
    for(var j=0;j<n;j++){
      var t=T[j], u=1-t, b0=u*u*u, b1=3*u*u*t, b2=3*u*t*t, b3=t*t*t;
      var rx=P[j][0]-b0*A[0]-b3*B[0], ry=P[j][1]-b0*A[1]-b3*B[1];
      a11+=b1*b1; a12+=b1*b2; a22+=b2*b2; x1+=b1*rx; y1+=b1*ry; x2+=b2*rx; y2+=b2*ry;
    }
    var det=a11*a22-a12*a12; if(Math.abs(det)<1e-9) return null;
    c1=[(x1*a22-x2*a12)/det, (y1*a22-y2*a12)/det];
    c2=[(a11*x2-a12*x1)/det, (a11*y2-a12*y1)/det];
    for(var k=1;k<n-1;k++) T[k]=nearestT(A, c1, c2, B, P[k], T[k]);
  }
  var err=0; for(var m=0;m<n;m++) err=Math.max(err, dist(bez(A,c1,c2,B,T[m]), P[m]));
  return {c1:c1, c2:c2, err:err};
}
/* one Newton step towards the point on the curve nearest q */
function nearestT(p0,p1,p2,p3,q,t){
  var u=1-t, B=bez(p0,p1,p2,p3,t);
  var d1=[3*u*u*(p1[0]-p0[0])+6*u*t*(p2[0]-p1[0])+3*t*t*(p3[0]-p2[0]), 3*u*u*(p1[1]-p0[1])+6*u*t*(p2[1]-p1[1])+3*t*t*(p3[1]-p2[1])];
  var d2=[6*u*(p2[0]-2*p1[0]+p0[0])+6*t*(p3[0]-2*p2[0]+p1[0]), 6*u*(p2[1]-2*p1[1]+p0[1])+6*t*(p3[1]-2*p2[1]+p1[1])];
  var dx=B[0]-q[0], dy=B[1]-q[1], num=dx*d1[0]+dy*d1[1], den=d1[0]*d1[0]+d1[1]*d1[1]+dx*d2[0]+dy*d2[1];
  return den ? Math.max(0, Math.min(1, t-num/den)) : t;
}

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
    if(P.length<3 || p.sharp){ for(var i=1;i<P.length;i++){ var s0=P[i-1], e0=P[i]; sampleInto(out, function(t){ return lerp(s0,e0,t); }, dist(s0,e0)); } return out; }
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
/* rub out along the eraser's path from a to b. "Whole stroke" removes every line, curve or
   shading it touches in one go; "Normal" rubs out just the part under it */
function eraseSeg(dr, a, b){
  var changed=false, out=[], whole=(st.eraser==='whole');
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
      if(whole && shadeTouched(p,a,b)){ changed=true; if(st.sel===p.id) st.sel=null; return; }
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
    if(whole){ if(st.sel===p.id) st.sel=null; return; }
    var runs=[], cur=[];
    pts.forEach(function(q,i){ if(keep[i]) cur.push(q); else { if(cur.length) runs.push(cur); cur=[]; } });
    if(cur.length) runs.push(cur);
    runs=runs.filter(function(r){ return r.length>1 && polyLen(r)>6; });
    var lp = p.label ? labelPos(p) : null;
    var frags=runs.map(function(r){
      var z=r[r.length-1];
      if(p.t==='line') return {id:uid(), t:'line', x1:r[0][0], y1:r[0][1], x2:z[0], y2:z[1], col:p.col, dash:p.dash, label:'', lx:10, ly:-12};
      /* pieces of a snapped box, triangle or circle keep their straight edges and sharp corners */
      if(p.sharp) return {id:uid(), t:'draw', pts:rounded(rdp(r, 0.6)), sharp:true, col:p.col, dash:p.dash, label:'', lx:10, ly:-12};
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
/* "tap" on a touch screen, "click" with a mouse */
var TAP=(window.matchMedia && window.matchMedia('(pointer:coarse)').matches) ? 'tap' : 'click';
function showHint(){
  var hint=document.querySelector('.board-tools .hint'); if(!hint) return;
  hint.textContent = st.tool==='pencil' ? 'Pencil: hold still at the end of a line to snap it straight, or a shape neat. Double-'+TAP+' a line to label it; press and hold to move it.'
    : st.tool==='eraser' ? (st.eraser==='whole' ? 'Eraser: touch a line, curve or shading to remove all of it. Esc to stop.' : 'Eraser: rub over a line, curve or shading to remove just that part. Esc to stop.')
    : 'Drag to move a piece or its label. Double-'+TAP+' a line or label to type its label. Delete removes what is selected.';
}
function setTool(t){
  if(st.editing) commitEdit();
  st.tool = (st.tool===t && t!=='select') ? 'select' : t;
  board.classList.toggle('tool-pencil', st.tool==='pencil');
  board.classList.toggle('tool-eraser', st.tool==='eraser');
  var b=document.querySelectorAll('[data-tool]');
  for(var i=0;i<b.length;i++) b[i].setAttribute('aria-pressed', b[i].dataset.tool===st.tool?'true':'false');
  var et=document.getElementById('eraser-tile'); if(et) et.classList.toggle('on', st.tool==='eraser');
  showHint();
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
  /* the eraser tile has a dropdown: rub out part of a line, or remove the whole stroke */
  if(t[0]==='eraser') return '<div class="tile tooltile pick" id="eraser-tile"><button type="button" class="pick-btn" data-tool="eraser" aria-pressed="false" aria-label="Eraser tool">'+icon('eraser')+'<span>Eraser</span></button>'
    + '<select id="eraser-mode" aria-label="What the eraser removes"><option value="part">Normal</option><option value="whole">Whole</option></select></div>';
  return '<button type="button" class="tile tooltile" data-tool="'+t[0]+'" aria-pressed="'+(t[0]==='select')+'" aria-label="'+t[1]+' tool">'+icon(t[0])+'<span>'+t[1]+'</span></button>';
}).join('');
var eraserMode=document.getElementById('eraser-mode');
eraserMode.value=st.eraser;
eraserMode.addEventListener('change', function(){
  st.eraser = eraserMode.value==='whole' ? 'whole' : 'part';
  try{ localStorage.setItem('slaude-practice:eraser', st.eraser); }catch(err){}
  if(st.tool!=='eraser') setTool('eraser'); else showHint();
});
showHint();
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
qsel.innerHTML=['1','2','3','4'].map(function(th){
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
