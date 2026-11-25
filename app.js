/* A-level Economics Diagrams: all diagrams, notes and controls */
(function(){
'use strict';
var EMBED=/[?&]embed\b/.test(location.search);
if(EMBED) document.documentElement.classList.add('embed');

/* =====================================================================
   COST CURVES (shared by both diagrams)
   AC is a bowl:  AC(q) = F/q + c + k(q - q1)^2
   MC is its matching tick:  MC(q) = c + k(q - q1)(3q - q1)
   These two belong to the same total cost function, so MC always cuts AC at
   the lowest point of AC. A cost shift is drawn the way it is drawn by hand:
   the pair slides by (dx, dy), or F changes for a fixed-cost shift.
   ===================================================================== */
var QMAX = 120, PMAX = 110, PTOP = 104;
function MC(m,q){var Q=q+m.dx; return m.c + m.k*(Q-m.q1)*(3*Q-m.q1) + m.dy;}
function AC(m,q){var Q=q+m.dx; return m.F/Q + m.c + m.k*(Q-m.q1)*(Q-m.q1) + m.dy;}
function moved(m,s,t){
  var o={}; for(var k in m) o[k]=m[k];
  o.dx=(s.dx||0)*t; o.dy=(s.dy||0)*t; o.F=m.F+(s.dF||0)*t; return o;
}
/* Where each curve starts and stops on the sheet. The ends are solved exactly
   (not stepped), so they glide during a shift instead of jumping. */
function rangeMC(m){
  var s=12-m.dx, e=112;
  if(MC(m,e)>PTOP) e=bisect(function(q){return MC(m,q)-PTOP;}, s+30, 112);
  return [s,e];
}
function rangeAC(m){
  var lo=Math.max(3,3-m.dx), s=lo, e=112;
  if(AC(m,lo)>PTOP) s=bisect(function(q){return AC(m,q)-PTOP;}, lo, 60);
  if(AC(m,e)>PTOP) e=bisect(function(q){return AC(m,q)-PTOP;}, 70, 112);
  return [s,e];
}
function bisect(f,lo,hi){
  var flo=f(lo);
  for(var i=0;i<60;i++){var mid=(lo+hi)/2,fm=f(mid); if((fm>0)===(flo>0)){lo=mid;flo=fm;}else{hi=mid;}}
  return (lo+hi)/2;
}

/* ---------- monopoly model ---------- */
var MONO = {a:100,b:0.85, c:16,k:0.012,q1:40,F:1300, dx:0,dy:0};
function mAR(q){return MONO.a-MONO.b*q;}
function mMR(q){return MONO.a-2*MONO.b*q;}
function solveMono(m){
  var qm=bisect(function(q){return mMR(q)-MC(m,q);},22,75);
  var qe=bisect(function(q){return MC(m,q)-AC(m,q);},30,110);
  var qa=bisect(function(q){return mAR(q)-MC(m,q);},qm,100);
  var qs=bisect(function(q){return mAR(q)-AC(m,q);},qe,117);
  var qr=MONO.a/(2*MONO.b);
  return {qm:qm,pm:mAR(qm),cm:AC(m,qm),mcm:MC(m,qm), qe:qe,ce:AC(m,qe),
          qa:qa,pa:mAR(qa), qs:qs,ps:mAR(qs), qr:qr,pr:mAR(qr)};
}

/* ---------- kinked demand model ---------- */
var KINK = {qk:52,pk:66,b1:0.6,b2:3, c:8,k:0.008,q1:40,F:2071, dx:0,dy:0};
function kAR(q){return q<=KINK.qk ? KINK.pk+KINK.b1*(KINK.qk-q) : KINK.pk-KINK.b2*(q-KINK.qk);}
function kMR1(q){return KINK.pk+KINK.b1*KINK.qk-2*KINK.b1*q;}
function solveKink(m){
  var q=KINK.qk;
  if(MC(m,q) > kMR1(q)) q=bisect(function(x){return kMR1(x)-MC(m,x);},20,KINK.qk);
  return {q:q,p:kAR(q),c:AC(m,q),mc:MC(m,q)};
}

/* =====================================================================
   CONTENT
   ===================================================================== */
var TOPICS = {
  monopoly:{eyebrow:'Edexcel A · Theme 3 · 3.4.5 Monopoly', first:'profitmax', groups:[
    ['Read the diagram',['base','profitmax','profit','trtc']],
    ['Other objectives',['revmax','salesmax']],
    ['Efficiency',['alloc','prod','dwl']],
    ['What if',['costup','costdown','fixed','srlr']],
    ['Against perfect competition',['vs_pc','vs_mono','vs_dwl']],
    ['Price discrimination',['vs_pd','pd3_one','pd3']],
    ['Natural monopoly',['nm_base','nm_profit','nm_reg']]
  ]},
  perfect:{eyebrow:'Edexcel A · Theme 3 · 3.4.2 Perfect competition', first:'pc_taker', groups:[
    ['Industry and firm',['pc_taker']],
    ['Short run',['pc_snp','pc_loss']],
    ['Long run',['pc_entry','pc_exit','pc_lr']]
  ]},
  monopolistic:{eyebrow:'Edexcel A · Theme 3 · 3.4.3 Monopolistic competition', first:'mc_snp', groups:[
    ['Short run',['mc_snp','mc_loss']],
    ['Long run',['mc_entry','mc_exit','mc_lr']],
    ['How efficient is it?',['mc_eff']]
  ]},
  oligopoly:{eyebrow:'Edexcel A · Theme 3 · 3.4.4 Oligopoly', first:'kink', groups:[
    ['Kinked demand curve',['kink','raise','cut','mrgap']],
    ['Equilibrium and costs',['eqm','rigid','bigcost']],
    ['Game theory',['g_collude','g_cheat','g_dom','g_nash']],
    ['Market concentration',['cr']]
  ]},
  contestable:{eyebrow:'Edexcel A · Theme 3 · 3.4.7 Contestability', first:'cm_mono', groups:[
    ['The idea',['cm_mono','cm_hit']],
    ['The outcome',['cm_threat','cm_eff']]
  ]}
};

var V = {
  /* ------------------------- MONOPOLY ------------------------- */
  base:{terms:[["Monopoly", "A single seller. In UK competition law, a firm with 25% or more of a market has monopoly power."], ["Price maker", "A firm that sets its own price and faces a downward-sloping demand curve."]], traps:["Draw MR below AR and <b>twice as steep</b>, starting from the same point on the price axis."], kind:'mono', btn:'The curves', showing:'The four curves',
    title:'The four curves',
    lead:'Every monopoly diagram starts with these. Get the shapes and the crossing points right before adding anything else.',
    plain:[
      ['<b class="k-ar">AR = D</b>','Slopes down because the monopolist is a price maker. To sell more it has to cut the price on every unit.'],
      ['<b class="k-mr">MR</b>','Sits below AR and falls twice as steeply. Selling one more unit means accepting a lower price on all the units before it.'],
      ['<b class="k-mc">MC</b>','A tick shape: a short dip, then a steep rise. It always cuts AC at the lowest point of AC.'],
      ['<b class="k-ac">AC</b>','A bowl. It falls while MC is below it and rises once MC is above it.']
    ],
    tip:'Drawing tip: start MR and AR from the same point on the vertical axis, and make MR twice as steep.'},

  profitmax:{traps:["Find the output where MR = MC, then go <b>up to AR</b> for the price. Never read the price across from MC."], kind:'mono', btn:'Profit max point', showing:'Profit maximisation: MR = MC',
    title:'Profit maximisation: MR = MC',
    lead:'A firm with market power has to decide how much to make. Each extra unit adds to its revenue and to its costs, so it keeps going while the extra revenue is bigger, and stops where marginal revenue equals marginal cost. Then it charges the highest price consumers will pay for that output.',
    chain:[
      'Below Q<sub>1</sub>, MR is above MC. Each extra unit adds more to revenue than to cost, so producing it raises profit.',
      'Beyond Q<sub>1</sub>, MC is above MR. Each extra unit costs more than it brings in, so profit falls.',
      'Profit is therefore highest at Q<sub>1</sub>, where MR = MC.',
      'From Q<sub>1</sub> go up to the AR curve to find the price, P<sub>1</sub>. AR is the demand curve, so it shows the most consumers will pay for that quantity.'
    ],
    evaluation:'Firms may not profit maximise in practice. They rarely know their exact MR and MC, and managers may prefer revenue or sales growth when owners cannot monitor them closely (the principal–agent problem).',
    tip:'Most common mistake: reading the price off where MR meets MC. Always go up to AR.'},

  profit:{traps:["The profit box runs from the price down to <b>AC</b> at Q<sub>1</sub>, not down to MC."], kind:'mono', btn:'Supernormal profit', showing:'Supernormal profit box',
    title:'Supernormal profit',
    lead:'At Q<sub>1</sub> the price is above average cost, so the firm earns more than the normal profit needed to stay in the industry.',
    chain:[
      'At Q<sub>1</sub>, average revenue is P<sub>1</sub> and average cost is C.',
      'Profit per unit is the gap between them: P<sub>1</sub> minus C.',
      'Multiply that gap by the number of units, Q<sub>1</sub>, and you get the shaded box.',
      'The box is P<sub>1</sub>, across to AR, down to AC, back to C. Shade exactly that.'
    ],
    evaluation:'Supernormal profit can pay for research and development, giving dynamic efficiency over time. But with no rivals the firm is under little pressure to do so, and may let costs drift up instead (X-inefficiency). It depends on how contestable the market is.',
    tip:'The box stops at AC, not at MC. MC only tells you the output.'},

  trtc:{kind:'mono', btn:'Revenue and cost', showing:'Total revenue, total cost, profit',
    title:'Total revenue and total cost',
    lead:'The profit box is what is left of total revenue once total cost has been taken out.',
    chain:[
      'Total revenue is price times quantity: the whole rectangle from the origin out to Q<sub>1</sub> and up to P<sub>1</sub>.',
      'Total cost is average cost times quantity: the lower rectangle, up to C.',
      'Supernormal profit is total revenue minus total cost: the strip on top.',
      'Anything that moves P<sub>1</sub> or Q<sub>1</sub> changes revenue. Anything that only moves AC changes cost and leaves revenue alone.'
    ],
    evaluation:'A larger revenue box does not mean a larger profit box. If the firm pushes output past Q<sub>1</sub>, revenue can still rise while profit falls. That is the difference between revenue maximisation and profit maximisation.'},

  revmax:{terms:[["Revenue maximisation", "Producing where MR = 0, so total revenue is as large as possible."]], traps:["Revenue is maximised where <b>MR = 0</b>, not where MR = MC."], kind:'mono', anim:true, btn:'Revenue max', showing:'Revenue maximisation: MR = 0',
    title:'Revenue maximisation: MR = 0',
    lead:'A firm that wants the highest possible total revenue keeps producing until the last unit adds nothing to revenue.',
    chain:[
      'While MR is positive, each extra unit sold still adds to total revenue.',
      'Total revenue peaks where MR = 0, at Q<sub>2</sub>. Past that point MR is negative and revenue falls.',
      'Go up to AR for the price, P<sub>2</sub>. Output is higher and price is lower than at profit maximisation.',
      'Between Q<sub>1</sub> and Q<sub>2</sub>, MC is above MR, so the firm gives up some profit in exchange for the extra revenue.'
    ],
    compare:{vs:'Compared with profit maximisation',rows:[['Price','↓ lower'],['Output','↑ higher'],['Revenue','↑ maximum'],['Profit','↓ lower']]},
    evaluation:'Managers may choose this when their pay or status depends on the size of the firm more than on profit. Shareholders may accept it as long as profit stays high enough to satisfy them (profit satisficing). Here AR is still above AC, so the firm still earns supernormal profit.',
    tip:'Where MR = 0, demand is unit elastic (PED = −1). Worth one line in a longer answer.'},

  salesmax:{terms:[["Sales maximisation", "Selling as many units as possible without making an economic loss: where AR = AC."]], traps:["Sales maximisation is at <b>AR = AC</b>, the furthest output that still earns normal profit."], kind:'mono', anim:true, btn:'Sales max', showing:'Sales maximisation: AR = AC',
    title:'Sales maximisation: AR = AC',
    lead:'The firm sells as much as it can without making an economic loss, so it expands until price only just covers average cost.',
    chain:[
      'Sales volume is as high as possible, with the firm still breaking even, where AR = AC at Q<sub>3</sub>.',
      'Price P<sub>3</sub> equals average cost, so the firm makes normal profit only. The supernormal profit box disappears.',
      'Output is the highest and price the lowest of the three objectives.',
      'Reasons to do it: build market share, undercut rivals, or set a price low enough to put off new entrants (limit pricing).'
    ],
    compare:{vs:'Compared with profit maximisation',rows:[['Price','↓ lowest'],['Output','↑ highest'],['Revenue','below its max'],['Profit','normal only']]},
    evaluation:'This is hard to keep up in the long run because shareholders want a return. It is more likely a short-run tactic, after which the firm goes back to profit maximising. Consumers gain from low prices while it lasts.'},

  alloc:{traps:["The allocatively efficient output is where AR (demand) meets MC. The monopolist produces less than this."], kind:'mono', anim:true, btn:'Allocative', showing:'Allocative efficiency: P = MC',
    title:'Allocative efficiency: P = MC',
    lead:'Resources are allocated efficiently when the price consumers pay equals the cost of making the last unit. A monopolist does not produce there.',
    chain:[
      'Allocative efficiency is where AR meets MC, at Q<sub>2</sub> and P<sub>2</sub>.',
      'The monopolist stops at Q<sub>1</sub>. Look straight down from P<sub>1</sub> to the MC curve: the price is well above MC.',
      'So consumers value extra units at more than they cost to make, yet those units are not produced.',
      'Output is too low and price too high: the monopoly is allocatively inefficient and too few resources go to this good.'
    ],
    compare:{vs:'At P = MC, compared with the monopoly outcome',rows:[['Price','↓ lower'],['Output','↑ higher'],['Consumer surplus','↑ higher'],['Profit','↓ lower']]},
    evaluation:'The comparison assumes costs would be the same under competition. A monopolist with large economies of scale may have much lower costs than many small firms could reach, so its price could still be lower than theirs. A regulator can also cap the price to push it towards MC.'},

  prod:{kind:'mono', btn:'Productive', showing:'Productive efficiency: lowest AC',
    title:'Productive efficiency: lowest point on AC',
    lead:'A firm is productively efficient when it makes each unit at the lowest possible average cost. That is the bottom of the AC curve, where MC cuts it: the minimum efficient scale (MES).',
    chain:[
      'The lowest point on AC is to the right of Q<sub>1</sub>.',
      'The monopolist holds output back to Q<sub>1</sub> to keep the price high, so it produces on the falling part of AC.',
      'Average cost at Q<sub>1</sub> (C<sub>1</sub>) is above the minimum, so the firm is productively inefficient.',
      'It is producing below the MES and not making full use of the economies of scale available to it.'
    ],
    evaluation:'With no competition the firm may not even stay on its AC curve: slack management and overstaffing push actual costs above it (X-inefficiency). On the other hand, one large firm may still produce at lower average cost than several small ones could, as with a natural monopoly.'},

  dwl:{traps:["The deadweight loss triangle sits between AR and MC, from the monopoly output to the allocatively efficient output. It does not touch MR or AC."], kind:'mono', btn:'Deadweight loss', showing:'Deadweight welfare loss',
    title:'Deadweight welfare loss',
    lead:'By restricting output to raise the price, the monopolist destroys some welfare that nobody gets.',
    chain:[
      'The efficient output is Q<sub>2</sub>, where P = MC.',
      'The monopolist produces only Q<sub>1</sub> and charges P<sub>1</sub>.',
      'For every unit between Q<sub>1</sub> and Q<sub>2</sub>, consumers are willing to pay (AR) more than it costs to make (MC), but the unit is never produced.',
      'The surplus those units would have created is lost: the triangle between AR and MC from Q<sub>1</sub> to Q<sub>2</sub>.'
    ],
    evaluation:'The size of the loss depends on how far output is restricted, which depends on the elasticity of demand. It may be outweighed over time if supernormal profit funds innovation that lowers costs or improves products (dynamic efficiency).',
    tip:'The triangle sits between AR and MC. It does not touch AC or MR.'},

  costup:{traps:["A variable-cost rise shifts <b>MC and AC</b>. MR = MC moves to a lower output, so the price rises."], kind:'mono', anim:true, shift:{dx:5,dy:9}, btn:'Variable costs rise', showing:'Variable costs rise: MC and AC shift up',
    title:'Variable costs rise',
    lead:'For example, raw materials or wages become more expensive. Both cost curves move, so the firm changes its price and output.',
    chain:[
      'Higher variable costs raise the cost of every extra unit, so MC shifts up from MC<sub>1</sub> to MC<sub>2</sub>. AC shifts up with it.',
      'MR now equals MC at a lower output, Q<sub>2</sub>.',
      'Going up to AR, the price rises from P<sub>1</sub> to P<sub>2</sub>.',
      'The profit box shrinks: fewer units are sold and the margin on each is smaller, because price rises by less than average cost.'
    ],
    compare:{vs:'After the shift',rows:[['Price','↑ higher'],['Output','↓ lower'],['Revenue','↓ lower'],['Profit','↓ lower']]},
    evaluation:'The firm passes on only part of the cost increase. How much depends on the price elasticity of demand: the more inelastic demand is, the more of the increase reaches consumers.'},

  costdown:{kind:'mono', anim:true, shift:{dx:-7,dy:-5}, btn:'Variable costs fall', showing:'Variable costs fall: MC and AC shift down',
    title:'Variable costs fall',
    lead:'For example, new technology or cheaper inputs. Both cost curves move down, so the firm expands.',
    chain:[
      'Lower variable costs shift MC down from MC<sub>1</sub> to MC<sub>2</sub>, and AC shifts down with it.',
      'MR now equals MC at a higher output, Q<sub>2</sub>.',
      'To sell the extra output the firm moves down AR, so the price falls from P<sub>1</sub> to P<sub>2</sub>.',
      'The profit box grows: more units are sold and each one costs less to make.'
    ],
    compare:{vs:'After the shift',rows:[['Price','↓ lower'],['Output','↑ higher'],['Revenue','↑ higher'],['Profit','↑ higher']]},
    evaluation:'Consumers gain from a lower price, but only part of the cost saving is passed on. With no rivals, nothing forces the monopolist to pass on the rest, so most of the gain is kept as profit.'},

  fixed:{traps:["A fixed-cost rise shifts <b>AC only</b>. MR = MC does not move, so price and output stay the same and only profit shrinks."], kind:'mono', anim:true, shift:{dF:400}, btn:'Fixed costs rise', showing:'Fixed costs rise: only AC shifts',
    title:'Fixed costs rise',
    lead:'For example, higher rent, business rates or a lump-sum tax. This one catches people out because price and output do not change.',
    chain:[
      'Fixed costs do not vary with output, so the cost of one extra unit is unchanged. MC does not move.',
      'AC shifts up from AC<sub>1</sub> to AC<sub>2</sub>. The gap is widest at low output, where the fixed cost is spread over fewer units.',
      'MR still equals MC at the same point, so output and price stay at Q<sub>1</sub> and P<sub>1</sub>.',
      'Revenue is unchanged but total cost is higher, so the profit box shrinks from below.'
    ],
    compare:{vs:'After the shift',rows:[['Price','= same'],['Output','= same'],['Revenue','= same'],['Profit','↓ lower']]},
    evaluation:'This is why a lump-sum tax can take profit from a monopolist without raising prices for consumers. If AC rises above AR, though, the firm makes an economic loss and may leave the industry in the long run.',
    tip:'Fixed cost change: move AC only. Moving MC as well is the classic error.'},

  srlr:{kind:'mono', btn:'Short run vs long run', showing:'Same diagram in the short run and the long run',
    title:'Short run vs long run',
    lead:'For a monopoly the diagram does not change between the short run and the long run. Explaining why is where the marks are.',
    chain:[
      'In the short run the firm earns supernormal profit at P<sub>1</sub> and Q<sub>1</sub>.',
      'In a competitive market that profit would attract new firms, shifting each firm’s AR to the left until only normal profit was left.',
      'A monopoly is protected by barriers to entry: patents, economies of scale, brand loyalty, control of a key resource, or legal protection.',
      'New firms cannot get in, AR does not shift, and the supernormal profit lasts into the long run.'
    ],
    evaluation:'It depends how long the barriers hold. New technology or deregulation can make the market contestable, and even the threat of entry may push the firm to lower its price. Lasting profit can also be a benefit if it is reinvested (dynamic efficiency).'},

  /* ---------------- MONOPOLY AGAINST PERFECT COMPETITION ---------------- */
  vs_pc:{kind:'vs', btn:'Perfect competition', showing:'Competitive outcome: point E',
    title:'The perfect competition outcome',
    lead:'To see what monopoly costs society, start with the same market under perfect competition. Costs are assumed to be constant, so MC = AC is a flat line, and it acts as the industry supply curve.',
    chain:[
      'Competitive firms are price takers, so the market settles where demand meets supply: point E.',
      'Price is P<sub>PC</sub> and output is Q<sub>PC</sub>. Price equals MC, so the outcome is allocatively efficient.',
      'Price also equals AC, so firms make normal profit only.',
      'Consumer surplus is the whole triangle A E P<sub>PC</sub>: the gap between what consumers were willing to pay and what they actually paid.'
    ],
    tip:'Label the points with letters. You can then name an area, such as triangle AEP<sub>PC</sub>, without shading everything.'},

  vs_mono:{kind:'vs', anim:true, two:true, btn:'Monopoly', showing:'Monopoly outcome: points B and C',
    title:'The monopoly outcome',
    lead:'Now one firm takes over the whole market with the same costs. It is a price maker, so it uses MR, not AR, to choose its output.',
    chain:[
      'The monopolist produces where MR = MC, at point C, giving output Q<sub>M</sub>.',
      'It charges the most consumers will pay for that output, which is read off AR at point B: P<sub>M</sub>. Price is higher and output lower than under competition.',
      'Consumer surplus shrinks to triangle A B P<sub>M</sub>. The rectangle P<sub>M</sub> B C P<sub>PC</sub>, which used to be consumer surplus, is now supernormal profit.',
      'Triangle B C E is lost altogether: the deadweight loss.'
    ],
    compare:{vs:'Compared with perfect competition',rows:[['Price','↑ higher'],['Output','↓ lower'],['Consumer surplus','↓ smaller'],['Profit','↑ supernormal']]},
    evaluation:'This assumes the monopolist has the same costs as the competitive industry. With large economies of scale its cost line would be lower, and the price could end up below the competitive price. Supernormal profit may also fund innovation.'},

  vs_dwl:{kind:'vs', btn:'Welfare loss', showing:'Rectangle is transferred, triangle is lost',
    title:'Welfare loss',
    lead:'Moving from competition to monopoly does two different things to welfare. One part is transferred and the other is destroyed.',
    chain:[
      'Output falls from Q<sub>PC</sub> to Q<sub>M</sub> and the price rises from P<sub>PC</sub> to P<sub>M</sub>.',
      'The rectangle P<sub>M</sub> B C P<sub>PC</sub> moves from consumers to the firm. That is a transfer: consumers are worse off, but the welfare still exists.',
      'The units between Q<sub>M</sub> and Q<sub>PC</sub> are no longer made, even though consumers value each one (AR) above what it costs (MC).',
      'The surplus on those units, triangle B C E, goes to nobody. This is the deadweight loss, and it is why monopoly is allocatively inefficient.'
    ],
    evaluation:'The triangle is smaller when demand is elastic, because the monopolist cannot push the price far above MC. It may also be offset by lower costs from economies of scale, or by dynamic efficiency over time.',
    tip:'The rectangle is a transfer. The triangle is the loss. Mixing them up is the common error.'},

  vs_pd:{terms:[["Perfect (first degree) price discrimination", "Charging every customer the most they are willing to pay, so all consumer surplus becomes producer surplus."]], kind:'vs', anim:true, two:true, btn:'First degree', showing:'Perfect price discrimination: AR becomes MR',
    title:'Perfect price discrimination',
    lead:'Suppose the monopolist could charge every consumer the most they are willing to pay (first degree price discrimination). The demand curve then becomes its marginal revenue curve.',
    chain:[
      'Each unit is sold at its own price, read off the demand curve. Selling one more unit no longer means cutting the price on the others, so AR becomes MR.',
      'The firm keeps selling until the price of the last unit equals MC, at point E. Output rises to Q<sub>PC</sub>.',
      'Nobody pays less than they were willing to, so consumer surplus is zero.',
      'The whole triangle A E P<sub>PC</sub> is now supernormal profit, and there is no deadweight loss.'
    ],
    compare:{vs:'Compared with a single-price monopoly',rows:[['Output','↑ higher'],['Consumer surplus','none'],['Profit','↑ largest'],['Deadweight loss','none']]},
    evaluation:'Total welfare is the same as under perfect competition, but all of it goes to the firm. In practice this is rare: the firm needs market power, information on what each consumer will pay, and a way to stop resale. Third degree discrimination, such as student or off-peak prices, is far more common.'},

  /* ---------------- THIRD DEGREE PRICE DISCRIMINATION ---------------- */
  pd3_one:{kind:'pd3', btn:'Third degree: one price', showing:'One price, P₁, charged in both markets',
    title:'Before discrimination: one price for everyone',
    lead:'Start with a monopolist that cannot tell its customers apart, so it charges a single price. Third degree price discrimination is judged against this.',
    chain:[
      'The firm faces the whole market demand curve, on the right. It produces where MR = MC, at Q<sub>1</sub>, and charges P<sub>1</sub>.',
      'That one price applies in both sub-markets. Market A has relatively inelastic demand: at P<sub>1</sub> many of its consumers would have been willing to pay more.',
      'Market B has relatively elastic demand: at P<sub>1</sub> it buys very little, because many of its consumers are priced out.',
      'So one price is a compromise. It is too low for market A and too high for market B.'
    ],
    tip:'MC is drawn flat and equal to AC to keep the three diagrams simple. The same MC line runs across all three, and the price axis is the same in each.'},

  pd3:{terms:[["Third degree price discrimination", "Charging different groups different prices for the same product with the same costs."]], traps:["Conditions: market power, groups with <b>different PEDs</b> that can be kept apart, and no resale. The higher price goes to the group with <b>inelastic</b> demand."], kind:'pd3', anim:true, btn:'Third degree: two prices', showing:'MR = MC in each market: A pays more, B pays less',
    title:'Third degree price discrimination',
    lead:'If the firm can split its customers into groups with different elasticities, and stop resale between them, it sets MR = MC in each market separately.',
    chain:[
      'In market A demand is relatively inelastic, so MR = MC gives a high price, P<sub>A</sub>.',
      'In market B demand is relatively elastic, so MR = MC gives a low price, P<sub>B</sub>.',
      'P<sub>A</sub> is above the single price P<sub>1</sub> and P<sub>B</sub> is below it. Consumers in A lose consumer surplus. Consumers in B gain, and some who were priced out can now buy.',
      'The two shaded boxes together are larger than the single-price profit box (dashed, on the right), so discrimination raises supernormal profit.'
    ],
    compare:{vs:'Compared with one price',rows:[['Price in A','↑ higher'],['Price in B','↓ lower'],['Surplus in A','↓ lower'],['Profit','↑ higher']]},
    evaluation:'Three conditions must hold: market power, information to tell the groups apart (age, time of travel), and no resale between them. Whether consumers benefit depends on the group: A pays more, B pays less. The extra profit may also keep services running that would not otherwise pay, such as off-peak trains.',
    tip:'Write "relatively inelastic", not just "inelastic". A profit maximiser never prices on the inelastic part of its demand curve, because MR is negative there.'},

  /* ------------------------- NATURAL MONOPOLY ------------------------- */
  nm_base:{terms:[["Natural monopoly", "An industry where one firm can supply the whole market at lower average cost than two or more firms could, because economies of scale are so large."]], traps:["A natural monopoly’s LRAC is still falling where it meets demand, so MC is below AC there."], kind:'nat', btn:'The curves', showing:'AC falls across the whole market',
    title:'Natural monopoly',
    lead:'A natural monopoly is an industry where economies of scale are so large that one firm can supply the whole market at a lower average cost than two or more firms could.',
    chain:[
      'Fixed costs are huge (a rail line, a water network) and the cost of serving one more customer is small.',
      'So AC keeps falling across the whole range of market demand, and MC lies below it all the way.',
      'A second firm would have to duplicate the network. Each firm would then have a smaller output and a higher average cost.',
      'It is therefore more efficient to have a single firm, even though that firm has monopoly power.'
    ],
    tip:'Draw AC and MC both falling and flattening out, with MC underneath AC. Neither turns back up.'},

  nm_profit:{kind:'nat', btn:'Unregulated', showing:'Unregulated: MR = MC, supernormal profit',
    title:'Unregulated: the firm still restricts output',
    lead:'Left alone, a natural monopolist behaves like any other profit maximiser.',
    chain:[
      'It produces where MR = MC, at Q<sub>1</sub>, and charges P<sub>1</sub>.',
      'AR is above AC at Q<sub>1</sub>, so it earns supernormal profit: the shaded box.',
      'Price is well above MC, so it is allocatively inefficient.',
      'It is producing on the falling part of AC, so it is not productively efficient either, although its costs are still lower than several smaller firms would have.'
    ],
    evaluation:'Natural monopolies often supply essentials such as water, where demand is inelastic. That makes high prices particularly damaging for consumers, and it is the main argument for regulating them.'},

  nm_reg:{traps:["At P = MC a natural monopoly makes an economic loss (P is below AC), so it needs a subsidy, or regulators set P = AC instead."], kind:'nat', anim:true, btn:'Regulated price', showing:'Regulated at P = MC: the firm needs a subsidy',
    title:'Regulation: price set where P = MC',
    lead:'To get the allocatively efficient outcome, a regulator can force the firm to charge P<sub>R</sub>, where AR meets MC.',
    chain:[
      'At P<sub>R</sub> output rises from Q<sub>1</sub> to Q<sub>R</sub>, and price equals marginal cost.',
      'But MC is below AC in a natural monopoly, so at Q<sub>R</sub> the price P<sub>R</sub> is below average cost, C<sub>R</sub>.',
      'The firm makes an economic loss of C<sub>R</sub> minus P<sub>R</sub> on every unit: the shaded band, (C<sub>R</sub> − P<sub>R</sub>) × Q<sub>R</sub> in total.',
      'It would leave the industry, so the government has to pay a subsidy equal to that loss.'
    ],
    compare:{vs:'Compared with the unregulated outcome',rows:[['Price','↓ much lower'],['Output','↑ higher'],['Allocative','efficient'],['Firm','economic loss, needs subsidy']]},
    evaluation:'A guaranteed subsidy removes the incentive to keep costs down: if costs rise the subsidy rises, so X-inefficiency develops, and the firm may overstate its costs. The regulator needs accurate information and may be captured by the firm it regulates. The alternative is nationalisation, which stops consumers being exploited but also has no profit incentive.'},

  /* ------------------------- PERFECT COMPETITION ------------------------- */
  pc_taker:{terms:[["Perfect competition", "Many firms, identical products, no barriers to entry or exit, and perfect information."]], traps:["Draw the industry and the firm side by side. The price set in the industry is the firm’s AR = MR line."], kind:'pc', p0:62, btn:'Price taker', showing:'Industry sets the price, the firm takes it',
    title:'The firm is a price taker',
    lead:'In perfect competition the price is set by the whole industry. Each firm is too small to affect it, so it takes that price as given.',
    chain:[
      'Industry demand and supply set the market price, P<sub>1</sub> (left diagram).',
      'There are many small firms selling identical products to buyers with perfect knowledge. A firm charging above P<sub>1</sub> would sell nothing.',
      'The firm can sell as much as it likes at P<sub>1</sub>, so its demand curve is perfectly elastic: a horizontal line at P<sub>1</sub>.',
      'Every extra unit sells for the same price, so AR = MR = P<sub>1</sub>.'
    ],
    tip:'Draw the two diagrams side by side and carry the price across with a dashed line.'},

  pc_snp:{traps:["Short-run supernormal profit is the box between price and AC, at the output where MR = MC."], kind:'pc', p0:62, costs:true, btn:'Supernormal profit', showing:'Short run: price above AC',
    title:'Short run: supernormal profit',
    lead:'The firm chooses its output where MC = MR. If the market price is above average cost at that output, it makes supernormal profit.',
    chain:[
      'The firm produces where MC = MR, at Q<sub>1</sub>.',
      'At Q<sub>1</sub>, AR (the price P<sub>1</sub>) is above AC, which is at C.',
      'The gap between AR and AC, multiplied by Q<sub>1</sub>, is the supernormal profit box.',
      'This can only last in the short run. Other firms can see the profit, and nothing stops them entering.'
    ],
    tip:'The firm produces where MC cuts the price line on its way up. That is not the lowest point of AC.'},

  pc_loss:{kind:'pc', p0:32, costs:true, btn:'Economic loss', showing:'Short run: price below AC',
    title:'Short run: an economic loss',
    lead:'If the market price is below average cost, the firm makes an economic loss even at its best output.',
    chain:[
      'The firm still produces where MC = MR, at Q<sub>1</sub>, because that is where the loss is smallest.',
      'At Q<sub>1</sub>, AC (at C) is above AR (the price P<sub>1</sub>).',
      'The gap between AC and AR, multiplied by Q<sub>1</sub>, is the economic loss: the shaded box.',
      'In the short run it keeps producing as long as the price covers its variable costs, because the fixed costs have to be paid either way.'
    ],
    evaluation:'If the price falls below average variable cost, the firm is better off shutting down straight away, because producing would add to its losses. In the long run it leaves the industry unless the price recovers.'},

  pc_entry:{traps:["Entry shifts <b>industry supply</b> right. The firm’s AR = MR line falls with the price until only normal profit is left."], kind:'pc', p0:62, toLR:true, costs:true, anim:true, btn:'Profit attracts entry', showing:'Entry: supply shifts right, price falls',
    title:'Long run: profit attracts entry',
    lead:'Supernormal profit does not last. Perfect knowledge means outsiders can see it, and no barriers to entry means they can come in.',
    chain:[
      'New firms enter, so industry supply shifts right from S<sub>1</sub> to S<sub>2</sub>.',
      'The market price falls from P<sub>1</sub> to P<sub>2</sub>.',
      'Each firm is a price taker, so its AR = MR line falls with the price, and it cuts output back along MC from Q<sub>1</sub> to Q<sub>2</sub>.',
      'Entry continues until the price equals the lowest point of AC. Supernormal profit has gone and only normal profit is left.'
    ],
    compare:{vs:'After entry',rows:[['Price','↓ lower'],['Industry output','↑ higher'],['Firm output','↓ lower'],['Profit','normal only']]},
    evaluation:'The model assumes entry is immediate and costless. In reality setting up takes time and money, so supernormal profit can last longer than the model suggests.'},

  pc_exit:{kind:'pc', p0:32, toLR:true, costs:true, anim:true, btn:'Losses cause exit', showing:'Exit: supply shifts left, price rises',
    title:'Long run: economic losses cause exit',
    lead:'Economic losses do not last either. With no barriers to exit, loss-making firms leave the industry.',
    chain:[
      'Some firms leave, so industry supply shifts left from S<sub>1</sub> to S<sub>2</sub>.',
      'The market price rises from P<sub>1</sub> to P<sub>2</sub>.',
      'The AR = MR line of each remaining firm rises with the price, and it expands output along MC from Q<sub>1</sub> to Q<sub>2</sub>.',
      'Exit continues until the price equals the lowest point of AC. The firms that remain make normal profit.'
    ],
    compare:{vs:'After exit',rows:[['Price','↑ higher'],['Industry output','↓ lower'],['Firm output','↑ higher'],['Profit','normal']]}},

  pc_lr:{traps:["In long-run equilibrium P = MC = minimum AC: allocatively and productively efficient."], kind:'pc', lr:true, costs:true, btn:'Long-run equilibrium', showing:'AC = AR = MR = MC',
    title:'Long-run equilibrium',
    lead:'In the long run every firm ends up at the bottom of its AC curve, where AC = AR = MR = MC.',
    chain:[
      'Price equals the lowest point of AC, so firms make normal profit. There is no reason to enter and no reason to leave.',
      'Productive efficiency: output is at the lowest point of AC.',
      'Allocative efficiency: price equals MC, so no firm can charge more than the cost of the last unit.',
      'X-efficiency: any firm with costs above the minimum would make an economic loss and be forced out.'
    ],
    compare:{vs:'Efficiency in the long run',rows:[['Productive','yes'],['Allocative','yes'],['X-efficiency','yes'],['Dynamic','no']]},
    evaluation:'There is no dynamic efficiency: firms have no supernormal profit to fund research, and perfect knowledge means rivals would copy any innovation at once. Products are identical, so consumers get low prices but no choice. Very few real markets meet all the assumptions, so the model is mainly a benchmark for judging other market structures.'},

  /* ------------------------- MONOPOLISTIC COMPETITION ------------------------- */
  mc_snp:{terms:[["Monopolistic competition", "Many firms selling slightly different products, with low barriers to entry."]], kind:'mcomp', a:'snp', btn:'Supernormal profit', showing:'Short run: AR above AC',
    title:'Short run: supernormal profit',
    lead:'Each firm sells a slightly different product, so it has a little market power and faces a downward-sloping demand curve. In the short run it behaves like a small monopolist.',
    chain:[
      'The firm produces where MR = MC, at Q<sub>1</sub>.',
      'It goes up to AR and charges P<sub>1</sub>.',
      'At Q<sub>1</sub>, AR is above AC (at C), so it earns supernormal profit: the shaded box.',
      'Demand is relatively elastic because there are many close substitutes, so AR is drawn flatter than a monopolist’s.'
    ],
    tip:'It is the monopoly diagram with AR and MR drawn flatter.'},

  mc_loss:{kind:'mcomp', a:'loss', btn:'Economic loss', showing:'Short run: AR below AC',
    title:'Short run: an economic loss',
    lead:'If demand for the firm’s product is weak, AR lies below AC at every output. The best the firm can do is keep its loss as small as possible.',
    chain:[
      'The firm produces where MR = MC, at Q<sub>1</sub>, and charges P<sub>1</sub>.',
      'At Q<sub>1</sub>, AC (at C) is above AR.',
      'The gap between AC and AR, multiplied by Q<sub>1</sub>, is the economic loss: the shaded box.',
      'It carries on in the short run as long as the price covers its variable costs.'
    ]},

  mc_entry:{traps:["Entry shifts each firm’s <b>AR and MR left</b>, and makes its demand more elastic, until AR just touches AC."], kind:'mcomp', a:'snp', anim:true, btn:'Profit attracts entry', showing:'Entry: AR and MR shift left',
    title:'Long run: entry removes the profit',
    lead:'There are no barriers to entry, so supernormal profit attracts new firms selling close substitutes.',
    chain:[
      'New firms enter and take some of each existing firm’s customers.',
      'The firm’s demand falls, shifting AR<sub>1</sub> left to AR<sub>2</sub>, with MR<sub>1</sub> shifting to MR<sub>2</sub>.',
      'MR = MC now at a lower output, Q<sub>2</sub>, and the price falls to P<sub>2</sub>.',
      'Entry continues until AR just touches AC. Price equals average cost, so only normal profit is left.'
    ],
    compare:{vs:'After entry',rows:[['Price','↓ lower'],['Firm output','↓ lower'],['Profit','normal only'],['Firms','↑ more']]},
    evaluation:'Firms try to slow this down by differentiating their product further through branding, quality or location, which makes their demand less elastic. Because entry is easy, any advantage tends to be copied.'},

  mc_exit:{kind:'mcomp', a:'loss', anim:true, btn:'Losses cause exit', showing:'Exit: AR and MR shift right',
    title:'Long run: exit removes the economic loss',
    lead:'There are no barriers to exit either, so loss-making firms leave.',
    chain:[
      'Some firms leave the market, and their customers move to the firms that remain.',
      'Demand for each remaining firm rises, shifting AR<sub>1</sub> right to AR<sub>2</sub>, with MR<sub>1</sub> shifting to MR<sub>2</sub>.',
      'MR = MC now at a higher output, Q<sub>2</sub>, and the price rises to P<sub>2</sub>.',
      'Exit continues until AR just touches AC and the firms that remain make normal profit.'
    ],
    compare:{vs:'After exit',rows:[['Price','↑ higher'],['Firm output','↑ higher'],['Profit','normal'],['Firms','↓ fewer']]}},

  mc_lr:{traps:["In the long run AR is tangent to AC at the MR = MC output, so only normal profit. That point is <b>not</b> the lowest point of AC."], kind:'mcomp', a:'lr', btn:'Long-run equilibrium', showing:'AR is tangent to AC',
    title:'Long-run equilibrium',
    lead:'In the long run AR is tangent to AC. The firm still has a downward-sloping demand curve, but it makes only normal profit.',
    chain:[
      'The firm produces where MR = MC, at Q<sub>1</sub>.',
      'At that output AR just touches AC, so price equals average cost and profit is normal.',
      'At any other output AC is above AR and the firm would make an economic loss. That is why AR must touch AC and not cross it.',
      'No firm wants to enter or leave, so this is the long-run equilibrium.'
    ],
    compare:{vs:'In the long run',rows:[['Profit','normal'],['Price','above MC'],['Output','below MES'],['Products','differentiated']]},
    tip:'The tangency must sit directly above the point where MR = MC. Draw the vertical line first, then make AR touch AC on it.'},

  mc_eff:{terms:[["Excess capacity", "The gap between the output a firm produces and the output at minimum AC."]], traps:["In the long run monopolistic competition is neither allocatively efficient (P > MC) nor productively efficient (not at minimum AC)."], kind:'mcomp', a:'lr', btn:'Efficiency', showing:'Excess capacity, and price above MC',
    title:'Efficiency and excess capacity',
    lead:'Even with only normal profit, the long-run outcome is not efficient. The tangency is on the falling part of AC.',
    chain:[
      'Productive efficiency needs output at the lowest point of AC (the MES). The firm produces Q<sub>1</sub>, to the left of it, so average cost is above the minimum.',
      'The gap between Q<sub>1</sub> and the MES is excess capacity: the firm could produce more at a lower average cost, but could not sell it without cutting the price.',
      'Allocative efficiency needs P = MC. At Q<sub>1</sub> the price is above MC, so too little is produced.',
      'Both follow from the downward-sloping demand curve, which comes from product differentiation.'
    ],
    compare:{vs:'Efficiency in the long run',rows:[['Productive','no'],['Allocative','no'],['X-efficiency','yes'],['Dynamic','debatable']]},
    evaluation:'The inefficiency is the price of variety. Consumers get choice and firms compete on quality, which perfect competition cannot offer. Dynamic efficiency is debatable: firms have a strong incentive to innovate to stand out, but without supernormal profit they may lack the funds.'},

  /* ------------------------- CONTESTABLE MARKETS ------------------------- */
  cm_mono:{terms:[["Contestable market", "A market that firms can enter and leave easily, with no sunk costs, so the threat of entry disciplines the firms already in it."], ["Sunk costs", "Costs a firm cannot get back when it leaves, such as advertising."]], traps:["Contestability is about the <b>threat</b> of entry, not the number of firms. Do not confuse it with competition: a market with one firm can be highly contestable. Examiners keep seeing this mix-up."], kind:'cont', btn:'Monopoly outcome', showing:'With no threat of entry: MR = MC',
    title:'The starting point: a monopoly',
    lead:'Traditional theory says a firm with no rivals restricts output and raises its price. Contestable market theory asks whether that still holds when new firms could enter easily.',
    chain:[
      'With no competition at all, the firm would set MR = MC, producing Q<sub>M</sub> and charging P<sub>M</sub>.',
      'At Q<sub>M</sub>, AR is above AC, so it would earn supernormal profit.',
      'Traditional theory judges competition by the number of firms in the market, so one firm means no competition.',
      'Contestable market theory says what matters is potential competition: how easily a new firm could come in and leave again.'
    ],
    tip:'A market is perfectly contestable when there are no barriers to entry or exit. The key condition is no sunk costs.'},

  cm_hit:{terms:[["Hit-and-run entry", "Entering to take the supernormal profit, then leaving before the incumbent can respond."]], kind:'cont', btn:'Hit-and-run entry', showing:'Supernormal profit invites entry',
    title:'Hit-and-run entry',
    lead:'If entering and leaving cost nothing, supernormal profit is an open invitation.',
    chain:[
      'An outside firm sees the supernormal profit being made at P<sub>M</sub>.',
      'With no sunk costs and the same technology as the incumbent, it can enter, undercut the price slightly and take the customers.',
      'It earns profit for as long as that lasts, then leaves without loss when the incumbent responds. This is hit-and-run competition.',
      'The incumbent knows this can happen whenever it prices above average cost.'
    ],
    evaluation:'This needs entrants to face no disadvantage at all: no brand loyalty to overcome, no sunk costs such as advertising, and no risk of the incumbent cutting its price to keep them out (limit pricing). In practice at least some of these exist.'},

  cm_threat:{traps:["In a perfectly contestable market the incumbent prices close to AC, earning normal profit, because any supernormal profit would invite entry."], kind:'cont', anim:true, btn:'Threat of entry', showing:'Price falls until AR = AC',
    title:'The threat of entry lowers the price',
    lead:'To give entrants no reason to come in, the incumbent prices so that there is no supernormal profit to take.',
    chain:[
      'The firm lowers its price from P<sub>M</sub> to P<sub>C</sub> and expands output from Q<sub>M</sub> to Q<sub>C</sub>.',
      'At P<sub>C</sub>, AR equals AC, so it makes normal profit only.',
      'With no supernormal profit on offer, hit-and-run entry is not worth it.',
      'So a market with only one firm can still give a competitive outcome. Potential competition does the work of actual competition.'
    ],
    compare:{vs:'Compared with the monopoly outcome',rows:[['Price','↓ lower'],['Output','↑ higher'],['Profit','normal only'],['Firms','unchanged']]},
    evaluation:'A firm with a short time horizon may still take supernormal profit now and deal with entry when it happens. Over time incumbents can also make the market less contestable, by merging or by heavy advertising that creates sunk costs for entrants.'},

  cm_eff:{kind:'cont', btn:'Efficiency', showing:'Closer to P = MC and to the lowest AC',
    title:'Efficiency in a contestable market',
    lead:'Pricing at average cost moves the firm much closer to the efficient outcome than a monopolist would be.',
    chain:[
      'Allocative: the gap between price and MC (the thick lines) is far smaller at Q<sub>C</sub> than at Q<sub>M</sub>, so output is closer to what consumers want.',
      'Productive: Q<sub>C</sub> is close to the lowest point on AC, so the firm is making much fuller use of economies of scale.',
      'X-efficiency: the firm cannot afford slack, because any cost above the minimum would let an entrant undercut it.',
      'Dynamic: the threat of entry is an incentive to innovate, but normal profit leaves less to fund it.'
    ],
    compare:{vs:'Compared with the monopoly outcome',rows:[['Allocative','closer'],['Productive','closer'],['X-efficiency','yes'],['Dynamic','debatable']]},
    evaluation:'No market is perfectly contestable, so treat this as a direction, not a guaranteed result: the lower the barriers to entry and exit, the closer the outcome gets to it. The internet has made many markets more contestable, for example online travel agents competing with traditional operators.'},

  /* ------------------------- OLIGOPOLY ------------------------- */
  kink:{terms:[["Oligopoly", "A market dominated by a few large firms that depend on each other, with high barriers to entry."], ["Interdependence", "Each firm’s best decision depends on how its rivals react."]], traps:["Explain the kink with rivals’ reactions: they <b>ignore</b> a price rise (demand elastic above P) but <b>match</b> a price cut (inelastic below P)."], kind:'kink', btn:'The kink', showing:'The kinked demand curve',
    title:'The kinked demand curve',
    lead:'Oligopolists are interdependent, so the demand one firm faces depends on how its rivals react. They react differently to a price rise and a price cut, which bends the demand curve at the current price, P<sub>1</sub>.',
    plain:[
      ['<b class="k-ar">Above P<sub>1</sub></b>','Demand is elastic. If the firm raises its price, rivals leave theirs alone and take its customers.'],
      ['<b class="k-ar">Below P<sub>1</sub></b>','Demand is inelastic. If the firm cuts its price, rivals cut too, so it gains very few extra sales.'],
      ['<b>At P<sub>1</sub></b>','The kink. Moving in either direction loses revenue, so the firm stays where it is.']
    ],
    tip:'Draw the top section shallow and the bottom section steep. The kink sits at the current price.'},

  raise:{kind:'kink', anim:true, move:40, btn:'Raise price', showing:'Price rise: rivals do not follow',
    title:'The firm raises its price',
    lead:'Rivals do not follow a price rise. They keep their prices where they are and pick up the customers who leave.',
    chain:[
      'The firm raises its price from P<sub>1</sub> to P<sub>2</sub>.',
      'Rival firms hold their prices, because they gain market share by doing nothing.',
      'Customers switch to the cheaper rivals, so quantity falls a long way, from Q<sub>1</sub> to Q<sub>2</sub>.',
      'Demand above P<sub>1</sub> is price elastic: a small rise in price causes a proportionately larger fall in quantity, so total revenue falls.'
    ],
    compare:{vs:'After the price rise',rows:[['Price','↑ a little'],['Quantity','↓ a lot'],['Revenue','↓ lower'],['Demand','elastic']]},
    evaluation:'This assumes rivals never follow a rise. If every firm faces the same cost increase, or one firm is the accepted price leader, rivals may raise their prices too and the kink disappears.'},

  cut:{kind:'kink', anim:true, move:59, btn:'Cut price', showing:'Price cut: rivals follow',
    title:'The firm cuts its price',
    lead:'Rivals match a price cut straight away, because otherwise they would lose market share.',
    chain:[
      'The firm cuts its price from P<sub>1</sub> to P<sub>2</sub>.',
      'Rival firms cut their prices too, to protect their market share.',
      'With every firm cheaper, the firm wins hardly any customers from rivals. Quantity rises only slightly, from Q<sub>1</sub> to Q<sub>2</sub>.',
      'Demand below P<sub>1</sub> is price inelastic: a large cut in price brings a proportionately smaller rise in quantity, so total revenue falls.'
    ],
    compare:{vs:'After the price cut',rows:[['Price','↓ a lot'],['Quantity','↑ a little'],['Revenue','↓ lower'],['Demand','inelastic']]},
    evaluation:'A cut can still pay off if the firm has lower costs than its rivals and can survive a price war longer than they can, or if the aim is to force a rival out of the market (predatory pricing).'},

  mrgap:{traps:["MC can move anywhere inside the gap in MR without changing price or output. That is the source of price rigidity."], kind:'kink', btn:'The MR gap', showing:'Discontinuous marginal revenue',
    title:'The gap in marginal revenue',
    lead:'Because AR changes slope at the kink, MR cannot be one continuous line. It drops straight down at Q<sub>1</sub>.',
    chain:[
      'Each section of AR has its own MR, twice as steep as that section.',
      'Up to Q<sub>1</sub>, MR belongs to the shallow, elastic section, so it is fairly high.',
      'Beyond Q<sub>1</sub>, MR belongs to the steep, inelastic section. It is far lower, and here it is negative: a price cut that rivals match reduces total revenue.',
      'At Q<sub>1</sub>, MR falls vertically from one to the other. That vertical drop is the discontinuity.'
    ],
    tip:'Draw the gap as a dashed vertical line directly below the kink, running down through the output axis.'},

  eqm:{kind:'kink', btn:'Equilibrium and profit', showing:'Equilibrium: MC cuts MR in the gap',
    title:'Equilibrium and supernormal profit',
    lead:'The firm still maximises profit where MC = MR. In this model MC passes through the gap in MR, so output is Q<sub>1</sub> and the price is P<sub>1</sub>.',
    chain:[
      'MC cuts MR inside the vertical gap, at output Q<sub>1</sub>.',
      'Go up to AR for the price: P<sub>1</sub>, the price at the kink.',
      'At Q<sub>1</sub>, AR is above AC, so the firm earns supernormal profit: the shaded box.',
      'High barriers to entry and exit keep new firms out, so that profit can last into the long run.'
    ],
    evaluation:'The model explains why the price stays at P<sub>1</sub>, but not how P<sub>1</sub> was reached in the first place. In practice it is often set by collusion or by following a price leader.',
    tip:'MC must cross the dashed gap, not the sloping part of MR.'},

  rigid:{kind:'kink', anim:true, shift:{dx:3,dy:6}, btn:'Price rigidity', showing:'Small cost rise: price does not change',
    title:'Price rigidity',
    lead:'A small change in costs does not change the price. This is why prices in oligopolies tend to be stable.',
    chain:[
      'Costs rise, shifting MC<sub>1</sub> to MC<sub>2</sub> and AC<sub>1</sub> to AC<sub>2</sub>.',
      'MC<sub>2</sub> still cuts MR inside the gap, so MC = MR at the same output, Q<sub>1</sub>.',
      'Output and price are unchanged. The firm does not pass the cost increase on to consumers.',
      'It absorbs the increase as lower supernormal profit: the box shrinks from below.'
    ],
    compare:{vs:'After the shift',rows:[['Price','= same'],['Output','= same'],['Revenue','= same'],['Profit','↓ lower']]},
    evaluation:'Firms would rather take a smaller profit than change the price and risk starting a price war. Rigid prices can also be explained without the kink: firms may simply be sticking to a collusive agreement that nobody wants to disturb.'},

  bigcost:{kind:'kink', anim:true, shift:{dx:8,dy:18}, btn:'Large cost rise', showing:'Large cost rise: MC leaves the gap',
    title:'A large rise in costs',
    lead:'The price only stays fixed while MC cuts MR inside the gap. A big enough change in costs moves MC out of it.',
    chain:[
      'Costs rise sharply, shifting MC<sub>1</sub> to MC<sub>2</sub> and AC<sub>1</sub> to AC<sub>2</sub>.',
      'MC<sub>2</sub> is now above the top of the gap, so it cuts the sloping part of MR at a lower output, Q<sub>2</sub>.',
      'Going up to AR, the price rises to P<sub>2</sub>.',
      'Profit is squeezed hard: fewer units are sold and the margin on each is much smaller.'
    ],
    compare:{vs:'After the shift',rows:[['Price','↑ higher'],['Output','↓ lower'],['Profit','↓ much lower'],['Rigidity','breaks']]},
    evaluation:'If the cost rise hits every firm in the industry, such as higher energy prices, they all face the same pressure and prices are likely to rise together. Rigidity only holds for small changes.'},

  g_collude:{terms:[["Collusion", "Firms cooperating, openly or tacitly, to limit competition, for example by fixing prices."], ["Cartel", "A formal agreement between firms to fix prices or output."]], traps:["Collusion is illegal in the UK: the CMA can fine firms. Tacit collusion, such as price leadership, is harder to prove."], kind:'game', cell:'HH', btn:'Why collude', showing:'Both charge a high price: £10m each',
    title:'Why firms collude',
    lead:'Two firms each choose a high or a low price. Each firm’s profit depends on what the other one does. Click any box in the matrix to see that outcome.',
    chain:[
      'If both firms charge a high price, each makes £10m. Joint profit is £20m, the highest of the four outcomes.',
      'If they compete on price, both end up at a low price with £5m each.',
      'So both firms are better off agreeing to keep prices high than competing.',
      'That agreement is collusion. It can be formal (a cartel, which is illegal) or tacit, such as following a price leader.'
    ],
    evaluation:'Collusion holds best when there are few firms, they have similar costs, and every large firm is part of the agreement. It also has to escape the regulator: cartels face heavy fines.'},

  g_cheat:{kind:'game', cell:'LH', btn:'Incentive to cheat', showing:'One firm undercuts: £15m against £1m',
    title:'The incentive to cheat',
    lead:'Once both firms are charging a high price, each can do even better by undercutting the other.',
    chain:[
      'Starting from high prices, one firm cuts its price while the other keeps it high.',
      'The firm that cut takes market share and earns £15m, more than the £10m from colluding.',
      'The firm that stayed high is left with £1m.',
      'Each firm has this incentive, and each knows the other has it. That is why collusive agreements tend to break down.'
    ],
    evaluation:'Cheating pays in a one-off game. If firms deal with each other year after year, the threat of retaliation in later rounds can keep both at the high price.'},

  g_dom:{terms:[["Dominant strategy", "The best choice for a player whatever the other player does."]], kind:'game', cell:'', best:true, btn:'Dominant strategy', showing:'Circled = best response to the rival',
    title:'The dominant strategy',
    lead:'Take each firm in turn and ask what its best response is to each thing the rival might do. The circled profits are those best responses.',
    chain:[
      'If Firm B charges a high price, Firm A earns more from a low price (£15m) than a high one (£10m).',
      'If Firm B charges a low price, Firm A still earns more from a low price (£5m) than a high one (£1m).',
      'So a low price is best for Firm A whatever Firm B does. That is a dominant strategy.',
      'The matrix is symmetrical, so a low price is Firm B’s dominant strategy too.'
    ],
    tip:'In the exam, go through one firm’s choices line by line like this. That is the analysis.'},

  g_nash:{terms:[["Nash equilibrium", "An outcome where neither player can do better by changing strategy on their own."]], traps:["Use payoffs that fit the question’s context. Examiners saw pre-learnt matrices with numbers that made no sense for the firms in the question."], kind:'game', cell:'LL', best:true, btn:'Nash equilibrium', showing:'Both charge a low price: £5m each',
    title:'Nash equilibrium',
    lead:'Both firms follow their dominant strategy and charge a low price. Neither can do better by changing its own decision.',
    chain:[
      'Both firms charge a low price and earn £5m each.',
      'If either firm switched to a high price on its own, its profit would fall to £1m. So neither moves: this is the Nash equilibrium.',
      'Both would be better off at high prices (£10m each), but neither can trust the other to stay there.',
      'This is the prisoner’s dilemma. Acting in its own interest leaves each firm worse off, and it explains why price wars happen.'
    ],
    compare:{vs:'Compared with colluding',rows:[['Price','↓ lower'],['Profit each','↓ £5m'],['Joint profit','↓ £10m'],['Consumers','gain']]},
    evaluation:'Consumers gain from low prices while the price war lasts. Firms know this outcome is bad for them, which is why oligopolists prefer non-price competition: branding, quality, location and after-sales service.'},

  cr:{terms:[["Concentration ratio", "The combined market share of the largest n firms, such as a 4-firm ratio."]], work:{"q": "The four largest firms in a market have shares of 30%, 20%, 15% and 10%. What is the 4-firm concentration ratio?", "steps": ["Add the four largest shares: 30 + 20 + 15 + 10 = <b>75%</b>.", "A high share held by just a few firms is a sign of oligopoly."], "ans": "75%, written as a 4-firm concentration ratio of 75%."}, traps:["A concentration ratio is a <b>share of the market</b>, not a number of firms."], kind:'cr', btn:'Concentration ratio', showing:'Type in market shares to recalculate',
    title:'Concentration ratio',
    lead:'The n-firm concentration ratio is the combined market share of the n largest firms. It is the quickest test of whether a market is an oligopoly.',
    chain:[
      'Rank the firms by market share, largest first.',
      'Add up the shares of the largest n firms. For a four-firm ratio, add the top four.',
      'The higher the ratio, the more the market is in the hands of a few firms and the weaker competition is likely to be.',
      'As a rule of thumb, a three to five firm ratio above about 70% points to an oligopoly.'
    ],
    evaluation:'The ratio depends on how you define the market: tabloid newspapers give a far higher ratio than all newspapers. It also hides how the share is split. Try the two presets, one dominant firm and four equal firms: both give 80%, but those markets would behave very differently.',
    tip:'Check who owns what. Two brands owned by the same company count as one firm.'}
};


/* =====================================================================
   SECTIONS: the page has two halves, Micro and Macro, each with its own tabs
   ===================================================================== */
var SECTIONS = {
  micro:{label:'Micro', heading:'Market structures', scope:'Section 3.4, market structures.',
         order:['perfect','monopoly','monopolistic','oligopoly','contestable']},
  macro:{label:'Macro', heading:'International economics', scope:'Section 4.1, international economics.',
         order:['global','trade','protect','blocs','fx','bop']}
};
(function(){
  var L={perfect:'Perfect competition',monopoly:'Monopoly',monopolistic:'Monopolistic competition',oligopoly:'Oligopoly',contestable:'Contestable markets'};
  for(var k in L){ TOPICS[k].section='micro'; TOPICS[k].label=L[k]; }
})();

/* =====================================================================
   MICRO: real examples and effects on consumers, one pair per market structure
   A "card" view shows text in the sheet where the diagram normally goes.
   ===================================================================== */
function EX(h,why,but,k1,k2){return {h:h,l:[[k1||'Why it fits',why],[k2||'Where it doesn’t',but]]};}
function VD(h,tag,cls,text){return {h:h,tag:[tag,cls],l:[['',text]]};}
function PT(h,pairs){return {h:h,l:pairs};}

TOPICS.perfect.groups.push(['Apply and evaluate',['pc_ex','pc_cons']]);
TOPICS.monopoly.groups.push(['Apply and evaluate',['mn_ex','mn_cons']]);
TOPICS.monopolistic.groups.push(['Apply and evaluate',['mcp_ex','mcp_cons']]);
TOPICS.oligopoly.groups.push(['Apply and evaluate',['ol_ex','ol_cons']]);
TOPICS.contestable.groups.push(['Apply and evaluate',['ct_ex','ct_cons']]);

V.pc_ex={kind:'card', btn:'Real examples', showing:'The closest real markets',
  title:'Real examples: perfect competition',
  lead:'No real market meets every assumption. In the exam, pick the closest example, then say which assumptions hold and which do not.',
  card:{head:'Closest real markets', items:[
    EX('Phone cases and cables on online marketplaces','Thousands of small sellers on sites such as Amazon, eBay and Temu sell near-identical products. Buyers can compare every price in seconds and anyone can start selling, so prices are pushed down towards cost.','Reviews, delivery speed and brand names make sellers slightly different, and the platform has a lot of power over which sellers get seen.'),
    EX('Farming: wheat and milk','Many farms sell an identical product and none is big enough to set the price. Each takes the market price.','Supermarkets are powerful buyers, governments pay subsidies, and the cost of land makes entry expensive.')
  ]},
  tip:'Use the example to test the assumptions one by one: many firms, identical products, no barriers, perfect knowledge.'};

V.pc_cons={kind:'card', btn:'Consumers', showing:'Price, quality and choice',
  title:'What consumers get: perfect competition',
  lead:'Judge any market structure for consumers on three things: price, quality and choice.',
  card:{head:'For consumers', items:[
    VD('Price','low','yes','Firms have no market power. Any supernormal profit attracts new firms, which pushes the price down to the lowest point on average cost.'),
    VD('Quality','low','no','There is no supernormal profit to pay for improvements, and with perfect knowledge any improvement would be copied straight away.'),
    VD('Choice','none','no','There are many firms, but every one sells an identical product.')
  ]},
  evaluation:'Low prices come at the cost of variety and innovation. Whether that is a good deal depends on the product: it matters little for wheat, a lot for phones.'};

V.mn_ex={kind:'card', btn:'Real examples', showing:'Monopoly power today',
  title:'Real examples: monopoly',
  lead:'Pure monopoly is rare. Most examples are firms with monopoly power: a dominant share of the market and strong barriers to entry.',
  card:{head:'Where you can see it', items:[
    EX('Google Search','Most internet searches go through Google. Its barriers to entry are huge: years of search data, a famous brand, and deals that make it the default on phones and browsers.','Search is free to users, so the cost shows up as advertising. AI chatbots are a new source of competition, and regulators in the US and the EU have taken action against it.'),
    EX('Thames Water (natural monopoly)','One network of pipes serves London and the Thames Valley. Building a second network would be enormously expensive, so one firm supplies everyone and households cannot switch.','It is regulated: Ofwat limits what it can charge. Sewage spills and heavy debts show that regulation does not guarantee a good outcome.'),
    EX('Student discounts and railcards (price discrimination)','Spotify, Apple Music and cinemas charge students less, and the 16–25 Railcard cuts train fares. Students have more elastic demand, and an ID check stops resale.','These firms are not pure monopolies. Price discrimination needs some market power, but rivals exist.')
  ]}};

V.mn_cons={kind:'card', btn:'Consumers', showing:'Price, quality and choice',
  title:'What consumers get: monopoly',
  lead:'With no rivals, the firm has little reason to look after its customers, but the story is not all one way.',
  card:{head:'For consumers', items:[
    VD('Price','high','no','The firm restricts output to push the price above marginal cost, and barriers to entry stop anyone undercutting it.'),
    VD('Quality','depends','mix','Consumers have nowhere else to go, so the incentive is weak. But supernormal profit can pay for research, and the firm may innovate to keep its barriers high.'),
    VD('Choice','none','no','One firm, with no close substitutes.')
  ]},
  evaluation:'A monopolist with large economies of scale may still charge less than many small firms could. For a natural monopoly, one regulated firm is the most efficient option.'};

V.mcp_ex={kind:'card', btn:'Real examples', showing:'Many small firms, each a bit different',
  title:'Real examples: monopolistic competition',
  lead:'Look for markets with lots of small firms, products that differ slightly, and low costs of starting up.',
  card:{head:'Where you can see it', items:[
    EX('Barbers and chicken shops','Any high street has several. Each differs a little in style, taste, price and location, and it does not cost much to open another.','Big chains such as Nando’s and KFC have brand power and economies of scale that a small shop cannot match.'),
    EX('Small clothing brands on Depop, Vinted and TikTok Shop','Thousands of sellers, each with its own look. Starting up needs little more than a phone, and a seller with a popular style can charge a bit more for a while.','Popular styles are copied quickly, so the extra profit does not last. The platforms also decide which sellers get seen.')
  ]},
  tip:'The second example shows the long run: supernormal profit attracts copycats until only normal profit is left.'};

V.mcp_cons={kind:'card', btn:'Consumers', showing:'Price, quality and choice',
  title:'What consumers get: monopolistic competition',
  lead:'Consumers pay a little more than in perfect competition, and get variety in return.',
  card:{head:'For consumers', items:[
    VD('Price','not low','no','Each firm produces on a small scale with spare capacity and spends money on being different, so average cost and price are above the minimum.'),
    VD('Quality','high','yes','Being different is the only source of market power a firm has, so firms compete on quality and service.'),
    VD('Choice','high','yes','Many small firms selling differentiated products.')
  ]},
  evaluation:'With only normal profit in the long run, firms may not have the funds for serious research, so improvements tend to be small.'};

V.ol_ex={kind:'card', btn:'Real examples', showing:'A few firms watching each other',
  title:'Real examples: oligopoly',
  lead:'Oligopoly is the most common market structure. Look for a few dominant firms, high barriers to entry, and firms reacting to each other.',
  card:{head:'Where you can see it', items:[
    EX('Games consoles','Sony (PlayStation), Microsoft (Xbox) and Nintendo dominate. Barriers are high: years of development and exclusive games. They compete mostly on exclusives, subscriptions and features, not price, and each watches the others’ launch prices closely.','PC and mobile gaming are strong substitutes, and Nintendo aims at a different audience, so the three are not perfect rivals.'),
    EX('UK supermarkets','A few chains (Tesco, Sainsbury’s, Asda, Morrisons, Aldi, Lidl) take most grocery spending. They match each other’s prices, as with Tesco’s Aldi Price Match, and compete through loyalty schemes such as Clubcard.','Aldi and Lidl grew from a small start, which shows the barriers to entry are not absolute.'),
    EX('OPEC+ (a cartel)','Oil-producing countries agree limits on how much each will pump, to keep the world price high. It is formal collusion, done in the open.','Members have an incentive to cheat by pumping more, and producers outside the group, such as the US, weaken its control.')
  ]},
  tip:'Consoles show non-price competition, supermarkets show interdependence and price matching, OPEC+ shows collusion and the incentive to cheat.'};

V.ol_cons={kind:'card', btn:'Consumers', showing:'Price, quality and choice',
  title:'What consumers get: oligopoly',
  lead:'The outcome for consumers depends on whether the firms compete or collude.',
  card:{head:'For consumers', items:[
    VD('Price','usually high','no','Firms avoid competing on price, and collusion keeps prices above the competitive level. A price war brings them down for a while.'),
    VD('Quality','high','yes','Supernormal profit pays for non-price competition: product development, branding and service.'),
    VD('Choice','limited','mix','There are a few dominant firms, and their products tend to be similar.')
  ]},
  evaluation:'If collusion breaks down, consumers gain from low prices, but only for as long as the price war lasts.'};

V.ct_ex={kind:'card', btn:'Real examples', showing:'Entry made easy',
  title:'Real examples: contestable markets',
  lead:'Look for markets where technology has removed the sunk costs that used to keep new firms out.',
  card:{head:'Where you can see it', items:[
    EX('Uber and Bolt','Uber entered city taxi markets without owning cars: drivers use their own, so sunk costs are low. Bolt then entered against Uber in the same way, which keeps fares in check.','An app needs plenty of drivers and riders before it is useful, and cities require licences. Those are barriers.'),
    EX('App-only banks: Monzo, Revolut, Starling','They entered banking without a branch network, which removed the biggest sunk cost. High-street banks responded with better apps and lower fees.','A banking licence and customer trust take years to earn, so entry is not quick.')
  ]},
  tip:'In both cases the existing firms changed their behaviour because of new entrants. That is the theory working.'};

V.ct_cons={kind:'card', btn:'Consumers', showing:'Price, quality and choice',
  title:'What consumers get: contestable markets',
  lead:'Consumers can get a competitive outcome even when only one firm is in the market.',
  card:{head:'For consumers', items:[
    VD('Price','lower','yes','The incumbent prices close to average cost, so there is no profit for an entrant to take.'),
    VD('Quality','incentive to improve','mix','Slack would invite entry. But with only normal profit there is less to spend on research.'),
    VD('Choice','may not change','mix','There may still be only one firm. It is the threat of entry that does the work.')
  ]},
  evaluation:'No market is perfectly contestable. The firm may also act to make entry harder over time, through heavy advertising or mergers.'};

function renderCard(){
  var c=cur().card, h='<div class="panel-head"><strong>'+c.head+'</strong></div><div class="card-list">';
  c.items.forEach(function(it){
    h+='<div class="ex"><h4>'+it.h+(it.tag?' <span class="chipv '+it.tag[1]+'">'+it.tag[0]+'</span>':'')+'</h4>';
    if(it.chips) h+='<div class="chips-v">'+it.chips.map(function(x){return Array.isArray(x) ? '<span class="chipv '+x[1]+'">'+x[0]+'</span>' : '<span class="chipv">'+x+'</span>';}).join('')+'</div>';
    (it.l||[]).forEach(function(r){ if(r[1]) h+='<p>'+(r[0]?'<b class="k">'+r[0]+'</b>':'')+r[1]+'</p>'; });
    h+='</div>';
  });
  panel.innerHTML=h+'</div>';
}

/* =====================================================================
   THEME 3: FIRMS, REVENUE, COSTS, PROFIT, EFFICIENCY, BARRIERS
   (MASTER handouts 1 to 8). Micro now has two labelled rows of tabs.
   ===================================================================== */
SECTIONS.micro.heading='Firms and markets';
SECTIONS.micro.scope='Theme 3: growth, objectives, revenue, costs, profit and market structures.';
SECTIONS.micro.groups=[
  ['Firms, revenue and costs',['growth','objectives','revenue','costs','scale','profits']],
  ['Market structures',['efficiency','perfect','monopoly','monopolistic','oligopoly','contestable','barriers']]
];
SECTIONS.micro.order=SECTIONS.micro.groups[0][1].concat(SECTIONS.micro.groups[1][1]);
/* revenue and sales maximisation move from Monopoly to the Objectives tab */
TOPICS.monopoly.groups=TOPICS.monopoly.groups.filter(function(gr){return gr[0]!=='Other objectives';});

TOPICS.growth={section:'micro',label:'Business growth',eyebrow:'Edexcel A · Theme 3 · 3.1 Business growth',first:'gr_horiz',groups:[
  ['The basics',['gr_types']],
  ['How firms grow',['gr_organic','gr_ext']],
  ['Integration',['gr_horiz','gr_fwd','gr_back','gr_cong']],
  ['Limits and demergers',['gr_limits','gr_demerge']],
  ['Apply',['gr_ex']]
]};
TOPICS.objectives={section:'micro',label:'Objectives',eyebrow:'Edexcel A · Theme 3 · 3.2 Business objectives',first:'ob_all',groups:[
  ['Why not profit?',['ob_why']],
  ['Maximising objectives',['ob_all','revmax','salesmax']],
  ['Satisficing and other aims',['ob_sat','ob_other']],
  ['Who wants what',['ob_types','ob_ex']]
]};
TOPICS.revenue={section:'micro',label:'Revenue',eyebrow:'Edexcel A · Theme 3 · 3.3.1 Revenue',first:'rv_armr',groups:[
  ['Price makers',['rv_armr','rv_ped','rv_tr']],
  ['Price takers',['rv_taker']],
  ['Work it out',['rv_calc']]
]};
TOPICS.costs={section:'micro',label:'Costs',eyebrow:'Edexcel A · Theme 3 · 3.3.2 Costs',first:'co_avg',groups:[
  ['The basics',['co_srlr']],
  ['Cost curves',['co_total','co_avg','co_mcac']],
  ['Why the curves bend',['co_dr']],
  ['Work it out',['co_calc']]
]};
TOPICS.scale={section:'micro',label:'Economies of scale',eyebrow:'Edexcel A · Theme 3 · 3.3.3 Economies and diseconomies of scale',first:'sc_lrac',groups:[
  ['The long-run curve',['sc_lrac','sc_env','sc_fall']],
  ['Internal',['sc_int','sc_dis']],
  ['External',['sc_ext','sc_extdis']],
  ['Apply and evaluate',['sc_ex','sc_eval']]
]};
TOPICS.profits={section:'micro',label:'Profit',eyebrow:'Edexcel A · Theme 3 · 3.3.4 Normal profits, supernormal profits and losses',first:'pf_types',groups:[
  ['What profit means',['pf_calc','pf_types']],
  ['Profit maximisation',['pf_max']],
  ['Economic losses and shutting down',['pf_stay','pf_shut']]
]};
TOPICS.efficiency={section:'micro',label:'Efficiency',eyebrow:'Edexcel A · Theme 3 · 3.4.1 Efficiency',first:'ef_prod',groups:[
  ['Static efficiency',['ef_prod','ef_alloc']],
  ['Dynamic efficiency',['ef_ppf','ef_dyn']],
  ['Slack',['ef_x']],
  ['Compare',['ef_table']]
]};
TOPICS.barriers={section:'micro',label:'Barriers to entry',eyebrow:'Edexcel A · Theme 3 · 3.4.7 Barriers to entry and exit',first:'br_eos',groups:[
  ['The barriers',['br_types','br_exit']],
  ['Using costs and prices',['br_eos','br_limit','br_pred']],
  ['Work it out',['br_calc']],
  ['Apply',['br_ex']]
]};

/* ------------------------- BUSINESS GROWTH (3.1) ------------------------- */
V.gr_types={terms:[["Public sector", "Organisations owned and run by the government, such as the NHS."], ["Private sector", "Firms owned by individuals or shareholders."], ["Not-for-profit", "An organisation that puts any surplus back into its aims, such as a charity."]], traps:["Not-for-profit does not mean making no money: any surplus goes back into the organisation’s aims instead of to owners."], kind:'card', btn:'Types of firm', showing:'Size, ownership and aims',
  title:'Types of firm',
  lead:'Firms differ in size, in who owns them and in what they are trying to achieve. Each difference changes how the firm behaves.',
  card:{head:'Four distinctions', items:[
    PT('Why some firms stay small',[['Small market','Niche products, such as custom trainers or a local barber, have too few customers to support a big firm.'],['Owner’s choice','Many owners want control and a manageable workload more than growth.'],['Finance','Small firms find it harder and dearer to borrow.'],['Personal service','Customers may value a small firm’s flexibility and personal touch.']]),
    PT('Why others grow',[['Economies of scale','Average costs fall as output rises.'],['Market power','A bigger share of the market gives more control over price.'],['Spreading risk','Selling more products in more markets means one failure does less damage.'],['Managers’ goals','Pay and status often rise with the size of the firm.']]),
    {h:'Ownership and control', l:[['','In a public limited company (plc) the owners are thousands of shareholders who do not run the firm. Managers run it for them. This divorce of ownership from control causes the principal–agent problem: the agents (managers) may chase their own goals, such as higher sales or a bigger firm, instead of the profit the principals (shareholders) want.']]},
    PT('Sector and aim',[['Private sector','Owned by individuals or shareholders. Most aim to make a profit.'],['Public sector','Owned and run by the government, such as the NHS. The aim is a public service, not profit.'],['Not-for-profit','Charities, and organisations such as the Wikimedia Foundation that runs Wikipedia. They can make a surplus, but it goes back into their aims instead of to owners.']])
  ]},
  tip:'If a question mentions a plc, think principal–agent problem straight away.'};

V.gr_organic={terms:[["Organic growth", "Growing from within: more output, new products or new markets, paid for from profit or borrowing."]], kind:'card', btn:'Organic growth', showing:'Growing from within',
  title:'Organic growth',
  lead:'Organic (internal) growth is when a firm expands using its own resources, usually by reinvesting its profit.',
  card:{head:'Growing from within', items:[
    PT('Methods',[['New products','Innovation and research and development. Apple added the Apple Watch and AirPods alongside the iPhone.'],['New markets','Selling abroad, or to new kinds of customer. Gymshark grew from a UK online store to selling around the world.'],['Changing the marketing mix','Changing the product or how it is promoted to reach new customers, such as sharing-size packs or a TikTok campaign.'],['New technology','Selling online and through apps reaches customers a shop never could.']]),
    PT('Advantages',[['Cheaper','Usually costs less than buying another firm.'],['Lower risk','The firm builds on what it already does well, and keeps its own culture and control.']]),
    PT('Disadvantages',[['Slow','It can take years, and owners may not want to wait.'],['Limited by demand','Growth stops if there are not enough customers for the new product or market.']])
  ]},
  tip:'Internal growth is mostly used by smaller firms: it is cheap, and they still have plenty of customers who have never bought from them.'};

V.gr_ext={terms:[["Merger", "Two firms agree to join into one."], ["Takeover", "One firm buys a controlling stake in another, whether or not it agrees."]], kind:'card', btn:'Mergers and takeovers', showing:'Growing by joining or buying',
  title:'Mergers and takeovers',
  lead:'External (inorganic) growth is when a firm grows by joining with, or buying, another firm.',
  card:{head:'Growing from outside', items:[
    {h:'Merger', l:[['','Two firms agree to join together as one new company, and the owners of both share control. Example: British Airways and Iberia joined to form IAG.']]},
    {h:'Takeover (acquisition)', l:[['','One firm buys more than 50% of another firm’s shares and takes control of it. A hostile takeover is one the target firm’s managers do not want. Example: Facebook (now Meta) bought Instagram and WhatsApp.']]},
    PT('Advantages',[['Fast','Much quicker than organic growth.'],['Market power','Fewer rivals and a bigger market share give more control over price.'],['New ideas and markets','The firm gains the other firm’s skills, products and customers.'],['Economies of scale','A bigger firm can cut its average costs.']]),
    PT('Disadvantages',[['Expensive','Buying a firm costs a lot, and a competition authority such as the CMA may block the deal.'],['Clash of cultures','The two firms may have different aims and ways of working.'],['Job losses','Jobs are duplicated, so some go: there is no need for two finance teams.'],['Consumers','Less competition can mean higher prices and less choice.']])
  ]},
  evaluation:'Many takeovers fail to deliver what they promise, because of culture clashes and diseconomies of scale. Large firms whose sales have stopped growing often buy firms in faster-growing markets, because external growth is the quickest way in.'};

V.gr_horiz={terms:[["Horizontal integration", "Joining a firm at the same stage of production in the same industry."]], traps:["Name the stage of production. Same stage: horizontal. One stage nearer the consumer: forward vertical. Nearer the raw materials: backward vertical. Unrelated: conglomerate."], kind:'chain', anim:true, btn:'Horizontal', showing:'Joining a rival at the same stage',
  title:'Horizontal integration',
  lead:'Two firms at the same stage of production, in the same market, join together. Here Nike takes over its rival, Adidas.',
  chain:[
    'Both firms make sportswear, so the takeover removes a competitor.',
    'The combined firm has a bigger market share and more power when negotiating and setting prices.',
    'It can cut average costs through economies of scale, for example by buying materials in bulk and sharing marketing.',
    'Consumers may face higher prices and less choice, which is why competition authorities look closely at these deals.'
  ],
  evaluation:'Taking over a rival is expensive, and changes after the takeover can cost staff and customer loyalty. Real example: Facebook bought Instagram, a rival photo-sharing app, and US regulators later took Meta to court arguing it had bought out its competition.',
  tip:'Same stage, same market: horizontal.'};

V.gr_fwd={terms:[["Forward vertical integration", "Joining a firm at a later stage of production, closer to the consumer."]], kind:'chain', anim:true, btn:'Forward vertical', showing:'Taking over a later stage',
  title:'Forward vertical integration',
  lead:'A firm takes over a business at a later stage of the supply chain, closer to the customer. Here Nike takes over JD Sports, a retailer.',
  chain:[
    'Nike now owns shops that sell its products, so it is guaranteed an outlet.',
    'It cuts out the middleman, so the retailer’s profit margin becomes Nike’s.',
    'It controls how its products are priced and displayed.',
    'It could also give rival brands less space in its shops.'
  ],
  evaluation:'Retailing is a different skill from making trainers, and spreading resources across both can hurt the core business. Real example: Apple sells through its own Apple Stores and website, so it controls how iPhones are sold.',
  tip:'Forward = towards the customer.'};

V.gr_back={terms:[["Backward vertical integration", "Joining a firm at an earlier stage of production, closer to the raw materials."]], kind:'chain', anim:true, btn:'Backward vertical', showing:'Taking over an earlier stage',
  title:'Backward vertical integration',
  lead:'A firm takes over a business at an earlier stage of the supply chain, such as a supplier of raw materials. Here Nike takes over a cotton producer.',
  chain:[
    'Nike now controls the supply of a key input, so it is guaranteed stock.',
    'It controls the quality of that input.',
    'It cuts out the supplier’s profit margin, so its costs fall.',
    'It could limit supplies to rivals, which makes it harder for them to compete.'
  ],
  evaluation:'Farming is a very different business, and Nike can no longer shop around for cheaper cotton. Real example: Microsoft, which makes the Xbox and runs Game Pass, bought Activision Blizzard, the maker of Call of Duty. Games are an input to Game Pass, so this was backward integration, and partly horizontal too, since Microsoft already made games. The CMA only approved it after Microsoft agreed to sell the cloud gaming rights to Ubisoft.',
  tip:'Backward = towards the raw materials.'};

V.gr_cong={terms:[["Conglomerate integration", "Joining a firm in an unrelated industry."]], kind:'chain', anim:true, btn:'Conglomerate', showing:'Joining a firm in another market',
  title:'Conglomerate integration',
  lead:'Firms in unrelated markets join together. Here Nike takes over Peloton, which makes exercise bikes.',
  chain:[
    'Nike now sells in a market it was not in before, so it spreads its risk: if trainer sales fall, bike sales may not.',
    'It gains new customers, and the other firm’s assets.',
    'It can learn from the experience and knowledge of the firm it has bought.',
    'There are few cost savings, because the two businesses do different things.'
  ],
  evaluation:'The buyer may not have the knowledge to run a business in a market it does not understand, and resources are spread more thinly. Real example: Facebook bought Oculus, the virtual reality headset maker, now sold as Meta Quest.',
  tip:'Unrelated market: conglomerate.'};

V.gr_limits={kind:'card', btn:'Constraints on growth', showing:'What stops firms growing',
  title:'Constraints on business growth',
  lead:'Even a firm that wants to grow may not be able to.',
  card:{head:'What holds firms back', items:[
    PT('Size of the market',[['','A niche or local market cannot support a large firm.']]),
    PT('Access to finance',[['','Banks may not lend to a small or risky firm, and selling shares means giving up some control.']]),
    PT('Owner objectives',[['','The owners may want to keep control, or keep the business manageable, rather than grow.']]),
    PT('Regulation',[['','Competition authorities can block mergers that would reduce competition. The CMA blocked the planned merger of Sainsbury’s and Asda.']]),
    PT('Diseconomies of scale',[['','A firm that grows too big can see its average costs rise.']])
  ]}};

V.gr_demerge={terms:[["Demerger", "Splitting one firm into separate businesses."]], traps:["The spec asks for the impact on <b>businesses, workers and consumers</b>: cover all three."], kind:'card', btn:'Demergers', showing:'When firms split up',
  title:'Demergers',
  lead:'A demerger is when a firm splits into two or more separate firms.',
  card:{head:'Splitting up', items:[
    PT('Why firms demerge',[['Focus','Concentrate on the main business, cutting costs and raising profit margins and returns to shareholders.'],['Diseconomies of scale','A smaller firm doing fewer things has lower management costs.'],['Raise money','Selling part of the business raises cash that can be returned to shareholders.'],['Competition authorities','Splitting up can head off an investigation into market power.']]),
    PT('Impact',[['Businesses','Higher returns in the long run, but the split itself costs money in the short run.'],['Workers','Jobs may go if the aim is to cut costs, but managers of the new firm get new opportunities.'],['Consumers','Prices depend on whether competition in the market increases.']]),
    {h:'Examples', l:[['','PayPal was split off from eBay so that each could focus on its own market. Unilever split its ice cream brands, such as Magnum and Ben & Jerry’s, into a separate company so the rest of the group could focus on beauty and household products.']]}
  ]}};

V.gr_ex={kind:'card', btn:'Real examples', showing:'Growth you can point to',
  title:'Real examples: business growth',
  lead:'Name the type of growth, then say what the firm gained and what it risked.',
  card:{head:'Where you can see it', items:[
    EX('Gymshark: organic growth','It started small selling gym wear online, and grew mainly through social media and fitness influencers, reinvesting its profit as it went.','Organic growth is slow and depends on demand. Gym wear is a crowded market, so customers can switch easily.','What happened','The catch'),
    EX('Meta: Instagram and WhatsApp (horizontal)','Facebook bought two fast-growing rival apps before they could become threats, keeping its users and its advertising revenue.','US regulators later took Meta to court, arguing the deals removed competition. Authorities now look much harder at tech takeovers.','What happened','The catch'),
    EX('Microsoft and Activision Blizzard (vertical)','The Xbox maker bought the publisher of Call of Duty to put more games on Game Pass.','The CMA only allowed it after Microsoft sold the cloud gaming rights to Ubisoft, to protect competition in cloud gaming.','What happened','The catch')
  ]}};

/* ------------------------- OBJECTIVES (3.2) ------------------------- */
V.ob_why={terms:[["Principal–agent problem", "Shareholders (principals) want maximum profit, but the managers they hire (agents) may chase their own goals, such as size or pay."], ["Divorce of ownership from control", "In large firms, the people who own the firm are not the people who run it."]], kind:'card', btn:'Why not profit max?', showing:'Two problems with the assumption',
  title:'Why firms may not profit maximise',
  lead:'The theory assumes firms produce where MC = MR. In practice many do not, for two main reasons.',
  card:{head:'Two problems', items:[
    {h:'Firms rarely operate on the margin', l:[['','MC and MR are hard to measure. A chain such as Halfords, with hundreds of stores, does not sell one more bike and check what happens to its total cost and revenue. Ceteris paribus never holds in the real world, which makes the effect of one extra unit even harder to isolate.']]},
    {h:'The principal–agent problem', l:[['','In large firms ownership is separated from control. The owners (principals) want profit, but the managers (agents) who run the firm may want other things: a higher salary, status or a bigger firm. This is most likely in a plc, where thousands of shareholders take little part in running the business.']]},
    {h:'It can be reduced', l:[['','Owners can link managers’ bonuses to profit or the share price, or monitor them more closely to cut the asymmetric information between them.']]}
  ]},
  tip:'Say why the assumption may fail, then evaluate: profit is still the long-run goal for most private firms.'};

V.ob_all={work:{"q": "A firm maximises profit at 40 units, where price is £30 and AC is £20. If it maximises revenue instead, it sells 60 units at £24, with AC of £21. By how much does supernormal profit change?", "steps": ["Profit maximisation: (£30 − £20) × 40 = <b>£400</b>.", "Revenue maximisation: (£24 − £21) × 60 = <b>£180</b>.", "Change = £180 − £400 = <b>−£220</b>."], "ans": "Supernormal profit falls by £220. Work out the profit at each output first, then subtract, and give a money change unless a percentage is asked for."}, traps:["On the diagram, output rises from profit max (MR = MC) to revenue max (MR = 0) to sales max (AR = AC). Price goes the other way.", "Examiners saw students subtract the wrong figures, or give a percentage when a money change was asked for."], kind:'mono', anim:true, two:true, btn:'All three objectives', showing:'Profit, revenue and sales max compared',
  title:'Three objectives on one diagram',
  lead:'Each objective picks a different point on the same diagram. Learn where each one sits, then how price and output compare.',
  plain:[
    ['<b class="k-mc">MR = MC</b>','Profit maximisation, at Q<sub>1</sub> and P<sub>1</sub>.'],
    ['<b class="k-mr">MR = 0</b>','Revenue maximisation, at Q<sub>2</sub> and P<sub>2</sub>. Output is higher and price lower.'],
    ['<b class="k-ac">AR = AC</b>','Sales maximisation, at Q<sub>3</sub> and P<sub>3</sub>. The highest output and lowest price the firm can manage without making an economic loss.']
  ],
  evaluation:'Moving from Q<sub>1</sub> to Q<sub>3</sub>, consumers get more output at a lower price, but the firm gives up profit. Which objective a firm follows depends on who controls it, and how closely the owners can watch the managers.',
  tip:'On the usual diagram, Q<sub>1</sub> &lt; Q<sub>2</sub> &lt; Q<sub>3</sub> and P<sub>1</sub> &gt; P<sub>2</sub> &gt; P<sub>3</sub>. Every price is read off AR.'};

V.ob_sat={terms:[["Satisficing", "Aiming for a satisfactory profit instead of the maximum, so that other goals can be met."]], kind:'sat', anim:true, btn:'Minimum profit constraint', showing:'Satisficing: more output than profit max, less than sales max',
  title:'Satisficing: the minimum profit constraint',
  lead:'Managers cannot ignore profit altogether, or the shareholders would replace them. So they chase their own objective only as far as a minimum level of profit allows.',
  chain:[
    'The curve shows supernormal profit at each level of output. It is highest at Q<sub>PM</sub>, where MR = MC.',
    'A manager who wants to maximise sales volume would like to produce at Q<sub>VM</sub>, where AR = AC and supernormal profit falls to zero.',
    'Shareholders need a minimum level of profit to keep them satisfied: the horizontal line.',
    'So the manager can only expand to Q<sub>VM*</sub>, where profit falls to that minimum. Output is above the profit-maximising level but below the sales-maximising level.'
  ],
  evaluation:'This is satisficing: making enough profit to keep the owners happy, rather than as much as possible. In the real world a compromise between stakeholders is far more likely than maximising any one thing. Firms also decide with limited information (bounded rationality), so a satisfactory result may be the best they can realistically aim for.',
  tip:'Q<sub>VM*</sub> is where the profit curve falls to the constraint, to the right of Q<sub>PM</sub>.'};

V.ob_other={kind:'card', btn:'Other objectives', showing:'Growth, utility, survival, CSR',
  title:'Other objectives',
  lead:'Profit, revenue and sales are not the only things firms aim for.',
  card:{head:'Beyond profit', items:[
    PT('Growth maximisation',[['Why','Managers may see better career prospects and status in running a big firm, and a bigger firm has more market power and more control over its price.'],['Output','There is no rule. The firm expands as fast as it can, organically or by taking over other firms, and may borrow to do it.'],['Limit','Organic growth takes time, and external growth is costly and can bring diseconomies of scale.']]),
    PT('Utility maximisation',[['Why','The owner runs the firm for the satisfaction it gives rather than the profit. Many football club owners spend more on players than the club earns.'],['Limit','It conflicts with profit maximisation in both the short run and the long run.']]),
    PT('Survival',[['Why','When times are hard, or a firm is new, the aim is just to cover variable costs and avoid shutting down. Airlines in the Covid lockdowns were not maximising anything; they were trying to survive.']]),
    PT('Corporate social responsibility (CSR)',[['Why','Firms give up some profit to do good: cutting emissions, paying suppliers fairly, supporting the community.'],['But','It can raise profit in the end, because customers think better of the firm.']])
  ]},
  evaluation:'These objectives can still lead to profit in the long run. Sales maximisation can build market share and economies of scale, and make demand more inelastic as rivals are pushed out. Revenue maximisation can help a firm raise the finance it needs for investment, which lowers costs or improves the product later.'};

V.ob_types={kind:'card', btn:'By type of firm', showing:'Who owns it decides what it aims for',
  title:'Which objective, by type of firm',
  lead:'Who owns a firm, and whether it is run for profit, tells you which objective it is most likely to follow in the long run.',
  card:{head:'Long-term profit maximiser?', items:[
    VD('Public limited company (plc)','unlikely','mix','Private sector, run for profit. But ownership is separate from control, so managers are likely to follow other objectives even though the owners want profit. Profit satisficing is the most likely result.'),
    VD('Privately owned firm','most likely','yes','Private sector, run for profit. The owners usually run it themselves, so there is no principal–agent problem. The most likely type to profit maximise.'),
    VD('Public sector organisation','no','no','Not-for-profit and owned by the government. The aim is the best possible service to the public, not profit.'),
    VD('Voluntary organisation','no','no','Not-for-profit, such as a charity. The aim is usually to do as much good for its cause as possible (utility maximisation).')
  ]}};

V.ob_ex={kind:'card', btn:'Real examples', showing:'Objectives you can point to',
  title:'Real examples: business objectives',
  lead:'Name the objective, then explain why the firm chose it and what limits it.',
  card:{head:'Where you can see it', items:[
    EX('Uber and Deliveroo: growth first','For years both made losses while they spent heavily on cheap rides, discounts and marketing to win market share. The bet was that profit would come later.','Shareholders eventually pushed for profit, so both cut discounts and raised prices. Growth cannot replace profit for ever.','The objective','The limit'),
    EX('Patagonia: CSR','Its founder gave the company to a trust and a charity, so profit not needed to run the business goes to fighting climate change.','The firm still needs to make a profit to fund the cause, so profit still matters.','The objective','The limit'),
    EX('Football clubs: utility','Many owners run their clubs at a loss for the status and the thrill of winning, spending more on players than the club earns.','Spending rules now limit how much clubs can lose, so even owners who do not want profit cannot ignore it.','The objective','The limit'),
    EX('Wikipedia: not-for-profit','Run by the Wikimedia Foundation and funded by donations. The aim is free knowledge for everyone, so it carries no adverts.','It still needs a surplus to pay for servers and staff, which is why it asks for donations.','The objective','The limit')
  ]}};

/* ------------------------- REVENUE (3.3.1) ------------------------- */
V.rv_armr={terms:[["Average revenue (AR)", "Total revenue ÷ quantity, which is the price."], ["Marginal revenue (MR)", "The change in total revenue from selling one more unit."]], work:{"q": "At £10 a firm sells 5 units. To sell a 6th it must cut the price to £9. What is MR on the 6th unit?", "steps": ["TR at 5 units = £10 × 5 = £50.", "TR at 6 units = £9 × 6 = £54.", "MR = £54 − £50 = <b>£4</b>: well below the new price of £9, because the cut applies to every unit."], "ans": "£4. MR is below AR whenever the firm has to cut its price to sell more."}, traps:["MR keeps falling past zero. Beyond the output where MR = 0, total revenue <b>falls</b>.", "For a straight-line AR, MR starts at the same point on the price axis and is <b>twice as steep</b>."], kind:'rev', btn:'AR and MR', showing:'MR falls twice as steeply as AR',
  title:'Average and marginal revenue',
  lead:'Most firms are price makers: to sell more, they have to cut the price. So average revenue slopes down, and marginal revenue falls even faster.',
  plain:[
    ['<b>TR</b>','Total revenue = price × quantity.'],
    ['<b class="k-ar">AR</b>','Average revenue = total revenue ÷ quantity. That is just the price, so AR is the demand curve.'],
    ['<b class="k-mr">MR</b>','Marginal revenue: the change in total revenue from selling one more unit.']
  ],
  chain:[
    'To sell one more unit the firm has to lower its price, so AR slopes down.',
    'The lower price applies to every unit, not just the extra one. The firm gains the price of the extra unit but loses some revenue on all the units it was already selling.',
    'That is why MR is below AR and falls twice as steeply.',
    'MR reaches zero halfway along AR. Past that point, selling more makes total revenue fall.'
  ],
  tip:'Start AR and MR at the same point on the vertical axis. MR meets the output axis halfway to where AR would.'};

V.rv_ped={terms:[["Price elasticity of demand (PED)", "How much quantity demanded responds to a price change: % change in quantity ÷ % change in price."]], traps:["PED is not constant along a straight demand curve: elastic above the midpoint, 1 at it, inelastic below it."], kind:'rev', btn:'PED along AR', showing:'Elastic at the top, inelastic at the bottom',
  title:'Price elasticity of demand along AR',
  lead:'PED is not the same all the way along a straight demand curve. It falls as you move down the curve, and that decides whether MR is positive or negative.',
  chain:[
    'Near the top of AR, price is high and quantity low. A small percentage cut in price brings a large percentage rise in quantity, so demand is price elastic (PED > 1).',
    'In the elastic section, cutting the price raises total revenue, so MR is positive.',
    'At the midpoint demand is unit elastic (PED = 1). MR = 0 and total revenue is at its maximum.',
    'Below the midpoint demand is price inelastic (PED < 1). Cutting the price lowers total revenue, so MR is negative.'
  ],
  evaluation:'This is why a football club that adds seats can end up with less revenue. If demand for tickets is inelastic, it has to cut prices so far to fill the extra seats that total revenue falls.',
  tip:'A profit maximiser always produces on the elastic part of AR, because MR = MC needs MR to be positive.'};

V.rv_tr={traps:["Total revenue is highest where <b>MR = 0</b> and PED = 1, at the top of the TR hill."], kind:'rev', anim:true, two:true, btn:'Total revenue', showing:'TR is highest where MR = 0',
  title:'Total revenue: the TR hill',
  lead:'Total revenue rises while MR is positive, peaks where MR = 0, and falls once MR turns negative.',
  chain:[
    'Left diagram: as output rises from zero, MR is positive, so each extra unit adds to total revenue.',
    'Right diagram: TR therefore rises, but more and more slowly, because MR keeps falling.',
    'At Q<sub>1</sub>, MR = 0 and TR is at its peak. This is revenue maximisation, where PED = 1.',
    'Beyond Q<sub>1</sub>, MR is negative: each extra unit sold lowers TR, so the hill turns down.'
  ],
  tip:'MR is the slope of TR. Where TR is steepest MR is highest, and where TR is flat at the top MR is zero.'};

V.rv_taker={terms:[["Price taker", "A firm that must accept the market price, because it is too small to affect it."]], traps:["For a price taker, AR = MR = price: one horizontal line. TR is a straight line from the origin."], kind:'rev', btn:'Price taker', showing:'AR = MR, and TR is a straight line',
  title:'Revenue for a price taker',
  lead:'A firm in perfect competition can sell as much as it likes at the market price, so its revenue curves look completely different.',
  chain:[
    'The firm cannot change the price, so every unit sells for P<sub>1</sub>.',
    'Average revenue is P<sub>1</sub> at every output, and so is the revenue from one more unit: AR = MR, a horizontal line.',
    'Each extra unit adds the same amount to total revenue, so TR is a straight line from the origin.',
    'The slope of the TR line is the price. A higher price gives a steeper line.'
  ],
  tip:'Demand for the firm is perfectly elastic. Do not confuse it with the industry demand curve, which still slopes down.'};

V.rv_calc={kind:'revcalc', btn:'Revenue calculator', showing:'Type in the prices to recalculate',
  title:'Revenue calculator',
  lead:'Type in the price the firm can charge at each output. The table works out total, average and marginal revenue.',
  chain:[
    'TR = P × Q.',
    'AR = TR ÷ Q, which is always the price.',
    'MR = the change in TR when output rises by one unit.',
    'Total revenue is highest where MR reaches zero. After that, MR is negative and TR falls.'
  ],
  tip:'The first unit’s MR equals its TR, because total revenue at zero output is zero.'};

/* ------------------------- COSTS (3.3.2) ------------------------- */
V.co_srlr={terms:[["Fixed costs", "Costs that do not change with output in the short run, such as rent."], ["Variable costs", "Costs that rise with output, such as raw materials."], ["Short run", "The period when at least one factor of production is fixed."]], traps:["Say which cost has changed, then move the right curves. A fixed-cost change moves AFC and AC only; a variable-cost change moves MC, AVC and AC."], kind:'card', btn:'Fixed and variable', showing:'Short run and long run costs',
  title:'Fixed and variable costs',
  lead:'In the short run at least one factor of production, usually capital, is fixed. In the long run every factor can be changed, so every cost is variable.',
  card:{head:'Two kinds of cost', items:[
    {h:'Fixed costs', l:[['','Do not change with output, and have to be paid even if the firm produces nothing: rent, insurance, the salaries of permanent staff.']]},
    {h:'Variable costs', l:[['','Rise and fall with output: raw materials, packaging, delivery. Staff on zero-hours contracts are a variable cost too, because they are only paid for the hours the firm needs.']]},
    PT('Formulas',[['TC','Total cost = fixed costs + variable costs'],['ATC','Average total cost = total cost ÷ output'],['AFC','Average fixed cost = total fixed cost ÷ output'],['AVC','Average variable cost = total variable cost ÷ output'],['MC','Marginal cost: the change in total cost from producing one more unit']]),
    {h:'Short run vs long run', l:[['','In the long run a firm could end its lease, sell its machines or move to a bigger site, so all its costs become variable. The short run is not a set number of months: it lasts as long as it takes to change the fixed factor.']]}
  ]},
  tip:'For a coffee shop, the rent is fixed. The beans, milk and cups are variable.'};

V.co_total={terms:[["Total cost", "Total fixed cost + total variable cost."]], kind:'cost', btn:'Total costs', showing:'TC = TFC + TVC',
  title:'Total cost curves',
  lead:'Total cost is fixed cost plus variable cost. The two total curves run parallel, with fixed cost as the gap between them.',
  chain:[
    'TFC is a horizontal line: fixed costs are the same at every output, even zero.',
    'TVC starts at the origin, because variable costs are zero when nothing is produced.',
    'TVC rises slowly at first, then faster once diminishing returns set in.',
    'TC is TVC shifted up by TFC, so it starts on the vertical axis at the level of fixed costs.'
  ],
  tip:'The vertical gap between TC and TVC is TFC, and it is the same at every output.'};

V.co_avg={terms:[["Average total cost (ATC)", "Total cost ÷ output, which equals AFC + AVC."], ["Marginal cost (MC)", "The change in total cost from producing one more unit."]], work:{"q": "A firm has fixed costs of £200. Making 50 units costs £300 in variable costs. Find AFC, AVC and ATC.", "steps": ["AFC = £200 ÷ 50 = <b>£4</b>.", "AVC = £300 ÷ 50 = <b>£6</b>.", "ATC = AFC + AVC = <b>£10</b>, the same as total cost £500 ÷ 50."], "ans": "AFC £4, AVC £6, ATC £10."}, traps:["AFC falls all the time as output rises, because the same fixed cost is spread more thinly. That is why AVC and ATC get closer together."], kind:'cost', btn:'Average and marginal', showing:'ATC, AVC, AFC and MC',
  title:'Average and marginal cost curves',
  lead:'The four short-run curves. Get their shapes and crossing points right, and every firm diagram follows from them.',
  plain:[
    ['<b class="k-ac">ATC</b>','A U shape. It falls at first as fixed costs are spread over more units, then rises as diminishing returns set in.'],
    ['<b class="k-mr">AVC</b>','A smaller U below ATC. The gap between them is AFC.'],
    ['<b class="k-ar">AFC</b>','Falls all the way, as the same fixed cost is shared over more units. It never reaches zero.'],
    ['<b class="k-mc">MC</b>','A tick shape. It cuts AVC and then ATC at their lowest points.']
  ],
  tip:'ATC and AVC get closer together as output rises, because AFC keeps shrinking. They never touch.'};

V.co_mcac={traps:["MC cuts AVC and AC at their <b>lowest</b> points. Draw it that way every time."], kind:'cost', btn:'Why MC cuts AC', showing:'MC below AC: AC falls; above: AC rises',
  title:'Why MC cuts AC at its lowest point',
  lead:'This is maths, and examiners check it on every diagram: MC must cut AC at the lowest point of AC.',
  chain:[
    'If the next unit costs less than the average (MC below AC), making it pulls the average down. So while MC is below AC, AC falls.',
    'If the next unit costs more than the average (MC above AC), it pulls the average up. So while MC is above AC, AC rises.',
    'AC stops falling and starts rising exactly where MC crosses it, which is the lowest point of AC.',
    'The same logic means MC cuts AVC at the lowest point of AVC.'
  ],
  tip:'Think of test scores. If your next mark is below your average, your average falls, even if that mark beats your last one.'};

V.co_dr={terms:[["Diminishing marginal returns", "As more of a variable factor is added to a fixed factor, the extra output from each extra unit eventually falls."]], traps:["Diminishing returns is a <b>short-run</b> idea, because one factor is fixed. Diseconomies of scale are the long-run idea. Do not mix them up."], kind:'cost', btn:'Diminishing returns', showing:'MP and AP mirror MC and AVC',
  title:'Diminishing marginal returns',
  lead:'In the short run capital is fixed. Adding more and more workers to the same machines explains the shape of the short-run cost curves.',
  chain:[
    'At first, extra workers can specialise, so the marginal product (MP) of each extra worker rises.',
    'Eventually workers have to share the fixed capital. Each extra worker adds less than the one before: diminishing marginal returns. MP falls.',
    'Costs mirror this. While MP rises, each extra unit of output costs less, so MC falls. Once MP falls, MC rises.',
    'In the same way, AVC is lowest where the average product (AP) of labour is highest.'
  ],
  evaluation:'This is a short-run idea, because it depends on one factor being fixed. In the long run the firm can add capital too, so its costs are explained by economies and diseconomies of scale instead.',
  tip:'Diminishing returns explain why short-run AC rises. Do not call it diseconomies of scale, which is a long-run idea.'};

V.co_calc={kind:'costcalc', btn:'Cost calculator', showing:'Type in the costs to recalculate',
  title:'Cost calculator',
  lead:'Type in total fixed cost, total variable cost and output. The calculator works out the averages the way you would in a data question.',
  chain:[
    'Total cost = total fixed cost + total variable cost.',
    'Average total cost = total cost ÷ output.',
    'Average variable cost = total variable cost ÷ output.',
    'Average fixed cost = total fixed cost ÷ output. Check: AFC + AVC = ATC.'
  ],
  tip:'The starting numbers are Chelsea’s Electrics: rent of £10,000 a month and six staff on £18,000 a year are fixed; the products it buys in to sell are variable.'};

/* ------------------------- ECONOMIES OF SCALE (3.3.3) ------------------------- */
V.sc_lrac={terms:[["Economies of scale", "Falling long-run average cost as output rises."], ["Minimum efficient scale (MES)", "The lowest output at which long-run average cost reaches its minimum."], ["Diseconomies of scale", "Rising long-run average cost as output rises."]], traps:["Economies of scale are a <b>long-run</b> idea, with every factor variable. Do not explain them with diminishing returns."], kind:'lrac', btn:'LRAC', showing:'Economies, MES, diseconomies',
  title:'Economies and diseconomies of scale',
  lead:'In the long run a firm can change all its inputs and choose its scale. The long-run average cost curve (LRAC) shows the lowest average cost at each output.',
  chain:[
    'As the firm grows, internal economies of scale lower its average cost: LRAC falls.',
    'The minimum efficient scale (MES) is the lowest output at which average cost is at its minimum. Producing here is productively efficient.',
    'If the firm grows beyond this, it becomes harder to manage, and diseconomies of scale push average cost up: LRAC rises.',
    'Internal economies and diseconomies come from the firm’s own size, so they are movements along LRAC.'
  ],
  evaluation:'In many industries LRAC is flat for a long stretch after the MES, so firms of quite different sizes can have similar costs. Where the MES is a large share of the whole market there is only room for a few firms, which links economies of scale to market structure.',
  tip:'Economies of scale are a long-run idea. Short-run AC rises because of diminishing returns.'};

V.sc_env={traps:["LRAC is the envelope of the SRAC curves: each SRAC touches it once. It only touches an SRAC at that SRAC’s lowest point at the MES."], kind:'lrac', anim:true, two:true, btn:'SRAC and LRAC', showing:'British Airways adds more planes',
  title:'Short-run and long-run average cost',
  lead:'Each short-run average cost curve (SRAC) is for one fixed amount of capital. LRAC wraps around all of them: it is the lowest cost the firm can reach at each output once capital can change.',
  chain:[
    'British Airways is producing at Q<sub>1</sub> on SRAC<sub>1</sub>. With its current fleet, flying more passengers would bring diminishing returns.',
    'It buys more planes, which puts it on a new short-run curve, SRAC<sub>2</sub>.',
    'At first it cannot fill the new planes. Output only rises to Q<sub>2</sub>, and average cost rises from C<sub>1</sub> to C<sub>2</sub>.',
    'Once it makes full use of the new planes, at Q<sub>3</sub>, average cost falls to C<sub>3</sub>, below where it started.'
  ],
  evaluation:'If demand does not grow along with the fleet, the expansion backfires and the firm is left with higher costs. Adding capacity is a bet on future demand.',
  tip:'Each SRAC touches LRAC at one point only. LRAC is never above any SRAC.'};

V.sc_fall={kind:'lrac', btn:'Always falling', showing:'Economies of scale never run out',
  title:'A continuously falling LRAC',
  lead:'In some industries size really does matter: economies of scale keep coming and diseconomies never arrive, at least within the size of the market.',
  chain:[
    'Set-up costs are enormous, such as a national network of water pipes, and the cost of supplying one more unit is tiny.',
    'Every extra unit spreads those fixed costs more thinly, so LRAC keeps falling.',
    'The bigger the firm, the lower its costs, so one firm can supply the whole market more cheaply than two.',
    'This is a natural monopoly. Water, rail track, the electricity grid and broadband networks all fit.'
  ],
  evaluation:'Digital products work in a similar way. A streaming service pays a fortune to make a show, but one more subscriber costs it almost nothing, so its average cost per subscriber keeps falling as it grows. That is part of why a few giants dominate streaming.',
  tip:'Draw LRAC falling and flattening out, but never turning back up.'};

V.sc_int={terms:[["Internal economies of scale", "Cost savings from a firm’s own growth, such as bulk buying or specialist managers."]], traps:["Name the type (technical, purchasing, managerial, financial, marketing, risk-bearing) and explain <b>why</b> the cost per unit falls."], kind:'card', btn:'Internal economies', showing:'Six ways bigger means cheaper',
  title:'Internal economies of scale',
  lead:'Internal economies of scale lower a firm’s long-run average cost as the firm itself grows. Learn six.',
  card:{head:'Six internal economies of scale', items:[
    PT('Purchasing',[['','Buying in bulk lets the firm pay less for each unit, because it is a more important customer for its suppliers.'],['Example','McDonald’s buys beef, potatoes and packaging in quantities a burger van never could.']]),
    PT('Technical',[['','Expensive, efficient machinery is only worth buying if its cost can be spread over a large output.'],['Example','Amazon’s warehouses use robots to bring shelves to the staff who pack orders.']]),
    PT('Marketing',[['','Advertising costs do not rise in line with output, so the cost per unit sold falls.'],['Example','One global Nike campaign reaches millions of potential customers.']]),
    PT('Managerial',[['','A large firm can employ specialists, such as its own accountants, lawyers and data scientists.'],['Example','Big supermarkets employ specialist buyers for each type of product.']]),
    PT('Financial',[['','Large firms find it easier and cheaper to raise finance, through loans at lower interest rates or by selling shares.'],['Example','Banks lend to Tesco at a lower interest rate than to a corner shop.']]),
    PT('Risk-bearing',[['','A large firm can diversify, so if one product fails it has others to fall back on.'],['Example','Samsung sells phones, TVs, fridges and computer chips.']])
  ]},
  tip:'Mnemonic: Really Fun Mums Try Making Pies (risk-bearing, financial, managerial, technical, marketing, purchasing).'};

V.sc_dis={kind:'card', btn:'Internal diseconomies', showing:'Why big can get expensive',
  title:'Internal diseconomies of scale',
  lead:'Internal diseconomies of scale raise long-run average cost once a firm grows too big. They are mostly about people and management. The examples are from British Airways.',
  card:{head:'When a firm grows too big', items:[
    PT('Co-ordination problems',[['','It is hard to keep track of everything in a huge firm and co-ordinate production.'],['Example','With check-in desks across the world, managers can lose sight of how well each one runs.']]),
    PT('Slow decisions',[['','Layers of management slow decisions down, so the firm is slower to respond to its market.'],['Example','When a route becomes popular, it can take a long time for the right managers to find out, meet and add flights.']]),
    PT('Communication',[['','Messages pass through more people, so they arrive late or get changed on the way.'],['Example','Instructions from head office reach staff late or garbled, leading to mistakes.']]),
    PT('Worker motivation',[['','Workers feel like a small part of a big organisation and become less productive. Disputes take longer to resolve.'],['Example','Cabin crew who hear about job cuts, with no way to reach senior managers, go through their unions instead, which creates conflict.']])
  ]},
  evaluation:'Firms try to avoid diseconomies by splitting into smaller units, cutting layers of management, or demerging parts of the business.'};

V.sc_ext={terms:[["External economies of scale", "Cost savings from the whole industry growing, such as skilled local workers or specialist suppliers nearby."]], traps:["External economies shift the whole LRAC <b>down</b>. Internal economies are a movement <b>along</b> it."], kind:'lrac', anim:true, shiftL:-14, btn:'External economies', showing:'The industry grows: LRAC shifts down',
  title:'External economies of scale',
  lead:'External economies lower a firm’s average cost because the whole industry grows, even if the firm itself stays the same size. LRAC shifts down.',
  chain:[
    'The industry grows, often clustered in one area.',
    'A pool of skilled labour builds up, as local universities and colleges train people for the industry, so firms spend less on training.',
    'Specialist suppliers set up nearby, and the government improves the infrastructure the industry relies on.',
    'Costs fall at every level of output, so LRAC shifts down from LRAC<sub>1</sub> to LRAC<sub>2</sub>.'
  ],
  evaluation:'Games studios cluster in places such as Leamington Spa and Dundee. Universities there run games courses, so studios can hire skilled developers, and specialist firms for motion capture, testing and voice acting set up nearby.',
  tip:'Internal economies: a movement along LRAC. External economies: a shift of the whole curve.'};

V.sc_extdis={terms:[["External diseconomies of scale", "Rising costs from the whole industry growing, such as congestion or higher local wages."]], kind:'lrac', anim:true, shiftL:14, btn:'External diseconomies', showing:'The industry grows too much: LRAC shifts up',
  title:'External diseconomies of scale',
  lead:'If an industry grows too much, its firms compete for the same scarce resources and every firm’s costs rise. LRAC shifts up.',
  chain:[
    'More firms compete for the same skilled workers, so wages are bid up.',
    'Land and office rents rise in the popular area.',
    'Roads, airports and other infrastructure become congested.',
    'Costs rise at every level of output, so LRAC shifts up from LRAC<sub>1</sub> to LRAC<sub>2</sub>.'
  ],
  evaluation:'Airlines compete for landing slots at busy airports such as Heathrow, which pushes up the price of a slot, and for scarce pilots and engineers.'};

V.sc_ex={kind:'card', btn:'Real examples', showing:'Economies of scale you can point to',
  title:'Real examples: economies of scale',
  lead:'Name the economy of scale, then say what might limit it.',
  card:{head:'Where you can see it', items:[
    EX('Netflix and Spotify','A show or a music licence costs the same whether a few people use it or many millions. Each extra subscriber costs almost nothing, so average cost falls as they grow.','Rivals bid up the price of shows and artists, which eats into the saving.','Why it is scale','The catch'),
    EX('Tesla Gigafactories','Huge factories make batteries and cars on a scale that lowers the cost of each one: technical economies.','They take enormous investment, and costs only fall if demand fills them. That is the SRAC story.','Why it is scale','The catch'),
    EX('Amazon','Bulk buying, robot warehouses and its own delivery network make each parcel cheaper to handle as volumes grow.','A firm this big is hard to manage, and disputes with warehouse workers are a sign of diseconomies.','Why it is scale','The catch')
  ]}};

V.sc_eval={kind:'card', btn:'Evaluation', showing:'How much do they matter?',
  title:'Evaluating economies of scale',
  lead:'Economies of scale let a firm cut costs and raise profit, but how much they matter depends on the firm and its market.',
  card:{head:'It depends on', items:[
    PT('The industry',[['Size and nature','Where fixed costs are huge, as in medicines or cars, scale is vital. For a hairdresser it hardly matters.'],['PED','A firm facing inelastic demand may make more profit by restricting output and keeping its price high.']]),
    PT('The firm',[['Distance from the MES','A firm already at or near the MES gains little from growing, and risks diseconomies.'],['Diseconomies of scale','Co-ordination and motivation problems can wipe out the gains.'],['X-inefficiency','A big firm with little competition may let its costs drift up through slack.']]),
    PT('The limits',[['One supplier','If there is only one place to buy supplies, size gives no bargaining power.'],['Global advertising','Language and culture differences mean campaigns have to be adapted, and targeted online ads have cut advertising costs for small firms too.']])
  ]}};

/* ------------------------- PROFIT (3.3.4) ------------------------- */
V.pf_calc={terms:[["Accounting profit", "Revenue minus explicit costs."], ["Economic profit", "Revenue minus explicit costs and the opportunity cost of the owner’s time and money."]], kind:'pcalc', btn:'Accounting vs economic', showing:'Type in the numbers to recalculate',
  title:'Accounting profit and economic profit',
  lead:'Economists count the opportunity cost of what the owner gives up. Accountants do not. The same business can make a profit for one and a loss for the other.',
  chain:[
    'Profit = total revenue − total cost. Profit per unit = average revenue − average cost.',
    'Accounting profit only takes off the costs the firm actually pays.',
    'Economic profit also takes off the opportunity cost: what the owner could have earned in the next best alternative.',
    'Normal profit is when economic profit is zero (AR = AC, counting opportunity cost). The owner earns just enough to stay rather than leave.'
  ],
  evaluation:'Supernormal profit is economic profit above zero. It signals to other firms that the industry is worth entering.',
  tip:'Tobi would give up a £30,000 data science job to run a DJ business. She needs £49,000 of revenue just to make normal profit.'};

V.pf_types={terms:[["Normal profit", "The minimum profit needed to keep resources in their current use: where AR = AC."], ["Supernormal profit", "Profit above normal profit: AR is above AC."], ["Economic loss", "AR is below AC: the firm earns less than normal profit."]], work:{"q": "At the profit-maximising output of 100 units, price is £12 and average cost is £9. What is supernormal profit?", "steps": ["Profit per unit = AR − AC = £12 − £9 = £3.", "Supernormal profit = £3 × 100 = <b>£300</b>."], "ans": "£300: the box from AC up to the price, across to the output."}, traps:["Read profit at the output where <b>MR = MC</b>. Compare AR with AC at that output, not where AC is lowest."], kind:'profit', btn:'Supernormal, normal, economic loss', showing:'AR against AC at the chosen output',
  title:'Supernormal profit, normal profit and economic losses',
  lead:'The firm chooses its output where MR = MC. Then compare average revenue with average cost at that output.',
  plain:[
    ['<b>AR &gt; AC</b>','Supernormal profit: more than enough to keep the firm in the industry. The shaded box is the profit.'],
    ['<b>AR = AC</b>','Normal profit: all costs are covered, including the opportunity cost. AR just touches AC.'],
    ['<b>AR &lt; AC</b>','An economic loss: average cost is above the price. The shaded box is the economic loss.']
  ],
  evaluation:'An economic loss in the short run does not mean the firm closes. It keeps producing as long as the price covers average variable cost, because its fixed costs have to be paid either way.',
  tip:'Read the profit or economic loss at the output where MR = MC, not where AR crosses AC.'};

V.pf_max={traps:["Profit is maximised where MR = MC <b>and</b> MC is rising, cutting MR from below."], kind:'profit', btn:'MR = MC', showing:'The biggest gap between TR and TC',
  title:'The profit-maximising rule: MR = MC',
  lead:'Profit is the gap between total revenue and total cost. It is biggest at the output where MR = MC. The firm here is a price taker, as in your handout.',
  chain:[
    'Left diagram: profit is the vertical gap between TR and TC. It is biggest at Q<sub>1</sub>.',
    'Right diagram: below Q<sub>1</sub>, MR &gt; MC. One more unit adds more to revenue than to cost, so producing more raises profit.',
    'Beyond Q<sub>1</sub>, MC &gt; MR. The last unit adds more to cost than to revenue, so cutting output raises profit.',
    'At Q<sub>1</sub>, MR = MC: profit cannot be raised by producing one unit more or one unit less.'
  ],
  evaluation:'This assumes firms know their marginal costs and revenues, and want as much profit as possible. In practice they rarely do either, which is why other objectives exist.',
  tip:'At Q<sub>1</sub>, TR and TC have the same slope. The slope of TR is MR and the slope of TC is MC.'};

V.pf_stay={terms:[["Short-run shut-down point", "The price equal to minimum AVC. Below it, the firm loses less by closing."]], work:{"q": "A firm sells at £8. Its AVC is £6 and its ATC is £10. Should it keep producing in the short run?", "steps": ["Price is below ATC, so it makes an economic loss of £2 on each unit.", "But price is above AVC, so each unit also covers £2 of fixed costs.", "If it shut, it would still pay all its fixed costs and lose more."], "ans": "Keep producing in the short run. If nothing changes, it leaves in the long run."}, traps:["Short run: stay open if price covers <b>AVC</b>. Long run: leave if price does not cover <b>ATC</b>."], kind:'profit', btn:'Loss but stay open', showing:'Price covers AVC: stay open for now',
  title:'Making an economic loss but staying open',
  lead:'If the price is below average total cost but above average variable cost, the firm makes an economic loss but should keep producing in the short run.',
  chain:[
    'At Q<sub>1</sub>, where MC = MR, the price P<sub>1</sub> is below ATC, so the firm makes an economic loss: the top box.',
    'But P<sub>1</sub> is above AVC. Each unit sold covers its variable cost and leaves something over.',
    'That surplus, the lower box, goes towards the fixed costs, which have to be paid whether the firm produces or not.',
    'Shutting down would lose all the fixed costs. Staying open loses less, so the firm stays open in the short run.'
  ],
  evaluation:'In the long run the firm can get out of its fixed costs, so if the price stays below ATC it leaves the industry.',
  tip:'Loss if it stays open: the top box. Loss if it shuts: both boxes together, which is all of its fixed cost.'};

V.pf_shut={terms:[["Long-run shut-down point", "The price equal to minimum ATC. Below it, the firm leaves the industry in the long run."]], kind:'profit', btn:'Shut-down points', showing:'Short run: lowest AVC; long run: lowest ATC',
  title:'Short-run and long-run shut-down points',
  lead:'How low can the price go before the firm stops producing? The answer is different in the short run and the long run.',
  chain:[
    'Short run: the firm has to pay its fixed costs anyway, so it only needs to cover variable costs. If the price falls below the lowest point of AVC it shuts down: the short-run shut-down point.',
    'Long run: every cost is variable, so the price has to cover average total cost. If it stays below the lowest point of ATC the firm leaves: the long-run shut-down point.',
    'Between the two prices, the firm makes a loss but carries on for now.',
    'Above the lowest point of ATC, it makes at least normal profit.'
  ],
  compare:{vs:'Where the price is',rows:[['Above min ATC','profit: stay'],['Between','loss: stay for now'],['Below min AVC','shut down now'],['Long run','needs P ≥ ATC']]},
  tip:'Both shut-down points are where MC cuts the curve, because MC passes through the lowest point of AVC and of ATC. Try it with numbers: <a href="#br_calc">Stay or leave? calculator</a>.'};

/* ------------------------- EFFICIENCY (3.4.1) ------------------------- */
V.ef_prod={terms:[["Productive efficiency", "Producing at the lowest point of average cost, where MC = AC."]], traps:["Productive efficiency is about the firm’s costs (lowest AC). Allocative efficiency is about producing what consumers value (P = MC)."], kind:'eff', btn:'Productive', showing:'Lowest point on AC',
  title:'Productive efficiency',
  lead:'A firm is productively efficient when it produces at the lowest point on its average cost curve: the most output from the fewest resources.',
  chain:[
    'Productive efficiency is at the lowest point of AC, at output Q*.',
    'MC cuts AC at exactly this point, so the condition is MC = AC.',
    'At any other output, each unit costs more to make than it needs to.',
    'In the long run it means producing at the lowest point of LRAC: the minimum efficient scale.'
  ],
  tip:'For the whole economy, productive efficiency means producing on the production possibility frontier.'};

V.ef_alloc={terms:[["Allocative efficiency", "Resources go to the goods consumers value most: price equals marginal cost (P = MC)."]], traps:["Examiners found many students unsure what allocative efficiency means. Learn the definition and the condition together: <b>P = MC</b>."], kind:'eff', btn:'Allocative', showing:'P = MC, and what happens either side',
  title:'Allocative efficiency: P = MC',
  lead:'Resources are allocated efficiently when the mix of goods produced matches what consumers want. The condition is price = marginal cost.',
  chain:[
    'The price shows how much consumers value the last unit. MC shows what it costs to make.',
    'At Q<sub>1</sub>, P &gt; MC: consumers value the last unit more than it costs. More resources should go to this good.',
    'At Q<sub>2</sub>, MC &gt; P: the last unit costs more than consumers value it. Too many resources are going to this good.',
    'Only at Q*, where P = MC, is the last unit valued at exactly what it costs. That is allocative efficiency.'
  ],
  tip:'Monopoly, oligopoly and monopolistic competition all produce where P &gt; MC, so they make too little.'};

V.ef_ppf={terms:[["Dynamic efficiency", "Lower costs and better products over time, through investment and innovation."]], kind:'eff', anim:true, btn:'On a PPF', showing:'Productive: on the frontier; dynamic: shifting it out',
  title:'Productive and dynamic efficiency on a PPF',
  lead:'For the whole economy, productive efficiency means being on the production possibility frontier. Dynamic efficiency shifts the frontier out over time.',
  chain:[
    'At A, inside the frontier, resources are wasted or unemployed: productively inefficient.',
    'At B, on the frontier, the economy produces the most it can from its resources: productively efficient. Any point on the frontier is.',
    'Investment in research and development brings new products and better ways of producing.',
    'The frontier shifts out from PPF<sub>1</sub> to PPF<sub>2</sub>. That is dynamic efficiency: more can now be made from the same resources.'
  ],
  tip:'Productive efficiency is about using today’s resources well. Dynamic efficiency is about improving over time.'};

V.ef_dyn={traps:["Dynamic efficiency needs <b>supernormal profit to invest</b> and a reason to innovate. Say which of the two the market structure gives."], kind:'eff', anim:true, shift:{dx:-6,dy:-12}, btn:'Dynamic', showing:'Research shifts costs down over time',
  title:'Dynamic efficiency',
  lead:'A firm is dynamically efficient when it invests enough in research and development to bring in new production techniques and new products over time.',
  chain:[
    'The firm uses supernormal profit to pay for research and development.',
    'New techniques, such as automation or better software, cut the cost of making each unit.',
    'MC and AC shift down from MC<sub>1</sub> and AC<sub>1</sub> to MC<sub>2</sub> and AC<sub>2</sub>.',
    'New and better products can also raise demand, so consumers gain from lower prices and better quality.'
  ],
  evaluation:'Many firms underinvest. Short-term thinking (inertia) means managers favour profit now, and firms may not train their workers for fear that rivals will poach them. Monopolies and oligopolies can afford research, but they only spend on it if competition, or the threat of it, pushes them to.',
  tip:'Static efficiency (productive and allocative) is at one moment in time. Dynamic efficiency is over time, and the two can conflict.'};

V.ef_x={terms:[["X-inefficiency", "Producing above the lowest possible AC because of organisational slack, often when competition is weak."]], traps:["X-inefficiency is a point <b>above</b> the AC curve, not a point on it."], kind:'eff', anim:true, btn:'X-inefficiency', showing:'Actual AC above attainable AC',
  title:'X-inefficiency',
  lead:'X-inefficiency occurs when actual average cost is greater than attainable average cost.',
  chain:[
    'The lower curve, AC (attainable), is the lowest average cost the firm could reach at each output.',
    'A firm with little competition is under no pressure to keep its costs down.',
    'Slack creeps in: too many staff, managers taking long lunches and large pay rises, and nobody checking for cheaper suppliers.',
    'Actual costs drift above what is attainable, so the firm operates on AC (actual), above the curve it could reach.'
  ],
  evaluation:'X-inefficiency is most likely in monopolies, in firms protected by regulation or subsidies, and in parts of the public sector. Competition, or the threat of it in a contestable market, is the cure, because a slack firm would be undercut. Even where economies of scale are large, X-inefficiency can outweigh them and leave costs undesirably high.'};

V.ef_table={kind:'card', btn:'By market structure', showing:'Which efficiencies each structure gets',
  title:'Efficiency in each market structure',
  lead:'A quick comparison of long-run outcomes, assuming firms profit maximise.',
  card:{head:'Structure by structure', items:[
    {h:'Perfect competition', chips:[['Productive: yes','yes'],['Allocative: yes','yes'],['X-efficient: yes','yes'],['Dynamic: no','no']], l:[['','Price ends at the lowest point of AC and equals MC. But there is no supernormal profit to spend on research, and any new idea is copied at once.']]},
    {h:'Monopolistic competition', chips:[['Productive: no','no'],['Allocative: no','no'],['X-efficient: likely','yes'],['Dynamic: limited','mix']], l:[['','The firm ends on the falling part of AC with spare capacity, and P &gt; MC. Competition keeps slack down, but normal profit leaves little for research.']]},
    {h:'Oligopoly', chips:[['Productive: no','no'],['Allocative: no','no'],['X-efficient: depends','mix'],['Dynamic: likely','yes']], l:[['','P &gt; MC, and output is not at the lowest point of AC. Supernormal profit and non-price competition encourage research and new products.']]},
    {h:'Monopoly', chips:[['Productive: no','no'],['Allocative: no','no'],['X-efficient: no','no'],['Dynamic: possible','mix']], l:[['','Output is restricted, P &gt; MC, and with no rivals slack creeps in. Supernormal profit can fund research, but nothing forces the firm to spend it.']]},
    {h:'Contestable market', chips:[['Productive: closer','yes'],['Allocative: closer','yes'],['X-efficient: yes','yes'],['Dynamic: debatable','mix']], l:[['','The threat of hit-and-run entry pushes the incumbent to price close to average cost and keep slack out.']]}
  ]},
  tip:'Static efficiency and dynamic efficiency often pull in opposite directions. That trade-off is your evaluation.'};

/* ------------------------- BARRIERS TO ENTRY ------------------------- */
V.br_types={terms:[["Barrier to entry", "Anything that makes it hard for a new firm to enter a market."]], traps:["Explain how each barrier works: why does it raise a newcomer’s costs or risk? A list of barriers earns little."], kind:'card', btn:'Barriers to entry', showing:'Seven barriers, with examples',
  title:'Barriers to entry',
  lead:'Barriers to entry are obstacles that stop new firms entering a market. How competitive a market is depends heavily on how easily new firms can get in.',
  card:{head:'Seven barriers', items:[
    PT('High start-up costs',[['','Expensive equipment or heavy research spending makes it hard for a newcomer to raise the finance, and risky if it fails.'],['Example','A factory for advanced computer chips costs billions, which is why so few firms make them.']]),
    PT('Legal barriers',[['','A patent makes it illegal for anyone else to copy an invention for a number of years. Licences work the same way in some industries.'],['Example','Drug firms patent new medicines, such as weight-loss jabs, so rivals cannot sell copies until the patent runs out.']]),
    PT('Economies of scale',[['','An incumbent producing on a large scale has much lower average costs than a newcomer starting small, so the newcomer cannot match its prices.'],['Example','Amazon’s delivery network gives it costs a new online shop cannot match.']]),
    PT('Brand loyalty',[['','Customers stick with brands they know, even if a newcomer is cheaper or better.'],['Example','Many iPhone users will not consider switching, partly because their photos, apps and messages are tied to Apple.']]),
    PT('Control of raw materials',[['','If one firm controls the supply of a key input, rivals cannot get hold of it.'],['Example','De Beers once controlled most of the world’s supply of diamonds.']]),
    PT('Limit pricing',[['','The incumbent sets a price low enough that a newcomer, with higher costs, would make an economic loss.']]),
    PT('Predatory pricing',[['','The incumbent cuts its price below average variable cost to drive a rival out. It is illegal, but hard to prove.']])
  ]},
  tip:'Limit pricing keeps firms out. Predatory pricing drives firms out.'};

V.br_exit={terms:[["Barrier to exit", "Anything that makes it costly to leave a market, such as sunk costs or long contracts."]], kind:'card', btn:'Barriers to exit', showing:'What stops firms leaving',
  title:'Barriers to exit',
  lead:'Barriers to exit are obstacles to leaving a market. They matter for entry too: a firm that cannot get out easily will think twice before coming in.',
  card:{head:'Why leaving is hard', items:[
    PT('Sunk costs',[['','Costs that cannot be recovered when a firm leaves, such as specialist equipment with no other use, or money spent on advertising.'],['Example','A firm that spends heavily launching a new energy drink cannot get that money back if the drink flops.']]),
    PT('Contracts',[['','A firm may be legally bound to supply a product, or to pay rent, for a set period, so it cannot leave straight away even when it is making a loss.'],['Example','A gym chain tied into long leases on its buildings.']])
  ]},
  evaluation:'Sunk costs are the link to contestability. If they are low, a firm can enter, take any supernormal profit and leave without losing much: hit-and-run entry. That threat alone can keep prices down.',
  tip:'Contestable markets has the diagram for hit-and-run entry.'};

V.br_eos={kind:'lrac', btn:'Economies of scale', showing:'The incumbent’s costs are far below a newcomer’s',
  title:'Economies of scale as a barrier to entry',
  lead:'Where economies of scale are large, a newcomer that starts small cannot compete on price with an incumbent that is already big.',
  chain:[
    'The incumbent produces a large output, Q<sub>I</sub>, at a low average cost, C<sub>I</sub>.',
    'A new firm starts small, at Q<sub>E</sub>, where average cost is much higher, at C<sub>E</sub>.',
    'At the market price P, the incumbent makes supernormal profit, but the newcomer would make an economic loss.',
    'To get its costs down, the newcomer would have to win a big share of the market straight away.'
  ],
  evaluation:'This barrier is strongest where the minimum efficient scale is a large share of the market. New technology can lower it: selling online let small firms reach customers without big shops.'};

V.br_limit={terms:[["Limit pricing", "Setting the price low enough that a new entrant, with higher costs, could not make a profit."]], traps:["Limit pricing sets the price at or just below the <b>entrant’s</b> AC. The incumbent still makes some profit."], kind:'lrac', anim:true, btn:'Limit pricing', showing:'Price cut to just below the newcomer’s cost',
  title:'Limit pricing',
  lead:'The incumbent deliberately sets a low price, limiting its own profit, so that a new firm with higher costs would make an economic loss if it entered.',
  chain:[
    'Without the threat of entry, the incumbent would charge P<sub>1</sub> and make large supernormal profit.',
    'A newcomer would start small, at Q<sub>E</sub>, with average cost C<sub>E</sub>. At P<sub>1</sub> it could make a profit, so it would come in.',
    'The incumbent cuts its price to P<sub>L</sub>, just below C<sub>E</sub>.',
    'The newcomer would now make an economic loss, so it stays out. The incumbent still covers its own lower costs and keeps some supernormal profit.'
  ],
  evaluation:'Limit pricing gives up some profit now to protect profit in the future. It only works if the incumbent really does have lower costs, and if newcomers believe the low price will last. Consumers gain from the lower price, but miss out on extra competition.',
  tip:'The limit price is below the newcomer’s average cost but above the incumbent’s.'};

V.br_pred={terms:[["Predatory pricing", "Pricing below cost to drive a rival out, then raising prices again."]], traps:["Predatory pricing is <b>illegal</b> and loss-making in the short run. Limit pricing is legal and stays profitable."], kind:'pred', anim:true, two:true, btn:'Predatory pricing', showing:'Price below AVC until the rival leaves',
  title:'Predatory pricing',
  lead:'The incumbent sets a price below average variable cost, making a loss on purpose, to drive a rival out of the market. Then it raises the price again.',
  chain:[
    'At first both firms sell at P<sub>1</sub>.',
    'The incumbent cuts its price to P<sub>2</sub>, below average variable cost. Both firms now lose money on every unit, before even counting fixed costs.',
    'The rival has higher costs and smaller reserves. It cannot cover its variable costs, so it leaves straight away.',
    'With the rival gone, the incumbent raises its price to P<sub>3</sub>, above where it started, to win back its losses.'
  ],
  evaluation:'Predatory pricing is illegal anti-competitive behaviour, but hard to prove: a low price could just be fierce competition. It only works if the incumbent can survive the losses for longer than its rival, and if no new rival comes in once the price goes back up. The threat alone can deter entry, if newcomers believe it.'};

V.br_calc={kind:'stay', btn:'Stay or leave?', showing:'Type in the numbers to recalculate',
  title:'Stay or leave? Limit and predatory pricing in numbers',
  lead:'A firm faces a low price set by a rival. Should it keep producing? Compare its loss if it stays open with its loss if it shuts down.',
  chain:[
    'If it shuts down, it sells nothing but still pays its fixed costs. Its loss is its fixed costs.',
    'If it stays open, profit = TR − (fixed costs + variable costs) = (AR − ATC) × Q.',
    'Short run: stay open as long as the price covers AVC, because the loss is then smaller than the fixed costs.',
    'Long run: leave unless the price covers ATC. A price below the firm’s ATC is limit pricing; below its AVC it is predatory, and the firm should leave straight away.'
  ],
  tip:'Try the presets, then change the price and watch where the decision flips.'};

V.br_ex={kind:'card', btn:'Real examples', showing:'Barriers you can point to',
  title:'Real examples: barriers to entry',
  lead:'Name the barrier, then say how strong it is and what could weaken it.',
  card:{head:'Where you can see it', items:[
    EX('Weight-loss jabs: patents','The drug firms that invented the jabs patented them, so no one else can sell copies while the patents last. That protects large supernormal profit, which pays for the research.','Patents run out after a set time, and then cheaper copies can be sold. Rivals also race to invent their own versions.','The barrier','What weakens it'),
    EX('WhatsApp and TikTok: network effects','A messaging app is only useful if your friends use it, so a newcomer with better features still struggles: no one wants to switch first.','Network effects can flip fast once a rival catches on, as TikTok showed against Instagram and YouTube.','The barrier','What weakens it'),
    EX('Apple: brand and ecosystem','Photos, apps, iMessage and AirDrop tie users to Apple, and switching feels like a hassle. That loyalty is a barrier for rival phone makers.','EU rules now force Apple to open up parts of its system, such as allowing other app stores, which lowers the barrier.','The barrier','What weakens it'),
    EX('De Beers: raw materials','De Beers once controlled most of the world’s diamond supply, so rivals could not get stones to sell.','New mines in other countries, and now lab-grown diamonds, broke that control.','The barrier','What weakens it')
  ]}};

/* =====================================================================
   MACRO CONTENT (Theme 4, section 4.1)
   ===================================================================== */
TOPICS.global={section:'macro',label:'Globalisation',eyebrow:'Edexcel A · Theme 4 · 4.1.1 Globalisation',first:'gl_causes',groups:[
  ['What and why',['gl_causes']],
  ['Impact',['gl_dev','gl_ldc']],
  ['Apply',['gl_ex']]
]};
TOPICS.trade={section:'macro',label:'Trade',eyebrow:'Edexcel A · Theme 4 · 4.1.2 Specialisation and trade',first:'ca_comp',groups:[
  ['Advantage',['ca_abs','ca_comp']],
  ['Trading',['ca_gain','ca_tot']],
  ['Work it out',['ca_calc','tot_calc']],
  ['Apply and evaluate',['ca_ex','ca_limits']]
]};
TOPICS.protect={section:'macro',label:'Protectionism',eyebrow:'Edexcel A · Theme 4 · 4.1.6 Restrictions on free trade',first:'tf_tariff',groups:[
  ['Tariffs',['tf_free','tf_tariff','tf_areas']],
  ['Other restrictions',['qt','sb','pr_other']],
  ['Apply and evaluate',['pr_ex','pr_eval']]
]};
TOPICS.blocs={section:'macro',label:'Trading blocs',eyebrow:'Edexcel A · Theme 4 · 4.1.5 Trading blocs and the WTO',first:'bl_stages',groups:[
  ['Types of bloc',['bl_stages','bl_mu']],
  ['Customs unions',['bl_create','bl_divert']],
  ['Apply and evaluate',['bl_ex','bl_wto']]
]};
TOPICS.fx={section:'macro',label:'Exchange rates',eyebrow:'Edexcel A · Theme 4 · 4.1.8 Exchange rates',first:'fx_base',groups:[
  ['Floating rates',['fx_base','fx_dup','fx_sup']],
  ['Fixed and managed rates',['fx_fix_buy','fx_fix_sell','fx_sys']],
  ['Effects of a depreciation',['fx_adas','fx_j','fx_ml']],
  ['Apply',['fx_ex','fx_terms']]
]};
TOPICS.bop={section:'macro',label:'Balance of payments',eyebrow:'Edexcel A · Theme 4 · 4.1.7 Balance of payments',first:'bp_struct',groups:[
  ['The accounts',['bp_struct','bp_causes']],
  ['Why it matters',['bp_ad','bp_eval']],
  ['Apply and evaluate',['bp_ex','bp_fix']]
]};

/* ------------------------- GLOBALISATION ------------------------- */
V.gl_causes={terms:[["Globalisation", "The growing interconnection and interdependence of economies through trade, migration, capital flows and technology."], ["Multinational company (MNC)", "A firm that produces or sells in more than one country."], ["Trade liberalisation", "Cutting tariffs and other barriers to trade."]], traps:["A question on the <b>causes</b> of globalisation wants why it happened (trade liberalisation, transport, communication, politics), not its effects."], kind:'card', btn:'Causes', showing:'Four causes, each with a limit',
  title:'Why globalisation happened',
  lead:'Globalisation is the growing interconnection and interdependence of economies through trade, migration, financial flows and technology.',
  card:{head:'Four causes', items:[
    PT('Trade liberalisation',[['What','Tariffs have been cut, led by the WTO, and more countries have joined trading blocs. Imports are cheaper, so trade has grown.'],['But','Some of this has gone into reverse: US tariffs on Chinese goods, and Brexit.']]),
    PT('Cheaper transport',[['What','Container ships carry goods in standard boxes at very low cost per item, and air travel has become far cheaper.'],['But','Shipping delays and uncertainty have led some firms to bring production back home (reshoring).']]),
    PT('Cheaper communication',[['What','The internet lets people buy from anywhere and lets firms run operations across the world.'],['But','Many people in developing countries still have no reliable access.']]),
    PT('Political change',[['What','Economies that were closed opened up to world markets: China, and the countries of the former Soviet bloc.'],['But','Trade wars, such as the one between the US and China, pull the other way.']])
  ]},
  tip:'The result is more multinational companies (MNCs): firms that produce and sell in many countries.'};

V.gl_dev={terms:[["Deindustrialisation", "The long-run fall in manufacturing’s share of output and jobs."], ["Contagion", "A shock in one economy spreading to others through trade and financial links."]], traps:["Say who gains and who loses. Consumers gain a little each; particular workers and regions lose a lot."], kind:'card', btn:'Developed countries', showing:'Gains and costs for richer countries',
  title:'Impact on developed countries',
  lead:'The effects of globalisation depend on the kind of country. For a developed economy such as the UK:',
  card:{head:'Developed countries', items:[
    PT('Benefits',[['Exports','They sell high-value goods and services abroad, which supports jobs and the balance of payments.'],['Imports','Cheaper raw materials and consumer goods mean lower prices and more choice.'],['Labour','Migrants fill skills shortages, for example in health care.'],['Investment','Inward foreign direct investment creates jobs, as with Nissan’s car plant in Sunderland.']]),
    PT('Costs',[['Jobs','Manufacturing moves to where it is cheaper. This deindustrialisation leaves structural unemployment in some regions.'],['Contagion','Problems spread between linked economies, as the 2008 financial crisis did from the US.'],['Environment','Moving goods around the world creates emissions.']])
  ]},
  evaluation:'The gains are spread thinly across all consumers, while the losses fall heavily on particular regions and workers. That is why globalisation can raise national income and still be unpopular.'};

V.gl_ldc={terms:[["Prebisch–Singer hypothesis", "Primary goods’ prices rise more slowly than manufactured goods’ prices, so primary exporters’ terms of trade worsen over time."], ["Brain drain", "Skilled workers leaving for higher pay abroad."]], traps:["Developing countries are not all the same: the effects depend on what they export and how far they can diversify."], kind:'card', btn:'Developing countries', showing:'Gains and costs for poorer countries',
  title:'Impact on developing countries',
  lead:'Developing countries gain in different ways, and face a problem with what they export.',
  card:{head:'Developing countries', items:[
    PT('Benefits',[['Exports','More exports raise aggregate demand, incomes and jobs.'],['Capital','Investment by MNCs brings infrastructure and modern equipment, which raises productive capacity.'],['Skills','People working for MNCs learn new skills.'],['Tax','More jobs mean more tax revenue to spend on reducing poverty.']]),
    PT('Costs',[['Primary dependence','They specialise in primary goods, where they have comparative advantage. The Prebisch-Singer hypothesis says the prices of these rise more slowly than the prices of manufactured imports, so their terms of trade worsen.'],['Resources','Natural resources run down, and extraction causes negative externalities.'],['Brain drain','Skilled workers such as doctors and engineers leave for higher pay abroad.'],['MNCs','Firms may avoid tax and bring in their own skilled staff, so fewer benefits stay in the country.']])
  ]},
  evaluation:'The long-term answer is to diversify away from primary goods, which needs investment in education and training. Singapore is the usual example of a country that did this.'};

V.gl_ex={kind:'card', btn:'Real examples', showing:'Globalisation you can point to',
  title:'Real examples: globalisation',
  lead:'Application marks come from linking a real case to the theory. These three cover supply chains, trade and culture.',
  card:{head:'Where you can see it', items:[
    EX('Your phone','It is designed in one country, uses chips made in Taiwan, is assembled in China or India, and is sold worldwide. Cheap transport and communication make that chain possible.','That dependence is also a risk: a disruption in one country can hold up production everywhere.','What it shows','The catch'),
    EX('Shein and Temu','They send low-cost goods straight from factories in China to shoppers’ doors, using apps and cheap air freight. Consumers get low prices and huge choice.','There is an environmental cost, and domestic retailers lose sales. Governments have started tightening the rules on small imported parcels.','What it shows','The catch'),
    EX('The Premier League','Matches are watched all over the world, and the clubs have foreign owners, players and sponsors. Sport and entertainment are now global industries.','Money and talent concentrate in a few leagues and clubs.','What it shows','The catch')
  ]}};

/* ------------------------- TRADE ------------------------- */
V.ca_abs={terms:[["Absolute advantage", "Producing more of a good than another country with the same resources."], ["Specialisation", "Concentrating on a narrow range of goods."]], traps:["Absolute advantage alone does not explain trade. The gains come from <b>comparative</b> advantage, which compares opportunity costs."], kind:'ppc', ppc:'abs', btn:'Absolute advantage', showing:'One country is better at each good',
  title:'Absolute advantage',
  lead:'A country has an absolute advantage in a good when it can produce more of it than another country using the same resources.',
  chain:[
    'Using all its resources, the US can make 200 cars or 100 bananas. Ecuador can make 100 cars or 200 bananas.',
    'The US has the absolute advantage in cars, and Ecuador in bananas.',
    'If each country splits its resources evenly, the world gets 150 cars and 150 bananas.',
    'If each specialises, the world gets 200 cars and 200 bananas. By trading, both can consume 100 of each, which is outside both production possibility curves.'
  ],
  tip:'More output from the same resources: that is how trade helps with the basic economic problem.'};

V.ca_comp={terms:[["Comparative advantage", "Producing a good at a lower opportunity cost than another country."], ["Opportunity cost", "The next best alternative given up."]], work:{"q": "The UK can make 600 petrol or 600 clothes. Senegal can make 200 petrol or 400 clothes. Who has the comparative advantage in each good?", "steps": ["UK: 1 petrol costs 600 ÷ 600 = <b>1 clothes</b>. Senegal: 1 petrol costs 400 ÷ 200 = <b>2 clothes</b>.", "The UK gives up less to make petrol, so it has the comparative advantage in <b>petrol</b>.", "UK: 1 clothes costs 1 petrol. Senegal: 1 clothes costs 200 ÷ 400 = <b>0.5 petrol</b>.", "Senegal gives up less to make clothes, so it has the comparative advantage in <b>clothes</b>."], "ans": "The UK specialises in petrol and Senegal in clothes. Write both opportunity costs before saying who specialises in what."}, traps:["Compare <b>opportunity costs</b>, not outputs. A country can be worse at making everything and still have a comparative advantage.", "Opportunity cost = what you give up ÷ what you gain. Getting it upside down is the most common slip."], kind:'ppc', ppc:'comp', btn:'Comparative advantage', showing:'Compare opportunity costs, not outputs',
  title:'Comparative advantage',
  lead:'Even if one country is better at producing everything, both can still gain from trade. What matters is opportunity cost.',
  chain:[
    'The UK can make 600 petrol or 600 clothes, so 1 petrol costs it 1 clothes.',
    'Senegal can make 200 petrol or 400 clothes, so 1 petrol costs it 2 clothes.',
    'The UK gives up less to make petrol, so it has the comparative advantage in petrol.',
    'Senegal gives up only 0.5 petrol for each unit of clothes, against 1 for the UK, so Senegal has the comparative advantage in clothes.'
  ],
  tip:'The slope of each PPC is the opportunity cost. If the slopes differ, there are gains from trade.'};

V.ca_gain={terms:[["Trading rate", "The rate at which one good swaps for the other. It must lie between the two countries’ opportunity costs."], ["Trading possibility curve (TPC)", "What a country can consume by specialising and trading. It lies outside its PPC."]], traps:["The trading rate must lie <b>between</b> the two opportunity costs, or one country would be better off not trading."], kind:'ppc', ppc:'gain', anim:true, btn:'Gains from trade', showing:'Trading at 1 clothes = 0.75 petrol',
  title:'Gains from trade',
  lead:'Each country specialises in the good where it has the comparative advantage. They then trade at a rate between their two opportunity costs.',
  chain:[
    'The UK makes only petrol (600). Senegal makes only clothes (400).',
    'They agree to trade at 1 clothes = 0.75 petrol, which lies between Senegal’s cost of 0.5 and the UK’s cost of 1.',
    'The UK could now turn its 600 petrol into as many as 800 clothes. Its trading possibility curve (TPC) swings out beyond its PPC.',
    'Senegal could turn its 400 clothes into 300 petrol, up from 200. Both can now consume combinations that were impossible before.'
  ],
  tip:'The TPC starts from the good the country specialises in, and pivots outward.'};

V.ca_tot={traps:["A change in the terms of trade changes <b>how</b> the gains are shared, not whether both gain, as long as the rate stays between the two opportunity costs."], kind:'ppc', ppc:'tot', anim:true, btn:'Terms of trade shift', showing:'Now 1 clothes = 0.6 petrol',
  title:'When the terms of trade shift',
  lead:'The rate at which the two goods are exchanged is the terms of trade. It decides how the gains are shared.',
  chain:[
    'The rate changes to 1 clothes = 0.6 petrol: clothes are now worth less.',
    'The UK’s TPC swings further out. Its 600 petrol now buys up to 1,000 clothes.',
    'Senegal’s TPC swings in. Its 400 clothes now buy only 240 petrol.',
    'Senegal still gains, because 240 is more than the 200 it could make itself. It would accept any rate above 0.5.'
  ],
  evaluation:'Richer countries often have more bargaining power in trade negotiations, so the terms of trade tend to favour them.'};

V.ca_calc={kind:'cacalc', btn:'Opportunity cost calculator', showing:'Type in the numbers to recalculate',
  title:'Opportunity cost calculator',
  lead:'Type in the most each country can produce of each good. It works out the opportunity costs and who should specialise in what.',
  chain:[
    'Opportunity cost of one unit of a good = what you give up of the other good, divided by what you gain.',
    'The country with the lower opportunity cost has the comparative advantage in that good.',
    'If the opportunity costs are the same in both countries, there is nothing to gain from trade.'
  ],
  tip:'In the exam, write out both opportunity costs before you say who specialises in what.'};

V.tot_calc={terms:[["Terms of trade", "Index of export prices ÷ index of import prices × 100."], ["Improvement", "A rise in the terms of trade: each unit of exports pays for more imports."]], work:{"q": "Export prices rise from an index of 100 to 110. Import prices rise from 100 to 104. What happens to the terms of trade?", "steps": ["Terms of trade = 110 ÷ 104 × 100 = <b>105.8</b> (to 1 d.p.).", "They started at 100 ÷ 100 × 100 = 100, so they have risen by 5.8 points: an <b>improvement</b>.", "Each unit of exports now pays for more imports."], "ans": "An improvement, to 105.8. Whether it is good news depends on PED for exports: if demand is elastic, export revenue may fall."}, traps:["An improvement is not always good: dearer exports lose sales if demand for them is price elastic.", "The answer is an index number, not a percentage or an amount of money."], kind:'totcalc', btn:'Terms of trade calculator', showing:'Export prices against import prices',
  title:'Terms of trade',
  lead:'Terms of trade = index of export prices ÷ index of import prices × 100.',
  chain:[
    'A rise is called an improvement: a given volume of exports now pays for more imports.',
    'A fall is called a deterioration: the country has to export more to afford the same imports.'
  ],
  evaluation:'An improvement is not always good news. If export prices have risen and demand for exports is elastic, export revenue falls and the current account can get worse.'};

V.ca_ex={kind:'card', btn:'Real examples', showing:'Who specialises in what',
  title:'Real examples: specialisation',
  lead:'Countries specialise where they have plenty of the factors a product needs.',
  card:{head:'Where you can see it', items:[
    EX('Taiwan and computer chips','Taiwan’s TSMC makes most of the world’s most advanced chips, the kind inside phones, consoles and AI servers. Decades of specialising gave it skills and scale that nobody else has.','The world depends on one island, which is a risk if supply is disrupted. That is why the US and the EU are paying to build chip factories at home.','What it shows','The catch'),
    EX('Bangladesh and Vietnam: clothes','Plenty of low-cost labour gives them a comparative advantage in labour-intensive clothing, which is where much fast fashion is made.','Relying on one export leaves a country exposed, and wages and working conditions can be poor.','What it shows','The catch'),
    EX('The UK: games, music and finance','The UK’s advantage is in skilled services. Grand Theft Auto is developed by Rockstar North in Edinburgh, and UK music and banking sell worldwide.','Manufacturing shrank as production moved abroad, leaving structural unemployment in some regions.','What it shows','The catch')
  ]}};

V.ca_limits={traps:["These are your evaluation points for any question on specialisation and trade. Pick the one that fits the context instead of listing all five."], kind:'card', btn:'Limits of the theory', showing:'Why real trade does not follow the model exactly',
  title:'Limits of comparative advantage',
  lead:'The theory rests on assumptions that often do not hold.',
  card:{head:'Evaluation points', items:[
    PT('Why countries do not specialise as predicted',[['Exchange rates','A country that holds its currency down can export goods it has no comparative advantage in.'],['Protectionism','Tariffs can keep an inefficient domestic industry going.'],['Transport costs','It can be cheaper to buy from a nearby country than from the most efficient one.'],['Different products','The theory assumes identical goods. Real products differ, so costs are hard to compare.'],['Factor immobility','Workers and capital cannot switch industries instantly.']]),
    PT('Specialisation and trade overall',[['For','Higher world output, lower prices through economies of scale, more choice and better quality.'],['Against','Over-dependence on one export, structural unemployment as production moves, and faster use of non-renewable resources.']])
  ]}};

/* ------------------------- PROTECTIONISM ------------------------- */
V.tf_free={terms:[["World price", "The price at which the country can import as much as it wants."], ["Free trade", "Trade with no tariffs, quotas or other barriers."]], traps:["World supply is horizontal at the world price: the country is too small to move the world price."], kind:'trade', tr:'free', btn:'Free trade', showing:'Imports fill the gap at the world price',
  title:'Free trade',
  lead:'The country can import as much as it wants at the world price, so world supply is drawn as a horizontal line.',
  chain:[
    'Without trade, the market would settle where domestic supply meets domestic demand, at P<sub>0</sub>.',
    'With trade, the price is the world price, P<sub>1</sub>, which is lower.',
    'At P<sub>1</sub> domestic firms supply only Q<sub>1</sub>, but consumers want Q<sub>2</sub>.',
    'The gap between Q<sub>1</sub> and Q<sub>2</sub> is filled by imports.'
  ],
  tip:'World supply is perfectly elastic because foreign producers can meet any amount this country demands.'};

V.tf_tariff={terms:[["Tariff", "A tax on imports."], ["Protectionism", "Policies that shield domestic producers from foreign competition."]], traps:["Show the tariff as world supply moving <b>up</b> by the size of the tariff, and mark both changes: domestic supply rises (Q<sub>1</sub> to Q<sub>3</sub>) and demand falls (Q<sub>2</sub> to Q<sub>4</sub>)."], kind:'trade', tr:'tariff', anim:true, btn:'Tariff', showing:'A tariff raises the price of imports',
  title:'A tariff is imposed',
  lead:'A tariff is a tax on imports. It raises the price that imports sell for at home.',
  chain:[
    'The tariff shifts world supply up, so the price rises from P<sub>1</sub> to P<sub>2</sub>.',
    'Domestic firms expand along their supply curve, from Q<sub>1</sub> to Q<sub>3</sub>.',
    'Consumers buy less, contracting along the demand curve from Q<sub>2</sub> to Q<sub>4</sub>.',
    'Imports shrink from Q<sub>1</sub>Q<sub>2</sub> to Q<sub>3</sub>Q<sub>4</sub>.'
  ],
  compare:{vs:'After the tariff',rows:[['Price','↑ higher'],['Domestic output','↑ higher'],['Consumption','↓ lower'],['Imports','↓ lower']]},
  evaluation:'A tariff works poorly if demand for the import is inelastic, because people keep buying it, or if domestic firms cannot easily expand output.'};

V.tf_areas={work:{"q": "The world price is £10 and a £2 tariff is added. After the tariff, domestic firms supply 30 units and consumers buy 50. How much tariff revenue is raised?", "steps": ["Imports after the tariff = 50 − 30 = <b>20 units</b>.", "Revenue = tariff × imports = £2 × 20 = <b>£40</b>. That is area C."], "ans": "£40. Revenue is the tariff times the imports that remain, not times total consumption."}, traps:["Tariff revenue is the tariff × <b>remaining imports</b> (area C), not × total consumption.", "The deadweight losses are B and D: B from inefficient domestic production, D from lost consumption."], kind:'trade', tr:'areas', btn:'Who gains and loses', showing:'Four areas between the two prices',
  title:'Who gains and who loses',
  lead:'Label the four areas between the two prices. Consumers lose all of them, A + B + C + D, and each area ends up somewhere different.',
  plain:[
    ['<b>A</b>','Extra producer surplus for domestic firms.'],
    ['<b>C</b>','Tariff revenue for the government: the tariff times the imports that remain.'],
    ['<b>B</b>','Deadweight loss: output now made by less efficient domestic firms.'],
    ['<b>D</b>','Deadweight loss: consumption that no longer happens.']
  ],
  compare:{vs:'Winners and losers',rows:[['Consumers','lose'],['Domestic firms','gain'],['Government','gains'],['Foreign firms','lose']]},
  evaluation:'Tariffs invite retaliation, so exporters can lose their foreign markets. They are also regressive, because lower-income households spend a larger share of their income on goods.'};

V.qt={terms:[["Quota", "A physical limit on the quantity of a good that can be imported."]], traps:["With a quota, area C goes to the <b>foreign firms</b> still allowed in, who sell at the higher price. The government gets nothing."], kind:'trade', tr:'quota', anim:true, btn:'Quota', showing:'A limit on the quantity imported',
  title:'A quota',
  lead:'A quota is a physical limit on the quantity of a good that can be imported.',
  chain:[
    'Foreign firms can no longer supply unlimited amounts, so supply becomes S total: domestic supply plus the imports allowed in.',
    'The price rises from P<sub>1</sub> to P<sub>2</sub>, where S total meets demand.',
    'Domestic output rises from Q<sub>1</sub> to Q<sub>4</sub> and consumption falls from Q<sub>2</sub> to Q<sub>3</sub>. Imports are now Q<sub>4</sub> to Q<sub>3</sub>.',
    'Area C does not go to the government. It goes to the foreign firms still allowed in, who now sell at the higher price.'
  ],
  compare:{vs:'After the quota',rows:[['Price','↑ higher'],['Domestic output','↑ higher'],['Imports','↓ lower'],['Tax revenue','none']]},
  evaluation:'A quota gives certainty over the quantity of imports, but unlike a tariff it raises no revenue. Protected domestic firms may also become X-inefficient.'};

V.sb={terms:[["Domestic subsidy", "A payment per unit to domestic producers that lowers their costs."]], traps:["Under a subsidy consumers still pay the world price. It is the <b>domestic supply curve</b> that shifts, not world supply."], kind:'trade', tr:'subsidy', anim:true, btn:'Subsidy', showing:'A subsidy shifts domestic supply right',
  title:'A subsidy to domestic producers',
  lead:'The government pays domestic firms for each unit they make, which lowers their costs.',
  chain:[
    'Domestic supply shifts right, from S<sub>1</sub> to S<sub>2</sub>.',
    'The price stays at the world price, P<sub>1</sub>, so consumers pay no more than before.',
    'Domestic firms now supply Q<sub>3</sub> at that price, up from Q<sub>1</sub>, and imports fall to Q<sub>3</sub>Q<sub>2</sub>.',
    'The shaded box is the cost to the taxpayer: the subsidy per unit times Q<sub>3</sub>.'
  ],
  compare:{vs:'After the subsidy',rows:[['Price','= same'],['Domestic output','↑ higher'],['Imports','↓ lower'],['Government','pays']]},
  evaluation:'Consumers do not pay more, but taxpayers do, and that money has an opportunity cost. Firms may come to depend on the subsidy and stop trying to cut costs.'};

V.pr_other={terms:[["Non-tariff barrier", "Any restriction on trade other than a tariff, such as a quota, an embargo or a product standard."]], kind:'card', btn:'Non-tariff barriers', showing:'Other ways to restrict trade',
  title:'Other restrictions on trade',
  lead:'Not all protection is a tax or a limit on quantity.',
  card:{head:'Non-tariff barriers', items:[
    PT('Embargo',[['What','A ban on trade in certain goods or with a certain country.'],['Example','The UK stopped buying energy from Russia.']]),
    PT('Technical barriers',[['What','Product standards, labelling rules and paperwork that raise costs for foreign firms.'],['Example','The UK does not accept chlorine-washed chicken, which protects UK chicken farmers.']]),
    PT('Export subsidies',[['What','Payments that lower costs for domestic firms so they can sell more cheaply.'],['Example','Farm support under the EU’s Common Agricultural Policy.']]),
    PT('Capital controls',[['What','Limits on how much money can move into or out of a country.'],['Example','Iceland limited money leaving the country after its banks collapsed.']])
  ]},
  tip:'Developing countries find technical standards hardest to meet, so these barriers often hit them most.'};

V.pr_ex={kind:'card', btn:'Real examples', showing:'Protectionism in the news',
  title:'Real examples: protectionism',
  lead:'Protectionism has come back in recent years, so there is plenty to apply.',
  card:{head:'Where you can see it', items:[
    EX('US tariffs on Chinese goods','The US has put tariffs on a wide range of goods made in China. Products assembled there, including phones and games consoles, cost more to bring into the US, and China has put tariffs on US goods in return.','A trade war: exporters on both sides lose sales and consumers pay more.','What happened','What it shows'),
    EX('EU tariffs on Chinese electric cars','The EU added tariffs to electric cars made in China by firms such as BYD, arguing that Chinese state subsidies let them undercut European car makers.','The anti-dumping argument in action, at the cost of dearer electric cars for European buyers.','What happened','What it shows'),
    EX('Chlorinated chicken','The UK does not allow chicken washed in chlorine, which is common in the US.','A technical barrier: a food standard that also shields UK farmers from cheaper imports.','What happened','What it shows')
  ]}};

V.pr_eval={traps:["Evaluate with <b>PED for imports</b>, how fast domestic firms can expand, and the risk of retaliation. Then judge: does protection buy time, or prop up inefficiency?"], kind:'card', btn:'For and against', showing:'The case for and against protection',
  title:'Evaluating protectionism',
  lead:'Most arguments for protection are about buying time. Most arguments against are about efficiency and retaliation.',
  card:{head:'The arguments', items:[
    PT('For',[['Infant industries','New industries need shelter until they are big enough to gain economies of scale.'],['Declining industries','Protection slows the decline, giving workers time to retrain and avoiding structural unemployment.'],['Dumping','It stops foreign firms selling below cost to drive out domestic rivals.'],['Strategic industries','Food, steel and energy matter for national security.'],['Revenue','Tariffs raise money for the government.']]),
    PT('Against',[['Inefficiency','Areas B and D on the tariff diagram are lost. Protected firms face less competition and may become X-inefficient.'],['Retaliation','Other countries respond with their own tariffs, so exporters lose foreign markets.'],['Regressive','Lower-income households spend more of their income on goods, so they are hit hardest.'],['Cost-push inflation','Tariffs on imported inputs raise costs for domestic firms, which can hurt their exports.']])
  ]},
  evaluation:'How well protection works depends on the price elasticity of demand for imports, how easily domestic firms can expand, and the size of the country: a large economy is less likely to face retaliation.'};

/* ------------------------- TRADING BLOCS ------------------------- */
V.bl_stages={terms:[["Free trade area", "Members remove trade barriers between themselves but keep their own tariffs on outsiders."], ["Customs union", "A free trade area plus a common external tariff."], ["Common external tariff", "The same tariff charged by every member on goods from outside."]], traps:["The difference between a free trade area and a customs union is the <b>common external tariff</b>. Say so in so many words."], kind:'card', btn:'Stages of integration', showing:'Each stage adds one more feature',
  title:'Stages of economic integration',
  lead:'Economic integration is an agreement between countries to remove barriers to trade, and at later stages to the movement of workers and capital.',
  card:{head:'From least to most integrated', items:[
    {h:'Free trade area', chips:['No trade barriers'], l:[['','Members remove barriers between themselves, but each keeps its own tariffs on outsiders. Example: the US, Mexico and Canada.']]},
    {h:'Customs union', chips:['No trade barriers','Common external tariff'], l:[['','All members charge outsiders the same tariff. This stops goods entering through whichever member has the lowest tariff.']]},
    {h:'Single (common) market', chips:['No trade barriers','Common external tariff','Free movement of labour and capital'], l:[['','Common rules and standards as well. Example: the EU single market.']]},
    {h:'Monetary union', chips:['All of the above','One currency'], l:[['','Example: the Eurozone, with one interest rate set by the European Central Bank.']]},
    {h:'Economic union', chips:['All of the above','Common fiscal policy'], l:[['','A central body has some power over taxes and spending.']]}
  ]},
  tip:'Each stage keeps everything from the stage before and adds one thing. Learn the one thing each adds.'};

V.bl_mu={terms:[["Monetary union", "Members share one currency and one central bank, so one interest rate."], ["Optimal currency area", "A group of economies similar enough that one interest rate suits them all."]], traps:["The big cost is losing your own interest rate and exchange rate. Link it to a member in recession that cannot devalue."], kind:'card', btn:'Monetary union', showing:'One currency, one interest rate',
  title:'Monetary union: the Eurozone',
  lead:'Members share a currency and a central bank. That removes some costs and one important tool.',
  card:{head:'The Eurozone', items:[
    PT('Benefits',[['No exchange costs','Firms and travellers do not pay to change money.'],['No exchange rate risk','Prices of imports and exports are stable, which encourages trade and investment.'],['Price transparency','Prices in different countries are easy to compare, which increases competition.']]),
    PT('Drawbacks',[['One interest rate','The rate set by the European Central Bank may suit some members and not others.'],['No depreciation','A member in recession cannot let its currency fall to boost exports. This was the problem for southern European countries in the Eurozone crisis.']]),
    PT('Conditions for success',[['Similar economies','Members’ booms and recessions need to happen together, so one interest rate fits all.'],['Flexible labour markets','Workers need to be able to move from high-unemployment regions to where the jobs are. Language differences make this hard.']])
  ]}};

V.bl_create={terms:[["Trade creation", "Joining a customs union replaces dearer domestic output with cheaper imports from members."]], traps:["The net gain is <b>B + D</b>: consumers gain A + B + C + D, but producers lose A and the government loses the tariff revenue C."], kind:'trade', tr:'create', anim:true, btn:'Trade creation', showing:'Removing the tariff lowers the price',
  title:'Trade creation',
  lead:'Joining a customs union removes the tariff on imports from other members, so the country can buy from more efficient producers.',
  chain:[
    'Before joining, imports carry a tariff and sell at P<sub>1</sub>.',
    'Inside the union the tariff goes, and the price falls to P<sub>2</sub>.',
    'Consumption rises from Q<sub>2</sub> to Q<sub>4</sub>, and less efficient domestic output falls from Q<sub>1</sub> to Q<sub>3</sub>.',
    'Consumers gain A + B + C + D. Producers lose A and the government loses the tariff revenue C, which leaves a net gain to society of B + D.'
  ],
  compare:{vs:'After joining',rows:[['Price','↓ lower'],['Consumers','gain'],['Domestic firms','lose'],['Net welfare','↑ B + D']]},
  tip:'It is the tariff diagram run backwards.'};

V.bl_divert={terms:[["Trade diversion", "Joining a customs union switches imports from the cheapest producer in the world to a dearer member."]], traps:["Trade diversion has a <b>loss</b>, area E, as well as the consumer gain. On this test the union is worth joining only if B + D is bigger than E."], kind:'trade', tr:'divert', anim:true, two:true, btn:'Trade diversion', showing:'Imports switch to a dearer producer',
  title:'Trade diversion',
  lead:'A customs union can also switch imports away from the cheapest producer in the world to a dearer one inside the union.',
  chain:[
    'Japan is the cheapest producer. Before the union, Japan and Germany face the same tariff, so the UK imports from Japan at P<sub>1</sub>.',
    'After joining, German goods are tariff-free while Japanese goods still pay the tariff. German goods at P<sub>2</sub> are now the cheapest to buy.',
    'The price to consumers falls from P<sub>1</sub> to P<sub>2</sub>, so consumers gain A + B + C + D.',
    'The government loses tariff revenue C + E. C passes to consumers, but E is a pure loss: the extra cost of buying from a less efficient producer.'
  ],
  compare:{vs:'After joining',rows:[['Price','↓ lower'],['Consumers','gain'],['Tariff revenue','↓ C + E'],['Net effect','B + D − E']]},
  evaluation:'On these grounds the union is only worth joining if B + D is larger than E. Over time, more competition inside the union may also cut costs and prices.'};

V.bl_ex={kind:'card', btn:'Real examples', showing:'Blocs in practice',
  title:'Real examples: trading blocs',
  lead:'One example for each kind of bloc you might be asked about.',
  card:{head:'Where you can see it', items:[
    EX('Brexit','The UK left the EU’s single market and customs union. Goods now face border checks and paperwork, free movement of workers ended, and the UK can sign its own trade deals.','Leaving a bloc reverses trade creation with its members, in exchange for control over trade policy.','What happened','What it shows'),
    EX('Greece and the euro','In the Eurozone crisis Greece could not let its currency fall or set its own interest rate to help it recover.','The main cost of a monetary union: one policy has to fit every member.','What happened','What it shows'),
    EX('The US, Mexico and Canada','Their free trade agreement, which replaced NAFTA, lets car parts cross the three borders without tariffs while each country keeps its own tariffs on everyone else.','A free trade area: no common external tariff.','What happened','What it shows')
  ]}};

V.bl_wto={terms:[["World Trade Organisation (WTO)", "The body that sets the rules for trade between its members, negotiates cuts in barriers and settles disputes."]], traps:["Trading blocs can <b>clash</b> with the WTO: a common external tariff treats non-members worse than members."], kind:'card', btn:'The WTO', showing:'Its role, and where blocs clash with it',
  title:'The World Trade Organisation',
  lead:'The WTO promotes free trade between its members.',
  card:{head:'The WTO', items:[
    PT('What it does',[['Negotiates','It organises rounds of talks to cut tariffs and other barriers.'],['Judges','It settles trade disputes. Members that break the rules can face sanctions.'],['Scope','It covers services and intellectual property as well as goods.']]),
    PT('Conflicts with trading blocs',[['Discrimination','A common external tariff treats non-members worse than members, which goes against the WTO’s aim of free trade for all.'],['Slow agreement','Any member can block a deal, so worldwide agreements are hard to reach. Countries turn to regional deals instead.'],['Fairness','Developed countries have more influence, and developing countries often feel they get a poor deal.']])
  ]},
  tip:'To show the effect of the WTO on a diagram, draw the tariff diagram with the tariff being removed.'};

/* ------------------------- EXCHANGE RATES ------------------------- */
V.fx_base={terms:[["Exchange rate", "The price of one currency in terms of another."], ["Floating exchange rate", "A rate set by supply and demand, with no target."]], traps:["Demand for £ comes from foreigners buying UK things; supply of £ comes from UK residents buying foreign things. Mix them up and every shift goes the wrong way."], kind:'fx', btn:'The market for pounds', showing:'Supply and demand set the exchange rate',
  title:'The market for pounds',
  lead:'An exchange rate is the price of one currency in terms of another. In a floating system it is set by supply and demand.',
  plain:[
    ['<b class="k-ar">Demand</b>','People need pounds to buy UK exports, invest in the UK or save in UK banks.'],
    ['<b class="k-mc">Supply</b>','People sell pounds to buy imports, invest abroad or move savings overseas.'],
    ['<b>e<sub>1</sub></b>','The equilibrium exchange rate, where the two meet.']
  ],
  tip:'Label the axes "Price of £ (in $)" and "Quantity of £". Do not write "price" and "quantity" alone.'};

V.fx_dup={terms:[["Appreciation", "A rise in a floating currency’s value caused by market forces."], ["Hot money", "Short-term money that moves between countries chasing the best interest rate."]], work:{"q": "£1 = $1.25 and a UK firm sells a game for £40. The pound appreciates to £1 = $1.40. What happens to the dollar price?", "steps": ["Before: £40 × 1.25 = <b>$50</b>.", "After: £40 × 1.40 = <b>$56</b>.", "The same game now costs Americans $6 more, so UK exports are less competitive."], "ans": "It rises from $50 to $56: an appreciation makes exports dearer abroad."}, traps:["After an appreciation, imports get <b>cheaper</b> and exports <b>dearer</b>. SPICED: Strong Pound, Imports Cheap, Exports Dear."], kind:'fx', anim:true, d1:24, btn:'Demand for £ rises', showing:'Appreciation: the pound rises',
  title:'Demand for pounds rises',
  lead:'Anything that makes foreigners want more pounds pushes the exchange rate up.',
  chain:[
    'Demand for pounds shifts right, from D<sub>1</sub> to D<sub>2</sub>.',
    'Causes: more UK exports sold, more foreign investment into the UK, or a rise in UK interest rates that attracts hot money.',
    'The exchange rate rises from e<sub>1</sub> to e<sub>2</sub>. This is an appreciation.',
    'Each pound now buys more foreign currency, so imports are cheaper and exports are dearer.'
  ],
  compare:{vs:'After the appreciation',rows:[['Exchange rate','↑ higher'],['Imports','cheaper'],['Exports','dearer'],['Holidays abroad','cheaper']]}};

V.fx_sup={terms:[["Depreciation", "A fall in a floating currency’s value caused by market forces."]], traps:["A depreciation makes exports cheaper and imports dearer. WPIDEC: Weak Pound, Imports Dear, Exports Cheap."], kind:'fx', anim:true, s1:24, btn:'Supply of £ rises', showing:'Depreciation: the pound falls',
  title:'Supply of pounds rises',
  lead:'Anything that makes people sell more pounds pushes the exchange rate down.',
  chain:[
    'Supply of pounds shifts right, from S<sub>1</sub> to S<sub>2</sub>.',
    'Causes: more imports bought, a cut in UK interest rates that sends hot money abroad, or speculators selling pounds because they expect a fall.',
    'The exchange rate falls from e<sub>1</sub> to e<sub>2</sub>. This is a depreciation.',
    'Exports become cheaper abroad and imports become dearer at home.'
  ],
  compare:{vs:'After the depreciation',rows:[['Exchange rate','↓ lower'],['Imports','dearer'],['Exports','cheaper'],['Holidays abroad','dearer']]}};

V.fx_fix_buy={terms:[["Fixed exchange rate", "A rate pegged to another currency and defended by the central bank."], ["Foreign currency reserves", "Foreign money and gold the central bank holds, and can use to buy its own currency."]], traps:["To hold its currency <b>up</b>, the central bank <b>buys</b> it (demand shifts right) or raises interest rates."], kind:'fx', anim:true, two:true, s1:24, d2:24, btn:'Defending a fixed rate', showing:'The central bank buys pounds to hold the rate',
  title:'Defending a fixed rate',
  lead:'In a fixed system the central bank commits to keeping the rate at e<sub>1</sub>, so it has to cancel out any pressure on it.',
  chain:[
    'Speculators sell pounds, shifting supply to S<sub>2</sub>. Left alone, the rate would fall to e<sub>2</sub>.',
    'The central bank buys pounds with its reserves of foreign currency, or raises interest rates to attract hot money.',
    'Demand for pounds shifts right to D<sub>2</sub>.',
    'The rate returns to e<sub>1</sub>.'
  ],
  evaluation:'Reserves run out, and high interest rates hurt the domestic economy. On Black Wednesday in 1992 the UK could not keep the pound inside the Exchange Rate Mechanism and had to let it fall.'};

V.fx_fix_sell={traps:["To keep its currency <b>down</b>, the central bank <b>sells</b> it (supply shifts right) or cuts interest rates."], kind:'fx', anim:true, two:true, cur:true, d1:24, s2:24, btn:'Keeping a currency weak', showing:'The central bank sells its own currency',
  title:'Keeping a currency weak',
  lead:'A country may want a low exchange rate to keep its exports cheap. China has done this with the yuan.',
  chain:[
    'Strong demand for the country’s exports shifts demand for its currency to D<sub>2</sub>. Left alone, the currency would appreciate to e<sub>2</sub>.',
    'The central bank sells its own currency and buys foreign currency, or cuts interest rates.',
    'Supply of the currency shifts right to S<sub>2</sub>.',
    'The rate returns to e<sub>1</sub>, and exports stay cheap.'
  ],
  evaluation:'Trading partners may see this as unfair and respond with tariffs, as the US has with China.'};

V.fx_sys={terms:[["Managed exchange rate", "The rate floats, but the central bank steps in when it moves too far."], ["Hedging", "Paying to lock in an exchange rate now, to avoid the risk of it moving later."]], kind:'card', btn:'Floating vs fixed', showing:'The case for each system',
  title:'Floating and fixed systems compared',
  lead:'A managed system sits between the two: the rate floats, but the central bank steps in when it moves too far.',
  card:{head:'Two systems', items:[
    PT('Floating: for',[['Shock absorber','If exports fall, the currency falls too, which makes exports cheaper again.'],['Free monetary policy','Interest rates can be set for inflation and growth, not to hit an exchange rate target.']]),
    PT('Floating: against',[['Uncertainty','Firms that trade cannot be sure what they will pay or receive, and insuring against it (hedging) costs money.'],['Easy way out','A country can rely on a weak currency to stay competitive and neglect productivity.']]),
    PT('Fixed: for',[['Certainty','Stable import and export prices encourage trade and investment, and firms do not need to hedge.'],['Discipline','Firms cannot rely on a falling currency, so they have to raise productivity to compete.']]),
    PT('Fixed: against',[['Reserves','The central bank needs large reserves of foreign currency to defend the rate.'],['Lost control','Interest rates have to be set to hold the rate, even in a recession.'],['Speculative attack','If traders think the rate cannot hold, they sell the currency and can force it down.']])
  ]}};

V.fx_adas={traps:["A depreciation shifts AD right <b>and</b> can shift SRAS left, because imported inputs cost more. Show both if the question is about inflation."], kind:'adas', anim:true, da:22, btn:'On the economy', showing:'Depreciation shifts AD right',
  title:'A depreciation and the economy',
  lead:'A weaker pound makes exports cheaper and imports dearer, so net exports rise.',
  chain:[
    'Net exports (X − M) are part of aggregate demand, so AD shifts right from AD<sub>1</sub> to AD<sub>2</sub>.',
    'Real GDP rises from Y<sub>1</sub> to Y<sub>2</sub>. Firms need more workers, so unemployment falls.',
    'The price level rises from P<sub>1</sub> to P<sub>2</sub>: demand-pull inflation.',
    'Dearer imported raw materials also push up firms’ costs, which adds cost-push inflation.'
  ],
  compare:{vs:'After a depreciation',rows:[['Growth','↑ higher'],['Unemployment','↓ lower'],['Inflation','↑ higher'],['Foreign investment','UK assets cheaper']]},
  evaluation:'How much output rises depends on spare capacity: close to full capacity, most of the effect is on prices. It also depends on the Marshall-Lerner condition and the J-curve.'};

V.fx_j={terms:[["J-curve", "The current account worsens straight after a depreciation, then improves as demand responds."]], traps:["Explain the dip with <b>inelastic short-run demand</b>: contracts, habits, time to notice. The J-curve and Marshall–Lerner go together."], kind:'jcurve', anim:true, btn:'J-curve', showing:'Worse first, then better',
  title:'The J-curve',
  lead:'After a depreciation the current account usually gets worse before it gets better.',
  chain:[
    'At X the currency depreciates. Imports cost more straight away.',
    'From X to Y the deficit widens. Buyers are tied into contracts, some imports are necessities, and it takes time to notice the price change, so quantities hardly move.',
    'At Y demand starts to respond. Foreign buyers switch to UK exports and UK buyers switch away from imports.',
    'From Y to Z the current account improves, and may move into surplus.'
  ],
  tip:'Short run: demand is inelastic, so Marshall-Lerner fails. Long run: demand is elastic, so it holds. That is why the curve is J-shaped.'};

V.fx_ml={terms:[["Marshall–Lerner condition", "A depreciation improves the current account only if PED for exports + PED for imports > 1."]], work:{"q": "PED for UK exports is 0.4 and PED for imports is 0.3. Will a depreciation improve the current account?", "steps": ["Add the elasticities, ignoring minus signs: 0.4 + 0.3 = <b>0.7</b>.", "0.7 is less than 1, so the condition <b>fails</b>.", "Quantities respond too little to make up for the price changes, so the current account gets worse."], "ans": "No, not at first: 0.7 < 1. Over time demand becomes more elastic, which is why the J-curve turns up."}, traps:["Use the elasticities <b>without minus signs</b> and add them: the test is whether the sum is above 1, not each one."], kind:'ml', btn:'Marshall-Lerner', showing:'Move the sliders to test the condition',
  title:'The Marshall-Lerner condition',
  lead:'A depreciation improves the current account only if the price elasticities of demand for exports and for imports add up to more than 1.',
  chain:[
    'Exports get cheaper. If demand for them is inelastic, sales barely rise and export revenue falls.',
    'Imports get dearer. If demand for them is inelastic, people keep buying and import spending rises.',
    'So with inelastic demand on both sides, the current account gets worse.',
    'PED<sub>X</sub> + PED<sub>M</sub> > 1 is the point where the changes in quantity outweigh the changes in price.'
  ],
  tip:'What matters is the value of exports and imports (price times quantity), not the volume alone.'};

V.fx_ex={kind:'card', btn:'Real examples', showing:'Currencies in the news',
  title:'Real examples: exchange rates',
  lead:'Each of these shows a different part of the topic.',
  card:{head:'Where you can see it', items:[
    EX('The pound after the Brexit vote','The pound fell sharply in 2016. Imported goods and holidays abroad became dearer, and firms such as Apple raised their UK prices.','A depreciation raises import prices and causes cost-push inflation.','What happened','What it shows'),
    EX('The 2022 mini-budget','Investors lost confidence in the UK government’s borrowing plans and sold pounds. The pound fell close to one US dollar.','Confidence and speculation shift the supply of a currency.','What happened','What it shows'),
    EX('The weak yen','A long fall in the yen made Japan a cheap place to visit and helped exporters such as Toyota and Nintendo, whose overseas earnings are worth more in yen.','There are winners and losers: exporters and tourists gain, while Japanese households pay more for imported food and energy.','What happened','What it shows')
  ]}};

V.fx_terms={kind:'card', btn:'Key terms', showing:'Four words that get mixed up',
  title:'Appreciation, depreciation, revaluation, devaluation',
  lead:'The pair you use depends on the exchange rate system.',
  card:{head:'Which word to use', items:[
    PT('Floating system',[['Appreciation','The currency rises in value because of market forces.'],['Depreciation','The currency falls in value because of market forces.']]),
    PT('Fixed system',[['Revaluation','The government or central bank officially raises the fixed rate.'],['Devaluation','The government or central bank officially lowers the fixed rate.']]),
    PT('Three systems',[['Floating','The rate is left to supply and demand.'],['Fixed','The rate is pegged to another currency and defended.'],['Managed','The rate floats, but the central bank steps in at times.']])
  ]},
  tip:'Using "devaluation" for a floating currency is a common slip. If the market did it, it is a depreciation.'};

/* ------------------------- BALANCE OF PAYMENTS ------------------------- */
V.bp_struct={kind:'card', btn:'Structure', showing:'Three accounts that balance',
  title:'The structure of the balance of payments',
  lead:'The balance of payments records every payment between the UK and the rest of the world. Money coming in is a credit; money going out is a debit.',
  terms:[
    ['Credit (+)','Money flowing into the country, such as when foreigners buy UK exports.'],
    ['Debit (−)','Money flowing out, such as when UK residents buy imports.'],
    ['Current account','Trade in goods and services, plus primary and secondary income.'],
    ['Balance of trade','Exports minus imports of goods and services.'],
    ['Current account deficit','More money leaves than comes in on the current account. A surplus is the reverse.']
  ],
  card:{head:'The accounts', items:[
    PT('Current account',[
      ['Trade in goods','Whisky sold to the US: credit. A Shein order: debit. The UK buys more goods than it sells, so this part is usually in deficit.'],
      ['Trade in services','A tourist spending in London: credit. A family holiday in Spain: debit, even though nothing physical crosses the border. The UK is strong in finance, education and creative industries, so this part is usually in surplus.'],
      ['Primary income','Income from owning assets or working abroad. Profits a UK firm brings home: credit. Dividends paid to foreign owners of UK firms: debit. So the more UK firms foreigners own, the more flows out here later.'],
      ['Secondary income','Transfers with nothing given back. UK foreign aid and money migrant workers send home: debits. Money sent to UK families by relatives abroad: credit.']]),
    PT('Financial account',[
      ['Direct investment','Buying or building a business abroad with a controlling stake (10% or more). A foreign carmaker building a UK factory is an inflow.'],
      ['Portfolio investment','Buying shares or bonds without control, such as a UK pension fund buying US shares: an outflow.'],
      ['Reserves','Foreign currency and gold, managed for the UK by the Bank of England.']]),
    PT('Capital account',[['','Small: for example, one government writing off another’s debt.']])
  ]},
  chain:[
    'A current account deficit means the UK spends more abroad than it earns.',
    'The gap is paid for by selling assets to foreigners or borrowing from abroad.',
    'That brings money in on the financial account, so a current account deficit is matched by a financial account surplus.',
    'Recorded figures never match exactly, so a balancing item, net errors and omissions, makes them add up.'
  ],
  work:{q:'Work out the balance of trade and the current account balance (made-up numbers, £bn).',
    table:[['','Credits','Debits','Net'],['Goods','350','470','−120'],['Services','330','200','+130'],['Primary income','150','180','−30'],['Secondary income','20','45','−25'],['Current account','','','−45']],
    steps:['Balance of trade = goods + services = −120 + 130 = <b>+£10bn</b>, a surplus.',
      'Current account = −120 + 130 − 30 − 25 = <b>−£45bn</b>, a deficit: income outflows outweigh the trade surplus.',
      'With GDP of £2,500bn, the deficit is 45 ÷ 2,500 = <b>1.8% of GDP</b>.',
      'If it then reaches 2.3% of GDP, it has widened by 0.5 <b>percentage points</b>, not 0.5%.']},
  traps:[
    'It is the <b>current account</b> that is in deficit or surplus. The balance of payments as a whole always balances.',
    'Primary income is <b>earned</b> (work, investment); secondary income is <b>given</b> (aid, money sent home).',
    'Buying a foreign firm goes on the <b>financial account</b>. The profits it later sends home go on the current account.',
    'A trade surplus can sit alongside a current account deficit, if income outflows are large enough.',
    'Compare deficits as a <b>% of GDP</b>, and give changes between percentages in <b>percentage points</b>.'
  ]};

V.bp_causes={kind:'card', btn:'Causes of a deficit', showing:'Why imports outrun exports',
  title:'Causes of a current account deficit',
  lead:'A deficit means more money is leaving on the current account than is coming in. Each cause either pushes imports up or holds exports down.',
  terms:[
    ['Competitiveness','How well a country’s goods sell against rivals’, on price and on quality.'],
    ['Deindustrialisation','The long-run fall in manufacturing’s share of output and jobs.']
  ],
  card:{head:'Causes', items:[
    PT('Demand side',[
      ['Strong growth','Incomes rise, so households buy more of everything, imports included. Imports grow faster than exports, so the deficit widens.'],
      ['Strong currency','An appreciation makes exports dearer abroad and imports cheaper at home, so exports fall and imports rise.'],
      ['Weak world economy','A recession abroad cuts incomes in the countries that buy UK exports, so exports fall.']]),
    PT('Supply side',[
      ['Low competitiveness','Higher inflation or slower productivity growth than rivals raises UK costs and prices, so exports lose on price and imports win.'],
      ['Deindustrialisation','Manufacturing has shrunk, so goods once made at home are now imported, widening the goods deficit.'],
      ['Non-price factors','Weak quality, design or reliability lose export sales whatever the price.']])
  ]},
  evaluation:'The cause decides how worried to be. A deficit from strong growth may shrink on its own when growth slows; one from low competitiveness lasts until productivity improves.',
  tip:'A surplus has the opposite causes: weak domestic demand, a weak currency, or highly competitive exports, as in Germany and China.',
  traps:[
    'Causes and effects are easy to swap. A strong currency <b>causes</b> a deficit; a falling currency is a likely <b>result</b> of one. Answer the one the question asks for.',
    '“Imports rise” is not a cause on its own. Say <b>why</b> they rise.'
  ]};

V.bp_ad={kind:'adas', anim:true, da:-22, btn:'Effect on AD', showing:'A larger deficit shifts AD left',
  title:'A deficit and aggregate demand',
  lead:'Imports are a withdrawal from the circular flow of income, so a growing current account deficit reduces aggregate demand.',
  chain:[
    'Exports fall or imports rise, so net exports (X − M) fall.',
    'AD shifts left from AD<sub>1</sub> to AD<sub>2</sub>.',
    'Real GDP falls from Y<sub>1</sub> to Y<sub>2</sub>. Firms need fewer workers, so unemployment rises.',
    'Tax revenue falls and spending on benefits rises, which worsens the government’s budget.'
  ],
  compare:{vs:'As the deficit grows',rows:[['Net exports','↓ lower'],['Growth','↓ lower'],['Unemployment','↑ higher'],['Inflation','↓ lower']]},
  terms:[
    ['Net exports (X − M)','Exports minus imports: the part of AD the current account feeds into.'],
    ['Withdrawal','Money that leaves the circular flow of income. Imports are one, with saving and taxes.']
  ],
  evaluation:'This is not the whole story. A deficit often appears because incomes are high and people are buying more imports, so it can go along with strong growth. AD only falls if exports fall or spending switches from UK goods to imports.',
  traps:[
    'Use the AD/AS diagram and show the <b>shift</b>, AD<sub>1</sub> to AD<sub>2</sub>, with the new price level and real GDP marked. A diagram that does not show the change earns little.',
    'Check the direction: a fall in net exports shifts AD <b>left</b>, so on its own it lowers inflation, not raises it.'
  ]};

V.bp_eval={kind:'card', btn:'Does it matter?', showing:'When to worry about a deficit',
  title:'Does a current account deficit matter?',
  lead:'It depends on its size, its cause and how it is paid for.',
  terms:[
    ['Capital flight','A rapid outflow of money when investors lose confidence in a country.'],
    ['Hot money','Short-term money chasing higher interest rates. It can leave as fast as it arrived.']
  ],
  card:{head:'It depends on', items:[
    PT('What to look at',[['Size','As a share of GDP. Above about 5% is a concern, because the country relies heavily on money coming in from abroad.'],['Cause','A deficit from weak competitiveness is a problem. One from high incomes or an ageing population is much less so.'],['Financing','Foreign investment that builds factories adds to productive capacity. Borrowing to pay for consumption does not.'],['Country','The US can attract capital easily. A developing country is more exposed to investors pulling out.']]),
    PT('Risks',[
      ['Capital flight','If investors lose confidence and pull money out, the currency falls sharply, so import prices and inflation jump.'],
      ['Debt','The deficit is paid for by borrowing abroad or selling assets, so interest and profits flow out in future.'],
      ['Foreign ownership','The more UK firms and property are owned abroad, the more future profits and rents leave the country.']]),
    PT('Reasons not to worry',[
      ['Self-correcting','With a floating rate, a deficit should weaken the currency. Exports get cheaper and imports dearer, so the deficit shrinks.'],
      ['Investment','The matching inflow on the financial account can build factories and raise productive capacity, which helps future exports.']])
  ]},
  evaluation:'Judgement: a small, temporary deficit financed by long-term investment is rarely a concern. A large, persistent one financed by short-term borrowing is, because that money can leave quickly.',
  traps:['Evaluation here means <b>size, cause, financing and time</b>, ending in a judgement. Setting one benefit against one cost is not evaluation.']};

V.bp_ex={kind:'card', btn:'Real examples', showing:'Which account does it go on?',
  title:'Real examples: balance of payments',
  lead:'Money leaving the UK is a debit. Money coming in is a credit.',
  card:{head:'Where you can see it', items:[
    EX('A Shein order, or a holiday in Spain','Money leaves the UK to pay for a good or a service from abroad.','Debits on the current account: an import of goods, and an import of services.','What happens','Where it goes'),
    EX('Overseas students, and UK games, music and TV','Fees paid by overseas students, and sales abroad of UK-made games, music and shows, bring money into the UK.','Credits on the current account: exports of services. The UK has a surplus in services and a larger deficit in goods.','What happens','Where it goes'),
    EX('Newcastle United','Saudi Arabia’s Public Investment Fund bought a controlling stake in the club.','Foreign direct investment: a credit on the financial account. Any profits later paid to the owners abroad are a debit on primary income.','What happens','Where it goes')
  ]}};

V.bp_fix={kind:'card', btn:'Reducing a deficit', showing:'Three kinds of policy, and doing nothing',
  title:'Measures to reduce a current account deficit',
  lead:'Policies either cut spending on imports, switch spending towards home-produced goods, or make exports more competitive.',
  terms:[
    ['Expenditure-reducing','Policies that cut total spending in the economy, spending on imports included.'],
    ['Expenditure-switching','Policies that make imports dearer than home-produced goods, so spending switches towards UK products.']
  ],
  card:{head:'Policies', items:[
    PT('Expenditure-reducing',[['How','Higher taxes or interest rates cut total spending, so households buy fewer imports.'],['Cost','Spending on UK goods falls too, so growth slows and unemployment rises.']]),
    PT('Expenditure-switching',[['How','A weaker currency or tariffs make imports dearer than UK goods, so spending switches to UK products.'],['Cost','Dearer imports push up inflation, and tariffs invite retaliation against UK exports.']]),
    PT('Supply-side',[['How','Investment in skills, infrastructure and technology lowers costs and improves products, so exports win on price and quality.'],['Cost','Slow to work and often expensive for the government; the deficit carries on meanwhile.']]),
    PT('Do nothing',[['How','With a floating exchange rate, a deficit should weaken the currency, making exports cheaper and imports dearer, so it corrects itself.'],['Cost','It can be slow, and it may not happen if money flowing in on the financial account holds the currency up.']])
  ]},
  evaluation:'The right fix depends on the cause. If the deficit comes from booming demand, expenditure-reducing policy works fast. If it comes from weak competitiveness, only supply-side policy lasts; the other two treat the symptom and bring costs of their own.',
  traps:[
    'Match the policy to the cause in the question. A cure for weak competitiveness does nothing quickly for a consumer boom.',
    'A depreciation improves the current account only if the Marshall–Lerner condition holds, and usually only after a J-curve delay.'
  ]};
TOPICS.bop.quiz=[
  ['A UK student pays fees to a US university. Which account, and credit or debit?','Current account, trade in services: a debit.'],
  ['A Japanese carmaker builds a factory in Sunderland. Which account?','Financial account, direct investment: an inflow.'],
  ['Migrant workers in the UK send money to their families abroad. Which part of the current account?','Secondary income: a debit.'],
  ['Can a country have a trade surplus and a current account deficit at the same time?','Yes, if primary and secondary income outflows are bigger than the trade surplus.'],
  ['Name one expenditure-switching policy and its main cost.','A depreciation or a tariff. Main cost: imported inflation (and, for a tariff, retaliation).']
];

TOPICS.global.quiz=[["Give two causes of globalisation.", "Any two: trade liberalisation, cheaper transport (containers), cheaper communication (the internet), political change such as China opening up."], ["Why can globalisation raise national income and still be unpopular?", "The gains are spread thinly over all consumers, while job losses fall heavily on particular workers and regions."], ["What does the Prebisch–Singer hypothesis predict for primary exporters?", "Their terms of trade worsen over time, because primary prices rise more slowly than the prices of manufactured imports."]];
TOPICS.trade.quiz=[["Country A can make 10 cars or 20 bikes; country B can make 5 cars or 15 bikes. Who has the comparative advantage in bikes?", "B: one bike costs B a third of a car, but costs A half a car."], ["What is the formula for the terms of trade?", "Index of export prices ÷ index of import prices × 100."], ["Why must the trading rate lie between the two opportunity costs?", "Outside that range one country could do better by making the good itself, so it would not trade."]];
TOPICS.protect.quiz=[["On the tariff diagram, which areas are the deadweight loss?", "B (inefficient domestic production) and D (lost consumption)."], ["Who gets area C under a tariff, and who under a quota?", "Under a tariff, the government as revenue. Under a quota, the foreign firms allowed in, who sell at the higher price."], ["Give one argument for protection and its main weakness.", "Infant industries: they may never grow up and stay protected for good. Others: dumping, strategic industries, declining industries."]];
TOPICS.blocs.quiz=[["What does a customs union have that a free trade area does not?", "A common external tariff."], ["On the trade diversion diagram, what is area E?", "The extra cost of buying from a less efficient member instead of the cheapest producer in the world: a pure loss."], ["Give one cost of a monetary union.", "Losing your own interest rate and exchange rate, so a member in recession cannot cut rates or devalue for itself."]];
TOPICS.fx.quiz=[["What happens to the price of UK exports abroad when the pound depreciates?", "They get cheaper in foreign currency, so they become more competitive."], ["Give two causes of a rise in demand for pounds.", "Any two: more UK exports sold, more investment into the UK, higher UK interest rates attracting hot money, speculators expecting a rise."], ["State the Marshall–Lerner condition.", "A depreciation improves the current account if PED for exports + PED for imports > 1."], ["How can a central bank stop its currency falling?", "Buy its own currency with foreign reserves, or raise interest rates."]];

TOPICS.growth.quiz=[["Tesco buys a farm that grows its potatoes. Which type of integration is this?", "Backward vertical integration: it moves to an earlier stage of production."], ["Give one reason a firm stays small.", "Any one: a small niche market, owners who want to keep control, lack of finance, or diseconomies of scale."], ["What is the difference between a merger and a takeover?", "A merger is agreed by both firms. A takeover is one firm buying a controlling stake in another, agreed or not."]];
TOPICS.objectives.quiz=[["Where does a firm maximise revenue?", "Where MR = 0."], ["Where does a sales maximiser produce?", "Where AR = AC: the most it can sell while still earning normal profit."], ["What is satisficing?", "Aiming for a satisfactory profit, not the maximum, to keep shareholders content while pursuing other goals."], ["Why might managers not maximise profit?", "The principal–agent problem: managers may chase size, sales or their own pay instead."]];
TOPICS.revenue.quiz=[["Price falls from £8 to £7 and sales rise from 10 to 12. What is MR per extra unit?", "TR goes from £80 to £84, so MR = £4 ÷ 2 = £2 per extra unit."], ["Where on a straight-line demand curve is PED = 1?", "At the midpoint, where MR = 0 and total revenue is highest."], ["Why is MR below AR when the demand curve slopes down?", "To sell one more unit the firm must cut the price on every unit, not just the extra one."]];
TOPICS.costs.quiz=[["A firm’s fixed costs rise. Which curves move?", "AFC and AC shift up. MC and AVC do not move."], ["Why does MC cut AC at its lowest point?", "An extra unit that costs less than the average pulls the average down; one that costs more pulls it up."], ["What gives short-run AC its U shape?", "Fixed costs spread over more units at first, then diminishing marginal returns."]];
TOPICS.scale.quiz=[["Do internal economies of scale move a firm along its LRAC or shift it?", "Along it: they come from the firm’s own size. External economies shift the whole LRAC."], ["Give two internal economies of scale.", "Any two: technical, purchasing, managerial, financial, marketing, risk-bearing."], ["What is the minimum efficient scale?", "The lowest output at which LRAC reaches its minimum."]];
TOPICS.profits.quiz=[["What is normal profit?", "The minimum profit needed to keep resources in their current use: where AR = AC."], ["Price is above AVC but below ATC. What should the firm do in the short run?", "Keep producing: it covers its variable costs and part of its fixed costs, so it loses less than by shutting."], ["Where does a firm maximise profit?", "Where MR = MC, with MC rising."]];
TOPICS.efficiency.quiz=[["What is the condition for allocative efficiency?", "P = MC."], ["What is the condition for productive efficiency?", "Producing at the lowest point of AC, where MC = AC."], ["Which market structure gives both in the long run?", "Perfect competition: P = MC, at the lowest point of AC."]];
TOPICS.perfect.quiz=[["Why is a perfectly competitive firm a price taker?", "It is one of many firms selling an identical product, so it cannot charge more than the market price."], ["What removes supernormal profit in the long run?", "New firms enter, shifting industry supply right until the price equals minimum AC."], ["Is a perfectly competitive firm dynamically efficient?", "Probably not: with only normal profit and perfect information, it has neither the funds nor a reason to innovate."]];
TOPICS.monopoly.quiz=[["Where does a monopolist set output, and how does it find its price?", "Output where MR = MC; price read up to the AR curve at that output."], ["Why does monopoly cause a deadweight welfare loss?", "It restricts output below where P = MC, so units that consumers value above their cost are not made."], ["Give the three conditions for third degree price discrimination.", "Market power, groups with different PEDs that can be kept apart, and no resale between them."], ["A monopolist’s fixed costs rise. What happens to its price?", "Nothing: MR and MC do not move, so output and price stay the same and only profit falls."]];
TOPICS.monopolistic.quiz=[["What makes the long run here different from monopoly?", "Low barriers to entry: supernormal profit attracts new firms until only normal profit is left."], ["Where is long-run equilibrium?", "Where AR is tangent to AC, at the output where MR = MC."], ["What is excess capacity?", "The gap between the firm’s output and the output at minimum AC."]];
TOPICS.oligopoly.quiz=[["Why is the oligopolist’s demand curve kinked?", "Rivals ignore a price rise but match a price cut, so demand is elastic above the price and inelastic below it."], ["Why does the kinked demand model predict sticky prices?", "There is a gap in MR, so MC can change within it without changing the profit-maximising price."], ["In a prisoners’ dilemma, why might both firms end up cheating?", "Cheating is each firm’s dominant strategy, so both cheat, even though both would do better colluding."]];
TOPICS.contestable.quiz=[["What makes a market contestable?", "Low barriers to entry and exit, especially low sunk costs."], ["Can a market with only one firm be contestable?", "Yes: what matters is the threat of entry, not the number of firms."], ["What are sunk costs?", "Costs a firm cannot get back when it leaves, such as advertising or specialist equipment."]];
TOPICS.barriers.quiz=[["What is the difference between limit pricing and predatory pricing?", "Limit pricing keeps the price just low enough to deter entry and stays profitable. Predatory pricing goes below cost to force a rival out, and is illegal."], ["Give two barriers to entry.", "Any two: economies of scale, sunk costs, brand loyalty, patents, control of supplies, licences."], ["Why are sunk costs a barrier to entry?", "An entrant cannot get them back if it fails, so entry is riskier."]];

/* =====================================================================
   MACRO DIAGRAMS
   ===================================================================== */

/* ---------- trade: domestic supply and demand with horizontal world supply ---------- */
var TR = {da:100, db:0.8, sa:10, sb:0.8};
function trD(q){return TR.da-TR.db*q;}
function trQd(p){return (TR.da-p)/TR.db;}
function trQs(p){return (p-TR.sa)/TR.sb;}

function renderTrade(){
  var g=kit({ytitle:'Price',xtitle:'Quantity'}), X=g.X, Y=g.Y, fs=g.fs, id=curId(), v=V[id], m=v.tr;
  var te=v.anim?ease(state.t):0;
  var areas='', guides='', notes='', labels='', curves='';
  function hl(p,name,ghost,below){
    curves+='<path class="curve c-mc'+(ghost?' ghost':'')+'" d="M'+r1(X(0))+' '+r1(Y(p))+'H'+r1(X(116))+'"/>';
    if(name) labels+=g.txt(X(116),Y(p)+(below?fs+4:-7),name,'bold t-mc halo','end');
  }
  function poly(pts,cls){return '<path class="area '+cls+'" d="M'+pts.map(function(p){return r1(X(p[0]))+' '+r1(Y(p[1]));}).join('L')+'Z"/>';}
  function letter(q,p,s){return g.txt(X(q),Y(p)+5,s,'bold','middle');}
  function bracket(q0,q1,p,name){
    var y=Y(p)+10;
    return '<path class="leader eff" d="M'+r1(X(q0))+' '+r1(y-5)+'V'+r1(y)+'H'+r1(X(q1))+'V'+r1(y-5)+'"/>'
      + g.txt((X(q0)+X(q1))/2,y+fs+1,name,'t-eff bold halo','middle');
  }
  /* domestic supply: shifted right by `shift` units, or lowered by `drop` (a subsidy) */
  function sLine(shift,drop,name,ghost){
    function p(q){return TR.sa-drop+TR.sb*(q-shift);}
    var q0=Math.max(shift,shift+(drop-TR.sa)/TR.sb), q1=Math.min(112,shift+(PTOP-TR.sa+drop)/TR.sb);
    curves+='<path class="curve c-ac'+(ghost?' ghost':'')+'" d="M'+r1(X(q0))+' '+r1(Y(p(q0)))+'L'+r1(X(q1))+' '+r1(Y(p(q1)))+'"/>';
    if(name) labels+=g.txt(X(q1)-9,Y(p(q1))+13,name,'bold t-ac halo','end');
  }
  /* the four areas between a low and a high price */
  function band(lo,hi,cols,quiet){
    var q={a:trQs(lo),b:trQs(hi),c:trQd(hi),d:trQd(lo)};
    areas+=poly([[0,lo],[0,hi],[q.b,hi],[q.a,lo]],cols[0])+poly([[q.a,lo],[q.b,hi],[q.b,lo]],cols[1])
         + g.box(q.b,q.c,lo,hi,'area '+cols[2])+poly([[q.c,lo],[q.c,hi],[q.d,lo]],cols[3]);
    if(quiet) return q;   /* while animating: just the areas growing */
    notes+=letter(q.a*0.5,(lo+hi)/2,'A')+letter((q.a+2*q.b)/3-0.5,(2*lo+hi)/3,'B')+letter((q.b+q.c)/2,(lo+hi)/2,'C')+letter((2*q.c+q.d)/3+0.5,(2*lo+hi)/3,'D');
    guides+=g.vline(q.a,lo)+g.vline(q.b,hi)+g.vline(q.c,hi)+g.vline(q.d,lo)+g.dot(q.a,lo)+g.dot(q.b,hi)+g.dot(q.c,hi)+g.dot(q.d,lo);
    return q;
  }
  function qNames(q,names){
    notes+=g.axQ(X(q.a),names[0])+g.axQ(X(q.b),names[1])+g.axQ(X(q.c),names[2])+g.axQ(X(q.d),names[3]);
  }

  curves+='<path class="curve c-ar" d="M'+r1(X(0))+' '+r1(Y(trD(0)))+'L'+r1(X(118))+' '+r1(Y(trD(118)))+'"/>';
  labels+=g.txt(X(6)+9,Y(trD(6))+2,'D','bold t-ar halo');
  var sName=g.small?'S':'S domestic';
  var W1=26, W2=40, q;

  if(m==='free'){
    sLine(0,0,sName); hl(W1,'S world');
    var qa=trQs(W1), qd=trQd(W1), qe=(TR.da-TR.sa)/(TR.db+TR.sb), pe=trD(qe);
    guides+=g.hline(qe,pe,'muted')+g.dot(qe,pe,'muted')+g.vline(qa,W1)+g.vline(qd,W1)+g.dot(qa,W1)+g.dot(qd,W1);
    notes+=g.axP(Y(pe),'P_0','t-muted')+g.axP(Y(W1),'P_1')+g.axQ(X(qa),'Q_1')+g.axQ(X(qd),'Q_2')+bracket(qa,qd,W1,'imports');
  }
  else if(m==='tariff'){
    var p=W1+(W2-W1)*te;
    sLine(0,0,sName); hl(W1,'S world'); hl(p, te>0.6?'S world + tariff':'');
    var a0=trQs(W1), d0=trQd(W1), a1=trQs(p), d1=trQd(p);
    guides+=g.vline(a0,W1,'muted')+g.vline(d0,W1,'muted')+g.dot(a0,W1,'muted')+g.dot(d0,W1,'muted');
    guides+=g.vline(a1,p)+g.vline(d1,p)+g.dot(a1,p)+g.dot(d1,p);
    var py=spread(Y(W1),Y(p),fs+9), qa2=spread(X(a0),X(a1),fs*1.7), qd2=spread(X(d1),X(d0),fs*1.7);
    notes+=g.axP(py[0],'P_1','t-muted')+g.axP(py[1],'P_2');
    notes+=g.axQ(qa2[0],'Q_1','t-muted')+g.axQ(qa2[1],'Q_3')+g.axQ(qd2[0],'Q_4')+g.axQ(qd2[1],'Q_2','t-muted');
    if(te>0.6) notes+=bracket(a1,d1,p,'imports');
  }
  else if(m==='areas'){
    sLine(0,0,sName); hl(W1,'S world'); hl(W2,'S world + tariff');
    q=band(W1,W2,['a-cs','a-dwl','a-profit','a-dwl']); qNames(q,['Q_1','Q_3','Q_4','Q_2']);
    notes+=g.axP(Y(W1),'P_1')+g.axP(Y(W2),'P_2');
  }
  else if(m==='quota' && v.anim && state.t<0.97){
    /* the quota bites: imports are capped, so total supply runs out at a higher price */
    var pq=W1+(W2-W1)*ease(state.t);
    sLine(0,0,sName); sLine(trQd(pq)-trQs(pq),0,''); hl(W1,'S world');
    if(pq-W1>0.4) band(W1,pq,['a-cs','a-dwl','a-cost','a-dwl'],true);
    guides+=g.dot(trQd(pq),pq); notes+=g.axP(Y(W1),'P_1');
  }
  else if(m==='quota'){
    sLine(0,0,sName); sLine(trQd(W2)-trQs(W2),0,'S total'); hl(W1,'S world');
    q=band(W1,W2,['a-cs','a-dwl','a-cost','a-dwl']); qNames(q,['Q_1','Q_4','Q_3','Q_2']);
    guides+=g.hline(q.c,W2);
    notes+=g.axP(Y(W1),'P_1')+g.axP(Y(W2),'P_2');
  }
  else if(m==='subsidy'){
    var s=(W2-W1)*te, q1=trQs(W1), q3=q1+s/TR.sb, q2=trQd(W1);
    if(s>0.4){ sLine(0,0,'S_1',true); sLine(0,s,'S_2'); areas+=g.box(0,q3,W1,W1+s,'area a-cost'); }
    else sLine(0,0,sName);
    hl(W1,'S world');
    guides+=g.vline(q1,W1,'muted')+g.dot(q1,W1,'muted')+g.vline(q3,W1+s)+g.dot(q3,W1)+g.vline(q2,W1)+g.dot(q2,W1);
    var qs=spread(X(q1),X(q3),fs*1.7);
    notes+=g.axP(Y(W1),'P_1')+g.axQ(qs[0],'Q_1','t-muted')+(te>0.02?g.axQ(qs[1],'Q_3'):'')+g.axQ(X(q2),'Q_2');
    if(te>0.7) notes+=g.txt(X(q3/2),Y(W1+s/2)+5,'subsidy','bold','middle')+bracket(q3,q2,W1,'imports');
  }
  else if(m==='create' && v.anim && state.t<0.97){
    /* inside the union the tariff goes, and the import price falls */
    var pc2=W2+(W1-W2)*ease(state.t);
    sLine(0,0,sName); hl(W2,'S world + tariff',true); hl(pc2,'');
    if(W2-pc2>0.4) band(pc2,W2,['a-cs','a-gain','a-profit','a-gain'],true);
    notes+=g.axP(Y(W2),'P_1');
  }
  else if(m==='create'){
    sLine(0,0,sName); hl(W2,'S world + tariff'); hl(W1,'S customs union',false,true);
    q=band(W1,W2,['a-cs','a-gain','a-profit','a-gain']); qNames(q,['Q_3','Q_1','Q_2','Q_4']);
    notes+=g.axP(Y(W2),'P_1')+g.axP(Y(W1),'P_2');
  }
  else if(m==='divert' && v.anim && state.t<0.97){
    /* joining the union removes the tariff on Germany only: once Germany undercuts Japan + tariff, imports switch */
    var ger=46+(28-46)*ease(state.t), pd2=Math.min(38,ger);
    sLine(0,0,sName); hl(20,'S Japan',true); hl(38,'S Japan + tariff'); hl(ger,'');
    if(38-pd2>0.4) band(pd2,38,['a-cs','a-gain','a-profit','a-gain'],true);
    notes+=g.axP(Y(38),'P_1');
  }
  else if(m==='divert'){
    sLine(0,0,sName);
    hl(46,'S Germany + tariff',true); hl(38,'S Japan + tariff'); hl(28,'S Germany'); hl(20,'S Japan',true);
    q=band(28,38,['a-cs','a-gain','a-profit','a-gain']); qNames(q,['Q_3','Q_1','Q_2','Q_4']);
    areas+=g.box(q.b,q.c,20,28,'area a-dwl');
    notes+=letter((q.b+q.c)/2,24,'E')+g.axP(Y(38),'P_1')+g.axP(Y(28),'P_2');
  }
  g.out(areas,curves,guides,labels,notes);
}

/* ---------- exchange rate: the market for a currency ---------- */
function renderFX(){
  var id=curId(), v=V[id];
  var narrow=(plot.clientWidth||640)<480;   /* the long title runs into Q labels on a phone */
  var g=kit(v.cur?{ytitle:'Price of the currency',xtitle:narrow?'Quantity':'Quantity of the currency'}:{ytitle:'Price of £ (in $)',xtitle:'Quantity of £'}), X=g.X, Y=g.Y, fs=g.fs;
  var t=v.anim?state.t:1, two=!!v.two;
  var a1=ease(two?Math.min(1,t*2):t), a2=two?ease(Math.max(0,t*2-1)):0;
  var d1=v.d1||0, s1=v.s1||0, d2=v.d2||0, s2=v.s2||0;
  var dNow=d1*a1+d2*a2, sNow=s1*a1+s2*a2;
  var areas='', guides='', notes='', labels='', curves='';
  function eq(d,s){var q=(90+d+s)/1.6; return {q:q,e:100+d-0.8*q};}
  function dLine(d,name,ghost){
    var q0=Math.max(0,(d-4)/0.8), q1=Math.min(116,(96+d)/0.8);
    curves+='<path class="curve c-ar'+(ghost?' ghost':'')+'" d="M'+r1(X(q0))+' '+r1(Y(100+d-0.8*q0))+'L'+r1(X(q1))+' '+r1(Y(100+d-0.8*q1))+'"/>';
    labels+=g.txt(X(q0+4)+8,Y(100+d-0.8*(q0+4))+3,name,'bold t-ar halo');
  }
  function sLine(s,name,ghost){
    var q0=Math.max(0,(s-8)/0.8), q1=Math.min(116,(94+s)/0.8);
    curves+='<path class="curve c-mc'+(ghost?' ghost':'')+'" d="M'+r1(X(q0))+' '+r1(Y(10-s+0.8*q0))+'L'+r1(X(q1))+' '+r1(Y(10-s+0.8*q1))+'"/>';
    labels+=g.txt(X(q1)-9,Y(10-s+0.8*q1)+13,name,'bold t-mc halo','end');
  }
  var dMoves=(d1||d2), sMoves=(s1||s2);
  if(dMoves && Math.abs(dNow)>0.5){ dLine(0,'D_1',true); dLine(dNow,'D_2'); } else dLine(0,dMoves?'D_1':'D');
  if(sMoves && Math.abs(sNow)>0.5){ sLine(0,'S_1',true); sLine(sNow,'S_2'); } else sLine(0,sMoves?'S_1':'S');

  var p0=eq(0,0), p1=eq(d1*a1,s1*a1), pc=eq(dNow,sNow);
  if(!dMoves && !sMoves){
    guides+=g.guide(p0.q,p0.e)+g.dot(p0.q,p0.e);
    notes+=g.axP(Y(p0.e),'e_1')+g.axQ(X(p0.q),'Q_1');
  } else if(!two){
    guides+=g.guide(p0.q,p0.e,'muted')+g.dot(p0.q,p0.e,'muted')+g.guide(pc.q,pc.e)+g.dot(pc.q,pc.e);
    var py=spread(Y(p0.e),Y(pc.e),fs+9), qx=spread(X(p0.q),X(pc.q),fs*1.7);
    notes+=g.axP(py[0],'e_1','t-muted')+g.axQ(qx[0],'Q_1','t-muted')+g.axP(py[1],'e_2')+g.axQ(qx[1],'Q_2');
  } else {
    var done=a2>0.02, m1=done?'muted':'';
    guides+=g.hline(p0.q,p0.e)+g.vline(p0.q,p0.e,'muted')+g.dot(p0.q,p0.e,done?'muted':'');
    guides+=g.guide(p1.q,p1.e,m1)+g.dot(p1.q,p1.e,m1);
    var py2=spread(Y(p0.e),Y(p1.e),fs+9), qx2=spread(X(p0.q),X(p1.q),fs*1.7);
    notes+=g.axP(py2[0],'e_1')+g.axQ(qx2[0],'Q_1','t-muted');
    if(a1>0.02) notes+=g.axP(py2[1],'e_2',done?'t-muted':'')+g.axQ(qx2[1],'Q_2',done?'t-muted':'');
    if(done){
      guides+=g.hline(pc.q,pc.e)+g.vline(pc.q,pc.e)+g.dot(pc.q,pc.e);
      var q3=spread(qx2[1],X(pc.q),fs*1.7);
      notes+=g.axQ(q3[1],'Q_3');
    }
  }
  g.out(areas,curves,guides,labels,notes);
}

/* ---------- AD/AS with the curved (Keynesian) AS your handouts draw ---------- */
function asP(y){ if(y<=45) return 30; var u=(y-45)/50; return u>=0.995?9999:30+6*u/(1-u); }
function renderADAS(){
  var g=kit({ytitle:'Price level',xtitle:'Real GDP'}), X=g.X, Y=g.Y, fs=g.fs, v=cur();
  var te=v.anim?ease(state.t):0, a0=118, a=a0+(v.da||0)*te;
  var areas='', guides='', notes='', labels='', curves='';
  var d='M'+r1(X(0))+' '+r1(Y(30))+'H'+r1(X(45)), yTop=91.25, n=60, i;
  for(i=1;i<=n;i++){ var yy=45+(yTop-45)*i/n; d+='L'+r1(X(yy))+' '+r1(Y(asP(yy))); }
  curves+='<path class="curve c-ac" d="'+d+'"/>';
  labels+=g.txt(X(yTop)-9,Y(asP(yTop))+13,'AS','bold t-ac halo','end');
  function adLine(A,name,ghost){
    var y0=Math.max(0,(A-PTOP)/0.9), y1=Math.min(117,(A-4)/0.9);
    curves+='<path class="curve c-ar'+(ghost?' ghost':'')+'" d="M'+r1(X(y0))+' '+r1(Y(A-0.9*y0))+'L'+r1(X(y1))+' '+r1(Y(A-0.9*y1))+'"/>';
    labels+=g.txt(X(y0+4)+8,Y(A-0.9*(y0+4))+3,name,'bold t-ar halo');
  }
  function eq(A){ var y=bisect(function(z){return A-0.9*z-asP(z);},45.01,94.5); return {y:y,p:A-0.9*y}; }
  var moved=Math.abs(a-a0)>0.5;
  if(moved){ adLine(a0,'AD_1',true); adLine(a,'AD_2'); } else adLine(a0,v.da?'AD_1':'AD');
  var e0=eq(a0), e1=eq(a);
  if(!v.da){
    guides+=g.guide(e0.y,e0.p)+g.dot(e0.y,e0.p);
    notes+=g.axP(Y(e0.p),'P_1')+g.axQ(X(e0.y),'Y_1');
  } else {
    guides+=g.guide(e0.y,e0.p,'muted')+g.dot(e0.y,e0.p,'muted')+g.guide(e1.y,e1.p)+g.dot(e1.y,e1.p);
    var py=spread(Y(e0.p),Y(e1.p),fs+9), qx=spread(X(e0.y),X(e1.y),fs*1.7);
    notes+=g.axP(py[0],'P_1','t-muted')+g.axQ(qx[0],'Y_1','t-muted')+g.axP(py[1],'P_2')+g.axQ(qx[1],'Y_2');
  }
  g.out(areas,curves,guides,labels,notes);
}

/* ---------- J-curve: current account against time ---------- */
function renderJ(){
  var g=kit({axes:false}), X=g.X, Y=g.Y, fs=g.fs, te=ease(state.t);
  function vAt(t){var k=t<40?0.0432:0.0346; return -32+k*(t-40)*(t-40);}
  function yv(val){return Y(55+val);}
  var x0=X(8), xe=X(116), yz=yv(0), tEnd=22+(88-22)*te, d='', n=70, i;
  for(i=0;i<=n;i++){ var t=22+(tEnd-22)*i/n; d+=(i?'L':'M')+r1(X(t))+' '+r1(yv(vAt(t))); }
  var curves='<path class="axis" d="M'+r1(x0)+' '+r1(Y(106))+'V'+r1(Y(3))+'"/>'
    + '<path class="axis" d="M'+r1(x0-5)+' '+r1(Y(106)+8)+'L'+r1(x0)+' '+r1(Y(106))+'L'+r1(x0+5)+' '+r1(Y(106)+8)+'"/>'
    + '<path class="axis" d="M'+r1(x0-5)+' '+r1(Y(3)-8)+'L'+r1(x0)+' '+r1(Y(3))+'L'+r1(x0+5)+' '+r1(Y(3)-8)+'"/>'
    + '<path class="axis" d="M'+r1(x0)+' '+r1(yz)+'H'+r1(xe)+'"/>'
    + '<path class="axis" d="M'+r1(xe-8)+' '+r1(yz-5)+'L'+r1(xe)+' '+r1(yz)+'L'+r1(xe-8)+' '+r1(yz+5)+'"/>'
    + '<path class="curve c-ar" d="'+d+'"/>';
  var ts=g.small?12:13;
  var labels='<text class="axis-title" x="'+r1(x0+10)+'" y="'+r1(Y(100))+'" font-size="'+ts+'">Current account surplus (+)</text>'
    + '<text class="axis-title" x="'+r1(x0+10)+'" y="'+r1(Y(6))+'" font-size="'+ts+'">Current account deficit (−)</text>'
    + '<text class="axis-title" x="'+r1(xe)+'" y="'+r1(yz+fs+6)+'" text-anchor="end" font-size="'+ts+'">Time</text>'
    + g.txt(x0-9,yz+5,'0','bold','end');
  var notes='';
  function pt(t,name,dx,dy){ return '<circle class="dot" cx="'+r1(X(t))+'" cy="'+r1(yv(vAt(t)))+'" r="'+(g.small?4:4.6)+'"/>'+g.txt(X(t)+dx,yv(vAt(t))+dy,name,'bold halo','middle'); }
  notes+=pt(22,'X',-14,5);
  if(tEnd>=40) notes+=pt(40,'Y',0,fs+10);
  if(tEnd>=78) notes+=pt(78,'Z',16,6);
  if(te>0.02 && te<0.999) notes+='<circle class="dot eff" cx="'+r1(X(tEnd))+'" cy="'+r1(yv(vAt(tEnd)))+'" r="5"/>';
  g.out('',curves,'',labels,notes);
}

/* ---------- production possibility curves ---------- */
function renderPPC(){
  var id=curId(), v=V[id], te=v.anim?ease(state.t):1;
  function line(g,x0,y0,x1,y1,cls){return '<path class="curve '+cls+'" d="M'+r1(g.X(x0))+' '+r1(g.Y(y0))+'L'+r1(g.X(x1))+' '+r1(g.Y(y1))+'"/>';}
  if(v.ppc==='abs'){
    var g=kit({qmax:235,pmax:235,ytitle:'Cars',xtitle:'Bananas'}), X=g.X, Y=g.Y;
    var curves=line(g,0,200,100,0,'c-ar')+line(g,0,100,200,0,'c-mc');
    var labels=g.txt(X(14)+8,Y(172)+4,'US','bold t-ar halo')+g.txt(X(160)+6,Y(20)-8,'Ecuador','bold t-mc halo');
    var guides=g.dot(50,100)+g.dot(100,50)+g.guide(100,100,'eff')+g.dot(100,100,'eff');
    var notes=g.axP(Y(200),'200')+g.axP(Y(100),'100')+g.axQ(X(100),'100')+g.axQ(X(200),'200');
    notes+=g.leader(['with trade:','100 of each'], 150, 170, 100, 100, 't-eff');
    g.out('',curves,guides,labels,notes);
    return;
  }
  /* two panels: UK and Senegal */
  var showT=(v.ppc!=='comp'), ukX, snY, ukGhost=0, snGhost=0;
  if(v.ppc==='gain'){ ukX=600+200*te; snY=200+100*te; }
  else if(v.ppc==='tot'){ ukX=800+200*te; snY=300-60*te; ukGhost=800; snGhost=300; }
  var gu=kit({n:2,i:0,qmax:1120,pmax:720,head:'UK',ytitle:'Petrol',xtitle:'Clothes'}), fs=gu.fs;
  var c='', l='', gd='', nt='';
  c+=line(gu,0,600,600,0,'c-ar');
  l+=gu.txt(gu.X(300)-8,gu.Y(300)+fs+2,'PPC','bold t-ar halo','end');
  /* on a phone the panel margin is narrow: tuck the number in so it stays on the sheet */
  nt+= gu.small ? gu.txt(gu.mg.l-3,gu.Y(600)+5,'600','bold','end') : gu.axP(gu.Y(600),'600');
  if(showT){
    if(ukGhost) c+=line(gu,0,600,ukGhost,0,'c-mc ghost');
    c+=line(gu,0,600,ukX,0,'c-mc');
    l+=gu.txt(gu.X(ukX/2)+8,gu.Y(300)-5,'TPC','bold t-mc halo');
    var ux=spread(gu.X(600),gu.X(ukX),fs*2.3);
    nt+=gu.axQ(ux[0],'600','t-muted')+gu.axQ(ux[1],String(Math.round(ukX/10)*10));
    gd+=gu.dot(0,600);
  } else {
    nt+=gu.axQ(gu.X(600),'600');
    nt+=gu.txt2(gu.X(560),gu.Y(600),'1 petrol costs','1 clothes','halo');
  }
  var inner=gu.compose('',c,gd,l,nt);

  var gs=kit({n:2,i:1,qmax:490,pmax:370,head:'Senegal',ytitle:'Petrol',xtitle:'Clothes'});
  c=''; l=''; gd=''; nt='';
  c+=line(gs,0,200,400,0,'c-ar');
  l+=gs.txt(gs.X(200)-8,gs.Y(100)+fs+2,'PPC','bold t-ar halo','end');
  nt+=gs.axQ(gs.X(400),'400');
  if(showT){
    if(snGhost) c+=line(gs,0,snGhost,400,0,'c-mc ghost');
    c+=line(gs,0,snY,400,0,'c-mc');
    l+=gs.txt(gs.X(200)+8,gs.Y(snY/2)-6,'TPC','bold t-mc halo');
    var sy=spread(gs.Y(200),gs.Y(snY),fs+6);
    nt+=gs.axP(sy[0],'200','t-muted')+gs.axP(sy[1],String(Math.round(snY/10)*10));
    gd+=gs.dot(400,0);
  } else {
    nt+=gs.axP(gs.Y(200),'200');
    nt+=gs.txt2(gs.X(215),gs.Y(330),'1 petrol costs','2 clothes','halo');
  }
  inner+=gs.compose('',c,gd,l,nt);
  wrapSvg(gu,inner);
}

/* =====================================================================
   MACRO CALCULATORS (shown in the sheet where the diagram normally goes)
   ===================================================================== */
function num(x){ var r=Math.round(x*100)/100; return String(r); }

/* ---------- opportunity cost ---------- */
var CA_PRESETS = {
  uk:{names:['UK','Senegal'],goods:['Petrol','Clothes'],low:['petrol','clothes'],v:[[600,600],[200,400]]},
  it:{names:['Italy','China'],goods:['TVs','Wine'],low:['TVs','wine'],v:[[1000,4000],[5000,5000]]}
};
var caState = {preset:'uk', v:[[600,600],[200,400]]};
function renderCACalc(){
  var P=CA_PRESETS[caState.preset], h='<div class="panel-head"><strong>Most each country can produce</strong></div>'
    + '<div class="minis"><span>Try</span>'
    + '<button type="button" class="chip mini" id="ca-pre-uk" data-ca="uk">UK and Senegal</button>'
    + '<button type="button" class="chip mini" id="ca-pre-it" data-ca="it">Italy and China</button></div>'
    + '<div class="calc-grid"><span></span><span class="ch">'+P.goods[0]+'</span><span class="ch">'+P.goods[1]+'</span>';
  for(var i=0;i<2;i++){
    h+='<label class="cl" for="ca-'+i+'-0">'+P.names[i]+'</label>';
    for(var j=0;j<2;j++) h+='<input id="ca-'+i+'-'+j+'" type="number" inputmode="numeric" min="1" step="1" value="'+caState.v[i][j]+'" aria-label="'+P.names[i]+' '+P.goods[j]+'">';
  }
  h+='</div><div class="cr-out" id="ca-out"></div>';
  panel.innerHTML=h;
  updateCA();
}
function updateCA(){
  var P=CA_PRESETS[caState.preset], v=caState.v, n=P.names, g0=P.low[0], g1=P.low[1];
  var c0=[v[0][1]/v[0][0], v[1][1]/v[1][0]];   /* cost of 1 unit of good 0, in good 1 */
  var c1=[v[0][0]/v[0][1], v[1][0]/v[1][1]];
  var h='<span class="label">Opportunity costs</span>';
  for(var i=0;i<2;i++) h+='<span class="sum">'+n[i]+': 1 unit of '+g0+' costs '+num(c0[i])+' of '+g1+'; 1 unit of '+g1+' costs '+num(c1[i])+' of '+g0+'.</span>';
  h+='<span class="label" style="margin-top:8px">Comparative advantage</span>';
  if(Math.abs(c0[0]-c0[1])<1e-9) h+='<span>The opportunity costs are the same, so there is nothing to gain from trade.</span>';
  else {
    var a=c0[0]<c0[1]?0:1, b=1-a;
    h+='<span><b>'+n[a]+'</b> gives up less to make '+g0+', so it should specialise in '+g0+'.</span>'
     + '<span><b>'+n[b]+'</b> gives up less to make '+g1+', so it should specialise in '+g1+'.</span>';
    var abs0=v[0][0]>v[1][0]?0:(v[0][0]<v[1][0]?1:-1), abs1=v[0][1]>v[1][1]?0:(v[0][1]<v[1][1]?1:-1);
    if(abs0>=0 && abs0===abs1) h+='<span>'+n[abs0]+' has the absolute advantage in both goods, but trade still pays.</span>';
    h+='<span>Any trading rate between '+num(Math.min(c0[0],c0[1]))+' and '+num(Math.max(c0[0],c0[1]))+' units of '+g1+' per unit of '+g0+' benefits both.</span>';
  }
  document.getElementById('ca-out').innerHTML=h;
  ['uk','it'].forEach(function(k){ document.getElementById('ca-pre-'+k).setAttribute('aria-pressed', caState.preset===k?'true':'false'); });
}

/* ---------- terms of trade ---------- */
var totState = {x1:104.2,m1:102.1,x2:107.9,m2:106.8};
function renderTot(){
  function row(lab,a,b){return '<span class="cl">'+lab+'</span>'
    + '<input id="tt-'+a+'" type="number" inputmode="decimal" min="1" step="0.1" value="'+totState[a]+'" aria-label="'+lab+' export prices">'
    + '<input id="tt-'+b+'" type="number" inputmode="decimal" min="1" step="0.1" value="'+totState[b]+'" aria-label="'+lab+' import prices">';}
  panel.innerHTML='<div class="panel-head"><strong>Price indices</strong></div>'
    + '<div class="calc-grid"><span></span><span class="ch">Export prices</span><span class="ch">Import prices</span>'
    + row('Year 1','x1','m1')+row('Year 2','x2','m2')+'</div><div class="cr-out" id="tt-out"></div>';
  updateTot();
}
function updateTot(){
  var s=totState, t1=Math.round(s.x1/s.m1*1000)/10, t2=Math.round(s.x2/s.m2*1000)/10, ch=(t2-t1)/t1*100;
  var r=function(x){return (Math.round(x*10)/10).toFixed(1);};
  var h='<span class="label">Terms of trade</span>'
    + '<span class="sum">Year 1: '+s.x1+' ÷ '+s.m1+' × 100 = '+r(t1)+'</span>'
    + '<span class="sum">Year 2: '+s.x2+' ÷ '+s.m2+' × 100 = '+r(t2)+'</span>'
    + '<span class="sum">Change: ('+r(t2)+' − '+r(t1)+') ÷ '+r(t1)+' × 100</span>'
    + '<span class="big">'+(ch>=0?'+':'−')+Math.abs(Math.round(ch*100)/100).toFixed(2)+'%</span>';
  if(Math.abs(ch)<0.005) h+='<span>No change in the terms of trade.</span>';
  else if(ch>0) h+='<span>An improvement: the same volume of exports now pays for more imports.</span>';
  else h+='<span>A deterioration: the country has to export more to afford the same imports.</span>';
  document.getElementById('tt-out').innerHTML=h;
}

/* ---------- Marshall-Lerner ---------- */
var mlState = {x:0.3,m:0.4};
function renderML(){
  panel.innerHTML='<div class="panel-head"><strong>Price elasticity of demand</strong></div>'
    + '<div class="minis"><span>Try</span>'
    + '<button type="button" class="chip mini" id="ml-short" data-ml="0.3,0.4">Short run</button>'
    + '<button type="button" class="chip mini" id="ml-long" data-ml="0.9,0.8">Long run</button></div>'
    + '<div class="slide"><label for="ml-x">Exports (PED<sub>X</sub>)</label><input id="ml-x" type="range" min="0" max="2" step="0.1" value="'+mlState.x+'"><b id="ml-xv"></b></div>'
    + '<div class="slide"><label for="ml-m">Imports (PED<sub>M</sub>)</label><input id="ml-m" type="range" min="0" max="2" step="0.1" value="'+mlState.m+'"><b id="ml-mv"></b></div>'
    + '<div class="cr-out" id="ml-out"></div>';
  updateML();
}
function updateML(){
  var x=mlState.x, m=mlState.m, sum=Math.round((x+m)*10)/10;
  document.getElementById('ml-xv').textContent=x.toFixed(1);
  document.getElementById('ml-mv').textContent=m.toFixed(1);
  var h='<span class="label">PED<sub>X</sub> + PED<sub>M</sub></span><span class="big">'+sum.toFixed(1)+'</span>'
    + '<span class="sum">'+x.toFixed(1)+' + '+m.toFixed(1)+' = '+sum.toFixed(1)+'</span>';
  if(sum>1) h+='<span><b>The condition holds.</b> Quantities respond enough for a depreciation to improve the current account.</span>';
  else if(sum<1) h+='<span><b>The condition fails.</b> Demand is too inelastic, so a depreciation makes the current account worse.</span>';
  else h+='<span><b>Exactly 1.</b> A depreciation leaves the current account unchanged.</span>';
  document.getElementById('ml-out').innerHTML=h;
}

/* =====================================================================
   THEME 3 DIAGRAMS: growth, revenue, costs, scale, profit, efficiency,
   objectives and barriers. Same cost model (FIRM / MONO) as the market
   structure diagrams, so every MC still cuts AC at its lowest point.
   ===================================================================== */
/* push a row of label positions apart (sorted ascending), keeping their centre */
function spreadN(a,gap){
  var b=a.slice(), n=b.length, i, s0=0, s1=0;
  for(i=1;i<n;i++) if(b[i]<b[i-1]+gap) b[i]=b[i-1]+gap;
  for(i=0;i<n;i++){ s0+=a[i]; s1+=b[i]; }
  var sh=(s1-s0)/n; for(i=0;i<n;i++) b[i]-=sh;
  return b;
}
function seg(g,q0,p0,q1,p1,cls,style){return '<path class="'+cls+'"'+(style?' style="'+style+'"':'')+' d="M'+r1(g.X(q0))+' '+r1(g.Y(p0))+'L'+r1(g.X(q1))+' '+r1(g.Y(p1))+'"/>';}
function arrowPx(x0,y0,x1,y1,cls,h){
  var dx=x1-x0, dy=y1-y0, L=Math.sqrt(dx*dx+dy*dy)||1, ux=dx/L, uy=dy/L; h=Math.min(h||9,L); var w=h*0.55, bx=x1-ux*h, by=y1-uy*h;
  return '<path class="'+cls+'" d="M'+r1(x0)+' '+r1(y0)+'L'+r1(x1)+' '+r1(y1)+'M'+r1(bx-uy*w)+' '+r1(by+ux*w)+'L'+r1(x1)+' '+r1(y1)+'L'+r1(bx+uy*w)+' '+r1(by-ux*w)+'"/>';
}
/* a double-headed arrow marking the gap between two values at one output */
function gapArrow(g,q,p0,p1,cls){
  var x=g.X(q), a=g.Y(p0), b=g.Y(p1), m=(a+b)/2;
  return arrowPx(x,m,x,a+(a<b?2:-2),cls,7)+arrowPx(x,m,x,b+(b<a?2:-2),cls,7);
}
function clipLo(fn,lo,hi,top){ return fn(lo)<=top ? lo : bisect(function(q){return fn(q)-top;},lo,hi); }
function clipHi(fn,lo,hi,top){ return fn(hi)<=top ? hi : bisect(function(q){return fn(q)-top;},lo,hi); }
function avcF(m,q){var Q=q+m.dx; return m.c+m.k*(Q-m.q1)*(Q-m.q1)+m.dy;}

/* ---------- business growth: who takes over whom ---------- */
var CHAIN_BOX={
  cotton:{name:'Cotton producer',role:'raw materials',c:1,r:0},
  nike:{name:'Nike',role:'makes sportswear',c:1,r:1},
  adidas:{name:'Adidas',role:'a rival',c:2,r:1},
  jd:{name:'JD Sports',role:'a retailer',c:1,r:2},
  peloton:{name:'Peloton',role:'fitness bikes',c:0,r:1}
};
var CHAIN_TO={gr_horiz:'adidas',gr_fwd:'jd',gr_back:'cotton',gr_cong:'peloton'};
var CHAIN_LAB={adidas:'horizontal',jd:'forward vertical',cotton:'backward vertical',peloton:'conglomerate'};
function renderChain(){
  var g=kit({axes:false}), W=g.W, H=g.H, sm=g.small, id=curId(), v=V[id];
  var te=v.anim?ease(state.t):1, to=CHAIN_TO[id], k;
  var cx=[W*0.135,W*0.5,W*0.865], cy=[H*0.16,H*0.5,H*0.84];
  var wSide=W*0.23, wMid=Math.min(W*0.34,240), bh=sm?46:58, fl=sm?13:15;
  function bx(key){var b=CHAIN_BOX[key], w=b.c===1?wMid:wSide; return {x0:cx[b.c]-w/2,x1:cx[b.c]+w/2,y0:cy[b.r]-bh/2,y1:cy[b.r]+bh/2,x:cx[b.c],y:cy[b.r]};}
  var n=bx('nike'), lines='', boxes='', labs='';
  function ends(key){
    var b=bx(key), B=CHAIN_BOX[key];
    if(B.r<1) return [n.x,n.y0-4,b.x,b.y1+4];
    if(B.r>1) return [n.x,n.y1+4,b.x,b.y0-4];
    if(B.c>1) return [n.x1+4,n.y,b.x0-4,b.y];
    return [n.x0-4,n.y,b.x1+4,b.y];
  }
  for(k in CHAIN_BOX){
    if(k==='nike') continue;
    var e=ends(k), on=(k===to), B=CHAIN_BOX[k], lx, ly, anc;
    if(!on) lines+='<path class="guide muted" d="M'+r1(e[0])+' '+r1(e[1])+'L'+r1(e[2])+' '+r1(e[3])+'"/>';
    else if(te>0.04) lines+=arrowPx(e[0],e[1],e[0]+(e[2]-e[0])*te,e[1]+(e[3]-e[1])*te,'curve c-ar',sm?10:12);
    if(B.r!==1){ lx=n.x+(sm?9:13); ly=(e[1]+e[3])/2+5; anc='start'; }
    /* side links: label above the boxes, or below them on a phone, where the top label would meet "backward vertical" */
    else { lx=(e[0]+e[2])/2; ly=sm ? n.y1+fl+4 : n.y0-12; anc='middle'; }
    labs+='<text x="'+r1(lx)+'" y="'+r1(ly)+'" text-anchor="'+anc+'" font-size="'+fl+'" class="'+(on?'bold t-ar halo':'t-muted halo')+'">'+esc(CHAIN_LAB[k])+'</text>';
  }
  for(k in CHAIN_BOX){
    var b=bx(k), Bx=CHAIN_BOX[k], w=r1(b.x1-b.x0);
    boxes+='<rect class="cbox'+(k==='nike'?' me':'')+'" x="'+r1(b.x0)+'" y="'+r1(b.y0)+'" width="'+w+'" height="'+bh+'" rx="6"/>';
    if(k===to && te>0.02) boxes+='<rect class="cbox on" x="'+r1(b.x0)+'" y="'+r1(b.y0)+'" width="'+w+'" height="'+bh+'" rx="6" style="opacity:'+r1(te)+'"/>';
    boxes+='<text x="'+r1(b.x)+'" y="'+r1(b.y-(sm?3:4))+'" text-anchor="middle" font-size="'+(sm?14:17)+'" class="bold">'+esc(Bx.name)+'</text>'
      + '<text x="'+r1(b.x)+'" y="'+r1(b.y+(sm?14:18))+'" text-anchor="middle" font-size="'+(sm?11:13)+'" class="role">'+esc(Bx.role)+'</text>';
  }
  g.out('',lines,boxes,labs,'');
}

/* ---------- revenue ---------- */
function renderRev(){
  var id=curId(), v=V[id], te=v.anim?ease(state.t):1, a=100, b=0.85, qMid=a/(2*b), qEnd=a/b;
  function ar(q){return a-b*q;}
  function mr(q){return a-2*b*q;}
  if(id==='rv_tr' || id==='rv_taker'){
    var taker=(id==='rv_taker'), P=60;
    var gl=kit({n:2,i:0,head:taker?'Price taker':'Price maker',ytitle:'Price / revenue',pmin:MR_FLOOR}), X=gl.X, Y=gl.Y, fs=gl.fs;
    var c='', l='', gd='', nt='';
    if(taker){
      c+=seg(gl,0,P,116,P,'curve c-ar');
      l+=gl.txt(X(116),Y(P)-9,'D = AR = MR','bold t-ar halo','end');
      nt+=gl.axP(Y(P),'P_1');
    } else {
      var qNow=2+(114-2)*te;
      c+='<path class="curve c-ar" d="'+gl.path(ar,0,116)+'"/><path class="curve c-mr" d="'+gl.path(mr,0,mrQ(a,b))+'"/>';
      l+=gl.txt(X(92)+5,Y(ar(92))-6,'AR','bold t-ar halo')+gl.txt(X(37)-6,Y(35),'MR','bold t-mr halo','end');
      if(te<1){ gd+=gl.dot(qNow,ar(qNow),'eff'); if(qNow<mrQ(a,b)) gd+=gl.dot(qNow,mr(qNow),'eff'); }
      else { gd+=gl.vline(qMid,ar(qMid),'muted')+gl.dot(qMid,0); nt+=gl.axQ(X(qMid)-9,'Q_1')+gl.txt(X(qMid)+7,Y(0)-9,'MR = 0','halo t-mr bold'); }
    }
    var inner=gl.compose('',c,gd,l,nt);
    var trTop=taker?P*116:a*a/(4*b);
    var gr=kit({n:2,i:1,head:'Total revenue',ytitle:'Total revenue',pmax:trTop*(taker?1.08:1.3)}); X=gr.X; Y=gr.Y;
    c=''; l=''; gd=''; nt='';
    if(taker){
      c+=seg(gr,0,0,116,P*116,'curve c-ac');
      l+=gr.txt(X(104),Y(P*104)-10,'TR','bold t-ac halo','end');
      nt+=gr.leader(['slope = price'], 34, trTop*0.86, 62, P*62);
    } else {
      var tr=function(q){return q*ar(q);}, qe=2+(114-2)*te;
      c+='<path class="curve c-ac" d="'+gr.path(tr,0,qe)+'"/>';
      if(te<1) gd+=gr.dot(qe,tr(qe),'eff');
      else {
        l+=gr.txt(X(108),Y(tr(108))-10,'TR','bold t-ac halo');
        gd+=gr.vline(qMid,trTop,'muted')+gr.dot(qMid,trTop);
        nt+=gr.axQ(X(qMid),'Q_1')+gr.txt(X(qMid),Y(trTop)-11,'highest TR','bold halo','middle');
      }
    }
    inner+=gr.compose('',c,gd,l,nt);
    wrapSvg(gl,inner);
    return;
  }
  var g=kit({ytitle:'Price / revenue',pmin:MR_FLOOR}), X=g.X, Y=g.Y, fs=g.fs, sm=g.small;
  var curves='<path class="curve c-ar" d="'+g.path(ar,0,116)+'"/>', labels='', guides='', notes='';
  labels+=g.txt(X(116),Y(ar(116))-12,sm?'AR':'AR = D','bold t-ar halo','end');
  if(id==='rv_armr'){
    curves+='<path class="curve c-mr" d="'+g.path(mr,0,mrQ(a,b))+'"/>';
    labels+=g.txt(X(45)+7,Y(mr(45))-7,'MR','bold t-mr halo');   /* above the line, right of the Q1 guide */
    var q1=30;
    guides+=g.guide(q1,ar(q1))+g.dot(q1,ar(q1))+g.dot(q1,mr(q1))+g.dot(qMid,0);
    notes+=g.axP(Y(ar(q1)),'P_1')+g.axQ(X(q1),'Q_1')+g.txt(X(qMid)+9,Y(0)-10,'MR = 0','halo t-mr bold');
    notes+=g.leader(['MR is below AR'], sm?62:60, 74, q1+0.6, (ar(q1)+mr(q1))/2);
    notes+='<path class="gap" d="M'+r1(X(q1))+' '+r1(Y(ar(q1))+6)+'V'+r1(Y(mr(q1))-6)+'"/>';
  }
  else if(id==='rv_ped'){
    curves+='<path class="curve c-mr ghost" d="'+g.path(mr,0,mrQ(a,b))+'"/>';
    labels+=g.txt(X(37)-8,Y(35),'MR','bold t-mr halo','end');
    guides+=g.guide(qMid,a/2,'eff')+g.dot(qMid,a/2,'eff')+g.dot(qMid,0);
    notes+=g.txt(X(qMid)+12,Y(a/2)-8,sm?'PED = 1':'unit elastic: PED = 1','bold t-eff halo');
    var dx=X(qEnd)-X(0), dy=Y(0)-Y(a), L=Math.sqrt(dx*dx+dy*dy), nx=dy/L, ny=-dx/L;
    var brace=function(q0,q1,side,off){
      var ax=X(q0)+side*nx*off, ay=Y(ar(q0))+side*ny*off, bx2=X(q1)+side*nx*off, by=Y(ar(q1))+side*ny*off, t=6;
      return '<path class="leader" d="M'+r1(ax-side*nx*t)+' '+r1(ay-side*ny*t)+'L'+r1(ax)+' '+r1(ay)+'L'+r1(bx2)+' '+r1(by)+'L'+r1(bx2-side*nx*t)+' '+r1(by-side*ny*t)+'"/>';
    };
    notes+=brace(3,qMid-3,1,14)+brace(qMid+3,114,-1,14);
    var qa=(qMid)/2, qb=(qMid+114)/2;
    var ex=X(qa)+nx*28, ey=Y(ar(qa))+ny*28, ix=X(qb)-nx*28, iy=Y(ar(qb))-ny*28+fs*0.6;
    if(sm){ notes+=g.txt2(ex,ey,'elastic','PED > 1','bold halo','start')+g.txt2(ix,iy,'inelastic','PED < 1','bold halo','end'); }
    else { notes+=g.txt(ex,ey,'elastic: PED > 1','bold halo','start')+g.txt(ix,iy,'inelastic: PED < 1','bold halo','end'); }
  }
  g.out('',curves,guides,labels,notes);
}

/* ---------- short-run costs ---------- */
function renderCost(){
  var id=curId(), m=FIRM, rm=rangeMC(m);
  function avc(q){return avcF(m,q);}
  function mcF(q){return MC(m,q);}
  if(id==='co_dr'){
    var mp=function(L){return 3.6*L-0.045*L*L;}, ap=function(L){return 1.8*L-0.015*L*L;};
    var gl=kit({n:2,i:0,head:'Output per worker',ytitle:'Product',xtitle:'Workers'}), X=gl.X, Y=gl.Y;
    var c='<path class="curve c-ar" d="'+gl.path(mp,0,80)+'"/><path class="curve c-mr" d="'+gl.path(ap,0,116)+'"/>';
    var l=gl.txt(X(80)+5,Y(5),'MP','bold t-ar halo')+gl.txt(X(116),Y(ap(116))-9,'AP','bold t-mr halo','end');
    var gd=gl.vline(40,72,'muted')+gl.dot(40,72)+gl.dot(60,54);
    var nt=gl.txt(X(40),Y(72)-10,'MP peaks','bold halo','middle');
    var inner=gl.compose('',c,gd,l,nt);
    var gr=kit({n:2,i:1,head:'Costs',ytitle:'Costs',xtitle:'Output'}); X=gr.X; Y=gr.Y;
    var qmin=2*m.q1/3, cmin=MC(m,qmin);
    c='<path class="curve c-mc" d="'+gr.path(mcF,rm[0],rm[1])+'"/><path class="curve c-mr" d="'+gr.path(avc,4,116)+'"/>';
    l=gr.txt(X(rm[1])-9,Y(MC(m,rm[1]))+13,'MC','bold t-mc halo','end')+gr.txt(X(116),Y(avc(116))-9,'AVC','bold t-mr halo','end');
    gd=gr.vline(qmin,cmin,'muted')+gr.dot(qmin,cmin)+gr.dot(m.q1,m.c);
    nt=gr.leader(['MC lowest'], 82, 7, qmin+1, cmin);
    inner+=gr.compose('',c,gd,l,nt);
    wrapSvg(gl,inner);
    return;
  }
  if(id==='co_total'){
    var pm=8000, top=pm*PTOP/PMAX;
    var g=kit({pmax:pm,ytitle:'Costs'}), X2=g.X, Y2=g.Y;
    var tvc=function(q){return q*avc(q);}, tc=function(q){return m.F+tvc(q);};
    var e1=clipHi(tc,0,116,top), e2=clipHi(tvc,0,116,top);
    var curves=seg(g,0,m.F,116,m.F,'curve c-ar')+'<path class="curve c-mr" d="'+g.path(tvc,0,e2)+'"/><path class="curve c-ac" d="'+g.path(tc,0,e1)+'"/>';
    var labels=g.txt(X2(116),Y2(m.F)-9,'TFC','bold t-ar halo','end')
      + g.txt(X2(e1)-8,Y2(tc(e1))+5,'TC','bold t-ac halo','end')
      + g.txt(X2(e2)+7,Y2(tvc(e2))+5,'TVC','bold t-mr halo');
    var notes=gapArrow(g,28,tvc(28),tc(28),'leader')+gapArrow(g,76,tvc(76),tc(76),'leader');
    notes+=g.txt(X2(28)+7,(Y2(tvc(28))+Y2(tc(28)))/2+5,'TFC','bold halo')+g.txt(X2(76)+7,(Y2(tvc(76))+Y2(tc(76)))/2+5,'TFC','bold halo');
    g.out('',curves,'',labels,notes);
    return;
  }
  var g2=kit(), X3=g2.X, Y3=g2.Y, sm=g2.small;
  if(id==='co_avg'){
    var afc=function(q){return m.F/q;}, atc=function(q){return afc(q)+avc(q);};
    var sA=clipLo(atc,3,60,PTOP), sF=clipLo(afc,3,60,PTOP);
    var cv='<path class="curve c-ar" d="'+g2.path(afc,sF,116)+'"/><path class="curve c-mr" d="'+g2.path(avc,4,116)+'"/>'
      + '<path class="curve c-ac" d="'+g2.path(atc,sA,116)+'"/><path class="curve c-mc" d="'+g2.path(mcF,rm[0],rm[1])+'"/>';
    var lb=g2.txt(X3(116),Y3(atc(116))-9,'ATC','bold t-ac halo','end')+g2.txt(X3(116),Y3(avc(116))-9,'AVC','bold t-mr halo','end')
      + g2.txt(X3(116),Y3(afc(116))-9,'AFC','bold t-ar halo','end')+g2.txt(X3(rm[1])-9,Y3(MC(m,rm[1]))+13,'MC','bold t-mc halo','end');
    var qe=bisect(function(q){return MC(m,q)-AC(m,q);},30,110);
    g2.out('',cv,g2.dot(m.q1,m.c)+g2.dot(qe,AC(m,qe)),lb,'');
    return;
  }
  /* co_mcac */
  var cc=g2.costs(m,m,null), qe2=bisect(function(q){return MC(m,q)-AC(m,q);},30,110), ce2=AC(m,qe2);
  var gds=g2.vline(qe2,ce2,'muted')+g2.dot(qe2,ce2,'eff');
  /* both notes sit in the empty band under AC, either side of its lowest point */
  var nts=g2.txt2(X3(sm?32:30),Y3(sm?38:34),'MC below AC:','AC falls','bold halo','middle')
    + g2.txt2(X3(92),Y3(sm?38:34),'MC above AC:','AC rises','bold halo','middle');
  g2.out('',cc.curves,gds,cc.labels,nts);
}

/* ---------- long-run average cost (scale) and barriers that use it ---------- */
var LR={A:300,c:20,k:0.018,q0:58};
function LRAC(q,d){return LR.A/q+LR.c+LR.k*(q-LR.q0)*(q-LR.q0)+(d||0);}
function renderLRAC(){
  var id=curId(), v=V[id], t=v.anim?state.t:1, te=v.anim?ease(state.t):1;
  var g=kit({ytitle:'Costs'}), X=g.X, Y=g.Y, fs=g.fs, sm=g.small;
  var curves='', labels='', guides='', notes='';
  var qMES=bisect(function(q){return -LR.A/(q*q)+2*LR.k*(q-LR.q0);},20,100), cMES=LRAC(qMES);
  function lr(d,cls){
    var f=function(q){return LRAC(q,d);}, s=clipLo(f,3,50,PTOP), e=clipHi(f,70,116,PTOP);
    return {d:'<path class="curve c-ac'+(cls||'')+'" d="'+g.path(f,s,e)+'"/>', s:s, e:e, f:f};
  }
  function lrLabel(L0){ return g.txt(X(L0.e),Y(L0.f(L0.e))-10,'LRAC','bold t-ac halo','end'); }
  if(id==='sc_fall'){
    var f=function(q){return 600/q+6+120/Math.sqrt(q);}, s=clipLo(f,3,40,PTOP);
    curves+='<path class="curve c-ac" d="'+g.path(f,s,116)+'"/>';
    labels+=g.txt(X(116),Y(f(116))-10,'LRAC','bold t-ac halo','end');
    notes+=g.leader(['economies of scale','never run out'], sm?66:70, 70, 84, f(84));
  }
  else if(id==='sc_lrac'){
    var L0=lr(0); curves+=L0.d; labels+=lrLabel(L0);
    guides+=g.vline(qMES,cMES,'eff')+g.dot(qMES,cMES,'eff');
    notes+=g.axQ(X(qMES),'MES','t-eff');
    notes+=g.leader(['economies','of scale'], 34, 90, 26, LRAC(26));
    notes+=g.leader(['diseconomies','of scale'], sm?81:88, 90, 97, LRAC(97));
  }
  else if(id==='sc_ext' || id==='sc_extdis'){
    var d1=v.shiftL*te, base=lr(0,' ghost'), now=lr(d1), up=v.shiftL>0;
    curves+=base.d+now.d;
    /* the higher curve is labelled above its right end, the lower one under its lowest point
       (a label under a rising curve's end would be crossed by the curve) */
    var hi=up?now:base, lo=up?base:now, dl=up?0:d1;
    labels+=g.txt(X(hi.e),Y(hi.f(hi.e))-9,up?'LRAC_2':'LRAC_1','bold t-ac halo','end');
    labels+=g.txt(X(qMES),Y(cMES+dl)+fs+8,up?'LRAC_1':'LRAC_2','bold t-ac halo','middle');
    if(Math.abs(d1)>3) notes+=arrowPx(X(qMES),Y(cMES)+(up?-3:3),X(qMES),Y(cMES+d1)+(up?3:-3),'leader',8);
  }
  else if(id==='sc_env'){
    var mm=0.04, s1q=28, s2q=48, L1=lr(0);
    var S=function(qi){return function(q){return LRAC(q)+mm*(q-qi)*(q-qi);};};
    curves+=L1.d; labels+=lrLabel(L1);
    [[76,62,90],[94,80,108]].forEach(function(r){ curves+='<path class="curve c-mc ghost" d="'+g.path(S(r[0]),r[1],r[2])+'"/>'; });
    var f1=S(s1q), f2=S(s2q);
    curves+='<path class="curve c-mc" d="'+g.path(f1,14,42)+'"/><path class="curve c-mc" d="'+g.path(f2,30,66)+'"/>';
    labels+=g.txt(X(14)+4,Y(f1(14))-8,'SRAC_1','bold t-mc halo')+g.txt(X(30)+4,Y(f2(30))-8,'SRAC_2','bold t-mc halo');
    var Q1=s1q, C1=LRAC(Q1), Q2=31, C2=f2(Q2), Q3=s2q, C3=LRAC(Q3), pq, pp, u;
    if(t<0.5){ u=ease(t/0.5); pq=Q1+(Q2-Q1)*u; pp=C1+(C2-C1)*u; }
    else { u=ease((t-0.5)/0.5); pq=Q2+(Q3-Q2)*u; pp=f2(pq); }
    var cy=spreadN([Y(C2),Y(C1),Y(C3)],fs+7), qx=spreadN([X(Q1),X(Q2),X(Q3)],fs*1.7);
    guides+=g.guide(Q1,C1)+g.dot(Q1,C1); notes+=g.axP(cy[1],'C_1')+g.axQ(qx[0],'Q_1');
    if(t>=0.5){ guides+=g.guide(Q2,C2,'muted')+g.dot(Q2,C2,'muted'); notes+=g.axP(cy[0],'C_2','t-muted')+g.axQ(qx[1],'Q_2','t-muted'); }
    if(t>=1){ guides+=g.guide(Q3,C3,'eff')+g.dot(Q3,C3,'eff'); notes+=g.axP(cy[2],'C_3','t-eff')+g.axQ(qx[2],'Q_3','t-eff'); }
    if(t>0 && t<1) guides+=g.dot(pq,pp,'eff');
  }
  else if(id==='br_eos' || id==='br_limit'){
    var L2=lr(0); curves+=L2.d; labels+=lrLabel(L2);
    var QI=qMES, CI=cMES, QE=16, CE=LRAC(QE);
    guides+=g.guide(QI,CI)+g.dot(QI,CI)+g.guide(QE,CE)+g.dot(QE,CE);
    notes+=g.txt(X(QI),Y(CI)+fs+8,'incumbent','bold halo','middle')+g.txt(X(QE)+10,Y(CE)+5,'new firm','bold halo');
    var qx2=spreadN([X(QE),X(QI)],fs*1.7);
    notes+=g.axQ(qx2[0],'Q_E')+g.axQ(qx2[1],'Q_I');
    if(id==='br_eos'){
      var P=50;
      curves+=seg(g,0,P,116,P,'curve c-ar');
      var py=spreadN([Y(CE),Y(P),Y(CI)],fs+7);
      notes+=g.axP(py[0],'C_E')+g.axP(py[1],'P','t-ar')+g.axP(py[2],'C_I');
    } else {
      var P1=82, PL=66, p=P1+(PL-P1)*te;
      if(te>0.02) curves+=seg(g,0,P1,116,P1,'curve c-ar ghost');
      curves+=seg(g,0,p,116,p,'curve c-ar');
      var py2=spreadN([Y(P1),Y(CE),Y(p),Y(CI)],fs+7);
      notes+=g.axP(py2[0],'P_1',te>0.5?'t-muted':'')+g.axP(py2[1],'C_E')+(te>0.5?g.axP(py2[2],'P_L','t-ar'):'')+g.axP(py2[3],'C_I');
    }
  }
  g.out('',curves,guides,labels,notes);
}

/* ---------- profit ---------- */
function renderProfits(){
  var id=curId(), m=FIRM, rm=rangeMC(m), ra=rangeAC(m);
  function mcF(q){return MC(m,q);}
  function acF(q){return AC(m,q);}
  function avc(q){return avcF(m,q);}
  if(id==='pf_types'){
    var qT=44, b=m.F/(qT*qT)-2*m.k*(qT-m.q1), aN=AC(m,qT)+b*qT;
    var small=(plot.clientWidth||640)<480;
    var specs=[{a:aN+18,head:small?'Supernormal':'Supernormal profit'},{a:aN,head:small?'Normal':'Normal profit'},{a:aN-14,head:small?'Loss':'Economic loss'}];
    var inner='', first=null;
    specs.forEach(function(s,i){
      var g=kit({n:3,i:i,qmax:100,head:s.head,ytitle:small?'£':'Costs / revenue',pmin:MR_FLOOR}), X=g.X, Y=g.Y, fs=g.fs;
      if(!first) first=g;
      var A=s.a, q=bisect(function(x){return A-2*b*x-MC(m,x);},20,80), p=A-b*q, c=AC(m,q);
      var arEnd=Math.min(98,(A-3)/b);
      var curves='<path class="curve c-ar" d="M'+r1(X(0))+' '+r1(Y(A))+'L'+r1(X(arEnd))+' '+r1(Y(A-b*arEnd))+'"/>'
        + '<path class="curve c-mr" d="M'+r1(X(0))+' '+r1(Y(A))+'L'+r1(X(mrQ(A,b,98)))+' '+r1(Y(A-2*b*mrQ(A,b,98)))+'"/>'
        + '<path class="curve c-mc" d="'+g.path(mcF,rm[0],Math.min(rm[1],98))+'"/>'
        + '<path class="curve c-ac" d="'+g.path(acF,ra[0],98)+'"/>';
      /* MR: just right of where it cuts the axis, high enough to clear the axis arrowhead in the first panel */
      var labels=g.txt(X(arEnd),Y(A-b*arEnd)-8,'AR','bold t-ar halo','end')+g.txt(X(A/(2*b))+4,Y(0)-7,'MR','bold t-mr halo')
        + g.txt(X(98),Y(AC(m,98))-8,'AC','bold t-ac halo','end')+g.txt(X(rm[1])-6,Y(MC(m,rm[1]))+12,'MC','bold t-mc halo','end');
      var areas='', guides=g.guide(q,Math.max(p,c))+g.dot(q,p)+g.dot(q,MC(m,q)), notes=g.axQ(X(q),'Q');
      if(i===1) notes+=g.axP(Y(p),'P');
      else {
        areas+=g.box(0,q,Math.min(p,c),Math.max(p,c),'area '+(i===0?'a-profit':'a-cost'));
        guides+=g.hline(q,Math.min(p,c))+g.dot(q,c);
        var py=spread(Y(p),Y(c),fs+6);
        notes+=g.axP(py[0],'P')+g.axP(py[1],'C');
      }
      inner+=g.compose(areas,curves,guides,labels,notes);
    });
    wrapSvg(first,inner);
    return;
  }
  if(id==='pf_max'){
    var P=62, q1=bisect(function(q){return MC(m,q)-P;},45,90);
    var tc=function(q){return m.F+q*avc(q);}, trF=function(q){return P*q;};
    var pm=7600, top=pm*PTOP/PMAX;
    var gl=kit({n:2,i:0,pmax:pm,head:'Total revenue and cost',ytitle:'TR, TC'}), X=gl.X, Y=gl.Y, fs=gl.fs;
    var eTR=clipHi(trF,0,116,top), eTC=clipHi(tc,0,116,top);
    var c=seg(gl,0,0,eTR,trF(eTR),'curve c-ar')+'<path class="curve c-ac" d="'+gl.path(tc,0,eTC)+'"/>';
    var l=gl.txt(X(24),Y(trF(24))+fs+5,'TR','bold t-ar halo')+gl.txt(X(eTC)-7,Y(top)+13,'TC','bold t-ac halo','end');
    var gd=gl.vline(q1,trF(q1),'muted')+gl.dot(q1,trF(q1))+gl.dot(q1,tc(q1));
    var nt=gapArrow(gl,q1,tc(q1),trF(q1),'leader eff')+gl.axQ(X(q1),'Q_1')
      + gl.leader(['biggest','profit'], 30, pm*0.8, q1-0.4, (tc(q1)+trF(q1))/2, 't-eff');
    var inner2=gl.compose('',c,gd,l,nt);
    var gr=kit({n:2,i:1,head:'Marginal revenue and cost',ytitle:'Costs / revenue'}); X=gr.X; Y=gr.Y;
    c=seg(gr,0,P,116,P,'curve c-ar')+'<path class="curve c-mc" d="'+gr.path(mcF,rm[0],rm[1])+'"/>';
    l=gr.txt(X(116),Y(P)-9,'MR','bold t-ar halo','end')+gr.txt(X(rm[1])-9,Y(MC(m,rm[1]))+13,'MC','bold t-mc halo','end');
    gd=gr.vline(q1,P)+gr.dot(q1,P);
    nt=gr.axQ(X(q1),'Q_1')+gr.txt(X(30),Y(P)+fs+8,'MR > MC','bold halo','middle')+gr.txt(X(98),Y(P)+fs+8,'MC > MR','bold halo','middle');
    inner2+=gr.compose('',c,gd,l,nt);
    wrapSvg(gl,inner2);
    return;
  }
  /* pf_stay and pf_shut: price taker with MC, ATC and AVC */
  var g=kit(), X2=g.X, Y2=g.Y, fs2=g.fs, sm=g.small;
  var curves='<path class="curve c-mc" d="'+g.path(mcF,rm[0],rm[1])+'"/><path class="curve c-ac" d="'+g.path(acF,ra[0],ra[1])+'"/>'
    + '<path class="curve c-mr" d="'+g.path(avc,4,104)+'"/>';
  var labels=g.txt(X2(rm[1])-9,Y2(MC(m,rm[1]))+13,'MC','bold t-mc halo','end')
    + g.txt(X2(ra[1]),Y2(AC(m,ra[1]))-9,'ATC','bold t-ac halo','end')
    + g.txt(X2(104)+6,Y2(avc(104))+5,'AVC','bold t-mr halo');
  var areas='', guides='', notes='';
  if(id==='pf_stay'){
    var P2=32, q=bisect(function(x){return MC(m,x)-P2;},40,90), c=AC(m,q), vv=avc(q);
    curves+=seg(g,0,P2,116,P2,'curve c-ar');
    labels+=g.txt(X2(116),Y2(P2)-9,'AR = MR','bold t-ar halo','end');
    areas+=g.box(0,q,P2,c,'area a-cost')+g.box(0,q,vv,P2,'area a-gain');
    guides+=g.vline(q,c)+g.hline(q,c)+g.hline(q,vv)+g.dot(q,P2)+g.dot(q,c)+g.dot(q,vv);
    notes+=g.axP(Y2(P2),'P_1')+g.axQ(X2(q),'Q_1');
    notes+=g.txt(X2(q/2),(Y2(P2)+Y2(c))/2+5,((plot.clientWidth||640)<480)?'loss':'economic loss','bold','middle');
    notes+=sm ? g.txt(X2(q/2),(Y2(P2)+Y2(vv))/2+5,'to fixed costs','bold','middle')
              : g.txt2(X2(q/2),(Y2(P2)+Y2(vv))/2-fs2*0.2,'pays part of the','fixed costs','bold','middle');
  } else {
    var qa=bisect(function(x){return MC(m,x)-AC(m,x);},30,110), pa=AC(m,qa), qv=m.q1, pv=m.c;
    guides+=g.hline(qa,pa,'eff')+g.dot(qa,pa,'eff')+g.hline(qv,pv)+g.dot(qv,pv);
    notes+=g.axP(Y2(pa),'P_1','t-eff')+g.axP(Y2(pv),'P_2');
    notes+=g.leader(sm?['long-run','shut-down point']:['long-run shut-down point'], sm?42:38, 95, qa, pa, 't-eff');
    notes+=g.leader(sm?['short-run','shut-down point']:['short-run shut-down point'], 84, sm?13:9, qv+0.5, pv);
  }
  g.out(areas,curves,guides,labels,notes);
}

/* ---------- objectives: the minimum profit constraint ---------- */
function renderSat(){
  var m=MONO, s=solveMono(m);
  function pi(q){return q*(mAR(q)-AC(m,q));}
  var qa=bisect(pi,5,s.qm), qb=s.qs, top=pi(s.qm);
  var g=kit({qmax:80,pmax:top*1.32,ytitle:'Supernormal profit'}), X=g.X, Y=g.Y, fs=g.fs, sm=g.small;
  var lim=top*0.45, qStar=bisect(function(q){return pi(q)-lim;},s.qm,qb);
  var curves='<path class="curve c-ar" d="'+g.path(pi,qa,qb)+'"/>'+seg(g,0,lim,78,lim,'curve c-mc');
  var tsat=V.ob_sat.anim?ease(state.t):1;
  var guides=g.vline(s.qm,top,'muted')+g.dot(s.qm,top)+g.dot(qb,0);
  var qx=spreadN([X(s.qm),X(qStar),X(qb)],fs*2.4);
  var notes=g.axQ(qx[0],'Q_PM')+g.axQ(qx[2],'Q_VM');
  if(tsat<0.999){ var qz=qb+(qStar-qb)*tsat; guides+=g.dot(qz,pi(qz),'eff'); }
  else { guides+=g.vline(qStar,lim,'eff')+g.dot(qStar,lim,'eff'); notes+=g.axQ(qx[1],'Q_VM*','t-eff'); }
  notes+=g.leader(['minimum profit','constraint'], sm?62:66, top*1.2, 74, lim, '');
  notes+= sm ? g.txt(X(s.qm)-6,Y(top)-11,'most profit','bold halo','end') : g.txt(X(s.qm),Y(top)-11,'most profit','bold halo','middle');
  g.out('',curves,guides,'',notes);
}

/* ---------- efficiency ---------- */
function renderEff(){
  var id=curId(), v=V[id], te=v.anim?ease(state.t):1, m=FIRM;
  if(id==='ef_ppf'){
    var g=kit({ytitle:'Good Y',xtitle:'Good X'}), X=g.X, Y=g.Y, fs=g.fs, r0=80, r=80+20*te;
    var ppf=function(R,cls){ var d='', n=60, i, a; for(i=0;i<=n;i++){ a=Math.PI/2*i/n; d+=(i?'L':'M')+r1(X(R*Math.sin(a)))+' '+r1(Y(R*Math.cos(a))); } return '<path class="curve '+cls+'" d="'+d+'"/>'; };
    var sh=te>0.01, curves=(sh?ppf(r0,'c-ar ghost'):'')+ppf(sh?r:r0,'c-ar');
    var at=function(R,deg){var a=deg*Math.PI/180; return [R*Math.sin(a),R*Math.cos(a)];};
    var p1=at(r0,80), p2=at(r,80);
    var labels=g.txt(X(p1[0])+7,Y(p1[1])+4,sh?'PPF_1':'PPF','bold t-ar halo')+(sh?g.txt(X(p2[0])+7,Y(p2[1])+4,'PPF_2','bold t-ar halo'):'');
    var B=at(r0,45), C=at(r,45);
    var guides=g.dot(34,30,'muted')+g.dot(B[0],B[1]);
    var notes=g.txt(X(34)-10,Y(30)+5,'A','bold halo','end')+g.txt(X(B[0])+8,Y(B[1])-8,'B','bold halo');
    if(sh && te>0.12) notes+=arrowPx(X(B[0])+5,Y(B[1])-5,X(C[0])-4,Y(C[1])+4,'leader eff',8);
    if(te>0.95){ guides+=g.dot(C[0],C[1],'eff'); notes+=g.txt(X(C[0])+8,Y(C[1])-8,'C','bold t-eff halo'); }
    g.out('',curves,guides,labels,notes);
    return;
  }
  var g2=kit(), X2=g2.X, Y2=g2.Y, fs2=g2.fs, sm=g2.small;
  var qe=bisect(function(q){return MC(m,q)-AC(m,q);},30,110), ce=AC(m,qe);
  if(id==='ef_prod'){
    var cc=g2.costs(m,m,null);
    g2.out('',cc.curves,g2.vline(qe,ce,'eff')+g2.dot(qe,ce,'eff'),cc.labels,
      g2.axQ(X2(qe),'Q*','t-eff')+g2.leader(['lowest AC:','MC = AC'], sm?86:82, 24, qe+0.6, ce-0.4, 't-eff'));
    return;
  }
  if(id==='ef_alloc'){
    var d=function(q){return 100-0.8*q;}, s=function(q){return 10+0.75*q;};
    var qs=90/1.55, ps=d(qs), Q1=30, Q2=86;
    var curves=seg(g2,0,100,118,d(118),'curve c-ar')+seg(g2,0,10,118,s(118),'curve c-mc');
    var labels=g2.txt(X2(118),Y2(d(118))-9,sm?'D':'D = AR','bold t-ar halo','end')+g2.txt(X2(110),Y2(s(110))-10,'MC','bold t-mc halo','end');
    var guides=g2.guide(qs,ps,'eff')+g2.dot(qs,ps,'eff')+g2.vline(Q1,d(Q1),'muted')+g2.vline(Q2,s(Q2),'muted');
    var notes='<path class="gap" d="M'+r1(X2(Q1))+' '+r1(Y2(s(Q1)))+'V'+r1(Y2(d(Q1)))+'"/><path class="gap" d="M'+r1(X2(Q2))+' '+r1(Y2(d(Q2)))+'V'+r1(Y2(s(Q2)))+'"/>';
    var qx=spreadN([X2(Q1),X2(qs),X2(Q2)],fs2*1.7);
    notes+=g2.axQ(qx[0],'Q_1')+g2.axQ(qx[1],'Q*','t-eff')+g2.axQ(qx[2],'Q_2')+g2.axP(Y2(ps),'P*','t-eff');
    /* P > MC sits above the P* guide line, MC > P halfway up its gap */
    notes+=g2.txt(X2(Q1)-8,Y2(s(Q1)+(d(Q1)-s(Q1))*0.78)+5,'P > MC','bold halo','end')+g2.txt(X2(Q2)+8,(Y2(d(Q2))+Y2(s(Q2)))/2+5,'MC > P','bold halo');
    g2.out('',curves,guides,labels,notes);
    return;
  }
  if(id==='ef_dyn'){
    /* drawn here rather than with g.costs: AC_2 is labelled at its top-left end, because
       under its rising right-hand end the curve itself would cross the label */
    var now=moved(m,v.shift,te), moving=te>0.02;
    var rb=rangeMC(m), rn=rangeMC(now), ab=rangeAC(m), an=rangeAC(now);
    var mc0=function(q){return MC(m,q);}, ac0=function(q){return AC(m,q);}, mc1=function(q){return MC(now,q);}, ac1=function(q){return AC(now,q);};
    var cv2='', lb2;
    if(moving) cv2+='<path class="curve c-mc ghost" d="'+g2.path(mc0,rb[0],rb[1])+'"/><path class="curve c-ac ghost" d="'+g2.path(ac0,ab[0],ab[1])+'"/>';
    cv2+='<path class="curve c-mc" d="'+g2.path(mc1,rn[0],rn[1])+'"/><path class="curve c-ac" d="'+g2.path(ac1,an[0],an[1])+'"/>';
    if(moving){
      lb2=g2.txt(X2(rb[1])-9,Y2(mc0(rb[1]))+13,'MC_1','bold t-mc halo','end')+g2.txt(X2(rn[1])+9,Y2(mc1(rn[1]))+13,'MC_2','bold t-mc halo')
        + g2.txt(X2(ab[1]),Y2(ac0(ab[1]))-9,'AC_1','bold t-ac halo','end')+g2.txt(X2(an[0])+7,Y2(ac1(an[0]))+13,'AC_2','bold t-ac halo');
    } else lb2=g2.txt(X2(rb[1])-9,Y2(mc0(rb[1]))+13,'MC','bold t-mc halo','end')+g2.txt(X2(ab[1]),Y2(ac0(ab[1]))-9,'AC','bold t-ac halo','end');
    var qe1=bisect(function(q){return MC(now,q)-AC(now,q);},20,110), ce1=AC(now,qe1);
    var gd='', nt='';
    if(moving){
      gd+=g2.hline(qe,ce,'muted')+g2.dot(qe,ce,'muted')+g2.hline(qe1,ce1,'eff')+g2.dot(qe1,ce1,'eff');
      var cy=spread(Y2(ce),Y2(ce1),fs2+9);
      nt+=g2.axP(cy[0],'C_1','t-muted')+g2.axP(cy[1],'C_2','t-eff');
    } else { gd+=g2.hline(qe,ce)+g2.dot(qe,ce); nt+=g2.axP(Y2(ce),'C_1'); }
    g2.out('',cv2,gd,lb2,nt);
    return;
  }
  /* ef_x: actual AC drifts up from attainable AC */
  var dX=18*te, up={c:m.c,k:m.k,q1:m.q1,F:m.F,dx:0,dy:dX}, ra=rangeAC(m), ru=rangeAC(up);
  var cv='<path class="curve c-ac" d="'+g2.path(function(q){return AC(m,q);},ra[0],ra[1])+'"/>';
  if(dX>0.3) cv+='<path class="curve c-mr" d="'+g2.path(function(q){return AC(up,q);},ru[0],ru[1])+'"/>';
  var lb=g2.txt(X2(qe),Y2(ce)+fs2+8,'AC (attainable)','bold t-ac halo','middle');
  /* above the right-hand end of the actual curve: a label inside the U would be crossed by its arms */
  if(te>0.3) lb+=g2.txt(X2(ru[1])-2,Y2(AC(up,ru[1]))-9,'AC (actual)','bold t-mr halo','end');
  var nx2='';
  if(te>0.75){
    nx2+=arrowPx(X2(34),Y2(AC(m,34))-3,X2(34),Y2(AC(up,34))+3,'leader',8)+arrowPx(X2(82),Y2(AC(m,82))-3,X2(82),Y2(AC(up,82))+3,'leader',8);
    nx2+=g2.txt(X2(qe),Y2(ce+dX/2)+5,'X-inefficiency','bold halo','middle');
  }
  g2.out('',cv,'',lb,nx2);
}

/* ---------- predatory pricing: price against time ---------- */
function renderPred(){
  var v=cur(), g=kit({ytitle:'Price',xtitle:'Time'}), X=g.X, Y=g.Y, fs=g.fs, sm=g.small;
  var P1=64, P2=28, P3=82, vR=52, vI=40, t1=36, t2=76, tn=118*(v.anim?ease(state.t):1);
  var d='M'+r1(X(0))+' '+r1(Y(P1));
  if(tn<=t1) d+='H'+r1(X(tn));
  else { d+='H'+r1(X(t1))+'V'+r1(Y(P2)); if(tn<=t2) d+='H'+r1(X(tn)); else d+='H'+r1(X(t2))+'V'+r1(Y(P3))+'H'+r1(X(tn)); }
  var dash='stroke-dasharray:8 6;stroke-width:2.2';
  var curves=seg(g,0,vR,118,vR,'curve c-mc',dash)+seg(g,0,vI,118,vI,'curve c-ac',dash)+'<path class="curve c-ar" d="'+d+'"/>';
  var labels=g.txt(X(118),Y(vR)-8,'rival’s AVC','bold t-mc halo','end')+g.txt(X(118),Y(vI)-8,'incumbent’s AVC','bold t-ac halo','end');
  var areas='', guides='', notes=g.axP(Y(P1),'P_1');
  if(tn>t1){
    areas+=g.box(t1,Math.min(tn,t2),P2,vI,'area a-cost');
    notes+=g.axP(Y(P2),'P_2');
    if(tn>t1+18) notes+=g.txt(X((t1+Math.min(tn,t2))/2),(Y(P2)+Y(vI))/2+5,sm?'loss':'incumbent’s loss','bold','middle');
  }
  if(tn>=t2){
    guides+=g.dot(t2,P2);
    notes+=g.leader(['rival leaves'], t2, 11, t2, P2-1);
  }
  if(tn>t2){
    areas+=g.box(t2,tn,P1,P3,'area a-profit');
    notes+=g.axP(Y(P3),'P_3');
    if(tn>t2+30) notes+=g.txt(X((t2+tn)/2),(Y(P1)+Y(P3))/2+5,sm?'win back':'win back losses','bold','middle');
  }
  g.out(areas,curves,guides,labels,notes);
}

/* =====================================================================
   THEME 3 CALCULATORS (shown in the sheet where the diagram normally goes)
   ===================================================================== */
function money(x){
  var r=Math.round(x*100)/100, a=Math.abs(r), frac=Math.abs(a-Math.round(a))>1e-9;
  return (r<0?'−':'')+'£'+a.toLocaleString('en-GB',{minimumFractionDigits:frac?2:0,maximumFractionDigits:2});
}
function fmtN(x){ return (Math.round(x*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2}); }
function setT(id,s){ var e=document.getElementById(id); if(e) e.textContent=s; }
function cformRow(pre,key,label,val){
  return '<label for="'+pre+'-'+key+'">'+label+'</label><input id="'+pre+'-'+key+'" type="number" inputmode="decimal" min="0" step="any" value="'+val+'">';
}

/* ---------- revenue table ---------- */
var REV_START=[10,9,8,7,6,5,4];
var revState={p:REV_START.slice()};
function renderRevCalc(){
  var h='<div class="panel-head"><strong>Price at each output</strong></div>'
    + '<div class="minis"><span>Reset</span><button type="button" class="chip mini" data-rv="1">Handout prices</button></div>'
    + '<div class="ctable ct-rev"><span class="ch">Q</span><span class="ch">Price</span><span class="ch">TR</span><span class="ch">AR</span><span class="ch">MR</span>';
  for(var i=0;i<revState.p.length;i++){
    h+='<span class="cq">'+(i+1)+'</span><input id="rv-'+i+'" type="number" inputmode="decimal" min="0" step="any" value="'+revState.p[i]+'" aria-label="Price when output is '+(i+1)+'">'
      + '<span class="cv" id="rv-tr-'+i+'"></span><span class="cv" id="rv-ar-'+i+'"></span><span class="cv" id="rv-mr-'+i+'"></span>';
  }
  panel.innerHTML=h+'</div><div class="cr-out" id="rv-out"></div>';
  updateRev();
}
function updateRev(){
  var p=revState.p, n=p.length, tr=[], best=-Infinity, bi=[], i;
  for(i=0;i<n;i++) tr[i]=p[i]*(i+1);
  for(i=0;i<n;i++){ if(tr[i]>best+1e-9){best=tr[i];bi=[i];} else if(Math.abs(tr[i]-best)<1e-9) bi.push(i); }
  for(i=0;i<n;i++){
    var mr=tr[i]-(i?tr[i-1]:0);
    setT('rv-tr-'+i,money(tr[i])); setT('rv-ar-'+i,money(tr[i]/(i+1))); setT('rv-mr-'+i,money(mr));
    document.getElementById('rv-tr-'+i).className='cv'+(bi.indexOf(i)>=0?' hi':'');
  }
  var qs=bi.map(function(x){return x+1;}), last=bi[bi.length-1];
  var h='<span class="label">Total revenue is highest</span><span class="big">'+money(best)+'</span>'
    + '<span class="sum">at Q = '+qs.join(' and Q = ')+'</span>';
  if(qs.length>1) h+='<span>Going from Q = '+qs[0]+' to Q = '+qs[qs.length-1]+' adds nothing to revenue: MR = 0.</span>';
  if(last+1<n){
    var mrNext=tr[last+1]-tr[last];
    if(mrNext<0) h+='<span>At Q = '+(last+2)+', MR turns negative, so selling more lowers total revenue.</span>';
  } else h+='<span>MR is still positive in the last row, so revenue would keep rising if the firm sold more.</span>';
  document.getElementById('rv-out').innerHTML=h;
}

/* ---------- costs ---------- */
var COST_START={fc:228000,vc:429500,q:3750};
var costState={fc:228000,vc:429500,q:3750};
function renderCostCalc(){
  panel.innerHTML='<div class="panel-head"><strong>Costs and output</strong></div>'
    + '<div class="minis"><span>Reset</span><button type="button" class="chip mini" data-cc="1">Chelsea’s Electrics</button></div>'
    + '<div class="cform">'+cformRow('cc','fc','Total fixed cost (£)',costState.fc)+cformRow('cc','vc','Total variable cost (£)',costState.vc)+cformRow('cc','q','Output (units)',costState.q)+'</div>'
    + '<div class="cr-out" id="cc-out"></div>';
  updateCost();
}
function updateCost(){
  var s=costState, tc=s.fc+s.vc, q=s.q, h='<span class="label">Total cost</span><span class="sum">'+money(s.fc)+' + '+money(s.vc)+' = '+money(tc)+'</span>';
  if(q>0){
    h+='<span class="label" style="margin-top:8px">Average total cost</span><span class="big">'+money(tc/q)+'</span>'
      + '<span class="sum">ATC = '+money(tc)+' ÷ '+fmtN(q)+' = '+money(tc/q)+'</span>'
      + '<span class="sum">AVC = '+money(s.vc)+' ÷ '+fmtN(q)+' = '+money(s.vc/q)+'</span>'
      + '<span class="sum">AFC = '+money(s.fc)+' ÷ '+fmtN(q)+' = '+money(s.fc/q)+'</span>'
      + '<span>Check: AFC + AVC = '+money(s.fc/q)+' + '+money(s.vc/q)+' = '+money(tc/q)+', which is ATC.</span>';
  } else h+='<span>Enter an output above zero to work out the averages.</span>';
  document.getElementById('cc-out').innerHTML=h;
}

/* ---------- accounting and economic profit ---------- */
var PC_START={tr:46000,tc:19000,oc:30000};
var pcState={tr:46000,tc:19000,oc:30000};
function renderPCalc(){
  panel.innerHTML='<div class="panel-head"><strong>Tobi’s DJ business, per year</strong></div>'
    + '<div class="minis"><span>Reset</span><button type="button" class="chip mini" data-pc="1">Tobi’s numbers</button></div>'
    + '<div class="cform">'+cformRow('pc','tr','Revenue (£)',pcState.tr)+cformRow('pc','tc','Costs actually paid (£)',pcState.tc)+cformRow('pc','oc','Opportunity cost: the job she gives up (£)',pcState.oc)+'</div>'
    + '<div class="cr-out" id="pc-out"></div>';
  updatePCalc();
}
function updatePCalc(){
  var s=pcState, acc=s.tr-s.tc, eco=acc-s.oc;
  var h='<span class="label">Accounting profit</span><span class="sum">'+money(s.tr)+' − '+money(s.tc)+' = '+money(acc)+'</span>'
    + '<span class="label" style="margin-top:8px">Economic profit</span><span class="big">'+money(eco)+'</span>'
    + '<span class="sum">'+money(acc)+' − '+money(s.oc)+' = '+money(eco)+'</span>';
  if(Math.abs(eco)<0.005) h+='<span><b>Normal profit.</b> The business earns exactly what the owner gives up, so there is no reason to switch either way.</span>';
  else if(eco>0) h+='<span><b>Supernormal profit.</b> The owner earns '+money(eco)+' more than in the next best alternative.</span>';
  else h+='<span><b>An economic loss.</b> The owner would be '+money(-eco)+' better off in the next best alternative'+(acc>0?', even though an accountant would report a profit':'')+'.</span>';
  h+='<span>Revenue needed for normal profit: '+money(s.tc)+' + '+money(s.oc)+' = '+money(s.tc+s.oc)+'.</span>';
  document.getElementById('pc-out').innerHTML=h;
}

/* ---------- stay or leave (limit and predatory pricing) ---------- */
var STAY_PRESETS={ex1:[1000,1000,2,2.5], ex2:[100,100,0.5,1], ex3:[100,100,0.5,0.4]};
var stayState={preset:'ex1',fc:1000,q:1000,avc:2,p:2.5};
function renderStay(){
  var s=stayState;
  panel.innerHTML='<div class="panel-head"><strong>The firm facing a low price</strong></div>'
    + '<div class="minis"><span>Try</span>'
    + '<button type="button" class="chip mini" id="st-pre-ex1" data-stay="ex1">Example 1</button>'
    + '<button type="button" class="chip mini" id="st-pre-ex2" data-stay="ex2">Example 2</button>'
    + '<button type="button" class="chip mini" id="st-pre-ex3" data-stay="ex3">Example 2 at £0.40</button></div>'
    + '<div class="cform">'+cformRow('st','fc','Fixed costs (£)',s.fc)+cformRow('st','q','Output (units)',s.q)+cformRow('st','avc','Average variable cost (£)',s.avc)+cformRow('st','p','Price (£)',s.p)+'</div>'
    + '<div class="cr-out" id="st-out"></div>';
  updateStay();
}
function updateStay(){
  var s=stayState, q=s.q, afc=q>0?s.fc/q:0, atc=afc+s.avc, stay=(s.p-atc)*q, h;
  h='<span class="label">Costs per unit</span><span class="sum">AFC = '+money(s.fc)+' ÷ '+fmtN(q)+' = '+money(afc)+'</span>'
    + '<span class="sum">ATC = '+money(afc)+' + '+money(s.avc)+' = '+money(atc)+'</span>'
    + '<span class="label" style="margin-top:8px">Stay open</span><span class="sum">('+money(s.p)+' − '+money(atc)+') × '+fmtN(q)+' = '+money(stay)+'</span>'
    + '<span class="label" style="margin-top:8px">Shut down</span><span class="sum">Still pays the fixed costs: '+money(-s.fc)+'</span>';
  var verdict, why;
  if(s.p>=atc-1e-9){ verdict='Stay'; why='The price covers ATC, so there is no loss. Stay in the market.'; }
  else if(s.p>=s.avc-1e-9){ verdict='Stay for now, leave later'; why='Short run: stay open, because losing '+money(-stay)+' beats losing '+money(s.fc)+'. Long run: leave, because the price is below ATC. A rival setting this price on purpose is limit pricing.'; }
  else { verdict='Leave now'; why='The price is below AVC, so every unit loses money before fixed costs are even counted. Producing loses '+money(-stay)+', more than the '+money(s.fc)+' lost by shutting down. A rival setting this price on purpose is predatory pricing.'; }
  h+='<span class="big" style="margin-top:6px">'+verdict+'</span><span>'+why+'</span>';
  document.getElementById('st-out').innerHTML=h;
  ['ex1','ex2','ex3'].forEach(function(k){ var b=document.getElementById('st-pre-'+k); if(b) b.setAttribute('aria-pressed', s.preset===k?'true':'false'); });
}

/* =====================================================================
   YEAR 12 (Themes 1 and 2) AND EVALUATION POINTS
   Year 12 MASTER handouts: Externalities (micro 16), Taxation (18),
   Subsidies (19), Alternative intervention (20), AD/AS (macro 2 to 4),
   plus the evaluation theories named across all of them.
   ===================================================================== */
SECTIONS.y12={label:'Year 12', heading:'Year 12 big topics', scope:'Themes 1 and 2: the Year 12 diagrams you still need in Year 13.',
  groups:[['Theme 1: markets and market failure',['extern']],['Theme 2: the UK economy',['adas2']]]};
SECTIONS.y12.order=['extern','adas2'];
SECTIONS.ev={label:'Evaluation', heading:'Evaluation points', scope:'Named theories, curves and hypotheses that earn evaluation marks, and where to use each one.',
  groups:[['Macro',['e_growth','e_pc','e_fiscal','e_monetary','e_macro']],['Micro',['e_mfail','e_gov','e_firms','e_micro']]]};
SECTIONS.ev.order=SECTIONS.ev.groups[0][1].concat(SECTIONS.ev.groups[1][1]);

TOPICS.extern={section:'y12',label:'Externalities',eyebrow:'Edexcel A · Theme 1 · 1.3.2 Externalities',first:'ex_negprod',groups:[
  ['The cost-benefit diagram',['ex_base']],
  ['Negative externalities',['ex_negprod','ex_negcons']],
  ['Positive externalities',['ex_posprod','ex_poscons']],
  ['Welfare loss',['ex_wl']],
  ['Correcting them',['ex_tax','ex_sub','ex_policy']],
  ['Apply',['ex_ex']]
]};
TOPICS.adas2={section:'y12',label:'AD/AS',eyebrow:'Edexcel A · Theme 2 · 2.2 to 2.4 AD, AS and equilibrium',first:'ad_base',groups:[
  ['Classical AD/AS',['ad_base','ad_dpull','ad_cpush','ad_lras']],
  ['Keynesian AS',['ev_capacity']]
]};
TOPICS.e_growth={section:'ev',label:'Growth',eyebrow:'Evaluation · Macro · Economic growth and living standards',first:'ev_kuz_env',groups:[
  ['Kuznets curves',['ev_kuz_env','ev_kuz_ineq']],['Growth and happiness',['ev_easterlin']]]};
TOPICS.e_pc={section:'ev',label:'Inflation and jobs',eyebrow:'Evaluation · Macro · Inflation and unemployment',first:'ev_srpc',groups:[
  ['Phillips curve',['ev_srpc','ev_lrpc']],['Unemployment',['ev_hyst']]]};
TOPICS.e_fiscal={section:'ev',label:'Fiscal policy',eyebrow:'Evaluation · Macro · Fiscal policy',first:'ev_laffer',groups:[
  ['Tax',['ev_laffer']],['Spending and borrowing',['ev_crowd','ev_ricardo']],['Timing',['ev_lags']]]};
TOPICS.e_monetary={section:'ev',label:'Monetary policy',eyebrow:'Evaluation · Macro · Monetary policy',first:'ev_liq',groups:[
  ['When rate cuts stop working',['ev_liq']],['How people spend',['ev_lifecycle','ev_confidence']]]};
TOPICS.e_macro={section:'ev',label:'Any macro answer',eyebrow:'Evaluation · Macro · Angles that fit almost any question',first:'ev_capacity',groups:[
  ['The key diagram',['ev_capacity']],['Use anywhere',['ev_macrogen']]]};
TOPICS.e_mfail={section:'ev',label:'Market failure',eyebrow:'Evaluation · Micro · Market failure and government failure',first:'ev_govfail',groups:[
  ['When fixing it fails',['ev_govfail']],['Why markets fail',['ev_freerider','ev_commons','ev_asym']]]};
TOPICS.e_gov={section:'ev',label:'Intervention',eyebrow:'Evaluation · Micro · Taxes, subsidies and other policies',first:'ev_ped',groups:[
  ['The master point',['ev_ped']],['Choosing a policy',['ev_polluter','ev_permits','ev_nudge']],['What goes wrong',['ev_unintended','ev_capture']]]};
TOPICS.e_firms={section:'ev',label:'Firms',eyebrow:'Evaluation · Micro · Firms and market structures',first:'ev_contest',groups:[
  ['Is big bad?',['ev_contest','ev_scale','ev_dynamic']],['What firms want',['ev_pa']]]};
TOPICS.e_micro={section:'ev',label:'Any micro answer',eyebrow:'Evaluation · Micro · Angles that fit almost any question',first:'ev_microgen',groups:[
  ['Use anywhere',['ev_microgen']]]};

/* ------------------------- EXTERNALITIES (1.3.2) ------------------------- */
V.ex_base={kind:'ext', btn:'Free market', showing:'MPB = MPC: the free market outcome',
  title:'The cost-benefit diagram',
  lead:'Market failure diagrams use benefit and cost curves instead of demand and supply. Get this one right first.',
  plain:[
    ['<b class="k-ar">MPB</b>','Marginal private benefit: the demand curve. It slopes down because each extra unit gives the consumer less extra benefit.'],
    ['<b class="k-mc">MPC</b>','Marginal private cost: the supply curve. It slopes up because each extra unit costs the firm more to make.'],
    ['<b>MSB, MSC</b>','Marginal social benefit and cost. MSB = MPB + external benefit, and MSC = MPC + external cost.']
  ],
  chain:[
    'A free market only counts private costs and benefits, so it settles where MPB = MPC, at Q<sub>m</sub> and P<sub>m</sub>.',
    'The social optimum is where MSB = MSC, at Q*: the output that gives society the most welfare.',
    'With no externalities, MPB = MSB and MPC = MSC, so the market already produces Q*.',
    'Market failure happens when MPB ≠ MSB or MPC ≠ MSC: the market ignores the effect on third parties.'
  ],
  tip:'Label the axes Costs / benefits and Quantity, not Price and Quantity.'};

V.ex_negprod={kind:'ext', anim:true, two:true, grow:true, btn:'Negative production', showing:'MSC above MPC: over-production',
  title:'Negative externality of production',
  lead:'Producing the good imposes a cost on third parties that the firm does not pay. Example: flights from London to New York, and their greenhouse gas emissions.',
  chain:[
    'The firm only counts its private costs, such as fuel, planes and staff, so it supplies along MPC.',
    'Third parties bear an external cost, so the full cost to society, MSC, sits above MPC.',
    'The market produces where MPB = MPC, at Q<sub>m</sub>. The social optimum is where MSB = MSC, at the lower Q*.',
    'Between Q* and Q<sub>m</sub> each unit costs society more than it is worth: over-production. The shaded triangle is the welfare loss, and too many resources go into making the good (allocative inefficiency).'
  ],
  evaluation:'The size of the welfare loss depends on how big the external cost is, and that is hard to measure. Putting a money value on climate damage or poor health involves guesswork, which makes the right policy hard to set.',
  tip:'The welfare loss triangle sits between MSC and MSB, from Q* to Q<sub>m</sub>, and points towards Q*.'};

V.ex_negcons={kind:'ext', anim:true, two:true, grow:true, btn:'Negative consumption', showing:'MSB below MPB: over-consumption',
  title:'Negative externality of consumption',
  lead:'Consuming the good harms third parties. Example: smoking, through passive smoking.',
  chain:[
    'Consumers only count their private benefit, such as enjoyment, so demand follows MPB.',
    'Third parties suffer an external cost, so the benefit to society, MSB, is below MPB.',
    'The market settles where MPB = MPC, at Q<sub>m</sub>. The social optimum is where MSB = MSC, at the lower Q*.',
    'The good is over-consumed by Q<sub>m</sub> − Q*, and the shaded triangle is the welfare loss.'
  ],
  evaluation:'Many of these goods are also demerit goods, where consumers underestimate the harm to themselves (information failure). Demand is often price inelastic and addictive, so a tax may not cut consumption much.',
  tip:'For consumption externalities, the benefit curve moves. MPC = MSC stays where it is.',
  traps:['Beyond the spec: Edexcel asks for two externality diagrams, external costs of production and external benefits of consumption. This one helps you understand the idea, but you will not be asked to draw it.']};

V.ex_posprod={kind:'ext', anim:true, two:true, grow:true, btn:'Positive production', showing:'MSC below MPC: under-production',
  title:'Positive externality of production',
  lead:'Producing the good benefits third parties by lowering their costs. Example: a firm whose research into greener production can be used by other firms.',
  chain:[
    'The firm only counts its private costs, such as expensive research and skilled engineers, so it supplies along MPC.',
    'Third parties gain, for example by using the new technology, so the cost to society, MSC, is below MPC.',
    'The market produces where MPB = MPC, at Q<sub>m</sub>. The social optimum, where MSB = MSC, is the higher Q*.',
    'The good is under-produced by Q* − Q<sub>m</sub>, and the shaded triangle is the welfare loss: too few resources go into it.'
  ],
  evaluation:'Firms may still invest if a patent lets them keep the reward for themselves. Without that protection, rivals free ride on the research, which is the case for government support.',
  tip:'Another example from the handout: a new housing estate that regenerates an area, bringing jobs and new businesses.',
  traps:['Beyond the spec: Edexcel asks for two externality diagrams, external costs of production and external benefits of consumption. This one helps you understand the idea, but you will not be asked to draw it.']};

V.ex_poscons={kind:'ext', anim:true, two:true, grow:true, btn:'Positive consumption', showing:'MSB above MPB: under-consumption',
  title:'Positive externality of consumption',
  lead:'Consuming the good benefits third parties. Examples: education and vaccinations.',
  chain:[
    'Consumers only count their private benefit, such as higher future earnings from education, so demand follows MPB.',
    'Third parties gain too: a more productive workforce, more tax revenue, less crime. So MSB is above MPB.',
    'The market settles where MPB = MPC, at Q<sub>m</sub>. The social optimum is where MSB = MSC, at the higher Q*.',
    'The good is under-consumed by Q* − Q<sub>m</sub>. The shaded triangle is the <b>welfare gain area</b>: the welfare society would gain by moving from Q<sub>m</sub> to Q*.'
  ],
  evaluation:'Vaccination also protects people who are not vaccinated (herd immunity), which is why the NHS gives childhood vaccines for free. Many of these goods are merit goods, which people undervalue because they lack information.',
  tip:'For consumption externalities, the benefit curve splits: MSB above MPB.',
  traps:['The spec calls this triangle the <b>welfare gain area</b>: use those words. Examiners found it often shaded in the wrong place: it sits between MSB and MPC, from Q<sub>m</sub> to Q*.','Put MSB <b>above</b> MPB. Mixing up the two curves was a common error.']};

V.ex_wl={kind:'ext', anim:true, dur:5200, btn:'Find the welfare loss', showing:'Four steps to the welfare loss triangle',
  title:'How to find the welfare loss',
  lead:'The same four steps work on every externality diagram. Watch them in order, then try them on the other four diagrams.',
  chain:[
    'Find the market outcome, where the private curves cross (MPB = MPC). That gives Q<sub>m</sub>.',
    'Find the social optimum, where the social curves cross (MSB = MSC). That gives Q*.',
    'From the market point, go straight up or down to the social curve that has moved away from its private curve. Here that is up to MSC. This line is the vertical side of the triangle, at Q<sub>m</sub>.',
    'Join both ends of that line to the social optimum point, and shade the triangle. That is the welfare loss.'
  ],
  compare:{vs:'Step 3: from Q<sub>m</sub>, go',rows:[['Negative production','up to MSC'],['Negative consumption','down to MSB'],['Positive production','down to MSC'],['Positive consumption','up to MSB']]},
  tip:'The triangle always points at Q*, and its vertical side always sits at Q<sub>m</sub>. If step 3 takes you to MPC or MPB, you are on the wrong curve.',
  traps:['On the positive consumption diagram, the spec calls this triangle the <b>welfare gain area</b>: the gain from moving to Q*.']};

V.ex_tax={kind:'ext', anim:true, btn:'Tax', showing:'A tax equal to the external cost',
  title:'Correcting a negative externality: an indirect tax',
  lead:'A tax equal to the external cost makes the producer pay for the harm it causes. This is the polluter pays principle.',
  chain:[
    'The government taxes each unit by the size of the external cost.',
    'The firm’s costs rise, so MPC shifts up by the tax until it lies on MSC.',
    'The market now settles at Q*, the social optimum, and the price rises from P<sub>m</sub> to P*.',
    'The externality has been internalised: the welfare loss disappears, and the tax raises revenue that can pay for cleaner alternatives.'
  ],
  compare:{vs:'After the tax',rows:[['Price','↑ higher'],['Quantity','↓ to Q*'],['Welfare loss','removed'],['Revenue','raised']]},
  evaluation:'It only works this neatly if the government knows the size of the external cost. If demand is price inelastic, as for cigarettes or fuel, quantity barely falls and the tax mainly raises revenue. Taxes like these are regressive, and a high tax can push sales into illegal markets.',
  tip:'Tax = external cost, so MPC + tax = MSC. A tax that is too high over-corrects: that is government failure.'};

V.ex_sub={kind:'ext', anim:true, btn:'Subsidy', showing:'A subsidy equal to the external benefit',
  title:'Correcting a positive externality: a subsidy',
  lead:'A subsidy equal to the external benefit lowers the cost of supplying the good, so more is consumed. Examples: vaccinations, training, home insulation.',
  chain:[
    'The government pays producers a subsidy on each unit, equal to the external benefit.',
    'Their costs fall, so MPC shifts down by the subsidy.',
    'The market settles at Q*, where MPB meets the new cost curve. The price consumers pay falls from P<sub>m</sub> to P<sub>2</sub>.',
    'Consumption rises to the social optimum and the welfare loss disappears.'
  ],
  compare:{vs:'After the subsidy',rows:[['Price','↓ lower'],['Quantity','↑ to Q*'],['Welfare loss','removed'],['Cost','taxpayers pay']]},
  evaluation:'A subsidy has an opportunity cost: the money could have been spent elsewhere. If demand is price inelastic, consumption barely rises. Firms may come to rely on it and become inefficient, and once given, subsidies are politically hard to remove.',
  tip:'Subsidy = external benefit, so the new cost curve crosses MPB directly below where MSB crosses MSC.'};

V.ex_policy={kind:'card', btn:'Other policies', showing:'Regulation, permits, information, state provision',
  title:'Other ways to correct externalities',
  lead:'Taxes and subsidies are not the only option. Each alternative fixes some problems and creates others.',
  card:{head:'The options', items:[
    PT('Regulation',[['','Laws, limits and bans, such as emission standards for cars or the ban on smoking in public places.'],['But','Enforcement costs money, firms may break the rules, and a ban can create black markets.']]),
    PT('Tradable pollution permits',[['','The government caps total pollution and issues permits that firms can buy and sell. Firms that can cut pollution cheaply sell their spare permits.'],['But','Setting the right cap is hard, and if too many permits are issued, or handed out free, they do little.']]),
    PT('Information provision',[['','Campaigns and labels close the information gap, such as health warnings on cigarettes and calories on menus.'],['But','People often ignore them, and the effect is slow and hard to measure.']]),
    PT('State provision',[['','The government provides the good itself, free at the point of use, such as NHS vaccinations and state schools.'],['But','It is expensive, has an opportunity cost, and without the profit motive services can become inefficient.']])
  ]},
  tip:'Use the alternatives as evaluation: "a tax may not work because demand is inelastic, so regulation may be better".'};

V.ex_ex={kind:'card', btn:'Real examples', showing:'Externalities you can point to',
  title:'Real examples: externalities',
  lead:'Name the externality, draw the right diagram, then judge the policy used.',
  card:{head:'Where you can see it', items:[
    EX('Sugary drinks: the Soft Drinks Industry Levy','A tax on drinks with a lot of added sugar, aimed at obesity and its cost to the NHS. Most firms cut the sugar in their drinks to avoid paying it.','Pure fruit juice and milk-based drinks are exempt, and sugar in food is not taxed at all.','What happened','The catch'),
    EX('London’s Ultra Low Emission Zone (ULEZ)','Older, more polluting vehicles pay a daily charge to drive in London, targeting the negative externality of exhaust fumes.','It hits people who cannot afford a newer car hardest, and it was politically unpopular.','What happened','The catch'),
    EX('The plastic bag charge','A small charge on single-use bags in shops cut their use sharply.','Shoppers switched to thicker "bags for life", which each use more plastic.','What happened','The catch'),
    EX('Free childhood vaccinations','The NHS gives vaccines free, because of the positive externality of herd immunity.','Uptake still depends on information and trust: when trust falls, fewer children are vaccinated.','What happened','The catch')
  ]}};

/* ------------------------- AD/AS (Theme 2) ------------------------- */
V.ad_base={kind:'adas2', btn:'AD/AS', showing:'Equilibrium where AD meets SRAS',
  title:'The classical AD/AS diagram',
  lead:'The diagram behind almost every macro answer in Themes 2 and 4. The economy settles where AD meets SRAS.',
  plain:[
    ['<b class="k-ar">AD</b>','Aggregate demand = C + I + G + (X − M). It slopes down: a lower price level raises real wealth, lowers interest rates and makes exports more competitive.'],
    ['<b class="k-mc">SRAS</b>','Short-run aggregate supply slopes up: with some costs fixed, a higher price level makes it profitable to produce more.'],
    ['<b class="k-ac">LRAS</b>','Long-run aggregate supply is vertical at full capacity, Y<sub>FE</sub>. It depends on the quantity and quality of the factors of production, not on the price level.']
  ],
  chain:[
    'Equilibrium is where AD = SRAS, at price level P<sub>1</sub> and real GDP Y<sub>FE</sub>.',
    'Here that is on LRAS, so the economy is at full capacity with no output gap.',
    'Shifts in AD or SRAS change output and prices in the short run.',
    'Only a shift in LRAS changes the economy’s productive potential.'
  ],
  tip:'Label the axes Price level and Real GDP (or real national output), never Price and Quantity.'};

V.ad_dpull={kind:'adas2', anim:true, sh:'ad', btn:'AD increases', showing:'Demand-pull: AD shifts right',
  title:'An increase in AD: demand-pull inflation',
  lead:'A rise in any component of AD, such as consumer spending, investment or exports, shifts AD to the right.',
  chain:[
    'AD shifts right from AD<sub>1</sub> to AD<sub>2</sub>, for example after an interest rate cut boosts consumption and investment.',
    'Firms respond by producing more, moving up SRAS: real GDP rises from Y<sub>1</sub> to Y<sub>2</sub>.',
    'The price level rises from P<sub>1</sub> to P<sub>2</sub>: demand-pull inflation.',
    'Output is now beyond full capacity: a positive output gap, which cannot last.'
  ],
  compare:{vs:'After AD rises',rows:[['Price level','↑ higher'],['Real GDP','↑ higher'],['Unemployment','↓ lower'],['Output gap','positive']]},
  evaluation:'How much of the rise goes into output rather than prices depends on spare capacity. With lots of spare capacity, output rises and prices barely move; near full capacity, it is mostly inflation (see Keynesian AS).'};

V.ad_cpush={kind:'adas2', anim:true, sh:'sras', btn:'SRAS falls', showing:'Cost-push: SRAS shifts left',
  title:'A fall in SRAS: cost-push inflation',
  lead:'A rise in firms’ costs, such as energy prices, wages or a weaker pound raising import prices, shifts SRAS to the left.',
  chain:[
    'Higher costs mean firms supply less at every price level: SRAS shifts left from SRAS<sub>1</sub> to SRAS<sub>2</sub>.',
    'The price level rises from P<sub>1</sub> to P<sub>2</sub>: cost-push inflation.',
    'Real GDP falls from Y<sub>1</sub> to Y<sub>2</sub>, so unemployment rises.',
    'Rising prices and falling output together is stagflation.'
  ],
  compare:{vs:'After SRAS falls',rows:[['Price level','↑ higher'],['Real GDP','↓ lower'],['Unemployment','↑ higher'],['Output gap','negative']]},
  evaluation:'The jump in energy prices after Russia invaded Ukraine is a real example. It is a policy dilemma: raising interest rates to fight the inflation makes the fall in output worse.'};

V.ad_lras={kind:'adas2', anim:true, sh:'lras', btn:'LRAS increases', showing:'More capacity: LRAS shifts right',
  title:'An increase in LRAS: long-run growth',
  lead:'More or better factors of production, such as a more skilled workforce, new technology or more investment, raise the economy’s productive capacity.',
  chain:[
    'LRAS shifts right from LRAS<sub>1</sub> to LRAS<sub>2</sub>, and SRAS shifts right with it.',
    'Real GDP rises from Y<sub>1</sub> to Y<sub>2</sub>: the economy can produce more without overheating.',
    'The price level falls from P<sub>1</sub> to P<sub>2</sub>.',
    'This is sustainable, non-inflationary growth, which is the aim of supply-side policies.'
  ],
  compare:{vs:'After LRAS rises',rows:[['Price level','↓ lower'],['Real GDP','↑ higher'],['Capacity','↑ higher'],['Inflation','lower']]},
  evaluation:'Supply-side improvements take years to come through, and their size is uncertain. In practice AD usually grows at the same time, so the price level is more likely to rise slowly than to fall.'};

/* ------------------------- EVALUATION: MACRO ------------------------- */
V.ev_capacity={kind:'evc', anim:true, two:true, btn:'Spare capacity', showing:'The same push on AD: output first, then prices',
  title:'Spare capacity decides: the Keynesian AS curve',
  lead:'Keynes argued that AS is flat when there is lots of spare capacity and becomes vertical at full capacity. So the same increase in AD can have very different effects.',
  chain:[
    'From 1 to 2 there is lots of spare capacity: unemployed workers and idle machines. Output rises and the price level barely moves.',
    'From 2 to 3, bottlenecks appear as some resources run short: output rises, but so do prices.',
    'From 3 to 4 the economy is close to full capacity: the same push on AD is mostly inflation.',
    'Each shift in AD here is the same size. Only the starting point changes the result.'
  ],
  use:[['Any demand-side policy','Fiscal or monetary stimulus raises output if there is spare capacity, but mainly prices if there is not.'],['Exports and the exchange rate','A depreciation that raises net exports boosts growth only with spare capacity.'],['Recessions','The Keynesian case for government spending in a deep recession: lots of spare capacity, little risk of inflation.'],['Output gaps','A negative output gap means spare capacity; a positive one means more AD is inflationary.']],
  line:'"However, the effect on real GDP depends on the level of spare capacity. With a large negative output gap, the economy is on the flat part of AS, so output rises with little inflation; close to full capacity, most of the rise in AD would be inflationary."',
  tip:'Classical economists draw LRAS vertical: in the long run, more AD only raises prices.'};

V.ev_kuz_env={kind:'evc', anim:true, two:true, btn:'Environmental Kuznets curve', showing:'Environmental damage rises, then falls, as income grows',
  title:'The environmental Kuznets curve',
  lead:'Grossman and Krueger (1991): as an economy develops, environmental damage first rises, then falls once income per head passes a turning point.',
  chain:[
    'In early development the economy industrialises, moving from farming to factories, and pollution rises fast.',
    'At the turning point, people are rich enough to care about clean air and water, and can afford to act on it.',
    'Tighter regulation (such as London’s ULEZ), cleaner technology (electric cars, solar power) and a shift to services reduce the damage.',
    'So growth can eventually help the environment, rather than only harming it.'
  ],
  use:[['Costs and benefits of growth','Growth does not always harm the environment: richer countries can afford cleaner technology.'],['Conflicts between objectives','Growth versus environmental protection may only be a short-run trade-off.'],['Developing economies (Theme 4)','Fast-growing economies may be on the rising side of the curve now.'],['Environmental policy','It supports regulation and clean technology rather than stopping growth.']],
  evaluation:'Growth still means more resources used, even in a service economy: more flights, more cars. Rich countries often export their pollution by importing goods made elsewhere. Pollution depends on how good regulation is, not just on income, and the evidence is much weaker for carbon emissions than for local pollution such as smog.',
  line:'"However, the environmental Kuznets curve suggests the trade-off may be temporary: once incomes pass a turning point, environmental damage tends to fall as regulation tightens and cleaner technology spreads."',
  tip:'This is the version in the growth handout. The original Kuznets curve, the next button, is about inequality.'};

V.ev_kuz_ineq={kind:'evc', anim:true, two:true, btn:'Kuznets curve: inequality', showing:'Inequality rises, then falls, as income grows',
  title:'The Kuznets curve: inequality',
  lead:'Simon Kuznets argued that as a country develops, income inequality first rises, then falls.',
  chain:[
    'Early on, a few people move from low-paid farming into better-paid industry, and owners of capital gain most: inequality rises.',
    'As more workers move into industry and towns, education spreads and wages rise across the economy.',
    'Mature economies build welfare states and progressive taxes, and inequality falls.',
    'On this view, rising inequality can be a temporary stage of growth.'
  ],
  use:[['Inequality (Theme 4)','Rising inequality in a developing economy may be a stage, not a permanent problem.'],['Growth and development','Growth might reduce inequality in the long run.'],['Trickle-down arguments','Supporters of growth-first policies use it; critics use the evidence against it.']],
  evaluation:'Since the 1980s inequality has risen again in many rich countries, including the UK and the US (the dashed line). That fits Thomas Piketty’s argument that returns on wealth grow faster than the economy, so inequality rises unless governments act. The curve depends on policy choices, not just the stage of development.',
  line:'"Kuznets suggests that inequality may fall as the economy develops; however, rising inequality in rich countries since the 1980s suggests this depends on government policy rather than happening automatically."'};

V.ev_easterlin={kind:'evc', anim:true, two:true, btn:'Easterlin paradox', showing:'Incomes rise, average happiness does not',
  title:'The Easterlin paradox',
  lead:'Richard Easterlin found that as a country gets richer over time, average happiness does not rise with it.',
  chain:[
    'Real GDP per head rises steadily over the decades.',
    'Average reported happiness stays roughly flat.',
    'People care about relative income: being richer than the people around them matters more than being richer than their grandparents were.',
    'Growth can also bring longer hours, stress and a worse work-life balance.'
  ],
  use:[['Does growth raise living standards?','More output is not the same as a better quality of life, especially in rich countries.'],['Measuring living standards','An argument for wider measures, such as HDI and wellbeing, not just GDP per head.'],['Developed vs developing','Growth matters far more where people lack food, clean water and healthcare; the paradox applies mainly to rich countries.']],
  evaluation:'Later studies dispute the paradox, finding that people in richer countries do report higher life satisfaction on average, but with diminishing returns as income rises. Either way, extra income adds less to wellbeing in a rich country than in a poor one.',
  line:'"However, the Easterlin paradox suggests that in a developed country like the UK, further growth may do little to raise wellbeing, because people judge themselves by their relative income."'};

V.ev_srpc={kind:'evc', anim:true, btn:'Short-run Phillips curve', showing:'Lower unemployment, higher inflation',
  title:'The short-run Phillips curve',
  lead:'Bill Phillips (1958) found an inverse relationship between unemployment and wage inflation in the UK. It became a trade-off between unemployment and inflation.',
  chain:[
    'When unemployment is low, workers have more bargaining power and push up wages.',
    'Wages are a large part of firms’ costs, so higher wages lead to higher prices.',
    'So a government that boosts AD can move the economy from A to B: lower unemployment, but higher inflation.',
    'Policy makers seem to face a choice of where to be on the curve.'
  ],
  use:[['Conflicts between objectives','The classic trade-off: cutting unemployment raises inflation, and fighting inflation costs jobs.'],['Demand-side policy','A stimulus lowers unemployment in the short run, at a cost.'],['Interest rate decisions','Why the Bank of England raises rates when the labour market is tight.']],
  evaluation:'The trade-off broke down in the 1970s, when the UK had stagflation: high inflation and high unemployment together. The curve has also flattened: unions are weaker, the gig economy has grown and globalisation lets firms move jobs abroad, so low unemployment pushes up wages less than it used to.',
  line:'"There may be a trade-off between unemployment and inflation, as the short-run Phillips curve suggests; however, the curve has flattened as workers’ bargaining power has fallen, so the inflation cost of lower unemployment may now be small."'};

V.ev_lrpc={kind:'evc', anim:true, two:true, btn:'Long-run Phillips curve', showing:'A to B, then back to C at the NAIRU',
  title:'The long-run Phillips curve and the NAIRU',
  lead:'Milton Friedman argued the trade-off only exists in the short run. In the long run the Phillips curve is vertical at the natural rate of unemployment, the NAIRU.',
  chain:[
    'The economy starts at A, at the NAIRU, with inflation running at the rate everyone expects.',
    'A demand stimulus moves it along SRPC<sub>1</sub> to B: unemployment falls and inflation rises. Workers suffer money illusion, thinking higher wages mean they are better off.',
    'Workers realise prices have risen too and expect more inflation (adaptive expectations). They demand higher wages, so firms cut jobs, and SRPC shifts up to SRPC<sub>2</sub>.',
    'The economy ends at C: unemployment back at the NAIRU, but with higher inflation. In the long run, demand-side policy only raises inflation.'
  ],
  use:[['Demand-side vs supply-side policy','Only supply-side policies can lower the NAIRU and shift LRPC left.'],['Keynesian vs monetarist debates','Monetarists use it to argue against long-run demand management.'],['Inflation targeting','Keeping expectations anchored at 2% stops SRPC shifting up.'],['Conflicts between objectives','In the long run there may be no trade-off at all.']],
  evaluation:'With rational expectations, people may see inflation coming straight away, so there is no trade-off even in the short run. But the Bank of England has kept inflation expectations fairly stable, so the short-run curve may describe the real world better. The NAIRU is also hard to measure, so policy makers cannot be sure where it is.',
  line:'"In the short run, expansionary policy may reduce unemployment, but monetarists argue that once inflation expectations adjust, unemployment returns to the NAIRU with higher inflation; only supply-side policies can reduce unemployment permanently."',
  tip:'NAIRU: the non-accelerating inflation rate of unemployment, the lowest rate that can last without inflation rising. It is never zero, because there is always some frictional and structural unemployment.'};

V.ev_hyst={kind:'card', btn:'Hysteresis', showing:'Unemployment causing unemployment',
  title:'Hysteresis',
  lead:'Hysteresis means unemployment causing unemployment: the longer people are out of work, the harder it is for them to get back in.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','Long-term unemployed workers lose skills and motivation, and employers see a long gap on a CV as a warning sign. So a recession can leave unemployment higher long after demand has recovered.']]},
    {h:'In practice', l:[['','When mines and factories closed in parts of northern England and Wales, some areas were left with high unemployment for decades.']]},
    {h:'The other side', l:[['','Retraining, apprenticeships and job-search support can break the cycle, and a tight labour market pulls people back in.']]}
  ]},
  use:[['Costs of unemployment','The cost lasts beyond the recession itself.'],['Recessions and output gaps','The Keynesian case for acting fast: a deep negative output gap can reduce LRAS.'],['Supply-side policy','Training and education can reduce it.'],['Benefits','Lower benefits push people back to work, but too low and job search suffers.']],
  line:'"However, the longer the recession lasts, the more likely hysteresis becomes as the long-term unemployed lose skills; this could reduce LRAS, which makes a quick policy response more important."'};

V.ev_laffer={kind:'evc', anim:true, two:true, btn:'Laffer curve', showing:'Past t*, higher tax rates raise less revenue',
  title:'The Laffer curve',
  lead:'Arthur Laffer argued that once tax rates pass a certain level, raising them further reduces tax revenue.',
  chain:[
    'At a 0% tax rate the government raises nothing. At 100% nobody would work or declare income, so it raises nothing again.',
    'In between, revenue rises to a peak at the revenue-maximising rate, t*.',
    'Above t*, very high rates mean people work less, avoid or evade tax, or leave the country (human capital flight).',
    'So above t*, cutting the tax rate can actually raise revenue. Two different rates, A and B, can raise the same revenue.'
  ],
  use:[['Income tax and supply-side policy','Cutting high tax rates may boost incentives to work, and could even raise revenue.'],['Raising the top rate to reduce inequality','A higher top rate may raise little extra if the rich avoid it or leave.'],['Corporation tax','Lower rates may attract firms, and countries cutting rates to compete risk a race to the bottom.'],['Fiscal policy and the deficit','Tax rises may not close the deficit as much as planned.']],
  evaluation:'Nobody knows exactly where t* is, and it differs for each tax and each country. Most UK tax rates are thought to be below the peak, so cuts usually lose revenue. The 2022 mini-budget’s unfunded tax cuts, partly justified by this kind of argument, caused turmoil in financial markets and were mostly reversed.',
  line:'"However, according to the Laffer curve, if the tax rate is already above the revenue-maximising rate, a rise could reduce revenue as people work less, avoid tax or move abroad, although where this rate lies is uncertain."',
  tip:'Draw it as a hill from 0% to 100%, and mark t* at the top.'};

V.ev_crowd={kind:'card', btn:'Crowding out', showing:'Government borrowing can squeeze private investment',
  title:'Crowding out, and crowding in',
  lead:'Expansionary fiscal policy is often paid for by borrowing. That borrowing can push up interest rates and squeeze out private investment.',
  card:{head:'The idea', items:[
    {h:'Crowding out', l:[['','The government borrows more, raising demand for loanable funds and pushing up interest rates. Firms find it dearer to borrow, so private investment falls, offsetting the rise in G. AD may barely move.']]},
    {h:'Crowding in', l:[['','Government spending can also encourage private spending: shops, offices and homes have gone up around new Elizabeth line stations.']]},
    {h:'When it matters', l:[['','In a recession, firms are not investing anyway because confidence is low, so there is little to crowd out. Near full capacity, crowding out is more likely.']]}
  ]},
  use:[['Fiscal policy','Extra government spending may not raise AD as much as the multiplier suggests.'],['Budget deficits and debt','Heavy borrowing raises interest costs across the economy.'],['Infrastructure','Projects such as the Elizabeth line can crowd in private investment.']],
  line:'"However, if the extra spending is financed by borrowing, it may crowd out private investment as interest rates rise, although in a recession, when business confidence is low, this effect is likely to be small."'};

V.ev_ricardo={kind:'card', btn:'Ricardian equivalence', showing:'People save tax cuts, expecting future tax rises',
  title:'Ricardian equivalence',
  lead:'Robert Barro’s idea, building on David Ricardo: if the government cuts taxes and borrows to pay for it, people expect higher taxes later, so they save the tax cut instead of spending it.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','Borrowing today has to be repaid with taxes tomorrow. Households who see this coming save now to pay those future taxes, so consumption does not rise and the multiplier is small.']]},
    {h:'Why it may not hold', l:[['','Many households live month to month and spend any extra income, and few think about government debt when they shop.']]},
    {h:'When it is most likely', l:[['','When debt is already high and in the news, so people expect tax rises, and when confidence is low.']]}
  ]},
  use:[['Tax cuts to boost AD','A tax cut paid for by borrowing may not raise consumption.'],['Fiscal stimulus','The multiplier may be smaller than expected.'],['High national debt','Worries about future taxes can weaken any stimulus.']],
  line:'"However, if households expect the borrowing to mean higher taxes in future, they may save the tax cut (Ricardian equivalence), so consumption and AD rise by less than expected."'};

V.ev_lags={kind:'card', btn:'Time lags', showing:'Policies take time to work',
  title:'Time lags',
  lead:'Every policy takes time: to spot the problem, decide what to do, put it in place, and for people to respond.',
  card:{head:'The idea', items:[
    {h:'Fiscal policy', l:[['','Tax and spending changes usually wait for a Budget and must pass through Parliament. Big projects take years to start.']]},
    {h:'Monetary policy', l:[['','The Bank of England can change interest rates quickly, but the full effect on spending and inflation takes well over a year, as mortgage deals and loans come up for renewal.']]},
    {h:'Supply-side policy', l:[['','Education and infrastructure take years, even decades, to raise productivity.']]},
    {h:'Automatic stabilisers', l:[['','Benefit spending and tax revenue adjust on their own as the economy changes, with no delay to decide, which is why they are often more reliable than discretionary policy.']]}
  ]},
  use:[['Any policy question','By the time it works the problem may have changed: a stimulus could arrive in a boom.'],['Monetary vs fiscal policy','Monetary policy is quicker to change, but slow to take full effect.'],['Supply-side policy','Its benefits come in the long run, so it cannot fix a recession.']],
  line:'"However, there are significant time lags: by the time the policy takes full effect, the economy may already be recovering, so it could destabilise the economy rather than stabilise it."'};

V.ev_liq={kind:'card', btn:'Liquidity trap and QE', showing:'When interest rates cannot fall further',
  title:'The liquidity trap and quantitative easing',
  lead:'A liquidity trap is when interest rates can fall no further, and monetary policy can no longer boost aggregate demand.',
  card:{head:'The idea', items:[
    {h:'The trap', l:[['','When rates are already close to zero, the central bank cannot cut much further. And when confidence is very low, even cheap borrowing does not get people spending.']]},
    {h:'Quantitative easing (QE)', l:[['','The central bank creates money to buy bonds, pushing down longer-term interest rates and raising asset prices. The Bank of England used it after the 2008 financial crisis and during Covid.']]},
    {h:'The limits of QE', l:[['','It raises the prices of shares and houses, which mainly helps people who already own them, so it can widen wealth inequality. The money may also sit with banks and firms rather than being spent.']]}
  ]},
  use:[['Monetary policy','Cutting rates may not work if they are already near zero or confidence is low.'],['Recessions and deflation','Why governments turned to fiscal policy and QE after the financial crisis and during Covid.'],['Inequality','QE can widen wealth inequality.']],
  line:'"However, with interest rates already close to zero, the economy may be in a liquidity trap, so further cuts would have little effect on AD and the central bank might need quantitative easing or fiscal support instead."'};

V.ev_lifecycle={kind:'card', btn:'Life cycle hypothesis', showing:'People smooth spending over their lives',
  title:'The life cycle hypothesis and the wealth effect',
  lead:'Franco Modigliani (1957): people smooth their consumption over their lifetime, borrowing when income is low, saving when it is high, and running down savings in retirement.',
  card:{head:'The idea', items:[
    {h:'Smoothing', l:[['','Consumption depends on expected lifetime income and wealth, not just this month’s pay, so a one-off change in income may barely change spending.']]},
    {h:'The wealth effect', l:[['','When house or share prices rise, people feel richer and more confident, and spend more. Lower interest rates raise asset prices, so they work partly through wealth.']]},
    {h:'Limits', l:[['','Research in the UK suggests a fifth to a quarter of people do not plan for the long term, and many cannot borrow when they want to, so their spending follows their income closely.']]}
  ]},
  use:[['Interest rate changes','Their effect on consumption depends partly on house prices and wealth.'],['Temporary tax cuts','People may save them rather than spend them.'],['Consumption and AD','Why consumption is more stable than income.']],
  line:'"However, according to the life cycle hypothesis, a temporary tax cut may be largely saved as households smooth consumption over their lifetimes, so the boost to AD could be small."'};

V.ev_confidence={kind:'card', btn:'Confidence', showing:'Keynes’s animal spirits',
  title:'Confidence: Keynes’s animal spirits',
  lead:'Keynes argued that spending and investment depend heavily on confidence, which he called animal spirits, not just on interest rates and incomes.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','When firms and households are pessimistic they hold back spending, whatever the interest rate. When they are optimistic they spend and invest more, and the multiplier amplifies it.']]},
    {h:'In practice', l:[['','In times of uncertainty, such as the Covid pandemic, firms delay investment even when borrowing is cheap.']]},
    {h:'Why it matters for policy', l:[['','It is the main reason monetary and fiscal policy can work less well in a deep recession, and why Keynes argued for government spending to fill the gap.']]}
  ]},
  use:[['Monetary policy','A rate cut may not raise investment if business confidence is low.'],['Tax cuts','Worried households may save the extra income (a low MPC).'],['Investment and growth','Uncertainty holds back investment.']],
  line:'"However, the impact depends on consumer and business confidence: if confidence is low, firms may not invest even at low interest rates, so the rise in AD may be limited."'};

V.ev_macrogen={kind:'card', btn:'Six angles', showing:'Six angles that fit almost any macro answer',
  title:'Six evaluation angles for any macro question',
  lead:'If you are stuck for evaluation, one of these almost always applies. Make it specific to the question.',
  card:{head:'The angles', items:[
    PT('1. Magnitude',[['','How big is the change? A small rate cut is not the same as a large one.']]),
    PT('2. Spare capacity',[['','Is there a negative output gap? It decides whether more AD means growth or inflation.']]),
    PT('3. Time',[['','Short run versus long run, and the time lags before a policy works.']]),
    PT('4. Confidence',[['','Low confidence weakens almost every policy that relies on spending.']]),
    PT('5. Other things changing',[['','Ceteris paribus rarely holds: a global recession or energy shock can swamp the policy.']]),
    PT('6. Conflicts',[['','Fixing one objective can harm another: growth against inflation, the environment or the current account.']])
  ]},
  use:[['Any 25-mark macro essay','Pick the two most relevant angles and develop each one fully, rather than listing all six.']],
  line:'"The effectiveness of the policy depends on the size of the output gap: with lots of spare capacity, …"',
  tip:'Evaluation needs a reason and a judgement. Say which way it goes and why, not just "it depends".'};

/* ------------------------- EVALUATION: MICRO ------------------------- */
V.ev_govfail={kind:'ext', anim:true, two:true, btn:'Government failure', showing:'A tax set too high over-corrects',
  title:'Government failure',
  lead:'Government failure is when intervention makes the allocation of resources worse rather than better. Here a tax set above the external cost over-corrects.',
  chain:[
    'The government cannot measure the external cost exactly, and sets the tax too high.',
    'MPC shifts up past MSC, to MPC + tax.',
    'Output falls below the social optimum, to Q<sub>t</sub>: now too little is produced.',
    'A new welfare loss appears, between Q<sub>t</sub> and Q*: the intervention has created its own inefficiency.'
  ],
  use:[['Any government intervention','Taxes, subsidies, regulation and price controls can all over- or under-correct.'],['Information gaps','The government rarely knows the true size of an externality.'],['Unintended consequences','Black markets, smuggling, firms moving abroad.'],['Political self-interest','Policies may be chosen to win votes rather than to correct a market failure.']],
  evaluation:'The causes in the spec: distortion of price signals, unintended consequences, excessive administrative costs and information gaps. It does not mean the government should never act; it means the cost of intervening should be weighed against the cost of the market failure.',
  line:'"However, the government may not know the true size of the external cost, so the tax could be set too high, over-correcting the market and causing government failure."'};

V.ev_freerider={kind:'card', btn:'Free rider problem', showing:'Why public goods are not provided',
  title:'The free rider problem',
  lead:'People can benefit from a public good without paying for it, so a private firm cannot charge for it and the market does not provide it.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','Public goods are non-excludable (you cannot stop people using them) and non-rival (one person’s use does not reduce anyone else’s). So everyone waits for someone else to pay, and the good is not provided: a missing market.']]},
    {h:'Examples', l:[['','Street lights, national defence, flood defences, lighthouses.']]},
    {h:'Limits', l:[['','Technology makes more goods excludable, through paywalls, subscriptions and toll roads, and quasi-public goods such as roads can be partly charged for.']]}
  ]},
  use:[['Public goods','The reason the state provides them, paid for by taxes.'],['Climate change','Countries can free ride on others cutting emissions, which makes international deals hard.'],['Vaccination','Unvaccinated people free ride on herd immunity.'],['Positive production externalities','Rivals free ride on one firm’s research.']],
  line:'"Because of the free rider problem, the market would under-provide this good, which justifies government provision; however, the government may not know how much people value it, so it may provide too much or too little."'};

V.ev_commons={kind:'card', btn:'Tragedy of the commons', showing:'Shared resources get overused',
  title:'The tragedy of the commons',
  lead:'When a resource is shared and nobody owns it, each user takes as much as they can, and the resource is overused or destroyed.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','Each fishing boat gains the full value of an extra catch but bears only a tiny share of the damage to fish stocks. So everyone overfishes, even though all would be better off holding back.']]},
    {h:'Examples', l:[['','Overfishing, clean air, the atmosphere, congestion on busy roads.']]},
    {h:'Solutions', l:[['','Quotas, licences, tradable permits, or giving someone ownership (property rights) so they have a reason to look after the resource.']]}
  ]},
  use:[['Negative externalities','Explains why environmental damage keeps happening.'],['Sustainability and growth','Growth can run down shared natural resources.'],['Choosing a policy','Supports quotas and permits over a simple tax.']],
  line:'"This is an example of the tragedy of the commons: because no one owns the resource, each user ignores the damage they cause to others, so regulation such as quotas may be needed."'};

V.ev_asym={kind:'card', btn:'Asymmetric information', showing:'One side knows more than the other',
  title:'Asymmetric information and moral hazard',
  lead:'Asymmetric information is when one party to a transaction knows more than the other. It leads to bad decisions and market failure.',
  card:{head:'The idea', items:[
    {h:'Asymmetric information', l:[['','A second-hand car seller knows whether the car is any good; the buyer does not. A doctor knows more than the patient, so could recommend treatment that is not needed.']]},
    {h:'Moral hazard', l:[['','Someone protected from risk takes more of it, because someone else bears the cost. Insured drivers may drive less carefully, and banks that expect to be bailed out take bigger risks, as before the 2008 financial crisis.']]},
    {h:'Solutions', l:[['','Regulation, warranties, reviews and ratings, and making the risk-taker bear some of the cost, such as an insurance excess.']]}
  ]},
  use:[['Information gaps','Why merit goods are under-consumed and demerit goods over-consumed.'],['Healthcare and education','A case for state provision or regulation.'],['Banks and the financial sector','Moral hazard after bailouts.'],['Firms','The principal–agent problem is asymmetric information between owners and managers.']],
  line:'"However, the market may fail because of asymmetric information: consumers cannot judge quality, so regulation or information provision may be needed."'};

V.ev_ped={kind:'evc', anim:true, btn:'It depends on PED', showing:'Who pays a tax, and how far consumption falls',
  title:'Price elasticity: the master evaluation point',
  lead:'Almost every intervention depends on price elasticity of demand. The same tax has very different effects on an inelastic good and an elastic one.',
  chain:[
    'The tax shifts supply up by the same amount in both diagrams.',
    'Inelastic demand (left): the price rises a lot and quantity barely falls. Consumers pay most of the tax (the upper box).',
    'Elastic demand (right): the price rises a little and quantity falls a lot. Producers pay most of the tax (the lower box).',
    'So a tax on an inelastic good raises lots of revenue but barely changes behaviour; on an elastic good it changes behaviour but raises less.'
  ],
  use:[['Taxes on demerit goods','Cigarettes, alcohol and fuel are inelastic: the tax raises revenue but consumption falls little.'],['Subsidies','If demand is inelastic, a subsidy barely raises consumption.'],['Minimum prices and wages','The effect on quantity depends on elasticity.'],['Exchange rates (Theme 4)','A depreciation improves the trade balance only if demand for exports and imports is elastic enough: Marshall–Lerner.'],['Monopoly and price discrimination','Firms charge more where demand is inelastic.']],
  evaluation:'Demand is usually more elastic in the long run as people find substitutes: drivers switch to electric cars over years, not weeks. So a tax that seems to fail at first can work over time.',
  line:'"However, since demand for cigarettes is price inelastic, the tax may do little to reduce consumption; it mainly raises revenue, and as a regressive tax it hits low-income smokers hardest."'};

V.ev_polluter={kind:'card', btn:'Polluter pays', showing:'Make the polluter bear the cost',
  title:'The polluter pays principle',
  lead:'Whoever causes pollution should pay for the damage, so the cost is internalised instead of falling on third parties.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','Taxes, charges and permits make the polluter pay the external cost. The price then reflects the full cost to society, so less is produced and consumed.']]},
    {h:'Examples', l:[['','Fuel duty, landfill tax, London’s ULEZ charge, the plastic bag charge.']]},
    {h:'Limits', l:[['','The cost is often passed on to consumers in higher prices, especially when demand is inelastic, so the polluter may not really pay. Measuring the damage in money is difficult.']]}
  ]},
  use:[['Taxes on negative externalities','The principle behind a tax equal to the external cost.'],['Fairness','It feels fair, but can be regressive for fuel and energy.'],['Comparing policies','Taxes and permits follow it; subsidies for clean alternatives do not.']],
  line:'"The tax follows the polluter pays principle and internalises the externality; however, if demand is inelastic, firms can pass most of it on to consumers, so the polluter may bear little of the cost."'};

V.ev_permits={kind:'card', btn:'Tradable permits', showing:'Cap the pollution, let firms trade',
  title:'Tradable pollution permits',
  lead:'The government sets a cap on total pollution and issues permits up to that cap. Firms that pollute less can sell their spare permits to firms that need more.',
  card:{head:'The idea', items:[
    {h:'Why it works', l:[['','The government fixes the quantity of pollution instead of guessing the right tax. Firms that can cut pollution cheaply do so and sell their permits, so pollution is cut where it is cheapest. Lowering the cap over time pushes the permit price up.']]},
    {h:'Examples', l:[['','The EU Emissions Trading System, and the UK’s own emissions trading scheme for power stations, heavy industry and aviation.']]},
    {h:'Limits', l:[['','The cap is hard to set: issue too many permits and the price collapses. Permits handed out free reward polluters. Monitoring costs money, and rich firms or countries can simply buy permits and carry on polluting.']]}
  ]},
  use:[['Climate change and negative production externalities','A market-based alternative to taxes.'],['Comparing policies','More certainty over the amount of pollution than a tax, less over the price.'],['Government failure','Setting the cap needs information the government may not have.']],
  line:'"Tradable permits give certainty over the quantity of pollution, unlike a tax; however, if too many permits are issued, the permit price will be low and firms will have little reason to cut emissions."'};

V.ev_nudge={kind:'card', btn:'Nudges', showing:'Change the choice, not the price',
  title:'Nudges and choice architecture',
  lead:'A nudge changes the way a choice is presented so people make better decisions, without banning anything or changing prices much.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','People do not always act rationally: they stick with the default and follow what others do. Changing the default or the framing can change behaviour cheaply.']]},
    {h:'Examples', l:[['','Workplace pensions in the UK enrol workers automatically, so far more people save. England switched to an opt-out system for organ donation. Larger shops can no longer put sweets and crisps at the checkout.']]},
    {h:'Limits', l:[['','The effects can be small, and some people see nudges as manipulation. They work less well against addiction, where a tax or a ban may be needed.']]}
  ]},
  use:[['Alternatives to taxes and bans','A cheaper option that keeps freedom of choice.'],['Information failure and demerit goods','Helps people act in their own long-term interest.'],['Behavioural economics','Bounded rationality, defaults and social norms.']],
  line:'"An alternative would be a nudge, such as making the healthier option the default; this is cheap and keeps freedom of choice, but its effect may be too small for an addictive good."'};

V.ev_unintended={kind:'card', btn:'Unintended consequences', showing:'When intervention backfires',
  title:'Unintended consequences',
  lead:'Interventions change behaviour in ways the government did not plan, which can undo the policy or create new problems.',
  card:{head:'The idea', items:[
    {h:'Price controls', l:[['','A maximum price, such as a rent cap, creates a shortage: landlords supply fewer homes and black markets appear. A minimum price creates a surplus.']]},
    {h:'Taxes and bans', l:[['','High taxes on cigarettes and alcohol encourage smuggling and illegal sales. Banning a product can push it into an unregulated market.']]},
    {h:'Minimum unit pricing on alcohol', l:[['','Scotland and Wales set a minimum price per unit of alcohol, aimed at cheap, strong drinks. Critics argue it also costs moderate drinkers on low incomes, while heavy drinkers may cut spending on food instead.']]}
  ]},
  use:[['Any intervention','Always ask how firms and consumers will react.'],['Price controls','Shortages, surpluses and black markets.'],['Taxes on demerit goods','Smuggling and illegal markets.'],['Government failure','Unintended consequences are one of its causes.']],
  line:'"However, the policy may have unintended consequences: a high tax could encourage smuggling, so consumption of untaxed, unregulated cigarettes may rise."'};

V.ev_capture={kind:'card', btn:'Regulatory capture', showing:'When the regulator serves the industry',
  title:'Regulatory capture',
  lead:'Regulatory capture is when a regulator ends up acting in the interests of the firms it regulates rather than consumers.',
  card:{head:'The idea', items:[
    {h:'How it happens', l:[['','Regulators rely on firms for information (asymmetric information), staff move between the regulator and the industry, and firms lobby hard. Over time the regulator may go easy on them.']]},
    {h:'Example', l:[['','Critics argued that Ofwat allowed water companies to build up heavy debts and pay large dividends while sewage spills continued.']]},
    {h:'Solutions', l:[['','Independent regulators with real powers, transparency, and the threat of large fines or breaking firms up.']]}
  ]},
  use:[['Regulating monopolies','A price cap only works if the regulator is tough.'],['Privatised utilities','Water, energy and rail.'],['Government failure','Capture is one reason intervention fails.']],
  line:'"However, regulation may be undermined by regulatory capture: if the regulator depends on the firm for information, it may set a price cap that is too generous."'};

V.ev_contest={kind:'card', btn:'Contestability', showing:'The threat of entry can be enough',
  title:'Contestability: the threat of entry',
  lead:'A firm with monopoly power may still behave competitively if the market is contestable: if new firms could enter easily, the threat alone keeps prices down.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','With low barriers to entry and exit and low sunk costs, a firm charging high prices invites hit-and-run entry, so it prices close to average cost.']]},
    {h:'Examples', l:[['','Uber and Bolt shook up taxis, and app-only banks such as Monzo pushed high-street banks to improve.']]},
    {h:'Limits', l:[['','No market is perfectly contestable, and firms can raise barriers through advertising, patents or mergers.']]}
  ]},
  use:[['Any monopoly or oligopoly question','A high market share alone does not prove consumers are harmed.'],['Mergers and competition policy','A merger in a contestable market is less of a worry.'],['Efficiency','Contestable markets push firms towards productive and allocative efficiency.']],
  line:'"However, even with a large market share, the firm may keep prices low if the market is contestable, because supernormal profit would attract hit-and-run entry."',
  tip:'The diagrams are in Micro, Contestable markets.'};

V.ev_scale={kind:'card', btn:'Economies of scale', showing:'Big can mean cheaper',
  title:'Economies of scale: is big always bad?',
  lead:'A large firm with monopoly power may still charge less than many small firms could, because its average costs are lower.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','Bulk buying, better technology and spreading fixed costs cut average costs. Even after taking supernormal profit, the price can be below what small competitive firms would need to charge.']]},
    {h:'Natural monopoly', l:[['','Where one firm can supply the whole market most cheaply, such as water pipes or rail track, competition would mean wasteful duplication.']]},
    {h:'Limits', l:[['','Savings are only passed on if the firm faces competition or regulation. Big firms can also suffer diseconomies of scale and X-inefficiency.']]}
  ]},
  use:[['Monopoly and mergers','The benefit of size can outweigh the cost of market power.'],['Barriers to entry','The same economies of scale keep rivals out.'],['Growth of firms','A reason for horizontal integration.']],
  line:'"However, the merged firm may gain significant economies of scale, lowering average costs; if these savings are passed on, consumers could face lower prices despite less competition."',
  tip:'The diagrams are in Micro, Economies of scale, and in Monopoly, Natural monopoly.'};

V.ev_dynamic={kind:'card', btn:'Dynamic efficiency', showing:'Profit today, innovation tomorrow',
  title:'Dynamic efficiency: the case for profit',
  lead:'Supernormal profit is not all bad: it can pay for research and development that brings new products and lower costs over time.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','Firms with market power and supernormal profit can afford risky research, and patents protect the reward, which encourages innovation in the first place.']]},
    {h:'Examples', l:[['','Drug firms fund new medicines from their profits, and tech giants spend heavily on AI research.']]},
    {h:'Limits', l:[['','Without competition, the firm may not bother to innovate and may become X-inefficient instead. Big firms may buy up start-ups to shut down future rivals rather than to innovate.']]}
  ]},
  use:[['Monopoly and oligopoly','Static inefficiency now can be outweighed by dynamic gains later.'],['Patents and barriers to entry','The trade-off between innovation and high prices.'],['Efficiency questions','Static versus dynamic efficiency.']],
  line:'"However, the supernormal profit may be reinvested in research and development, leading to dynamic efficiency, although with little competition the firm may lack the incentive to do so."',
  tip:'The diagrams are in Micro, Efficiency.'};

V.ev_pa={kind:'card', btn:'Principal–agent problem', showing:'Owners and managers want different things',
  title:'The principal–agent problem',
  lead:'When owners (principals) hire managers (agents) to run a firm, the managers may pursue their own goals instead of the owners’.',
  card:{head:'The idea', items:[
    {h:'How it works', l:[['','Managers know more about the business than shareholders do (asymmetric information), so they can chase growth, sales or their own pay instead of profit.']]},
    {h:'Where you see it', l:[['','Large plcs with thousands of shareholders, and the public sector, where taxpayers are the principals.']]},
    {h:'Solutions', l:[['','Bonuses linked to profit or the share price, share options, and closer monitoring by shareholders.']]}
  ]},
  use:[['Objectives of firms','Why firms may not profit maximise.'],['Behaviour of firms','Why a firm might choose revenue or sales maximisation.'],['Public sector and nationalisation','Weak incentives to keep costs down.']],
  line:'"However, the firm may not profit maximise: because of the principal–agent problem, managers may prefer to maximise sales, which would mean a lower price and higher output."',
  tip:'The diagrams are in Micro, Objectives.'};

V.ev_microgen={kind:'card', btn:'Six angles', showing:'Six angles that fit almost any micro answer',
  title:'Six evaluation angles for any micro question',
  lead:'If you are stuck for evaluation, one of these almost always applies. Make it specific to the market in the question.',
  card:{head:'The angles', items:[
    PT('1. Elasticity',[['','PED, PES or YED decide how big the effect is. Inelastic demand means a small change in quantity.']]),
    PT('2. Time',[['','Short run versus long run: supply and demand both become more elastic over time.']]),
    PT('3. Size',[['','How big is the tax, subsidy, externality or price change?']]),
    PT('4. Information',[['','Does the government know enough to set the policy right? If not, there is a risk of government failure.']]),
    PT('5. Stakeholders',[['','Who wins and who loses: consumers, producers, workers, third parties, the government.']]),
    PT('6. Alternatives',[['','Would another policy work better: a tax, regulation, permits, information or a nudge?']])
  ]},
  use:[['Any 25-mark micro essay','Pick the two most relevant angles and develop each one fully, rather than listing all six.']],
  line:'"The effect depends on the price elasticity of demand: since demand for …"',
  tip:'Evaluation needs a reason and a judgement. Say which way it goes and why, not just "it depends".'};

/* ---------- externality diagrams: straight-line cost-benefit model ---------- */
var EXT={a:100,b:0.8,c:10,d:0.6,e:22};
/* a straight line drawn only where it is on the sheet (2 <= p <= PTOP, 0 <= q <= 116) */
function linSeg(g,fn,cls,qmaxDraw){
  var qm=qmaxDraw||116, f0=fn(0), s=(fn(qm)-f0)/qm, lo, hi;
  if(s>0){ lo=Math.max(0,(2-f0)/s); hi=Math.min(qm,(PTOP-f0)/s); }
  else { lo=Math.max(0,(PTOP-f0)/s); hi=Math.min(qm,(2-f0)/s); }
  return '<path class="curve '+cls+'" d="M'+r1(g.X(lo))+' '+r1(g.Y(fn(lo)))+'L'+r1(g.X(hi))+' '+r1(g.Y(fn(hi)))+'"/>';
}
/* label beside a straight line: above a falling line, under a rising one, so the line runs away from the text.
   A long label near the right edge slides back along the line until it fits inside its panel (version 25:
   at about 1024px wide the drawing is narrow but uses the full-size font) */
function linLab(g,fn,q,text,cls){
  var w=String(text).replace(/_/g,'').length*g.fs*0.56, right=g.mg.l+g.pw+g.mg.r-3, x0=g.X(0);
  if(g.X(q)+7+w>right && g.X(q)>x0) q=Math.max(0, q*(right-7-w-x0)/(g.X(q)-x0));
  var rising=fn(q+1)>fn(q);
  return g.txt(g.X(q)+7, g.Y(fn(q))+(rising?g.fs+3:-7), text, 'bold halo '+cls);
}
/* somewhere above every curve for a short note (tries a few centres, returns [q,p]) */
function freeSpot(g,fns,text,cands){
  var hw=text.length*g.fs*0.27/(g.pw/QMAX)+2, need=(8)/(g.ph/PMAX)+1.5;
  for(var i=0;i<cands.length;i++){
    var qc=cands[i], top=0;
    for(var q=qc-hw;q<=qc+hw;q+=1) fns.forEach(function(f){ var v=f(q); if(v<PTOP+6 && v>top) top=v; });
    if(top+need<=100) return [qc,top+need];
  }
  return null;
}
function renderExt(){
  var id=curId(), v=V[id], te=v.anim?ease(state.t):1, t=v.anim?state.t:1, E=EXT;
  var g=kit({ytitle:'Costs / benefits',xtitle:'Quantity'}), X=g.X, Y=g.Y, fs=g.fs, sm=g.small;
  var mpb=function(q){return E.a-E.b*q;}, mpc=function(q){return E.c+E.d*q;};
  var curves='', labels='', guides='', notes='', areas='';
  var lq=sm?80:88;                        /* where the curve labels sit */
  /* the four externality views grow out of the free market: the social curve
     peels away from the private one and the welfare loss shades in as it goes */
  var grow=v.grow?te:1, ee=E.e*grow, split=grow>0.12, done=grow>0.97;
  function cross(f1,f2){ return bisect(function(q){return f1(q)-f2(q);},0,116); }
  function tri(qa,qb,fTop,fBot){          /* welfare loss between two curves from qa to qb */
    var d='', n=24, k, q;
    for(k=0;k<=n;k++){ q=qa+(qb-qa)*k/n; d+=(k?'L':'M')+r1(X(q))+' '+r1(Y(fTop(q))); }
    for(k=n;k>=0;k--){ q=qa+(qb-qa)*k/n; d+='L'+r1(X(q))+' '+r1(Y(fBot(q))); }
    return '<path class="area a-dwl" d="'+d+'Z"/>';
  }
  /* the spec calls the positive consumption triangle the welfare gain area */
  var wlText=(id==='ex_poscons')?'welfare gain':'welfare loss';
  function wlNote(fns,q,p){ var s=freeSpot(g,fns,wlText,[50,60,40,70,30,80]); return s?g.leader([wlText],s[0],s[1],q,p):''; }
  function gapArrows(qa,qb,word){
    var y=Y(0)-11, a=X(Math.min(qa,qb))+3, b=X(Math.max(qa,qb))-3, out=arrowPx(a,y,b,y,'leader',6)+arrowPx(b,y,a,y,'leader',6);
    if(!sm) out+=g.txt((a+b)/2,y-7,word,'bold halo','middle');
    return out;
  }
  function axes2(qm,pm,qs,ps,labQ,labP,mutedM){
    var qx=spreadN([X(Math.min(qm,qs)),X(Math.max(qm,qs))],fs*1.8), py=spreadN([Y(Math.max(pm,ps)),Y(Math.min(pm,ps))],fs+7);
    var mFirst=qm<qs, mTop=pm>ps;
    return g.axQ(qx[mFirst?0:1],labQ[0],mutedM?'t-muted':'')+g.axQ(qx[mFirst?1:0],labQ[1],'t-eff')
         + g.axP(py[mTop?0:1],labP[0],mutedM?'t-muted':'')+g.axP(py[mTop?1:0],labP[1],'t-eff');
  }
  /* market point, then the optimum point once the curves have split */
  function points(qm,pm,qs,ps,over,word,fns,tq,tp){
    if(!split){ guides+=g.guide(qm,pm)+g.dot(qm,pm); notes+=g.axP(Y(pm),'P_m')+g.axQ(X(qm),'Q_m'); return; }
    guides+=g.guide(qm,pm,'muted')+g.dot(qm,pm,'muted')+g.guide(qs,ps,'eff')+g.dot(qs,ps,'eff');
    notes+=axes2(qm,pm,qs,ps,['Q_m','Q*'],['P_m','P*'],true);
    if(done) notes+=gapArrows(qs,qm,word)+wlNote(fns,tq,tp);
  }
  var qm=cross(mpb,mpc), pm=mpb(qm);
  if(id==='ex_base'){
    curves+=linSeg(g,mpb,'c-ar')+linSeg(g,mpc,'c-mc');
    labels+=linLab(g,mpb,lq,sm?'MPB':'MPB = D','t-ar')+linLab(g,mpc,lq,sm?'MPC':'MPC = S','t-mc');
    guides+=g.guide(qm,pm)+g.dot(qm,pm);
    notes+=g.axP(Y(pm),'P_m')+g.axQ(X(qm),'Q_m');
  }
  else if(id==='ex_negprod'){
    var msc=function(q){return mpc(q)+ee;}, qs=cross(mpb,msc), ps=mpb(qs);
    curves+=linSeg(g,mpb,'c-ar')+linSeg(g,mpc,'c-mc')+(split?linSeg(g,msc,'c-ac'):'');
    labels+=linLab(g,mpb,lq,'MPB = MSB','t-ar')+linLab(g,mpc,lq,split?'MPC':'MPC = MSC','t-mc')+(split?linLab(g,msc,lq-8,'MSC','t-ac'):'');
    if(qm-qs>0.3) areas+=tri(qs,qm,msc,mpb);
    points(qm,pm,qs,ps,true,'over-production',[mpb,msc,mpc],(2*qm+qs)/3,(msc(qm)+pm+ps)/3);
  }
  else if(id==='ex_wl'){
    /* the method, one step at a time: market point, optimum, up to the moved curve, join and shade */
    var mscW=function(q){return mpc(q)+E.e;}, qw=cross(mpb,mscW), pw=mpb(qw), top=mscW(qm), s=t*4;
    curves+=linSeg(g,mpb,'c-ar')+linSeg(g,mpc,'c-mc')+linSeg(g,mscW,'c-ac');
    labels+=linLab(g,mpb,lq,'MPB = MSB','t-ar')+linLab(g,mpc,lq,'MPC','t-mc')+linLab(g,mscW,lq-8,'MSC','t-ac');
    var step=function(n,x,y,anchor){ return g.txt(x,y,String(n),'bold halo t-eff',anchor||'start'); };
    if(s>=0.1){ guides+=g.guide(qm,pm)+g.dot(qm,pm); notes+=step(1,X(qm)+10,Y(pm)+5); }
    if(s>=1){ guides+=g.guide(qw,pw,'eff')+g.dot(qw,pw,'eff'); notes+=step(2,X(qw)-10,Y(pw)-6,'end'); }
    var qx=spreadN([X(qw),X(qm)],fs*1.8), py=spreadN([Y(pw),Y(pm)],fs+7);
    notes+=(s>=0.1?g.axQ(qx[1],'Q_m')+g.axP(py[1],'P_m'):'')+(s>=1?g.axQ(qx[0],'Q*','t-eff')+g.axP(py[0],'P*','t-eff'):'');
    if(s>=2){
      var f3=Math.min(1,s-2), p3=pm+(top-pm)*f3;
      notes+='<path class="gap" d="M'+r1(X(qm))+' '+r1(Y(pm))+'V'+r1(Y(p3))+'"/>';
      if(f3>=1) notes+=g.dot(qm,top,'eff')+step(3,X(qm)+10,Y(top)+5);
    }
    if(s>=3){
      var f4=Math.min(1,(s-3)/0.6), qe=qm+(qw-qm)*f4, pe=top+(pw-top)*f4;
      notes+='<path class="gap" d="M'+r1(X(qm))+' '+r1(Y(top))+'L'+r1(X(qe))+' '+r1(Y(pe))+'"/>';
      if(s>=3.6){ areas+=tri(qw,qm,mscW,mpb); notes+=step(4,X((2*qm+qw)/3)-4,Y((top+pm+pw)/3)+5,'middle'); }
    }
  }
  else if(id==='ex_tax' || id==='ev_govfail'){
    var mscT=function(q){return mpc(q)+E.e;}, qsT=cross(mpb,mscT), psT=mpb(qsT);
    curves+=linSeg(g,mpb,'c-ar')+linSeg(g,mscT,'c-ac');
    labels+=linLab(g,mpb,lq,'MPB = MSB','t-ar')+linLab(g,mscT,lq-8,(id==='ex_tax'&&te>0.97)?'MSC = MPC + tax':'MSC','t-ac');
    if(id==='ex_tax'){
      var tx=E.e*te, mt=function(q){return mpc(q)+tx;}, qt=cross(mpb,mt), pt=mpb(qt);
      curves+=linSeg(g,mpc,'c-mc ghost')+(te>0.02?linSeg(g,mt,'c-mc'):'');
      labels+=linLab(g,mpc,lq,'MPC','t-mc');
      if(qt-qsT>0.3) areas+=tri(qsT,qt,mscT,mpb);
      if(te>0.12) notes+=arrowPx(X(24),Y(mpc(24))-3,X(24),Y(mt(24))+3,'leader',7)+g.txt(X(24)+7,(Y(mpc(24))+Y(mt(24)))/2+5,'tax','bold halo');
      guides+=g.guide(qm,pm,'muted')+g.dot(qm,pm,'muted')+g.guide(qt,pt,te>0.97?'eff':'')+g.dot(qt,pt,te>0.97?'eff':'');
      notes+=axes2(qm,pm,qt,pt,['Q_m',te>0.97?'Q*':'Q'],['P_m',te>0.97?'P*':'P'],true);
    } else {
      /* the tax keeps rising past the external cost: over-production shrinks, then under-production opens up */
      var tg=E.e*1.6*te, mg=function(q){return mpc(q)+tg;}, qg=cross(mpb,mg), pg=mpb(qg);
      curves+=linSeg(g,mpc,'c-mc ghost')+(te>0.02?linSeg(g,mg,'c-mc'):'');
      labels+=(te>0.97?linLab(g,mg,lq-16,'MPC + tax','t-mc'):'')+linLab(g,mpc,lq,'MPC','t-mc');
      if(qg-qsT>0.3) areas+=tri(qsT,qg,mscT,mpb); else if(qsT-qg>0.3) areas+=tri(qg,qsT,mpb,mscT);
      if(te<0.97){ guides+=g.guide(qg,pg)+g.dot(qg,pg)+g.guide(qsT,psT,'eff')+g.dot(qsT,psT,'eff'); }
      else {
        guides+=g.vline(qm,pm,'muted')+g.guide(qsT,psT,'eff')+g.dot(qsT,psT,'eff')+g.guide(qg,pg)+g.dot(qg,pg);
        var qx3=spreadN([X(qg),X(qsT),X(qm)],fs*1.8);
        notes+=g.axQ(qx3[0],'Q_t')+g.axQ(qx3[1],'Q*','t-eff')+g.axQ(qx3[2],'Q_m','t-muted')+gapArrows(qg,qsT,'under-production');
        notes+=wlNote([mpb,mscT,mg],(2*qg+qsT)/3,(mpb(qg)+mscT(qg)+psT)/3);
      }
    }
  }
  else if(id==='ex_negcons'){
    var msb=function(q){return mpb(q)-ee;}, qs2=cross(msb,mpc), ps2=mpc(qs2);
    curves+=linSeg(g,mpb,'c-ar')+(split?linSeg(g,msb,'c-ac'):'')+linSeg(g,mpc,'c-mc');
    labels+=linLab(g,mpb,lq+4,split?'MPB':'MPB = MSB','t-ar')+(split?linLab(g,msb,lq,'MSB','t-ac'):'')+linLab(g,mpc,lq,'MPC = MSC','t-mc');
    if(qm-qs2>0.3) areas+=tri(qs2,qm,mpc,msb);
    points(qm,pm,qs2,ps2,true,'over-consumption',[mpb,msb,mpc],(2*qm+qs2)/3,(pm+msb(qm)+ps2)/3);
  }
  else if(id==='ex_posprod'){
    var msc2=function(q){return mpc(q)-ee;}, qs3=cross(mpb,msc2), ps3=mpb(qs3);
    curves+=linSeg(g,mpb,'c-ar')+linSeg(g,mpc,'c-mc')+(split?linSeg(g,msc2,'c-ac'):'');
    labels+=linLab(g,mpb,lq,'MPB = MSB','t-ar')+linLab(g,mpc,lq-14,split?'MPC':'MPC = MSC','t-mc')+(split?linLab(g,msc2,sm?36:40,'MSC','t-ac'):'');
    if(qs3-qm>0.3) areas+=tri(qm,qs3,mpb,msc2);
    points(qm,pm,qs3,ps3,false,'under-production',[mpb,mpc,msc2],(2*qm+qs3)/3,(pm+msc2(qm)+ps3)/3);
  }
  else if(id==='ex_poscons' || id==='ex_sub'){
    var eb=id==='ex_sub'?E.e:ee, msb2=function(q){return mpb(q)+eb;}, qs4=cross(msb2,mpc), ps4=mpc(qs4), split4=id==='ex_sub'||split;
    curves+=linSeg(g,mpb,'c-ar')+(split4?linSeg(g,msb2,'c-ac'):'');
    labels+=linLab(g,mpb,lq+4,split4?'MPB':'MPB = MSB','t-ar')+(split4?linLab(g,msb2,sm?88:92,'MSB','t-ac'):'');
    if(id==='ex_poscons'){
      curves+=linSeg(g,mpc,'c-mc'); labels+=linLab(g,mpc,sm?30:34,'MPC = MSC','t-mc');
      if(qs4-qm>0.3) areas+=tri(qm,qs4,msb2,mpc);
      points(qm,pm,qs4,ps4,false,'under-consumption',[mpb,msb2,mpc],(2*qm+qs4)/3,(pm+msb2(qm)+ps4)/3);
    } else {
      var sb=E.e*te, ms=function(q){return mpc(q)-sb;}, q2=cross(mpb,ms), p2=mpb(q2);
      curves+=linSeg(g,mpc,'c-mc'+(te>0.02?' ghost':''))+(te>0.02?linSeg(g,ms,'c-mc'):'');
      /* the shifted curve's full name only where it fits at the right edge (about 1024px wide it does not) */
      var msName=(X(94)+7+13*fs*0.56<=g.W-3)?'MPC − subsidy':'MPC − sub';
      labels+=linLab(g,mpc,sm?30:34,sm?'MSC':'MPC = MSC','t-mc')+(te>0.5&&!sm?linLab(g,ms,94,msName,'t-mc'):'');
      if(qs4-q2>0.3) areas+=tri(q2,qs4,msb2,mpc);
      var qa=sm?52:58;   /* the subsidy arrow sits right of the long "MPC = MSC" label */
      if(te>0.12) notes+=arrowPx(X(qa),Y(mpc(qa))+3,X(qa),Y(ms(qa))-3,'leader',7)+(sm?'':g.txt(X(qa)+7,(Y(mpc(qa))+Y(ms(qa)))/2+5,'subsidy','bold halo'));
      guides+=g.guide(qm,pm,'muted')+g.dot(qm,pm,'muted')+g.guide(q2,p2,te>0.97?'eff':'')+g.dot(q2,p2,te>0.97?'eff':'');
      notes+=axes2(qm,pm,q2,p2,['Q_m',te>0.97?'Q*':'Q'],['P_m','P_2'],true);
    }
  }
  g.out(areas,curves,guides,labels,notes);
}

/* ---------- classical AD/AS: straight AD and SRAS, vertical LRAS ---------- */
var AD2={a:110,b:0.85,s:-5.5,k:0.8,yfe:70};
function renderAD2(){
  var v=cur(), te=v.anim?ease(state.t):1, M=AD2;
  var g=kit({ytitle:'Price level',xtitle:'Real GDP'}), X=g.X, Y=g.Y, fs=g.fs, sm=g.small;
  var amt=(v.amt!=null)?v.amt:null, dA=v.sh==='ad'?(amt!=null?amt:25)*te:0, dS=v.sh==='sras'?(amt!=null?amt:20)*te:(v.sh==='lras'?-29.7*te:0), dL=v.sh==='lras'?18*te:0;
  var ad=function(A){return function(y){return A-M.b*y;};}, sras=function(S){return function(y){return S+M.k*y;};};
  var A0=M.a, A1=M.a+dA, S0=M.s, S1=M.s+dS, L0=M.yfe, L1=M.yfe+dL, moving=te>0.02 && !!v.sh;
  /* labels sit well right of equilibrium: AD above its line, SRAS under its line */
  var curves='', labels='', guides='', notes='', lq=sm?98:102;
  function lras(L,cls,name,left){
    curves+='<path class="curve c-ac'+(cls||'')+'" d="M'+r1(X(L))+' '+r1(Y(PTOP))+'V'+r1(Y(0))+'"/>';
    labels+=g.txt(X(L)+(left?-6:6),Y(PTOP)+12,name,'bold t-ac halo',left?'end':'start');
  }
  if(v.sh==='ad' && moving){ curves+=linSeg(g,ad(A0),'c-ar ghost'); labels+=linLab(g,ad(A0),lq+2,'AD_1','t-ar'); curves+=linSeg(g,ad(A1),'c-ar'); labels+=linLab(g,ad(A1),lq+2,'AD_2','t-ar'); }
  else { curves+=linSeg(g,ad(A0),'c-ar'); labels+=linLab(g,ad(A0),v.sh==='lras'?(sm?108:110):lq+2,'AD','t-ar'); }
  if((v.sh==='sras'||v.sh==='lras') && moving){ curves+=linSeg(g,sras(S0),'c-mc ghost')+linSeg(g,sras(S1),'c-mc'); labels+=linLab(g,sras(S0),lq,'SRAS_1','t-mc')+linLab(g,sras(S1),lq,'SRAS_2','t-mc'); }
  else { curves+=linSeg(g,sras(S0),'c-mc'); labels+=linLab(g,sras(S0),lq,'SRAS','t-mc'); }
  if(v.sh==='lras' && moving){ lras(L0,' ghost','LRAS_1',true); lras(L1,'','LRAS_2',false); }
  else lras(L0,'','LRAS',false);
  function eq(A,S){ var y=(A-S)/(M.b+M.k); return {y:y,p:A-M.b*y}; }
  var e0=eq(A0,S0), e1=eq(A1,S1);
  if(!moving){
    guides+=g.guide(e0.y,e0.p)+g.dot(e0.y,e0.p);
    notes+=g.axP(Y(e0.p),'P_1')+g.axQ(X(e0.y),v.sh?'Y_1':'Y_FE');
  } else {
    guides+=g.guide(e0.y,e0.p,'muted')+g.dot(e0.y,e0.p,'muted')+g.guide(e1.y,e1.p)+g.dot(e1.y,e1.p);
    var py=spread(Y(e0.p),Y(e1.p),fs+9), qx=spread(X(e0.y),X(e1.y),fs*1.7);
    notes+=g.axP(py[0],'P_1','t-muted')+g.axQ(qx[0],'Y_1','t-muted')+g.axP(py[1],'P_2')+g.axQ(qx[1],'Y_2');
  }
  g.out('',curves,guides,labels,notes);
}

/* ---------- evaluation diagrams ---------- */
function renderEv(){
  var id=curId(), v=V[id], t=v.anim?state.t:1, te=v.anim?ease(state.t):1, d, i, n;
  if(id==='ev_ped'){ renderPedTax(); return; }
  if(id==='ev_capacity'){
    var g=kit({ytitle:'Price level',xtitle:'Real GDP'}), X=g.X, Y=g.Y, fs=g.fs;
    d='M'+r1(X(0))+' '+r1(Y(30))+'H'+r1(X(45));
    var yTop=91.25; for(i=1;i<=60;i++){ var yy=45+(yTop-45)*i/60; d+='L'+r1(X(yy))+' '+r1(Y(asP(yy))); }
    var curves='<path class="curve c-ac" d="'+d+'"/>', labels=g.txt(X(yTop)-9,Y(asP(yTop))+13,'AS','bold t-ac halo','end'), guides='', notes='';
    var As=[45,75,105,135], A=45+90*te, eqY=function(Ad){ return Ad-0.9*45>=30 ? bisect(function(z){return Ad-0.9*z-asP(z);},45.01,94.5) : (Ad-30)/0.9; };
    function adLine(Ad,cls,name){
      var y0=Math.max(0,(Ad-PTOP)/0.9), y1=Math.min(117,(Ad-4)/0.9);
      curves+='<path class="curve c-ar'+cls+'" d="M'+r1(X(y0))+' '+r1(Y(Ad-0.9*y0))+'L'+r1(X(y1))+' '+r1(Y(Ad-0.9*y1))+'"/>';
      if(name) labels+=g.txt(X(y0)+(y0>0?7:8),Y(Ad-0.9*y0)+(y0>0?13:-7),name,'bold t-ar halo');
    }
    var pts=As.map(function(a){var y=eqY(a); return [y, a-0.9*y];}), qx=spreadN(pts.map(function(p){return X(p[0]);}),fs*1.7);
    for(i=0;i<4;i++){
      if(As[i]>A+0.01) continue;
      var last=(i===3 || As[i+1]>A+0.01) && te>=0.999;
      adLine(As[i], last?'':' ghost', 'AD_'+(i+1));
      guides+=g.vline(pts[i][0],pts[i][1],last?'':'muted')+g.dot(pts[i][0],pts[i][1]);
      notes+=g.txt(X(pts[i][0])+7,Y(pts[i][1])-7,String(i+1),'bold halo')+g.axQ(qx[i],'Y_'+(i+1),last?'':'t-muted');
    }
    if(te<0.999){ var yn=eqY(A); adLine(A,'',''); guides+=g.dot(yn,A-0.9*yn,'eff'); }
    g.out('',curves,guides,labels,notes);
    return;
  }
  if(id==='ev_srpc' || id==='ev_lrpc'){
    var g2=kit({qmax:12,pmax:12,ytitle:'Inflation (%)',xtitle:'Unemployment (%)'}), X2=g2.X, Y2=g2.Y, fs2=g2.fs, top=12*PTOP/PMAX;
    var pc=function(shift){return function(u){return 9/(u-1.5)+shift;};};
    function pcPath(f,cls){ var u0=bisect(function(u){return f(u)-top;},1.6,6), dd='', k; for(k=0;k<=70;k++){ var u=u0+(11.5-u0)*k/70; dd+=(k?'L':'M')+r1(X2(u))+' '+r1(Y2(f(u))); } return '<path class="curve '+cls+'" d="'+dd+'"/>'; }
    var c2='', l2='', gd2='', nt2='', ua=6, ub=3.5, sh=2.5, f1=pc(0);
    var letter=function(u,p,s,dx,dy){return g2.txt(X2(u)+dx,Y2(p)+dy,s,'bold halo');};
    if(id==='ev_srpc'){
      c2+=pcPath(f1,'c-mc'); l2+=g2.txt(X2(11.5),Y2(f1(11.5))-9,'SRPC','bold t-mc halo','end');
      gd2+=g2.guide(ua,f1(ua),'muted')+g2.dot(ua,f1(ua)); nt2+=letter(ua,f1(ua),'A',8,-8);
      if(te<0.999){ var uz=ua+(ub-ua)*te; gd2+=g2.dot(uz,f1(uz),'eff'); }
      else {
        gd2+=g2.guide(ub,f1(ub))+g2.dot(ub,f1(ub)); nt2+=letter(ub,f1(ub),'B',8,-8);
        var mid=4.6; nt2+=arrowPx(X2(5.6)-2,Y2(f1(5.6))-10,X2(mid)-2,Y2(f1(mid))-10,'leader',7);
        nt2+=g2.leader(['boost AD:','lower unemployment,','higher inflation'], 8.6, 9.6, 4.4, f1(4.4)+0.15);
      }
    } else {
      var s1=t<0.5?0:sh*ease((t-0.5)/0.5), u1, p1;
      if(t<0.5){ var a=ease(t/0.5); u1=ua+(ub-ua)*a; p1=f1(u1); } else { var b=ease((t-0.5)/0.5); u1=ub+(ua-ub)*b; p1=f1(ub); }
      c2+='<path class="curve c-ac" d="M'+r1(X2(ua))+' '+r1(Y2(top))+'V'+r1(Y2(0))+'"/>';
      l2+=g2.txt(X2(ua)+6,Y2(top)+12,'LRPC','bold t-ac halo');
      c2+=pcPath(f1,'c-mc'+(s1>0.05?' ghost':'')); l2+=g2.txt(X2(11.5),Y2(f1(11.5))-9,'SRPC_1','bold t-mc halo','end');
      if(s1>0.05){ var f2=pc(s1); c2+=pcPath(f2,'c-mc'); l2+=g2.txt(X2(11.5),Y2(f2(11.5))-9,'SRPC_2','bold t-mc halo','end'); }
      gd2+=g2.dot(ua,f1(ua))+(t>=0.5?g2.dot(ub,f1(ub)):'')+(t>=1?g2.dot(ua,f1(ub),'eff'):'');
      nt2+=letter(ua,f1(ua),'A',-20,fs2+4)+(t>=0.5?letter(ub,f1(ub),'B',-20,fs2+4):'')+(t>=1?letter(ua,f1(ub),'C',8,-8):'');
      if(t>0 && t<1) gd2+=g2.dot(u1,p1,'eff');
      nt2+=g2.axQ(X2(ua),'NAIRU','t-ac');
    }
    g2.out('',c2,gd2,l2,nt2);
    return;
  }
  if(id==='ev_laffer'){
    var g3=kit({qmax:110,pmax:110,ytitle:'Tax revenue',xtitle:'Tax rate'}), X3=g3.X, Y3=g3.Y;
    var R=function(tr){ var x=tr/100; return x<=0||x>=1 ? 0 : 310*x*Math.pow(1-x,0.8); };
    var ts=100/1.8, ta=30, ra=R(ta), tb=bisect(function(x){return R(x)-ra;},ts,99.5);
    var tEnd=100*te; d=''; for(i=0;i<=90;i++){ var tr=tEnd*i/90; d+=(i?'L':'M')+r1(X3(tr))+' '+r1(Y3(R(tr))); }
    var cv='<path class="curve c-ar" d="'+d+'"/>';
    if(te<0.999){ g3.out('',cv,g3.dot(tEnd,R(tEnd),'eff'),'',g3.axQ(X3(100),'100%')); return; }   /* the rate rises: revenue climbs, peaks, then falls */
    var gd3=g3.vline(ts,R(ts),'eff')+g3.dot(ts,R(ts),'eff')+'<path class="guide muted" d="M'+r1(X3(0))+' '+r1(Y3(ra))+'H'+r1(X3(tb))+'"/>'+g3.vline(ta,ra,'muted')+g3.vline(tb,ra,'muted')+g3.dot(ta,ra)+g3.dot(tb,ra);
    var nt3=g3.axQ(X3(ts),'t*','t-eff')+g3.axQ(X3(100),'100%')+g3.txt(X3(ta)-8,Y3(ra)-8,'A','bold halo','end')+g3.txt(X3(tb)+8,Y3(ra)-8,'B','bold halo')
      + g3.txt(X3(ts),Y3(R(ts))-11,'most revenue','bold t-eff halo','middle');
    g3.out('',cv,gd3,'',nt3);
    return;
  }
  if(id==='ev_kuz_env' || id==='ev_kuz_ineq'){
    var env=(id==='ev_kuz_env'), g4=kit({ytitle:env?'Environmental damage':'Income inequality',xtitle:'GDP per capita'}), X4=g4.X, Y4=g4.Y, sm4=g4.small;
    var K=function(y){ return 88*Math.pow(y/48,1.6)*Math.exp(1.6*(1-y/48)); };
    var yEnd=1+115*te; d=''; for(i=0;i<=90;i++){ var y=1+(yEnd-1)*i/90; d+=(i?'L':'M')+r1(X4(y))+' '+r1(Y4(K(y))); }
    var cv4='<path class="curve c-ar" d="'+d+'"/>', nt4='', gd4=g4.vline(48,88,'eff')+g4.dot(48,88,'eff');
    if(te<0.999){ g4.out('',cv4,g4.dot(yEnd,K(yEnd),'eff'),'',''); return; }   /* the economy grows along the curve */
    nt4+=g4.axQ(X4(48),'turning point','t-eff');
    if(env){
      nt4+=g4.txt(X4(sm4?21:22),Y4(8),sm4?'industry':'industry grows','bold t-muted halo','middle')+g4.txt(X4(sm4?92:88),Y4(8),sm4?'services':'services, clean tech','bold t-muted halo','middle');
    } else {
      var up=function(y){ return K(92)+0.035*(y-92)*(y-92); };
      d=''; for(i=0;i<=30;i++){ var y2=92+24*i/30; d+=(i?'L':'M')+r1(X4(y2))+' '+r1(Y4(up(y2))); }
      cv4+='<path class="curve c-ar" style="stroke-dasharray:6 6" d="'+d+'"/>';
      nt4+=g4.txt(X4(116),Y4(up(116))-9,'rising again?','bold t-ar halo','end');
      nt4+=g4.txt(X4(sm4?21:22),Y4(8),sm4?'early growth':'early growth','bold t-muted halo','middle');
    }
    g4.out('',cv4,gd4,'',nt4);
    return;
  }
  if(id==='ev_easterlin'){
    var g5=kit({ytitle:'Index',xtitle:'Time'}), X5=g5.X, Y5=g5.Y;
    var gdp=function(x){return 16+0.6*x+0.001*x*x;}, hap=function(x){return 52+2.2*Math.sin(x/6.5)+1.3*Math.sin(x/2.7);};
    var xEnd=4+112*te, p1='', p2=''; for(i=0;i<=90;i++){ var x=4+(xEnd-4)*i/90; p1+=(i?'L':'M')+r1(X5(x))+' '+r1(Y5(gdp(x))); p2+=(i?'L':'M')+r1(X5(x))+' '+r1(Y5(hap(x))); }
    var cv5='<path class="curve c-ar" d="'+p1+'"/><path class="curve c-mc" d="'+p2+'"/>';
    if(te<0.999){ g5.out('',cv5,g5.dot(xEnd,gdp(xEnd),'eff')+g5.dot(xEnd,hap(xEnd),'eff'),'',''); return; }   /* decades pass: income climbs, happiness does not */
    var lb5=g5.txt(X5(100)-8,Y5(gdp(100))-8,'real GDP per head','bold t-ar halo','end')+g5.txt(X5(116),Y5(hap(116))+g5.fs+6,'average happiness','bold t-mc halo','end');
    g5.out('',cv5,'',lb5,'');
    return;
  }
}
/* the same tax on inelastic and elastic demand, side by side */
function renderPedTax(){
  var small=(plot.clientWidth||640)<480, tax=24*(V.ev_ped.anim?ease(state.t):1), full=tax>23.9;
  var specs=[{a:146,b:2.2,head:small?'Inelastic':'Inelastic demand'},{a:62.75,b:0.35,head:small?'Elastic':'Elastic demand'}];
  var inner='', first=null;
  specs.forEach(function(s,i){
    var g=kit({n:2,i:i,head:s.head,ytitle:'Price',xtitle:'Quantity'}), X=g.X, Y=g.Y, fs=g.fs;
    if(!first) first=g;
    var D=function(q){return s.a-s.b*q;}, S1=function(q){return 20+0.6*q;}, S2=function(q){return 20+tax+0.6*q;};
    if(!full){
      var qq1=(s.a-20)/(s.b+0.6), pp1=D(qq1), qq2=(s.a-20-tax)/(s.b+0.6), pp2=D(qq2);
      var cvA=linSeg(g,D,'c-ar')+linSeg(g,S1,'c-mc ghost')+(tax>0.3?linSeg(g,S2,'c-mc'):'');
      var arA=tax>0.3?g.box(0,qq2,pp1,pp2,'area a-cost')+g.box(0,qq2,pp2-tax,pp1,'area a-cs'):'';
      inner+=g.compose(arA,cvA,g.guide(qq1,pp1,'muted')+g.dot(qq1,pp1,'muted')+g.dot(qq2,pp2),'',g.axP(Y(pp1),'P_1','t-muted'));
      return;
    }
    var q1=(s.a-20)/(s.b+0.6), p1=D(q1), q2=(s.a-20-tax)/(s.b+0.6), p2=D(q2), pp=p2-tax;
    var curves=linSeg(g,D,'c-ar')+linSeg(g,S1,'c-mc ghost')+linSeg(g,S2,'c-mc');
    var labels=linLab(g,D,i===0?Math.max(22,(s.a-100)/s.b):92,'D','t-ar')+linLab(g,S1,96,'S','t-mc')+linLab(g,S2,small?48:70,'S + tax','t-mc');
    var areas=g.box(0,q2,p1,p2,'area a-cost')+g.box(0,q2,pp,p1,'area a-cs');
    var guides=g.guide(q1,p1,'muted')+g.dot(q1,p1,'muted')+g.guide(q2,p2)+g.dot(q2,p2)+g.hline(q2,pp)+g.dot(q2,pp);
    var py=spreadN([Y(p2),Y(p1),Y(pp)],fs+9), qx=spreadN([X(q2),X(q1)],fs*1.7);
    var notes=g.axP(py[0],'P_2')+g.axP(py[1],'P_1','t-muted')+g.axQ(qx[0],'Q_2')+g.axQ(qx[1],'Q_1','t-muted');
    inner+=g.compose(areas,curves,guides,labels,notes);
  });
  wrapSvg(first,inner);
}

/* =====================================================================
   THEMES 1 AND 2: DIAGRAMS (version 24)
   mkt    one market: supply and demand, shifts, surplus, taxes, subsidies,
          maximum and minimum prices, pollution permits; PED and PES in two panels
   ppf1   production possibility frontier
   flow   circular flow of income, simple and with injections and withdrawals
   cycle  the trade cycle and output gaps
   rounds the multiplier, round by round
   ===================================================================== */
/* demand P = a − bQ and supply P = c + dQ meet at Q = 60, P = 52 */
var MKT={a:100,b:0.8,c:10,d:0.7};
function polyPts(g,pts,cls){ return '<path class="'+cls+'" d="'+pts.map(function(p,i){ return (i?'L':'M')+r1(g.X(p[0]))+' '+r1(g.Y(p[1])); }).join('')+'Z"/>'; }
/* a double-headed horizontal arrow between two quantities at one price */
function hGap(g,q0,q1,p,cls,dy){
  var y=g.Y(p)+(dy||0), a=g.X(q0), b=g.X(q1), m=(a+b)/2;
  return arrowPx(m,y,a+(a<b?2:-2),y,cls,7)+arrowPx(m,y,b+(b<a?2:-2),y,cls,7);
}
function renderMkt(){
  var v=cur(), m=v.m, te=v.anim?ease(state.t):1;
  if(m==='ped' || m==='pes'){ renderMkt2(v,te); return; }
  var perm=(m==='permit');
  var g=kit({ytitle:perm?'Price of a permit':'Price', xtitle:perm?'Number of permits':'Quantity'}), X=g.X, Y=g.Y, fs=g.fs, sm=g.small;
  var a=MKT.a, b=MKT.b, c=MKT.c, d=MKT.d;
  function D(A){ return function(q){ return A-b*q; }; }
  function S(C){ return function(q){ return C+d*q; }; }
  function eq(A,C){ var q=(A-C)/(b+d); return {q:q, p:A-b*q}; }
  var areas='', curves='', guides='', labels='', notes='', lq=sm?94:98, e0=eq(a,c);
  function ax(ps,qs){   /* ps, qs: lists of [value, label, muted] */
    var py=spreadN(ps.map(function(x){ return Y(x[0]); }),fs+9), qx=spreadN(qs.map(function(x){ return X(x[0]); }),fs*1.9);
    ps.forEach(function(x,i){ notes+=g.axP(py[i],x[1],x[2]?'t-muted':''); });
    qs.forEach(function(x,i){ notes+=g.axQ(qx[i],x[1],x[2]?'t-muted':''); });
  }
  if(m==='demand' || m==='supply'){
    var dem=(m==='demand'), f=dem?D(a):S(c), p1=dem?70:34, p2=dem?42:62, q1=dem?(a-p1)/b:(p1-c)/d, q2=dem?(a-p2)/b:(p2-c)/d;
    curves+=linSeg(g,f,dem?'c-ar':'c-mc'); labels+=linLab(g,f,lq,dem?'D':'S',dem?'t-ar':'t-mc');
    guides+=g.guide(q1,p1,'muted')+g.dot(q1,p1,'muted')+g.guide(q2,p2)+g.dot(q2,p2);
    var o=dem?9:-9, ma=q1+(q2-q1)*0.22, mb=q1+(q2-q1)*0.78;
    notes+=arrowPx(X(ma),Y(f(ma)+o),X(mb),Y(f(mb)+o),'leader',9);
    var mid=(q1+q2)/2;
    notes+=g.txt(X(mid)+(dem?8:10),Y(f(mid)+(dem?16:-15)),dem?'extension of demand':'extension of supply','bold halo',dem?'start':'start');
    ax([[p1,'P_1',true],[p2,'P_2']],[[q1,'Q_1',true],[q2,'Q_2']].sort(function(x,y){ return x[0]-y[0]; }));
  }
  else if(m==='eq' || m==='excess'){
    curves+=linSeg(g,D(a),'c-ar')+linSeg(g,S(c),'c-mc');
    labels+=linLab(g,D(a),lq,'D','t-ar')+linLab(g,S(c),lq,'S','t-mc');
    guides+=g.guide(e0.q,e0.p)+g.dot(e0.q,e0.p);
    if(m==='eq') ax([[e0.p,'P_e']],[[e0.q,'Q_e']]);
    else {
      var pa=70, pb=34, qda=(a-pa)/b, qsa=(pa-c)/d, qdb=(a-pb)/b, qsb=(pb-c)/d;
      guides+=g.hline(Math.max(qda,qsa)+4,pa,'muted')+g.hline(Math.max(qdb,qsb)+4,pb,'muted');
      guides+=g.dot(qda,pa,'muted')+g.dot(qsa,pa,'muted')+g.dot(qdb,pb,'muted')+g.dot(qsb,pb,'muted');
      notes+=hGap(g,qda,qsa,pa,'leader',-9)+g.txt(X((qda+qsa)/2),Y(pa)-15,'excess supply','bold halo','middle');
      notes+=hGap(g,qsb,qdb,pb,'leader',9)+g.txt(X((qsb+qdb)/2),Y(pb)+fs+13,'excess demand','bold halo','middle');
      ax([[pa,'P_1'],[e0.p,'P_e'],[pb,'P_2']],[[e0.q,'Q_e']]);
    }
  }
  else if(m==='dshift' || m==='sshift' || m==='both' || m==='surplus'){
    var dd=(m==='dshift'||m==='both')?(v.dd||0):0, ds=(m==='sshift'||m==='both'||m==='surplus')?(v.ds||0):0;
    var A1=a+b*dd*te, C1=c-d*ds*te, movD=Math.abs(A1-a)>0.3, movS=Math.abs(C1-c)>0.3, e1=eq(A1,C1);
    var lqD=(m==='both')?lq-16:lq;   /* both curves moving: keep the D and S labels apart */
    if(movD){ curves+=linSeg(g,D(a),'c-ar ghost')+linSeg(g,D(A1),'c-ar'); labels+=linLab(g,D(a),lqD,'D_1','t-ar')+linLab(g,D(A1),lqD,'D_2','t-ar'); }
    else { curves+=linSeg(g,D(a),'c-ar'); labels+=linLab(g,D(a),lq,'D','t-ar'); }
    if(movS){ curves+=linSeg(g,S(c),'c-mc ghost')+linSeg(g,S(C1),'c-mc'); labels+=linLab(g,S(c),lq,'S_1','t-mc')+linLab(g,S(C1),lq,'S_2','t-mc'); }
    else { curves+=linSeg(g,S(c),'c-mc'); labels+=linLab(g,S(c),lq,'S','t-mc'); }
    if(m==='surplus'){
      var cut=Math.max(0,C1);
      areas+=polyPts(g,[[0,A1],[0,e1.p],[e1.q,e1.p]],'area a-cs')+polyPts(g,[[0,e1.p],[0,cut],[(cut-C1)/d,cut],[e1.q,e1.p]],'area a-gain');
      labels+=g.txt(X(e1.q*0.3),Y((A1+2*e1.p)/3)+5,sm?'CS':'Consumer surplus','bold halo','middle');
      labels+=g.txt(X(e1.q*0.3),Y((cut+2*e1.p)/3)+5,sm?'PS':'Producer surplus','bold halo','middle');
    }
    if(movD||movS){
      guides+=g.guide(e0.q,e0.p,'muted')+g.dot(e0.q,e0.p,'muted')+g.guide(e1.q,e1.p)+g.dot(e1.q,e1.p);
      ax([[e0.p,'P_1',true],[e1.p,'P_2']].sort(function(x,y){ return y[0]-x[0]; }),[[e0.q,'Q_1',true],[e1.q,'Q_2']].sort(function(x,y){ return x[0]-y[0]; }));
    } else {
      guides+=g.guide(e0.q,e0.p)+g.dot(e0.q,e0.p);
      ax([[e0.p,'P_e']],[[e0.q,'Q_e']]);
    }
  }
  else if(m==='tax' || m==='sub'){
    var tax=(m==='tax'), adv=tax && v.adv, k=(tax?(v.t||24):-(v.s||24))*te, r=adv?v.adv*te:0, e1t, pr, S2;
    if(adv){
      S2=function(q){ return (c+d*q)*(1+r); };
      var qq=(a-c*(1+r))/(b+d*(1+r)); e1t={q:qq, p:a-b*qq}; pr=c+d*qq;
    } else { S2=S(c+k); e1t=eq(a,c+k); pr=e1t.p-k; }
    curves+=linSeg(g,D(a),'c-ar')+linSeg(g,S(c),'c-mc');
    labels+=linLab(g,D(a),lq,'D','t-ar')+linLab(g,S(c),lq,'S','t-mc');
    var moved=te>0.02;
    if(moved){
      if(adv){ var qtop=Math.min(116,bisect(function(q){ return S2(q)-PTOP; },0,140)); curves+='<path class="curve c-mc" d="'+g.path(S2,Math.max(0,(2/(1+r)-c)/d),qtop)+'"/>'; }
      else curves+=linSeg(g,S2,'c-mc');
      labels+=linLab(g,S2,tax?(sm?70:74):(sm?84:98),tax?'S + tax':(sm?'S − sub':'S − subsidy'),'t-mc');
      if(tax){
        areas+=g.box(0,e1t.q,e0.p,e1t.p,'area a-cost')+g.box(0,e1t.q,pr,e0.p,'area a-cs')+polyPts(g,[[e1t.q,e1t.p],[e1t.q,pr],[e0.q,e0.p]],'area a-dwl');
      } else {
        areas+=g.box(0,e1t.q,e1t.p,e0.p,'area a-cs')+g.box(0,e1t.q,e0.p,pr,'area a-gain');
      }
      guides+=g.guide(e0.q,e0.p,'muted')+g.dot(e0.q,e0.p,'muted')+g.guide(e1t.q,e1t.p)+g.dot(e1t.q,e1t.p)+g.hline(e1t.q,pr)+g.dot(e1t.q,pr);
      ax([[e1t.p,'P_2'],[e0.p,'P_1',true],[pr,'P_3']].sort(function(x,y){ return y[0]-x[0]; }),[[e0.q,'Q_1',true],[e1t.q,'Q_2']].sort(function(x,y){ return x[0]-y[0]; }));
    } else { guides+=g.guide(e0.q,e0.p)+g.dot(e0.q,e0.p); ax([[e0.p,'P_1']],[[e0.q,'Q_1']]); }
  }
  else if(m==='maxp' || m==='minp'){
    var mx=(m==='maxp'), target=mx?34:70, pc=e0.p+(target-e0.p)*te;
    curves+=linSeg(g,D(a),'c-ar')+linSeg(g,S(c),'c-mc');
    labels+=linLab(g,D(a),lq,'D','t-ar')+linLab(g,S(c),mx?lq:(sm?58:64),'S','t-mc');   /* S label below the floor line */
    var qd=(a-pc)/b, qs=(pc-c)/d, qhi=Math.max(qd,qs);
    curves+='<path class="curve c-mr" d="M'+r1(X(0))+' '+r1(Y(pc))+'H'+r1(X(Math.min(116,qhi+14)))+'"/>';
    /* the ceiling is labelled under its right end; the floor above its left end, clear of S */
    labels+= mx ? g.txt(X(Math.min(116,qhi+14)),Y(pc)+fs+4,'maximum price','bold t-mr halo','end')
                : g.txt(X(3),Y(pc)-8,'minimum price','bold t-mr halo','start');
    guides+=g.guide(e0.q,e0.p,'muted')+g.dot(e0.q,e0.p,'muted');
    if(te>0.15){
      guides+=g.vline(qd,pc)+g.vline(qs,pc)+g.dot(qd,pc)+g.dot(qs,pc);
      notes+=hGap(g,Math.min(qd,qs),qhi,pc,'leader',mx?-10:10)+g.txt(X((qd+qs)/2),Y(pc)+(mx?-16:fs+14),mx?'shortage':'excess supply','bold halo','middle');
      ax([[e0.p,'P_e',true],[pc,mx?'P_max':'P_min']].sort(function(x,y){ return y[0]-x[0]; }),[[Math.min(qd,qs),mx?'Q_s':'Q_d'],[Math.max(qd,qs),mx?'Q_d':'Q_s']]);
    } else ax([[e0.p,'P_e']],[[e0.q,'Q_e']]);
  }
  else if(perm){
    var Dp=function(q){ return 100-q; }, Q0=70, Q1=Q0-25*te, movedP=te>0.02;
    curves+=linSeg(g,Dp,'c-ar'); labels+=linLab(g,Dp,sm?84:88,'D','t-ar');
    function vert(q,cls,name){ curves+='<path class="curve '+cls+'" d="M'+r1(X(q))+' '+r1(Y(PTOP))+'V'+r1(Y(0))+'"/>'; labels+=g.txt(X(q)+7,Y(PTOP)+12,name,'bold t-mc halo'); }
    if(movedP){ vert(Q0,'c-mc ghost','S_1'); vert(Q1,'c-mc','S_2'); } else vert(Q0,'c-mc','S');
    guides+=g.guide(Q0,Dp(Q0),movedP?'muted':'')+g.dot(Q0,Dp(Q0),movedP?'muted':'');
    if(movedP){ guides+=g.guide(Q1,Dp(Q1))+g.dot(Q1,Dp(Q1)); ax([[Dp(Q1),'P_2'],[Dp(Q0),'P_1',true]],[[Q1,'Q_2'],[Q0,'Q_1',true]]); }
    else ax([[Dp(Q0),'P_1']],[[Q0,'Q_1']]);
  }
  g.out(areas,curves,guides,labels,notes);
}
/* PED and PES: the same change in two markets side by side */
function renderMkt2(v,te){
  var small=(plot.clientWidth||640)<480, ped=(v.m==='ped'), inner='', first=null;
  var specs = ped
    ? [{k:1.6, head:small?'Inelastic':'Inelastic demand'},{k:0.25, head:small?'Elastic':'Elastic demand'}]
    : [{k:2, head:small?'Inelastic':'Inelastic supply'},{k:0.25, head:small?'Elastic':'Elastic supply'}];
  specs.forEach(function(s,i){
    var g=kit({n:2,i:i,head:s.head,ytitle:'Price',xtitle:'Quantity'}), X=g.X, Y=g.Y, fs=g.fs;
    if(!first) first=g;
    var areas='', curves='', guides='', labels='', notes='';
    if(ped){
      var Dn=function(q){ return 40+s.k*(60-q); }, p2=40+10*te, q2=60-(p2-40)/s.k;
      curves+=linSeg(g,Dn,'c-ar'); labels+=linLab(g,Dn,i===0?24:92,'D','t-ar');
      if(te>0.02){
        areas+=g.box(0,q2,40,p2,'area a-gain')+g.box(q2,60,0,40,'area a-cost');
        guides+=g.guide(60,40,'muted')+g.dot(60,40,'muted')+g.guide(q2,p2)+g.dot(q2,p2);
        var py=spreadN([Y(p2),Y(40)],fs+9), qx=spreadN([X(q2),X(60)],fs*1.7);
        notes+=g.axP(py[0],'P_2')+g.axP(py[1],'P_1','t-muted')+g.axQ(qx[0],'Q_2')+g.axQ(qx[1],'Q_1','t-muted');
      } else { guides+=g.guide(60,40)+g.dot(60,40); notes+=g.axP(Y(40),'P_1')+g.axQ(X(60),'Q_1'); }
    } else {
      var Sn=function(q){ return 40+s.k*(q-60); }, A0=88, A1=88+0.8*20*te, D0=function(q){ return A0-0.8*q; }, D1=function(q){ return A1-0.8*q; };
      var q1=(A1-40+60*s.k)/(0.8+s.k), p1=D1(q1);
      curves+=linSeg(g,Sn,'c-mc')+linSeg(g,D0,'c-ar'+(te>0.02?' ghost':''))+(te>0.02?linSeg(g,D1,'c-ar'):'');
      labels+=linLab(g,Sn,i===0?82:104,'S','t-mc')+linLab(g,D0,96,te>0.02?'D_1':'D','t-ar')+(te>0.02?linLab(g,D1,108,'D_2','t-ar'):'');
      guides+=g.guide(60,40,te>0.02?'muted':'')+g.dot(60,40,te>0.02?'muted':'');
      if(te>0.02){
        guides+=g.guide(q1,p1)+g.dot(q1,p1);
        var py2=spreadN([Y(p1),Y(40)],fs+9), qx2=spreadN([X(60),X(q1)],fs*1.7);
        notes+=g.axP(py2[0],'P_2')+g.axP(py2[1],'P_1','t-muted')+g.axQ(qx2[0],'Q_1','t-muted')+g.axQ(qx2[1],'Q_2');
      } else { notes+=g.axP(Y(40),'P_1')+g.axQ(X(60),'Q_1'); }
    }
    inner+=g.compose(areas,curves,guides,labels,notes);
  });
  wrapSvg(first,inner);
}

/* ---------- production possibility frontier ---------- */
function renderPPF1(){
  var v=cur(), m=v.m||'base', te=v.anim?ease(state.t):1;
  var g=kit({ytitle:v.yt||'Capital goods', xtitle:v.xt||'Consumer goods'}), X=g.X, Y=g.Y, fs=g.fs, sm=g.small;
  function curve(xm,ym,cls){ var d='', n=60; for(var i=0;i<=n;i++){ var th=Math.PI/2*i/n; d+=(i?'L':'M')+r1(X(xm*Math.sin(th)))+' '+r1(Y(ym*Math.cos(th))); } return '<path class="curve '+cls+'" d="'+d+'"/>'; }
  function yAt(xm,ym,x){ return ym*Math.sqrt(Math.max(0,1-x*x/(xm*xm))); }
  function pt(x,y,name,dx,dy,cls){ return g.dot(x,y,cls)+g.txt(X(x)+dx,Y(y)+dy,name,'bold halo '+(cls==='muted'?'t-muted':''),'middle'); }
  var areas='', curves='', guides='', labels='', notes='', xm=100, ym=90;
  if(m==='base'){
    curves+=curve(xm,ym,'c-ar'); labels+=g.txt(X(78)+8,Y(yAt(xm,ym,78))-8,'PPF','bold t-ar halo');
    notes+=pt(55,yAt(xm,ym,55),'A',10,-8)+pt(32,38,'B',0,-12)+pt(84,80,'C',0,-12);
    notes+=g.txt(X(32),Y(38)+fs+8,sm?'inefficient':'inside: inefficient','halo t-muted','middle');
    notes+=g.txt(X(84),Y(80)+fs+8,sm?'unattainable':'outside: unattainable','halo t-muted','middle');
  }
  else if(m==='oc'){
    curves+=curve(xm,ym,'c-ar'); labels+=g.txt(X(94)+6,Y(yAt(xm,ym,94))-8,'PPF','bold t-ar halo');
    [[20,40,'small sacrifice'],[70,90,'big sacrifice']].forEach(function(s,i){
      var y0=yAt(xm,ym,s[0]), y1=yAt(xm,ym,s[1]);
      guides+=g.dot(s[0],y0)+g.dot(s[1],y1)+'<path class="guide" d="M'+r1(X(s[0]))+' '+r1(Y(y0))+'H'+r1(X(s[1]))+'"/>';
      notes+=gapArrow(g,s[1],y0,y1,'leader');
      /* the second note sits inside the frontier, left of its arrow, so it never runs off the sheet */
      notes+= i ? g.txt(X(s[1])-8,Y(y1)+fs+4,s[2],'bold halo','end') : g.txt(X(s[1])+8,Y((y0+y1)/2)+5,s[2],'bold halo','start');
    });
  }
  else if(m==='grow' || m==='shrink' || m==='pivot'){
    var gx=m==='shrink'?-14:(m==='pivot'?18:12), gy=m==='shrink'?-13:(m==='pivot'?0:11);
    var x2=xm+gx*te, y2=ym+gy*te, mv=te>0.02;
    curves+=curve(xm,ym,'c-ar'+(mv?' ghost':''));
    if(mv) curves+=curve(x2,y2,'c-ar');
    /* the outer curve is labelled outside it near the top, the inner one inside it near the bottom */
    function cl(xx,yy,th,name,outer){ var px=X(xx*Math.sin(th)), py=Y(yy*Math.cos(th)); return g.txt(px+(outer?6:-6),py+(outer?-6:fs+2),name,'bold t-ar halo',outer?'start':'end'); }
    if(!mv) labels+=cl(xm,ym,0.45,'PPF',true);
    else if(m==='shrink') labels+=cl(xm,ym,0.45,'PPF_1',true)+cl(x2,y2,1.1,'PPF_2',false);
    else labels+=cl(x2,y2,0.45,'PPF_2',true)+cl(xm,ym,1.1,'PPF_1',false);
    if(mv && m!=='pivot'){ var th=0.8, x0=xm*Math.sin(th), y0=ym*Math.cos(th), x1=x2*Math.sin(th), y1=y2*Math.cos(th);
      notes+=arrowPx(X(x0)+(m==='shrink'?-4:4),Y(y0)-(m==='shrink'?-4:4),X(x1),Y(y1),'leader',9); }
  }
  else if(m==='cap'){
    curves+=curve(xm,ym,'c-ar'); labels+=g.txt(X(xm)-8,Y(6)-6,'PPF today','bold t-ar halo','end');
    curves+=curve(118,106,'c-ar ghost')+curve(106,95,'c-mc ghost');
    labels+=g.txt(X(30),Y(yAt(118,106,30))-8,sm?'if K':'future PPF if K','bold t-ar halo','middle');
    labels+=g.txt(X(98),Y(yAt(106,95,98))+fs+4,sm?'if C':'future PPF if C','bold t-mc halo','end');
    notes+=pt(35,yAt(xm,ym,35),'K',12,-8)+pt(85,yAt(xm,ym,85),'C',-10,-10);
  }
  g.out(areas,curves,guides,labels,notes);
}

/* ---------- circular flow of income ---------- */
function renderFlow(){
  var v=cur(), full=(v.m==='full');
  var g=kit({axes:false}), W=g.W, H=g.H, fs=g.fs, sm=g.small;
  var sw=sm?84:122, mw=sm?92:150, pad=sm?6:22, out='', ts=sm?12:14;
  function box(x,y,w,h,t1,t2){
    return '<rect class="cbox" x="'+r1(x)+'" y="'+r1(y)+'" width="'+r1(w)+'" height="'+r1(h)+'" rx="8"/>'
      + '<text class="panel-head" x="'+r1(x+w/2)+'" y="'+r1(y+h/2+(t2?-ts*0.25:ts*0.35))+'" text-anchor="middle" font-size="'+ts+'">'+esc(t1)+'</text>'
      + (t2?'<text class="role" x="'+r1(x+w/2)+'" y="'+r1(y+h/2+ts*1.05)+'" text-anchor="middle" font-size="'+(ts-2)+'">'+esc(t2)+'</text>':'');
  }
  function lab(x,y,s,anchor,cls){ return '<text x="'+r1(x)+'" y="'+r1(y)+'" text-anchor="'+(anchor||'middle')+'" font-size="'+fs+'" class="bold halo '+(cls||'')+'">'+fmt(s)+'</text>'; }
  function arc(x0,y0,x1,y1,lift,cls){
    var mx=(x0+x1)/2, cy=y0+lift;
    var d='M'+r1(x0)+' '+r1(y0)+'C'+r1(x0)+' '+r1(cy)+' '+r1(x1)+' '+r1(cy)+' '+r1(x1)+' '+r1(y1);
    var ex=x1, ey=y1, bx=x1, by=y1+(lift<0?-14:14);
    return '<path class="curve '+cls+'" d="'+d+'"/>'+arrowPx(bx,by,ex,ey,'curve '+cls,10);
  }
  var lx=pad, rx=W-pad-sw, top=sm?62:70, bot=H-(sm?62:70), bh=bot-top;
  out+=box(lx,top,sw,bh,'Households')+box(rx,top,sw,bh,'Firms');
  var hx=lx+sw/2, fx=rx+sw/2;
  /* spending over the top, incomes under the bottom */
  out+=arc(hx,top,fx,top,-(sm?44:52),'c-ar')+lab(W/2,top-(sm?40:46)+fs*0.2,full?'Consumer spending (C)':'Spending on goods and services');
  out+=arc(fx,bot,hx,bot,(sm?44:52),'c-ac')+lab(W/2,bot+(sm?40:46),full?'Incomes (Y)':'Incomes: wages, rent, interest, profit');
  var gx0=lx+sw, gx1=rx;
  if(!full){
    var y1=top+bh*0.36, y2=top+bh*0.66;
    out+=arrowPx(gx1-4,y1,gx0+4,y1,'curve c-mr',10)+lab(W/2,y1-9,sm?'goods & services':'goods and services','t-mr');
    out+=arrowPx(gx0+4,y2,gx1-4,y2,'curve c-mc',10)+lab(W/2,y2+fs+7,sm?'factor services':'land, labour, capital, enterprise','t-mc');
  } else {
    var mx0=W/2-mw/2, rows=[['Banks','S','I'],['Government','T','G'],['Abroad','M','X']], gap=sm?8:14, mh=(bh-2*gap)/3;
    rows.forEach(function(r,i){
      var y=top+i*(mh+gap), cy=y+mh/2;
      out+=box(mx0,y,mw,mh,r[0]);
      out+=arrowPx(gx0+4,cy,mx0-4,cy,'curve c-mc',9)+lab((gx0+mx0)/2,cy-7,r[1],'t-mc');
      out+=arrowPx(mx0+mw+4,cy,gx1-4,cy,'curve c-ar',9)+lab((mx0+mw+gx1)/2,cy-7,r[2],'t-ar');
    });
    if(!sm) out+=lab((gx0+mx0)/2,top-9,'withdrawals','t-mc')+lab((mx0+mw+gx1)/2,top-9,'injections','t-ar');
  }
  wrapSvg(g, out);
}

/* ---------- trade cycle and output gaps ---------- */
function renderCycle(){
  var v=cur(), m=v.m||'cycle', te=v.anim?ease(state.t):1;
  var g=kit({ytitle:'Real GDP', xtitle:'Time'}), X=g.X, Y=g.Y, fs=g.fs, sm=g.small;
  function trend(t){ return 24+0.5*t; }
  function act(t){ return trend(t)+10*Math.sin((t-6)/52*2*Math.PI); }
  var t0=4, t1=114, tEnd=t0+(t1-t0)*te, areas='', curves='', labels='', notes='', n=90, i, d='';
  curves+='<path class="curve c-ac" style="stroke-dasharray:7 6" d="'+g.path(trend,t0,t1)+'"/>';
  labels+=g.txt(X(t1),Y(trend(t1))+fs+6,sm?'trend':'trend (potential) output','bold t-ac halo','end');
  for(i=0;i<=n;i++){ var t=t0+(tEnd-t0)*i/n; d+=(i?'L':'M')+r1(X(t))+' '+r1(Y(act(t))); }
  curves+='<path class="curve c-ar" d="'+d+'"/>';
  if(m==='gap'){
    /* shade between actual and trend: above trend pink (positive gap), below blue (negative gap) */
    var segs=[[6,32,'a-cost'],[32,58,'a-cs'],[58,84,'a-cost'],[84,110,'a-cs']];
    segs.forEach(function(s){
      var hi=Math.min(s[1],tEnd); if(hi<=s[0]) return;
      var up='', dn='', k, N=30;
      for(k=0;k<=N;k++){ var tt=s[0]+(hi-s[0])*k/N; up+=(k?'L':'M')+r1(X(tt))+' '+r1(Y(act(tt))); }
      for(k=N;k>=0;k--){ var tb=s[0]+(hi-s[0])*k/N; dn+='L'+r1(X(tb))+' '+r1(Y(trend(tb))); }
      areas+='<path class="area '+s[2]+'" d="'+up+dn+'Z"/>';
    });
    if(te>0.3) labels+=g.txt(X(19),Y(act(19))-12,sm?'+ gap':'positive output gap','bold halo','middle');
    if(te>0.55) labels+=g.txt(X(45),Y(act(45))+fs+10,sm?'− gap':'negative output gap','bold halo','middle');
  } else {
    var marks=[[19,'boom',-12],[33,'downturn',0],[45,'recession',1],[60,'recovery',0]];
    marks.forEach(function(mk){
      if(tEnd<mk[0]) return;
      var x=X(mk[0]), y=Y(act(mk[0]));
      if(mk[2]<0) labels+=g.dot(mk[0],act(mk[0]))+g.txt(x,y-12,mk[1],'bold halo','middle');
      else if(mk[2]>0) labels+=g.dot(mk[0],act(mk[0]))+g.txt(x,y+fs+10,mk[1],'bold halo','middle');
      else labels+=g.txt(x+(mk[1]==='downturn'?10:-10),y,mk[1],'bold halo',mk[1]==='downturn'?'start':'end');
    });
  }
  g.out(areas,curves,'',labels,notes);
}

/* ---------- the multiplier, round by round ---------- */
function renderRounds(){
  var v=cur(), mpc=v.mpc||0.75, J=v.inj||100, te=v.anim?ease(state.t):1, n=8;
  var g=kit({ytitle:'Spending (£m)', xtitle:'Round', qmax:n+1, pmax:J*1.12}), X=g.X, Y=g.Y, fs=g.fs, sm=g.small;
  var shown=Math.max(1,Math.min(n,Math.ceil(n*te-0.001))), areas='', notes='', sum=0, k;
  for(k=1;k<=shown;k++){
    var amt=J*Math.pow(mpc,k-1); sum+=amt;
    areas+=g.box(k-0.35,k+0.35,0,amt,'area a-cs')+'<rect class="outline" x="'+r1(X(k-0.35))+'" y="'+r1(Y(amt))+'" width="'+r1(X(k+0.35)-X(k-0.35))+'" height="'+r1(Y(0)-Y(amt))+'"/>';
    notes+=g.txt(X(k),Y(amt)-6,(amt>=10?Math.round(amt):amt.toFixed(1)),'bold halo','middle')+g.txt(X(k),Y(0)+fs+5,String(k),'bold','middle');
  }
  var total=J/(1-mpc);
  notes+=g.txt(X(n+0.4),Y(J*1.02),'total so far: £'+Math.round(sum)+'m','bold halo','end');
  notes+=g.txt(X(n+0.4),Y(J*1.02)+fs*1.6,'final total: £'+Math.round(total)+'m','bold t-mc halo','end');
  g.out(areas,'','','',notes);
}

/* =====================================================================
   THEMES 1 AND 2: NOTES (version 24)
   Theme 1 and Theme 2 replace the "Year 12" section. Notes already on the
   site (externalities, AD/AS, the balance of payments and some evaluation
   points) are reused inside these topics.
   ===================================================================== */
SECTIONS.t1={label:'Theme 1', heading:'Markets and market failure', scope:'Theme 1: how markets work, market failure and government intervention.',
  groups:[['How markets work',['nature','demand','supply','elastic','price','taxsub','behave']],['Market failure and intervention',['extern','failure','intervene','govfail']]]};
SECTIONS.t2={label:'Theme 2', heading:'The UK economy', scope:'Theme 2: measuring performance, AD and AS, national income, growth and policy.',
  groups:[['Performance',['measures']],['AD, AS and national income',['agg_d','agg_s','natinc']],['Growth and policy',['growth2','policy']]]};
SECTIONS.t1.order=[].concat(SECTIONS.t1.groups[0][1],SECTIONS.t1.groups[1][1]);
SECTIONS.t2.order=[].concat(SECTIONS.t2.groups[0][1],SECTIONS.t2.groups[1][1],SECTIONS.t2.groups[2][1]);
SECTIONS.micro.label='Theme 3'; SECTIONS.macro.label='Theme 4';
delete SECTIONS.y12; delete TOPICS.adas2;
TOPICS.extern.section='t1';

function T1(k,label,eyebrow,first,groups){ TOPICS[k]={section:'t1',label:label,eyebrow:'Edexcel A · Theme 1 · '+eyebrow,first:first,groups:groups}; }
function T2(k,label,eyebrow,first,groups){ TOPICS[k]={section:'t2',label:label,eyebrow:'Edexcel A · Theme 2 · '+eyebrow,first:first,groups:groups}; }

T1('nature','Nature of economics','1.1 Nature of economics','n_model',[
  ['Thinking like an economist',['n_model','n_posnorm']],['The economic problem',['n_problem']],
  ['Production possibility frontiers',['ppf_base','ppf_oc','ppf_grow','ppf_cap']],['Specialisation and money',['n_spec','n_money']],['Economic systems',['n_systems']]]);
T1('demand','Demand','1.2.1 to 1.2.2 Rational decisions and demand','dm_curve',[
  ['Rational decisions',['dm_rational']],['The demand curve',['dm_curve','dm_shift','dm_fall']]]);
T1('supply','Supply','1.2.4 Supply','sp_curve',[['The supply curve',['sp_curve','sp_shift','sp_fall']]]);
T1('elastic','Elasticity','1.2.3 and 1.2.5 Elasticities','el_ped',[
  ['Price elasticity of demand',['el_ped','el_pedfac']],['Income and cross elasticity',['el_yed','el_xed']],['Price elasticity of supply',['el_pes']]]);
T1('price','Price and surplus','1.2.6 to 1.2.8 Price determination, price mechanism, surplus','pr_eq',[
  ['Equilibrium',['pr_eq','pr_excess','pr_both']],['The price mechanism',['pr_mech']],['Consumer and producer surplus',['pr_surplus','pr_cs_change']]]);
T1('taxsub','Taxes and subsidies','1.2.9 Indirect taxes and subsidies','ts_spec',[
  ['Indirect taxes',['ts_spec','ts_adv','ev_ped']],['Subsidies',['ts_sub']]]);
T1('behave','Behaviour','1.2.10 Alternative views of consumer behaviour','bh_why',[['Why people are not always rational',['bh_why','ev_nudge']]]);
T1('failure','Market failure','1.3.1, 1.3.3, 1.3.4 Market failure, public goods, information gaps','mf_types',[
  ['Types',['mf_types']],['Public goods',['mf_public','ev_freerider']],['Information gaps',['mf_info','ev_asym']]]);
T1('intervene','Intervention','1.4.1 Government intervention in markets','gi_max',[
  ['Taxes and subsidies',['ex_tax','ex_sub']],['Price controls',['gi_max','gi_min']],['Permits and other tools',['gi_permit','gi_state']]]);
T1('govfail','Government failure','1.4.2 Government failure','gf_causes',[['Government failure',['gf_causes','ev_govfail','ev_unintended','ev_capture']]]);

T2('measures','Measuring performance','2.1 Measures of economic performance','me_gdp',[
  ['Growth',['me_gdp','me_wellbeing']],['Inflation',['me_cpi','me_inflcause','me_inflfx']],
  ['Unemployment',['me_unemp','me_ucause','me_ueff']],['Balance of payments',['bp_struct','bp_causes','bp_eval']]]);
T2('agg_d','Aggregate demand','2.2 Aggregate demand','ad_base',[
  ['AD and its shifts',['ad_base','ad_dpull','ag_left']],['The components',['ag_cons','ag_inv','ag_gov','ag_nx']]]);
T2('agg_s','Aggregate supply','2.3 Aggregate supply','as_sr_up',[
  ['Short-run AS',['as_sr_up','ad_cpush']],['Long-run AS',['as_lrfac','ad_lras','ev_capacity']]]);
T2('natinc','National income','2.4 National income','ni_flow',[
  ['The circular flow',['ni_flow','ni_injw']],['The multiplier',['ni_mult','ni_rounds']]]);
T2('growth2','Growth','2.5 Economic growth','gw_causes',[
  ['Growth',['gw_causes']],['Output gaps and the cycle',['gw_gap','gw_cycle']],['Impact of growth',['gw_impact','ev_kuz_env','ev_easterlin']]]);
T2('policy','Policy','2.6 Macroeconomic objectives and policies','po_obj',[
  ['Objectives',['po_obj']],['Demand-side policy',['po_mon','po_fis']],['Supply-side policy',['po_ss']],['Conflicts',['po_conf','ev_srpc','ev_lrpc']]]);

/* ------------------------- THEME 1: NATURE OF ECONOMICS ------------------------- */
V.n_model={kind:'card', btn:'Economics as a science', showing:'Models, assumptions and their limits',
  title:'Economics as a social science',
  lead:'Economists build simplified models of how the economy works, test them against evidence, then keep, change or drop them.',
  terms:[['Model','A simplified picture of reality, used to explain and predict.'],['Assumption','Something taken as true to make a model simpler.'],['Ceteris paribus','All other things equal: change one variable and hold the rest constant.']],
  card:{head:'Models', items:[
    PT('Why use them',[['Simplify','The economy has millions of moving parts. A model keeps the few that matter, so cause and effect are easier to see.'],['Predict','A model gives predictions you can test, such as “a tax on sugary drinks will cut how many are bought”.']]),
    PT('Their limits',[['No laboratory','Economists cannot run controlled experiments on a whole economy, so other things always change at the same time.'],['People are not atoms','Behaviour changes with mood, habit and other people, so predictions are less certain than in physics.'],['Assumptions','If an assumption fails, such as rational consumers, the prediction can fail too.']])
  ]},
  evaluation:'That is why economists can look at the same data and disagree: evidence rarely isolates one cause. Treat a model’s predictions as likely, not certain.',
  traps:['Write “ceteris paribus” when you change one thing in an answer: it shows you are holding everything else constant.']};

V.n_posnorm={kind:'card', btn:'Positive and normative', showing:'Testable facts and value judgements',
  title:'Positive and normative statements',
  lead:'A positive statement can be tested against evidence. A normative statement is a value judgement about what ought to happen.',
  terms:[['Positive statement','Objective and testable, even if it turns out to be false.'],['Normative statement','Contains a value judgement, often with “should”, “ought” or “fair”.'],['Value judgement','An opinion based on beliefs about what is right.']],
  card:{head:'Spot the difference', items:[
    PT('Positive',[['Example','“A sugar tax will reduce how much fizzy drink people buy.”'],['Why','It can be checked against sales data, so it is testable even if it turns out wrong.']]),
    PT('Normative',[['Example','“The government should tax sugary drinks.”'],['Why','It says what ought to happen, which depends on what you value: health or freedom of choice.']]),
    PT('In policy',[['How they combine','Positive evidence (the tax cuts sales) informs a normative decision (so we should tax), but cannot settle it alone.']])
  ]},
  traps:['A positive statement can be <b>false</b>. The test is whether it can be tested, not whether it is true.','“Should”, “ought”, “best” and “fair” usually signal a normative statement.']};

V.n_problem={kind:'card', btn:'The economic problem', showing:'Scarcity, factors and opportunity cost',
  title:'The economic problem',
  lead:'Wants are unlimited but resources are scarce, so every society must choose what to produce, how to produce it, and who gets it.',
  terms:[['Scarcity','Not enough resources to satisfy everyone’s wants.'],['Opportunity cost','The next best alternative given up when a choice is made.'],['Factors of production','Land, labour, capital and enterprise: the inputs used to make goods and services.']],
  card:{head:'The basics', items:[
    PT('Factors of production',[['Land','Natural resources. Reward: rent.'],['Labour','Human effort. Reward: wages.'],['Capital','Man-made tools and machines. Reward: interest.'],['Enterprise','Organising production and taking risks. Reward: profit.']]),
    PT('Resources',[['Renewable','Replaced at least as fast as it is used, such as solar power or managed forests.'],['Non-renewable','Runs out once used, such as oil and gas.']]),
    PT('Opportunity cost',[['Why it exists','Resources are scarce, so using them one way means not using them another.'],['Example','An evening at a part-time job means giving up an evening of revision.']])
  ]},
  traps:['Opportunity cost is the <b>next best</b> alternative only, not every alternative added together.']};

V.ppf_base={kind:'ppf1', m:'base', btn:'The PPF', showing:'On, inside and outside the frontier',
  title:'Production possibility frontier',
  lead:'A PPF shows the most an economy can produce of two goods when it uses all its resources efficiently.',
  terms:[['PPF','The maximum combinations of two goods an economy can produce with its resources and technology.'],['Productive efficiency','Producing on the PPF: no more of one good is possible without less of the other.']],
  plain:[['<b>A</b>','On the frontier: all resources used efficiently.'],['<b>B</b>','Inside: resources unemployed or wasted, as in a recession.'],['<b>C</b>','Outside: unattainable with today’s resources and technology.']],
  traps:['Every point <b>on</b> the PPF is productively efficient. The PPF cannot say which point is best for society: that is a normative choice.']};

V.ppf_oc={kind:'ppf1', m:'oc', btn:'Opportunity cost', showing:'Each extra unit costs more',
  title:'Opportunity cost on a PPF',
  lead:'Moving along a PPF means giving up some of one good to make more of the other. That sacrifice is the opportunity cost.',
  chain:[
    'Near the top, moving right gives up only a little capital goods for each extra consumer good.',
    'Further down, the same rise in consumer goods means giving up much more capital goods.',
    'Resources are not equally good at everything, and the last ones moved are the least suited.',
    'So the PPF bows outwards (it is concave to the origin): opportunity cost rises.'
  ],
  work:{q:'Moving from A to B, consumer goods rise from 20 to 40 units and capital goods fall from 90 to 80. What is the opportunity cost of each extra consumer good?',
    steps:['Gain: 40 − 20 = 20 consumer goods. Loss: 90 − 80 = 10 capital goods.','Opportunity cost = loss ÷ gain = 10 ÷ 20 = <b>0.5 capital goods</b> for each extra consumer good.'],
    ans:'0.5 capital goods per consumer good.'},
  traps:['A straight-line PPF means a constant opportunity cost; a curved one means it rises. Say which you are drawing.']};

V.ppf_grow={kind:'ppf1', m:'grow', anim:true, btn:'Growth and decline', showing:'The frontier shifts out',
  title:'Shifts in the PPF',
  lead:'More resources, or better technology, let the economy make more of both goods: the whole PPF shifts outwards.',
  chain:[
    'Causes of an outward shift: more workers, more capital from investment, better technology, a more skilled workforce.',
    'The PPF moves from PPF<sub>1</sub> to PPF<sub>2</sub>, so combinations that were unattainable become possible.',
    'This is a rise in <b>potential</b> output: long-run economic growth.',
    'An inward shift is the reverse: a natural disaster, a war or emigration destroys resources.'
  ],
  traps:['Moving from inside the PPF to the frontier is <b>not</b> a shift. It uses existing resources better (actual growth); a shift is more potential.']};

V.ppf_cap={kind:'ppf1', m:'cap', btn:'Capital or consumer goods', showing:'Today’s choice sets tomorrow’s PPF',
  title:'Capital goods and future growth',
  lead:'Making more capital goods today means fewer consumer goods now, but a bigger economy later.',
  chain:[
    'At K the economy makes lots of capital goods: machines, buildings, infrastructure.',
    'At C it makes mainly consumer goods, so people enjoy more today.',
    'Capital goods add to productive capacity, so choosing K shifts the PPF further out over time.',
    'The opportunity cost of faster growth is less consumption now.'
  ],
  evaluation:'Which point is better is a normative judgement. A poor country may not be able to give up consumption today, which is one reason growth is hard to get started.'};

V.n_spec={kind:'card', btn:'Specialisation', showing:'The division of labour',
  title:'Specialisation and the division of labour',
  lead:'Specialisation means concentrating on a narrow range of tasks or products. Adam Smith showed that splitting work into small tasks raises output per worker.',
  terms:[['Division of labour','Splitting production into separate tasks, each done by different workers.'],['Specialisation','Concentrating on what you do best: as a person, a firm, a region or a country.']],
  card:{head:'Specialisation', items:[
    PT('Benefits',[['Higher productivity','Workers repeat one task, so they get faster and better at it.'],['Less time wasted','No switching between tasks and tools.'],['Machinery','Simple repeated tasks are easier to automate.'],['Trade','People and countries swap what they make for what they want.']]),
    PT('Costs',[['Boredom','Repetitive work lowers motivation and raises staff turnover.'],['Dependence','If one stage stops, the whole line stops.'],['Structural unemployment','Narrow skills are hard to move if demand for them collapses.']])
  ]},
  tip:'Specialisation needs money to work: you need a way to swap what you make for what you want.'};

V.n_money={kind:'card', btn:'Functions of money', showing:'Four jobs money does',
  title:'The functions of money',
  lead:'Without money, specialised workers would have to barter, which needs a double coincidence of wants.',
  terms:[['Barter','Swapping goods directly, without money.'],['Double coincidence of wants','Each person must want exactly what the other is offering.']],
  card:{head:'Money is', items:[
    PT('Functions',[['A medium of exchange','Accepted in payment for anything, so nobody has to barter.'],['A measure of value','Prices in one unit let you compare very different goods.'],['A store of value','It can be saved and spent later, though inflation erodes it.'],['A method of deferred payment','Debts can be agreed now and repaid later.']])
  ]},
  traps:['Learn the four functions word for word: they are an easy knowledge mark.']};

V.n_systems={kind:'card', btn:'Economic systems', showing:'Free market, mixed and command',
  title:'Free market, mixed and command economies',
  lead:'Economies differ in how far the market or the state decides what is produced, how, and for whom.',
  terms:[['Free market economy','Resources allocated by the price mechanism, with private ownership.'],['Command economy','The state owns resources and plans production.'],['Mixed economy','Markets plus a large role for the state, as in the UK.']],
  card:{head:'Three systems', items:[
    PT('Free market',[['For','Prices signal what people want and reward efficiency. Adam Smith’s “invisible hand”; Friedrich Hayek argued markets use knowledge no planner could hold.'],['Against','Market failure: public goods go missing, externalities are ignored, and inequality can grow.']]),
    PT('Command',[['For','The state can direct resources to priorities and reduce inequality. Karl Marx argued free markets exploit workers.'],['Against','Planners lack information, there is little incentive to innovate, and shortages are common.']]),
    PT('Mixed',[['How','Markets for most goods; the state provides public goods, corrects market failure and redistributes income.'],['Debate','How big the state should be is a normative question.']])
  ]},
  traps:['Link each thinker to the right idea: Smith (invisible hand, specialisation), Hayek (markets use spread-out knowledge), Marx (critique of free markets).']};

/* ------------------------- THEME 1: DEMAND AND SUPPLY ------------------------- */
V.dm_rational={kind:'card', btn:'Rational decisions', showing:'What each agent aims for',
  title:'Rational decision making',
  lead:'Traditional economic theory assumes every agent makes the choice that is best for them.',
  terms:[['Utility','The satisfaction a consumer gets from consuming a good.'],['Rational decision making','Choosing the option that maximises your own benefit.']],
  card:{head:'Economic agents', items:[
    PT('Aims',[['Consumers','Maximise utility from a limited income.'],['Firms','Maximise profit.'],['Government','Maximise social welfare.']]),
    PT('Why households may not maximise utility',[['Social norms','People copy what others do.'],['Habit and inertia','People stick with the same choices without checking alternatives.'],['Impulse','Decisions made on the spot, not after weighing costs and benefits.'],['Lack of information','People do not know every price or risk.']])
  ]},
  tip:'These limits are the starting point for behavioural economics in 1.2.10.'};

V.dm_curve={kind:'mkt', m:'demand', btn:'The demand curve', showing:'A price change moves you along the curve',
  title:'The demand curve',
  lead:'Demand is the quantity consumers are willing and able to buy at each price. As the price falls, quantity demanded rises.',
  terms:[['Effective demand','Wanting a good and being able to pay for it.'],['Diminishing marginal utility','Each extra unit gives less extra satisfaction than the one before.']],
  chain:[
    'The price falls from P<sub>1</sub> to P<sub>2</sub>.',
    'Quantity demanded rises from Q<sub>1</sub> to Q<sub>2</sub>: an <b>extension</b> of demand, a movement along the curve.',
    'Why it slopes down: each extra unit adds less utility, so people only buy more if the price falls.',
    'A price rise does the opposite: a <b>contraction</b> of demand.'
  ],
  traps:['A change in the good’s <b>own price</b> moves you along the curve; anything else shifts it. Use “extension” and “contraction” for movements, “increase” and “decrease” for shifts.']};

V.dm_shift={kind:'mkt', m:'dshift', dd:22, anim:true, btn:'Demand increases', showing:'The curve shifts right',
  title:'An increase in demand',
  lead:'When something other than the price makes people want more at every price, the whole demand curve shifts right.',
  plain:[['Income','Higher income raises demand for normal goods.'],['Substitutes','A dearer substitute raises demand.'],['Complements','A cheaper complement raises demand.'],['Tastes','Trends, advertising, influencers.'],['Population','More people, or more in the target age group.'],['Expectations','Expected price rises bring buying forward.']],
  chain:[
    'Demand shifts right from D<sub>1</sub> to D<sub>2</sub>.',
    'At the old price there is excess demand, so the price is bid up.',
    'The price rises from P<sub>1</sub> to P<sub>2</sub> and quantity from Q<sub>1</sub> to Q<sub>2</sub>.',
    'Supply extends along the supply curve: firms supply more because the price is higher.'
  ],
  compare:{vs:'After demand rises',rows:[['Price','↑ higher'],['Quantity','↑ higher'],['Supply','extends'],['Demand curve','shifts right']]},
  traps:['When demand shifts, supply does <b>not</b> shift: it extends along itself. Moving both curves is a common slip.']};

V.dm_fall={kind:'mkt', m:'dshift', dd:-22, anim:true, btn:'Demand decreases', showing:'The curve shifts left',
  title:'A decrease in demand',
  lead:'Lower incomes, a cheaper substitute or a change in taste shift demand left.',
  chain:[
    'Demand shifts left from D<sub>1</sub> to D<sub>2</sub>.',
    'At the old price there is excess supply, so firms cut prices to sell their stock.',
    'The price falls from P<sub>1</sub> to P<sub>2</sub> and quantity from Q<sub>1</sub> to Q<sub>2</sub>.',
    'Supply contracts along the supply curve.'
  ],
  compare:{vs:'After demand falls',rows:[['Price','↓ lower'],['Quantity','↓ lower'],['Supply','contracts'],['Demand curve','shifts left']]},
  traps:['Inferior goods are the exception for income: when incomes rise, demand for them <b>falls</b>.']};

V.sp_curve={kind:'mkt', m:'supply', btn:'The supply curve', showing:'A higher price brings more supply',
  title:'The supply curve',
  lead:'Supply is the quantity firms are willing and able to sell at each price. It slopes up, because a higher price makes production more profitable.',
  terms:[['Supply','The quantity firms are willing and able to sell at each price over a period.']],
  chain:[
    'The price rises from P<sub>1</sub> to P<sub>2</sub>.',
    'Each extra unit is now more profitable, so existing firms make more and new firms may join.',
    'Quantity supplied rises from Q<sub>1</sub> to Q<sub>2</sub>: an <b>extension</b> of supply.',
    'A price fall causes a <b>contraction</b> of supply.'
  ],
  traps:['Only the good’s own price moves you along the supply curve. Everything else shifts it.']};

V.sp_shift={kind:'mkt', m:'sshift', ds:24, anim:true, btn:'Supply increases', showing:'The curve shifts right',
  title:'An increase in supply',
  lead:'Lower costs or better technology let firms supply more at every price, so supply shifts right.',
  plain:[['Costs','Cheaper materials, energy or labour.'],['Technology','Better machines raise productivity.'],['Subsidies','A payment per unit lowers costs.'],['More firms','New entrants add to supply.'],['Weather','Good harvests raise farm supply.']],
  chain:[
    'Supply shifts right from S<sub>1</sub> to S<sub>2</sub>.',
    'At the old price there is excess supply, so the price falls.',
    'The price falls from P<sub>1</sub> to P<sub>2</sub> and quantity rises from Q<sub>1</sub> to Q<sub>2</sub>.',
    'Demand extends along the demand curve.'
  ],
  compare:{vs:'After supply rises',rows:[['Price','↓ lower'],['Quantity','↑ higher'],['Demand','extends'],['Supply curve','shifts right']]}};

V.sp_fall={kind:'mkt', m:'sshift', ds:-22, anim:true, btn:'Supply decreases', showing:'The curve shifts left',
  title:'A decrease in supply',
  lead:'Higher costs, a tax or bad weather mean firms supply less at every price.',
  chain:[
    'Supply shifts left from S<sub>1</sub> to S<sub>2</sub>.',
    'At the old price there is a shortage, so the price is bid up.',
    'The price rises from P<sub>1</sub> to P<sub>2</sub> and quantity falls from Q<sub>1</sub> to Q<sub>2</sub>.',
    'Demand contracts along the demand curve.'
  ],
  compare:{vs:'After supply falls',rows:[['Price','↑ higher'],['Quantity','↓ lower'],['Demand','contracts'],['Supply curve','shifts left']]},
  traps:['Higher costs shift supply <b>left</b>, which is the same as up. Never draw it shifting right.']};

/* ------------------------- THEME 1: ELASTICITY ------------------------- */
V.el_ped={kind:'mkt', m:'ped', anim:true, two:true, btn:'PED', showing:'The same price rise, two results',
  title:'Price elasticity of demand',
  lead:'PED measures how much quantity demanded responds to a change in price.',
  terms:[['PED','% change in quantity demanded ÷ % change in price.'],['Price elastic','PED above 1 (ignoring the sign): quantity changes by more than price.'],['Price inelastic','PED below 1: quantity changes by less than price.']],
  plain:[['<b class="k-ac">Green</b>','Revenue gained: the higher price on the units still sold.'],['<b class="k-mc">Pink</b>','Revenue lost: the units no longer sold.']],
  chain:[
    'Both firms raise the price from P<sub>1</sub> to P<sub>2</sub>.',
    'With inelastic demand, quantity falls only a little, so the gain beats the loss: revenue rises.',
    'With elastic demand, quantity falls a lot, so the loss beats the gain: revenue falls.',
    'So to raise revenue, raise the price if demand is inelastic and cut it if demand is elastic.'
  ],
  work:{q:'The price of a phone case rises from £10 to £12 and weekly sales fall from 500 to 450. Calculate PED.',
    steps:['% change in quantity = (450 − 500) ÷ 500 × 100 = <b>−10%</b>.','% change in price = (12 − 10) ÷ 10 × 100 = <b>+20%</b>.','PED = −10 ÷ 20 = <b>−0.5</b>.'],
    ans:'−0.5: inelastic, so the price rise lifts revenue from £5,000 to £5,400.'},
  traps:['Divide the % change in <b>quantity</b> by the % change in <b>price</b>, not the other way round.','PED is usually negative. Judge elastic or inelastic by the size of the number, ignoring the sign.']};

V.el_pedfac={kind:'card', btn:'What decides PED', showing:'Factors, and why it matters',
  title:'What decides PED, and why it matters',
  lead:'Demand is more elastic when it is easy to switch away, or when the good takes a big slice of income.',
  card:{head:'PED', items:[
    PT('Factors',[['Substitutes','More close substitutes, more elastic: one brand of crisps against crisps in general.'],['Necessity and habit','Necessities and addictive goods are inelastic: petrol, cigarettes.'],['Share of income','A small share (salt) is inelastic; a big one (a car) is more elastic.'],['Time','Demand gets more elastic over time as people find alternatives.'],['How the market is defined','The narrower the market, the more elastic: Coca-Cola against soft drinks.']]),
    PT('Why it matters',[['Firms','Raise prices where demand is inelastic to raise revenue.'],['Government','Taxing goods with inelastic demand raises revenue, but cuts consumption little.'],['Price discrimination','Charge more to the group with inelastic demand.']])
  ]},
  traps:['When demand is inelastic, most of a <b>tax</b> falls on consumers. Link PED to tax incidence in 1.2.9.']};

V.el_yed={kind:'card', btn:'YED', showing:'Normal, inferior and luxury goods',
  title:'Income elasticity of demand',
  lead:'YED measures how demand responds to a change in income.',
  terms:[['YED','% change in quantity demanded ÷ % change in income.']],
  card:{head:'YED', items:[
    PT('Values',[['Above 1','A luxury (income elastic): demand grows faster than income, such as holidays abroad.'],['Between 0 and 1','A normal necessity: demand grows more slowly than income, such as bread.'],['Below 0','An inferior good: demand falls as income rises, such as value-range food or bus travel.']]),
    PT('Why it matters',[['Firms','In a boom, sellers of luxuries gain most; in a recession, sellers of inferior goods hold up best.'],['Planning','A mix of products spreads the risk across the trade cycle.']])
  ]},
  work:{q:'Incomes rise by 4% and demand for streaming subscriptions rises by 6%. Calculate YED and say what kind of good it is.',
    steps:['YED = 6 ÷ 4 = <b>1.5</b>.','It is positive and above 1.'], ans:'1.5: a normal luxury good (income elastic).'},
  traps:['For YED and XED the <b>sign</b> matters, unlike PED: negative YED means an inferior good.']};

V.el_xed={kind:'card', btn:'XED', showing:'Substitutes and complements',
  title:'Cross elasticity of demand',
  lead:'XED measures how demand for one good responds to a change in the price of another.',
  terms:[['XED','% change in quantity demanded of good A ÷ % change in the price of good B.']],
  card:{head:'XED', items:[
    PT('Values',[['Positive','Substitutes: a dearer B raises demand for A, such as Xbox and PlayStation.'],['Negative','Complements: a dearer B cuts demand for A, such as consoles and games.'],['Zero','Unrelated goods.']]),
    PT('Why it matters',[['Pricing','Firms watch rivals’ prices closely when XED is high.'],['Complements','Firms price them together: cheap printers, expensive ink.']])
  ]},
  work:{q:'The price of PlayStation games rises by 10% and demand for Xbox games rises by 3%. Calculate XED.',
    steps:['XED = +3 ÷ +10 = <b>+0.3</b>.'], ans:'+0.3: substitutes, but weak ones.'}};

V.el_pes={kind:'mkt', m:'pes', anim:true, two:true, btn:'PES', showing:'The same demand rise, two supply curves',
  title:'Price elasticity of supply',
  lead:'PES measures how much quantity supplied responds to a change in price.',
  terms:[['PES','% change in quantity supplied ÷ % change in price.']],
  chain:[
    'Demand rises by the same amount in both markets.',
    'With inelastic supply, firms cannot raise output quickly, so most of the effect is a higher price.',
    'With elastic supply, output rises easily, so the price rises only a little.'
  ],
  plain:[['Spare capacity','Idle machines let firms expand fast.'],['Stocks','Goods that can be stored are more elastic.'],['Time','Supply is more elastic in the long run.'],['Mobile factors','If workers and machines can switch easily, supply is more elastic.']],
  traps:['Supply is usually more elastic in the long run, when firms can build capacity. Say which time period you mean.']};

/* ------------------------- THEME 1: PRICE AND SURPLUS ------------------------- */
V.pr_eq={kind:'mkt', m:'eq', btn:'Equilibrium', showing:'Where supply meets demand',
  title:'Market equilibrium',
  lead:'Equilibrium is the price where the quantity consumers want to buy equals the quantity firms want to sell.',
  terms:[['Equilibrium','A position with no tendency to change: quantity demanded equals quantity supplied.']],
  chain:['At P<sub>e</sub>, consumers want Q<sub>e</sub> and firms want to sell Q<sub>e</sub>.','Nothing pushes the price up or down, so it stays until something shifts a curve.']};

V.pr_excess={kind:'mkt', m:'excess', btn:'Excess supply and demand', showing:'How the market clears',
  title:'How the market reaches equilibrium',
  lead:'Away from equilibrium, a surplus or a shortage pushes the price back.',
  chain:[
    'Above equilibrium, at P<sub>1</sub>, firms supply more than consumers want: excess supply.',
    'Firms cut prices to clear unsold stock, so the price falls towards P<sub>e</sub>.',
    'Below equilibrium, at P<sub>2</sub>, consumers want more than firms supply: excess demand.',
    'Buyers bid the price up, so it rises towards P<sub>e</sub>.'
  ],
  traps:['Measure a surplus or a shortage <b>across</b>, between the two curves at that price.']};

V.pr_both={kind:'mkt', m:'both', dd:20, ds:26, anim:true, btn:'Both curves shift', showing:'Quantity rises; the price depends',
  title:'When both curves shift',
  lead:'If demand and supply both increase, quantity certainly rises, but the price could go either way.',
  chain:[
    'Demand shifts right (D<sub>1</sub> to D<sub>2</sub>) and supply shifts right (S<sub>1</sub> to S<sub>2</sub>).',
    'Both push quantity up, so it rises from Q<sub>1</sub> to Q<sub>2</sub>.',
    'Demand pushes the price up and supply pushes it down. Here supply shifts more, so the price falls.',
    'Had demand shifted more, the price would have risen.'
  ],
  traps:['With two shifts, say which change is <b>certain</b> and which depends on the relative size of the shifts.']};

V.pr_mech={kind:'card', btn:'The price mechanism', showing:'Rationing, signalling, incentive',
  title:'The price mechanism',
  lead:'In a market, prices do three jobs that allocate scarce resources without anyone in charge.',
  terms:[['Price mechanism','The way changes in prices allocate resources between different uses.']],
  card:{head:'Three functions', items:[
    PT('Functions',[['Rationing','A higher price limits demand to those most willing and able to pay, such as tickets for a big tour.'],['Signalling','A rising price tells producers what consumers want more of.'],['Incentive','A higher price raises profit, giving firms a reason to supply more.']]),
    PT('Example: a heatwave',[['Demand','Demand for fans rises, so their price rises.'],['Signal and incentive','Shops order more and makers raise output.'],['Rationing','Until supply catches up, the higher price rations the fans available.']])
  ]},
  tip:'Markets can be local (a market stall), national (UK housing) or global (oil).',
  traps:['Name each function <b>and</b> explain it in context. “Rationing, signalling, incentive” as a list earns little.']};

V.pr_surplus={kind:'mkt', m:'surplus', btn:'Consumer and producer surplus', showing:'The two triangles',
  title:'Consumer and producer surplus',
  lead:'Consumer surplus is what buyers gain by paying less than they would have; producer surplus is what sellers gain by receiving more than they needed.',
  terms:[['Consumer surplus','The difference between what consumers are willing to pay and what they actually pay.'],['Producer surplus','The difference between the price producers receive and the lowest price they would accept.']],
  plain:[['<b class="k-ar">Blue</b>','Consumer surplus: below demand, above the price.'],['<b class="k-ac">Green</b>','Producer surplus: above supply, below the price.']],
  work:{q:'The equilibrium price is £52 and quantity 60. Demand meets the price axis at £100. Calculate consumer surplus.',
    steps:['Height of the triangle = £100 − £52 = £48.','Area = ½ × base × height = ½ × 60 × £48 = <b>£1,440</b>.'], ans:'£1,440.'}};

V.pr_cs_change={kind:'mkt', m:'surplus', ds:24, anim:true, btn:'When supply rises', showing:'A lower price, more consumer surplus',
  title:'How surplus changes',
  lead:'When supply increases, the price falls and consumer surplus grows.',
  chain:[
    'Supply shifts right, so the price falls and quantity rises.',
    'Consumers pay less for the units they already bought, and buy extra units they value above the new price.',
    'Both add to consumer surplus: the blue triangle grows.'
  ]};

/* ------------------------- THEME 1: TAXES AND SUBSIDIES ------------------------- */
V.ts_spec={kind:'mkt', m:'tax', t:24, anim:true, btn:'Specific tax', showing:'Who really pays the tax',
  title:'A specific (unit) tax',
  lead:'A specific tax is a fixed amount per unit, such as fuel duty. Supply shifts up by the tax at every quantity.',
  terms:[['Specific tax','A fixed amount of tax per unit sold.'],['Tax incidence','Who really bears a tax: consumers, producers, or both.']],
  plain:[['<b class="k-mc">Pink</b>','Paid by consumers: the price rise, P<sub>1</sub> to P<sub>2</sub>, on Q<sub>2</sub> units.'],['<b class="k-ar">Blue</b>','Paid by producers: what they keep falls from P<sub>1</sub> to P<sub>3</sub>.'],['<b>Orange</b>','Deadweight loss: trades that no longer happen.']],
  chain:[
    'Supply shifts up by the tax, from S to S + tax.',
    'Consumers now pay P<sub>2</sub>; producers keep P<sub>3</sub>, which is P<sub>2</sub> minus the tax.',
    'Quantity falls from Q<sub>1</sub> to Q<sub>2</sub>.',
    'Tax revenue is the tax × Q<sub>2</sub>: the pink and blue boxes together.'
  ],
  work:{q:'A £2 tax per unit is added. The price rises from £10 to £11.50 and sales fall from 1,000 to 800. Find the tax revenue and the consumers’ share.',
    steps:['Revenue = £2 × 800 = <b>£1,600</b>.','Consumers pay £1.50 of each £2: £1.50 × 800 = <b>£1,200</b>.','Producers pay the other £0.50: £0.50 × 800 = <b>£400</b>.'],
    ans:'£1,600 in revenue; consumers bear £1,200 of it, because demand is relatively inelastic.'},
  traps:['Revenue is the tax × the <b>new</b> quantity, not the old one.','The more inelastic demand is, the bigger the consumers’ share of the tax.']};

V.ts_adv={kind:'mkt', m:'tax', adv:0.45, anim:true, btn:'Ad valorem tax', showing:'A percentage tax pivots supply',
  title:'An ad valorem tax',
  lead:'An ad valorem tax is a percentage of the price, such as VAT. The tax per unit grows as the price grows, so supply pivots upwards.',
  terms:[['Ad valorem tax','A tax charged as a percentage of the price, such as VAT.']],
  chain:[
    'At low prices the tax per unit is small; at high prices it is large.',
    'So S + tax gets further from S the higher up you go.',
    'The price rises from P<sub>1</sub> to P<sub>2</sub>, quantity falls from Q<sub>1</sub> to Q<sub>2</sub>, and producers keep P<sub>3</sub>.'
  ],
  traps:['A specific tax shifts supply <b>parallel</b>; an ad valorem tax <b>pivots</b> it. Draw the right one.']};

V.ts_sub={kind:'mkt', m:'sub', s:24, anim:true, btn:'Subsidy', showing:'Who gains from a subsidy',
  title:'A subsidy',
  lead:'A subsidy is a payment per unit from the government to producers. Supply shifts down by the subsidy.',
  terms:[['Subsidy','A payment from the government to producers that lowers their cost per unit.']],
  plain:[['<b class="k-ar">Blue</b>','Consumers gain: the price falls from P<sub>1</sub> to P<sub>2</sub>.'],['<b class="k-ac">Green</b>','Producers gain: they receive P<sub>3</sub>, the price plus the subsidy.'],['Both boxes','The cost to the government: subsidy × Q<sub>2</sub>.']],
  chain:[
    'Supply shifts down by the subsidy, from S to S − subsidy.',
    'Consumers pay less (P<sub>2</sub>) and buy more (Q<sub>2</sub>).',
    'Producers receive P<sub>3</sub> per unit: the price plus the subsidy.',
    'The government pays the subsidy on every unit: subsidy × Q<sub>2</sub>.'
  ],
  evaluation:'Subsidies have an opportunity cost: the money could fund schools or hospitals. Firms may come to rely on them and stop cutting costs.',
  traps:['The cost to the government is the subsidy × the <b>new, higher</b> quantity.']};

/* ------------------------- THEME 1: BEHAVIOUR ------------------------- */
V.bh_why={kind:'card', btn:'Why we are not always rational', showing:'Other people, habits and maths',
  title:'Alternative views of consumer behaviour',
  lead:'Behavioural economics uses psychology to explain why real people do not always act as rational utility maximisers.',
  terms:[['Behavioural economics','The study of how psychological, social and emotional factors affect economic decisions.'],['Bounded rationality','Making good-enough decisions with limited information, time and brainpower.']],
  card:{head:'Why consumers may not be rational', items:[
    PT('The spec’s three reasons',[['Other people','We copy friends and influencers (herd behaviour), and care about fairness and others’ welfare (altruism).'],['Habit','Routines and defaults carry on without a fresh decision: the same phone network, the same lunch.'],['Weakness at computation','People struggle with maths and risk, so they use shortcuts.']]),
    PT('Shortcuts and biases',[['Rule of thumb','A quick rule, such as always buying the second-cheapest option.'],['Anchoring','Judging a price against the first number seen: “was £80, now £40”.'],['Availability','Judging how likely something is by how easily examples come to mind.']])
  ]},
  evaluation:'Behavioural ideas explain real choices better, but they are hard to build into simple models. Governments use them through nudges, which are cheap but often have small effects.',
  traps:['Use the spec’s wording: the influence of other people’s behaviour, the importance of habitual behaviour, consumer weakness at computation.']};

/* ------------------------- THEME 1: MARKET FAILURE ------------------------- */
V.mf_types={kind:'card', btn:'Types of market failure', showing:'Three ways markets go wrong',
  title:'Market failure',
  lead:'Market failure is when the free market allocates resources inefficiently, so society’s welfare is not as high as it could be.',
  terms:[['Market failure','When the price mechanism leads to an inefficient allocation of resources.']],
  card:{head:'Three types', items:[
    PT('Types',[['Externalities','Third parties bear costs or gain benefits that the buyer and seller ignore, so too much or too little is made.'],['Public goods','Non-rival, non-excludable goods are under-provided, because people can use them without paying.'],['Information gaps','Buyers or sellers lack information, so they make choices that do not maximise their welfare.']])
  ]},
  traps:['Market failure is about <b>inefficiency</b>, not unfairness. An unequal outcome is a separate (equity) argument.']};

V.mf_public={kind:'card', btn:'Public goods', showing:'Non-rival and non-excludable',
  title:'Public goods and the free rider problem',
  lead:'Some goods would hardly be provided at all in a free market, because people can benefit without paying.',
  terms:[['Non-rival','One person using it does not reduce the amount left for others.'],['Non-excludable','People who do not pay cannot be stopped from using it.'],['Free rider','Someone who benefits from a good without paying for it.']],
  card:{head:'Public goods', items:[
    PT('Pure public goods',[['Examples','Street lighting, national defence, flood defences.'],['Why the market fails','Nobody can be made to pay, so firms cannot profit, and the good is under-provided or missing.']]),
    PT('Quasi-public goods',[['What','Partly rival or partly excludable, such as roads (congestion, tolls) or beaches.'],['Why it matters','Technology can make a good excludable, through tolls or subscriptions.']]),
    PT('Private goods',[['What','Rival and excludable: a pizza, a phone.']])
  ]},
  traps:['Explain <b>both</b> characteristics, then the free rider problem. A public good is not just “a good the government provides”.']};

V.mf_info={kind:'card', btn:'Information gaps', showing:'When one side knows more',
  title:'Information gaps',
  lead:'Markets work best when buyers and sellers are well informed. When they are not, resources are misallocated.',
  terms:[['Symmetric information','Both sides of a deal know the same.'],['Asymmetric information','One side knows more than the other.'],['Merit good','Under-consumed because people underestimate its benefits, such as education.'],['Demerit good','Over-consumed because people underestimate its costs, such as vaping.']],
  card:{head:'How gaps misallocate resources', items:[
    PT('Examples',[['Used cars','Sellers know the faults and buyers do not, so buyers overpay or avoid the market.'],['Health care','Patients cannot judge treatments, so they rely on doctors.'],['Merit goods','Students underestimate the lifetime benefits of education, so they consume too little of it.'],['Demerit goods','Young people underestimate the long-run harm of vaping, so they consume too much.']])
  ]},
  tip:'Merit and demerit goods combine information gaps with externalities.'};

/* ------------------------- THEME 1: GOVERNMENT INTERVENTION ------------------------- */
V.gi_max={kind:'mkt', m:'maxp', anim:true, btn:'Maximum price', showing:'A price ceiling causes a shortage',
  title:'Maximum prices',
  lead:'A maximum price is a legal limit set below the equilibrium price, to make something affordable, such as a cap on rents.',
  terms:[['Maximum price','A price ceiling: it is illegal to charge more.']],
  chain:[
    'The maximum price is set below equilibrium, at P<sub>max</sub>.',
    'Consumers want more at the lower price (Q<sub>d</sub>), but firms supply less (Q<sub>s</sub>).',
    'The gap is a shortage: excess demand.',
    'Some people get the good cheaply and others get none, so a black market can appear.'
  ],
  evaluation:'It helps those who get the good, but it needs rationing by queues or lotteries, and supply can shrink further over time, as when rent caps cut the number of homes to let.',
  traps:['A maximum price only has an effect if it is set <b>below</b> equilibrium.']};

V.gi_min={kind:'mkt', m:'minp', anim:true, btn:'Minimum price', showing:'A price floor causes a surplus',
  title:'Minimum prices',
  lead:'A minimum price is a legal floor set above equilibrium, to cut consumption of a demerit good or protect producers’ incomes, such as the minimum unit price for alcohol in Scotland.',
  terms:[['Minimum price','A price floor: it is illegal to sell below it.']],
  chain:[
    'The minimum price is set above equilibrium, at P<sub>min</sub>.',
    'Consumers buy less (Q<sub>d</sub>), while producers want to sell more (Q<sub>s</sub>).',
    'The gap is excess supply.',
    'For alcohol the aim is the lower consumption; for farm goods, the government may have to buy up the surplus.'
  ],
  evaluation:'How far drinking falls depends on PED: heavy drinkers have inelastic demand, so the price rises a lot but consumption falls little.',
  traps:['A minimum price only works if it is set <b>above</b> equilibrium. In the UK, minimum unit pricing for alcohol applies in Scotland and Wales, not England.']};

V.gi_permit={kind:'mkt', m:'permit', anim:true, btn:'Pollution permits', showing:'Fewer permits, a higher price',
  title:'Tradable pollution permits',
  lead:'The government caps total pollution by issuing a fixed number of permits. Firms that can cut pollution cheaply sell their spare permits to firms that cannot.',
  terms:[['Tradable pollution permit','A licence to emit a set amount of pollution, which can be bought and sold.']],
  chain:[
    'The government fixes the number of permits, so supply is vertical.',
    'Cutting the number of permits shifts supply left, from S<sub>1</sub> to S<sub>2</sub>.',
    'The price of a permit rises from P<sub>1</sub> to P<sub>2</sub>, so polluting costs more.',
    'Firms that can cut emissions cheaply do so and sell their permits, so pollution falls where it is cheapest to cut.'
  ],
  evaluation:'Permits guarantee the total amount of pollution, which a tax cannot. But if too many are issued the price collapses, as in the early years of the EU scheme, and monitoring emissions is costly.'};

V.gi_state={kind:'card', btn:'Other tools', showing:'State provision, information, regulation',
  title:'Other ways to intervene',
  lead:'Taxes, subsidies and price controls work through prices. These tools work directly.',
  card:{head:'Direct tools', items:[
    PT('State provision',[['How','The government provides the good itself, paid for by taxes: street lighting, defence, the NHS.'],['Problem','With no price signal it is hard to know how much to provide, and services can be inefficient.']]),
    PT('Provision of information',[['How','Campaigns and labelling close information gaps: calorie counts on menus, health warnings.'],['Problem','People may ignore it, and the effects are slow and small.']]),
    PT('Regulation',[['How','Laws that ban or limit an activity: age limits on vapes, emission standards for cars.'],['Problem','It must be policed, firms may evade it, and the limit may be set at the wrong level.']])
  ]},
  evaluation:'Each tool has costs and can cause government failure. The best one depends on the market failure: regulation suits dangerous goods, information suits information gaps.'};

V.gf_causes={kind:'card', btn:'Causes of government failure', showing:'When intervention makes things worse',
  title:'Government failure',
  lead:'Government failure is when intervention leads to a worse allocation of resources than before.',
  terms:[['Government failure','When government intervention causes a net welfare loss.']],
  card:{head:'Government failure', items:[
    PT('The spec’s four causes',[['Distortion of price signals','Subsidies and price controls stop prices showing what people want, so resources go to the wrong place.'],['Unintended consequences','A policy changes behaviour in ways nobody planned: a very high tax encourages smuggling.'],['Excessive administrative costs','Running and policing the policy costs more than the problem it fixes.'],['Information gaps','The government does not know the true size of an externality, so it sets the tax or subsidy at the wrong level.']]),
    PT('Examples',[['Tobacco taxes','Very high taxes encourage illegal imports.'],['Rent controls','Landlords leave the market, so fewer homes are available to rent.']])
  ]},
  traps:['Government failure needs a <b>net</b> welfare loss. A policy that works imperfectly is not automatically a failure.']};

/* ------------------------- THEME 2: MEASURING PERFORMANCE ------------------------- */
V.me_gdp={kind:'card', btn:'Measuring growth', showing:'Real, nominal, per capita',
  title:'Measuring economic growth',
  lead:'Economic growth is a rise in real GDP: the value of all the goods and services an economy produces, adjusted for inflation.',
  terms:[['GDP','The total value of goods and services produced in a country in a year.'],['Real GDP','GDP adjusted for inflation.'],['GDP per capita','GDP divided by the population.'],['GNI','GDP plus income earned from abroad, minus income paid abroad.'],['PPP','Purchasing power parity: an exchange rate that equalises what money buys in each country.']],
  card:{head:'Measuring growth', items:[
    PT('Which measure',[['Real, not nominal','Nominal GDP can rise just because prices rise; real GDP shows extra output.'],['Per capita','Divide by population to compare living standards.'],['GNI','Better for countries with big income flows across borders.'],['PPP','Converts using what money actually buys, so living standards compare fairly.']]),
    PT('Limits for comparing living standards',[['Inequality','An average hides how income is shared.'],['Hidden economy','Unpaid care and cash-in-hand work are missed.'],['Quality of life','Pollution, leisure and wellbeing are not counted.'],['Data','Measured differently, and with errors, across countries.']])
  ]},
  work:{q:'Nominal GDP rises from £2,000bn to £2,100bn while prices rise by 3%. Roughly how much did real GDP grow?',
    steps:['Nominal growth = (2,100 − 2,000) ÷ 2,000 × 100 = <b>5%</b>.','Real growth ≈ nominal growth − inflation = 5% − 3% = <b>about 2%</b>.'], ans:'About 2%.'},
  traps:['To compare countries, use <b>real GDP per capita at PPP</b>, and say why each adjustment matters.']};

V.me_wellbeing={kind:'card', btn:'Happiness and wellbeing', showing:'Beyond GDP',
  title:'National happiness and wellbeing',
  lead:'GDP measures output, not how well people live. Wellbeing measures ask people directly.',
  card:{head:'Beyond GDP', items:[
    PT('Measures',[['Life satisfaction','The ONS asks people how satisfied they are with their lives.'],['HDI','Combines income, life expectancy and education.']]),
    PT('What the evidence shows',[['Income matters','Richer people tend to be happier, up to a point.'],['Then it flattens','Beyond that point, extra income adds little happiness: the Easterlin paradox.'],['Other things','Health, relationships, job security and the environment matter a lot.']])
  ]},
  evaluation:'Wellbeing surveys are subjective and hard to compare across cultures, but they show why governments should look beyond GDP.'};

V.me_cpi={kind:'card', btn:'Measuring inflation', showing:'CPI, RPI and index numbers',
  title:'Measuring inflation',
  lead:'Inflation is a sustained rise in the general price level. The UK measures it with the Consumer Prices Index (CPI).',
  terms:[['Inflation','A sustained rise in the general price level.'],['Deflation','A sustained fall in the general price level.'],['Disinflation','Inflation slowing down while prices still rise.']],
  card:{head:'How the CPI is built', items:[
    PT('Steps',[['Survey','The Living Costs and Food Survey finds what households spend their money on.'],['Basket','Prices of hundreds of items are collected every month.'],['Weights','Each item is weighted by its share of spending, so petrol counts more than matches.'],['Index','The weighted average becomes an index number, with a base year of 100.']]),
    PT('CPI and RPI',[['RPI','Includes mortgage interest payments and council tax, so it is usually higher.'],['Limits','An average household may not match yours; quality improvements are hard to measure; new products are added late.']])
  ]},
  work:{q:'A basket costs £200 in the base year and £208 a year later. What is the price index, and the rate of inflation?',
    steps:['Index = 208 ÷ 200 × 100 = <b>104</b>.','Inflation = 104 − 100 = <b>4%</b>.'], ans:'An index of 104 and inflation of 4%.'},
  traps:['Disinflation is <b>not</b> deflation: prices are still rising, just more slowly.']};

V.me_inflcause={kind:'card', btn:'Causes of inflation', showing:'Demand-pull, cost-push, money supply',
  title:'Causes of inflation',
  lead:'Inflation comes from too much demand, rising costs, or too much money chasing too few goods.',
  card:{head:'Causes', items:[
    PT('Three causes',[['Demand-pull','AD grows faster than the economy can produce, so prices are bid up.'],['Cost-push','Firms pass on higher costs: energy, wages, or imported materials after a fall in the pound.'],['Money supply','If the money supply grows faster than output, more money chases the same goods.']])
  ]},
  tip:'Use the AD/AS diagrams: demand-pull is AD shifting right; cost-push is SRAS shifting left.'};

V.me_inflfx={kind:'card', btn:'Effects of inflation', showing:'Who wins and who loses',
  title:'The effects of inflation',
  lead:'Inflation hurts some groups and helps others, depending on how fast it is and whether it was expected.',
  card:{head:'Effects', items:[
    PT('Consumers',[['Lose','Real incomes fall if wages lag behind prices; savers lose when interest rates are below inflation.'],['Gain','Borrowers repay debts worth less in real terms.']]),
    PT('Firms',[['Lose','Menu costs, uncertainty that delays investment, and less competitive exports.'],['Gain','Mild inflation makes it easier to cut real wages without cutting pay.']]),
    PT('Government',[['Gain','Fiscal drag: tax revenue rises as wages move into higher tax bands.'],['Lose','Pensions and benefits linked to inflation cost more.']]),
    PT('Workers',[['Lose','Real wages fall until pay catches up. Low earners suffer most, because more of their income goes on essentials.']])
  ]},
  evaluation:'Low, stable inflation does little harm, which is why the target is 2%, not zero. Deflation can be worse: people delay spending, which deepens a recession.'};

V.me_unemp={kind:'card', btn:'Measuring unemployment', showing:'Claimant count and the ILO measure',
  title:'Measuring employment and unemployment',
  lead:'The unemployed are people of working age who want a job and can start one, but cannot find one.',
  terms:[['Unemployment','Of working age, available and looking for work, but without a job.'],['Underemployment','Working fewer hours than you want, or in a job below your skills.'],['Economically inactive','Of working age but not looking for work: students, carers, the long-term sick.']],
  card:{head:'Two measures', items:[
    PT('Measures',[['Claimant count','People claiming unemployment-related benefits. Quick and cheap, but misses those not eligible or not claiming.'],['ILO (Labour Force Survey)','A survey asking whether people looked for work and could start. Comparable across countries, but a sample with errors.']]),
    PT('What the changes mean',[['Employment up, unemployment flat','People are moving from inactivity into work.'],['Inactivity up','Fewer people in the labour force, which can shrink potential output.']])
  ]},
  traps:['The ILO measure is usually <b>higher</b> than the claimant count, because it includes people who cannot or do not claim benefits.']};

V.me_ucause={kind:'card', btn:'Causes of unemployment', showing:'Five types',
  title:'Causes of unemployment',
  lead:'Unemployment has different causes, and each needs a different cure.',
  card:{head:'Types', items:[
    PT('Causes',[['Frictional','Between jobs while searching: short-term and unavoidable.'],['Seasonal','Jobs that disappear at certain times of year: summer tourism, Christmas retail.'],['Structural','Industries decline and workers lack the skills or location for new jobs: coal mining, high-street retail.'],['Cyclical (demand-deficient)','Too little AD in a recession, so firms need fewer workers.'],['Real wage inflexibility','Wages held above the market-clearing level, so more people want work than firms want to hire.']]),
    PT('Migration and skills',[['Migration','Can fill skill shortages and cut structural unemployment, or compete for low-skilled jobs.']])
  ]},
  traps:['Match the cure to the cause: cyclical needs more AD; structural needs supply-side policy such as retraining.']};

V.me_ueff={kind:'card', btn:'Effects of unemployment', showing:'Costs for everyone',
  title:'The effects of unemployment',
  lead:'Unemployment wastes resources: the economy produces inside its PPF.',
  card:{head:'Effects', items:[
    PT('Who is affected',[['Consumers','Lower incomes and spending; some switch to inferior goods.'],['Firms','Lower demand, but more people to hire from and less pressure on wages.'],['Workers','Lost income, skills that fade the longer it lasts, and poorer mental health.'],['Government','Less tax revenue and more spent on benefits, so the budget worsens.'],['Society','Crime and social problems where long-term unemployment is high.']])
  ]},
  evaluation:'Short spells of frictional unemployment cost little. Long-term structural unemployment does lasting damage, because skills erode (hysteresis).'};

/* ------------------------- THEME 2: AD AND AS ------------------------- */
V.ag_left={kind:'adas2', sh:'ad', amt:-22, anim:true, btn:'AD shifts left', showing:'Less spending, less output',
  title:'A fall in aggregate demand',
  lead:'A fall in any component of AD (C, I, G or X − M) shifts the AD curve left.',
  chain:[
    'Spending falls, so AD shifts left from AD<sub>1</sub> to AD<sub>2</sub>.',
    'Real GDP falls from Y<sub>1</sub> to Y<sub>2</sub>: firms produce less and need fewer workers.',
    'The price level falls from P<sub>1</sub> to P<sub>2</sub>, so inflation slows.'
  ],
  compare:{vs:'After AD falls',rows:[['Real GDP','↓ lower'],['Unemployment','↑ higher'],['Price level','↓ lower'],['AD curve','shifts left']]},
  traps:['A change in the <b>price level</b> moves along AD; a change in C, I, G or X − M shifts it.']};

V.ag_cons={kind:'card', btn:'Consumption', showing:'What drives household spending',
  title:'Consumption',
  lead:'Consumption is household spending on goods and services: the biggest part of AD.',
  terms:[['Marginal propensity to consume (MPC)','The share of each extra pound of income that is spent.'],['Savings ratio','Household saving as a share of disposable income.']],
  card:{head:'Influences', items:[
    PT('What changes consumption',[['Income','More disposable income, more spending.'],['Interest rates','Higher rates reward saving and make borrowing dearer, so spending falls.'],['Confidence','Worried households save more; confident ones spend.'],['Wealth','Rising house and share prices make people feel richer: the wealth effect.'],['Credit','Easier borrowing raises spending.']])
  ]},
  traps:['Saving and consumption move in opposite directions: a higher savings ratio means less consumption out of each pound of income.']};

V.ag_inv={kind:'card', btn:'Investment', showing:'Spending on capital goods',
  title:'Investment',
  lead:'Investment is spending by firms on capital goods, such as machinery and buildings, that raise future output.',
  terms:[['Gross investment','All spending on new capital goods.'],['Net investment','Gross investment minus depreciation (capital that has worn out).'],['Accelerator','Investment depends on how fast output is growing: faster growth needs more capacity.']],
  card:{head:'Influences', items:[
    PT('What changes investment',[['Growth (the accelerator)','When demand grows fast, firms invest to keep up.'],['Confidence','Keynes’s “animal spirits”: optimism raises investment, gloom cuts it.'],['Interest rates','Higher rates make borrowing to invest dearer.'],['Access to credit','If banks will not lend, investment falls.'],['Exports and regulation','Strong export demand encourages investment; heavy regulation discourages it.']])
  ]},
  evaluation:'Investment is the most volatile part of AD, because it rests on expectations, which can change quickly.'};

V.ag_gov={kind:'card', btn:'Government spending', showing:'Automatic and deliberate',
  title:'Government expenditure',
  lead:'Government spending on public services and investment is part of AD. Transfer payments such as benefits are not, until they are spent.',
  card:{head:'Influences', items:[
    PT('What changes it',[['The trade cycle','Automatic stabilisers: in a recession, spending on benefits rises and tax revenue falls with no decision needed.'],['Fiscal policy','Deliberate choices to spend more or less, to steer the economy.']])
  ]},
  traps:['Benefits are <b>transfer payments</b>: they are not part of G, though they raise consumption when spent.']};

V.ag_nx={kind:'card', btn:'Net trade', showing:'Exports minus imports',
  title:'Net trade',
  lead:'Net trade is exports minus imports (X − M). Exports add to AD; imports are a leakage.',
  card:{head:'Influences', items:[
    PT('What changes it',[['Real income','Rising UK incomes suck in imports; rising incomes abroad boost exports.'],['Exchange rate','A weaker pound makes exports cheaper and imports dearer.'],['World economy','A global recession cuts demand for exports.'],['Protectionism','Tariffs abroad hit exports; UK tariffs cut imports.'],['Non-price factors','Quality, design, reliability and reputation.']])
  ]}};

V.as_sr_up={kind:'adas2', sh:'sras', amt:-18, anim:true, btn:'SRAS increases', showing:'Lower costs shift SRAS right',
  title:'Short-run aggregate supply',
  lead:'SRAS shows how much firms will produce at each price level while costs stay the same. Lower costs shift it right.',
  terms:[['SRAS','Total planned output at each price level, with costs held constant.']],
  plain:[['Materials and energy','Cheaper oil or gas cuts costs.'],['Exchange rate','A stronger pound makes imported inputs cheaper.'],['Taxes','Lower business taxes or duties cut costs.'],['Wages','Slower wage growth cuts costs.']],
  chain:[
    'Costs fall, so SRAS shifts right from SRAS<sub>1</sub> to SRAS<sub>2</sub>.',
    'Real GDP rises from Y<sub>1</sub> to Y<sub>2</sub> and the price level falls from P<sub>1</sub> to P<sub>2</sub>.',
    'Growth with lower inflation: the best of both.'
  ],
  compare:{vs:'After SRAS rises',rows:[['Real GDP','↑ higher'],['Price level','↓ lower'],['Unemployment','↓ lower'],['SRAS','shifts right']]}};

V.as_lrfac={kind:'card', btn:'What shifts LRAS', showing:'Productive capacity',
  title:'Long-run aggregate supply',
  lead:'LRAS is the economy’s productive capacity: what it can produce using all its resources. It shifts when the quantity or quality of resources changes.',
  terms:[['LRAS','The output the economy can produce at full capacity.']],
  card:{head:'LRAS', items:[
    PT('What shifts LRAS right',[['Technology','New technology raises output per worker.'],['Productivity','Better management and capital make each worker produce more.'],['Education and skills','A more skilled workforce produces more.'],['Regulation','Less red tape lowers costs and encourages enterprise.'],['Demographics and migration','More people of working age add to the labour force.'],['Competition policy','More competition pushes firms to cut costs and innovate.']]),
    PT('Two views of LRAS',[['Classical','Vertical at full capacity: in the long run, output is set by supply, not demand.'],['Keynesian','Flat while there is spare capacity, then curving up, then vertical at full capacity.']])
  ]},
  traps:['Draw the classical LRAS <b>vertical</b>; the Keynesian AS curves. Say which model you are using.']};

/* ------------------------- THEME 2: NATIONAL INCOME ------------------------- */
V.ni_flow={kind:'flow', m:'simple', btn:'Circular flow', showing:'Households and firms',
  title:'The circular flow of income',
  lead:'Households sell factor services to firms and receive incomes; they spend those incomes on firms’ goods and services.',
  terms:[['National income','The total income of an economy, which equals its output and its spending.'],['Income','A flow of money over time, such as wages.'],['Wealth','A stock of assets at a point in time, such as savings and property.']],
  chain:[
    'Households supply land, labour, capital and enterprise to firms.',
    'Firms pay them incomes: rent, wages, interest and profit.',
    'Households spend their incomes on goods and services, so the money flows back to firms.',
    'So output = income = spending: three ways to measure national income.'
  ],
  traps:['Income is a <b>flow</b>; wealth is a <b>stock</b>. Do not use them as if they mean the same.']};

V.ni_injw={kind:'flow', m:'full', btn:'Injections and withdrawals', showing:'Money in and money out',
  title:'Injections and withdrawals',
  lead:'Some income leaks out of the circular flow, and some spending is injected in.',
  terms:[['Injections','Spending that enters the flow from outside it: investment (I), government spending (G), exports (X).'],['Withdrawals','Income that leaves the flow: saving (S), taxes (T), imports (M).']],
  chain:[
    'Households save (S), pay taxes (T) and buy imports (M): money leaks out.',
    'Firms invest (I), the government spends (G) and foreigners buy exports (X): money comes in.',
    'If injections exceed withdrawals, national income grows; if withdrawals exceed injections, it shrinks.',
    'Income settles where injections equal withdrawals.'
  ],
  traps:['Learn the pairs: <b>S and I</b> (banks), <b>T and G</b> (government), <b>M and X</b> (abroad).']};

V.ni_mult={kind:'card', btn:'The multiplier', showing:'One injection, a bigger rise in income',
  title:'The multiplier',
  lead:'An injection into the circular flow raises national income by more than the injection itself, because one person’s spending is another’s income.',
  terms:[['Multiplier','The final change in national income divided by the initial change in injections.'],['MPC','Marginal propensity to consume: the share of extra income spent.'],['MPW','Marginal propensity to withdraw: MPS + MPT + MPM, the share of extra income that leaks out.']],
  card:{head:'The multiplier', items:[
    PT('The formula',[['Multiplier','1 ÷ (1 − MPC), which is the same as 1 ÷ MPW.'],['Bigger when','People spend more of each extra pound: a high MPC, low taxes, few imports.']]),
    PT('Why it matters',[['Policy','More government spending raises GDP by more than the spending.'],['Recessions','Cuts in spending multiply too, so recessions can deepen.']])
  ]},
  work:{q:'The MPC is 0.75 and the government spends an extra £20bn. How much does national income rise?',
    steps:['Multiplier = 1 ÷ (1 − 0.75) = 1 ÷ 0.25 = <b>4</b>.','Change in income = 4 × £20bn = <b>£80bn</b>.'], ans:'£80bn.'},
  evaluation:'In the UK the multiplier is small, because much of any extra income leaks into taxes and imports. Time lags and crowding out weaken it further.',
  traps:['In an open economy with a government, use the MPW (saving, tax and imports), not just the MPS.']};

V.ni_rounds={kind:'rounds', mpc:0.75, inj:100, anim:true, two:true, btn:'Rounds of spending', showing:'Each round is smaller',
  title:'The multiplier, round by round',
  lead:'An injection of £100m is spent, becomes someone’s income, and part of it is spent again.',
  chain:[
    'Round 1: £100m is spent and becomes someone’s income.',
    'They spend 75% of it (MPC = 0.75): £75m in round 2.',
    'Then about £56m, then about £42m, each round smaller than the last.',
    'Added up, the rounds come to £100m × 4 = £400m.'
  ]};

/* ------------------------- THEME 2: GROWTH ------------------------- */
V.gw_causes={kind:'card', btn:'Causes of growth', showing:'Actual and potential',
  title:'Causes of economic growth',
  lead:'Actual growth is a rise in real GDP. Potential growth is a rise in productive capacity.',
  terms:[['Actual growth','A rise in real GDP: more output produced.'],['Potential growth','A rise in productive capacity: the PPF or LRAS shifts out.'],['Export-led growth','Growth driven by rising exports, as in China and Germany.']],
  card:{head:'Growth', items:[
    PT('Actual growth (AD)',[['Causes','A rise in C, I, G or net exports uses spare capacity.'],['Diagram','AD shifts right, or the economy moves from inside the PPF to the frontier.']]),
    PT('Potential growth (LRAS)',[['Causes','More and better capital, a bigger or more skilled workforce, new technology.'],['Diagram','LRAS shifts right; the PPF shifts out.']]),
    PT('Trade',[['Export-led growth','Rising exports add to AD and allow economies of scale; trade also spreads new technology.']])
  ]},
  traps:['Growth needs both. AD growth without LRAS growth ends in inflation once spare capacity runs out.']};

V.gw_gap={kind:'cycle', m:'gap', anim:true, two:true, btn:'Output gaps', showing:'Actual against trend GDP',
  title:'Output gaps',
  lead:'An output gap is the difference between actual GDP and potential (trend) output: what the economy could produce without pushing up inflation.',
  terms:[['Positive output gap','Actual GDP above potential: overheating, inflation rising.'],['Negative output gap','Actual GDP below potential: spare capacity, unemployment.']],
  chain:[
    'The dashed line is trend growth: how fast potential output grows.',
    'Where actual GDP is above trend there is a positive output gap: demand outruns capacity, so inflation rises.',
    'Where it is below trend there is a negative output gap: resources sit idle, so unemployment rises.'
  ],
  evaluation:'Output gaps are hard to measure, because potential output cannot be observed and estimates are often revised later. Policy based on them can be wrong.'};

V.gw_cycle={kind:'cycle', m:'cycle', anim:true, two:true, btn:'The trade cycle', showing:'Boom, downturn, recession, recovery',
  title:'The trade (business) cycle',
  lead:'Real GDP grows in waves around its trend: periods of fast growth followed by slowdowns.',
  terms:[['Recession','Two consecutive quarters of falling real GDP.'],['Boom','Fast growth, with actual GDP above trend.']],
  plain:[['<b>Boom</b>','Fast growth, low unemployment, rising inflation.'],['<b>Downturn</b>','Growth slows and firms cut investment.'],['<b>Recession</b>','Real GDP falls and unemployment rises.'],['<b>Recovery</b>','Growth returns as confidence and spending pick up.']],
  traps:['A recession is real GDP falling for two quarters in a row, not just slow growth.']};

V.gw_impact={kind:'card', btn:'Impact of growth', showing:'Costs and benefits',
  title:'The impact of economic growth',
  lead:'Growth raises incomes and living standards, but it has costs, and the gains are not shared equally.',
  card:{head:'Impact', items:[
    PT('Benefits',[['Consumers','Higher real incomes and more choice.'],['Firms','More sales and profit, which pay for investment.'],['Government','More tax revenue and less spent on benefits, so public services can improve.'],['Workers','More jobs and rising wages.']]),
    PT('Costs',[['Environment','More pollution and resource use, at least until countries are rich enough to clean up.'],['Inequality','The gains can go mostly to the richest.'],['Inflation','Growth beyond capacity pushes prices up.'],['Future living standards','Using up resources now can lower living standards later.']])
  ]},
  evaluation:'Whether growth raises living standards depends on what is growing, who gains, and whether it can last. The Kuznets and Easterlin evaluation points go further.'};

/* ------------------------- THEME 2: POLICY ------------------------- */
V.po_obj={kind:'card', btn:'Objectives', showing:'What governments aim for',
  title:'Macroeconomic objectives',
  lead:'Governments aim for a healthy economy on several fronts at once.',
  card:{head:'Objectives', items:[
    PT('The objectives',[['Economic growth','Steady, sustainable growth in real GDP.'],['Low unemployment','As few people as possible out of work.'],['Low and stable inflation','The UK target is 2% CPI inflation.'],['Balance of payments','A current account position that can be sustained.'],['Balanced budget','Spending broadly covered by tax revenue over time.'],['Environment','Growth that does not harm future generations.'],['Equality','A fairer distribution of income.']])
  ]},
  tip:'The objectives often conflict, and that is where most evaluation comes from: see “Conflicts”.'};

V.po_mon={kind:'card', btn:'Monetary policy', showing:'Interest rates and QE',
  title:'Monetary policy',
  lead:'Monetary policy is set by the Bank of England’s Monetary Policy Committee to hit the inflation target, mainly by changing Bank Rate.',
  terms:[['Bank Rate','The interest rate the Bank of England pays on reserves; other rates follow it.'],['Quantitative easing (QE)','The central bank creates money to buy bonds, pushing down long-term interest rates.']],
  chain:[
    'The Monetary Policy Committee raises Bank Rate.',
    'Borrowing gets dearer and saving more rewarding, so consumption and investment fall.',
    'Higher rates attract hot money, so the pound rises: exports get dearer and imports cheaper.',
    'AD shifts left, so inflation falls, but growth slows and unemployment rises.'
  ],
  card:{head:'Monetary policy', items:[
    PT('Tools',[['Bank Rate','The main tool: raised to cut inflation, cut to boost demand.'],['Quantitative easing','Used when Bank Rate is already close to zero.']]),
    PT('Limits',[['Time lags','It takes many months to affect inflation.'],['Confidence','If people are gloomy, low rates may not make them borrow.'],['Supply shocks','Higher rates cannot fix inflation caused by energy prices without hurting output.']])
  ]},
  evaluation:'Monetary policy is quick to change and kept away from politics, but it is blunt: it hits borrowers hardest and works with long lags.',
  traps:['MPC here means the Monetary Policy Committee, not the marginal propensity to consume. Make clear which one you mean.']};

V.po_fis={kind:'card', btn:'Fiscal policy', showing:'Taxes and government spending',
  title:'Fiscal policy',
  lead:'Fiscal policy is the government’s use of taxes and spending to influence AD.',
  terms:[['Direct tax','A tax on income or wealth, such as income tax.'],['Indirect tax','A tax on spending, such as VAT.'],['Budget deficit','Spending more than tax revenue in a year.'],['National debt','The total built-up borrowing of the government.']],
  card:{head:'Fiscal policy', items:[
    PT('Expansionary',[['How','Cut taxes or raise spending, so AD shifts right.'],['When','In a recession, to close a negative output gap.']]),
    PT('Contractionary',[['How','Raise taxes or cut spending, so AD shifts left.'],['When','When the economy is overheating.']]),
    PT('Two schools',[['Keynesian','Use fiscal policy actively to manage demand, above all in a recession.'],['Classical','Keep budgets balanced; government borrowing crowds out private investment.']])
  ]},
  evaluation:'Fiscal policy can aim spending where it is needed, but it is slow (decision and implementation lags), it can raise the national debt, and the multiplier may be small.',
  traps:['A deficit is <b>one year’s</b> shortfall; the national debt is the <b>total</b> built up over time.']};

V.po_ss={kind:'card', btn:'Supply-side policies', showing:'Market-based and interventionist',
  title:'Supply-side policies',
  lead:'Supply-side policies aim to raise productive capacity: they shift LRAS right.',
  card:{head:'Supply-side policies', items:[
    PT('Market-based',[['Lower taxes','Lower income and corporation tax reward work and investment.'],['Deregulation','Less red tape makes it easier to start and run firms.'],['Privatisation','Selling state firms lets competition and profit drive efficiency.'],['Labour market reform','Easier hiring and firing; less union power.']]),
    PT('Interventionist',[['Education and training','Raise skills and productivity.'],['Infrastructure','Roads, rail and broadband cut firms’ costs.'],['Industrial policy','Support for research and new industries.']]),
    PT('Strengths and weaknesses',[['Strengths','Growth without inflation; a cure for structural unemployment.'],['Weaknesses','Slow, often expensive; market-based policies can widen inequality.']])
  ]},
  evaluation:'Supply-side policies are the only lasting way to raise growth without inflation, but they take years to work, so they cannot fix a recession quickly.'};

V.po_conf={kind:'card', btn:'Conflicts and trade-offs', showing:'You cannot hit every target at once',
  title:'Conflicts between objectives',
  lead:'A policy that helps one objective often harms another.',
  card:{head:'Conflicts', items:[
    PT('Between objectives',[['Growth and inflation','Growth beyond capacity raises inflation.'],['Inflation and unemployment','The short-run Phillips curve: less unemployment comes with more inflation.'],['Growth and the current account','Rising incomes suck in imports.'],['Growth and the environment','More output, more emissions.'],['The budget and growth','Cutting the deficit cuts AD in the short run.']]),
    PT('From particular policies',[['Higher interest rates','Lower inflation, but slower growth and a stronger pound.'],['Expansionary fiscal policy','Faster growth, but a bigger deficit.']])
  ]},
  evaluation:'Supply-side policies are the main way to ease these conflicts, because extra capacity allows more growth without more inflation.'};

/* ------------------------- TOPIC QUIZZES ------------------------- */
TOPICS.nature.quiz=[['Is “raising taxes will reduce consumption” positive or normative?','Positive: it can be tested against evidence, even if it turns out wrong.'],['What does a point inside the PPF show?','Unemployed or inefficiently used resources.'],['Name the four functions of money.','A medium of exchange, a measure of value, a store of value, a method of deferred payment.']];
TOPICS.demand.quiz=[['What causes a movement along a demand curve?','A change in the good’s own price.'],['Give three things that shift demand right.','Any three: higher income (normal goods), a dearer substitute, a cheaper complement, a favourable change in tastes, a bigger population, expected price rises.'],['Why does the demand curve slope down?','Diminishing marginal utility: each extra unit adds less satisfaction, so people only buy more at a lower price.']];
TOPICS.supply.quiz=[['Why does the supply curve slope up?','A higher price makes each extra unit more profitable, so firms supply more.'],['Give two things that shift supply left.','Any two: higher costs, an indirect tax, bad weather, firms leaving the market, lower productivity.'],['Supply rises. What happens to price and quantity?','The price falls and quantity rises; demand extends.']];
TOPICS.elastic.quiz=[['Price rises by 10% and quantity falls by 25%. What is PED?','−2.5: elastic.'],['What does a negative YED tell you?','The good is inferior: demand falls as income rises.'],['Give two factors that make supply more elastic.','Any two: spare capacity, stocks that can be stored, a longer time period, mobile factors of production.']];
TOPICS.price.quiz=[['What happens to the price when there is excess demand?','Buyers bid it up until the market clears.'],['Name the three functions of the price mechanism.','Rationing, signalling and incentive.'],['What happens to consumer surplus when the price falls?','It rises: consumers pay less for existing units and buy extra ones.']];
TOPICS.taxsub.quiz=[['How is tax revenue shown on the diagram?','The tax per unit × the new quantity: the box between P<sub>2</sub> and P<sub>3</sub>.'],['When does the consumer bear most of a tax?','When demand is price inelastic.'],['What is the cost of a subsidy to the government?','The subsidy per unit × the new, higher quantity.']];
TOPICS.behave.quiz=[['Give the spec’s three reasons consumers may not be rational.','The influence of other people’s behaviour, habitual behaviour, and weakness at computation.'],['What is anchoring?','Judging a price against the first number you see.'],['What is a nudge?','A change in how a choice is presented that steers behaviour without banning options or changing prices.']];
TOPICS.failure.quiz=[['Name the three types of market failure in the spec.','Externalities, under-provision of public goods, and information gaps.'],['What two characteristics make a pure public good?','Non-rivalry and non-excludability.'],['Why is education a merit good?','People underestimate its long-run benefits, so they consume too little of it.']];
TOPICS.intervene.quiz=[['What does a maximum price below equilibrium cause?','A shortage: excess demand.'],['Why is the supply of pollution permits vertical?','The government fixes the number issued, whatever the price.'],['Give one weakness of providing information.','People may ignore it, and its effects are slow and small.']];
TOPICS.govfail.quiz=[['Define government failure.','Intervention that causes a net welfare loss.'],['Give the spec’s four causes.','Distortion of price signals, unintended consequences, excessive administrative costs, information gaps.'],['Give an example of an unintended consequence.','A very high tax on cigarettes encourages smuggling.']];
TOPICS.measures.quiz=[['Why use real rather than nominal GDP?','Nominal GDP can rise just because prices rise; real GDP shows extra output.'],['What is disinflation?','Inflation slowing down while prices still rise.'],['Why is the ILO measure usually above the claimant count?','It includes people who are not entitled to, or do not claim, benefits.']];
TOPICS.agg_d.quiz=[['What are the four components of AD?','Consumption, investment, government spending and net exports: C + I + G + (X − M).'],['What is the accelerator?','Investment depends on how fast output is growing.'],['Are benefits part of G?','No: they are transfer payments, though they raise consumption when spent.']];
TOPICS.agg_s.quiz=[['Give two causes of an SRAS shift right.','Any two: cheaper raw materials or energy, a stronger pound, lower business taxes, slower wage growth.'],['Give two causes of an LRAS shift right.','Any two: new technology, higher productivity, better education and skills, less regulation, more working-age people, more competition.'],['What shape is the classical LRAS?','Vertical at full capacity.']];
TOPICS.natinc.quiz=[['Name the three injections and three withdrawals.','Injections: I, G, X. Withdrawals: S, T, M.'],['The MPW is 0.4. What is the multiplier?','1 ÷ 0.4 = 2.5.'],['What is the difference between income and wealth?','Income is a flow over time; wealth is a stock of assets at a point in time.']];
TOPICS.growth2.quiz=[['What is the difference between actual and potential growth?','Actual: a rise in real GDP. Potential: a rise in productive capacity.'],['What does a positive output gap mean?','Actual GDP above potential: inflationary pressure.'],['Define a recession.','Two consecutive quarters of falling real GDP.']];
TOPICS.policy.quiz=[['Who sets Bank Rate in the UK?','The Bank of England’s Monetary Policy Committee.'],['What is the difference between the budget deficit and the national debt?','The deficit is one year’s shortfall; the debt is the total built up over time.'],['Why are supply-side policies said to ease conflicts between objectives?','They raise capacity, allowing more growth without more inflation.']];

/* =====================================================================
   STATE
   ===================================================================== */
/* a first visit (nothing saved, no link) starts at the beginning: Theme 1, the nature of economics */
var state = {topic:'nature', view:{perfect:'pc_taker', monopoly:'base', monopolistic:'mc_snp', oligopoly:'kink', contestable:'cm_mono'}, t:1, fade:true, cheater:'A'};
var raf = 0;
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var plot = document.getElementById('plot'), panel = document.getElementById('panel');
function curId(){return state.view[state.topic];}
function cur(){return V[curId()];}

/* =====================================================================
   SVG TOOLKIT
   ===================================================================== */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function fmt(s){
  var out='', down=false;
  String(s).split(/(_[A-Za-z0-9]+)/).forEach(function(part){
    if(!part) return;
    if(part.charAt(0)==='_'){ out+='<tspan class="sub" dy="'+(down?0:4)+'">'+esc(part.slice(1))+'</tspan>'; down=true; }
    else { out+= down ? '<tspan dy="-4">'+esc(part)+'</tspan>' : esc(part); down=false; }
  });
  return out;
}
function ease(t){return t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;}
function r1(n){return Math.round(n*10)/10;}

/* kit() draws one diagram filling the sheet. kit({n:3,i:0,...}) draws panel i of n
   side by side: same price scale in every panel, each with its own output scale. */
function kit(o){
  o=o||{};
  var g={}, n=o.n||1, multi=n>1;
  g.W = Math.max(300, Math.min(760, plot.clientWidth || 640));
  g.H = multi ? Math.round(Math.max(300, Math.min(470, g.W*0.62))) : Math.round(Math.max(340, Math.min(560, g.W*0.8)));
  g.small = g.W < 480;
  g.fs = multi ? (g.small?12:15) : (g.small ? 14 : 16.5);
  var cell=g.W/n, x0=(o.i||0)*cell;
  var ml = multi ? (g.small?28:44) : (g.small?52:66), mr = multi ? (g.small?7:14) : (g.small?10:18);
  var mg = g.mg = {l:x0+ml, r:mr, t:multi?52:36, b:g.small?42:46};
  g.pw = cell-ml-mr; g.ph = g.H-mg.t-mg.b;
  var qmax = o.qmax||QMAX, pmax = o.pmax||PMAX, pmin = o.pmin||0;   /* pmin < 0 leaves room for MR below the axis */
  g.pmin=pmin;
  g.X=function(q){return mg.l+q/qmax*g.pw;};
  g.Y=function(p){return mg.t+(1-(p-pmin)/(pmax-pmin))*g.ph;};
  g.path=function(fn,q0,q1){
    var d='',n=90;
    for(var i=0;i<=n;i++){var q=q0+(q1-q0)*i/n; d+=(i?'L':'M')+r1(g.X(q))+' '+r1(g.Y(fn(q)));}
    return d;
  };
  g.txt=function(x,y,s,cls,anchor){
    return '<text x="'+r1(x)+'" y="'+r1(y)+'" class="'+(cls||'')+'" text-anchor="'+(anchor||'start')+'" font-size="'+g.fs+'">'+fmt(s)+'</text>';
  };
  g.txt2=function(x,y,a,b,cls,anchor){return g.txt(x,y,a,cls,anchor)+g.txt(x,y+g.fs*1.15,b,cls,anchor);};
  g.guide=function(q,p,cls){return '<path class="guide '+(cls||'')+'" d="M'+r1(g.X(0))+' '+r1(g.Y(p))+'H'+r1(g.X(q))+'V'+r1(g.Y(0))+'"/>';};
  g.hline=function(q,p,cls){return '<path class="guide '+(cls||'')+'" d="M'+r1(g.X(0))+' '+r1(g.Y(p))+'H'+r1(g.X(q))+'"/>';};
  g.vline=function(q,p,cls){return '<path class="guide '+(cls||'')+'" d="M'+r1(g.X(q))+' '+r1(g.Y(p))+'V'+r1(g.Y(0))+'"/>';};
  g.dot=function(q,p,cls){return '<circle class="dot '+(cls||'')+'" cx="'+r1(g.X(q))+'" cy="'+r1(g.Y(p))+'" r="'+(g.small?4:4.6)+'"/>';};
  g.box=function(q0,q1,p0,p1,cls){
    return '<rect class="'+cls+'" x="'+r1(g.X(q0))+'" y="'+r1(g.Y(p1))+'" width="'+r1(g.X(q1)-g.X(q0))+'" height="'+r1(Math.max(0,g.Y(p0)-g.Y(p1)))+'"/>';
  };
  g.axP=function(py,s,cls){return g.txt(mg.l-8,py+5,s,'bold '+(cls||''),'end');};
  g.axQ=function(px,s,cls){return g.txt(px,g.Y(0)+g.fs+5,s,'bold '+(cls||''),'middle');};
  /* a hand note with a line pointing at (tq,tp); text centred at (q,p) */
  g.leader=function(lines,q,p,tq,tp,cls){
    var x=g.X(q), y=g.Y(p), lh=g.fs*1.15, out='', i;
    for(i=0;i<lines.length;i++) out+=g.txt(x,y+i*lh,lines[i],'bold halo '+(cls||''),'middle');
    var tx=g.X(tq), ty=g.Y(tp);
    var sy = ty>y ? y+(lines.length-1)*lh+7 : y-g.fs-2;
    var dx=tx-x, dy=ty-sy, len=Math.sqrt(dx*dx+dy*dy)||1, cut=8;
    var ex=tx-dx/len*cut, ey=ty-dy/len*cut;
    return '<path class="leader '+(cls==='t-eff'?'eff':'')+'" d="M'+r1(x)+' '+r1(sy)+'L'+r1(ex)+' '+r1(ey)+'"/>'+out;
  };
  g.grid=function(){
    var cols=multi?10:24, s='', step=g.pw/cols, i, rows=Math.round(g.ph/step);
    for(i=1;i<cols;i++) s+='<line class="gridline" x1="'+r1(mg.l+i*step)+'" x2="'+r1(mg.l+i*step)+'" y1="'+mg.t+'" y2="'+r1(g.Y(0))+'"/>';
    for(i=1;i<rows;i++) s+='<line class="gridline" y1="'+r1(g.Y(0)-i*step)+'" y2="'+r1(g.Y(0)-i*step)+'" x1="'+mg.l+'" x2="'+r1(mg.l+g.pw)+'"/>';
    return s;
  };
  g.axes=function(){
    var y0=g.Y(0), xe=mg.l+g.pw, ts=g.small?12:13;
    return '<path class="axis" d="M'+mg.l+' '+(mg.t-8)+'V'+r1(pmin<0?g.Y(pmin):y0)+'M'+mg.l+' '+r1(y0)+'H'+r1(xe+4)+'"/>'
      + '<path class="axis" d="M'+(mg.l-5)+' '+(mg.t-1)+'L'+mg.l+' '+(mg.t-9)+'L'+(mg.l+5)+' '+(mg.t-1)+'"/>'
      + '<path class="axis" d="M'+r1(xe-3)+' '+r1(y0-5)+'L'+r1(xe+5)+' '+r1(y0)+'L'+r1(xe-3)+' '+r1(y0+5)+'"/>'
      + (o.head ? '<text class="panel-head" x="'+r1(mg.l-(g.small?16:24))+'" y="19" font-size="'+(g.small?12.5:15)+'">'+esc(o.head)+'</text>' : '')
      + '<text class="axis-title" x="'+r1(mg.l+(multi?9:12))+'" y="'+(mg.t-14)+'" font-size="'+(multi&&g.small?11:ts)+'">'+esc(o.ytitle||'Costs / revenue')+'</text>'
      + '<text class="axis-title" x="'+r1(xe)+'" y="'+(g.H-8)+'" text-anchor="end" font-size="'+(multi&&g.small?11:ts)+'">'+esc(o.xtitle||'Output')+'</text>'
      + g.txt(mg.l-9, y0+g.fs+3, 'O', 'bold', 'end');
  };
  /* MC and AC, with the faded originals and numbered labels when they shift */
  g.costs=function(base,now,shift){
    var c='', l='', rb=rangeMC(base), rn=rangeMC(now), ab=rangeAC(base), an=rangeAC(now);
    var mcMoves = shift && (shift.dx||shift.dy);
    if(shift){
      if(mcMoves) c+='<path class="curve c-mc ghost" d="'+g.path(function(q){return MC(base,q);},rb[0],rb[1])+'"/>';
      c+='<path class="curve c-ac ghost" d="'+g.path(function(q){return AC(base,q);},ab[0],ab[1])+'"/>';
    }
    c+='<path class="curve c-mc" d="'+g.path(function(q){return MC(now,q);},rn[0],rn[1])+'"/>';
    c+='<path class="curve c-ac" d="'+g.path(function(q){return AC(now,q);},an[0],an[1])+'"/>';
    function mcLab(m,r,name,left){
      return g.txt(g.X(r[1])+(left?-9:9), g.Y(MC(m,r[1]))+13, name, 'bold t-mc halo', left?'end':'start');
    }
    if(mcMoves){
      var nowLeft = shift.dx>0;
      l+=mcLab(base,rb,'MC_1',!nowLeft)+mcLab(now,rn,'MC_2',nowLeft);
    } else l+=mcLab(now,rn,'MC',true);
    if(shift){
      /* decide label sides from where the shift ENDS, so labels never swap sides mid-animation */
      var fin = moved(base,shift,1), af = rangeAC(fin), finEnd = AC(fin,af[1]);
      var above = finEnd >= AC(base,ab[1]);
      l+=g.txt(g.X(ab[1]), g.Y(AC(base,ab[1]))+(above?g.fs+5:-9), 'AC_1', 'bold t-ac halo', 'end');
      var clipped = finEnd > 90 && (finEnd - AC(base,ab[1])) > 12;   /* curve ends near the top: tuck the label underneath */
      l+=g.txt(g.X(an[1])-(clipped?2:0), g.Y(AC(now,an[1]))+((above&&!clipped)?-9:g.fs+(clipped?10:5)), 'AC_2', 'bold t-ac halo', 'end');
    } else l+=g.txt(g.X(an[1]), g.Y(AC(now,an[1]))-9, 'AC', 'bold t-ac halo', 'end');
    return {curves:c, labels:l};
  };
  g.compose=function(areas,curves,guides,labels,notes){
    var f = state.fade ? ' class="fade"' : '';
    return g.grid() + '<g'+f+'>'+areas+'</g>' + curves + (o.axes===false?'':g.axes()) + '<g'+f+'>'+guides+'</g>' + labels + '<g'+f+'>'+notes+'</g>';
  };
  g.out=function(areas,curves,guides,labels,notes){ wrapSvg(g, g.compose(areas,curves,guides,labels,notes)); };
  return g;
}
/* MR carries on below the quantity axis (version 25): past MR = 0, selling more lowers total revenue */
var MR_FLOOR=-12, MR_END=-8;
function mrQ(a,b,cap){ return Math.min(cap||116,(a-MR_END)/(2*b)); }
function wrapSvg(g, inner){
  plot.innerHTML = '<svg viewBox="0 0 '+g.W+' '+g.H+'" width="'+g.W+'" height="'+g.H+'" aria-hidden="true">'+inner+'</svg>';
  state.fade=false;
}
function spread(a,b,minGap){
  var d=b-a; if(Math.abs(d)>=minGap) return [a,b];
  var push=(minGap-Math.abs(d))/2, sgn=d>=0?1:-1;
  return [a-sgn*push, b+sgn*push];
}

/* =====================================================================
   MONOPOLY DIAGRAM
   ===================================================================== */
function renderMono(){
  var g=kit({pmin:MR_FLOOR}), X=g.X, Y=g.Y, fs=g.fs, id=curId(), v=V[id], shift=v.shift;
  var te = shift ? ease(state.t) : 0;
  var tm = (v.anim && !shift) ? ease(state.t) : 1;   /* slides away from profit max (revenue, sales, P = MC) */
  var now = shift ? moved(MONO,shift,te) : MONO;
  var s0=solveMono(MONO), s1 = shift ? solveMono(now) : s0;
  var areas='', guides='', notes='';
  var nx = g.small ? 41 : 52;   /* where hand notes sit: the empty top-middle of the sheet (left of MC's label on a phone) */

  /* MR runs on below the axis, but stops short of a quantity label just past MR = 0 (Q2 on the efficiency views, MES) */
  var mrStop = mrQ(MONO.a,MONO.b);
  if(id==='alloc' || id==='dwl') mrStop = Math.min(mrStop, s0.qa-3.5);
  if(id==='salesmax' || id==='ob_all') mrStop = Math.min(mrStop, s0.qs-3.5);
  if(id==='prod') mrStop = Math.min(mrStop, bisect(function(q){return MC(MONO,q)-AC(MONO,q);},20,110)-3.5);
  mrStop = Math.max(mrStop, s0.qr+1);
  var curves = '<path class="curve c-ar" d="'+g.path(mAR,0,MONO.a/MONO.b)+'"/>'
             + '<path class="curve c-mr" d="'+g.path(mMR,0,mrStop)+'"/>';
  var cc = g.costs(MONO,now,shift);
  curves += cc.curves;
  var labels = cc.labels;
  labels += g.txt(X(117), Y(mAR(104))-12, g.small?'AR':'AR = D', 'bold t-ar halo', 'end');
  labels += g.txt(X(37)-8, Y(35), 'MR', 'bold t-mr halo', 'end');

  var xm=X(s0.qm), ypm=Y(s0.pm);
  function mutedPM(){
    guides += g.guide(s0.qm,s0.pm,'muted') + g.dot(s0.qm,s0.pm,'muted');
    notes += g.axP(ypm,'P_1','t-muted') + g.axQ(xm,'Q_1','t-muted');
  }
  function mainPM(){
    guides += g.guide(s0.qm,s0.pm) + g.dot(s0.qm,s0.mcm) + g.dot(s0.qm,s0.pm);
    notes += g.axP(ypm,'P_1') + g.axQ(xm,'Q_1');
  }
  var midX = X(s0.qm/2);

  if(id==='profitmax'){
    mainPM();
    notes += g.txt(xm+16, Y(s0.mcm)+5, 'MR = MC', 'halo');
    notes += g.leader(['read the price','off AR'], nx, 97, s0.qm, s0.pm);
  }
  else if(id==='profit' || id==='srlr'){
    areas += g.box(0,s0.qm,s0.cm,s0.pm,'area a-profit');
    mainPM();
    guides += g.hline(s0.qm,s0.cm) + g.dot(s0.qm,s0.cm);
    notes += g.axP(Y(s0.cm),'C');
    notes += g.txt2(midX, (ypm+Y(s0.cm))/2 - fs*0.2, 'supernormal', 'profit', 'bold', 'middle');
    if(id==='srlr') notes += g.leader(['stays in the','long run'], nx+3, 97, s0.qm-5, s0.pm-4);
  }
  else if(id==='trtc'){
    areas += g.box(0,s0.qm,0,s0.cm,'area a-cost') + g.box(0,s0.qm,s0.cm,s0.pm,'area a-profit');
    guides += g.guide(s0.qm,s0.pm) + g.hline(s0.qm,s0.cm) + g.dot(s0.qm,s0.pm) + g.dot(s0.qm,s0.cm);
    notes += g.axP(ypm,'P_1') + g.axQ(xm,'Q_1') + g.axP(Y(s0.cm),'C');
    notes += g.txt(midX, (ypm+Y(s0.cm))/2+5, 'profit', 'bold', 'middle');
    notes += g.txt(X(s0.qm*0.36), Y(s0.cm*0.45), 'total cost', 'bold', 'middle');
    notes += g.leader(['total revenue','= both boxes'], g.small?nx-4:nx-2, 97, s0.qm, s0.pm);   /* clear of the MC label at about 1024px */
  }
  else if((id==='revmax' || id==='salesmax' || id==='alloc') && tm<0.999){
    mutedPM();
    var tq = id==='revmax' ? s0.qr : (id==='salesmax' ? s0.qs : s0.qa), qn = s0.qm+(tq-s0.qm)*tm, pn = mAR(qn);
    guides += g.guide(qn,pn,'eff') + g.dot(qn,pn,'eff');
    if(id==='alloc') guides += g.dot(s0.qm,s0.mcm,'muted');
  }
  else if(id==='revmax'){
    mutedPM();
    guides += g.guide(s0.qr,s0.pr) + g.dot(s0.qr,s0.pr) + g.dot(s0.qr,0);
    notes += g.axP(Y(s0.pr),'P_2') + g.axQ(X(s0.qr)-9,'Q_2');   /* left of the MR = 0 crossing, clear of MR below the axis */
    notes += g.txt(X(s0.qr)+10, Y(0)-10, 'MR = 0', 'halo');
  }
  else if(id==='salesmax'){
    mutedPM();
    guides += g.guide(s0.qs,s0.ps) + g.dot(s0.qs,s0.ps);
    notes += g.axP(Y(s0.ps),'P_3') + g.axQ(X(s0.qs),'Q_3');
    notes += g.leader(['AR = AC'], g.small?86:80, 14, s0.qs, s0.ps);
  }
  else if(id==='alloc'){
    mutedPM();
    guides += g.dot(s0.qm,s0.mcm,'muted');
    guides += g.guide(s0.qa,s0.pa,'eff') + g.dot(s0.qa,s0.pa,'eff');
    notes += g.axP(Y(s0.pa),'P_2','t-eff') + g.axQ(X(s0.qa),'Q_2','t-eff');
    notes += g.leader(['P = MC'], nx, 93, s0.qa, s0.pa, 't-eff');
  }
  else if(id==='prod'){
    guides += g.vline(s0.qm,s0.cm,'muted') + g.hline(s0.qm,s0.cm) + g.dot(s0.qm,s0.cm);
    guides += g.hline(s0.qe,s0.ce,'eff') + g.vline(s0.qe,s0.ce,'eff') + g.dot(s0.qe,s0.ce,'eff');
    var cy = spread(Y(s0.cm), Y(s0.ce), fs+9);
    notes += g.axP(cy[0],'C_1') + g.axP(cy[1],'C_min','t-eff');
    var qx = spread(xm, X(s0.qe), fs*2.4);
    notes += g.axQ(qx[0],'Q_1','t-muted') + g.axQ(qx[1],'MES','t-eff');
    notes += g.txt(X(s0.qe)+9, Y(s0.ce)+fs+6, 'lowest AC', 't-eff bold halo');
  }
  else if(id==='dwl'){
    var d='', n=30, k, q;
    for(k=0;k<=n;k++){q=s0.qm+(s0.qa-s0.qm)*k/n; d+=(k?'L':'M')+r1(X(q))+' '+r1(Y(mAR(q)));}
    for(k=n;k>=0;k--){q=s0.qm+(s0.qa-s0.qm)*k/n; d+='L'+r1(X(q))+' '+r1(Y(MC(MONO,q)));}
    areas += '<path class="area a-dwl" d="'+d+'Z"/>';
    mainPM();
    guides += g.guide(s0.qa,s0.pa,'eff') + g.dot(s0.qa,s0.pa,'eff');
    notes += g.axP(Y(s0.pa),'P_2','t-eff') + g.axQ(X(s0.qa),'Q_2','t-eff');
    notes += g.leader(['deadweight','loss'], nx, 99, s0.qm+(s0.qa-s0.qm)*0.34, (s0.pm+s0.mcm+s0.pa)/3+2);
  }
  else if(id==='ob_all'){
    /* profit max, then slide down AR to revenue max, then on to sales max */
    var tt = v.anim ? state.t : 1, r2 = tt>=0.5, r3 = tt>=1;
    guides += g.guide(s0.qm,s0.pm) + g.dot(s0.qm,s0.mcm) + g.dot(s0.qm,s0.pm);
    var pys = spreadN([ypm,Y(s0.pr),Y(s0.ps)], fs+7), qxs = spreadN([xm,X(s0.qr),X(s0.qs)], fs*1.7);
    notes += g.axP(pys[0],'P_1') + g.axQ(qxs[0],'Q_1') + g.txt(xm-10, Y(s0.mcm)+5, 'MR = MC', 'halo t-mc bold', 'end');   /* left of the point: Q_2's guide runs just to its right */
    if(r2){ guides += g.guide(s0.qr,s0.pr) + g.dot(s0.qr,s0.pr) + g.dot(s0.qr,0); notes += g.axP(pys[1],'P_2') + g.axQ(qxs[1]-9,'Q_2') + g.txt(X(s0.qr)+8, Y(0)-10, 'MR = 0', 'halo t-mr bold'); }
    if(r3){ guides += g.guide(s0.qs,s0.ps) + g.dot(s0.qs,s0.ps); notes += g.axP(pys[2],'P_3') + g.axQ(qxs[2],'Q_3') + g.leader(['AR = AC'], g.small?88:82, 16, s0.qs, s0.ps, ''); }
    if(!r3){ var a2 = !r2 ? ease(tt/0.5) : ease((tt-0.5)/0.5), qa0 = !r2 ? s0.qm : s0.qr, qa1 = !r2 ? s0.qr : s0.qs, qz = qa0+(qa1-qa0)*a2; guides += g.dot(qz,mAR(qz),'eff'); }
  }
  else if(shift){
    areas += g.box(0,s0.qm,s0.cm,s0.pm,'outline') + g.box(0,s1.qm,s1.cm,s1.pm,'area a-profit');
    guides += g.guide(s0.qm,s0.pm,'muted') + g.dot(s0.qm,s0.mcm,'muted') + g.dot(s0.qm,s0.pm,'muted');
    if(!(shift.dx||shift.dy)){
      guides += g.hline(s1.qm,s1.cm) + g.dot(s1.qm,s1.cm);
      notes += g.axP(ypm,'P_1') + g.axQ(xm,'Q_1');
    } else {
      guides += g.guide(s1.qm,s1.pm) + g.dot(s1.qm,s1.mcm) + g.dot(s1.qm,s1.pm);
      var py=spread(ypm,Y(s1.pm),fs+9), qq=spread(xm,X(s1.qm),fs*1.6);
      notes += g.axP(py[0],'P_1','t-muted') + g.axQ(qq[0],'Q_1','t-muted') + g.axP(py[1],'P_2') + g.axQ(qq[1],'Q_2');
    }
    var bh=Y(s1.cm)-Y(s1.pm);
    if(bh>fs+6) notes += g.txt(X(s1.qm/2), Y(s1.pm)+bh/2+5, 'new profit', 'bold', 'middle');
  }
  g.out(areas,curves,guides,labels,notes);
}

/* =====================================================================
   MONOPOLY AGAINST PERFECT COMPETITION (constant costs, lettered points)
   ===================================================================== */
function renderVs(){
  var g=kit({pmin:MR_FLOOR}), X=g.X, Y=g.Y, fs=g.fs, id=curId();
  var a=100, b=0.8, mc=36, qm=(a-mc)/(2*b), pm=a-b*qm, qpc=(a-mc)/b, pd=(id==='vs_pd');
  /* first degree: MR swings up onto AR as the firm learns to charge each buyer their own price */
  var tp=(pd && V[id].anim) ? ease(state.t) : 1, mrEnd=Math.min(112, a/((2-tp)*b));
  function ar(q){return a-b*q;}
  function mr(q){return a-2*b*q;}
  function poly(pts,cls){
    return '<path class="'+cls+'" d="M'+pts.map(function(p){return r1(X(p[0]))+' '+r1(Y(p[1]));}).join('L')+'Z"/>';
  }
  function letter(q,p,s,dx,dy){return g.txt(X(q)+dx, Y(p)+dy, s, 'bold halo');}
  var areas='', guides='', notes='';
  var curves = '<path class="curve c-ar" d="'+g.path(ar,0,112)+'"/>'
    + (pd ? '<path class="curve c-mr'+(tp>0.98?' ghost':'')+'" d="M'+r1(X(0))+' '+r1(Y(a))+'L'+r1(X(mrEnd))+' '+r1(Y(a-(2-tp)*b*mrEnd))+'"/>'
          : '<path class="curve c-mr" d="'+g.path(mr,0,mrQ(a,b,112))+'"/>')
    + '<path class="curve c-mc" d="M'+r1(X(0))+' '+r1(Y(mc))+'H'+r1(X(116))+'"/>';
  var labels = g.txt(X(118), Y(ar(100))-12, pd?(tp>0.98?'AR = MR':'AR'):(g.small?'AR':'AR = D'), 'bold t-ar halo', 'end')
    + g.txt(X(116), Y(mc)-9, 'MC = AC', 'bold t-mc halo', 'end');
  if(!pd) labels += g.txt(X(a/(2*b))+6, Y(2.5), 'MR', 'bold t-mr halo');   /* just right of where MR cuts the axis, clear of the line */

  var AE = letter(0,a,'A',9,-3) + letter(qpc,mc,'E',8,-9);
  var BC = letter(qm,pm,'B',8,-9) + letter(qm,mc,'C',-17,fs+3);
  var pcGuide = g.guide(qpc,mc,'eff') + g.dot(qpc,mc,'eff');
  var pcAxis = g.axP(Y(mc),'P_PC','t-eff') + g.axQ(X(qpc),'Q_PC','t-eff');
  var mGuide = g.guide(qm,pm) + g.dot(qm,pm) + g.dot(qm,mc);
  var mAxis = g.axP(Y(pm),'P_M') + g.axQ(X(qm),'Q_M');

  if(id==='vs_pc'){
    areas += poly([[0,a],[qpc,mc],[0,mc]],'area a-cs');
    guides += pcGuide; notes += pcAxis + AE;
    notes += g.small ? g.txt2(X(15), Y(45), 'consumer', 'surplus', 'bold', 'middle') : g.txt2(X(48), Y(48), 'consumer', 'surplus', 'bold', 'middle');
  }
  else if(id==='vs_mono' && V[id].anim && state.t<0.999){
    /* one firm takes over: price climbs up AR from E to B, consumer surplus shrinks, profit and the loss appear */
    var tv=ease(state.t), qv=qpc+(qm-qpc)*tv, pv=ar(qv);
    areas += poly([[0,a],[qv,pv],[0,pv]],'area a-cs');
    if(tv>0.02) areas += g.box(0,qv,mc,pv,'area a-profit') + poly([[qv,pv],[qv,mc],[qpc,mc]],'area a-dwl');
    guides += pcGuide + g.guide(qv,pv) + g.dot(qv,pv); notes += pcAxis + AE;
  }
  else if(id==='vs_mono'){
    areas += poly([[0,a],[qm,pm],[0,pm]],'area a-cs') + g.box(0,qm,mc,pm,'area a-profit') + poly([[qm,pm],[qm,mc],[qpc,mc]],'area a-dwl');
    guides += pcGuide + mGuide; notes += pcAxis + mAxis + AE + BC;
    notes += g.txt(X(22), Y(72), 'CS', 'bold', 'middle') + g.txt(X(13), Y(49), 'profit', 'bold', 'middle') + g.txt(X(52), Y(44), 'DWL', 'bold', 'middle');
  }
  else if(id==='vs_dwl'){
    areas += g.box(0,qm,mc,pm,'outline') + poly([[qm,pm],[qm,mc],[qpc,mc]],'area a-dwl');
    guides += pcGuide + mGuide; notes += pcAxis + mAxis + AE + BC;
    notes += g.txt(X(13), Y(49), 'transfer', 'bold', 'middle');
    notes += g.leader(['deadweight','loss'], 70, 84, 52, 46);
  }
  else if(pd && tp<0.999){
    /* the single-price profit box stretches into the whole triangle; consumer surplus shrinks to nothing */
    var qd=(a-mc)/((2-tp)*b), topY=pm+(a-pm)*tp;
    areas += poly([[0,a],[qd,ar(qd)],[0,topY]],'area a-cs') + poly([[0,topY],[qd,ar(qd)],[qd,mc],[0,mc]],'area a-profit');
    guides += g.guide(qd,ar(qd)) + g.dot(qd,ar(qd)) + g.dot(qd,mc); notes += g.axP(Y(mc),'P_PC','t-eff');
  }
  else if(pd){
    areas += poly([[0,a],[qpc,mc],[0,mc]],'area a-profit');
    guides += pcGuide; notes += pcAxis + AE;
    notes += g.txt2(X(46), Y(48), 'all supernormal', 'profit', 'bold', 'middle');
  }
  g.out(areas,curves,guides,labels,notes);
}

/* =====================================================================
   NATURAL MONOPOLY (AC and MC both falling, MC underneath)
   Total cost = F + c q + A sqrt(q), so MC = c + A/(2 sqrt q) and
   AC = F/q + c + A/sqrt q. AC is above MC at every output.
   ===================================================================== */
function renderNat(){
  var g=kit({pmin:MR_FLOOR}), X=g.X, Y=g.Y, fs=g.fs, id=curId();
  var a=100, b=0.9, c=6, A=120, F=600;
  function ar(q){return a-b*q;}
  function mr(q){return a-2*b*q;}
  function mc(q){return c+A/(2*Math.sqrt(q));}
  function ac(q){return F/q+c+A/Math.sqrt(q);}
  var qm=bisect(function(q){return mr(q)-mc(q);},10,55), pm=ar(qm), cm=ac(qm);
  var qr=bisect(function(q){return ar(q)-mc(q);},60,110), pr=ar(qr), cr=ac(qr);
  var acStart=bisect(function(q){return ac(q)-PTOP;},5,30);
  var areas='', guides='', notes='';
  var curves='<path class="curve c-ar" d="'+g.path(ar,0,108)+'"/>'
    + '<path class="curve c-mr" d="'+g.path(mr,0,mrQ(a,b))+'"/>'
    + '<path class="curve c-mc" d="'+g.path(mc,5,116)+'"/>'
    + '<path class="curve c-ac" d="'+g.path(ac,acStart,116)+'"/>';
  var labels=g.txt(X(70)+7,Y(ar(70))-7,g.small?'AR':'AR = D','bold t-ar halo')
    + g.txt(X(a/(2*b))+6,Y(2.5),'MR','bold t-mr halo')
    + g.txt(X(116),Y(ac(116))-8,'AC','bold t-ac halo','end')
    + g.txt(X(116),Y(mc(116))+fs+2,'MC','bold t-mc halo','end');

  if(id==='nm_base'){
    notes+=g.leader(['AC falls over the','whole market'], g.small?74:76, 84, 62, ac(62));
  }
  else if(id==='nm_profit'){
    areas+=g.box(0,qm,cm,pm,'area a-profit');
    guides+=g.guide(qm,pm)+g.hline(qm,cm)+g.dot(qm,pm)+g.dot(qm,cm)+g.dot(qm,mc(qm));
    notes+=g.axP(Y(pm),'P_1')+g.axP(Y(cm),'C')+g.axQ(X(qm),'Q_1');
    notes+=g.txt2(X(qm/2),(Y(pm)+Y(cm))/2-fs*0.2,'supernormal','profit','bold','middle');
  }
  else if(id==='nm_reg' && V.nm_reg.anim && state.t<0.999){
    var tn=ease(state.t), pn=pm+(pr-pm)*tn, qn=(a-pn)/b, cn=ac(qn);
    areas+=g.box(0,qn,Math.min(pn,cn),Math.max(pn,cn),'area '+(pn>cn?'a-profit':'a-cost'));
    guides+=g.guide(qm,pm,'muted')+g.dot(qm,pm,'muted')+g.guide(qn,pn)+g.dot(qn,pn)+g.hline(qn,cn)+g.dot(qn,cn);
    notes+=g.axP(Y(pm),'P_1','t-muted')+g.axQ(X(qm),'Q_1','t-muted');
  }
  else if(id==='nm_reg'){
    areas+=g.box(0,qr,pr,cr,'area a-cost');
    guides+=g.guide(qm,pm,'muted')+g.dot(qm,pm,'muted');
    guides+=g.hline(qr,pr,'eff')+g.hline(qr,cr)+g.vline(qr,cr,'eff')+g.dot(qr,pr,'eff')+g.dot(qr,cr);
    var py=spread(Y(cr),Y(pr),fs+9);
    notes+=g.axP(Y(pm),'P_1','t-muted')+g.axQ(X(qm),'Q_1','t-muted');
    notes+=g.axP(py[0],'C_R')+g.axP(py[1],'P_R','t-eff')+g.axQ(X(qr),'Q_R','t-eff');
    notes+=g.txt(X(67),(Y(pr)+Y(cr))/2+5,'subsidy','bold','middle');
    notes+=g.leader(['P = MC'], g.small?92:90, 62, qr, pr, 't-eff');
  }
  g.out(areas,curves,guides,labels,notes);
}

/* =====================================================================
   THIRD DEGREE PRICE DISCRIMINATION (three panels, shared price axis)
   Whole-market demand is the horizontal sum of A and B, drawn as one straight
   line. With both markets served that is the exact sum, so Q1 = QA + QB.
   ===================================================================== */
function renderPD3(){
  var two=(curId()==='pd3'), mc=30, tw=(two && V.pd3.anim) ? ease(state.t) : 1;
  /* version 25: market A is much more inelastic, so its price ends well above market B's (about 67 against 41) */
  var A={a:104,b:1.2}, B={a:52,b:0.35};
  var bW=1/(1/A.b+1/B.b), aW=bW*(A.a/A.b+B.a/B.b), p1=(aW+mc)/2;
  var small=(plot.clientWidth||640)<480;
  var specs=[
    {a:A.a,b:A.b,qmax:100,sub:'A',head:small?'A: inelastic':'Market A: inelastic'},
    {a:B.a,b:B.b,qmax:80,sub:'B',head:small?'B: elastic':'Market B: elastic'},
    {a:aW,b:bW,qmax:130,sub:'1',head:small?'A + B':'Whole market'}
  ];
  var inner='', first=null;
  specs.forEach(function(s,i){
    var g=kit({n:3,i:i,qmax:s.qmax,head:s.head,ytitle:'Price',pmin:MR_FLOOR}), X=g.X, Y=g.Y, fs=g.fs;
    if(!first) first=g;
    function ar(q){return s.a-s.b*q;}
    var arEnd=Math.min(s.qmax,(s.a-3)/s.b), mr0=s.a/(2*s.b), mrEnd=mrQ(s.a,s.b,s.qmax);
    var curves='<path class="curve c-ar" d="M'+r1(X(0))+' '+r1(Y(s.a))+'L'+r1(X(arEnd))+' '+r1(Y(ar(arEnd)))+'"/>'
      + '<path class="curve c-mr" d="M'+r1(X(0))+' '+r1(Y(s.a))+'L'+r1(X(mrEnd))+' '+r1(Y(s.a-2*s.b*mrEnd))+'"/>'
      + '<path class="curve c-mc" d="M'+r1(X(0))+' '+r1(Y(mc))+'H'+r1(X(s.qmax))+'"/>';
    var labels='';
    /* MR runs on below the axis. In A it is labelled just above the axis, right of where it crosses
       (and right of the one-price guide at Q1); in B and the whole market it is labelled under the end of the line */
    function mr(q){return s.a-2*s.b*q;}
    if(i===0){
      labels+=g.txt(X(16)+8,Y(ar(16))+4,'AR','bold t-ar halo')+g.txt(Math.max(X(mr0)+4,X((s.a-p1)/s.b)+5),Y(0)-5,'MR','bold t-mr halo')+g.txt(X(s.qmax),Y(mc)-7,'MC','bold t-mc halo','end');
    } else if(i===1){
      /* all three labels sit at the right-hand ends of their lines, clear of the guides on the left */
      labels+=g.txt(X(s.qmax),Y(ar(s.qmax))+fs+2,'AR','bold t-ar halo','end')+g.txt(X(s.qmax),Y(mr(s.qmax))+fs+2,'MR','bold t-mr halo','end')+g.txt(X(s.qmax),Y(mc)-7,'MC','bold t-mc halo','end');
    } else {
      labels+=g.txt(X(10)+6,Y(ar(10))-7,'AR','bold t-ar halo')+g.txt(X(s.qmax),Y(mr(s.qmax))+fs+2,'MR','bold t-mr halo','end')+g.txt(X(1.2),Y(mc)+fs+2,small?'MC':'MC = AC','bold t-mc halo');
    }
    var qs=(s.a-mc)/(2*s.b), ps=(s.a+mc)/2, q1=(s.a-p1)/s.b;
    var areas='', guides='', notes='';
    if(!two){
      areas+=g.box(0,q1,mc,p1,'area a-profit');
      guides+=g.guide(q1,p1)+g.dot(q1,p1)+(i===2?g.dot(q1,mc):'');
      notes+=g.axP(Y(p1),'P_1')+(i===2?g.axQ(X(q1),'Q_1'):'');
    } else if(i<2 && tw<0.999){
      /* the single price P1 moves up in the inelastic market and down in the elastic one */
      var pw=p1+(ps-p1)*tw, qw=(s.a-pw)/s.b;
      areas+=g.box(0,qw,mc,pw,'area a-profit');
      guides+='<path class="guide muted" d="M'+r1(X(0))+' '+r1(Y(p1))+'H'+r1(X(s.qmax))+'"/>'+g.guide(qw,pw)+g.dot(qw,pw);
      notes+=g.axP(Y(p1),'P_1','t-muted');
    } else if(i<2){
      areas+=g.box(0,qs,mc,ps,'area a-profit');
      guides+='<path class="guide muted" d="M'+r1(X(0))+' '+r1(Y(p1))+'H'+r1(X(s.qmax))+'"/>'+g.guide(qs,ps)+g.dot(qs,ps)+g.dot(qs,mc);
      var py=spread(Y(ps),Y(p1),fs+9);
      notes+=g.axP(py[0],'P_'+s.sub)+g.axP(py[1],'P_1','t-muted')+g.axQ(X(qs),'Q_'+s.sub);
    } else {
      areas+=g.box(0,q1,mc,p1,'outline');
      guides+=g.guide(q1,p1,'muted')+g.dot(q1,p1,'muted')+g.dot(q1,mc,'muted');
      notes+=g.axP(Y(p1),'P_1','t-muted')+g.axQ(X(q1),'Q_1','t-muted');
    }
    inner+=g.compose(areas,curves,guides,labels,notes);
  });
  wrapSvg(first,inner);
}

/* =====================================================================
   PERFECT COMPETITION (industry and firm side by side)
   The industry sets the price; the firm's AR = MR line sits at that price.
   ===================================================================== */
var FIRM = {c:16,k:0.012,q1:40,F:1300,dx:0,dy:0};
function renderPC(){
  var id=curId(), v=V[id], te = v.anim ? ease(state.t) : 0;
  var qLR=bisect(function(q){return MC(FIRM,q)-AC(FIRM,q);},30,110), pLR=AC(FIRM,qLR);
  var p0 = v.lr ? pLR : v.p0, p = v.toLR ? p0+(pLR-p0)*te : p0;
  var slope=0.75;
  function D(Q){return 100-slope*Q;}
  function indQ(pr){return (100-pr)/slope;}
  function firmQ(pr){return bisect(function(q){return MC(FIRM,q)-pr;},27,85);}
  var small=(plot.clientWidth||640)<480;

  /* ---- industry ---- */
  var gi=kit({n:2,i:0,head:'Industry',ytitle:'Price',xtitle:'Quantity'}), X=gi.X, Y=gi.Y, fs=gi.fs;
  function sLine(pr,cls){
    var s0=2*pr-100, qa=Math.max(0,(4-s0)/slope), qb=Math.min(118,(100-s0)/slope);
    return {d:'<path class="curve c-mc'+(cls||'')+'" d="M'+r1(X(qa))+' '+r1(Y(s0+slope*qa))+'L'+r1(X(qb))+' '+r1(Y(s0+slope*qb))+'"/>', q:qb, p:s0+slope*qb};
  }
  var curves='<path class="curve c-ar" d="M'+r1(X(0))+' '+r1(Y(100))+'L'+r1(X(118))+' '+r1(Y(D(118)))+'"/>';
  var labels=gi.txt(X(118),Y(D(118))-9,'D','bold t-ar halo','end');
  var guides='', notes='', areas='';
  var sNow=sLine(p);
  if(v.anim){
    var sOld=sLine(p0,' ghost'); curves+=sOld.d;
    labels+=gi.txt(X(sOld.q)-11,Y(sOld.p)+5,'S_1','bold t-mc halo','end');
    labels+=gi.txt(X(sNow.q)-11,Y(sNow.p)+5,'S_2','bold t-mc halo','end');
    guides+=gi.guide(indQ(p0),p0,'muted')+gi.dot(indQ(p0),p0,'muted')+gi.guide(indQ(p),p)+gi.dot(indQ(p),p);
    var py=spread(Y(p0),Y(p),fs+9), qx=spread(X(indQ(p0)),X(indQ(p)),fs*1.6);
    notes+=gi.axP(py[0],'P_1','t-muted')+gi.axQ(qx[0],'Q_1','t-muted')+gi.axP(py[1],'P_2')+gi.axQ(qx[1],'Q_2');
  } else {
    labels+=gi.txt(X(sNow.q)-11,Y(sNow.p)+5,'S','bold t-mc halo','end');
    guides+=gi.guide(indQ(p),p)+gi.dot(indQ(p),p);
    notes+=gi.axP(Y(p),'P_1')+gi.axQ(X(indQ(p)),'Q_1');
  }
  curves+=sNow.d;
  var inner=gi.compose(areas,curves,guides,labels,notes);

  /* ---- firm ---- */
  var gf=kit({n:2,i:1,head:'Firm',ytitle:'Costs / revenue'}); X=gf.X; Y=gf.Y;
  curves=''; labels=''; guides=''; notes=''; areas='';
  function arLine(pr,cls){return '<path class="curve c-ar'+(cls||'')+'" d="M'+r1(X(0))+' '+r1(Y(pr))+'H'+r1(X(118))+'"/>';}
  function arLabel(pr,name,below){return gf.txt(X(3),Y(pr)+(below?fs+4:-8),name,'bold t-ar halo');}
  if(v.costs){ var cc=gf.costs(FIRM,FIRM,null); curves+=cc.curves; labels+=cc.labels; }
  var q=firmQ(p), q0=firmQ(p0), below0=(p0<pLR-0.5);
  if(v.anim){
    curves+=arLine(p0,' ghost')+arLine(p);
    labels+=arLabel(p0,'AR_1 = MR_1',below0)+arLabel(p,'AR_2 = MR_2',!below0);
    var c0=AC(FIRM,q0), c1=AC(FIRM,q);
    areas+=gf.box(0,q0,Math.min(p0,c0),Math.max(p0,c0),'outline');
    if(Math.abs(p-c1)>0.4) areas+=gf.box(0,q,Math.min(p,c1),Math.max(p,c1),'area '+(p>c1?'a-profit':'a-cost'));
    guides+=gf.vline(q0,p0,'muted')+gf.dot(q0,p0,'muted')+gf.vline(q,p)+gf.dot(q,p);
    var py2=spread(Y(p0),Y(p),fs+9), qx2=spread(X(q0),X(q),fs*1.6);
    notes+=gf.axP(py2[0],'P_1','t-muted')+gf.axQ(qx2[0],'Q_1','t-muted')+gf.axP(py2[1],'P_2')+gf.axQ(qx2[1],'Q_2');
  } else {
    curves+=arLine(p);
    labels+=arLabel(p, v.costs ? 'AR = MR' : 'D = AR = MR', below0 && v.costs);
    notes+=gf.axP(Y(p),'P_1');
    if(v.costs){
      var c=AC(FIRM,q);
      guides+=gf.vline(q,Math.max(p,c))+gf.dot(q,p);
      notes+=gf.axQ(X(q),'Q_1');
      if(Math.abs(p-c)>0.4){
        areas+=gf.box(0,q,Math.min(p,c),Math.max(p,c),'area '+(p>c?'a-profit':'a-cost'));
        guides+=gf.hline(q,c)+gf.dot(q,c);
        notes+=gf.axP(Y(c),'C')+gf.txt(X(q/2),(Y(p)+Y(c))/2+5,p>c?'profit':(gf.small?'loss':'economic loss'),'bold','middle');
      } else {
        notes+=gf.txt(X(q)+9,Y(p)+fs+7,'lowest AC','t-eff bold halo');
      }
    }
  }
  inner+=gf.compose(areas,curves,guides,labels,notes);
  /* carry the price across from the industry to the firm */
  inner+='<path class="guide muted" d="M'+r1(gi.X(indQ(p)))+' '+r1(gi.Y(p))+'H'+r1(gf.X(0))+'"/>';
  wrapSvg(gi,inner);
}

/* =====================================================================
   MONOPOLISTIC COMPETITION (one firm; AR slides until it is tangent to AC)
   The long-run AR line is built from the tangency: it touches AC at qT with
   the same slope, which also guarantees MR = MC at that output.
   ===================================================================== */
function renderMcomp(){
  var g=kit({pmin:MR_FLOOR}), X=g.X, Y=g.Y, fs=g.fs, id=curId(), v=V[id];
  var te = v.anim ? ease(state.t) : 0;
  var qT=44, b=FIRM.F/(qT*qT)-2*FIRM.k*(qT-FIRM.q1), aLR=AC(FIRM,qT)+b*qT;
  var aStart = v.a==='snp' ? aLR+18 : (v.a==='loss' ? aLR-14 : aLR);
  var a = v.anim ? aStart+(aLR-aStart)*te : aStart;
  function sol(A){
    var q=bisect(function(x){return A-2*b*x-MC(FIRM,x);},27,75);
    return {q:q,p:A-b*q,c:AC(FIRM,q),mc:MC(FIRM,q)};
  }
  var curves='', labels='', areas='', guides='', notes='';
  function lines(A,ghost,sfx){
    var arEnd=Math.min(116,(A-3)/b), mrEnd=A/(2*b), gc=ghost?' ghost':'';
    curves+='<path class="curve c-ar'+gc+'" d="M'+r1(X(0))+' '+r1(Y(A))+'L'+r1(X(arEnd))+' '+r1(Y(A-b*arEnd))+'"/>'
          + '<path class="curve c-mr'+gc+'" d="M'+r1(X(0))+' '+r1(Y(A))+'L'+r1(X(mrQ(A,b)))+' '+r1(Y(A-2*b*mrQ(A,b)))+'"/>';
    var arName = sfx ? 'AR'+sfx : (g.small?'AR':'AR = D');
    /* the line is higher to the left of its end, so lift the label clear of it */
    var lift = b * (arName.replace('_','').length*fs*0.56) / (g.pw/QMAX) * (g.ph/PMAX);
    /* one MR: just right of where it cuts the axis. Two MRs (entry, exit): each under the end of its own line,
       because the other line runs through the gap beside the axis crossing. The left line's label is centred
       under its end (hanging it further left would hit the Q labels on phones) and the right line's hangs
       right, so the two stay apart, even while the lines are still together */
    var mrE=mrQ(A,b), leftLine = ghost ? (aStart<aLR) : !(aStart<aLR);
    labels+=g.txt(X(arEnd),Y(A-b*arEnd)-8-lift,arName,'bold t-ar halo','end')
          + (sfx ? g.txt(X(mrE)+(leftLine?0:-4),Y(A-2*b*mrE)+fs+2,'MR'+sfx,'bold t-mr halo',leftLine?'middle':'start')
                 : g.txt(X(mrEnd)+6,Y(2.5),'MR','bold t-mr halo'));
  }
  if(v.anim){ lines(aStart,true,'_1'); lines(a,false,'_2'); } else lines(a,false,'');
  var cc=g.costs(FIRM,FIRM,null); curves+=cc.curves; labels+=cc.labels;

  function boxOf(s,cls){return g.box(0,s.q,Math.min(s.p,s.c),Math.max(s.p,s.c),cls);}
  var s=sol(a), s0=sol(aStart);

  if(v.anim){
    areas+=boxOf(s0,'outline');
    if(Math.abs(s.p-s.c)>0.4) areas+=boxOf(s,'area '+(s.p>s.c?'a-profit':'a-cost'));
    guides+=g.guide(s0.q,s0.p,'muted')+g.dot(s0.q,s0.p,'muted')+g.dot(s0.q,s0.mc,'muted');
    guides+=g.guide(s.q,s.p)+g.dot(s.q,s.p)+g.dot(s.q,s.mc);
    var py=spread(Y(s0.p),Y(s.p),fs+9), qx=spread(X(s0.q),X(s.q),fs*1.6);
    notes+=g.axP(py[0],'P_1','t-muted')+g.axQ(qx[0],'Q_1','t-muted')+g.axP(py[1],'P_2')+g.axQ(qx[1],'Q_2');
  }
  else if(id==='mc_snp' || id==='mc_loss'){
    var profit=s.p>s.c;
    areas+=boxOf(s,'area '+(profit?'a-profit':'a-cost'));
    guides+=g.vline(s.q,Math.max(s.p,s.c))+g.hline(s.q,s.p)+g.hline(s.q,s.c)+g.dot(s.q,s.p)+g.dot(s.q,s.c)+g.dot(s.q,s.mc);
    notes+=g.axP(Y(s.p),'P_1')+g.axP(Y(s.c),'C')+g.axQ(X(s.q),'Q_1');
    if(profit) notes+=g.txt2(X(s.q/2),(Y(s.p)+Y(s.c))/2-fs*0.2,'supernormal','profit','bold','middle');
    else {
      /* The label goes in the part of the box right of MR, which cuts through it. MR is furthest right at
         the bottom of the text, which is its baseline (none of these words has a descender), so it is
         measured there. "economic loss" on one line if it fits, else on two lines if the box is tall
         enough, else "loss" (a narrow drawing, such as a phone) */
      var vs=Y(0)-Y(1), cw=fs*0.56, xb=X(s.q)-4, top=Y(s.c)+fs*0.75+3;
      var mrX=function(y){ return X((a-(s.c-(y-Y(s.c))/vs))/(2*b))+6; };   /* MR's x at a height on the page, plus a gap */
      var xa1=mrX(top);
      if(xb-xa1>=13*cw) notes+=g.txt((xa1+xb)/2,top,'economic loss','bold','middle');
      else {
        var yB=top+fs*1.1, cx=Math.max(xa1+4*cw, mrX(yB)+2*cw);
        if(yB<=Y(s.p)-3 && cx+4*cw<=xb) notes+=g.txt(cx,top,'economic','bold','middle')+g.txt(cx,yB,'loss','bold','middle');
        else notes+=g.txt(Math.max(mrX(top)+2*cw,(xa1+xb)/2),top,'loss','bold','middle');
      }
    }
  }
  else if(id==='mc_lr'){
    guides+=g.guide(s.q,s.p)+g.dot(s.q,s.p)+g.dot(s.q,s.mc);
    notes+=g.axP(Y(s.p),'P_1')+g.axQ(X(s.q),'Q_1');
    notes+=g.leader(['AR touches AC:','normal profit'], g.small?40:43, 98, s.q, s.p);
  }
  else if(id==='mc_eff'){
    var qe=bisect(function(x){return MC(FIRM,x)-AC(FIRM,x);},30,110), ce=AC(FIRM,qe);
    guides+=g.guide(s.q,s.p,'muted')+g.dot(s.q,s.p)+g.dot(s.q,s.mc,'eff');
    guides+='<line class="gap" x1="'+r1(X(s.q))+'" x2="'+r1(X(s.q))+'" y1="'+r1(Y(s.p)+8)+'" y2="'+r1(Y(s.mc)-8)+'"/>';
    guides+=g.vline(qe,ce,'eff')+g.dot(qe,ce,'eff');
    guides+='<line class="gap" x1="'+r1(X(s.q))+'" x2="'+r1(X(qe))+'" y1="'+r1(Y(0))+'" y2="'+r1(Y(0))+'"/>';
    var qx2=spread(X(s.q),X(qe),fs*2.4);
    notes+=g.axP(Y(s.p),'P_1','t-muted')+g.axQ(qx2[0],'Q_1')+g.axQ(qx2[1],'MES','t-eff');
    notes+=g.txt(X(4),Y(31),'P > MC','t-eff bold halo');
    notes+=g.txt2(X(g.small?90:82),Y(g.small?12:15),'excess','capacity','t-eff bold halo','middle');
  }
  g.out(areas,curves,guides,labels,notes);
}

/* =====================================================================
   CONTESTABLE MARKET (monopoly diagram; price falls until AR = AC)
   AR is placed so that it cuts AC just before the lowest point of AC.
   ===================================================================== */
function renderCont(){
  var g=kit({pmin:MR_FLOOR}), X=g.X, Y=g.Y, fs=g.fs, id=curId(), v=V[id];
  var te = v.anim ? ease(state.t) : 0;
  var a=107.2, b=1.2;
  function ar(q){return a-b*q;}
  function mr(q){return a-2*b*q;}
  var qm=bisect(function(q){return mr(q)-MC(FIRM,q);},27,60), pm=ar(qm), cm=AC(FIRM,qm);
  var qc=bisect(function(q){return ar(q)-AC(FIRM,q);},45,80), pc=ar(qc);
  var areas='', guides='', notes='';
  var curves='<path class="curve c-ar" d="'+g.path(ar,0,(a-3)/b)+'"/>'
    + '<path class="curve c-mr" d="'+g.path(mr,0,mrQ(a,b))+'"/>';
  var cc=g.costs(FIRM,FIRM,null); curves+=cc.curves;
  /* MR is labelled on its left, just above the P_M guide: lower down, MC and the P_C guide are in the way.
     The text's top-right corner is kept clear of the line at every width */
  var pTop=66+fs*0.75/(Y(0)-Y(1));
  var labels=cc.labels + g.txt(X(70)+7,Y(ar(70))-6,g.small?'AR':'AR = D','bold t-ar halo')
    + g.txt(X((a-pTop)/(2*b))-5,Y(66),'MR','bold t-mr halo','end');
  var nx=g.small?38:50;

  if(id==='cm_mono' || id==='cm_hit'){
    areas+=g.box(0,qm,cm,pm,'area a-profit');
    guides+=g.guide(qm,pm)+g.hline(qm,cm)+g.dot(qm,pm)+g.dot(qm,cm)+g.dot(qm,MC(FIRM,qm));
    notes+=g.axP(Y(pm),'P_M')+g.axP(Y(cm),'C')+g.axQ(X(qm),'Q_M');
    if(id==='cm_hit') notes+=g.leader(['profit attracts','hit-and-run entry'], nx, 98, qm*0.62, (pm+cm)/2);
    else if(g.small) notes+=g.txt(X(qm/2),(Y(pm)+Y(cm))/2+5,'profit','bold','middle');
    else notes+=g.txt2(X(qm/2),(Y(pm)+Y(cm))/2-fs*0.2,'supernormal','profit','bold','middle');
  }
  else if(id==='cm_threat'){
    var q=qm+(qc-qm)*te, p=ar(q), c=AC(FIRM,q);
    areas+=g.box(0,qm,cm,pm,'outline');
    if(p-c>0.4) areas+=g.box(0,q,c,p,'area a-profit');
    guides+=g.guide(qm,pm,'muted')+g.dot(qm,pm,'muted')+g.guide(q,p)+g.dot(q,p);
    var py=spread(Y(pm),Y(p),fs+9), qx=spread(X(qm),X(q),fs*1.7);
    notes+=g.axP(py[0],'P_M','t-muted')+g.axQ(qx[0],'Q_M','t-muted')+g.axP(py[1],'P_C')+g.axQ(qx[1],'Q_C');
  }
  else if(id==='cm_eff'){
    var qe=bisect(function(x){return MC(FIRM,x)-AC(FIRM,x);},30,110), ce=AC(FIRM,qe);
    guides+=g.guide(qm,pm,'muted')+g.dot(qm,pm,'muted')+g.guide(qc,pc)+g.dot(qc,pc);
    guides+='<line class="gap" x1="'+r1(X(qm))+'" x2="'+r1(X(qm))+'" y1="'+r1(Y(pm)+7)+'" y2="'+r1(Y(MC(FIRM,qm))-3)+'"/>';
    guides+='<line class="gap" x1="'+r1(X(qc))+'" x2="'+r1(X(qc))+'" y1="'+r1(Y(pc)+7)+'" y2="'+r1(Y(MC(FIRM,qc))-3)+'"/>';
    guides+=g.dot(qe,ce,'eff');
    notes+=g.axP(Y(pm),'P_M','t-muted')+g.axQ(X(qm),'Q_M','t-muted')+g.axP(Y(pc),'P_C')+g.axQ(X(qc),'Q_C');
    notes+=g.leader(['lowest AC'], nx-2, 96, qe, ce, 't-eff');
  }
  g.out(areas,curves,guides,labels,notes);
}

/* =====================================================================
   KINKED DEMAND DIAGRAM
   ===================================================================== */
function renderKink(){
  var g=kit(), X=g.X, Y=g.Y, fs=g.fs, id=curId(), v=V[id], shift=v.shift;
  var te = v.anim ? ease(state.t) : 0;
  var K=KINK, qk=K.qk, pk=K.pk, qEnd=71;
  var showMR = (id==='mrgap'||id==='eqm'||shift), showCost = (id==='eqm'||shift);
  var now = shift ? moved(K,shift,te) : K;
  var areas='', guides='', notes='', labels='';

  var curves = '<path class="curve c-ar" d="M'+r1(X(0))+' '+r1(Y(kAR(0)))+'L'+r1(X(qk))+' '+r1(Y(pk))+'L'+r1(X(qEnd))+' '+r1(Y(kAR(qEnd)))+'"/>';
  labels += g.txt(X(qEnd)+7, Y(kAR(qEnd))+5, 'AR', 'bold t-ar halo');
  if(showMR){
    curves += '<path class="curve c-mr" d="M'+r1(X(0))+' '+r1(Y(kMR1(0)))+'L'+r1(X(qk))+' '+r1(Y(kMR1(qk)))+'"/>'
            + '<path class="curve c-mr mrgap" d="M'+r1(X(qk))+' '+r1(Y(kMR1(qk)))+'V'+r1(Y(0))+'"/>';
    labels += g.txt(X(qk)+8, Y(3), 'MR', 'bold t-mr halo');
  }
  if(showCost){
    var cc=g.costs(K,now,shift); curves+=cc.curves; labels+=cc.labels;
  }

  var xk=X(qk), yk=Y(pk);
  if(id==='kink'){
    guides += g.guide(qk,pk) + g.dot(qk,pk);
    notes += g.axP(yk,'P_1') + g.axQ(xk,'Q_1');
    notes += g.txt(X(22), Y(kAR(22))-13, 'elastic', 'halo', 'middle');
    notes += g.txt(X(63)+10, Y(kAR(63))+5, 'inelastic', 'halo');
    notes += g.leader(['the kink'], g.small?78:72, 88, qk, pk);
  }
  else if(id==='raise' || id==='cut'){
    var q2=qk+(v.move-qk)*te, p2=kAR(q2);
    guides += g.guide(qk,pk,'muted') + g.dot(qk,pk,'muted') + g.guide(q2,p2) + g.dot(q2,p2);
    var py=spread(yk,Y(p2),fs+9), qx=spread(xk,X(q2),fs*1.6);
    notes += g.axP(py[0],'P_1','t-muted') + g.axQ(qx[0],'Q_1','t-muted');
    if(te>0.02) notes += g.axP(py[1],'P_2') + g.axQ(qx[1],'Q_2');
    if(id==='raise'){
      notes += g.txt(X(18), Y(kAR(18))-13, 'elastic', 'halo', 'middle');
      notes += g.txt(X(q2)+9, Y(p2)-11, 'rivals do not follow', 'bold halo');
    } else {
      notes += g.txt(X(64)+12, Y(kAR(64))+5, 'inelastic', 'halo');
      notes += g.txt(X(q2)+12, Y(p2)+5, 'rivals follow', 'bold halo');
    }
  }
  else if(id==='mrgap'){
    guides += g.guide(qk,pk) + g.dot(qk,pk) + g.dot(qk,kMR1(qk));
    notes += g.axP(yk,'P_1') + g.axQ(xk,'Q_1');
    notes += g.txt(xk-11, Y(kMR1(qk)/2)+5, 'gap in MR', 'bold halo', 'end');
  }
  else if(id==='eqm'){
    var s=solveKink(K);
    areas += g.box(0,qk,s.c,pk,'area a-profit');
    guides += g.guide(qk,pk) + g.dot(qk,pk) + g.dot(qk,s.mc) + g.hline(qk,s.c) + g.dot(qk,s.c);
    notes += g.axP(yk,'P_1') + g.axQ(xk,'Q_1') + g.axP(Y(s.c),'C');
    notes += g.txt2(X(qk/2), (yk+Y(s.c))/2 - fs*0.2, 'supernormal', 'profit', 'bold', 'middle');
  }
  else if(shift){
    var s0=solveKink(K), s1=solveKink(now);
    areas += g.box(0,qk,s0.c,pk,'outline') + g.box(0,s1.q,s1.c,s1.p,'area a-profit');
    if(id==='rigid'){
      guides += g.guide(qk,pk) + g.dot(qk,pk) + g.dot(qk,s0.mc,'muted') + g.dot(qk,s1.mc) + g.hline(qk,s1.c) + g.dot(qk,s1.c);
      notes += g.axP(yk,'P_1') + g.axQ(xk,'Q_1');
    } else {
      guides += g.guide(qk,pk,'muted') + g.dot(qk,pk,'muted') + g.dot(qk,s0.mc,'muted');
      guides += g.guide(s1.q,s1.p) + g.dot(s1.q,s1.p) + g.dot(s1.q,s1.mc);
      var py2=spread(yk,Y(s1.p),fs+9), qx2=spread(xk,X(s1.q),fs*1.6);
      notes += g.axP(py2[0],'P_1','t-muted') + g.axQ(qx2[0],'Q_1','t-muted') + g.axP(py2[1],'P_2') + g.axQ(qx2[1],'Q_2');
    }
    var bh=Y(s1.c)-Y(s1.p);
    if(bh>fs+6) notes += g.txt(X(s1.q/2), Y(s1.p)+bh/2+5, 'new profit', 'bold', 'middle');
  }
  g.out(areas,curves,guides,labels,notes);
}

/* =====================================================================
   PAYOFF MATRIX
   ===================================================================== */
var PAY = {HH:[10,10], LH:[15,1], HL:[1,15], LL:[5,5]};   /* key = Firm A's price then Firm B's */
var BEST = {HH:[0,0], LH:[1,0], HL:[0,1], LL:[1,1]};      /* is this profit a best response? [A,B] */
function renderGame(){
  var v=cur(), sel=v.cell;
  if(curId()==='g_cheat') sel = state.cheater==='A' ? 'LH' : 'HL';
  function cell(k){
    var p=PAY[k], b=BEST[k], on=(k===sel);
    return '<td><button type="button" class="cell" id="cell-'+k+'" data-cell="'+k+'" aria-pressed="'+on+'">'
      + '<span class="pay a'+(v.best&&b[0]?' best':'')+'">A £'+p[0]+'m</span>'
      + '<span class="pay b'+(v.best&&b[1]?' best':'')+'">B £'+p[1]+'m</span></button></td>';
  }
  var hint = {g_collude:'Joint profit is highest here, so this is what a cartel aims for.',
              g_cheat:'The firm that undercuts gains. The one that kept its price high loses out.',
              g_dom:'Every circle sits on a low price. Low is the dominant strategy for both firms.',
              g_nash:'Both best responses meet in this box, so neither firm wants to move.'}[curId()];
  panel.innerHTML =
    '<div class="panel-head"><strong>Profit for each firm</strong><div class="key"><span class="fa">Firm A</span><span class="fb">Firm B</span></div></div>'
    + '<table class="game"><thead><tr><th class="rowh"></th><th class="fb"><small>Firm B</small>High price</th><th class="fb"><small>Firm B</small>Low price</th></tr></thead><tbody>'
    + '<tr><th class="rowh fa"><small>Firm A</small>High price</th>'+cell('HH')+cell('HL')+'</tr>'
    + '<tr><th class="rowh fa"><small>Firm A</small>Low price</th>'+cell('LH')+cell('LL')+'</tr>'
    + '</tbody></table><p class="hint">'+hint+'</p>';
}
panel.addEventListener('click', function(e){
  var c = e.target.closest ? e.target.closest('.cell') : null;
  if(c){
    var k=c.dataset.cell;
    if(k==='HH') setView('g_collude');
    else if(k==='LL') setView('g_nash');
    else { state.cheater = (k==='LH') ? 'A' : 'B'; setView('g_cheat'); }
    return;
  }
  var p = e.target.closest ? e.target.closest('[data-preset]') : null;
  if(p){ crState.shares = CR_PRESETS[p.dataset.preset].slice(); crState.preset=p.dataset.preset; renderCR(); return; }
  var n = e.target.closest ? e.target.closest('[data-n]') : null;
  if(n){ crState.n = +n.dataset.n; updateCR(); }
});

/* =====================================================================
   CONCENTRATION RATIO
   ===================================================================== */
var CR_PRESETS = {example:[28,22,15,10,8,5], dominant:[50,10,10,10,6,4], equal:[20,20,20,20,6,4]};
var CR_NAMES = ['Firm A','Firm B','Firm C','Firm D','Firm E','Firm F'];
var crState = {shares:CR_PRESETS.example.slice(), n:4, preset:'example'};
function renderCR(){
  var h='<div class="panel-head"><strong>Market shares, %</strong></div>'
    + '<div class="minis"><span>Try</span>'
    + '<button type="button" class="chip mini" id="pre-example" data-preset="example">Example market</button>'
    + '<button type="button" class="chip mini" id="pre-dominant" data-preset="dominant">One dominant firm</button>'
    + '<button type="button" class="chip mini" id="pre-equal" data-preset="equal">Four equal firms</button></div>'
    + '<div class="cr-rows">';
  for(var i=0;i<6;i++){
    h+='<div class="cr-row" id="crrow-'+i+'"><label for="cr-'+i+'">'+CR_NAMES[i]+'</label>'
      + '<input id="cr-'+i+'" type="number" inputmode="numeric" min="0" max="100" step="1" value="'+crState.shares[i]+'">'
      + '<div class="bar"><i></i></div></div>';
  }
  h+='<div class="cr-row" id="crrow-others"><span class="nm">Others</span><span class="val" id="cr-others"></span><div class="bar"><i></i></div></div></div>'
    + '<div class="minis"><span>Firms counted</span>'
    + '<button type="button" class="chip mini" id="n-3" data-n="3">3</button>'
    + '<button type="button" class="chip mini" id="n-4" data-n="4">4</button>'
    + '<button type="button" class="chip mini" id="n-5" data-n="5">5</button></div>'
    + '<div class="cr-out"><span class="label" id="cr-label"></span><span class="big" id="cr-big"></span><span class="sum" id="cr-sum"></span><span id="cr-verdict"></span></div>';
  panel.innerHTML=h;
  updateCR();
}
function updateCR(){
  var sh=crState.shares, total=0, i;
  for(i=0;i<6;i++) total+=sh[i];
  var others=100-total;
  var order=[0,1,2,3,4,5].sort(function(a,b){return sh[b]-sh[a] || a-b;});
  var top=order.slice(0,crState.n), max=Math.max.apply(null,sh.concat([Math.max(others,0),1]));
  var sum=0, parts=[];
  for(i=0;i<top.length;i++){ sum+=sh[top[i]]; parts.push(sh[top[i]]); }
  for(i=0;i<6;i++){
    var row=document.getElementById('crrow-'+i);
    row.className='cr-row'+(top.indexOf(i)>=0?' top':'');
    row.querySelector('i').style.width=(sh[i]/max*100)+'%';
  }
  document.getElementById('cr-others').textContent = others>=0 ? others+'%' : 'over 100';
  document.querySelector('#crrow-others i').style.width=(Math.max(others,0)/max*100)+'%';
  document.getElementById('cr-label').textContent = crState.n+'-firm concentration ratio';
  document.getElementById('cr-big').textContent = sum+'%';
  document.getElementById('cr-sum').textContent = parts.join(' + ')+' = '+sum+'%';
  document.getElementById('cr-verdict').textContent = others<0
    ? 'These shares add up to more than 100%. Lower one of them.'
    : (sum>=70 ? 'High concentration: this fits an oligopoly.' : 'Below the rough 70% mark: a less concentrated market.');
  var ns=[3,4,5];
  for(i=0;i<3;i++) document.getElementById('n-'+ns[i]).setAttribute('aria-pressed', ns[i]===crState.n?'true':'false');
  ['example','dominant','equal'].forEach(function(k){
    document.getElementById('pre-'+k).setAttribute('aria-pressed', crState.preset===k?'true':'false');
  });
}
panel.addEventListener('input', function(e){
  var m = e.target.id && e.target.id.match(/^cr-(\d)$/);
  if(!m) return;
  var val=Math.round(parseFloat(e.target.value)); if(!(val>=0)) val=0; if(val>100) val=100;
  crState.shares[+m[1]]=val; crState.preset=''; updateCR();
});

/* =====================================================================
   NOTE EXTRAS (version 24). Key terms sit under the lead; three tabs sit
   under the note: a worked example, exam traps, and practice. A note can carry
     terms: [[term, definition], ...]
     work:  {q:'...', table:[[heads...],[cells...]...], steps:['...'], ans:'...'}
     traps: ['...', ...]
     quiz:  [['question','answer'], ...]   (a topic can carry a quiz as well)
   The spec tag comes from the spec index (spec.js). The practice-board and
   past-paper links are added on their own.
   ===================================================================== */
/* note -> its question on the practice board (generated from practice.js) */
var BOARD = {profit:'mono-snp', alloc:'mono-alloc', dwl:'mono-dwl', prod:'mono-prod', costup:'mono-costup', fixed:'mono-fixed', revmax:'revmax', ob_sat:'satisfice', rv_tr:'tr-hill', co_avg:'costs-sr', sc_lrac:'lrac-mes', sc_ext:'ext-eos', pf_shut:'shutdown', pc_snp:'pc-snp', pc_entry:'pc-entry', mc_lr:'mc-lr', mc_entry:'mc-entry', eqm:'kink', rigid:'rigid', nm_reg:'nat-reg', cm_threat:'contest', ef_x:'x-ineff', ef_ppf:'ppf-dyn', br_limit:'limit-eos', tf_areas:'tariff', qt:'quota', sb:'subsidy', bl_create:'create', fx_sup:'fx-dep', fx_fix_buy:'fx-fix', fx_adas:'fx-adas', ca_gain:'ppc', ex_negprod:'ext-negprod', ex_negcons:'ext-negcons', ex_poscons:'ext-poscons', ex_posprod:'ext-posprod', ex_tax:'ext-tax', ev_govfail:'gov-fail', ev_ped:'ped-tax', ad_dpull:'adas-dpull', ad_cpush:'adas-cpush', ev_capacity:'keynes-as', ev_laffer:'laffer', ev_lrpc:'lrpc', ev_kuz_env:'kuznets'};
/* past-paper questions sorted by topic, one page per theme (Expert Tuition files Theme 4 under "unit-3 ... 2") */
var PAPERS = {
  '1':'https://expert-tuition.co.uk/past-papers/a-level-edexcel-economics-unit-1-questions-by-topic/',
  '2':'https://expert-tuition.co.uk/past-papers/a-level-edexcel-economics-unit-2-questions-by-topic/',
  '3':'https://expert-tuition.co.uk/past-papers/a-level-edexcel-economics-unit-3-questions-by-topic/',
  '4':'https://expert-tuition.co.uk/past-papers/a-level-edexcel-economics-unit-3-questions-by-topic-2/'
};
/* note -> the spec points that list it, read from the spec index */
var SPECOF = {};
(function(){
  if(typeof SPEC==='undefined') return;
  SPEC.forEach(function(th){ (th.sections||[]).forEach(function(s){ (s.points||[]).forEach(function(p){ (p.items||[]).forEach(function(it){
    (it[1]||[]).forEach(function(id){ var a=SPECOF[id]||(SPECOF[id]=[]); if(a.indexOf(p.code)<0) a.push(p.code); });
  }); }); }); });
  for(var k in SPECOF) SPECOF[k].sort(function(a,b){ return a.localeCompare(b, undefined, {numeric:true}); });
})();
function themeOf(id){
  if(SPECOF[id]) return SPECOF[id][0].charAt(0);
  var t=topicOf(id), s=t && TOPICS[t].section;
  return s==='micro' ? '3' : s==='macro' ? '4' : null;
}
function workHtml(w){
  var h='';
  if(w.q) h+='<p class="wq">'+w.q+'</p>';
  if(w.table) h+='<div class="wwrap"><table class="wtable">'+w.table.map(function(r,i){
    return '<tr>'+r.map(function(c){ return i ? '<td>'+c+'</td>' : '<th>'+c+'</th>'; }).join('')+'</tr>';
  }).join('')+'</table></div>';
  if(w.steps) h+='<ol class="wsteps">'+w.steps.map(function(s){ return '<li>'+s+'</li>'; }).join('')+'</ol>';
  if(w.ans) h+='<p class="wans"><b>Answer:</b> '+w.ans+'</p>';
  return h;
}
function extrasHtml(v, id){
  var T=TOPICS[state.topic], tabs=[], quiz=(v.quiz||[]).concat((T && T.quiz)||[]), th=themeOf(id), pr='';
  if(v.work) tabs.push(['work','Worked example', workHtml(v.work)]);
  if(v.traps) tabs.push(['traps','Exam traps', '<ul class="traps">'+v.traps.map(function(t){ return '<li>'+t+'</li>'; }).join('')+'</ul>']);
  if(quiz.length) pr+='<p class="label">Answer each one first, in your head or on paper, then tap to check</p><div class="quiz">'
    + quiz.map(function(q){ return '<details><summary>'+q[0]+'</summary><p>'+q[1]+'</p></details>'; }).join('')+'</div>';
  if(BOARD[id]) pr+='<p class="go"><a href="practice.html#q='+BOARD[id]+'">Draw this diagram yourself on the practice board</a></p>';
  if(th && PAPERS[th]) pr+='<p class="go"><a href="'+PAPERS[th]+'" target="_blank" rel="noopener">Past-paper questions for Theme '+th+', sorted by topic (Expert Tuition)</a></p>';
  if(pr) tabs.push(['quiz','Practise', pr]);
  if(!tabs.length) return '';
  var open=null; tabs.forEach(function(t){ if(t[0]===state.xopen) open=t[0]; });
  return '<div class="xtra"><div class="xtabs">'
    + tabs.map(function(t){ return '<button type="button" class="xtab" data-x="'+t[0]+'" aria-expanded="'+(t[0]===open)+'">'+t[1]+'</button>'; }).join('')+'</div>'
    + tabs.map(function(t){ return '<div class="xpanel" data-xp="'+t[0]+'"'+(t[0]===open?'':' hidden')+'>'+t[2]+'</div>'; }).join('')+'</div>';
}

/* =====================================================================
   PAGE WIRING
   ===================================================================== */
function render(){
  var k=cur().kind, svg=!{game:1,cr:1,card:1,cacalc:1,totcalc:1,ml:1,revcalc:1,costcalc:1,pcalc:1,stay:1}[k];
  plot.hidden=!svg; panel.hidden=svg;
  if(k==='mono') renderMono();
  else if(k==='ext') renderExt();
  else if(k==='adas2') renderAD2();
  else if(k==='evc') renderEv();
  else if(k==='chain') renderChain();
  else if(k==='rev') renderRev();
  else if(k==='cost') renderCost();
  else if(k==='lrac') renderLRAC();
  else if(k==='profit') renderProfits();
  else if(k==='sat') renderSat();
  else if(k==='eff') renderEff();
  else if(k==='pred') renderPred();
  else if(k==='revcalc') renderRevCalc();
  else if(k==='costcalc') renderCostCalc();
  else if(k==='pcalc') renderPCalc();
  else if(k==='stay') renderStay();
  else if(k==='vs') renderVs();
  else if(k==='pd3') renderPD3();
  else if(k==='pc') renderPC();
  else if(k==='mcomp') renderMcomp();
  else if(k==='nat') renderNat();
  else if(k==='cont') renderCont();
  else if(k==='trade') renderTrade();
  else if(k==='fx') renderFX();
  else if(k==='adas') renderADAS();
  else if(k==='jcurve') renderJ();
  else if(k==='ppc') renderPPC();
  else if(k==='card') renderCard();
  else if(k==='cacalc') renderCACalc();
  else if(k==='totcalc') renderTot();
  else if(k==='ml') renderML();
  else if(k==='kink') renderKink();
  else if(k==='mkt') renderMkt();
  else if(k==='ppf1') renderPPF1();
  else if(k==='flow') renderFlow();
  else if(k==='cycle') renderCycle();
  else if(k==='rounds') renderRounds();
  else if(k==='game') renderGame();
  else if(k==='cr'){ if(!document.getElementById('cr-0')) renderCR(); else updateCR(); }
}
function renderNotes(){
  var v=cur(), id=curId(), h='', codes=SPECOF[id];
  if(codes) h+='<p class="spec-tag">Spec '+codes.slice(0,3).join(' · ')+'</p>';
  h+='<h3>'+v.title+'</h3><p class="lead">'+v.lead+'</p>';
  if(v.terms) h+='<div class="terms"><p class="label">Key terms</p><dl>'
      + v.terms.map(function(t){return '<div><dt>'+t[0]+'</dt><dd>'+t[1]+'</dd></div>';}).join('')+'</dl></div>';
  if(v.plain) h+='<ul class="plain">'+v.plain.map(function(r){return '<li>'+r[0]+'<span>'+r[1]+'</span></li>';}).join('')+'</ul>';
  if(v.compare) h+='<div><p class="label">'+v.compare.vs+'</p><div class="compare">'
      + v.compare.rows.map(function(r){return '<div><span>'+r[0]+'</span><strong>'+r[1]+'</strong></div>';}).join('')+'</div></div>';
  if(v.chain) h+='<div><p class="label">Chain of analysis</p><ol class="chain">'
      + v.chain.map(function(s){return '<li><span>'+s+'</span></li>';}).join('')+'</ol></div>';
  /* evaluation-section extras: where the idea earns marks, and a sentence to adapt */
  if(v.use) h+='<div><p class="label">Where to use it</p><ul class="plain use">'
      + v.use.map(function(r){return '<li><b>'+r[0]+'</b><span>'+r[1]+'</span></li>';}).join('')+'</ul></div>';
  if(v.evaluation) h+='<div class="eval"><p class="label"><span>Evaluation</span></p><p>'+v.evaluation+'</p></div>';
  if(v.line) h+='<div class="model"><p class="label">Write it like this</p><p>'+v.line+'</p></div>';
  if(v.tip) h+='<p class="tip">'+v.tip+'</p>';
  h+=extrasHtml(v, id);
  document.getElementById('notes').innerHTML=h;
  document.getElementById('showing').textContent=v.showing;
  document.getElementById('replay').hidden=!v.anim;
  var chips=document.querySelectorAll('#controls .chip');
  for(var i=0;i<chips.length;i++) chips[i].setAttribute('aria-pressed', chips[i].dataset.view===curId()?'true':'false');
}
function renderControls(){
  var T=TOPICS[state.topic];
  renderTabs();
  document.getElementById('eyebrow').textContent=T.eyebrow;
  document.getElementById('controls').innerHTML=T.groups.map(function(gr){
    return '<div class="group"><h2>'+gr[0]+'</h2><div class="chips">'
      + gr[1].map(function(id){return '<button type="button" class="chip" id="btn-'+id+'" data-view="'+id+'" aria-pressed="false">'+V[id].btn+'</button>';}).join('')
      + '</div></div>';
  }).join('');
  var tabs=document.querySelectorAll('.tab');
  for(var i=0;i<tabs.length;i++) tabs[i].setAttribute('aria-selected', tabs[i].dataset.topic===state.topic?'true':'false');
  plot.setAttribute('aria-label', T.label+' diagram');
}
function play(){
  cancelAnimationFrame(raf);
  if(!cur().anim || reduceMotion){ state.t=1; render(); return; }
  var start=null, hold=350, dur=cur().dur||(cur().two?2300:1100);
  state.t=0; render();
  function frame(ts){
    if(start===null) start=ts;
    var el=ts-start-hold;
    state.t=Math.max(0,Math.min(1,el/dur));
    render();
    if(el<dur) raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
}
function save(){ if(EMBED) return; try{ localStorage.setItem('tof-state', JSON.stringify({topic:state.topic, view:state.view})); }catch(e){} }
function setView(id){
  state.view[state.topic]=id; state.fade=!V[id].anim;
  renderNotes(); play(); save(); setHash(id);
}
function setTopic(t, fromHash){
  if(!TOPICS[t]) return;
  state.topic=t; state.fade=true;
  renderControls(); renderNotes(); play(); save();
  if(!fromHash) setHash(state.view[t]);
}

document.getElementById('controls').addEventListener('click', function(e){
  var b = e.target.closest ? e.target.closest('.chip') : null;
  if(b) setView(b.dataset.view);
});
document.querySelector('.tabs').addEventListener('click', function(e){
  var b = e.target.closest ? e.target.closest('.tab') : null;
  if(b) setTopic(b.dataset.topic);
});
document.getElementById('replay').addEventListener('click', play);
/* the extras tabs under a note: one open at a time, and it stays open as you move between notes */
document.getElementById('notes').addEventListener('click', function(e){
  var b=e.target.closest ? e.target.closest('.xtab') : null; if(!b) return;
  state.xopen = b.getAttribute('aria-expanded')==='true' ? null : b.getAttribute('data-x');
  var bs=this.querySelectorAll('.xtab'), ps=this.querySelectorAll('.xpanel');
  for(var i=0;i<bs.length;i++) bs[i].setAttribute('aria-expanded', bs[i].getAttribute('data-x')===state.xopen ? 'true' : 'false');
  for(var j=0;j<ps.length;j++) ps[j].hidden = ps[j].getAttribute('data-xp')!==state.xopen;
});
/* ?debug exposes the note data, for the audit scripts */
if(/[?&]debug\b/.test(location.search)) window.__econ={V:V, TOPICS:TOPICS, SECTIONS:SECTIONS, SPECOF:SPECOF,
  fin:function(){ cancelAnimationFrame(raf); state.t=1; render(); },
  /* open one note at its final frame straight away (no hash, no timers), for audits run in background tabs */
  show:function(t,id){ cancelAnimationFrame(raf); state.topic=t; state.view[t]=id; state.fade=false; renderControls(); renderNotes(); state.t=1; render(); }};

function setHash(id){ if(EMBED) return; try{ if(location.hash!=='#'+id) history.replaceState(null,'','#'+id); }catch(e){} }
function topicOf(id){
  for(var t in TOPICS){ var gs=TOPICS[t].groups; for(var i=0;i<gs.length;i++){ if(gs[i][1].indexOf(id)>=0) return t; } }
  return null;
}
/* a hash can name a topic (#monopoly), a section (#macro) or one exact view (#profit) */
function readHash(){
  var h=decodeURIComponent((location.hash||'').slice(1));
  /* old links from before Themes 1 and 2 were built */
  if(h==='y12') h='t1'; else if(h==='adas2') h='agg_d';
  if(TOPICS[h]) return {topic:h, view:null};
  if(SECTIONS[h]) return {topic:state.last[h]||SECTIONS[h].order[0], view:null};
  if(V[h]){ var t=topicOf(h); if(t) return {topic:t, view:h}; }
  return null;
}
window.addEventListener('hashchange', function(){
  var r=readHash(); if(!r) return;
  if(r.view) state.view[r.topic]=r.view;
  if(r.topic!==state.topic || r.view){ state.topic=r.topic; state.fade=true; renderControls(); renderNotes(); play(); save(); }
  var d=document.querySelector('.diagram'); if(d && d.scrollIntoView) d.scrollIntoView({block:'start'});
});

/* ---------- sections (Micro / Macro) and their tabs ---------- */
for(var tk0 in TOPICS){ if(!state.view[tk0]) state.view[tk0]=TOPICS[tk0].first; }
state.last={t1:'nature',t2:'measures',micro:'monopoly',macro:'global',ev:'e_fiscal'};
function renderTabs(){
  var sec=TOPICS[state.topic].section, S=SECTIONS[sec], tabsEl=document.getElementById('tabs');
  state.last[sec]=state.topic;
  function tabBtn(k){
    return '<button class="tab" role="tab" id="tab-'+k+'" data-topic="'+k+'" type="button" aria-selected="'+(k===state.topic)+'">'+TOPICS[k].label+'</button>';
  }
  if(S.groups){
    /* two labelled rows of tabs, each its own tablist */
    tabsEl.className='tabs grouped'; tabsEl.removeAttribute('role');
    tabsEl.innerHTML=S.groups.map(function(gr){
      return '<div class="tabgroup"><span class="tabgroup-h">'+gr[0]+'</span><div class="tabrow" role="tablist" aria-label="'+gr[0]+'">'+gr[1].map(tabBtn).join('')+'</div></div>';
    }).join('');
    /* on a phone the rows scroll sideways: bring the open tab into view */
    var on=document.getElementById('tab-'+state.topic), row=on&&on.parentNode;
    if(row && row.scrollWidth>row.clientWidth && on.offsetLeft+on.offsetWidth>row.clientWidth) row.scrollLeft=on.offsetLeft-12;
  } else {
    tabsEl.className='tabs'; tabsEl.setAttribute('role','tablist');
    tabsEl.innerHTML=S.order.map(tabBtn).join('');
  }
  var sb=document.querySelectorAll('.sec');
  for(var i=0;i<sb.length;i++) sb[i].setAttribute('aria-selected', sb[i].dataset.section===sec?'true':'false');
  document.getElementById('h-topic').textContent=S.heading;
  document.getElementById('lede-scope').textContent=S.scope;
}
document.querySelector('.sections').addEventListener('click', function(e){
  var b = e.target.closest ? e.target.closest('.sec') : null;
  if(b && TOPICS[state.topic].section!==b.dataset.section) setTopic(state.last[b.dataset.section]||SECTIONS[b.dataset.section].order[0]);
});

/* ---------- macro calculators ---------- */
panel.addEventListener('click', function(e){
  var c = e.target.closest ? e.target.closest('[data-ca]') : null;
  if(c){ caState.preset=c.dataset.ca; caState.v=CA_PRESETS[caState.preset].v.map(function(r){return r.slice();}); renderCACalc(); return; }
  var m = e.target.closest ? e.target.closest('[data-ml]') : null;
  if(m){ var p=m.dataset.ml.split(','); mlState.x=+p[0]; mlState.m=+p[1]; renderML(); }
});
panel.addEventListener('input', function(e){
  var id=e.target.id||'', m, val=parseFloat(e.target.value);
  if((m=id.match(/^ca-(\d)-(\d)$/))){ if(val>0){ caState.v[+m[1]][+m[2]]=val; updateCA(); } }
  else if((m=id.match(/^tt-(x1|m1|x2|m2)$/))){ if(val>0){ totState[m[1]]=val; updateTot(); } }
  else if(id==='ml-x' || id==='ml-m'){ mlState[id.slice(3)]=val; updateML(); }
});

/* ---------- theme 3 calculators ---------- */
panel.addEventListener('click', function(e){
  var t=e.target.closest ? e.target : null; if(!t) return;
  var b=t.closest('[data-stay]');
  if(b){ var P=STAY_PRESETS[b.dataset.stay]; stayState={preset:b.dataset.stay,fc:P[0],q:P[1],avc:P[2],p:P[3]}; renderStay(); return; }
  if(t.closest('[data-cc]')){ costState={fc:COST_START.fc,vc:COST_START.vc,q:COST_START.q}; renderCostCalc(); return; }
  if(t.closest('[data-pc]')){ pcState={tr:PC_START.tr,tc:PC_START.tc,oc:PC_START.oc}; renderPCalc(); return; }
  if(t.closest('[data-rv]')){ revState.p=REV_START.slice(); renderRevCalc(); }
});
panel.addEventListener('input', function(e){
  var id=e.target.id||'', m, val=parseFloat(e.target.value);
  if(!(val>=0)) return;   /* ignore blanks and negatives while typing */
  if((m=id.match(/^rv-(\d)$/))){ revState.p[+m[1]]=val; updateRev(); }
  else if((m=id.match(/^cc-(fc|vc|q)$/))){ costState[m[1]]=val; updateCost(); }
  else if((m=id.match(/^pc-(tr|tc|oc)$/))){ pcState[m[1]]=val; updatePCalc(); }
  else if((m=id.match(/^st-(fc|q|avc|p)$/))){ stayState[m[1]]=val; stayState.preset=''; updateStay(); }
});

try{
  var saved=JSON.parse(localStorage.getItem('tof-state')||'null');
  if(saved){
    if(TOPICS[saved.topic]) state.topic=saved.topic;
    /* only restore a view that still lives in that tab (some views have moved tabs) */
    for(var tk in TOPICS){ var sv=saved.view&&saved.view[tk]; if(sv && V[sv] && TOPICS[tk].groups.some(function(gr){return gr[1].indexOf(sv)>=0;})) state.view[tk]=sv; }
  }
}catch(e){}
var h0=readHash(); if(h0){ state.topic=h0.topic; if(h0.view) state.view[h0.topic]=h0.view; }
renderControls(); renderNotes(); state.t=1; render();
if(EMBED){
  if(cur().anim) setTimeout(play, 500);
  var tell=function(){ try{ parent.postMessage({type:'econ-embed-height', h:document.documentElement.scrollHeight, view:curId()}, location.origin==='null'?'*':location.origin); }catch(e){} };
  if(window.ResizeObserver) new ResizeObserver(tell).observe(document.body); else window.addEventListener('load',tell);
  tell();
}

var lastW=plot.clientWidth;
if(window.ResizeObserver){
  new ResizeObserver(function(){ if(!plot.hidden && plot.clientWidth!==lastW){ lastW=plot.clientWidth; requestAnimationFrame(render); } }).observe(plot);
} else window.addEventListener('resize', render);
if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ render(); });
})();
