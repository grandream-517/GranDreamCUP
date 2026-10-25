
const BG_COLORS = {
overview: '#FFFFFF',
comment: '#C1E3FF',
ttStart: '#C1E3FF',
ttMid: '#E9EDF2',
ttEnd: '#8D8DB0',
maps: '#5F6FB0',
losers: '#123C73',
double: '#123C73',
};
const BG_BLEND = 0.6;
const NIGHT_TT = 0.25;
const NIGHT_MAX = 0.85;
const SKY_LUM = 40;
const DARK_BELOW = 128;
const hex = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));



window.addEventListener('load', function () {
const loading = document.getElementById('loading');
const heroInner = document.querySelector('.hero-inner');


setTimeout(function () {
loading.classList.add('loaded');
heroInner.classList.add('animate');
}, 1700);
});
window.addEventListener('load', function () {
const loading = document.getElementById('loading');


setTimeout(function () {
loading.classList.add('loaded');
}, 1500);
});


const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


const starSvg = document.getElementById('starSvg');
const starColors = ['#ffffff', '#fef08a', '#fbcfe8', '#bae6fd', '#38bdf8', '#f472b6'];

function createStars(svg = starSvg, starCount = 90) {
for (let i = 0; i < starCount; i++) {
const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
const opacity = Math.random() * 0.7 + 0.3;
c.setAttribute('cx', `${Math.random() * 100}%`);
c.setAttribute('cy', `${Math.random() * 100}%`);
c.setAttribute('r', Math.random() * 2.0 + 0.8);
c.setAttribute('fill', starColors[Math.floor(Math.random() * starColors.length)]);
c.setAttribute('opacity', opacity);
c.classList.add('star');
if (Math.random() < 0.6) {
    c.classList.add('twinkle');
    c.style.setProperty('--o', opacity);
    c.style.setProperty('--d', `${(2 + Math.random() * 4).toFixed(2)}s`);
    c.style.setProperty('--delay', `-${(Math.random() * 6).toFixed(2)}s`);
}
svg.appendChild(c);
}
}
createStars();
createStars(document.getElementById('nightSvg'), 70);


const hero = document.getElementById('hero');
const shootingLayer = document.getElementById('shootingLayer');

function spawnShootingStar() {
if (window.scrollY < window.innerHeight * 0.8) {
const s = document.createElement('div');
s.className = 'shooting-star';
s.style.left = `${10 + Math.random() * 70}%`;
s.style.top = `${Math.random() * 40}%`;
s.style.setProperty('--angle', `${20 + Math.random() * 20}deg`);
s.style.setProperty('--dist', `${260 + Math.random() * 200}px`);
shootingLayer.appendChild(s);
s.addEventListener('animationend', () => s.remove());
}
setTimeout(spawnShootingStar, 2500 + Math.random() * 3500);
}
if (!reduceMotion) setTimeout(spawnShootingStar, 1500);


const cloudSvgs = document.querySelectorAll('.clouds-svg');
function fitClouds() {
cloudSvgs.forEach(svg => {
const ratio = svg.clientWidth / svg.clientHeight;

svg.setAttribute('preserveAspectRatio', ratio < 3.3 ? 'xMidYMax slice' : 'none');
});
}
fitClouds();
window.addEventListener('resize', () => { fitClouds(); ttIndex = -1; update(); });


const heroScroll = document.getElementById('heroScroll');
const cloudBack = document.getElementById('cloudBack');
const cloudFront = document.getElementById('cloudFront');
let ticking = false;


const mapsEls = document.querySelectorAll('.maps');
const entryCloud = document.getElementById('entryCloud');
const siteFooter = document.querySelector('.site-footer');
const BG_STOPS = [
{ rgb: hex(BG_COLORS.overview) },
{ el: document.querySelector('.comment'), rgb: hex(BG_COLORS.comment) },
{ el: document.getElementById('ttScroll'), rgb: hex(BG_COLORS.ttStart) },
{ el: mapsEls[0], rgb: hex(BG_COLORS.maps) },
{ el: mapsEls[1], rgb: hex(BG_COLORS.losers) },
{ el: mapsEls[2], rgb: hex(BG_COLORS.double) },
];
const TT_FROM = hex(BG_COLORS.ttStart);
const TT_MID = hex(BG_COLORS.ttMid);
const TT_TO = hex(BG_COLORS.ttEnd);
function updateBg(h) {

const ttRange = ttScroll.offsetHeight - ttStage.offsetHeight;
const ttPx = Math.min(ttRange, Math.max(0, -ttScroll.getBoundingClientRect().top));
const pos = ttPx / (ttRange / ttItems.length);
const cl = (x) => Math.min(1, Math.max(0, x));
const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const ttRgb = pos <= 2.5 ? lerp(TT_FROM, TT_MID, cl((pos - 0.5) / 2))
: lerp(TT_MID, TT_TO, cl(pos - 2.5));
const ref = window.scrollY + h * 0.5, W = h * BG_BLEND;
let c = BG_STOPS[0].rgb;
let uMaps = 0;
for (let i = 1; i < BG_STOPS.length; i++) {
const top = BG_STOPS[i].el.getBoundingClientRect().top + window.scrollY;
const u = Math.min(1, Math.max(0, (ref - (top - W / 2)) / W));
if (i === 3) uMaps = u;
const to = (i === 2) ? ttRgb : BG_STOPS[i].rgb;
c = c.map((v, j) => v + (to[j] - v) * u);
}
document.documentElement.style.setProperty('--bg', `rgb(${c.map(Math.round).join(',')})`);


const sky = Math.max(cl(pos - 3) * NIGHT_TT, uMaps * NIGHT_MAX);
document.documentElement.style.setProperty('--stars', sky.toFixed(3));

const lum = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
const isDark = lum * (1 - sky) + SKY_LUM * sky < DARK_BELOW;
mapsEls.forEach(el => el.classList.toggle('dark', isDark));
}


