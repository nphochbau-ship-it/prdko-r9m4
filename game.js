
'use strict';
(()=>{
const UW=216,ZM=1.64,WW=Math.round(UW/ZM);let W=WW,H=400,GY=282,UH=400,UGY=282,WH=244,WGY=172;
const cv=document.getElementById('c'),mcx=cv.getContext('2d',{alpha:false});let cx=mcx;
const wc=document.createElement('canvas'),wcx=wc.getContext('2d',{alpha:false});
const Q=new URLSearchParams(location.search);
let muted=Q.has('mute')||localStorage.getItem('smrdi-mute')==='1';
// ---------- pixel primitives (same approach as PEEK-A-SNIP!) ----------
function R(x,y,w,h,c){cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),w,h)}
function ellipse(x0,y0,rx,ry,c){cx.fillStyle=c;x0=Math.round(x0);y0=Math.round(y0);rx=Math.round(rx);ry=Math.round(ry);
 for(let dy=-ry;dy<=ry;dy++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(dy*dy)/((ry+.5)*(ry+.5)))));cx.fillRect(x0-w,y0+dy,w*2+1,1)}}
const disc=(x,y,r,c)=>ellipse(x,y,r,r,c);
function line(x0,y0,x1,y1,c){cx.fillStyle=c;x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
 const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
 for(let n=0;n<600;n++){cx.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
function geye(x,y,r,lx=0,ly=0){disc(x,y,r,'#fff');const ps=r>=4?3:r>=3?2:1,lim=r-ps*.5-.3;const L=Math.hypot(lx,ly);if(L>1){lx/=L;ly/=L}
 R(Math.round(x+lx*lim-ps/2+.01),Math.round(y+ly*lim-ps/2+.01),ps,ps,'#000')}
function box(x,y,w,h,fill,edge,shadow){x=Math.round(x);y=Math.round(y);if(shadow)R(x+1,y+3,w,h,shadow);
 if(edge){R(x+1,y,w-2,h,edge);R(x,y+1,w,h-2,edge);R(x+2,y+1,w-4,h-2,fill);R(x+1,y+2,w-2,h-4,fill)}else{R(x+1,y,w-2,h,fill);R(x,y+1,w,h-2,fill)}}
const FD = {
  A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
  D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
  G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '.###. ..#.. ..#.. ..#.. ..#.. ..#.. .###.',
  J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
  M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
  P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
  S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
  V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# #.#.# .#.#.', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
  Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
  0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
  3: '##### ...#. ..#.. ...#. ....# #...# .###.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
  6: '..##. .#... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
  9: '.###. #...# #...# .#### ....# ...#. .##..',
  '!': '..#.. ..#.. ..#.. ..#.. ..#.. ..... ..#..', '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', '.': '..... ..... ..... ..... ..... .##.. .##..',
  ',': '..... ..... ..... ..... .##.. ..#.. .#...', ':': '..... .##.. .##.. ..... .##.. .##.. .....', '-': '..... ..... ..... ##### ..... ..... .....',
  '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', "'": '..#.. ..#.. .#... ..... ..... ..... .....', '/': '....# ....# ...#. ..#.. .#... #.... #....',
  '(': '...#. ..#.. .#... .#... .#... ..#.. ...#.', ')': '.#... ..#.. ...#. ...#. ...#. ..#.. .#...', '=': '..... ..... ##### ..... ##### ..... .....',
  '*': '..... #.#.# .###. ##### .###. #.#.# .....', '@': '..... .#.#. ##### ##### .###. ..#.. .....', '<': '...#. ..#.. .#... #.... .#... ..#.. ...#.',
  '>': '.#... ..#.. ...#. ....# ...#. ..#.. .#...', '^': '..... ..#.. .###. ##### ..... ..... .....', '~': '..... ..... ##### .###. ..#.. ..... .....',
  '_': '..... ..... ..... ..... ..... ..... #####', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#', '#': '.#.#. ##### .#.#. .#.#. .#.#. ##### .#.#.',
  '%': '##..# ##..# ...#. ..#.. .#... #..## #..##', '★': '..#.. ..#.. ##### .###. .###. ##.## #...#', '¤': '.###. #...# #...# ##### ##.## ##.## #####',
  '|': '.#.#. .#.#. .#.#. .#.#. .#.#. .#.#. .#.#.', '"': '.#.#. .#.#. ..... ..... ..... ..... .....', '►': '.#... .##.. .###. .####. .###. .##.. .#...',
  '♪': '..##. ..#.# ..#.. ..#.. ###.. ###.. .....', 'x': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
};

const FONT={};for(const k in FD){FONT[k]=FD[k].split(' ').map(r=>(r+'.....').slice(0,5)).join('')}
const ACC={'Č':['C','v'],'Ć':['C',"'"],'Š':['S','v'],'Ž':['Z','v'],'Đ':['D','-']};
function text(s,x,y,col,sc=1,al=0){s=String(s).toUpperCase();const cw=6*sc;if(al===1)x-=Math.round((s.length*cw-sc)/2);else if(al===2)x-=s.length*cw-sc;x=Math.round(x);y=Math.round(y);
 for(let i=0;i<s.length;i++){let ch=s[i],acc=null;if(ACC[ch]){acc=ACC[ch][1];ch=ACC[ch][0]}const g=FONT[ch];if(!g)continue;
  cx.fillStyle=typeof col==='function'?col(i):col;const ox=x+i*cw;
  for(let j=0;j<35;j++)if(g.charCodeAt(j)===35)cx.fillRect(ox+(j%5)*sc,y+((j/5)|0)*sc,sc,sc);
  if(acc==='v'){cx.fillRect(ox+sc,y-2*sc,sc,sc);cx.fillRect(ox+3*sc,y-2*sc,sc,sc);cx.fillRect(ox+2*sc,y-sc,sc,sc)}
  else if(acc==="'"){cx.fillRect(ox+3*sc,y-2*sc,sc,sc);cx.fillRect(ox+2*sc,y-sc,sc,sc)}
  else if(acc==='-'){cx.fillRect(ox-sc,y+3*sc,sc,sc);cx.fillRect(ox+sc,y+3*sc,sc,sc)}}}
function textO(s,x,y,col,sc=1,al=0,oc='#000'){const o=Math.max(1,sc>>1);for(const d of [[-o,0],[o,0],[0,-o],[0,o],[o,o]])text(s,x+d[0],y+d[1],oc,sc,al);text(s,x,y,col,sc,al)}
const rainbow=i=>`hsl(${(i*40+T*200)%360},100%,62%)`;
let T=0;
// ---------- fit (integer-ish pixel scaling) ----------
let BTN={};
function fit(){UH=Math.round(Math.max(360,Math.min(480,UW*innerHeight/innerWidth)));UGY=UH-112;cv.width=UW;cv.height=UH;
 WH=Math.ceil(UH/ZM);WGY=Math.round(UGY/ZM);wc.width=WW;wc.height=WH;W=WW;H=WH;GY=WGY;
 const s=Math.min(innerWidth/UW,innerHeight/UH);cv.style.width=Math.floor(UW*s)+'px';cv.style.height=Math.floor(UH*s)+'px';cv.style.marginTop=Math.max(0,(innerHeight-UH*s)/2)+'px';
 BTN={jump:{x:6,y:UH-92,w:98,h:80},slide:{x:UW-104,y:UH-92,w:98,h:80},mute:{x:UW-26,y:4,w:22,h:20},go:{x:UW/2-62,y:UH/2+40,w:124,h:52}}}
addEventListener('resize',fit);fit();
// ---------- sound ----------
let ac=null;
function A(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(ac&&ac.state==='suspended')ac.resume();return ac}
function fart(len=0.6,base=90){const a=A();if(!a||muted)return;const t=a.currentTime;
 const o=a.createOscillator(),g=a.createGain(),f=a.createBiquadFilter(),l=a.createOscillator(),lg=a.createGain();
 o.type='sawtooth';o.frequency.setValueAtTime(base*1.4,t);o.frequency.exponentialRampToValueAtTime(base*0.6,t+len);
 l.frequency.value=18+Math.random()*14;lg.gain.value=base*0.5;l.connect(lg);lg.connect(o.frequency);
 f.type='lowpass';f.frequency.value=600;f.Q.value=6;
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.5,t+0.04);g.gain.setValueAtTime(0.45,t+len*0.7);g.gain.exponentialRampToValueAtTime(0.0001,t+len);
 o.connect(f);f.connect(g);g.connect(a.destination);o.start(t);l.start(t);o.stop(t+len+0.05);l.stop(t+len+0.05)}
function tone(f1,f2,len,type='sine',vol=0.3,delay=0){const a=A();if(!a||muted)return;const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();
 o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+len);
 g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+len);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+len+0.02)}
