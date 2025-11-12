// Coverflow: o card CENTRAL fica MAIOR. Começa na 1ª foto.
// Ao passar (setas, swipe, auto), a próxima vira a maior.
document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.querySelector('[data-cf-viewport]');
  const track    = document.querySelector('[data-cf-track]');
  const dotsWrap = document.querySelector('[data-cf-dots]');
  const prevBtn  = document.querySelector('.cf-arrow.prev');
  const nextBtn  = document.querySelector('.cf-arrow.next');
  if (!viewport || !track) return;

  const cards = Array.from(track.querySelectorAll('.cf-card'));
  let i = 1;                // começa na PRIMEIRA foto
  let timer;
  const AUTO = 4800;

  // cria dots
  cards.forEach((_, k) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Ir para slide ${k+1}`);
    b.addEventListener('click', () => goTo(k, true));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  
  function decorate(){
    cards.forEach((c, k) => {
      c.classList.remove('is-center','is-near','is-far');
      const d = Math.abs(k - i);
      if (d === 0) c.classList.add('is-center');
      else if (d === 1) c.classList.add('is-near');
      else c.classList.add('is-far');
    });
    dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
  }

  function centerTranslate(idx){
  const vw   = viewport.clientWidth;
  const card = cards[idx];
  const cardW = card.getBoundingClientRect().width;
  const cardCenter = card.offsetLeft + cardW / 2; // posição do centro do card no trilho
  const tx = (vw / 2.1) - cardCenter;               // quanto mover o trilho para alinhar no centro do viewport
  return tx;
}

function goTo(n, restart=false){
  i = (n + cards.length) % cards.length;

  // aplica translate com base no centro do card alvo
  const tx = centerTranslate(i);
  track.style.transform = `translate3d(${tx}px, 0, 0)`;

  // estados visuais (maior/menor) e dots
  cards.forEach((c, k) => {
    c.classList.remove('is-center','is-near','is-far');
    const d = Math.abs(k - i);
    if (d === 0) c.classList.add('is-center');
    else if (d === 1) c.classList.add('is-near');
    else c.classList.add('is-far');
  });
  dots.forEach((d, k) => d.classList.toggle('is-on', k === i));

  if (restart) start();
}


  function next(){ goTo(i + 1); }
  function prev(){ goTo(i - 1); }

  function start(){ stop(); timer = setInterval(next, AUTO); }
  function stop(){ if (timer) clearInterval(timer); }

  // Controles
  nextBtn.addEventListener('click', () => { next(); start(); });
  prevBtn.addEventListener('click', () => { prev(); start(); });

  // Pausa no hover
  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', start);

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight'){ next(); start(); }
    if (e.key === 'ArrowLeft') { prev(); start(); }
  });

  // Swipe
  let sx=0, touching=false;
  viewport.addEventListener('touchstart', e => { touching=true; sx=e.touches[0].clientX; stop(); }, {passive:true});
  viewport.addEventListener('touchmove',  e => {
    if (!touching) return;
    const dx = e.touches[0].clientX - sx;
    if (Math.abs(dx) > 50){ touching=false; dx<0 ? next() : prev(); start(); }
  }, {passive:true});
  viewport.addEventListener('touchend', () => { touching=false; });

  // Reposiciona no resize
  window.addEventListener('load', () => {  // garante medidas corretas
    goTo(i);
    start();
    });

    window.addEventListener('resize', () => goTo(i, false));

  // INIT — 1ª foto já MAIOR
});

document.addEventListener('DOMContentLoaded', () => {
  const btn  = document.querySelector('.nav-toggle');
  const menu = document.getElementById('site-menu');
  if(!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    btn.classList.toggle('is-open');
  });

  // Fecha ao clicar num link
  menu.addEventListener('click', e => {
    if(e.target.matches('a')) {
      menu.classList.remove('open');
      btn.classList.remove('is-open');
    }
  });

  // Garante reset ao voltar pro desktop
  matchMedia('(min-width:1025px)').addEventListener('change', e => {
    if(e.matches){ menu.classList.remove('open'); btn.classList.remove('is-open'); }
  });
});

