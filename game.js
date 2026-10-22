'use strict';
(()=>{
const W=360,GY=440;let H=640; // logical size, ground line
const cv=document.getElementById('c'),cx=cv.getContext('2d');
let sc=1;
function fit(){const dpr=Math.min(window.devicePixelRatio||1,3);H=Math.max(600,Math.min(820,W*innerHeight/innerWidth));sc=Math.min(innerWidth/W,innerHeight/H);if(typeof BTN!=='undefined')layout();
cv.style.marginTop=Math.max(0,(innerHeight-H*sc)/2)+'px';cv.style.width=W*sc+'px';cv.style.height=H*sc+'px';cv.width=W*sc*dpr;cv.height=H*sc*dpr;cx.setTransform(sc*dpr,0,0,sc*dpr,0,0);}
addEventListener('resize',fit);
const Q=new URLSearchParams(location.search);
let muted=Q.has('mute')||localStorage.getItem('smrdi-mute')==='1';
// ---------- sound ----------
let ac=null;
function A(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(ac&&ac.state==='suspended')ac.resume();return ac}
function fart(len=0.6,base=90){const a=A();if(!a||muted)return;const t=a.currentTime;
 const o=a.createOscillator(),g=a.createGain(),f=a.createBiquadFilter(),l=a.createOscillator(),lg=a.createGain();
 o.type='sawtooth';o.frequency.setValueAtTime(base*1.4,t);o.frequency.exponentialRampToValueAtTime(base*0.6,t+len);
 l.frequency.value=18+Math.random()*14;lg.gain.value=base*0.5;l.connect(lg);lg.connect(o.frequency);
 f.type='lowpass';f.frequency.value=600;f.Q.value=6;
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.5,t+0.04);g.gain.setValueAtTime(0.45,t+len*0.7);g.gain.exponentialRampToValueAtTime(0.0001,t+len);
 o.connect(f);f.connect(g);g.connect(a.destination);o.start(t);l.start(t);o.stop(t+len+0.05);l.stop(t+len+0.05);}
function tone(f1,f2,len,type='sine',vol=0.3){const a=A();if(!a||muted)return;const t=a.currentTime,o=a.createOscillator(),g=a.createGain();
 o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+len);
 g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+len);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+len+0.02);}
const sJump=()=>tone(300,700,0.2,'square',0.12),sSlide=()=>tone(500,150,0.25,'triangle',0.2),
 sCoin=()=>{tone(990,990,0.08,'square',0.1);setTimeout(()=>tone(1320,1320,0.15,'square',0.1),70)},
 sHit=()=>tone(220,60,0.35,'sawtooth',0.25);
// ---------- state ----------
const LEAD0=150,LEADMAX=170;
let st='menu',S; // menu | play | over
let best=+localStorage.getItem('smrdi-best')||0;
function reset(){S={t:0,dist:0,coins:0,speed:200,lead:LEAD0,y:0,vy:0,slide:0,stun:0,inv:0,obs:[],cs:[],parts:[],next:1.2,nextC:0.8,fartT:2,shake:0,run:0,overT:0,puffs:[]}}
reset();
const PX=170; // player x
function jump(){if(st!=='play')return;if(S.y===0&&S.stun<=0){S.vy=-640;S.slide=0;sJump()}}
function slide(){if(st!=='play')return;if(S.stun>0)return;if(S.y<0){S.vy=Math.max(S.vy,500)}S.slide=0.75;sSlide()}
function start(){A();reset();st='play';fart(0.9,80)}
// ---------- input ----------
const BTN={jump:{x:14,w:160,h:112},slide:{x:W-174,w:160,h:112},mute:{x:W-58,y:10,w:48,h:48},go:{x:W/2-120,y:430,w:240,h:100}};
function layout(){const by=Math.max(GY+40,H-140);BTN.jump.y=BTN.slide.y=by}
fit();layout();
const inB=(b,x,y)=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h;
let tStart=null;
function pt(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/sc,(e.clientY-r.top)/sc]}
cv.addEventListener('pointerdown',e=>{e.preventDefault();const[x,y]=pt(e);A();
 if(inB(BTN.mute,x,y)){muted=!muted;localStorage.setItem('smrdi-mute',muted?'1':'0');return}
 if(st==='menu'){start();return}
 if(st==='over'){if(S.overT>0.8&&inB(BTN.go,x,y))start();return}
 if(inB(BTN.jump,x,y)){jump();return}if(inB(BTN.slide,x,y)){slide();return}
 tStart={x,y,done:false};});
