const { useState, useEffect, useRef } = React;

/* ── BRAND ── */
const WA = '2349115581148';
const waHref = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

/* ── HOOKS ── */
function useDark() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const s = localStorage.getItem('oh-theme');
    return s ? s === 'dark' : window.matchMedia('(prefers-color-scheme:dark)').matches;
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('oh-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return [dark, setDark];
}

function useMobile() {
  const [m, setM] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const sync = e => setM(e.matches);
    setM(media.matches);
    if (media.addEventListener) media.addEventListener('change', sync);
    else media.addListener(sync);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', sync);
      else media.removeListener(sync);
    };
  }, []);
  return m;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-sc');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }), { threshold: .07 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScroll() {
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' ? window.scrollY > 20 : false);
  useEffect(() => {
    const bar = document.getElementById('progress-bar');
    const btn = document.getElementById('bt');
    let frame = 0;
    const sync = () => {
      frame = 0;
      const y = window.scrollY;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const isScrolled = y > 20;
      const pct = Math.min((y / maxScroll) * 100, 100);
      if (bar) bar.style.width = pct + '%';
      if (btn) btn.classList.toggle('on', y > 400);
      setScrolled(prev => prev === isScrolled ? prev : isScrolled);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return scrolled;
}

function useActiveSection() {
  const [a, setA] = useState('');
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setA(e.target.id) }), { threshold: .25 });
    ['services','pricing','about','contact'].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) });
    return () => io.disconnect();
  }, []);
  return a;
}

/* ── COUNTER ── */
function Counter({ to, suffix = '', dur = 1100 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const t0 = performance.now();
        const tick = ts => {
          const p = Math.min((ts - t0) / dur, 1);
          setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: .5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, dur]);
  return <span ref={ref} className="num" aria-label={`${to}${suffix}`}>{v}{suffix}</span>;
}

/* ── ICONS ── */
const WaIco = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const StarIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#FBBF24" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const Chk = ({ c = 'var(--navy)', sz = 10 }) => (
  <svg width={sz} height={sz} viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M2 5l2.5 2.5L8 3" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IgIco = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor"/>
  </svg>
);