const sJump=()=>tone(300,700,0.2,'square',0.12),sSlide=()=>tone(500,150,0.25,'triangle',0.2),
 sCoin=p=>{tone(990*p,990*p,0.06,'square',0.08);tone(1320*p,1320*p,0.12,'square',0.08,0.06)},
 sHit=()=>tone(220,60,0.35,'sawtooth',0.25),
 sPow=()=>[523,659,784,1047].forEach((f,i)=>tone(f,f,0.1,'square',0.1,i*0.07)),
 sCombo=()=>[784,988,1175,1568].forEach((f,i)=>tone(f,f,0.08,'triangle',0.15,i*0.05));
// ---------- zones ----------
const ZONES=[
 {n:'LIVADA',sky:['#4fc3ff','#7fd6ff','#b5ecff'],gr:'#3fbf3f',gr2:'#2e8f2e',dirt:'#8a5a2b',low:['kamen','jez','lokva'],high:['ptica','grana']},
 {n:'GRAD',sky:['#ff7eb6','#ffa07a','#ffd27a'],gr:'#9aa0b4',gr2:'#6b7088',dirt:'#40435a',low:['cunj','kanta','hidrant'],high:['golub','balon']},
 {n:'KUHINJA',sky:['#ffe9a8','#fff3c9','#fff8e0'],gr:'#ffffff',gr2:'#e84a5f',dirt:'#b03040',low:['lonac','banana','sir'],high:['tava','kobasica']},
 {n:'SVEMIR',sky:['#0b0630','#1a0d50','#2b1470'],gr:'#9a7fd6',gr2:'#6a4fb0',dirt:'#3a2670',low:['meteor','vanz'],high:['nlo','raketa']}];
const ZLEN=250;
const zoneOf=d=>Math.floor(d/ZLEN)%ZONES.length;
// ---------- state ----------
const LEAD0=150,LEADMAX=170,PX=54;
let st='menu',S;
let best=+localStorage.getItem('smrdi-best')||0;
function reset(){S={t:0,dist:0,coins:0,speed:90,lead:LEAD0,y:0,vy:0,slide:0,stun:0,inv:0,obs:[],cs:[],pus:[],pt:[],pop:[],next:1.2,fartT:2,shake:0,flash:0,run:0,overT:0,scroll:0,
 zone:0,zoneT:0,pw:{maska:0,vent:0,patike:0,magnet:0},nextPu:7,chain:0,chainT:0,dodge:0,far:false,farT:0,bugFart:0,banner:'',bannerT:0}}
reset();
function pop(s,x,y,c='#fff',sc=1,life=1){S.pop.push({s,x:Math.max(s.length*3*sc+2,Math.min(W-s.length*3*sc-2,x)),y,c,sc,t:life})}
function burst(x,y,n,cols,spd=80,gr=220,life=.7){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(.3+Math.random()*.7)*spd;
 S.pt.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-spd*.3,t:(.5+Math.random()*.5)*life,c:cols[Math.random()*cols.length|0],g:gr,sz:Math.random()<.35?2:1})}
 if(S.pt.length>400)S.pt.splice(0,S.pt.length-400)}