cv.addEventListener('pointermove',e=>{if(!tStart||tStart.done)return;const[x,y]=pt(e);const dy=y-tStart.y;
 if(dy<-30){jump();tStart.done=true}else if(dy>30){slide();tStart.done=true}});
cv.addEventListener('pointerup',e=>{if(tStart&&!tStart.done)jump();tStart=null});
addEventListener('keydown',e=>{A();if(['Space','ArrowUp','KeyW','ArrowDown','KeyS','Enter'].includes(e.code))e.preventDefault();
 if(st!=='play'){if(e.code==='Space'||e.code==='Enter'){if(st==='menu'||S.overT>0.8)start()}return}
 if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW')jump();if(e.code==='ArrowDown'||e.code==='KeyS')slide();});
// ---------- spawn ----------
const LOW=['kamen','kutija','jez','lokva'],HIGH=['grana','ptica','balon'];
function spawn(){const lvl=Math.min(1,S.t/120);const hi=S.t>8&&Math.random()<0.25+0.2*lvl;
 const k=hi?HIGH[Math.random()*HIGH.length|0]:LOW[Math.random()*LOW.length|0];
 const o={k,x:W+40,hi,w:hi?70:(k==='lokva'?60:44),h:hi?44:(k==='lokva'?14:44),hit:false};
 o.y=hi?GY-98:GY-o.h;S.obs.push(o);
 if(!hi&&Math.random()<0.5)for(let i=0;i<3;i++)S.cs.push({x:o.x-20+i*30,y:GY-150-(i===1?20:0),got:false});
 S.next=Math.max(0.85,(1.9-1.0*lvl)+Math.random()*(1.1-0.4*lvl));}
// ---------- update ----------
function update(dt){S.t+=dt;
 if(st==='over'){S.overT+=dt;S.puffs.forEach(p=>{p.a+=dt*2});return}
 if(st!=='play'){S.run+=dt*8;return}
 const target=200+Math.min(170,S.t*2.2);S.speed+=(target-S.speed)*dt;
 let v=S.speed*(S.stun>0?0.45:1);S.dist+=v*dt/40;S.run+=dt*v/25;
 // cloud: closes in while stunned, recovers otherwise
 if(S.stun>0){S.stun-=dt;S.lead-=35*dt}else S.lead=Math.min(LEADMAX,S.lead+10*dt);
 if(S.inv>0)S.inv-=dt;
 if(S.y<0||S.vy<0){S.vy+=1700*dt;S.y+=S.vy*dt;if(S.y>=0){S.y=0;S.vy=0}}
 if(S.slide>0)S.slide-=dt;
 S.next-=dt;if(S.next<=0)spawn();
 const pr=S.slide>0?{x:PX-26,y:GY-34,w:52,h:34}:{x:PX-16,y:GY-74+S.y,w:32,h:72};
 for(const o of S.obs){o.x-=v*dt;
  if(!o.hit&&S.inv<=0){const bx=o.hi?{x:o.x,y:o.y-200,w:o.w,h:o.h+200}:{x:o.x+4,y:o.y+4,w:o.w-8,h:o.h};
   if(pr.x<bx.x+bx.w&&pr.x+pr.w>bx.x&&pr.y<bx.y+bx.h&&pr.y+pr.h>bx.y){o.hit=true;S.stun=0.7;S.inv=1.6;S.lead-=25;S.shake=0.3;sHit();
    for(let i=0;i<8;i++)S.parts.push({x:PX,y:GY-50+S.y,vx:(Math.random()-.5)*200,vy:-Math.random()*200,l:0.6,c:'#ffd93b'})}}}
 S.obs=S.obs.filter(o=>o.x>-120);
 for(const c of S.cs){c.x-=v*dt;if(!c.got&&Math.abs(c.x-PX)<26&&Math.abs(c.y-(pr.y+pr.h/2))<pr.h/2+16){c.got=true;S.coins++;sCoin();
  for(let i=0;i<5;i++)S.parts.push({x:c.x,y:c.y,vx:(Math.random()-.5)*150,vy:-Math.random()*150,l:0.4,c:'#fff36b'})}}
 S.cs=S.cs.filter(c=>c.x>-30&&!c.got);
 S.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.l-=dt});S.parts=S.parts.filter(p=>p.l>0);
 S.fartT-=dt;if(S.fartT<=0){S.fartT=3+Math.random()*3;fart(0.4+Math.random()*0.5,70+Math.random()*60);
  for(let i=0;i<6;i++)S.puffs.push({x:cloudX()-30,y:GY-60-Math.random()*120,r:20+Math.random()*20,vx:60+Math.random()*60,l:1.4})}
 S.puffs.forEach(p=>{p.x+=p.vx*dt;p.r+=12*dt;p.l-=dt});S.puffs=S.puffs.filter(p=>p.l>0);
 if(S.shake>0)S.shake-=dt;
 if(S.lead<=0){S.lead=0;st='over';S.overT=0;fart(1.3,60);const sc=Math.floor(S.dist)+S.coins*10;if(sc>best){best=sc;localStorage.setItem('smrdi-best',best)}}}