const MailIco = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3 6l9 7 9-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── LUCIDE-STYLE ICON SET (stroke, 24x24) ── */
const _s = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Icon = ({ s = 20, c, children }) => (
  <svg {..._s} width={s} height={s} stroke={c || 'currentColor'} aria-hidden="true">{children}</svg>
);
const IcBriefcase = p => <Icon {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Icon>;
const IcGlobe = p => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></Icon>;
const IcPalette = p => <Icon {...p}><path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12c0 1.1.9 2 2 2h2a2 2 0 0 1 2 2c0 .52.09 1.03.26 1.49A2 2 0 0 0 11 19a2 2 0 0 1 2.6 1.5A2 2 0 0 0 12 22z"/><circle cx="13.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r=".8" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r=".8" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r=".8" fill="currentColor" stroke="none"/></Icon>;
const IcBuilding = p => <Icon {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></Icon>;
const IcRocket = p => <Icon {...p}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></Icon>;
const IcBadgeCheck = p => <Icon {...p}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z"/><path d="m9 12 2 2 4-4"/></Icon>;
const IcBag = p => <Icon {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></Icon>;
const IcMessage = p => <Icon {...p}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></Icon>;
const IcCog = p => <Icon {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></Icon>;
const IcZap = p => <Icon {...p}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></Icon>;
const IcLock = p => <Icon {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>;
const IcShield = p => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></Icon>;
const IcUsers = p => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
const IcSmile = p => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="9.5" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="9.5" r=".8" fill="currentColor" stroke="none"/></Icon>;
const IcFrown = p => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><circle cx="9" cy="9.5" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="9.5" r=".8" fill="currentColor" stroke="none"/></Icon>;
const IcPhone = p => <Icon {...p}><rect x="5" y="2" width="14" height="20" rx="2.5" ry="2.5"/><path d="M12 18h.01"/></Icon>;
const IcCard = p => <Icon {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></Icon>;
const IcCheck = p => <Icon {...p}><path d="M5 12l4 4 10-10"/></Icon>;
const IcCheckCircle = p => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></Icon>;
const IcX = p => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>;
const IcSparkles = p => <Icon {...p}><path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></Icon>;
const IcPlus = p => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IcSun = p => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></Icon>;
const IcMoon = p => <Icon {...p}><path d="M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10z"/></Icon>;
const IcArrowDown = p => <Icon {...p}><path d="M12 5v14M5 12l7 7 7-7"/></Icon>;

/* ── LOGO ── always renders the brand's original navy + orange colours */
const Logo = ({ h = 32 }) => (
  <img src="asset/logo.png" alt="Oklah Hub" decoding="async" fetchpriority="high"
    style={{ height: h, objectFit: 'contain', display: 'block' }}
    onError={e => { e.currentTarget.style.display = 'none' }}
  />
);

const MicrosoftIco = ({ s = 20 }) => (
  <img
    src="asset/microsoft-windows.png"
    alt=""
    aria-hidden="true"
    width={s}
    height={s}
    style={{ width: s, height: s, objectFit: 'contain', display: 'block' }}
  />
);

/* ── THEME TOGGLE ── */
const Toggle = ({ dark, set }) => (
  <button className={`tog ${dark ? 'on' : ''}`} onClick={() => set(d => !d)} aria-label={dark ? 'Light mode' : 'Dark mode'}>
    <div className="tog-k">{dark ? <IcMoon s={11} c="#1E293B"/> : <IcSun s={11} c="#F59E0B"/>}</div>
  </button>
);

/* ── NAV ── */
function Nav({ mob, dark, setDark, scrolled }) {
  const [menu, setMenu] = useState(false);
  const active = useActiveSection();
  const openerRef = useRef(null);
  const closeRef = useRef(null);

  // Body scroll lock + Escape-to-close + focus management for mobile menu
  useEffect(() => {
    if (menu) {
      document.body.style.overflow = 'hidden';
      const prev = document.activeElement;
      setTimeout(() => closeRef.current && closeRef.current.focus(), 20);
      const onKey = e => { if (e.key === 'Escape') setMenu(false) };
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
        document.body.style.overflow = '';
        if (prev && prev.focus) prev.focus();
      };
    }
  }, [menu]);

  const links = ['Services', 'Pricing', 'About', 'Contact'];

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all .3s',
        background: scrolled ? undefined : 'transparent',
        borderBottom: scrolled ? undefined : '1px solid transparent'
      }} className={scrolled ? 'nav-glass' : ''}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: mob ? '0 16px' : '0 32px', height: mob ? 60 : 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <a href="#" aria-label="Oklah Hub home" style={{ textDecoration: 'none' }}>
            <Logo h={mob ? 26 : 30} />
          </a>
          {mob ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Toggle dark={dark} set={setDark} />
              <button
                ref={openerRef}
                onClick={() => setMenu(true)}
                aria-label="Open menu"
                aria-expanded={menu}
                aria-controls="mob-menu"
                style={{ background: 'none', border: 'none', cursor: 'pointer', width: 44, height: 44, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
              >
                {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 22, height: 2, background: 'var(--text)', borderRadius: 2 }} />)}
              </button>
            </div>
          ) : (
            <nav aria-label="Primary" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {links.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  className={`nav-a ${active === l.toLowerCase() ? 'act' : ''}`}
                  style={{ fontWeight: active === l.toLowerCase() ? 600 : 500 }}
                  aria-current={active === l.toLowerCase() ? 'page' : undefined}
                >{l}</a>
              ))}
              <Toggle dark={dark} set={setDark} />
              <a href={waHref('Hi Oklah Hub! I want to get started.')} target="_blank" rel="noopener" className="btn btn-p"
                style={{ padding: '10px 18px', fontSize: 13, borderRadius: 10 }}>
                <WaIco s={13} /> Get Started
              </a>
            </nav>
          )}
        </div>
      </header>

      {menu && (
        <div id="mob-menu" className="mob-menu" role="dialog" aria-modal="true" aria-label="Site navigation">
          <button ref={closeRef} onClick={() => setMenu(false)} aria-label="Close menu"
            style={{ position: 'absolute', top: 14, right: 14, background: 'var(--bg-subtle)', border: 'none', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcX s={20} /></button>
          <Logo h={28} />
          <div style={{ marginTop: 32 }}>
            {links.map(l => <a key={l} href={`#${l.toLowerCase()}`} className="mob-a" onClick={() => setMenu(false)}>{l}</a>)}
          </div>
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="mailto:info@oklahhub.com" onClick={() => setMenu(false)}
              className="btn btn-o" style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 14 }}>
              <MailIco s={16} /> info@oklahhub.com
            </a>
            <a href={waHref('Hi Oklah Hub! I want to get started.')} target="_blank" rel="noopener" onClick={() => setMenu(false)}
              className="btn btn-g" style={{ width: '100%', padding: '16px', fontSize: 16, borderRadius: 14 }}>
              <WaIco s={18} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/* ── HERO CARDS ── */
function HeroCards() {
  return (
    <div style={{ position: 'relative', width: 400, flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '10%', right: '-15%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,.18) 0%,transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animation: 'float 9s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '-10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,.15) 0%,transparent 70%)', filter: 'blur(36px)', pointerEvents: 'none', animation: 'float 11s 2s ease-in-out infinite' }} />

      {/* Before */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, marginBottom: 14, boxShadow: 'var(--sh-md)', animation: 'cf 7s ease-in-out infinite' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--faint)', letterSpacing: '.07em', textTransform: 'uppercase' }}>Before Oklah Hub</span>
          <span style={{ background: 'rgba(239,68,68,.1)', color: '#EF4444', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, border: '1px solid rgba(239,68,68,.2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><IcX s={12} /> Unprofessional</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--faint)' }}><IcFrown s={20} /></div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--faint)', fontWeight: 500, marginBottom: 2 }}>Your current email</div>
            <div style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 600, textDecoration: 'line-through' }}>yourname@gmail.com</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--faint)', marginBottom: 14 }} aria-hidden="true"><IcArrowDown s={20} /></div>

      {/* After */}
      <div style={{ background: 'linear-gradient(135deg,var(--navy),var(--sky))', borderRadius: 20, padding: 24, position: 'relative', animation: 'cf 7s 1.4s ease-in-out infinite', boxShadow: '0 12px 40px rgba(13,76,143,.3)' }}>
        <div style={{ position: 'absolute', top: -12, right: 16, background: 'linear-gradient(135deg,#F97316,#FB923C)', color: '#fff', padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 800, boxShadow: '0 6px 16px rgba(249,115,22,.5)', display: 'inline-flex', alignItems: 'center', gap: 5 }}><IcZap s={12} /> Ready in 48 hrs</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.65)', letterSpacing: '.07em', textTransform: 'uppercase' }}>After Oklah Hub</span>
          <span style={{ background: 'rgba(74,222,128,.2)', color: '#4ADE80', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, border: '1px solid rgba(74,222,128,.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><IcCheck s={12} /> Professional</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.2)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><IcSparkles s={20} /></div>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', fontWeight: 500, marginBottom: 2 }}>Your branded email</div>
            <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>ceo@yourbusiness.com</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
          {[{ Icon: MicrosoftIco, l: 'M365' },{ Icon: IcGlobe, l: 'Website' },{ Icon: IcPalette, l: 'Graphics' },{ Icon: MailIco, l: 'Email' }].map(b => (
            <span key={b.l} style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '5px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, border: '1px solid rgba(255,255,255,.2)', display: 'inline-flex', alignItems: 'center', gap: 5 }}><b.Icon s={12} />{b.l}</span>
          ))}
        </div>
      </div>

      {/* Badge */}
      <div style={{ position: 'absolute', bottom: -16, left: -18, background: 'var(--card)', borderRadius: 14, padding: '10px 14px', border: '1px solid var(--border)', boxShadow: 'var(--sh-md)', display: 'flex', alignItems: 'center', gap: 10, animation: 'cf 7s .7s ease-in-out infinite' }}>
        <div style={{ display: 'flex', gap: 1 }}>{[0,1,2,3,4].map(i => <StarIco key={i} />)}</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>5.0 Rating</div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>100+ clients</div>
        </div>
      </div>
    </div>
  );
}