function banner(s,t=1.6){S.banner=s;S.bannerT=t}
function jump(){if(st!=='play')return;if(S.y===0&&S.stun<=0){S.vy=-400;S.slide=0;sJump();burst(PX,GY,6,['#fff','#ddd'],40,100,.4)}}
function slide(){if(st!=='play'||S.stun>0)return;if(S.y<0)S.vy=Math.max(S.vy,320);S.slide=0.75;sSlide()}
function start(){A();reset();st='play';fart(0.9,80);banner(ZONES[0].n)}
// ---------- input ----------
const inB=(b,x,y)=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h;
let tStart=null;
function pt(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*UW/r.width,(e.clientY-r.top)*UH/r.height]}
cv.addEventListener('pointerdown',e=>{e.preventDefault();const[x,y]=pt(e);A();
 if(inB(BTN.mute,x,y)){muted=!muted;localStorage.setItem('smrdi-mute',muted?'1':'0');return}
 if(st==='menu'){start();return}
 if(st==='over'){if(S.overT>0.8&&inB(BTN.go,x,y))start();return}
 if(inB(BTN.jump,x,y)){jump();return}if(inB(BTN.slide,x,y)){slide();return}
 tStart={x,y,done:false}});
cv.addEventListener('pointermove',e=>{if(!tStart||tStart.done)return;const[x,y]=pt(e);const dy=y-tStart.y;
 if(dy<-16){jump();tStart.done=true}else if(dy>16){slide();tStart.done=true}});
