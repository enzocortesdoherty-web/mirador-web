(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const header=$('#siteHeader'),progress=$('#progress'),hero=$('.hero-scroll'),heroImg=$('.hero-image'),heroContent=$('.hero-content');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let scheduled=false;
function updateScroll(){scheduled=false;const top=window.scrollY;const range=Math.max(1,document.documentElement.scrollHeight-innerHeight);progress.style.width=(top/range*100)+'%';header.classList.toggle('scrolled',top>40);
 const heroRange=Math.max(1,hero.offsetHeight-innerHeight);
 const hp=Math.min(1,Math.max(0,top/heroRange));
 // La portada permanece a pantalla completa. Tres vistas se funden mientras avanza el scroll.
 const slides=$$('.hero-slide');const stops=[0,.5,1];
 slides.forEach((slide,i)=>{const weight=Math.max(0,1-Math.abs(hp-stops[i])/.5);slide.style.opacity=String(i===0?Math.max(0,1-hp*2):i===2?Math.max(0,(hp-.5)*2):weight)});
 const selected=hp<.25?0:hp<.75?1:2;
 $$('.hero-slide-indicator span').forEach((dot,i)=>dot.classList.toggle('is-current',i===selected));
 if(!reduceMotion){
  heroContent.style.setProperty('--hero-opacity',Math.max(.4,1-Math.max(0,hp-.72)*1.7).toFixed(2));
  $$('[data-parallax]').forEach(el=>{const rect=el.parentElement.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;const shift=(rect.top+rect.height/2-innerHeight/2)/innerHeight;el.style.setProperty('--parallax-y',(shift*-46*Number(el.dataset.parallax)/.13).toFixed(1)+'px')})
 }
}

addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});addEventListener('resize',updateScroll);updateScroll();
const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');io.unobserve(entry.target)}})},{threshold:.12,rootMargin:'0px 0px -30px 0px'});$$('.reveal').forEach(el=>io.observe(el));
const menu=$('#menuBtn'),nav=$('#nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const gallery=$('#gallery');$('#galleryPrev').addEventListener('click',()=>gallery.scrollBy({left:-gallery.clientWidth*.72,behavior:reduceMotion?'instant':'smooth'}));$('#galleryNext').addEventListener('click',()=>gallery.scrollBy({left:gallery.clientWidth*.72,behavior:reduceMotion?'instant':'smooth'}));

const facilities={
 padel:{name:'Canchas de pádel',kicker:'DEPORTE · RAQUETA',desc:'Un espacio para compartir la energía de cada partido, desde el primer saque hasta el último punto.',visual:'photo',image:'assets/padel-mirador-club.png'},
 tenis:{name:'Canchas de tenis',kicker:'DEPORTE · RAQUETA',desc:'Disfruta el tenis en un entorno pensado para entrenar, mejorar tu juego y vivir cada encuentro.',visual:'photo',image:'assets/tenis-mirador-club.png'},
 futbol:{name:'Canchas de fútbol',kicker:'DEPORTE · EQUIPO',desc:'El lugar para reunirte con tu equipo, competir y disfrutar cada partido.',visual:'photo',image:'assets/futbol-mirador-club.png'},
 pickleball:{name:'Canchas de pickleball',kicker:'DEPORTE · RAQUETA',desc:'Una experiencia dinámica y social, ideal para descubrir una nueva forma de jugar.',visual:'photo',image:'assets/pickleball-mirador-club.png'},
 petanca:{name:'Petanca',kicker:'DEPORTE · CONVIVENCIA',desc:'Estrategia, precisión y buenos momentos en una actividad para disfrutar a tu ritmo.',visual:'photo',image:'assets/petanca-mirador-club.png'}
};
const visual=$('#facilityVisual'),stage=$('#activeStage'),facilityTabs=$$('[data-facility]');let facilityFade;
facilityTabs.forEach((tab,index)=>tab.addEventListener('click',()=>{
 if(tab.getAttribute('aria-selected')==='true')return;
 const item=facilities[tab.dataset.facility];
 facilityTabs.forEach(t=>t.setAttribute('aria-selected',String(t===tab)));
 clearTimeout(facilityFade);stage.classList.add('is-switching');
 facilityFade=setTimeout(()=>{
  visual.className='facility-visual '+(item.visual==='photo'?'facility-photo':'facility-diagram visual-'+item.visual);
  visual.style.backgroundImage=item.image?`url('${item.image}')`:'';
  visual.setAttribute('aria-label',item.image?'Vista de las canchas de pádel':'Ilustración esquemática de '+item.name.toLowerCase());
  $('#facilityName').textContent=item.name;$('#facilityKicker').textContent=item.kicker;$('#facilityDescription').textContent=item.desc;
  $('#facilityCounter').textContent=String(index+1).padStart(2,'0')+' / 05';
  stage.classList.remove('is-switching');
 },reduceMotion?0:180);
}));

const phases=[{src:'assets/padel.webp',alt:'Cancha de pádel de Mirador Club',status:'FASE 01 · ACTIVA',title:'El punto de juego',desc:'Pádel, tenis, fútbol, pickleball y petanca en funcionamiento.'},{src:'assets/stadium.webp',alt:'Visualización de espacios deportivos en expansión',status:'FASE 02 · PRÓXIMAMENTE',title:'La expansión',desc:'Ampliación de espacios y experiencias del proyecto.'},{src:'assets/club.webp',alt:'Visualización arquitectónica de la casa club',status:'FASE 03 · VISIÓN FINAL',title:'Mirador Club',desc:'La integración de deporte, bienestar, convivencia y comunidad.'}];
let phaseTimer;const preview=$('#phasePreview');$$('[data-phase]').forEach(tab=>tab.addEventListener('click',()=>{const i=Number(tab.dataset.phase);if(tab.getAttribute('aria-selected')==='true')return;$$('[data-phase]').forEach(t=>t.setAttribute('aria-selected',String(t===tab)));preview.classList.add('changing');clearTimeout(phaseTimer);phaseTimer=setTimeout(()=>{const p=phases[i];$('#phaseImage').src=p.src;$('#phaseImage').alt=p.alt;$('#phaseStatus').textContent=p.status;$('#phaseTitle').textContent=p.title;$('#phaseDesc').textContent=p.desc;preview.classList.remove('changing')},reduceMotion?0:260)}));
const form=$('#contactForm'),message=$('#formMessage');
form.addEventListener('submit',async e=>{
 e.preventDefault();
 if(!form.reportValidity()){message.textContent='Revisa los campos obligatorios antes de enviar.';return}
 const button=form.querySelector('[type="submit"]');
 button.disabled=true;message.textContent='Enviando solicitud…';
 try{
  const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'},credentials:'same-origin'});
  const data=await response.json();
  if(!response.ok||!data.ok)throw new Error(data.message||'No se pudo enviar tu solicitud.');
  message.textContent='¡Gracias! Recibimos tu solicitud y nos pondremos en contacto contigo.';
  form.reset();
 }catch(err){message.textContent=err.message||'Ocurrió un error. Intenta nuevamente más tarde.'}
 finally{button.disabled=false}
});
$('#year').textContent=new Date().getFullYear();
})();