const ttScroll = document.getElementById('ttScroll');
const ttStage = document.getElementById('ttStage');
const ttList = document.getElementById('ttList');
const ttItems = [...ttList.querySelectorAll('.tt-item')];
const ttPanels = [...document.querySelectorAll('.tt-panel')];
let ttIndex = -1;

function updateTimetable() {
const range = ttScroll.offsetHeight - ttStage.offsetHeight;
const px = Math.min(range, Math.max(0, -ttScroll.getBoundingClientRect().top));
const idx = Math.min(ttItems.length - 1, Math.floor(px / (range / ttItems.length)));
if (idx === ttIndex) return;
ttIndex = idx;
ttItems.forEach((li, i) => {
li.classList.toggle('active', i === idx);
li.classList.toggle('past', i < idx);
ttPanels[i].classList.toggle('active', i === idx);
});

const dot = ttItems[idx].querySelector('.tt-dot');
ttList.style.setProperty('--fill', ((ttItems[idx].offsetTop + dot.offsetTop + dot.offsetHeight / 2) / ttList.offsetHeight).toFixed(4));
}

ttItems.forEach((li, i) => li.addEventListener('click', () => {
const range = ttScroll.offsetHeight - ttStage.offsetHeight;
const top = window.scrollY + ttScroll.getBoundingClientRect().top + (i + 0.5) * (range / ttItems.length);
window.scrollTo({ top, behavior: 'smooth' });
}));

function update() {
const h = window.innerHeight;
const range = heroScroll.offsetHeight - hero.offsetHeight;
const p = Math.min(1, Math.max(0, -heroScroll.getBoundingClientRect().top / range));
const q = Math.min(1, p / 0.7);

const frontTravel = h * 1.02 - cloudFront.offsetHeight * 0.32;
cloudFront.style.transform = `translate3d(0, ${-q * frontTravel}px, 0)`;
cloudBack.style.transform = `translate3d(0, ${-q * frontTravel * 0.6}px, 0)`;
updateBg(h);


entryCloud.classList.toggle('show', p > 0.35 && siteFooter.getBoundingClientRect().top > h * 0.75);
updateTimetable();
ticking = false;
}
window.addEventListener('scroll', () => {
if (!ticking) { requestAnimationFrame(update); ticking = true; }
}, { passive: true });
update();


const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
document.addEventListener('click', (e) => {
const img = e.target.closest('.tt-img img, .map-img img');
if (!img) return;
lbImg.src = img.currentSrc || img.src;
lbImg.alt = img.alt;
lb.classList.add('open');
});
lb.addEventListener('click', () => lb.classList.remove('open'));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lb.classList.remove('open'); });
['wheel', 'touchmove'].forEach(t => lb.addEventListener(t, (e) => e.preventDefault(), { passive: false }));

(() => {
const INTERVAL = 5000;
const root = document.getElementById('ns');
const track = root.querySelector('.ns-track');
const dotsBox = root.querySelector('.ns-dots');
const n = track.children.length;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let i = 0, timer = null, busy = false;

if (n > 1 && !reduce) {
const c = track.children[0].cloneNode(true);
c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1;
track.appendChild(c);
}
for (let k = 0; k < n; k++) {
const b = document.createElement('button');
b.type = 'button'; b.setAttribute('aria-label', (k + 1) + '枚目を表示');
b.addEventListener('click', () => { go(k); restart(); });
dotsBox.appendChild(b);
}
if (n < 2) { root.querySelectorAll('.ns-btn, .ns-dots').forEach(e => e.remove()); return; }

function show(animate) {
track.style.transition = animate ? '' : 'none';
track.style.transform = `translateX(${-i * 100}%)`;
[...dotsBox.children].forEach((d, k) => d.setAttribute('aria-current', String(k === i % n)));
}
function go(k, animate = true) {
if (reduce) { i = (k + n) % n; show(false); return; }
if (busy && animate) return;
busy = animate; i = k; show(animate);
}
const next = () => go(i + 1);
const prev = () => {
if (reduce) return go(i - 1);
if (i === 0) { go(n, false); track.getBoundingClientRect(); }
go(i - 1);
};
track.addEventListener('transitionend', (e) => {
if (e.target !== track) return;
busy = false;
if (i === n) go(0, false);
});

function start() { if (!reduce) timer = setInterval(next, INTERVAL); }
function stop() { clearInterval(timer); }
function restart() { stop(); start(); }
root.querySelector('.ns-next').addEventListener('click', () => { next(); restart(); });
root.querySelector('.ns-prev').addEventListener('click', () => { prev(); restart(); });
root.addEventListener('mouseenter', stop); root.addEventListener('mouseleave', start);
root.addEventListener('focusin', stop); root.addEventListener('focusout', start);
document.addEventListener('visibilitychange', () => (document.hidden ? stop() : restart()));


let x0 = null, moved = false;
root.addEventListener('pointerdown', (e) => { x0 = e.clientX; moved = false; stop(); });
root.addEventListener('pointerup', (e) => {
if (x0 !== null && Math.abs(e.clientX - x0) > 40) { moved = true; (e.clientX < x0 ? next : prev)(); }
x0 = null; restart();
});
root.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);

show(false); start();
})();