cv.addEventListener('pointerup',()=>{if(tStart&&!tStart.done)jump();tStart=null});
addEventListener('keydown',e=>{A();if(['Space','ArrowUp','KeyW','ArrowDown','KeyS','Enter'].includes(e.code))e.preventDefault();
 if(st!=='play'){if(e.code==='Space'||e.code==='Enter'){if(st==='menu'||S.overT>0.8)start()}return}
 if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW')jump();if(e.code==='ArrowDown'||e.code==='KeyS')slide()});
// ---------- spawn ----------
const SIZE={kamen:[18,14],jez:[20,13],lokva:[28,5],cunj:[14,18],kanta:[16,19],hidrant:[14,18],lonac:[20,15],banana:[18,8],sir:[18,13],meteor:[18,16],vanz:[18,16],
 ptica:[22,14],grana:[34,10],golub:[22,14],balon:[30,22],tava:[28,10],kobasica:[16,22],nlo:[30,14],raketa:[30,12]};
function spawn(){const lvl=Math.min(1,S.t/120),z=ZONES[S.zone];const hi=S.t>8&&Math.random()<0.25+0.2*lvl;
 const k=hi?z.high[Math.random()*z.high.length|0]:z.low[Math.random()*z.low.length|0];const[w,h]=SIZE[k];
 const o={k,x:W+30,hi,w,h,hit:false,passed:false,y:hi?GY-22-h:GY-h};S.obs.push(o);
 const r=Math.random();
 if(!hi&&r<0.5)for(let i=0;i<3;i++)S.cs.push({x:o.x+w/2-18+i*18,y:GY-58-(i===1?10:0)});
 else if(r<0.75)for(let i=0;i<4;i++)S.cs.push({x:o.x+70+i*14,y:GY-14});
 S.nextPu-=1;if(S.nextPu<=0){S.nextPu=5+Math.random()*4;const ks=['maska','vent','patike','magnet'];S.pus.push({k:ks[Math.random()*4|0],x:o.x+w+60,y:GY-22})}
 S.next=Math.max(1.0,(1.9-1.0*lvl)+Math.random()*(1.1-0.4*lvl))}
// ---------- update ----------
function hitObs(o){o.hit=true;S.dodge=0;
 if(S.pw.patike>0||S.pw.maska>0){burst(o.x+o.w/2,o.y+o.h/2,18,['#ffe14d','#ff5ad1','#fff'],120);pop('BUM!',o.x+o.w/2,o.y-8,'#ffe14d',2);S.shake=.15;tone(200,80,.15,'square',.15);o.gone=true;return}
 S.stun=0.7;S.inv=1.6;S.lead-=25;S.shake=0.35;S.flash=.12;sHit();pop('AJOJ!',PX,GY-60+S.y,'#ff5a5a',2);
 burst(PX,GY-20+S.y,14,['#ffe14d','#fff','#ff9b3b'],100)}
function update(dt){T+=dt;S.t+=dt;
 for(const q of S.pt){q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.t-=dt}S.pt=S.pt.filter(q=>q.t>0);
 for(const q of S.pop){q.y-=16*dt;q.t-=dt}S.pop=S.pop.filter(q=>q.t>0);
 S.shake=Math.max(0,S.shake-dt);S.flash=Math.max(0,S.flash-dt);S.bannerT-=dt;
 if(st==='over'){S.overT+=dt;return}
 if(st!=='play'){S.run+=dt*8;S.scroll+=40*dt;return}
 const P=S.pw;for(const k in P)P[k]=Math.max(0,P[k]-dt);
 const target=90+Math.min(70,S.t*0.9);S.speed+=(target-S.speed)*dt;
 let v=S.speed*(S.stun>0?0.45:1)*(P.patike>0?1.5:1);S.dist+=v*dt/17;S.run+=dt*v/15;S.scroll+=v*dt;
 const z=zoneOf(S.dist);if(z!==S.zone){S.zone=z;banner(ZONES[z].n);sCombo();burst(W/2,80,30,['#ff5ad1','#ffe14d','#5af7ff','#7dff5a'],120,150,1.2)}
 // cloud
 if(S.stun>0){S.stun-=dt;if(P.maska<=0)S.lead-=35*dt}else S.lead=Math.min(LEADMAX,S.lead+10*dt+(P.patike>0?15*dt:0));
 if(P.vent>0)S.lead=Math.min(LEADMAX+30,S.lead+70*dt);else if(S.lead>LEADMAX)S.lead-=20*dt;
 if(S.inv>0)S.inv-=dt;
 // bug reaction when it falls far behind
 if(S.lead>=LEADMAX-4&&!S.far){S.far=true;S.farT=1.5;pop(['UF!','PUF!','ČEKAJ!'][Math.random()*3|0],22,GY-80,'#c6ff5a',2);fart(.5,140)}
 if(S.lead<LEADMAX-30)S.far=false;S.farT-=dt;
 S.fartT-=dt;if(S.fartT<=0){S.fartT=2.5+Math.random()*2;S.bugFart=.5;fart(0.4+Math.random()*.4,70+Math.random()*60)}S.bugFart-=dt;
 if(S.y<0||S.vy<0){S.vy+=1060*dt;S.y+=S.vy*dt;if(S.y>=0){S.y=0;S.vy=0;burst(PX,GY,4,['#fff'],30,60,.3)}}
 if(S.slide>0){S.slide-=dt;if(Math.random()<.5)S.pt.push({x:PX-6,y:GY-1,vx:-40,vy:-20,t:.3,c:'#fff',g:60,sz:1})}
 if(P.patike>0&&Math.random()<.7)S.pt.push({x:PX-8,y:GY-4-Math.random()*20+S.y,vx:-120,vy:0,t:.25,c:['#ff5ad1','#5af7ff','#ffe14d'][Math.random()*3|0],g:0,sz:2});
 S.next-=dt;if(S.next<=0)spawn();
 const pr=S.slide>0?{x:PX-12,y:GY-13,w:24,h:13}:{x:PX-6,y:GY-28+S.y,w:12,h:27};
 for(const o of S.obs){o.x-=v*dt;
  if(!o.hit&&S.inv<=0){const bx=o.hi?{x:o.x+2,y:o.y-200,w:o.w-4,h:o.h+200}:{x:o.x+3,y:o.y+2,w:o.w-6,h:o.h};
   if(pr.x<bx.x+bx.w&&pr.x+pr.w>bx.x&&pr.y<bx.y+bx.h&&pr.y+pr.h>bx.y)hitObs(o)}
  if(!o.passed&&o.x+o.w<PX-12){o.passed=true;if(!o.hit){S.dodge++;if(S.dodge%5===0){const w=['SUPER!','BRAVO!','JUHU!','IDEMO!'][(S.dodge/5-1)%4];pop(w,W/2,GY-70,rainbow,1,1.3);sCombo();burst(PX,GY-40,20,['#ffe14d','#ff5ad1','#5af7ff'],110)}}}}
 S.obs=S.obs.filter(o=>o.x>-60&&!o.gone);
 for(const c of S.cs){c.x-=v*dt;
  if(P.magnet>0){const dx=PX-c.x,dy=(pr.y+pr.h/2)-c.y,d=Math.hypot(dx,dy);if(d<110){c.x+=dx/d*260*dt;c.y+=dy/d*260*dt}}
  if(!c.got&&Math.abs(c.x-PX)<12&&Math.abs(c.y-(pr.y+pr.h/2))<pr.h/2+8){c.got=true;S.coins++;
   S.chain=S.chainT>0?S.chain+1:1;S.chainT=.7;sCoin(1+Math.min(S.chain,8)*.06);burst(c.x,c.y,5,['#ffe14d','#fff'],50,120,.4);
   if(S.chain%5===0){S.coins+=2;pop('x'+S.chain+'!',c.x,c.y-14,'#ffe14d',2);sCombo()}else pop('+1',c.x,c.y-10,'#ffe14d',1,.6)}}
 S.chainT-=dt;S.cs=S.cs.filter(c=>c.x>-20&&!c.got);
 for(const u of S.pus){u.x-=v*dt;if(!u.got&&Math.abs(u.x-PX)<14&&Math.abs(u.y-(pr.y+pr.h/2))<pr.h/2+12)power(u)}S.pus=S.pus.filter(u=>u.x>-20&&!u.got);
 if(S.lead<=0){S.lead=0;st='over';S.overT=0;fart(1.3,60);S.shake=.5;const sc=Math.floor(S.dist)+S.coins*10;if(sc>best){best=sc;S.newBest=true;localStorage.setItem('smrdi-best',best)}}}
function power(u){u.got=true;sPow();S.flash=.1;const P=S.pw;
 burst(u.x,u.y,24,['#5af7ff','#ff5ad1','#ffe14d','#fff'],120);
 if(u.k==='maska'){P.maska=6;S.inv=0;pop('MASKA!',PX,GY-70,'#7dff5a',2)}
 if(u.k==='vent'){P.vent=2.2;pop('FIJUU!',PX,GY-70,'#5af7ff',2);fart(.8,160)}
 if(u.k==='patike'){P.patike=4;pop('BRZO!',PX,GY-70,'#ff5ad1',2)}
 if(u.k==='magnet'){P.magnet=8;pop('MAGNET!',PX,GY-70,'#ff5a5a',2)}}
// ---------- backgrounds ----------
const hsh=n=>{n=(n*374761393+668265263)|0;n=(n^(n>>>13))*1274126177|0;return((n^(n>>>16))>>>0)/4294967296};
function layer(f,seg,fn){const off=S.scroll*f;const i0=Math.floor(off/seg);for(let i=i0;i<i0+Math.ceil(W/seg)+2;i++)fn(i*seg-off,i,hsh(i*7+Math.round(f*100)))}
function bg(){const z=ZONES[S.zone],sk=z.sky,bh=GY/3;sk.forEach((c,i)=>R(0,i*bh,W,Math.ceil(bh)+1,c));
 const zi=S.zone;
 if(zi===0){disc(180,40,14,'#fff27a');disc(180,40,10,'#ffe14d');
  layer(.05,90,(x,i,r)=>{ellipse(x+20,30+r*30,18,6,'#fff');ellipse(x+32,26+r*30,12,6,'#fff')});
  layer(.2,70,(x,i,r)=>ellipse(x+35,GY,40,26+r*24,'#5fd35f'));
  layer(.5,60,(x,i,r)=>{if(r<.5){R(x+28,GY-30,4,30,'#7a4a1f');disc(x+30,GY-36,12,'#2fae4a');disc(x+24,GY-30,8,'#3fcf5a')}else{for(let k=0;k<3;k++){R(x+10+k*12,GY-6,1,6,'#2e8f2e');disc(x+10+k*12,GY-7,2,['#ff5ad1','#ffe14d','#fff'][k])}}})}
 if(zi===1){disc(40,50,16,'#ffe9a0');
  layer(.15,40,(x,i,r)=>{const h=50+r*70;R(x,GY-h,36,h,'#b0507a');for(let a=0;a<4;a++)for(let b=0;b<Math.floor(h/14);b++)if(hsh(i*31+a*7+b)>.4)R(x+4+a*8,GY-h+5+b*14,4,6,'#ffe27a')});
  layer(.4,50,(x,i,r)=>{const h=40+r*50;R(x,GY-h,44,h,'#6a3a6a');for(let b=0;b<Math.floor(h/12);b++)R(x+6,GY-h+4+b*12,32,4,hsh(i+b)>.5?'#ffd27a':'#4a2a4a')});
  layer(1,80,(x,i,r)=>{R(x+40,GY-46,2,46,'#333');R(x+36,GY-48,10,3,'#333');R(x+37,GY-45,8,2,'#fff8a0')})}
 if(zi===2){layer(.15,72,(x,i,r)=>{R(x+4,20,64,60,'#ffb84d');R(x+6,22,60,56,'#ffcf7a');R(x+34,22,2,56,'#e09a3a');R(x+28,48,3,6,'#7a4a1f');R(x+38,48,3,6,'#7a4a1f')});
  R(0,GY-70,W,6,'#c96a2a');
  layer(.45,64,(x,i,r)=>{if(r<.4){R(x+10,GY-64,30,64,'#e8f4ff');R(x+12,GY-62,26,26,'#d0e6ff');R(x+34,GY-56,2,10,'#888');disc(x+20,GY-20,3,'#ff5a5a')}else{R(x+12,GY-80,6,10,'#fff');disc(x+15,GY-82,4,r<.7?'#ff5a5a':'#7dff5a');R(x+30,GY-78,10,8,'#5ab0ff')}})}
 if(zi===3){layer(.03,30,(x,i,r)=>{for(let k=0;k<3;k++){const yy=hsh(i*3+k)*(GY-20);R(x+hsh(i+k*9)*30,yy,1,1,(T*3+k+i)%3<1?'#fff':'#8a7fd6')}});
  layer(.08,150,(x,i,r)=>{const c=['#ff7ab6','#5af7ff','#ffb84d'][i%3];disc(x+60,60+r*80,10+r*14,c);if(r>.5)ellipse(x+60,60+r*80,24+r*14,3,'#ffe14d')});
  layer(.4,60,(x,i,r)=>{ellipse(x+30,GY,26,10+r*12,'#4a2a8a');disc(x+30,GY-4,4,'#3a1a70')})}
 // ground
 R(0,GY,W,H-GY,z.dirt);
 if(zi===2){const o=Math.floor(S.scroll)%16;for(let x=-o;x<W;x+=16){R(x,GY,8,8,z.gr);R(x+8,GY,8,8,z.gr2);R(x,GY+8,8,8,z.gr2);R(x+8,GY+8,8,8,z.gr)}}
 else{R(0,GY,W,6,z.gr);R(0,GY+6,W,2,z.gr2);const o=Math.floor(S.scroll)%12;for(let x=-o;x<W;x+=12){R(x,GY-1,2,1,z.gr);R(x+5,GY+10+(x&8?4:0),2,2,z.gr2)}}
 R(0,GY+18,W,1,'rgba(0,0,0,.25)')}
// ---------- sprites ----------
function kid(x,y){const f=Math.floor(S.run)%4,P=S.pw,blink=S.inv>0&&Math.floor(T*16)%2;if(blink)return;
 const skin='#ffcc99',hair='#6b3b1a',shirt=S.stun>0?'#ffa0a0':'#ff4d6d',pants='#2d6cdf',shoe=P.patike>0?((T*12|0)%2?'#ff5ad1':'#5af7ff'):'#fff';
 x=Math.round(x);y=Math.round(y);
 if(S.slide>0&&S.y===0){ // feet-first slide
  R(x-2,y-6,12,4,pants);R(x+9,y-5,4,3,shoe);R(x-8,y-10,10,6,shirt);R(x-12,y-14,8,8,skin);R(x-12,y-15,8,3,hair);R(x-13,y-13,2,4,hair);R(x-7,y-12,1,1,'#000');R(x-6,y-9,2,1,'#c33');R(x-2,y-12,6,2,skin);
  if(P.maska>0)mask(x-8,y-10);return}
 const bob=S.y===0&&f%2?1:0;y+=bob;
 // legs
 if(S.y<0){R(x-4,y-11,3,6,pants);R(x+1,y-11,3,6,pants);R(x-5,y-6,4,2,shoe);R(x+1,y-6,4,2,shoe)}
 else{const a=[-3,-1,2,1][f],b=-a;R(x-2+a,y-11,3,9,pants);R(x-2+b,y-11,3,9,pants);R(x-3+a,y-2,5,2,shoe);R(x-3+b,y-2,5,2,shoe)}
 R(x-5,y-12,10,3,pants);R(x-5,y-20,10,9,shirt);R(x-1,y-18,3,3,'#fff');
 // arms
 const sw=S.y<0?-4:[-2,0,2,0][f];R(x-7,y-19+sw,3,7,skin);R(x+5,y-19-sw,3,7,skin);
 // head
 R(x-5,y-29,10,9,skin);R(x-5,y-30,10,3,hair);R(x-6,y-29,3,5,hair);R(x+5,y-29,1,2,hair);R(x+2,y-26,2,2,'#000');R(x+3,y-26,1,1,'#fff');
 R(x+1,y-22,3,1,S.stun>0?'#000':'#c33');if(S.stun>0)R(x+2,y-23,1,2,'#000');
 if(P.maska>0)mask(x,y-24)}
function mask(x,y){R(x-1,y-2,7,6,'#8a9aa8');disc(x+6,y+1,3,'#5a6a78');R(x+5,y,2,2,'#2a3a48');R(x-5,y-3,3,2,'#5a6a78');R(x+1,y-4,4,3,'#5af7ff')}
function bug(x,y,s=1,far=false){x=Math.round(x);y=Math.round(y);const lw=Math.floor(T*14)%2;
 cx.save();cx.translate(x,y);cx.scale(s,s);
 for(let i=0;i<3;i++){R(-8+i*7,4+(lw^(i&1)),2,5,'#2a1a08');R(-9+i*7,8+(lw^(i&1)),3,1,'#2a1a08')}
 ellipse(0,0,14,9,'#5a7a1a');ellipse(0,-1,13,8,'#8fb02a');R(-1,-8,2,16,'#5a7a1a');disc(-6,-3,2,'#c9e05a');disc(5,-4,1,'#c9e05a');disc(-3,3,1,'#c9e05a');
 disc(13,-2,6,'#6a4a1a');const ex=Math.sin(T*3)*.5;geye(12,-5,3,1,ex);geye(17,-5,3,1,ex);
 line(12,-8,9,-16+Math.sin(T*8)*2,'#2a1a08');line(16,-8,19,-16+Math.cos(T*8)*2,'#2a1a08');
 if(far||S.farT>0){R(14,0,5,1,'#000');R(16,1,2,3,'#ff5a8a');disc(22,-12,1,'#5af7ff');R(22,-15,1,2,'#5af7ff')}else R(14,1,6,1,'#000'),R(14,0,1,1,'#000'),R(19,0,1,1,'#000');
 cx.restore()}
function cloudDraw(cxp){const tops=GY-110;cx.globalAlpha=.55;
 R(-10,tops,cxp+10,GY-tops+18,'#7dbf2a');
 for(let i=0;i<9;i++){const yy=tops+i*14+Math.sin(T*3+i)*3;disc(cxp+Math.sin(T*2+i*1.7)*5,yy,12+(i%3)*3,'#9be15d')}
 cx.globalAlpha=.8;for(let i=0;i<6;i++){disc(cxp-10-i*16+Math.sin(T*4+i)*3,tops+20+((i*37)%80),4,'#c6ff5a')}
 cx.globalAlpha=1;
 // stink lines
 for(let i=0;i<4;i++){const xx=cxp+4+i*4,yy=tops+20+i*25+Math.sin(T*6+i)*3;for(let k=0;k<6;k++)R(xx+Math.round(Math.sin(T*8+k+i)*2),yy+k*2,1,1,'#3a7a0a')}}
function obstacle(o){const x=Math.round(o.x),y=Math.round(o.y),w=o.w,h=o.h,k=o.k,t=T;
 const hang=(c)=>R(x+w/2,y-200,1,200,c);
 switch(k){
 case'kamen':ellipse(x+9,y+8,9,7,'#8a8a9a');ellipse(x+8,y+6,6,4,'#aaaabc');geye(x+5,y+7,2,-1,0);break;
 case'jez':ellipse(x+10,y+9,10,5,'#7a4a2a');for(let i=0;i<7;i++)line(x+2+i*3,y+6,x+i*3,y,'#4a2a10');disc(x+1,y+10,2,'#ffcc99');R(x-1,y+10,1,1,'#000');break;
 case'lokva':ellipse(x+14,y+3,14,2,'#3a8aff');R(x+6,y+2,6,1,'#9fd0ff');break;
 case'cunj':for(let i=0;i<h;i++)R(x+7-i/3,y+i,1+i/1.5,1,(i>>2)%2?'#fff':'#ff7a1a');R(x,y+h-2,w,2,'#ff7a1a');break;
 case'kanta':R(x+1,y+3,14,16,'#4a8a5a');R(x,y+1,16,3,'#2a6a3a');R(x+5,y,6,1,'#2a6a3a');R(x+4,y+7,1,9,'#2a6a3a');R(x+10,y+7,1,9,'#2a6a3a');R(x+12,y-2+Math.sin(t*10),3,3,'#ffe14d');break;
 case'hidrant':R(x+3,y+4,8,14,'#ff3a3a');R(x+2,y+1,10,3,'#c02020');R(x,y+8,14,3,'#c02020');geye(x+5,y+7,1);geye(x+9,y+7,1);break;
 case'lonac':R(x+2,y+4,16,11,'#9aa0b4');R(x,y+5,20,2,'#6b7088');R(x+4,y+1,12,3,'#6b7088');for(let i=0;i<3;i++)R(x+5+i*5,y-4-((t*8+i*3)%6),1,3,'#fff');break;
 case'banana':for(let i=0;i<18;i++)R(x+i,y+Math.round(Math.abs(i-9)*.5),1,4,'#ffe14d');R(x,y,2,2,'#5a3a10');geye(x+9,y+5,1);break;
 case'sir':for(let i=0;i<h;i++)R(x+(h-i),y+i,w-(h-i),1,'#ffd23a');disc(x+12,y+8,2,'#e0a020');disc(x+16,y+11,1,'#e0a020');geye(x+9,y+6,2,1);break;
 case'meteor':ellipse(x+9,y+8,9,8,'#a05a3a');disc(x+6,y+6,2,'#7a3a2a');disc(x+12,y+11,2,'#7a3a2a');for(let i=0;i<3;i++)R(x+18+i*3,y+3+i*4,4,1,'#ffb84d');break;
 case'vanz':ellipse(x+9,y+10,9,6,'#7dff5a');geye(x+9,y+7,3,-1,0);line(x+5,y+4,x+3,y,'#7dff5a');line(x+13,y+4,x+15,y,'#7dff5a');R(x+7,y+13,4,1,'#000');break;
 case'ptica':case'golub':{const c=k==='ptica'?'#ff8c42':'#9aa0b4',f=Math.sin(t*14)>0;ellipse(x+12,y+8,10,6,c);R(x+6,f?y-2:y+8,10,4,k==='ptica'?'#ffb07a':'#c0c4d0');geye(x+4,y+6,2,-1);R(x-3,y+8,4,2,'#ffe14d');break}
 case'grana':hang('#7a4a1f');R(x,y+3,w,5,'#7a4a1f');for(let i=0;i<4;i++)disc(x+4+i*9,y+2,4,'#2fae4a');break;
 case'balon':hang('#555');for(let i=0;i<3;i++)disc(x+5+i*10,y+10+(i===1?-3:0),6,['#ff5a8a','#5ab0ff','#ffe14d'][i]);break;
 case'tava':ellipse(x+10,y+5,10,5,'#333');ellipse(x+10,y+4,7,3,'#555');R(x+19,y+4,10,2,'#7a4a1f');disc(x+10,y+3,2,'#ffe14d');break;
 case'kobasica':hang('#ddd');ellipse(x+8,y+11,6,11,'#c0502a');R(x+5,y+4,2,4,'#ff8a6a');geye(x+8,y+12,2,-1);break;
 case'nlo':ellipse(x+15,y+9,15,4,'#9aa0b4');ellipse(x+15,y+5,7,5,'#5af7ff');geye(x+15,y+4,2,0,1);for(let i=0;i<4;i++)R(x+4+i*7,y+10,2,2,(t*8+i|0)%2?'#ffe14d':'#ff5ad1');break;
 case'raketa':R(x+4,y+3,20,7,'#eee');poly([[x+24,y+3],[x+30,y+6],[x+24,y+10]],'#ff3a3a');R(x+2,y+1,4,11,'#ff3a3a');disc(x+16,y+6,2,'#5ab0ff');R(x-4,y+4+(t*20|0)%2,6,4,'#ffb84d');break}}
function poly(pts,c){cx.fillStyle=c;cx.beginPath();cx.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))cx.lineTo(p[0],p[1]);cx.closePath();cx.fill()}
function coinD(c){const s=Math.abs(Math.cos(T*5+c.x/30)),w=Math.max(1,Math.round(5*s));ellipse(c.x,c.y,w,5,'#c08000');ellipse(c.x,c.y,Math.max(0,w-1),4,'#ffcc00');if(w>2)R(c.x-1,c.y-3,1,4,'#fff6a0')}
function puIcon(k,x,y){x=Math.round(x);y=Math.round(y);
 if(k==='maska'){ellipse(x,y,6,5,'#8a9aa8');disc(x+2,y+3,3,'#5a6a78');R(x-4,y-2,3,2,'#5af7ff');R(x+1,y-2,3,2,'#5af7ff')}
 if(k==='vent'){const a=T*20;R(x,y+2,1,6,'#333');for(let i=0;i<3;i++){const an=a+i*2.09;line(x,y,x+Math.cos(an)*6,y+Math.sin(an)*6,'#5af7ff')}disc(x,y,1,'#fff')}
 if(k==='patike'){R(x-6,y,10,4,'#ff5ad1');R(x-6,y-3,5,3,'#ff5ad1');R(x-6,y+4,12,2,'#fff');R(x-3,y-1,1,1,'#fff')}
 if(k==='magnet'){R(x-5,y-5,3,9,'#ff3a3a');R(x+2,y-5,3,9,'#ff3a3a');R(x-5,y+2,10,3,'#ff3a3a');R(x-5,y-6,3,2,'#ddd');R(x+2,y-6,3,2,'#ddd')}}