const cloudX=()=>PX-20-S.lead; // front edge of cloud
// ---------- draw helpers ----------
function rr(x,y,w,h,r,f){cx.beginPath();cx.roundRect(x,y,w,h,r);cx.fillStyle=f;cx.fill()}
function circ(x,y,r,f){cx.beginPath();cx.arc(x,y,r,0,7);cx.fillStyle=f;cx.fill()}
function txt(s,x,y,size,f='#fff',stroke='#3a2a1a'){cx.font=`900 ${size}px "Arial Rounded MT Bold",system-ui,sans-serif`;cx.textAlign='center';cx.textBaseline='middle';
 cx.lineWidth=size/6;cx.strokeStyle=stroke;cx.lineJoin='round';cx.strokeText(s,x,y);cx.fillStyle=f;cx.fillText(s,x,y)}
function bg(){const g=cx.createLinearGradient(0,0,0,GY);g.addColorStop(0,'#6cc6ff');g.addColorStop(1,'#d4f1ff');cx.fillStyle=g;cx.fillRect(0,0,W,GY);
 circ(300,80,34,'#ffe45c');
 const off=(S.dist*8)%400;
 for(let i=0;i<3;i++){const x=i*200-off*0.5%200;circ(x+40,110+i*20,22,'#fff');circ(x+70,100+i*20,28,'#fff');circ(x+100,112+i*20,20,'#fff')}
 cx.fillStyle='#7fd36b';for(let i=-1;i<5;i++){const x=i*120-(S.dist*14)%120;cx.beginPath();cx.ellipse(x+60,GY,90,70,0,Math.PI,0);cx.fill()}
 rr(0,GY,W,H-GY,0,'#5cb84a');rr(0,GY,W,14,0,'#8be06c');
 cx.fillStyle='#4a9a3b';for(let i=0;i<14;i++){const x=i*30-(S.dist*40)%30;cx.fillRect(x,GY+30,10,5);cx.fillRect(x+12,GY+60,8,4)}}
function kid(x,y){const sl=S.slide>0&&st==='play',r=S.run;cx.save();cx.translate(x,y);
 if(S.inv>0&&((S.inv*12|0)%2))cx.globalAlpha=0.45;
 if(sl){rr(-30,-30,60,26,13,'#ff5a5f');circ(22,-28,15,'#ffd2a8');circ(27,-30,3,'#222');cx.fillStyle='#6b3a1e';cx.beginPath();cx.arc(20,-34,15,Math.PI,0);cx.fill();rr(-36,-10,20,10,5,'#2d6cdf');}
 else{const a=Math.sin(r)*0.7*(y<GY-1?0.3:1);
  cx.strokeStyle='#2d6cdf';cx.lineWidth=10;cx.lineCap='round';
  cx.beginPath();cx.moveTo(0,-24);cx.lineTo(Math.sin(a)*18,-2);cx.moveTo(0,-24);cx.lineTo(-Math.sin(a)*18,-2);cx.stroke();
  rr(-15,-56,30,36,12,'#ff5a5f');
  cx.strokeStyle='#ffd2a8';cx.lineWidth=8;cx.beginPath();cx.moveTo(0,-48);cx.lineTo(-Math.sin(a)*20,-32);cx.stroke();
  circ(0,-72,18,'#ffd2a8');cx.fillStyle='#6b3a1e';cx.beginPath();cx.arc(0,-76,18,Math.PI,0);cx.fill();
  circ(8,-72,3.5,'#222');circ(-2,-72,3.5,'#222');
  // pinched nose / worried mouth when cloud is close
  if(S.lead<70){circ(14,-66,5,'#9be15d');txt('!',0,-104,22,'#ffd93b')}else{cx.strokeStyle='#a33';cx.lineWidth=2.5;cx.beginPath();cx.arc(4,-64,5,0.2,2.9);cx.stroke()}}
 cx.restore()}
