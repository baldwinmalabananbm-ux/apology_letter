/*────────────────────────
  UTILITIES
────────────────────────*/
const $ = s => document.querySelector(s);
const envelope = $('#envelope');
const hint     = $('#hint');
const replyBtn = $('#reply-btn');
const overlay  = $('#modal-overlay');
const replyTxt = $('#reply-text');
const toast    = $('#toast');
const themeBtn = $('#btn-theme');

/*────────────────────────
  DATE
────────────────────────*/
$('#letter-date').textContent = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

/*────────────────────────
  THEME TOGGLE
────────────────────────*/
function setTheme(mode){document.documentElement.setAttribute('data-theme', mode);localStorage.setItem('theme',mode);}
const savedTheme = localStorage.getItem('theme');
if(savedTheme) setTheme(savedTheme);

themeBtn.addEventListener('click',()=>{const cur=document.documentElement.getAttribute('data-theme');setTheme(cur==='dark'?'light':'dark');});

/*────────────────────────
  GSAP ENVELOPE TIMELINE
────────────────────────*/
let opened=false;
const tl=gsap.timeline({paused:true})
 .to('.flap',{duration:0.7,rotateX:-180,ease:'power2.inOut'})
 .to('.seal',{duration:0.4,scale:0,autoAlpha:0},'<+0.1')
 .to('.letter',{duration:0.8,yPercent:-88,scaleY:1,ease:'power3.out'},'-=0.2')
 .from(['.letter-date','.letter-salutation','.letter-body','.letter-sign'],{duration:0.6,autoAlpha:0,y:8,stagger:0.12},'-=0.4');

function openEnvelope(){if(opened) return;opened=true;tl.play();envelope.classList.add('open');hint.classList.add('hidden');spawnHearts(envelope);setTimeout(()=>replyBtn.classList.add('show'),2000);} 

envelope.addEventListener('click',openEnvelope);
envelope.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')openEnvelope();});

/*────────────────────────
  PARTICLE BACKGROUND
────────────────────────*/
const canvas = $('#bg-canvas');const ctx = canvas.getContext('2d');
let W,H,particles=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
const SYMBOLS=['♥','✦','✿','·'];
function createParticle(){return{x:Math.random()*W,y:H+10,sym:SYMBOLS[Math.random()*SYMBOLS.length|0],size:Math.random()*14+7,speed:Math.random()*0.5+0.2,alpha:Math.random()*0.5+0.1,drift:(Math.random()-0.5)*0.4,rot:Math.random()*Math.PI*2,rotSpeed:(Math.random()-0.5)*0.015};}
for(let i=0;i<55;i++){const p=createParticle();p.y=Math.random()*H;particles.push(p);} 
function animateParticles(){ctx.clearRect(0,0,W,H);particles.forEach((p,i)=>{p.y-=p.speed;p.x+=p.drift;p.rot+=p.rotSpeed;if(p.y<-20)particles[i]=createParticle();ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.alpha;ctx.fillStyle=p.sym==='♥'?getComputedStyle(document.documentElement).getPropertyValue('--rose'):getComputedStyle(document.documentElement).getPropertyValue('--gold');ctx.font=`${p.size}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.sym,0,0);ctx.restore();});requestAnimationFrame(animateParticles);}animateParticles();

/*────────────────────────
  HEART BURST
────────────────────────*/
function spawnHearts(el){const rect=el.getBoundingClientRect();const cx=rect.left+rect.width/2;const cy=rect.top+rect.height/2;const symbols=['💕','💗','💖','♥','💓'];for(let i=0;i<12;i++){setTimeout(()=>{const h=document.createElement('div');h.className='heart-float';h.textContent=symbols[Math.random()*symbols.length|0];h.style.left=cx+(Math.random()-0.5)*160+'px';h.style.top=cy+(Math.random()-0.5)*80+'px';h.style.fontSize=Math.random()*16+12+'px';document.body.appendChild(h);setTimeout(()=>h.remove(),2400);},i*90);}}

/*────────────────────────
  REPLY MODAL & TOAST
────────────────────────*/
replyBtn.addEventListener('click',()=>{overlay.classList.add('active');replyTxt.focus();});
$('#btn-cancel').addEventListener('click',()=>overlay.classList.remove('active'));
overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('active');});
$('#btn-send').addEventListener('click',()=>{const val=replyTxt.value.trim();if(!val){replyTxt.style.borderColor='var(--rose)';return;}overlay.classList.remove('active');replyTxt.value='';replyTxt.style.borderColor='';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3200);for(let i=0;i<3;i++){setTimeout(()=>spawnHearts({getBoundingClientRect:()=>({left:W/2,top:H*0.6,width:0,height:0})}),i*400);}});
