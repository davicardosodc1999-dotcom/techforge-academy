document.addEventListener("DOMContentLoaded",()=>{
const A=document.getElementById("skill-arena"),C=document.getElementById("skill-maze"),F=document.getElementById("skill-fireworks"),I=document.getElementById("skill-intro"),R=document.getElementById("skill-result"),B=document.getElementById("skill-start-btn"),P=document.getElementById("skill-player"),SL=document.getElementById("skill-start-label"),EL=document.getElementById("skill-end-label"),S=document.getElementById("skill-status"),T=document.getElementById("skill-stage-title"),D=[...document.querySelectorAll(".skill-stage-indicator span")],Reset=document.getElementById("skill-reset");
if(!A||!C||!F||!I||!R||!B)return;
const X=C.getContext("2d"),FX=F.getContext("2d"),reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const stages=[
{name:"SIGNAL",w:58,p:[[.10,.72],[.27,.72],[.27,.34],[.50,.34],[.50,.60],[.72,.60],[.72,.27],[.90,.27]]},
{name:"DIAGNOSE",w:50,p:[[.10,.22],[.33,.22],[.33,.52],[.18,.52],[.18,.79],[.52,.79],[.52,.29],[.74,.29],[.74,.60],[.90,.60]]},
{name:"REPAIR",w:43,p:[[.10,.77],[.23,.77],[.23,.24],[.43,.24],[.43,.59],[.61,.59],[.61,.18],[.79,.18],[.79,.72],[.90,.72]]}
];
let n=0,armed=false,active=false,dpr=1;
const rect=()=>A.getBoundingClientRect();
function points(){const r=rect();return stages[n].p.map(([x,y])=>[x*r.width,y*r.height])}
function resize(){const r=rect();dpr=Math.max(1,devicePixelRatio||1);[C,F].forEach(c=>{c.width=Math.round(r.width*dpr);c.height=Math.round(r.height*dpr);c.style.width=r.width+"px";c.style.height=r.height+"px"});X.setTransform(dpr,0,0,dpr,0,0);FX.setTransform(dpr,0,0,dpr,0,0);draw()}
function draw(){const r=rect(),p=points(),st=stages[n];X.clearRect(0,0,r.width,r.height);X.lineCap="round";X.lineJoin="round";
for(const [w,col,blur] of [[st.w+20,"rgba(0,229,255,.08)",0],[st.w,"rgba(0,229,255,.55)",16],[2,"rgba(235,253,255,.9)",0]]){X.beginPath();p.forEach((q,i)=>i?X.lineTo(...q):X.moveTo(...q));X.lineWidth=w;X.strokeStyle=col;X.shadowColor="#00e5ff";X.shadowBlur=blur;X.stroke();X.shadowBlur=0}
const a=p[0],b=p[p.length-1];SL.style.left=a[0]-29+"px";SL.style.top=a[1]-16+"px";EL.style.left=b[0]-29+"px";EL.style.top=b[1]-16+"px"}
function dist(px,py,x1,y1,x2,y2){const vx=x2-x1,vy=y2-y1,wx=px-x1,wy=py-y1,l=vx*vx+vy*vy;let t=l?(wx*vx+wy*vy)/l:0;t=Math.max(0,Math.min(1,t));const x=x1+t*vx,y=y1+t*vy;return Math.hypot(px-x,py-y)}
function onPath(x,y){const p=points(),lim=stages[n].w/2-4;for(let i=0;i<p.length-1;i++)if(dist(x,y,...p[i],...p[i+1])<=lim)return true;return false}
const near=(x,y,p,r)=>Math.hypot(x-p[0],y-p[1])<=r;
function load(i){n=i;armed=active=false;A.classList.remove("running","signal-lost");P.style.opacity="0";T.textContent=stages[i].name;S.textContent=`STAGE ${i+1}/3 // MOVE TO START`;D.forEach((d,j)=>d.classList.toggle("active",j<=i));draw()}
window.__skillGameLoadStage=load;
function lose(){active=armed=false;A.classList.remove("running","signal-lost");void A.offsetWidth;A.classList.add("signal-lost");S.textContent="SIGNAL LOST // RETURN TO START"}
function move(e){if(!I.hidden||!R.hidden)return;const r=rect(),x=e.clientX-r.left,y=e.clientY-r.top;P.style.left=x+"px";P.style.top=y+"px";const p=points();if(!armed){if(near(x,y,p[0],stages[n].w*.72)){armed=active=true;A.classList.add("running");S.textContent="SIGNAL ACTIVE // STAY ON THE CIRCUIT"}return}if(!active)return;if(!onPath(x,y)){lose();return}if(near(x,y,p[p.length-1],stages[n].w*.72))finish()}
function finish(){active=armed=false;A.classList.remove("running");if(n<2){S.textContent="STAGE COMPLETE // NEXT CIRCUIT";setTimeout(()=>load(n+1),650)}else{S.textContent="DIAGNOSTIC COMPLETE";celebrate()}}
function celebrate(){if(!reduced)fireworks();setTimeout(()=>{R.hidden=false;R.style.display="flex";R.innerHTML='<span>DIAGNOSTIC COMPLETE</span><strong>YOU CLEARED ALL 3 STAGES.</strong><p>Nice control. Ready to turn that curiosity into a real repair skill?</p><a class="game-button" href="course-android.html">START THE FREE ANDROID COURSE →</a>'},reduced?200:1050)}
function fireworks(){const r=rect(),q=[],colors=["#00e5ff","#fff","#00a8ff","#7b5cff","#00e38c"];for(let b=0;b<7;b++){const cx=r.width*(.12+Math.random()*.76),cy=r.height*(.12+Math.random()*.52);for(let i=0;i<36;i++){const a=Math.PI*2*i/36,sp=1.5+Math.random()*3.7;q.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:1,z:1+Math.random()*2.5,c:colors[Math.floor(Math.random()*colors.length)]})}}let f=0;(function anim(){FX.clearRect(0,0,r.width,r.height);q.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.035;p.l-=.015;FX.globalAlpha=Math.max(0,p.l);FX.fillStyle=p.c;FX.shadowColor=p.c;FX.shadowBlur=12;FX.beginPath();FX.arc(p.x,p.y,p.z,0,Math.PI*2);FX.fill()});FX.globalAlpha=1;FX.shadowBlur=0;if(++f<82)requestAnimationFrame(anim);else FX.clearRect(0,0,r.width,r.height)})()}
B.addEventListener("click",()=>{I.hidden=true;I.style.display="none";R.hidden=true;R.style.display="none";load(0);S.textContent="MOVE TO START // THEN FOLLOW THE CIRCUIT"});
Reset?.addEventListener("click",()=>{I.hidden=false;I.style.display="flex";R.hidden=true;R.style.display="none";load(0);S.textContent="READY // 3 STAGES"});
document.addEventListener("pointermove",function(e){
const r=A.getBoundingClientRect();
if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){move(e);}
});
document.addEventListener("pointerdown",function(e){
const r=A.getBoundingClientRect();
if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){move(e);}
});addEventListener("resize",resize,{passive:true});resize();
});