function bug(x,y,s=1,flip=false){cx.save();cx.translate(x,y);cx.scale(flip?-s:s,s);const w=Math.sin(S.run*1.5)*3;
 cx.strokeStyle='#3a2210';cx.lineWidth=4;for(let i=-1;i<=1;i++){cx.beginPath();cx.moveTo(i*14,8);cx.lineTo(i*14+w-4,26);cx.stroke()}
 cx.fillStyle='#7b4a2a';cx.beginPath();cx.ellipse(0,0,36,26,0,0,7);cx.fill();
 cx.fillStyle='#a06a3c';cx.beginPath();cx.moveTo(-34,0);cx.lineTo(0,-26);cx.lineTo(34,0);cx.closePath();cx.fill();
 cx.strokeStyle='#5a3418';cx.lineWidth=3;cx.beginPath();cx.moveTo(0,-26);cx.lineTo(0,24);cx.stroke();
 circ(38,-4,16,'#5a3418');circ(42,-9,7,'#fff');circ(44,-9,3.5,'#111');circ(34,-9,6,'#fff');circ(35,-9,3,'#111');
 cx.strokeStyle='#5a3418';cx.lineWidth=3;cx.beginPath();cx.moveTo(42,-18);cx.quadraticCurveTo(52,-36,60,-30);cx.moveTo(36,-18);cx.quadraticCurveTo(40,-38,48,-38);cx.stroke();
 cx.strokeStyle='#2a1508';cx.lineWidth=2.5;cx.beginPath();cx.arc(44,2,6,0.1,2.8);cx.stroke(); // grin
 cx.restore()}
function cloud(){const fx=cloudX(),t=S.t;
 for(let i=0;i<9;i++){const yy=GY-30-i*44,r=50+Math.sin(t*3+i)*6;circ(fx-30+Math.sin(t*2+i*1.7)*10,yy,r,'rgba(126,200,60,0.85)')}
 cx.fillStyle='rgba(110,185,50,0.92)';cx.fillRect(-10,0,fx-30,GY);
 for(let i=0;i<6;i++)circ(fx-80+Math.sin(t*4+i)*8,GY-60-i*60,4,'rgba(80,140,30,0.9)');
 for(const p of S.puffs){cx.globalAlpha=Math.max(0,p.l/1.4)*0.8;circ(p.x,p.y,p.r,'#9be15d');cx.globalAlpha=1}
 bug(Math.max(40,fx-70),GY-34+Math.sin(t*6)*3,0.9);
 // stink lines
 cx.strokeStyle='rgba(70,120,20,0.8)';cx.lineWidth=3;for(let i=0;i<3;i++){const sx=fx-10+i*6,sy=GY-180+i*50;cx.beginPath();cx.moveTo(sx,sy);for(let k=1;k<5;k++)cx.lineTo(sx+k*6,sy+Math.sin(t*8+k+i)*6);cx.stroke()}}