function puD(u){const yy=u.y+Math.sin(T*4+u.x/20)*3;const p=(T*6|0)%2;disc(u.x,yy,10,p?'#fff':'#5af7ff');disc(u.x,yy,9,'#1a1040');puIcon(u.k,u.x,yy)}
// ---------- UI ----------
function button(b,label,up){box(b.x,b.y,b.w,b.h,up?'#ffb627':'#4fc3f7','#000','rgba(0,0,0,.4)');R(b.x+3,b.y+3,b.w-6,3,'rgba(255,255,255,.45)');
 const mx=b.x+b.w/2|0,my=b.y+30;for(let i=0;i<14;i++){const w=i*2+1;R(mx-i,up?my-10+i:my+10-i,w,1,'#fff')}
 textO(label,mx,b.y+b.h-20,'#fff',2,1)}
function muteBtn(){const b=BTN.mute;box(b.x,b.y,b.w,b.h,'#fff','#000');const x=b.x+5,y=b.y+10;R(x,y-2,3,5,'#222');for(let i=0;i<5;i++)R(x+3+i,y-2-i,1,5+i*2,'#222');
 if(muted){line(x+10,y-4,x+15,y+4,'#e33');line(x+15,y-4,x+10,y+4,'#e33')}else{R(x+10,y-2,1,5,'#222');R(x+12,y-4,1,9,'#222')}}