/* ── HERO ── */
function Hero({ mob }) {
  return (
    <section className="hero-bg" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', paddingTop: mob ? 60 : 68, position: 'relative', overflow: 'hidden', backgroundImage: 'url(asset/hero-background.jpeg)', backgroundSize: 'cover', backgroundPosition: mob ? 'center right' : 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll' }}>
      {/* light-fade overlay so body text stays readable over the photo */}
      <div className="hero-veil" aria-hidden="true" />
      <div aria-hidden="true" style={{ position: 'absolute', top: '8%', left: '-8%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,.06) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none', animation: 'float 12s ease-in-out infinite' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '2%', right: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,.05) 0%,transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none', animation: 'float 15s 3s ease-in-out infinite' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: mob ? '44px 20px 120px' : '0 32px', width: '100%', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: mob ? 'column' : 'row', alignItems: mob ? 'flex-start' : 'center', gap: mob ? 48 : 80, justifyContent: 'space-between' }}>

          {/* LEFT */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ animation: 'fadeUp .5s ease both', marginBottom: 22 }}>
              <span className="hero-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.22)', color: '#4ADE80', padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
                <span className="hero-chip-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 10px #4ADE80', flexShrink: 0 }} />
                Trusted by 100+ businesses worldwide
              </span>
            </div>

            <h1 style={{ fontSize: mob ? 38 : 'clamp(46px,5.5vw,72px)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-.04em', marginBottom: 22, maxWidth: 680, animation: 'fadeUp .6s .06s ease both' }}>
              <span style={{ color: 'var(--text)' }}>You're losing customers because your business</span>{' '}
              <span className="grad-text">looks unprofessional.</span>
            </h1>

            <p style={{ color: 'var(--muted)', fontSize: mob ? 16 : 18, lineHeight: 1.72, maxWidth: 520, marginBottom: 8, animation: 'fadeUp .6s .12s ease both', fontWeight: 400 }}>
              A Gmail address, no website, or outdated branding costs you deals every day. We fix that in <strong style={{ color: 'var(--navy)', fontWeight: 700 }}>48 hours</strong>.
            </p>
            <p style={{ color: 'var(--faint)', fontSize: 13, fontStyle: 'italic', marginBottom: 32, animation: 'fadeUp .6s .16s ease both' }}>"More than a product. It's your security."</p>

            <div style={{ display: 'flex', animation: 'fadeUp .6s .22s ease both', marginBottom: 14 }}>
              <a href="#services" className="btn btn-p hero-cta"
                style={{ padding: '16px 32px', fontSize: mob ? 16 : 17, minHeight: 56, borderRadius: 14, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                Explore Services <IcArrowDown s={18} />
              </a>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 12, animation: 'fadeUp .6s .28s ease both', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {['No contract','Setup in 48 hrs','Real human support'].map((t, i) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#16A34A', display: 'inline-flex' }}><IcCheck s={12} /></span>{t}
                  {i < 2 && <span aria-hidden="true" style={{ marginLeft: 6, color: 'var(--faint)' }}>·</span>}
                </span>
              ))}
            </p>
          </div>

          {!mob && <HeroCards />}
        </div>

        {/* STATS */}
        <div className="rv" style={{ marginTop: mob ? 48 : 64, display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: '1px', background: 'var(--border)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', maxWidth: mob ? '100%' : 680, boxShadow: 'var(--sh-sm)' }}>
          {[
            { l: 'Businesses Served', to: 100, suf: '+' },
            { l: 'Setup Time', to: 48, suf: ' hrs' },
            { l: 'Response Time', to: 1, suf: ' hr' },
            { l: 'Client Rating', to: 5, suf: '/5', star: true }
          ].map((s, i) => (
            <div key={i} className="hero-metric" style={{ padding: '20px 16px', textAlign: 'center', background: 'var(--card)', animationDelay: `${i * 140}ms` }}>
              <div style={{ fontSize: mob ? 22 : 26, fontWeight: 900, color: 'var(--navy)', letterSpacing: '-.03em', lineHeight: 1, marginBottom: 6, display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                <Counter to={s.to} suffix={s.suf} />
                {s.star && <StarIco />}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

/* ── TRUST MARQUEE ── */
function TrustBar() {
  const items = [
    { Icon: MailIco, label: 'Professional Email' },
    { Icon: MicrosoftIco, label: 'Microsoft 365' },
    { Icon: IcGlobe, label: 'Business Websites' },
    { Icon: IcPalette, label: 'Logo & Brand Design' },
    { Icon: IcZap, label: '48hr Setup' },
    { Icon: IcLock, label: 'Enterprise Security' },
    { Icon: IcUsers, label: 'Personal Support' },
    { Icon: IcGlobe, label: 'Worldwide Service' },
    { Icon: IcCard, label: 'From ₦35,000/year' },
    { Icon: IcPhone, label: 'Mobile First' },
    { Icon: IcCheck, label: 'No Contract' },
  ];
  return (
    <div style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '13px 0' }}>
      <div className="mq-wrap">
        <div className="mq-track">
          {[...items, ...items].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 28px', color: 'var(--muted)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--navy)', display: 'inline-flex' }}><item.Icon s={16} /></span>
              {item.label}
              <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)', flexShrink: 0, marginLeft: 8 }} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── WHO FOR ── */
function WhoFor({ mob }) {
  const items = [
    { Icon: IcBuilding, title: 'Small Business Owners', desc: 'Look established from day one.' },
    { Icon: IcRocket, title: 'Startups & Founders', desc: 'Tools that scale with you.' },
    { Icon: IcBadgeCheck, title: 'Consultants & Pros', desc: 'Win deals with credibility.' },
    { Icon: IcBag, title: 'Retailers & Traders', desc: 'A polished presence online.' },
  ];
  return (
    <section className="cv-auto" style={{ background: 'var(--bg)', padding: mob ? '56px 20px' : '80px 32px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="rv" style={{ textAlign: 'center', marginBottom: mob ? 32 : 48 }}>
          <span style={{ display: 'inline-block', background: 'rgba(249,115,22,.08)', color: '#C2410C', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 14, border: '1px solid rgba(249,115,22,.12)' }}>Built for you</span>
          <h2 style={{ fontSize: mob ? 24 : 32, fontWeight: 800, color: 'var(--text)', letterSpacing: '-.03em', lineHeight: 1.15 }}>If you run a business, this is for you.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: mob ? 12 : 16 }}>
          {items.map((it, i) => (
            <div key={i} className={`rv d${i + 1} hov hov-orange`}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: mob ? '20px 16px' : '28px 22px', textAlign: 'center', boxShadow: 'var(--sh-sm)' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, margin: '0 auto 12px', background: 'linear-gradient(135deg,rgba(249,115,22,.12),rgba(249,115,22,.04))', color: '#C2410C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><it.Icon s={22} /></div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6, letterSpacing: '-.01em' }}>{it.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ── */
function HowItWorks({ mob }) {
  const steps = [
    { num: '01', Icon: IcMessage, title: 'Contact Us', desc: 'Tell us what your business needs. No forms, no calls. Just a quick message. We respond within the hour.', contact: true },
    { num: '02', Icon: IcCog, title: 'We set everything up', desc: 'Our team handles every technical detail. You get updates every step. Zero effort from you.' },
    { num: '03', Icon: IcRocket, title: 'You look professional', desc: 'Within 48 hours, your business has branded email, Microsoft 365, or a live website fully managed.' },
  ];
  return (
    <section className="cv-auto" style={{ background: 'var(--bg-alt)', padding: mob ? '64px 20px' : '96px 32px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="rv" style={{ textAlign: 'center', marginBottom: mob ? 44 : 64 }}>
          <span style={{ display: 'inline-block', background: 'rgba(13,76,143,.07)', color: 'var(--navy)', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 14, border: '1px solid rgba(13,76,143,.1)' }}>How It Works</span>
          <h2 style={{ fontSize: mob ? 26 : 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.03em', lineHeight: 1.1 }}>
            From first message to{' '}
            <span style={{ background: 'linear-gradient(90deg,var(--navy),var(--sky))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>fully set up</span>
            {' '}in 48 hours.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)', position: 'relative', gap: mob ? 0 : 0 }}>
          {!mob && (
            <div style={{ position: 'absolute', top: 38, left: '16%', right: '16%', height: 2, background: 'linear-gradient(90deg,transparent,rgba(13,76,143,.2),rgba(14,165,233,.4),rgba(249,115,22,.3),transparent)', borderRadius: 2, zIndex: 0 }} />
          )}
          {steps.map((s, i) => (
            <div key={i} className={`rv d${i + 1}`}
              style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: mob ? 'row' : 'column', alignItems: mob ? 'flex-start' : 'center', textAlign: mob ? 'left' : 'center', gap: mob ? 20 : 0, padding: mob ? '24px 0' : '0 28px', borderBottom: mob && i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div className="step-orb" style={{ width: 68, height: 68, borderRadius: '50%', background: i === 2 ? 'linear-gradient(135deg,#F97316,#FB923C)' : 'linear-gradient(135deg,var(--navy),var(--sky))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: mob ? 0 : 24, boxShadow: i === 2 ? '0 8px 24px rgba(249,115,22,.4)' : '0 8px 24px rgba(13,76,143,.32)', color: '#fff', animationDelay: `${i * 180}ms` }}><s.Icon s={28} /></div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: i === 2 ? '#F97316' : 'var(--sky)', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 8 }}>Step {s.num}</div>
                <h3 style={{ fontSize: mob ? 18 : 22, fontWeight: s.contact ? 900 : 800, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.68, maxWidth: mob ? '100%' : 260, margin: mob ? '0' : '0 auto' }}>{s.desc}</p>
                {s.contact && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap', justifyContent: mob ? 'flex-start' : 'center' }}>
                    <a href={waHref('Hi Oklah Hub! I want to get started.')} target="_blank" rel="noopener"
                      aria-label="Contact us on WhatsApp"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,var(--navy),var(--sky))', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,76,143,.3)' }}>
                      <WaIco s={16} />
                    </a>
                    <a href="https://www.instagram.com/oklahhub_ng" target="_blank" rel="noopener"
                      aria-label="Follow us on Instagram"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,var(--navy),var(--sky))', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,76,143,.3)' }}>
                      <IgIco s={16} />
                    </a>
                    <a href="mailto:info@oklahhub.com"
                      aria-label="Email info@oklahhub.com"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,var(--navy),var(--sky))', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,76,143,.3)' }}>
                      <MailIco s={16} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}

/* ── SERVICES ── */
const SVCS = [
  { Icon: MicrosoftIco, tag: '₦35,000/user/year', title: 'Microsoft 365', desc: 'Premium versions of Office Apps including Word, Excel, PowerPoint, Outlook to unlock your creativity and achieve more. Now enhanced with Microsoft Copilot, your AI assistant, and 1 TB of secure OneDrive cloud storage.', features: ['Word, Excel, PowerPoint, Outlook & OneNote', 'Microsoft Copilot AI built-in', '1 TB secure OneDrive cloud storage', 'Works on phone, tablet & PC'], msg: 'Hi Oklah Hub! I want Microsoft 365 for my business.', emailSubject: 'Microsoft 365 Inquiry', featured: true },
  { Icon: MailIco, tag: 'Custom pricing', title: 'Professional Business Email', desc: "Stop losing deals because you're emailing from Gmail or Yahoo. A branded email like you@yourbusiness.com builds instant trust.", features: ['you@yourbusiness.com address', 'Full setup done for you', 'Spam protection & security', 'Fully managed. Worry free'], msg: 'Hi Oklah Hub! I want a professional business email.', emailSubject: 'Business Email Inquiry' },
  { Icon: IcGlobe, tag: 'from ₦250,000', title: 'Website Design & Management', desc: 'A website that works while you sleep. We design, build, and fully manage your business website, ecommerce store, or full web app. You focus on customers, we handle the tech.', features: ['Static business website from ₦250,000', 'Ecommerce store, custom pricing', 'Web application, contact us for pricing', 'We manage all updates & upkeep', 'Fast, secure & always on'], msg: 'Hi Oklah Hub! I want a professional website.', emailSubject: 'Website Design Inquiry' },
  { Icon: IcPalette, tag: 'Custom pricing', title: 'Graphics & Logo Design', desc: 'A strong brand starts with great visuals. We create custom logos, brand identities and social media graphics that make your business stand out.', features: ['Custom logo design', 'Full brand identity kit', 'Social media graphics & assets', 'Consistent style across platforms'], msg: 'Hi Oklah Hub! I want graphics and logo design.', emailSubject: 'Graphics & Logo Design Inquiry' },
];


function Services({ mob }) {
  return (
    <section id="services" className="cv-auto" style={{ background: 'var(--bg)', padding: mob ? '64px 20px' : '112px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="rv" style={{ textAlign: 'center', marginBottom: mob ? 32 : 44 }}>
          <span style={{ display: 'inline-block', background: 'rgba(13,76,143,.07)', color: 'var(--navy)', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 14, border: '1px solid rgba(13,76,143,.1)' }}>Services</span>
          <h2 style={{ fontSize: mob ? 26 : 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 14, maxWidth: 560, margin: '0 auto 14px' }}>Everything your business needs to look professional.</h2>
          <p style={{ color: 'var(--muted)', fontSize: mob ? 15 : 17, maxWidth: 500, margin: '0 auto' }}>Everything you need. One trusted partner. No tech knowledge required.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(2,1fr)', gap: mob ? 16 : 20 }}>
          {SVCS.map((s, i) => (
            <div key={i} className={`rv d${(i % 2) + 1} hov svc-card ${s.featured ? 'hov-featured' : ''}`}
              style={{ background: 'var(--card)', borderRadius: 22, padding: mob ? 24 : 32, border: s.featured ? undefined : '1px solid var(--border)', boxShadow: s.featured ? undefined : 'var(--sh-sm)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
            >
              {s.featured && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,var(--navy),var(--sky),var(--orange))' }} />}
              {s.featured && <span style={{ position: 'absolute', top: 18, right: 18, background: 'linear-gradient(135deg,#F97316,#FB923C)', color: '#fff', padding: '4px 10px', borderRadius: 100, fontSize: 10, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(249,115,22,.35)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><StarIco /> Most Popular</span>}
              <div className="svc-icon" style={{ width: 56, height: 56, borderRadius: 14, marginBottom: 14, background: s.featured ? 'linear-gradient(135deg,var(--navy),var(--sky))' : 'linear-gradient(135deg,rgba(13,76,143,.08),rgba(14,165,233,.04))', color: s.featured ? '#fff' : 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.Icon s={26} /></div>
              <span style={{ display: 'inline-block', background: 'rgba(13,76,143,.07)', color: 'var(--navy)', padding: '4px 11px', borderRadius: 100, fontSize: 11, fontWeight: 700, marginBottom: 14, width: 'fit-content', border: '1px solid rgba(13,76,143,.1)' }}>{s.tag}</span>
              <h3 style={{ fontSize: mob ? 18 : 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.72, marginBottom: 20, flexGrow: 1 }}>{s.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {s.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--text)' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(13,76,143,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}><Chk /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={`mailto:info@oklahhub.com?subject=${encodeURIComponent(s.emailSubject)}`}
                className="btn btn-o" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 12, textDecoration: 'none', marginTop: 8, width: '100%', fontSize: 14, fontWeight: 600 }}>
                <MailIco s={15} /> Email Us
              </a>
              <a href={waHref(s.msg)} target="_blank" rel="noopener"
                className="btn btn-o" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 12, textDecoration: 'none', marginTop: 8, width: '100%', fontSize: 14, fontWeight: 600 }}>
                <WaIco s={15} /> WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PRICING ── */
function Pricing({ mob }) {
  return (
    <section id="pricing" className="cv-auto" style={{ background: 'var(--bg-alt)', padding: mob ? '64px 20px' : '112px 32px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="rv" style={{ textAlign: 'center', marginBottom: mob ? 40 : 56 }}>
          <span style={{ display: 'inline-block', background: 'rgba(249,115,22,.08)', color: '#C2410C', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 14, border: '1px solid rgba(249,115,22,.12)' }}>Pricing</span>
          <h2 style={{ fontSize: mob ? 26 : 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 14 }}>Affordable pricing. Real results.</h2>
          <p style={{ color: 'var(--muted)', fontSize: mob ? 15 : 17, maxWidth: 460, margin: '0 auto' }}>Affordable pricing to look like an established company. No setup fee, no contract.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: mob ? 16 : 24, maxWidth: 960, margin: '0 auto' }}>

          {/* M365 */}
          <div className="rv-sc" style={{ background: 'linear-gradient(145deg,#071E3D 0%,#0D4C8F 45%,#1565C0 100%)', borderRadius: 24, padding: mob ? 28 : 44, position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(13,76,143,.35)', border: '1px solid rgba(249,115,22,.22)' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(14,165,233,.22)', filter: 'blur(50px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(249,115,22,.28)', filter: 'blur(50px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 8 }}>
                <span style={{ background: 'linear-gradient(135deg,#F97316,#FB923C)', color: '#fff', padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 800, boxShadow: '0 4px 14px rgba(249,115,22,.5)', display: 'inline-flex', alignItems: 'center', gap: 6 }}><StarIco /> Most Popular</span>
                <span style={{ color: 'rgba(255,255,255,.72)', fontSize: 12 }}>Per user / year</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-.02em' }}>Microsoft 365</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: mob ? 40 : 52, fontWeight: 900, color: '#fff', letterSpacing: '-.04em', lineHeight: 1 }}>₦35,000</span>
                <span style={{ color: 'rgba(255,255,255,.72)', fontSize: 14 }}>/year</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 12, marginBottom: 28 }}>Billed annually</p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 22, marginBottom: 26 }}>
                {['Word, Excel, PowerPoint, Outlook & OneNote','Microsoft Copilot AI built-in','1 TB OneDrive cloud storage','Works across all your devices','Full setup & onboarding included'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(74,222,128,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Chk c="#4ADE80" />
                    </div>
                    <span style={{ color: 'rgba(255,255,255,.82)', fontSize: 14 }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="https://paystack.shop/pay/oklahhubm365" target="_blank" rel="noopener" className="btn"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,#F97316,#FB923C)', color: '#fff', padding: '15px', borderRadius: 12, fontWeight: 800, textDecoration: 'none', fontSize: 15, minHeight: 52, boxShadow: '0 6px 20px rgba(249,115,22,.4)' }}>
                  <IcCard s={18} /> Pay Now · ₦35,000 yearly
                </a>
                <a href={waHref('Hi Oklah Hub! I want Microsoft 365.')} target="_blank" rel="noopener" className="btn"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', color: '#fff', padding: '12px', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: 14, minHeight: 46 }}>
                  <WaIco s={15} /> Chat on whatsapp
                </a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
                {['No setup fee','Setup in 48 hrs','Cancel anytime'].map(b => (
                  <span key={b} style={{ color: 'rgba(255,255,255,.7)', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}><IcCheck s={11} c="#4ADE80" /> {b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Custom */}
          <div className="rv d1 hov hov-orange" style={{ background: 'var(--card)', borderRadius: 24, padding: mob ? 28 : 44, border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(249,115,22,.08)', color: '#C2410C', padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 16, width: 'fit-content', border: '1px solid rgba(249,115,22,.12)' }}>Custom Services</span>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 8, letterSpacing: '-.02em' }}>Business Services</h3>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)', marginBottom: 4 }}>Custom Pricing</div>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 26 }}>Tailored to your business size & needs</p>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 22, marginBottom: 26, flexGrow: 1 }}>
              {['Professional branded email setup','Domain registration & management','Website design & development','Graphics & logo design','Ongoing technical management','Priority support'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(13,76,143,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Chk />
                  </div>
                  <span style={{ color: 'var(--text)', fontSize: 14 }}>{f}</span>
                </div>
              ))}
            </div>
            <a href="#contact" className="btn btn-p" style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: 12, fontSize: 14 }}>Get a Custom Quote</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── WHY US ── */
function WhyUs({ mob }) {
  const pts = [
    { Icon: IcZap, title: 'Setup in 48 hours', desc: 'From sign-up to fully operational in under 2 business days.', c: '#F97316' },
    { Icon: IcLock, title: 'Enterprise security', desc: 'Industry-grade protection for your data and communications.', c: 'var(--navy)' },
    { Icon: IcUsers, title: 'Human support', desc: 'Real people, fast responses. Every time you reach out.', c: '#25D366' },
    { Icon: IcSmile, title: 'Zero tech stress', desc: 'We handle every technical detail so you never have to.', c: 'var(--sky)' },
    { Icon: IcGlobe, title: 'Built for entrepreneurs', desc: 'Enterprise-grade tools at prices made for growing businesses.', c: '#F97316' },
    { Icon: IcPhone, title: 'Mobile-first always', desc: 'Everything we build works beautifully on any device.', c: 'var(--sky)' },
  ];
  return (
    <section className="cv-auto" style={{ background: 'var(--bg)', padding: mob ? '64px 20px' : '112px 32px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: mob ? 40 : 80, alignItems: 'start' }}>
        <div className="rv-l">
          <span style={{ display: 'inline-block', background: 'rgba(13,76,143,.07)', color: 'var(--navy)', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 16, border: '1px solid rgba(13,76,143,.1)' }}>Why Oklah Hub</span>
          <h2 style={{ fontSize: mob ? 26 : 'clamp(26px,3vw,42px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 18, maxWidth: 380 }}>Why businesses choose us.</h2>
          <p style={{ color: 'var(--muted)', fontSize: mob ? 15 : 16, lineHeight: 1.78, maxWidth: 380, marginBottom: 28 }}>We are your dedicated tech team. Every service saves you time, makes you look better and grows your business.</p>
          <a
            href={waHref('Hi Oklah Hub! I want to learn more.')}
            target="_blank"
            rel="noopener"
            className="btn btn-p"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '13px 22px', borderRadius: 12, fontWeight: 800, fontSize: 14, textDecoration: 'none', minHeight: 48 }}
          >
            Ask Us Anything
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {pts.map((p, i) => (
            <div key={i} className={`rv d${Math.min(i + 1, 4)} hov why-card`}
              style={{ background: 'var(--card)', borderRadius: 16, padding: 20, border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}
            >
              <div className="why-icon" style={{ width: 42, height: 42, borderRadius: 11, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: p.c.startsWith('#') ? p.c + '18' : 'rgba(13,76,143,.1)', color: p.c }}><p.Icon s={22} /></div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6, letterSpacing: '-.01em' }}>{p.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── STATS BAND ── */
function StatsBand({ mob }) {
  const stats = [
    { to: 100, suf: '+', label: 'Businesses Served' },
    { to: 48, suf: ' hrs', label: 'Average Setup Time' },
    { to: 1, suf: ' hr', label: 'Support Response' },
  ];
  return (
    <section className="cv-auto" style={{ background: 'linear-gradient(135deg,var(--navy-d),var(--navy) 50%,#1565C0)', padding: mob ? '48px 20px' : '64px 32px', borderTop: '1px solid rgba(255,255,255,.04)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4,1fr)', gap: mob ? '24px 16px' : 0 }}>
        {stats.map((s, i) => (
          <div key={i} className={`rv d${i + 1}`} style={{ textAlign: 'center', padding: mob ? '0' : '0 24px', borderRight: !mob && i < 3 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
            <div style={{ fontSize: mob ? 36 : 44, fontWeight: 900, color: '#fff', letterSpacing: '-.04em', lineHeight: 1, marginBottom: 8 }}>
              <Counter to={s.to} suffix={s.suf} />
            </div>
            <div style={{ color: 'rgba(255,255,255,.72)', fontSize: 13, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ── */
const REVIEWS = [
  { name: 'Temi Bukola', role: 'Data Analyst', body: '₦35,000 a year for Microsoft 365 with Copilot AI? One of the best business decisions I\'ve made. The AI alone saves me hours every week.', stars: 5 },
  { name: 'Chinedu Ugo', role: 'Co-Founder, Martinez & Co.', body: 'I was embarrassed to share my Gmail with big clients. Within 48 hours, Oklah Hub gave me a proper branded email. The difference was immediate.', stars: 5 },
  { name: 'Amara Williams', role: 'Director, Bright Futures Academy', body: 'Our old website was embarrassing us. Oklah Hub redesigned it and now handles everything. We\'ve enrolled more students since the relaunch.', stars: 5 },
];

function Testimonials({ mob }) {
  return (
    <section className="cv-auto" style={{ background: 'var(--bg-alt)', padding: mob ? '64px 20px' : '112px 32px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="rv" style={{ textAlign: 'center', marginBottom: mob ? 40 : 56 }}>
          <span style={{ display: 'inline-block', background: 'rgba(13,76,143,.07)', color: 'var(--navy)', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 14, border: '1px solid rgba(13,76,143,.1)' }}>Testimonials</span>
          <h2 style={{ fontSize: mob ? 26 : 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 8 }}>Real businesses. Real results.</h2>
          <p style={{ color: 'var(--muted)', fontSize: mob ? 15 : 17 }}>Don't take our word for it. Hear from our clients.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)', gap: mob ? 14 : 20 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} className={`rv d${i + 1} hov hov-orange review-card`}
              style={{ background: 'var(--card)', borderRadius: 20, padding: mob ? 24 : 32, border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)', display: 'flex', flexDirection: 'column', position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 52, color: 'rgba(13,76,143,.06)', fontFamily: 'Georgia,serif', lineHeight: 1, fontWeight: 700, userSelect: 'none' }}>"</div>
              <div className="review-stars" style={{ display: 'flex', gap: 2, marginBottom: 16, animationDelay: `${i * 220}ms` }}>
                {Array(r.stars).fill(0).map((_, j) => <StarIco key={j} />)}
              </div>
              <p style={{ color: 'var(--text)', fontSize: mob ? 14 : 15, lineHeight: 1.76, marginBottom: 24, flexGrow: 1, position: 'relative' }}>"{r.body}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div className="review-avatar" style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--navy),var(--sky))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0, animationDelay: `${i * 220}ms` }}>{r.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>{r.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function About({ mob }) {
  const values = [
    { Icon: IcZap, title: 'Speed', desc: 'Setup in 48 hours, every time.' },
    { Icon: IcShield, title: 'Security', desc: 'Enterprise-grade protection.' },
    { Icon: IcUsers, title: 'Trust', desc: 'Real humans, fast responses.' },
    { Icon: IcGlobe, title: 'Access', desc: 'World-class tools, fair prices.' },
  ];
  return (
    <section id="about" className="cv-auto" style={{ background: 'var(--bg-alt)', padding: mob ? '64px 20px' : '112px 32px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div className="rv" style={{ textAlign: 'center', marginBottom: mob ? 48 : 72 }}>
          <span style={{ display: 'inline-block', background: 'rgba(13,76,143,.07)', color: 'var(--navy)', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 16, border: '1px solid rgba(13,76,143,.1)' }}>About Us</span>
          <h2 style={{ fontSize: mob ? 28 : 'clamp(28px,3.5vw,48px)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-.04em', lineHeight: 1.08, marginBottom: 16, maxWidth: 640, margin: '0 auto 16px' }}>
            The team making your{' '}
            <span className="shimmer">business unstoppable.</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: mob ? 15 : 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Oklah Hub was built for one reason: every business deserves to look professional, regardless of size or budget.
          </p>
        </div>

        {/* Two-col */}
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: mob ? 32 : 56, alignItems: 'start' }}>

          {/* Left — story + contacts */}
          <div className="rv-l">
            <h3 style={{ fontSize: mob ? 20 : 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 14, lineHeight: 1.25 }}>
              Your dedicated tech team without the overhead.
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: mob ? 15 : 16, lineHeight: 1.85, marginBottom: 14 }}>
              Oklah Hub is a "business-in-a-box" technical provider that helps businesses and startups look professional, stay secure, and maintain a modern online presence, without the stress of managing the technology themselves.
            </p>
            <p style={{ color: 'var(--muted)', fontSize: mob ? 15 : 16, lineHeight: 1.85, marginBottom: 28 }}>
              We believe every business deserves enterprise-grade infrastructure, regardless of size or budget. Affordable, fully managed, and ready in 48 hours.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { Icon: MailIco, label: 'Email', v: 'info@oklahhub.com', href: 'mailto:info@oklahhub.com' },
                { Icon: WaIco, label: 'WhatsApp', v: '+234 911 558 1148', href: `https://wa.me/${WA}` },
                { Icon: IgIco, label: 'Instagram', v: '@oklahhub_ng', href: 'https://www.instagram.com/oklahhub_ng' },
              ].map(c => (
                <a key={c.v} href={c.href} target="_blank" rel="noopener"
                  className="hov"
                  aria-label={`${c.label}: ${c.v}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 14, background: 'var(--card)', border: '1px solid var(--border)', textDecoration: 'none', boxShadow: 'var(--sh-sm)' }}
                >
                  <span aria-hidden="true" style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,var(--navy),var(--sky))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}><c.Icon s={18} /></span>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.v}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — metrics + values + quote */}
          <div className="rv-r">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 12 }}>
              {[{ v: '100+', l: 'Businesses served', c: 'var(--navy)' }, { v: '48h', l: 'Avg. setup time', c: 'var(--orange)' }].map(s => (
                <div key={s.l} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 12px', textAlign: 'center', boxShadow: 'var(--sh-sm)' }}>
                  <div style={{ fontSize: mob ? 24 : 30, fontWeight: 900, color: s.c, letterSpacing: '-.03em', lineHeight: 1, marginBottom: 5 }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {values.map((v, i) => (
                <div key={i} className="hov about-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 16px', boxShadow: 'var(--sh-sm)' }}>
                  <div className="about-icon" style={{ width: 36, height: 36, borderRadius: 10, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,rgba(13,76,143,.1),rgba(14,165,233,.05))', color: 'var(--navy)' }}><v.Icon s={20} /></div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 4, letterSpacing: '-.01em' }}>{v.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>{v.desc}</div>
                </div>
              ))}
            </div>
            <div className="quote-card" style={{ background: 'linear-gradient(135deg,var(--navy),var(--sky))', borderRadius: 16, padding: '22px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.08)', filter: 'blur(20px)', pointerEvents: 'none' }} />
              <span style={{ display: 'inline-flex', background: '#fff', padding: '8px 12px', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,.15)', position: 'relative' }}><Logo h={26} /></span>
              <p style={{ fontSize: mob ? 14 : 15, fontStyle: 'italic', color: 'rgba(255,255,255,.9)', lineHeight: 1.65, margin: '12px 0 0', fontWeight: 500, position: 'relative' }}>"More than a product. It's your security."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ── */
const FAQS = [
  { q: 'How quickly can I get started?', a: 'Very fast. Send us a WhatsApp message, tell us what you need, and we can have most services set up within 24 to 48 hours. No long forms, no waiting weeks.' },
  { q: "I'm not tech-savvy. Will this be complicated?", a: "Not at all. That's exactly why we exist. You don't touch any technical settings. We handle everything from A to Z. You just use the finished product." },
  { q: 'Is the Microsoft 365 ₦35,000 price per person?', a: "Yes, it's per user per year. For team pricing, message us on WhatsApp and we'll work out the best deal for you." },
  { q: 'Do I need to sign a long-term contract?', a: 'No contracts, no lock-ins. We earn your business every month. You can cancel anytime. No questions asked.' },
  { q: 'How do I pay?', a: 'Pay directly online via our secure payment link for Microsoft 365, or via bank transfer. Message us on WhatsApp to get started with any service.' },
];

function FAQ({ mob }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="cv-auto" style={{ background: 'var(--bg-alt)', padding: mob ? '64px 20px' : '112px 32px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="rv" style={{ textAlign: 'center', marginBottom: mob ? 40 : 56 }}>
          <span style={{ display: 'inline-block', background: 'rgba(13,76,143,.07)', color: 'var(--navy)', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 14, border: '1px solid rgba(13,76,143,.1)' }}>FAQ</span>
          <h2 style={{ fontSize: mob ? 26 : 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.03em', lineHeight: 1.1 }}>Common questions, honest answers.</h2>
        </div>
        <div className="rv" role="list" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 740, margin: '0 auto' }}>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const btnId = `faq-b-${i}`;
            const panelId = `faq-p-${i}`;
            return (
              <div key={i} role="listitem" style={{ background: 'var(--card)', borderRadius: 14, overflow: 'hidden', border: isOpen ? '1px solid rgba(13,76,143,.4)' : '1px solid var(--border)', transition: 'border-color .25s,box-shadow .25s', boxShadow: isOpen ? '0 6px 24px rgba(13,76,143,.08)' : 'none' }}>
                <button id={btnId} onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen} aria-controls={panelId}
                  style={{ width: '100%', padding: mob ? '17px 20px' : '19px 26px', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: 16, color: 'var(--text)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: mob ? 14 : 15, letterSpacing: '-.01em', lineHeight: 1.4 }}>{f.q}</span>
                  <span aria-hidden="true" style={{ width: 30, height: 30, borderRadius: '50%', background: isOpen ? 'linear-gradient(135deg,var(--navy),var(--sky))' : 'var(--bg-subtle)', color: isOpen ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .25s', transform: isOpen ? 'rotate(45deg)' : 'none' }}><IcPlus s={16} /></span>
                </button>
                <div id={panelId} role="region" aria-labelledby={btnId} aria-hidden={!isOpen}
                  style={{ maxHeight: isOpen ? 640 : 0, overflow: 'hidden', transition: 'max-height .35s var(--ease)' }}>
                  <div style={{ padding: mob ? '0 20px 20px' : '0 26px 22px', color: 'var(--muted)', fontSize: mob ? 14 : 15, lineHeight: 1.75 }}>{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function Contact({ mob }) {
  const [form, setForm] = useState({ name: '', email: '', business: '', service: 'Microsoft 365', message: '', _website: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const sending = status === 'sending';
  const sent = status === 'sent';
  const errored = status === 'error';
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async e => {
    e.preventDefault();
    if (sending) return;
    if (form._website) return; // honeypot tripped — silently drop
    setStatus('sending');
    try {
      const res = await fetch('https://formsubmit.co/ajax/5d7e531a94915f4a35dea3b456998e9d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          business: form.business || '(not provided)',
          service: form.service,
          message: form.message || '(no message)',
          _subject: `New inquiry from ${form.name} — ${form.service}`,
          _replyto: form.email,
          _template: 'table',
          _captcha: 'false'
        })
      });
      if (!res.ok) throw new Error('submit-failed');
      setStatus('sent');
      setForm({ name: '', email: '', business: '', service: 'Microsoft 365', message: '', _website: '' });
      setTimeout(() => setStatus('idle'), 8000);
    } catch (err) {
      setStatus('error');
    }
  };
  return (
    <section id="contact" className="cv-auto" style={{ background: 'var(--bg)', padding: mob ? '64px 20px' : '96px 32px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: mob ? '1fr' : '1.05fr .95fr', gap: mob ? 20 : 28, alignItems: 'stretch' }}>


        {/* Left */}
        <div className="rv-l" style={{ background: 'linear-gradient(145deg,#071E3D 0%,#0D4C8F 55%,#1565C0 100%)', borderRadius: mob ? 20 : 28, padding: mob ? '40px 24px' : '52px 48px', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 80px rgba(13,76,143,.28)', border: '1px solid rgba(249,115,22,.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 360, height: 360, borderRadius: '50%', background: 'rgba(14,165,233,.16)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(249,115,22,.2)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.85)', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 20 }}>Ready to get started?</span>
            <h2 style={{ fontSize: mob ? 26 : 'clamp(28px,3.4vw,42px)', fontWeight: 800, color: '#fff', letterSpacing: '-.03em', marginBottom: 16, lineHeight: 1.06 }}>
              Your competitors already<br />look more professional.<br />
              <span className="shimmer">Fix that today.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: mob ? 15 : 16, marginBottom: 16, maxWidth: 420, lineHeight: 1.7 }}>Reach out today, we will respond within the hour. For detailed inquiries, please complete the form.</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              <a href={waHref('Hi Oklah Hub! I want to get started.')} target="_blank" rel="noopener"
                aria-label="Contact us on WhatsApp"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,var(--navy),var(--sky))', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,76,143,.3)' }}>
                <WaIco s={16} />
              </a>
              <a href="https://www.instagram.com/oklahhub_ng" target="_blank" rel="noopener"
                aria-label="Follow us on Instagram"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,var(--navy),var(--sky))', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,76,143,.3)' }}>
                <IgIco s={16} />
              </a>
              <a href="mailto:info@oklahhub.com"
                aria-label="Email info@oklahhub.com"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,var(--navy),var(--sky))', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(13,76,143,.3)' }}>
                <MailIco s={16} />
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 20 }}>
              {[
                { Icon: MailIco, t: 'info@oklahhub.com' },
                { Icon: IgIco, t: '@oklahhub_ng' },
                { Icon: IcGlobe, t: 'Remote, serving businesses worldwide' },
              ].map(c => (
                <span key={c.t} style={{ color: 'rgba(255,255,255,.72)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 8 }}><c.Icon s={14} />{c.t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="rv-r" style={{ background: 'var(--card)', borderRadius: mob ? 20 : 28, padding: mob ? 24 : 36, border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: 22 }}>
            <h3 style={{ fontSize: mob ? 20 : 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 6 }}>Tell us about your business.</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>Fill in a few details. We'll reply within the hour.</p>
          </div>
          <div aria-live="polite" aria-atomic="true">
            {sent && (
              <div role="status" style={{ textAlign: 'center', padding: '32px 16px', background: 'rgba(37,211,102,.06)', borderRadius: 16, border: '1px solid rgba(37,211,102,.25)' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(37,211,102,.15)', color: '#16A34A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }} aria-hidden="true"><IcCheckCircle s={32} /></div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Message sent!</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>Thanks — your message is on its way to <strong>info@oklahhub.com</strong>. We'll reply within the hour.</div>
              </div>
            )}
          </div>
          {!sent && (
            <form onSubmit={submit} noValidate={false} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Honeypot — bots fill this; real users don't see it */}
              <input type="text" name="_website" tabIndex="-1" autoComplete="off" value={form._website} onChange={e => up('_website', e.target.value)} aria-hidden="true"
                style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }} />
              <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 12 }}>
                <input className="oh-input" required placeholder="Your name" aria-label="Your name" autoComplete="name" value={form.name} onChange={e => up('name', e.target.value)} />
                <input className="oh-input" required type="email" placeholder="Email address" aria-label="Email address" autoComplete="email" inputMode="email" value={form.email} onChange={e => up('email', e.target.value)} />
              </div>
              <input className="oh-input" placeholder="Business name" aria-label="Business name" autoComplete="organization" value={form.business} onChange={e => up('business', e.target.value)} />
              <select className="oh-input" value={form.service} aria-label="Service" onChange={e => up('service', e.target.value)}
                style={{ appearance: 'none', WebkitAppearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: 40 }}>
                <option>Microsoft 365</option>
                <option>Professional Business Email</option>
                <option>Static Website from ₦250,000</option>
                <option>E-commerce Store</option>
                <option>Web Application</option>
                <option>Graphics & Logo Design</option>
                <option>I'm not sure, help me choose</option>
              </select>
              <textarea className="oh-input" rows="4" placeholder="What do you need? (optional)" aria-label="Message" value={form.message} onChange={e => up('message', e.target.value)} />
              {errored && (
                <div role="alert" style={{ fontSize: 13, color: '#B91C1C', background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.25)', borderRadius: 10, padding: '10px 12px', lineHeight: 1.5 }}>
                  Couldn't send your message right now. Please try again, or email us directly at <a href="mailto:info@oklahhub.com" style={{ color: 'inherit', fontWeight: 700 }}>info@oklahhub.com</a>.
                </div>
              )}
              <button type="submit" className="btn btn-p" disabled={sending} aria-busy={sending}
                style={{ padding: '15px', fontSize: 15, minHeight: 52, borderRadius: 12, width: '100%', opacity: sending ? .7 : 1, cursor: sending ? 'wait' : 'pointer' }}>
                {sending ? <><span className="ld-ring" style={{ width: 16, height: 16, borderWidth: 2 }} aria-hidden="true"/> Sending…</> : <>Send Message</>}
              </button>
              <p style={{ color: 'var(--muted)', fontSize: 11, textAlign: 'center', marginTop: 2 }}>Goes straight to info@oklahhub.com. We never share your details.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer({ mob }) {
  return (
    <footer style={{ background: '#071E3D', padding: mob ? '40px 20px 96px' : '60px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--navy),var(--sky),var(--orange))' }} />
      <div style={{ position: 'absolute', top: -120, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(14,165,233,.06)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: mob ? 'column' : 'row', justifyContent: 'space-between', alignItems: mob ? 'flex-start' : 'center', gap: 24, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div>
            <Logo h={26} />
            <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 13, marginTop: 12, maxWidth: 300 }}>Professional tools & presence for growing businesses worldwide.</p>
          </div>
          <nav aria-label="Footer" style={{ display: 'flex', gap: mob ? 20 : 32, flexWrap: 'wrap' }}>
            {[
              { l: 'Services', h: '#services' },
              { l: 'Pricing', h: '#pricing' },
              { l: 'About', h: '#about' },
              { l: 'Contact', h: '#contact' },
            ].map(x => (
              <a key={x.l} href={x.h} className="link-f" style={{ textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{x.l}</a>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', flexDirection: mob ? 'column' : 'row', justifyContent: 'space-between', alignItems: mob ? 'flex-start' : 'center', gap: 14 }}>
          <span style={{ color: 'rgba(255,255,255,.55)', fontSize: 12 }}>© 2026 Oklah Hub · All rights reserved</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { l: 'Instagram', h: 'https://www.instagram.com/oklahhub_ng' },
              { l: 'Email', h: 'mailto:info@oklahhub.com' },
              { l: 'WhatsApp', h: `https://wa.me/${WA}` },
            ].map(x => (
              <a key={x.l} href={x.h} target="_blank" rel="noopener"
                className="link-f"
                style={{ textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
              >{x.l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── APP ── */
function App() {
  const mob = useMobile();
  const [dark, setDark] = useDark();
  const scrolled = useScroll();
  useReveal();

  // Hide loader
  useEffect(() => {
    const l = document.getElementById('loader');
    if (!l) return;
    const id = window.requestAnimationFrame(() => l.classList.add('out'));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div>
      <Nav mob={mob} dark={dark} setDark={setDark} scrolled={scrolled} />
      <main id="main" tabIndex="-1">
        <Hero mob={mob} />
        <TrustBar />
        <Services mob={mob} />
        <WhoFor mob={mob} />
        <HowItWorks mob={mob} />
        <Pricing mob={mob} />
        <StatsBand mob={mob} />
        <WhyUs mob={mob} />
        <Testimonials mob={mob} />
        <About mob={mob} />
        <FAQ mob={mob} />
        <Contact mob={mob} />
      </main>
      <Footer mob={mob} />

      <button id="bt" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
