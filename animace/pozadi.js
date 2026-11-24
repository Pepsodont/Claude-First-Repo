/* Court of Moravia – kouř v pozadí úvodu (homepage, canvas #fx).
   Stejný kód jako na webu (artefakt „Court of Moravia – Zrcadlo“, verze 126), jen vytažený do samostatné funkce.

   Použití:
     <canvas id="fx" aria-hidden="true"></canvas>
     <script src="pozadi.js"></script>
     <script>var pozadi = CoMPozadi(document.getElementById('fx'));</script>

   Rozzáření: pozadi.setGlow(1)    = klid (první obrazovka)
              pozadi.setGlow(1.35) = po výběru bolesti
              pozadi.setGlow(1.6)  = obrazovka „Tři kroky k lepší firmě“
   Přechod je plynulý (cca 1–2 s). Při prefers-reduced-motion se vykreslí jeden statický snímek. */
(function(){
  window.CoMPozadi=function(cv){
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cx=cv.getContext('2d'),W=1,H=1,last=0,glow=1,glowTo=1;
    var blobs=[
      {x:.20,y:.28,r:.55,c:'206,22,22',a:.16,sx:.00011,sy:.00007,p:0},
      {x:.80,y:.66,r:.50,c:'160,14,14',a:.14,sx:.00008,sy:.00012,p:2},
      {x:.52,y:.14,r:.36,c:'234,231,224',a:.03,sx:.00013,sy:.00009,p:4}];
    /* kreslí se v polovičním rozlišení – kouř je rozmazaný, šetří to výkon */
    function size(){var r=cv.getBoundingClientRect();W=Math.max(1,Math.round(r.width*.5));H=Math.max(1,Math.round(r.height*.5));cv.width=W;cv.height=H;}
    function draw(t){
      cx.globalCompositeOperation='source-over';cx.fillStyle='#050505';cx.fillRect(0,0,W,H);
      cx.globalCompositeOperation='lighter';var m=Math.max(W,H);
      blobs.forEach(function(b){
        var x=(b.x+Math.sin(t*b.sx+b.p)*.12)*W,y=(b.y+Math.cos(t*b.sy+b.p)*.10)*H,r=b.r*m*(1+Math.sin(t*.00017+b.p)*.08);
        var a=Math.min(.5,b.a*glow),g=cx.createRadialGradient(x,y,0,x,y,r);
        g.addColorStop(0,'rgba('+b.c+','+a.toFixed(3)+')');g.addColorStop(1,'rgba('+b.c+',0)');
        cx.fillStyle=g;cx.fillRect(0,0,W,H);});
      cx.globalCompositeOperation='source-over';
    }
    size();draw(0);
    if('ResizeObserver' in window){new ResizeObserver(function(){size();draw(performance.now());}).observe(cv);}
    else window.addEventListener('resize',function(){size();draw(performance.now());});
    /* ~30 snímků/s; když je canvas schovaný (opacity 0), nekreslí se */
    if(!reduce){(function loop(t){glow+=(glowTo-glow)*.02;if(t-last>33){last=t;if(parseFloat(cv.style.opacity||'1')>0)draw(t);}requestAnimationFrame(loop);})(0);}
    return {setGlow:function(v){glowTo=v;if(reduce){glow=v;draw(0);}}};
  };
})();