function hud(){box(4,4,54,18,'#1a1040','#000');ellipse(14,13,4,4,'#ffcc00');textO(S.coins,22,10,'#ffe14d',1);
 box(62,4,66,18,'#1a1040','#000');textO(Math.floor(S.dist)+'M',95,10,'#5af7ff',1,1);
 const d=1-Math.max(0,Math.min(LEADMAX,S.lead))/LEADMAX;box(4,25,124,9,'#1a1040','#000');R(6,27,Math.max(3,120*d),5,d>0.6?((T*8|0)%2?'#ff3a3a':'#ff9b3b'):'#7dff5a');
 let i=0;for(const k of ['maska','vent','patike','magnet']){const v=S.pw[k];if(v>0){const x=148+i*0,y=14+i*20;box(132+i*0,4+i*22,40,18,'#1a1040','#000');puIcon(k,142,13+i*22);
  const mx={maska:6,vent:2.2,patike:4,magnet:8}[k];R(152,10+i*22,Math.ceil(16*v/mx),5,'#ffe14d');i++}}}
function draw(){const sx=S.shake>0?Math.round((Math.random()-.5)*6):0,sy=S.shake>0?Math.round((Math.random()-.5)*6):0;
 cx=wcx;W=WW;H=WH;GY=WGY;cx.setTransform(1,0,0,1,sx,sy);cx.imageSmoothingEnabled=false;
 bg();for(const o of S.obs)obstacle(o);for(const c of S.cs)coinD(c);for(const u of S.pus)puD(u);
 if(st!=='menu'){const cxp=Math.round(PX-14-Math.min(LEADMAX,S.lead)*.38);
  kid(PX,GY+S.y);cloudDraw(cxp);
  const bx=Math.min(cxp+2,PX-30),by=GY-8+(Math.floor(T*10)%2);bug(bx,by,1,S.lead>=LEADMAX-4);
  if(S.bugFart>0){for(let i=0;i<4;i++)disc(bx-16-i*5-(.5-S.bugFart)*30,by-2+Math.sin(i*2)*3,3+i,'rgba(155,225,93,.8)')}}
 for(const q of S.pt)R(q.x,q.y,q.sz,q.sz,q.c);
 for(const q of S.pop){if(q.t<.25&&((T*20)|0)%2)continue;textO(q.s,q.x,q.y,q.c,q.sc,1)}
 cx.setTransform(1,0,0,1,0,0);
 cx=mcx;W=UW;H=UH;GY=UGY;cx.imageSmoothingEnabled=false;cx.drawImage(wc,0,0,WW,WH,0,0,WW*ZM,WH*ZM);
 if(S.bannerT>0&&st==='play'){const k=Math.min(1,(1.6-S.bannerT)*6);textO(S.banner,W/2,70,rainbow,k<1?4:3,1)}
 if(S.flash>0){cx.globalAlpha=S.flash*4;R(0,0,W,H,'#fff');cx.globalAlpha=1}
 if(st==='menu'){cx.globalAlpha=.35;R(0,0,W,H,'#1a1040');cx.globalAlpha=1;
  textO('BJEŽI OD',W/2,40,'#fff',3,1);textO('SMRDIBUBE!',W/2,72,rainbow,3,1);
  cx.globalAlpha=.7;for(let i=0;i<5;i++)disc(W/2-40-i*12+Math.sin(T*3+i)*4,160+Math.cos(T*2+i)*6,14-i*2,'#9be15d');cx.globalAlpha=1;
  bug(W/2,160,2);kidMenu();
  const p=(T*3|0)%2;disc(W/2,GY+38,26+p,'#000');disc(W/2,GY+37,24+p,'#ff3a6a');for(let i=0;i<20;i++)R(W/2-8+i,GY+37-Math.round(10-i/2),1,Math.round(21-i),'#fff');
  if(best)textO('★ '+best,W/2,H-30,'#ffe14d',2,1)}
 if(st==='play'||st==='over'){hud();if(st==='play'){button(BTN.jump,'SKOK',true);button(BTN.slide,'KLIZI',false)}}
 if(st==='over'){const k=Math.min(1,S.overT*2);cx.globalAlpha=.8*k;R(0,0,W,H,'#2e5a12');cx.globalAlpha=1;
  textO('FUJ!',W/2,46,'#c6ff5a',Math.max(1,Math.round(7*k)),1,'#000');
  const fy=H/2-60;disc(W/2,fy,30*k,'#c9f27a');if(k>=1){R(W/2-12,fy-8,6,2,'#222');R(W/2+6,fy-8,6,2,'#222');ellipse(W/2,fy+12,8,4,'#222');R(W/2-3,fy-2,6,6,'#7ec83c');for(let i=0;i<5;i++)disc(W/2-40+i*20,fy-34+Math.sin(T*4+i)*3,4,'#9be15d')}
  textO(Math.floor(S.dist)+'M',W/2-30,H/2-14,'#5af7ff',2,1);ellipse(W/2+22,H/2-8,5,5,'#ffcc00');textO(S.coins,W/2+32,H/2-14,'#ffe14d',2,0);
  if(S.newBest)textO('★ '+best+' ★',W/2,H/2+14,rainbow,2,1);
  if(S.overT>0.8){const b=BTN.go;box(b.x,b.y,b.w,b.h,'#ffb627','#000','rgba(0,0,0,.4)');R(b.x+3,b.y+3,b.w-6,3,'rgba(255,255,255,.45)');
   textO('OPET!',b.x+b.w/2+10,b.y+b.h/2-7,'#fff',3,1);for(let i=0;i<8;i++){R(b.x+14+i,b.y+b.h/2-7+i,1,15-i*2,'#fff')}}}
 muteBtn();W=WW;H=WH;GY=WGY;cx=wcx}
function kidMenu(){const sv=S.y,ss=S.slide;S.y=0;S.slide=0;kid(W/2+50,GY);S.y=sv;S.slide=ss}
let last=performance.now();
function loop(n){const dt=Math.min(0.05,(n-last)/1000);last=n;update(dt);try{draw()}catch(e){console.error(e)}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
window.__sb={get S(){return S},get st(){return st},start,jump,slide,give:k=>power({k,x:PX,y:GY-20}),zone:z=>{S.dist=z*ZLEN+1}};
})();