function obstacle(o){const x=o.x,y=o.y;
 if(o.k==='kamen'){cx.fillStyle='#8d8d99';cx.beginPath();cx.ellipse(x+22,y+26,24,20,0,0,7);cx.fill();circ(x+14,y+20,4,'#b5b5c2');circ(x+28,y+26,3,'#222');circ(x+16,y+28,3,'#222')}
 else if(o.k==='kutija'){rr(x,y,44,44,4,'#d9963b');cx.strokeStyle='#9a5f1e';cx.lineWidth=4;cx.strokeRect(x+4,y+4,36,36);cx.beginPath();cx.moveTo(x+4,y+4);cx.lineTo(x+40,y+40);cx.stroke()}
 else if(o.k==='jez'){cx.fillStyle='#6b4a32';for(let i=0;i<7;i++){cx.beginPath();cx.moveTo(x+4+i*6,y+30);cx.lineTo(x+6+i*6,y+4);cx.lineTo(x+12+i*6,y+30);cx.fill()}
  cx.beginPath();cx.ellipse(x+22,y+32,22,13,0,0,7);cx.fill();circ(x+40,y+34,7,'#e8c39e');circ(x+42,y+31,2,'#111');circ(x+47,y+35,2.5,'#111')}
 else if(o.k==='lokva'){cx.fillStyle='#6b4a32';cx.beginPath();cx.ellipse(x+30,y+10,32,9,0,0,7);cx.fill();circ(x+20,y+6,3,'#8a6a50')}
 else if(o.k==='grana'){rr(x-10,y+12,o.w+20,18,9,'#7a4b25');for(let i=0;i<4;i++)circ(x+i*22,y+8,14,'#3fa34d');cx.strokeStyle='#7a4b25';cx.lineWidth=6;cx.beginPath();cx.moveTo(x+o.w/2,y+12);cx.lineTo(x+o.w/2+10,y-200);cx.stroke()}
 else if(o.k==='ptica'){const f=Math.sin(S.t*14)*14;cx.fillStyle='#ff8c42';cx.beginPath();cx.ellipse(x+35,y+22,26,17,0,0,7);cx.fill();
  cx.fillStyle='#ffb07a';cx.beginPath();cx.moveTo(x+30,y+18);cx.lineTo(x+10,y+4-f);cx.lineTo(x+45,y+14);cx.fill();circ(x+14,y+16,4,'#fff');circ(x+13,y+16,2,'#111');
  cx.fillStyle='#ffd93b';cx.beginPath();cx.moveTo(x+8,y+20);cx.lineTo(x-6,y+24);cx.lineTo(x+8,y+27);cx.fill()}
 else if(o.k==='balon'){cx.strokeStyle='#555';cx.lineWidth=2;cx.beginPath();cx.moveTo(x+35,y+40);cx.lineTo(x+35,y-200);cx.stroke();
  for(let i=0;i<3;i++){circ(x+12+i*23,y+20,18,['#ff5a8a','#5ab0ff','#ffd93b'][i])}}}
function coin(c){const s=Math.abs(Math.cos(S.t*5+c.x/40));cx.save();cx.translate(c.x,c.y);cx.scale(Math.max(0.2,s),1);circ(0,0,13,'#ffcc00');circ(0,0,9,'#ffe45c');cx.restore()}
function button(b,label,arrowUp){rr(b.x,b.y+6,b.w,b.h,28,'rgba(0,0,0,0.25)');rr(b.x,b.y,b.w,b.h,28,arrowUp?'#ffb627':'#4fc3f7');
 cx.fillStyle='#fff';cx.beginPath();const mx=b.x+b.w/2,my=b.y+40;
 if(arrowUp){cx.moveTo(mx-24,my+14);cx.lineTo(mx,my-16);cx.lineTo(mx+24,my+14)}else{cx.moveTo(mx-24,my-14);cx.lineTo(mx,my+16);cx.lineTo(mx+24,my-14)}cx.closePath();cx.fill();
 txt(label,mx,b.y+b.h-24,26)}
function muteBtn(){const b=BTN.mute;rr(b.x,b.y,b.w,b.h,14,'rgba(255,255,255,0.8)');const x=b.x+10,y=b.y+24;
 cx.fillStyle='#333';cx.beginPath();cx.moveTo(x,y-7);cx.lineTo(x+8,y-7);cx.lineTo(x+18,y-15);cx.lineTo(x+18,y+15);cx.lineTo(x+8,y+7);cx.lineTo(x,y+7);cx.fill();
 cx.strokeStyle=muted?'#e33':'#333';cx.lineWidth=3;cx.beginPath();
 if(muted){cx.moveTo(x+22,y-8);cx.lineTo(x+32,y+8);cx.moveTo(x+32,y-8);cx.lineTo(x+22,y+8)}else{cx.arc(x+20,y,8,-1,1);cx.moveTo(x+26,y-12);cx.arc(x+20,y,14,-1,1)}cx.stroke()}
