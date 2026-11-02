/* Jiani's — shared behaviour. Vanilla JS, no dependencies. */
(()=>{
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,$=(s,c=document)=>[...c.querySelectorAll(s)];
const hdr=$('.hdr')[0],root=document.documentElement;
/* Brand intro (first page of a session only) */
const it=document.getElementById('intro');if(it){setTimeout(()=>it.classList.add('go'),rm?150:1000);setTimeout(()=>it.classList.add('gone'),rm?350:1650)}
/* Seamless marquees + count-up numbers */
$('.mq>div').forEach(d=>d.innerHTML+=d.innerHTML);
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const el=e.target,n=+el.dataset.count,suf=el.dataset.suf||'';if(rm){el.textContent=n+suf;return}let s=null;const f=ts=>{s=s||ts;const p=Math.min((ts-s)/1500,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+suf;p<1&&requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.6});
$('[data-count]').forEach(e=>co.observe(e));

/* Word-mask headline reveals: wraps each word of [data-split] */
function split(el){let i=0;(function walk(n){[...n.childNodes].forEach(c=>{
 if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.append(' ');return}
  const m=document.createElement('span');m.className='m';const s=document.createElement('span');s.style.setProperty('--i',i++);s.textContent=w;m.append(s);f.append(m)});c.replaceWith(f)}
 else if(c.nodeType===1&&!c.classList.contains('brush'))walk(c)})})(el)}
$('[data-split]').forEach(split);

/* Scroll-triggered reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
$('.rv,.imgrv,[data-split],.brush').forEach(e=>io.observe(e));

/* Hero: photo carousel in the arch frame + drifting embers */
const arch=$('.arch img'),cap=document.getElementById('archcap'),caps=['Stone-baked','Hand stretched','Homemade tiramisu'];let ai=0;
if(arch.length>1&&!rm)setInterval(()=>{arch[ai].classList.remove('on');ai=(ai+1)%arch.length;arch[ai].classList.add('on');if(cap)cap.textContent=caps[ai]},3200);
const cv=$('.embers')[0];
if(cv&&!rm){const c=cv.getContext('2d');let W,H,P=[];const rs=()=>{W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight};rs();addEventListener('resize',rs);
 const mk=()=>({x:Math.random()*W,y:H+Math.random()*60,r:Math.random()*2.2+.6,v:Math.random()*.7+.25,d:Math.random()*2-1,a:Math.random()*.7+.3,t:Math.random()*6});
 for(let i=0;i<Math.min(46,W/30);i++){const p=mk();p.y=Math.random()*H;P.push(p)}
 (function f(){c.clearRect(0,0,W,H);P.forEach(p=>{p.y-=p.v;p.t+=.03;p.x+=Math.sin(p.t)*.4+p.d*.15;if(p.y<-10){Object.assign(p,mk())}
  const g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);g.addColorStop(0,'rgba(255,190,80,'+(p.a*.6)+')');g.addColorStop(1,'rgba(217,40,30,0)');c.fillStyle=g;c.beginPath();c.arc(p.x,p.y,p.r*4,0,6.283);c.fill()});if(!document.hidden)requestAnimationFrame(f);else setTimeout(f,300)})()}
/* Header state, hero zoom, gentle photo parallax (one rAF loop) */
const hero=$('.hero')[0],par=$('[data-par]');let t=false;
const pend=new Set($('.rv,.imgrv,[data-split]'));
function frame(){t=false;const y=scrollY;pend.forEach(e=>{if(e.classList.contains('in'))pend.delete(e);else if(e.getBoundingClientRect().bottom<0){e.classList.add('in');pend.delete(e)}});hdr.classList.toggle('solid',y>40||!hero);
 if(hero&&!rm){hero.style.setProperty('--p',Math.min(y/innerHeight,1).toFixed(3))}
 if(!rm)par.forEach(p=>{const r=p.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;p.style.setProperty('--y',((r.top+r.height/2-innerHeight/2)*-.06).toFixed(1)+'px')})}
addEventListener('scroll',()=>{if(!t){t=true;requestAnimationFrame(frame)}},{passive:true});frame();

/* Mobile menu */
const b=$('.burger')[0],nav=$('.nav')[0];
function menu(o){document.body.classList.toggle('menu-open',o);b.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''}
b&&(b.onclick=()=>menu(!document.body.classList.contains('menu-open')));
addEventListener('keydown',e=>{if(e.key==='Escape')menu(false)});

/* Page transitions: fade out, then navigate */
$('a[href]').forEach(a=>{const h=a.getAttribute('href');if(!h||/^(https?:|mailto:|tel:|#)/.test(h)||a.target)return;
 a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||rm)return;e.preventDefault();document.body.classList.add('leaving');setTimeout(()=>location.href=h,320)})});
addEventListener('pageshow',e=>{if(e.persisted)document.body.classList.remove('leaving')});

/* Next Friday pop-up status (5:30pm–9:00pm) */
const lv=document.getElementById('lv');
if(lv){const u=()=>{const n=new Date(),d=(5-n.getDay()+7)%7,o=new Date(n);o.setDate(n.getDate()+d);o.setHours(17,30,0,0);const c=new Date(o);c.setHours(21,0,0,0);
 if(n>=o&&n<c){lv.textContent='Open now at Stanmore Place until 9pm';return}
 let x=o;if(n>=c){x=new Date(o);x.setDate(o.getDate()+7)}const ms=x-n,dd=Math.floor(ms/864e5),hh=Math.floor(ms%864e5/36e5);
 lv.textContent='Next pop-up in '+(dd?dd+' day'+(dd>1?'s':'')+' ':'')+hh+'h · Friday 5:30pm'};u();setInterval(u,6e4)}

/* Enquiry form: validation + confirmation state */
const f=document.getElementById('fm');
if(f){const today=new Date().toISOString().split('T')[0];f.date.min=today;
 const rules={name:v=>v.trim()?'':'Please tell us your name.',email:v=>/^\S+@\S+\.\S+$/.test(v)?'':'Please enter a valid email address.',
  phone:v=>/^[+\d][\d\s()+-]{6,}$/.test(v.trim())?'':'Please enter a phone number we can reach you on.',date:v=>v?'':'Please choose your event date.',
  loc:v=>v.trim()?'':'Please tell us where the event is.',type:v=>v?'':'Please choose an event type.',guests:v=>+v>0?'':'Please give an estimated guest number.'};
 const check=k=>{const el=f[k],m=rules[k](el.value);el.setAttribute('aria-invalid',!!m);document.getElementById('e-'+k).textContent=m;return !m};
 Object.keys(rules).forEach(k=>f[k].addEventListener('blur',()=>check(k)));
 f.addEventListener('submit',e=>{e.preventDefault();if(f.website.value)return;const bad=Object.keys(rules).filter(k=>!check(k));
  if(bad.length){f[bad[0]].focus();return}
  /* TODO (WordPress launch): post to Fluent Forms / WPForms with SMTP delivery. */
  f.hidden=true;const d=document.getElementById('done');d.classList.add('show');d.focus()})}
})();
