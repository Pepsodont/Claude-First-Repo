/* Generativní vizuály produktů CoM. <canvas class="viz" data-viz="radix|otium|adwazir|opus|ee|pcd" data-live="1|hover">.
   live=1: animuje se, když je vidět; live=hover: stojí, animuje se jen pod kurzorem (karty). Respektuje prefers-reduced-motion. */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CREAM='234,231,224', RED='206,22,22';
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  var crown=new Image();crown.src='img/crown-white.svg';

  function bg(cx,W,H){cx.fillStyle='#050505';cx.fillRect(0,0,W,H);}
  function glow(cx,x,y,r,c,a){var g=cx.createRadialGradient(x,y,0,x,y,r);for(var i=0;i<=10;i++){var t=i/10,v=i===10?0:a*Math.exp(-Math.pow(t*2.3,2));g.addColorStop(t,'rgba('+c+','+v.toFixed(4)+')');}cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2);}

  /* RADIX: kořeny pod povrchem, po kterých putuje světlo */
  function radixPrep(W,H){
    var R=rng(7),segs=[],maxD=0,ground=H*0.3;
    function br(x,y,a,len,depth,d){
      if(depth>7||len<4)return;
      var x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len,nd=d+len;maxD=Math.max(maxD,nd);
      segs.push({x:x,y:y,x2:x2,y2:y2,depth:depth,d:d,d2:nd});
      var n=depth<2?3:2;
      for(var i=0;i<n;i++)br(x2,y2,a+(R()-.5)*1.1,len*(.66+R()*.16),depth+1,nd);
    }
    var xs=[.1,.25,.4,.55,.7,.85,.97];
    xs.forEach(function(px){br(W*px,ground,Math.PI/2+(R()-.5)*.5,H*.13,0,0);});
    return {segs:segs,maxD:maxD,ground:ground};
  }
  function radix(cx,W,H,t,s){
    bg(cx,W,H);
    glow(cx,W*.62,s.ground,Math.max(W,H)*.5,RED,.10);
    var lg=cx.createLinearGradient(0,0,W,0);lg.addColorStop(0,'rgba('+CREAM+',0)');lg.addColorStop(.15,'rgba('+CREAM+',.14)');lg.addColorStop(.6,'rgba('+CREAM+',.2)');lg.addColorStop(1,'rgba('+CREAM+',.08)');
    cx.strokeStyle=lg;cx.lineWidth=1;cx.beginPath();cx.moveTo(0,s.ground);cx.lineTo(W,s.ground);cx.stroke();
    var head=((t*0.00012)%1)*s.maxD*1.3, band=s.maxD*.12;
    cx.lineCap='round';
    s.segs.forEach(function(g){
      var w=Math.max(.6,3.2-g.depth*.42);
      cx.strokeStyle='rgba('+CREAM+','+(.08+(.16*(7-g.depth)/7)).toFixed(3)+')';cx.lineWidth=w;
      cx.beginPath();cx.moveTo(g.x,g.y);cx.lineTo(g.x2,g.y2);cx.stroke();
      var k=1-Math.abs((g.d+g.d2)/2-head)/band;
      if(k>0){cx.strokeStyle='rgba('+RED+','+(k*.85).toFixed(3)+')';cx.lineWidth=w+1.2;cx.beginPath();cx.moveTo(g.x,g.y);cx.lineTo(g.x2,g.y2);cx.stroke();}
    });
  }

  /* OTIUM: horizont za soumraku, hory, mlha */
  function otiumPrep(W,H){
    var R=rng(11),layers=[];
    for(var l=0;l<3;l++){var ph=[R()*6,R()*6,R()*6];layers.push({ph:ph,base:H*(.6+l*.08),amp:H*(.09-l*.02),c:['#0d0b0b','#090707','#050505'][l]});}
    return {layers:layers};
  }
  function otium(cx,W,H,t,s){
    var g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#050505');g.addColorStop(.45,'#140606');g.addColorStop(.62,'#3a0a0a');g.addColorStop(.75,'#120505');g.addColorStop(1,'#050505');
    cx.fillStyle=g;cx.fillRect(0,0,W,H);
    var sy=H*.56+Math.sin(t*.00015)*H*.015;
    glow(cx,W*.64,sy,Math.max(W,H)*.32,RED,.35);
    cx.fillStyle='rgba(230,70,50,.55)';cx.beginPath();cx.arc(W*.64,sy,Math.min(W,H)*.06,0,Math.PI*2);cx.fill();
    s.layers.forEach(function(L,li){
      var off=t*.004*(li+1);
      cx.fillStyle=L.c;cx.beginPath();cx.moveTo(0,H);
      for(var x=0;x<=W;x+=6){var u=(x+off)/W;var y=L.base-L.amp*(.55*Math.sin(u*3.1+L.ph[0])+.3*Math.sin(u*7.3+L.ph[1])+.15*Math.sin(u*15.7+L.ph[2]));cx.lineTo(x,y);}
      cx.lineTo(W,H);cx.closePath();cx.fill();
    });
    for(var m=0;m<3;m++){var my=H*(.7+m*.07),mx=((t*.01*(m+1))%(W*2))-W*.5;var mg=cx.createLinearGradient(mx,0,mx+W*.8,0);mg.addColorStop(0,'rgba('+CREAM+',0)');mg.addColorStop(.5,'rgba('+CREAM+',.035)');mg.addColorStop(1,'rgba('+CREAM+',0)');cx.fillStyle=mg;cx.fillRect(0,my-H*.03,W,H*.06);}
  }

  /* ADWAZIR: koruna ve světle a postava ve stínu za ní */
  function adwazir(cx,W,H,t){
    bg(cx,W,H);
    var cxp=W*.64,b=Math.sin(t*.0004);
    glow(cx,cxp+W*.04,H*.42,Math.max(W,H)*.42,RED,.20+.04*b);
    var hs=Math.min(W,H);
    cx.save();cx.translate(cxp+W*.06+Math.sin(t*.0002)*4,H*.18);
    var fw=hs*.34,head=hs*.085;
    cx.beginPath();cx.arc(0,head,head,0,Math.PI*2);
    cx.moveTo(-fw*.5,H);cx.bezierCurveTo(-fw*.55,head*3.2,-fw*.2,head*2.2,0,head*2.15);cx.bezierCurveTo(fw*.2,head*2.2,fw*.55,head*3.2,fw*.5,H);cx.closePath();
    cx.fillStyle='#040303';cx.shadowColor='rgba(0,0,0,1)';cx.shadowBlur=30;cx.fill();
    cx.shadowColor='rgba('+RED+',.9)';cx.shadowBlur=24;cx.strokeStyle='rgba('+RED+','+(.45+.15*b).toFixed(3)+')';cx.lineWidth=1.4;cx.stroke();
    cx.restore();
    if(crown.complete&&crown.naturalWidth){
      var cw=hs*.42,ch=cw*crown.naturalHeight/crown.naturalWidth,y=H*.62-ch/2+Math.sin(t*.0005)*3;
      cx.save();cx.shadowColor='rgba('+CREAM+',.55)';cx.shadowBlur=28;cx.globalAlpha=.92;cx.drawImage(crown,cxp-cw*.62,y,cw,ch);cx.restore();
    }
  }

  /* OPUS: klenba, která se staví kámen po kameni; svorník je červený */
  function opus(cx,W,H,t){
    bg(cx,W,H);
    var ox=W*.62,oy=H*.86,R=Math.min(W*.42,H*.62),th=R*.26,N=11,key=5;
    glow(cx,ox,oy-R*.6,R*1.4,RED,.10);
    var cyc=11000,ph=(t%cyc),fade=1;
    if(ph>cyc-1200)fade=Math.max(0,(cyc-ph)/1200);
    cx.fillStyle='rgba('+CREAM+',.05)';cx.strokeStyle='rgba('+CREAM+',.28)';cx.lineWidth=1;
    cx.fillRect(ox-R-1,oy,th,H);cx.strokeRect(ox-R-1,oy,th,H);cx.fillRect(ox+R-th+1,oy,th,H);cx.strokeRect(ox+R-th+1,oy,th,H);
    for(var i=0;i<N;i++){
      var appear=600+i*480,a=Math.max(0,Math.min(1,(ph-appear)/450))*fade;if(a<=0)continue;
      var a0=Math.PI+i*Math.PI/N+.012,a1=Math.PI+(i+1)*Math.PI/N-.012,drop=(1-a)*30;
      cx.beginPath();cx.arc(ox,oy-drop,R,a0,a1);cx.arc(ox,oy-drop,R-th,a1,a0,true);cx.closePath();
      var isK=i===key;
      cx.fillStyle=isK?'rgba('+RED+','+(.30*a).toFixed(3)+')':'rgba('+CREAM+','+(.06*a).toFixed(3)+')';cx.fill();
      cx.save();if(isK){cx.shadowColor='rgba('+RED+',.9)';cx.shadowBlur=22;}
      cx.strokeStyle=isK?'rgba('+RED+','+(.9*a).toFixed(3)+')':'rgba('+CREAM+','+(.34*a).toFixed(3)+')';cx.lineWidth=isK?1.6:1;cx.stroke();cx.restore();
    }
  }

  /* EXECUTIVE EXPERIENCE: reflektor na prázdném jevišti, prach ve světle */
  function eePrep(){var R=rng(5),p=[];for(var i=0;i<70;i++)p.push({u:R(),v:R(),s:.5+R()*1.6,sp:.3+R()*.8});return {p:p};}
  function ee(cx,W,H,t,s){
    bg(cx,W,H);
    var sx=W*.62+Math.sin(t*.0003)*W*.02,fy=H*.84,fw=Math.min(W*.3,H*.5);
    var g=cx.createLinearGradient(0,0,0,fy);g.addColorStop(0,'rgba('+CREAM+',.16)');g.addColorStop(1,'rgba('+CREAM+',.03)');
    cx.fillStyle=g;cx.beginPath();cx.moveTo(sx-8,-10);cx.lineTo(sx+8,-10);cx.lineTo(sx+fw,fy);cx.lineTo(sx-fw,fy);cx.closePath();cx.fill();
    cx.save();cx.translate(sx,fy);cx.scale(1,.18);glow(cx,0,0,fw*1.25,CREAM,.30);cx.restore();
    cx.save();cx.translate(sx,fy);cx.scale(1,.18);cx.strokeStyle='rgba('+RED+',.55)';cx.lineWidth=5;cx.beginPath();cx.arc(0,0,fw*1.02,0,Math.PI*2);cx.stroke();cx.restore();
    glow(cx,sx,fy,fw*1.6,RED,.10);
    s.p.forEach(function(d){var y=((d.v-(t*.00003*d.sp))%1+1)%1*fy,k=y/fy,x=sx+(d.u-.5)*2*fw*k*.9;cx.fillStyle='rgba('+CREAM+','+(.10+.25*(1-Math.abs(d.u-.5)*2)).toFixed(3)+')';cx.fillRect(x,y,d.s,d.s);});
  }

  /* POWER CHANGE DELIVERY: světlo prochází třemi branami */
  function pcd(cx,W,H,t){
    bg(cx,W,H);
    var y=H*.66,x0=W*.18,x1=W*.96,gates=[.38,.62,.86],gw=Math.min(W*.08,H*.16),gh=Math.min(H*.36,W*.3);
    glow(cx,W*.62,y-gh*.4,Math.max(W,H)*.45,RED,.08);
    cx.strokeStyle='rgba('+CREAM+',.2)';cx.lineWidth=1;cx.beginPath();cx.moveTo(x0,y);cx.lineTo(x1,y);cx.stroke();
    var cyc=7000,p=(t%cyc)/cyc,px=x0+(x1-x0)*p;
    gates.forEach(function(gx){
      var X=W*gx,dist=(px-X)/(W*.12),lit=dist>0?Math.max(0,1-dist*.35):0;
      cx.save();
      cx.beginPath();cx.moveTo(X-gw/2,y);cx.lineTo(X-gw/2,y-gh+gw/2);cx.arc(X,y-gh+gw/2,gw/2,Math.PI,0);cx.lineTo(X+gw/2,y);
      if(lit>0){cx.shadowColor='rgba('+RED+',.9)';cx.shadowBlur=24*lit;}
      cx.strokeStyle=lit>0?'rgba('+RED+','+(.35+.6*lit).toFixed(3)+')':'rgba('+CREAM+',.28)';cx.lineWidth=lit>0?1.8:1.2;cx.stroke();cx.restore();
    });
    var tr=cx.createLinearGradient(px-W*.14,0,px,0);tr.addColorStop(0,'rgba('+RED+',0)');tr.addColorStop(1,'rgba('+RED+',.85)');
    cx.strokeStyle=tr;cx.lineWidth=2;cx.beginPath();cx.moveTo(Math.max(x0,px-W*.14),y);cx.lineTo(px,y);cx.stroke();
    glow(cx,px,y,22,CREAM,.9);glow(cx,px,y,70,RED,.35);
  }


  /* FLOW: krevní oběh firmy. Moc teče od majitele přes ředitele a vedení k týmu.
     data-case: free | clot (zátka mezi majitelem a ředitelem) | loop (vedení ji spotřebuje provozem) | one (všechno jedním kanálem) | fog (tlak roste, místo nevíme) */
  function flowPrep(W,H,cv){
    var mode=(cv&&cv.dataset.case)||'free',hz=W>=H*1.15,R=rng(23);
    var sc=Math.max(.7,Math.min(1.6,Math.min(W,H)/420));
    function P(u,v){return hz?[W*(.05+u*.9),H*(.14+v*.72)]:[W*(.12+v*.76),H*(.05+u*.9)];}
    var N={M:[.04,.5],R:[.27,.5],V0:[.52,.16],V1:[.52,.5],V2:[.52,.84]};
    var tv=[.04,.22,.4,.6,.78,.96];tv.forEach(function(v,i){N['T'+i]=[.8,v];N['O'+i]=[1.04,v];});
    var E=[],EI={};
    function edge(a,b){var A=N[a],B=N[b],um=(A[0]+B[0])/2,pts=[],len=0;
      for(var i=0;i<=24;i++){var s=i/24,m=1-s;
        var u=m*m*m*A[0]+3*m*m*s*um+3*m*s*s*um+s*s*s*B[0],v=m*m*m*A[1]+3*m*m*s*A[1]+3*m*s*s*B[1]+s*s*s*B[1];
        var p=P(u,v);if(i)len+=Math.hypot(p[0]-pts[i-1][0],p[1]-pts[i-1][1]);pts.push(p);}
      EI[a+'-'+b]=E.length;E.push({a:a,b:b,pts:pts,len:len});}
    edge('M','R');['V0','V1','V2'].forEach(function(v){edge('R',v);});
    var VT={V0:[0,1,2],V1:[2,3],V2:[3,4,5]};
    Object.keys(VT).forEach(function(v){VT[v].forEach(function(t){edge(v,'T'+t);});});
    for(var i=0;i<6;i++)edge('T'+i,'O'+i);
    function at(e,s){var f=Math.max(0,Math.min(.9999,s))*24,i=Math.floor(f),k=f-i,a=e.pts[i],b=e.pts[i+1];return [a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k];}
    var st={mode:mode,hz:hz,sc:sc,P:P,N:N,E:E,EI:EI,at:at,R:R,ps:[],clotS:.62,clk:0,last:null,speed:Math.max(W,H)/5200};
    st.good=[EI['M-R'],EI['R-V1'],EI['V1-T3'],EI['T3-O3']];
    function route(){var v=['V0','V1','V2'][Math.floor(R()*3)],ts=VT[v],t=ts[Math.floor(R()*ts.length)];
      return [EI['M-R'],EI['R-'+v],EI[v+'-T'+t],EI['T'+t+'-O'+t]];}
    st.newHot=function(h){var c;do{c=Math.floor(R()*E.length);}while(st.good.indexOf(c)>-1);h.e=c;h.s=.3+R()*.4;h.age=0;h.life=2200+R()*2600;return h;};
    st.bursts=[];st.hot=mode==='fog'?[0,1,2].map(function(){var h=st.newHot({});h.age=R()*h.life;return h;}):[];
    st.spawn=function(p,warm){p.good=mode==='fog'&&R()<.34;p.r=p.good?st.good.slice():route();p.k=0;p.s=warm?R():0;p.sp=.7+R()*.6;p.q=R();p.st='go';p.life=0;
      p.pass=mode==='clot'?R()<.18:mode==='loop'?R()<.2:mode==='one'?R()<.12:true;
      p.derail=mode==='fog'&&!p.good&&R()<.75;p.dk=1+Math.floor(R()*3);p.ds=.15+R()*.7;
      if(warm){p.k=Math.floor(R()*4);}};
    for(var j=0;j<150;j++){var p={};st.spawn(p,true);st.ps.push(p);}
    for(var w=0;w<260;w++)flowStep(st,33);
    if(cv){var an=mode==='clot'?at(E[0],st.clotS):mode==='loop'?P(N.V1[0],N.V1[1]):mode==='one'?P(N.R[0],N.R[1]):mode==='fog'?P(.42,.5):P(N.V1[0],N.V1[1]);
      cv.dataset.ax=(an[0]/W).toFixed(4);cv.dataset.ay=(an[1]/H).toFixed(4);
      try{cv.dispatchEvent(new Event('vizprep'));}catch(e){}}
    return st;
  }
  function flowStep(st,dt){
    st.clk+=dt;var R=st.R,E=st.E,m=st.mode;
    st.hot.forEach(function(h){h.age+=dt;if(h.age>h.life)st.newHot(h);});
    st.bursts.forEach(function(b){b.age+=dt;});st.bursts=st.bursts.filter(function(b){return b.age<b.life;});
    st.ps.forEach(function(p){
      if(p.st==='off'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.992;p.vy=p.vy*.992+(p.g||0)*dt;p.life-=dt;if(p.life<0)st.spawn(p);return;}
      if(p.st==='stuck'||p.st==='orbit'){p.life-=dt;if(p.st==='orbit')p.ang+=dt*.0024*p.sp;
        if(p.life<0){
          if(m==='one'&&p.st==='orbit'&&R()<.42){var c=st.P(st.N.R[0],st.N.R[1]),rr=(16+p.q*38)*st.sc,x=c[0]+Math.cos(p.ang)*rr,y=c[1]+Math.sin(p.ang)*rr*.8,ox=Math.cos(p.ang),oy=Math.sin(p.ang);
            p.st='off';p.x=x;p.y=y;
            if(R()<.5){p.vx=ox*st.speed*.5;p.vy=oy*st.speed*.3-st.speed*.2;p.g=st.speed*.0016;p.life=p.L0=1400+R()*900;}
            else{st.bursts.push({x:x,y:y,age:0,life:650});p.vx=ox*st.speed*1.6;p.vy=oy*st.speed*1.6;p.g=0;p.life=p.L0=320+R()*220;}
            return;}
          st.spawn(p);}
        return;}
      var e=E[p.r[p.k]],mult=1,s0=p.s;
      if(m==='one'&&p.k===0)mult=1-.35*p.s;
      p.s+=dt*st.speed*p.sp*mult/e.len;
      if(m==='fog'&&!p.good){
        if(p.derail&&p.k===p.dk&&p.s>=p.ds){var a=st.at(e,p.s),b=st.at(e,Math.min(1,p.s+.03)),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,an=Math.atan2(dy,dx)+(R()<.5?-1:1)*(.55+R()*.9),v=st.speed*p.sp*1.1;
          p.st='off';p.x=a[0];p.y=a[1];p.vx=Math.cos(an)*v;p.vy=Math.sin(an)*v;p.life=p.L0=900+R()*1100;return;}
        for(var hi=0;hi<st.hot.length;hi++){var h=st.hot[hi];if(p.r[p.k]===h.e&&s0<h.s&&p.s>=h.s&&R()<.75){p.s=h.s-p.q*.05;p.st='stuck';p.life=700+R()*1500;return;}}
      }
      if(m==='clot'&&p.k===0&&!p.pass){var stop=st.clotS-p.q*.16;if(p.s>=stop){p.s=stop;p.st='stuck';p.life=1500+R()*3500;return;}}
      if(p.s>=1){p.s=0;p.k++;
        if(m==='one'&&p.k===1&&!p.pass){p.st='orbit';p.ang=R()*6.28;p.life=2200+R()*3200;p.c='R';return;}
        if(m==='loop'&&p.k===2&&!p.pass){p.st='orbit';p.ang=R()*6.28;p.life=2500+R()*3000;p.c=E[p.r[1]].b;return;}
        if(p.k>=p.r.length)st.spawn(p);}
    });
  }
  function flow(cx,W,H,t,st){
    var dt=st.last==null?0:Math.min(80,Math.max(0,t-st.last));st.last=t;if(dt)flowStep(st,dt);
    cx.clearRect(0,0,W,H);var sc=st.sc,m=st.mode,E=st.E,N=st.N,P=st.P,pul=.5+.5*Math.sin(st.clk*.003);
    function np(k){return P(N[k][0],N[k][1]);}
    /* atmosféra místa, kde to bolí */
    if(m==='clot'){var c=st.at(E[0],st.clotS);glow(cx,c[0],c[1],230*sc*(1+.08*pul),RED,.14);}
    if(m==='loop'){var v=np('V1');glow(cx,v[0],v[1],260*sc,RED,.10);}
    if(m==='one'){var r=np('R');glow(cx,r[0],r[1],240*sc*(1+.1*pul),RED,.17);}
    if(m==='fog'){st.hot.forEach(function(h){var q=st.at(E[h.e],h.s),k=Math.sin(Math.PI*Math.min(1,h.age/h.life));glow(cx,q[0],q[1],130*sc,RED,.13*k);});}
    if(m==='free'){var f=np('V1');glow(cx,f[0],f[1],260*sc,RED,.06);}
    /* cévy */
    function weak(e){
      if(m==='clot')return e!==E[0];
      if(m==='loop')return e.a.charAt(0)==='V'||e.a.charAt(0)==='T';
      if(m==='one')return e!==E[0];
      return false;}
    cx.lineCap='round';
    E.forEach(function(e,ei){var wk=weak(e),thick=(m==='one'&&e===E[0])||(m==='fog'&&st.good.indexOf(ei)>-1);
      cx.strokeStyle='rgba('+CREAM+','+(wk?.08:thick?.3:.2)+')';cx.lineWidth=(thick?2.4:1)*Math.max(1,sc*.9);
      cx.beginPath();e.pts.forEach(function(p,i){i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]);});cx.stroke();});
    if(m==='clot'){cx.strokeStyle='rgba('+RED+',.35)';cx.lineWidth=2.4*sc;cx.beginPath();var e0=E[0];for(var i=0;i<=24*st.clotS;i++){var p=e0.pts[i];i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]);}cx.stroke();}
    /* uzly */
    Object.keys(N).forEach(function(k){if(k.charAt(0)==='O')return;var p=np(k),r=(k==='M'||k==='R'?4.2:3.2)*sc;
      var dim=(m==='clot'&&k!=='M')||(m==='loop'&&k.charAt(0)==='T')||(m==='one'&&k!=='M'&&k!=='R');
      cx.fillStyle='#070505';cx.strokeStyle='rgba('+CREAM+','+(dim?.18:.5)+')';cx.lineWidth=1.2;cx.beginPath();cx.arc(p[0],p[1],r,0,6.283);cx.fill();cx.stroke();});
    /* krev */
    cx.save();cx.globalCompositeOperation='lighter';
    st.ps.forEach(function(p){var pos,e=E[p.r[p.k]];
      if(p.st==='off'){pos=[p.x,p.y];}
      else if(p.st==='orbit'){var c=np(p.c),rr=(m==='one'?16+p.q*38:14+p.q*16)*sc;pos=[c[0]+Math.cos(p.ang)*rr,c[1]+Math.sin(p.ang)*rr*.8];}
      else{if(!e)return;pos=st.at(e,p.s);if(p.st==='stuck'){pos=[pos[0]+(Math.sin(st.clk*.01+p.q*50))*1.2*sc,pos[1]+(Math.cos(st.clk*.012+p.q*30))*1.2*sc];}}
      var down=(m==='clot'&&p.k>0)||(m==='loop'&&p.k>1&&p.st==='go')||(m==='one'&&p.k>0&&p.st==='go');
      var a=down?.42:(p.st==='off'?.85*Math.max(0,p.life/p.L0):.9);
      if(p.st==='off'){var vl=Math.hypot(p.vx,p.vy)||1,tl=18*sc;cx.strokeStyle='rgba(255,90,80,'+(a*.35).toFixed(3)+')';cx.lineWidth=1.2*sc;cx.beginPath();cx.moveTo(pos[0],pos[1]);cx.lineTo(pos[0]-p.vx/vl*tl,pos[1]-p.vy/vl*tl);cx.stroke();}
      cx.fillStyle='rgba('+RED+','+(a*.16).toFixed(3)+')';cx.beginPath();cx.arc(pos[0],pos[1],5.5*sc,0,6.283);cx.fill();
      cx.fillStyle='rgba(255,90,80,'+a.toFixed(3)+')';cx.beginPath();cx.arc(pos[0],pos[1],1.6*sc,0,6.283);cx.fill();});
    cx.restore();
    st.bursts.forEach(function(b){var k=b.age/b.life,rr=(3+16*k)*sc,a=(1-k)*.5;cx.strokeStyle='rgba(255,90,80,'+a.toFixed(3)+')';cx.lineWidth=1;cx.beginPath();cx.arc(b.x,b.y,rr,0,6.283);cx.stroke();
      for(var j=0;j<4;j++){var an=j*1.571+b.x*.01,r1=rr*.6,r2=rr*1.25;cx.beginPath();cx.moveTo(b.x+Math.cos(an)*r1,b.y+Math.sin(an)*r1);cx.lineTo(b.x+Math.cos(an)*r2,b.y+Math.sin(an)*r2);cx.stroke();}});
    if(m==='fog'){st.hot.forEach(function(h){var q=st.at(E[h.e],Math.min(1,h.s+.02)),k=Math.sin(Math.PI*Math.min(1,h.age/h.life));if(k<.05)return;cx.save();cx.globalAlpha=k;cx.shadowColor='rgba('+RED+',.9)';cx.shadowBlur=12*sc;cx.fillStyle='#120707';cx.strokeStyle='rgba('+CREAM+',.5)';cx.lineWidth=1.2;cx.beginPath();cx.arc(q[0],q[1],4.5*sc,0,6.283);cx.fill();cx.stroke();cx.restore();});}
    if(m==='clot'){var c2=st.at(E[0],st.clotS+.02);cx.save();cx.shadowColor='rgba('+RED+',.9)';cx.shadowBlur=18*sc;cx.fillStyle='#120707';cx.strokeStyle='rgba('+CREAM+',.55)';cx.lineWidth=1.4;cx.beginPath();cx.arc(c2[0],c2[1],7*sc,0,6.283);cx.fill();cx.stroke();cx.restore();}
    /* popisky */
    cx.fillStyle='rgba('+CREAM+',.5)';cx.font=Math.round(11*Math.max(1,sc*.85))+'px "Geist Mono",ui-monospace,monospace';
    var q=m==='one'?' ?':'',L=[['M','MAJITEL'],['R','ŘEDITEL'],['V2','VEDENÍ'+q],['T5','TÝM'+q]];
    L.forEach(function(l){var p=np(l[0]);if(st.hz){cx.textAlign='center';cx.fillText(l[1],p[0],p[1]+(m==='one'&&l[0]==='R'?-58:l[0]==='V2'?40:22)*sc);}else{cx.textAlign='left';cx.fillText(l[1],p[0]+(m==='one'&&l[0]==='R'?62:14)*sc,p[1]+4);}});
  }

  /* PCDLINE: cesta Power Change Delivery. Neklidná moc projde třemi branami; rozsvícená brána ji zklidní. data-on="0,1,2" */
  function pcdlinePrep(W,H,cv){
    var on=((cv&&cv.dataset.on)||'0,1,2').split(',').filter(Boolean).map(Number),R=rng(31),ps=[];
    var g=Math.min(W*.04,48),gx=[(W-2*g)/6,W/2,W-(W-2*g)/6];
    var np=(cv&&cv.dataset.quiet)?26:90;for(var i=0;i<np;i++)ps.push({x:R()*W,sp:.6+R()*.8,q:R(),ph:R()*6.28,o:R()*2-1});
    return {on:on,gx:gx,ps:ps,last:null,clk:0,sc:Math.max(.8,Math.min(1.5,H/150))};
  }
  function pcdline(cx,W,H,t,s){
    var dt=s.last==null?0:Math.min(80,Math.max(0,t-s.last));s.last=t;s.clk+=dt;
    cx.clearRect(0,0,W,H);var y=H*.62,sc=s.sc,gh=56*sc,gw=26*sc;
    var lg=cx.createLinearGradient(0,0,W,0);lg.addColorStop(0,'rgba('+CREAM+',0)');lg.addColorStop(.12,'rgba('+CREAM+',.14)');lg.addColorStop(1,'rgba('+CREAM+',.2)');
    cx.strokeStyle=lg;cx.lineWidth=1;cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke();
    s.gx.forEach(function(X,i){var lit=s.on.indexOf(i)>-1;
      if(lit)glow(cx,X,y-gh*.4,gh*1.3,RED,.14);
      cx.save();cx.beginPath();cx.moveTo(X-gw/2,y);cx.lineTo(X-gw/2,y-gh+gw/2);cx.arc(X,y-gh+gw/2,gw/2,Math.PI,0);cx.lineTo(X+gw/2,y);
      if(lit){cx.shadowColor='rgba('+RED+',.9)';cx.shadowBlur=16;}
      cx.strokeStyle=lit?'rgba('+RED+',.85)':'rgba('+CREAM+',.22)';cx.lineWidth=lit?1.6:1;cx.stroke();cx.restore();});
    function calm(x){var f=1;s.gx.forEach(function(X,i){if(x>X&&s.on.indexOf(i)>-1)f*=.38;});return f;}
    cx.save();cx.globalCompositeOperation='lighter';
    s.ps.forEach(function(p){p.x+=dt*W/6500*p.sp*(.55+.45*(1-calm(p.x)));if(p.x>W+10){p.x=-10;p.q=Math.random();}
      var f=calm(p.x),amp=gh*.62*f,yy=y-gh*.38+(p.o+.35*Math.sin(p.ph+s.clk*.003*p.sp))*amp,a=.22+.7*(1-f);
      cx.fillStyle='rgba('+RED+','+(a*.18).toFixed(3)+')';cx.beginPath();cx.arc(p.x,yy,5*sc,0,6.283);cx.fill();
      cx.fillStyle='rgba(255,90,80,'+a.toFixed(3)+')';cx.beginPath();cx.arc(p.x,yy,1.5*sc,0,6.283);cx.fill();});
    cx.restore();
  }


  /* STEPS: průběh produktu. Linka se zastávkami (data-xs = pozice 0–1), světlo je postupně rozsvěcuje. */
  function stepsPrep(W,H,cv){
    var xs=((cv&&cv.dataset.xs)||'0.004,0.25,0.5,0.75').split(',').map(Number).filter(function(x){return !isNaN(x);});
    var R=rng(41),ps=[];for(var i=0;i<46;i++)ps.push({x:R()*W,sp:.6+R()*.8,o:R()*2-1,ph:R()*6.28});
    return {xs:xs,ps:ps,last:null,clk:7700,sc:Math.max(.8,Math.min(1.4,H/90))};
  }
  function steps(cx,W,H,t,s){
    var dt=s.last==null?0:Math.min(80,Math.max(0,t-s.last));s.last=t;s.clk+=dt;
    cx.clearRect(0,0,W,H);var y=H*.5,sc=s.sc,x0=s.xs[0]*W,x1=W;
    var cyc=9000,ph=(s.clk%cyc)/cyc,head=x0+(x1-x0)*Math.min(1,ph*1.15);
    var lg=cx.createLinearGradient(x0,0,W,0);lg.addColorStop(0,'rgba('+CREAM+',.22)');lg.addColorStop(1,'rgba('+CREAM+',.04)');
    cx.strokeStyle=lg;cx.lineWidth=1;cx.beginPath();cx.moveTo(x0,y);cx.lineTo(x1,y);cx.stroke();
    var tr=cx.createLinearGradient(x0,0,head,0);tr.addColorStop(0,'rgba('+RED+',.15)');tr.addColorStop(1,'rgba('+RED+',.9)');
    cx.strokeStyle=tr;cx.lineWidth=1.6;cx.beginPath();cx.moveTo(x0,y);cx.lineTo(head,y);cx.stroke();
    cx.save();cx.globalCompositeOperation='lighter';
    s.ps.forEach(function(p){p.x+=dt*W/9000*p.sp;if(p.x>W+8)p.x=x0;if(p.x>head)return;var yy=y+Math.sin(p.ph+s.clk*.003)*3*sc*p.o;
      cx.fillStyle='rgba(255,90,80,.5)';cx.beginPath();cx.arc(p.x,yy,1.3*sc,0,6.283);cx.fill();});
    cx.restore();
    glow(cx,head,y,60*sc,RED,.35);glow(cx,head,y,10*sc,CREAM,.8);
    s.xs.forEach(function(f,i){var X=f*W,lit=X<=head+1,r=6*sc;
      if(lit)glow(cx,X,y,34*sc,RED,.25);
      cx.beginPath();cx.arc(X,y,r,0,6.283);cx.fillStyle=lit?'rgba('+RED+',1)':'#070505';cx.fill();
      cx.lineWidth=1.2;cx.strokeStyle=lit?'rgba('+RED+',1)':'rgba('+CREAM+',.35)';cx.stroke();});
  }
  var LIB={radix:{d:radix,p:radixPrep},otium:{d:otium,p:otiumPrep},adwazir:{d:adwazir},opus:{d:opus,t0:7000},ee:{d:ee,p:eePrep},pcd:{d:pcd},flow:{d:flow,p:flowPrep},pcdline:{d:pcdline,p:pcdlinePrep},steps:{d:steps,p:stepsPrep,t0:9000}};
  var items=[];
  function setup(cv){
    var k=cv.dataset.viz,lib=LIB[k];if(!lib)return;
    var it={cv:cv,cx:cv.getContext('2d'),lib:lib,W:1,H:1,s:null,live:cv.dataset.live||'1',on:false,hover:false,t0:lib.t0||4200};
    function size(){var r=cv.getBoundingClientRect(),q=Math.min(window.devicePixelRatio||1,1.5)*(it.live==='hover'?1:.8);it.W=Math.max(2,Math.round(r.width*q));it.H=Math.max(2,Math.round(r.height*q));cv.width=it.W;cv.height=it.H;it.s=lib.p?lib.p(it.W,it.H,cv):null;draw(it,it.t0);}
    it.size=size;
    if('ResizeObserver' in window)new ResizeObserver(size).observe(cv);else window.addEventListener('resize',size);
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){it.on=es[0].isIntersecting;},{threshold:.05}).observe(cv);else it.on=true;
    if(it.live==='hover'){var host=cv.closest('a,div')||cv;host.addEventListener('mouseenter',function(){it.hover=true;});host.addEventListener('mouseleave',function(){it.hover=false;});host.addEventListener('focus',function(){it.hover=true;},true);host.addEventListener('blur',function(){it.hover=false;},true);}
    size();items.push(it);
  }
  function draw(it,t){it.lib.d(it.cx,it.W,it.H,t,it.s);}
  crown.onload=function(){items.forEach(function(it){draw(it,it.t0);});};
  function scan(){[].slice.call(document.querySelectorAll('canvas.viz')).forEach(function(cv){if(cv.dataset.vizOn)return;cv.dataset.vizOn='1';setup(cv);});}
  window.CoMViz={scan:scan,refresh:function(cv){items.forEach(function(it){if(it.cv===cv)it.size();});}};
  scan();
  if(reduce)return;
  var last=0;
  (function loop(t){
    if(t-last>33){last=t;items=items.filter(function(it){return it.cv.isConnected;});items.forEach(function(it){if(!it.on)return;if(it.live==='hover'&&!it.hover)return;it.t0+=33;draw(it,it.t0);});}
    requestAnimationFrame(loop);
  })(0);
})();

/* Každá stránka začíná nahoře (kromě odkazu na konkrétní kotvu, např. #kontakt). */
(function(){
  try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch(e){}
  function top(){var h=location.hash.slice(1),el=h&&document.getElementById(h);if(el&&el.tagName!=='BODY'&&el.closest('section,footer,header'))el.scrollIntoView();else window.scrollTo(0,0);}
  if(document.readyState==='complete')top();else window.addEventListener('load',top);
})();