// ---------- draw ----------
function draw(){cx.save();if(S.shake>0)cx.translate((Math.random()-.5)*10,(Math.random()-.5)*10);
 bg();for(const o of S.obs)obstacle(o);for(const c of S.cs)coin(c);
 if(st!=='menu'){kid(PX,GY+S.y);cloud()}
 for(const p of S.parts){circ(p.x,p.y,4,p.c)}
 cx.restore();
 if(st==='menu'){cx.fillStyle='rgba(110,185,50,0.35)';cx.fillRect(0,0,W,H);
  txt('BJEŽI OD',W/2,120,40,'#fff');txt('SMRDIBUBE!',W/2,172,50,'#9be15d','#2e4d12');
  bug(W/2-10,300,2.2);for(let i=0;i<4;i++)circ(W/2-110-i*18+Math.sin(S.t*3+i)*6,300+Math.cos(S.t*2+i)*10,26-i*4,'rgba(155,225,93,0.9)');
  const p=1+Math.sin(S.t*5)*0.06;cx.save();cx.translate(W/2,500);cx.scale(p,p);circ(0,0,62,'#ff5a5f');circ(0,0,54,'#ff7a7f');
  cx.fillStyle='#fff';cx.beginPath();cx.moveTo(-18,-28);cx.lineTo(30,0);cx.lineTo(-18,28);cx.fill();cx.restore();
  if(best)txt('★ '+best,W/2,600,26,'#ffe45c');}
 if(st==='play'||st==='over'){
  // HUD: distance + coins, danger meter
  rr(10,10,140,48,16,'rgba(255,255,255,0.85)');circ(34,34,13,'#ffcc00');circ(34,34,9,'#ffe45c');txt(String(S.coins),80,35,28,'#ffb000','#5a3a00');
  rr(160,10,130,48,16,'rgba(255,255,255,0.85)');txt(Math.floor(S.dist)+'m',225,35,26,'#2d6cdf','#0d2b66');
  // danger bar
  const d=1-Math.max(0,S.lead)/LEADMAX;rr(10,66,280,14,7,'rgba(255,255,255,0.7)');rr(12,68,Math.max(10,276*d),10,5,d>0.6?'#e84a2a':'#7ec83c');bug(14+276*d,73,0.28);
  if(st==='play'){button(BTN.jump,'SKOK',true);button(BTN.slide,'KLIZI',false)}}
 if(st==='over'){const k=Math.min(1,S.overT*2);cx.fillStyle=`rgba(110,185,50,${0.75*k})`;cx.fillRect(0,0,W,H);
  cx.save();cx.translate(W/2,250);cx.scale(k,k);circ(0,0,80,'#c9f27a');circ(-28,-16,10,'#222');circ(28,-16,10,'#222');
  cx.strokeStyle='#222';cx.lineWidth=6;cx.beginPath();cx.arc(0,40,26,Math.PI+0.3,-0.3);cx.stroke();
  cx.fillStyle='#7ec83c';rr(-12,-6,24,18,8,'#7ec83c');cx.restore();
  txt('FUJ!',W/2,120,80*k,'#9be15d','#2e4d12');
  txt(Math.floor(S.dist)+'m   ●'+S.coins,W/2,370,30,'#fff');
  if(S.overT>0.8){const b=BTN.go,p=1+Math.sin(S.t*5)*0.05;cx.save();cx.translate(W/2,b.y+b.h/2);cx.scale(p,p);
   rr(-b.w/2,-b.h/2+6,b.w,b.h,30,'rgba(0,0,0,0.25)');rr(-b.w/2,-b.h/2,b.w,b.h,30,'#ffb627');
   cx.strokeStyle='#fff';cx.lineWidth=7;cx.beginPath();cx.arc(-62,0,20,0.6,5.6);cx.stroke();cx.fillStyle='#fff';cx.beginPath();cx.moveTo(-40,-14);cx.lineTo(-50,4);cx.lineTo(-34,4);cx.fill();
   txt('OPET!',22,2,44);cx.restore()}}
 muteBtn()}
let last=performance.now();
function loop(n){const dt=Math.min(0.05,(n-last)/1000);last=n;update(dt);try{draw()}catch(e){console.error(e)}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
window.__sb={get S(){return S},get st(){return st},start,jump,slide};
})();
