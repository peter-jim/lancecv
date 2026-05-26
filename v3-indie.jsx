/* global React, SITE_DATA, t */
// V3 — Bold Indie
// Off-white + ink + bold color blocks. Big sculptural typography.
// The ¥1,000,000 number IS the hero.

function V3Indie({ width = 1440, height, standalone = false }) {
  const D = window.SITE_DATA;
  const [lang, setLang] = React.useState('zh');
  const tt = (v) => window.t(v, lang);

  // Palette
  const bg = '#f5f3ec';
  const ink = '#0e0e0e';
  const card = '#fffef9';
  const yellow = '#f4cb04';
  const purple = '#6d51e8';
  const orange = '#ff5722';
  const green = '#1eaa6f';
  const sub = '#5a5650';
  const mute = '#9a958a';
  const line = '#0e0e0e';

  const display = '"Space Grotesk", "PingFang SC", system-ui, sans-serif';
  const body = '"Geist", "Manrope", "PingFang SC", system-ui, sans-serif';
  const mono = '"JetBrains Mono", ui-monospace, monospace';

  const pct = (D.challenge.earned / D.challenge.goal) * 100;

  const statusMeta = {
    shutdown:  { dot: mute,   bg: '#e6e2d7', label: tt(D.ui.status_shutdown),   accent: mute },
    operating: { dot: green,  bg: '#d4f0e3', label: tt(D.ui.status_operating),  accent: green },
    building:  { dot: orange, bg: '#ffe2d6', label: tt(D.ui.status_building),   accent: orange },
    upcoming:  { dot: purple, bg: '#e2d9ff', label: tt(D.ui.status_upcoming),   accent: purple },
  };

  // Build the digits of ¥1,000,000 with split styling
  const goalDigits = String(D.challenge.goal); // "1000000"

  // ─────────── Animation hooks ───────────
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // viewport — switches to single-column / smaller type below 768px
  const [vw, setVw] = React.useState(() =>
    typeof window === 'undefined' ? 1440 : window.innerWidth
  );
  React.useEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  const isMobile = standalone && vw < 768;
  const isTab = standalone && vw >= 768 && vw < 1024;
  const m = (mob, desk) => isMobile ? mob : desk; // pick value by viewport
  const PAD = isMobile ? '36px 20px' : '72px 56px';
  const HPAD = isMobile ? '16px 20px' : '20px 56px';

  // count-up easing
  const useCountUp = (target, durationMs, delay) => {
    const [v, setV] = React.useState(0);
    React.useEffect(() => {
      let raf, start;
      const t0 = setTimeout(() => {
        const tick = (now) => {
          if (!start) start = now;
          const p = Math.min(1, (now - start) / durationMs);
          const ease = 1 - Math.pow(1 - p, 3);
          setV(Math.round(target * ease));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }, delay || 0);
      return () => { clearTimeout(t0); cancelAnimationFrame(raf); };
    }, [target, durationMs, delay]);
    return v;
  };
  const earnedAnim = useCountUp(D.challenge.earned, 2200, 500);
  const animPct = (earnedAnim / D.challenge.goal) * 100;

  // small live-jitter on stats to feel "live"
  const [jitter, setJitter] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setJitter((j) => j + 1), 3200);
    return () => clearInterval(t);
  }, []);

  // global IntersectionObserver -> reveal class
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    if (!rootRef.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('rv-in'); });
    }, { rootMargin: '-8% 0px -8% 0px', threshold: 0.06 });
    rootRef.current.querySelectorAll('.rv').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang]);

  // smooth scroll to anchor
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // magnetic button hover
  const magnet = (strength = 0.3) => ({
    onMouseMove: (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
    },
    onMouseLeave: (e) => { e.currentTarget.style.transform = ''; },
  });

  // stable random rotation per item (lang-stable via useRef)
  const rotsRef = React.useRef([]);
  const rot = (i) => {
    if (rotsRef.current[i] === undefined) {
      rotsRef.current[i] = (Math.sin(i * 73.1) * 2.4);
    }
    return rotsRef.current[i];
  };

  // ─── Form state: newsletter + community payment ───
  const [emailVal, setEmailVal] = React.useState('');
  const [emailErr, setEmailErr] = React.useState('');
  const [emailOk, setEmailOk] = React.useState(false);
  const submitEmail = (e) => {
    e.preventDefault();
    const v = emailVal.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      setEmailErr(tt(D.ui.invalid_email));
      return;
    }
    setEmailErr(''); setEmailOk(true);
  };

  const [payMethod, setPayMethod] = React.useState('wechat');

  // Deterministic fake QR (placeholder until real codes are uploaded)
  const FakeQR = ({ seed, size = 168, fg = '#0e0e0e', bgColor = '#fff' }) => {
    const N = 25;
    const cells = React.useMemo(() => {
      const out = [];
      let h = 0;
      for (let i = 0; i < seed.length; i++) h = (h * 131 + seed.charCodeAt(i) + 911) & 0xffff;
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          h = (h * 1103515245 + 12345) & 0x7fffffff;
          const inFinder = (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
          if (inFinder) continue;
          if ((h & 3) === 0) out.push([x, y]);
        }
      }
      return out;
    }, [seed]);
    const c = size / N;
    const finder = (fx, fy) => (
      <g>
        <rect x={fx * c} y={fy * c} width={c * 7} height={c * 7} fill={fg} />
        <rect x={(fx + 1) * c} y={(fy + 1) * c} width={c * 5} height={c * 5} fill={bgColor} />
        <rect x={(fx + 2) * c} y={(fy + 2) * c} width={c * 3} height={c * 3} fill={fg} />
      </g>
    );
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        <rect width={size} height={size} fill={bgColor} />
        {cells.map(([x, y], i) => (
          <rect key={i} x={x * c} y={y * c} width={c} height={c} fill={fg} />
        ))}
        {finder(0, 0)}
        {finder(N - 7, 0)}
        {finder(0, N - 7)}
      </svg>
    );
  };

  return (
    <div ref={rootRef} className={mounted ? 'mounted' : ''} style={{
      width: standalone ? '100%' : width,
      ...(height ? { height } : {}),
      minWidth: standalone ? (isMobile ? 320 : 1280) : undefined,
      background: bg, color: ink,
      fontFamily: body,
      overflow: standalone ? 'visible' : 'hidden',
      position: 'relative',
    }}>
      {/* ─── Sticky-ish NAV ─── */}
      <div style={{
        padding: HPAD,
        display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 28,
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        borderBottom: `2px solid ${ink}`, background: bg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14 }}>
          <div style={{
            width: isMobile ? 34 : 40, height: isMobile ? 34 : 40, background: ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: yellow, fontFamily: display, fontSize: isMobile ? 18 : 22, fontWeight: 700,
            transform: 'rotate(-4deg)',
          }}>兰</div>
          <span style={{
            fontFamily: display, fontSize: isMobile ? 17 : 20, fontWeight: 700,
            letterSpacing: -0.5,
          }}>
            {tt(D.name)}<span style={{ color: orange }}>.</span><span style={{ color: mute }}>site</span>
          </span>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 24, fontFamily: body, fontSize: 14, fontWeight: 500, flex: 1 }}>
            {[
              { label: D.ui.work, anchor: 'sec-work' },
              { label: D.ui.challenge, anchor: 'sec-hero' },
              { label: D.ui.grants, anchor: 'sec-grants' },
              { label: D.ui.hire, anchor: 'sec-hire' },
            ].map((l, i) => (
              <a key={i} href={'#' + l.anchor} onClick={scrollTo(l.anchor)}
                className="nav-link"
                style={{ color: ink, textDecoration: 'none' }}>{tt(l.label)}</a>
            ))}
          </div>
        )}
        {isMobile && <div style={{ flex: 1 }} />}

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: isMobile ? '4px 8px' : '6px 12px', background: yellow, border: `2px solid ${ink}`,
          fontFamily: mono, fontSize: isMobile ? 10 : 11, fontWeight: 700, letterSpacing: 1,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: ink, animation: 'pulse 1.8s infinite' }} />
          {isMobile ? `D${D.challenge.days}` : `LIVE · DAY ${D.challenge.days}`}
        </div>

        <div style={{
          display: 'flex', border: `2px solid ${ink}`, background: card,
        }}>
          {['zh', 'en'].map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: isMobile ? '4px 8px' : '6px 12px', fontFamily: mono, fontSize: isMobile ? 11 : 12,
              background: lang === l ? ink : 'transparent',
              color: lang === l ? bg : ink,
              border: 'none', cursor: 'pointer', fontWeight: 700,
              textTransform: 'uppercase',
            }}>{l}</button>
          ))}
        </div>

        {!isMobile && (
          <button onClick={scrollTo('sec-hire')} style={{
            background: ink, color: bg, border: `2px solid ${ink}`,
            padding: '8px 16px', fontFamily: body, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          }}>{tt(D.ui.subscribe)} <span style={{ color: yellow }}>→</span></button>
        )}

        {/* Mobile nav: compact pill row of section anchors */}
        {isMobile && (
          <div style={{
            flex: '1 0 100%', display: 'flex', gap: 6, overflowX: 'auto',
            padding: '6px 0 0', marginTop: 8,
            borderTop: `1.5px dashed ${ink}`,
            paddingTop: 12,
          }}>
            {[
              { label: D.ui.work, anchor: 'sec-work' },
              { label: D.ui.challenge, anchor: 'sec-hero' },
              { label: D.ui.grants, anchor: 'sec-grants' },
              { label: D.ui.hire, anchor: 'sec-hire' },
            ].map((l, i) => (
              <a key={i} href={'#' + l.anchor} onClick={scrollTo(l.anchor)} style={{
                padding: '5px 11px', border: `1.5px solid ${ink}`,
                fontFamily: body, fontSize: 12, fontWeight: 600,
                color: ink, textDecoration: 'none', whiteSpace: 'nowrap',
                background: card,
              }}>{tt(l.label)}</a>
            ))}
          </div>
        )}
      </div>

      {/* ─── HERO — THE NUMBER ─── */}
      <div id="sec-hero" data-anchor style={{ padding: isMobile ? '32px 20px 24px' : '64px 56px 40px', position: 'relative' }}>
        {/* Tape sticker */}
        <div className="wobble" style={{
          position: 'absolute',
          top: isMobile ? 20 : 40,
          right: isMobile ? 16 : 100,
          background: yellow, padding: '8px 16px',
          fontFamily: mono, fontSize: isMobile ? 10 : 11, fontWeight: 700, letterSpacing: 1.5,
          border: `2px solid ${ink}`,
          boxShadow: `4px 4px 0 ${ink}`,
          zIndex: 2,
        }}>
          {lang === 'zh' ? '★ 公开建造中 ★' : '★ BUILDING IN PUBLIC ★'}
        </div>

        <div style={{ fontFamily: mono, fontSize: isMobile ? 10 : 12, color: ink, letterSpacing: isMobile ? 2 : 3, marginBottom: isMobile ? 16 : 24, fontWeight: 600 }}>
          ▸ CHALLENGE 001 / VIBE CODING / {isMobile ? 'NO TIMER' : 'NO DEADLINE'}
        </div>

        {/* The sculptural number */}
        <div style={{
          fontFamily: display, fontWeight: 700,
          color: ink, lineHeight: 0.85,
          letterSpacing: isMobile ? -4 : -10,
          fontSize: isMobile ? 88 : 240,
          position: 'relative',
          wordBreak: 'keep-all',
        }}>
          <span className="digit-in" style={{ color: orange, fontStyle: 'italic', display: 'inline-block' }}>¥</span>
          {goalDigits.split('').map((d, i) => (
            <span key={i} className="digit-in" style={{
              display: 'inline-block', color: ink, position: 'relative',
            }}>{d}</span>
          ))}
          <span style={{
            position: 'absolute', right: -20, top: 30,
            fontFamily: mono, fontSize: 14, fontWeight: 500,
            color: ink, letterSpacing: 2, transform: 'rotate(-90deg)',
            transformOrigin: 'right top',
          }}>RMB</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
          gap: isMobile ? 28 : 56,
          marginTop: isMobile ? 16 : 24,
          alignItems: 'flex-start',
        }}>
          <div>
            <h1 style={{
              fontFamily: display, fontSize: isMobile ? 36 : 72, fontWeight: 700,
              lineHeight: 1, letterSpacing: isMobile ? -1 : -2, margin: '0 0 16px',
            }}>
              {lang === 'zh' ? (
                <>
                  <span style={{ background: yellow, padding: '0 12px', boxDecorationBreak: 'clone' }}>用 AI 写代码，</span><br/>
                  <span style={{ color: orange }}>赚到</span>这个数。
                </>
              ) : (
                <>
                  <span style={{ background: yellow, padding: '0 12px', boxDecorationBreak: 'clone' }}>I'm going to vibe-code</span><br/>
                  my way to <span style={{ color: orange }}>this number</span>.
                </>
              )}
            </h1>
            <p style={{
              fontFamily: body, fontSize: isMobile ? 15 : 20, lineHeight: 1.5, color: sub,
              maxWidth: 560, margin: '0 0 24px',
            }}>
              {tt(D.bio)}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="magnet" {...magnet(0.25)} onClick={scrollTo('sec-work')} style={{
                background: ink, color: bg, border: `2px solid ${ink}`,
                padding: isMobile ? '12px 18px' : '16px 24px',
                fontFamily: display, fontSize: isMobile ? 14 : 16, fontWeight: 700,
                cursor: 'pointer', boxShadow: `5px 5px 0 ${orange}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>{tt(D.ui.hero_cta_primary)} <span>→</span></button>
              <button className="magnet" {...magnet(0.2)} onClick={scrollTo('sec-hire')} style={{
                background: card, color: ink, border: `2px solid ${ink}`,
                padding: isMobile ? '12px 18px' : '16px 24px',
                fontFamily: display, fontSize: isMobile ? 14 : 16, fontWeight: 700,
                cursor: 'pointer', boxShadow: `5px 5px 0 ${ink}`,
              }}>{tt(D.ui.hero_cta_secondary)}</button>
            </div>
          </div>

          {/* Progress card */}
          <div style={{
            background: ink, color: bg, padding: isMobile ? 20 : 28,
            boxShadow: `6px 6px 0 ${yellow}`,
            border: `2px solid ${ink}`,
          }}>
            <div style={{
              fontFamily: mono, fontSize: 11, color: yellow,
              letterSpacing: 2, marginBottom: 16, fontWeight: 600,
            }}>{tt(D.ui.progress)} · LIVE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: display, fontSize: isMobile ? 40 : 56, fontWeight: 700,
                color: yellow, letterSpacing: -2, fontVariantNumeric: 'tabular-nums',
              }}>¥{earnedAnim.toLocaleString()}</span>
            </div>
            <div style={{
              fontFamily: mono, fontSize: 12, color: '#aaa', marginBottom: 18,
            }}>/ ¥{D.challenge.goal.toLocaleString()} · {animPct.toFixed(3)}%</div>

            {/* Chunky bar */}
            <div style={{
              height: 16, background: '#222', border: `2px solid ${yellow}`,
              position: 'relative', marginBottom: 20,
            }}>
              <div className="progress-fill" style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: (mounted ? pct : 0) + '%', background: yellow,
                backgroundImage: `repeating-linear-gradient(45deg, ${ink} 0, ${ink} 2px, ${yellow} 2px, ${yellow} 8px)`,
              }} />
              {/* marker */}
              <div className="progress-fill" style={{
                position: 'absolute', top: -4, bottom: -4,
                left: `${mounted ? pct : 0}%`, width: 3, background: orange,
                boxShadow: `0 0 12px ${orange}`,
              }} />
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
              paddingTop: 16, borderTop: `1px dashed #444`,
            }}>
              <div>
                <div style={{ fontFamily: mono, fontSize: 10, color: '#888', letterSpacing: 1.5, marginBottom: 4 }}>STARTED</div>
                <div style={{ fontFamily: display, fontWeight: 600, fontSize: 17 }}>2026·05·08</div>
              </div>
              <div>
                <div style={{ fontFamily: mono, fontSize: 10, color: '#888', letterSpacing: 1.5, marginBottom: 4 }}>DAY</div>
                <div style={{ fontFamily: display, fontWeight: 700, fontSize: 17, color: yellow }}>
                  #{D.challenge.days}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: mono, fontSize: 10, color: '#888', letterSpacing: 1.5, marginBottom: 4 }}>SHIPPED</div>
                <div style={{ fontFamily: display, fontWeight: 600, fontSize: 17 }}>
                  {D.products.filter(p => p.status === 'operating').length} {lang === 'zh' ? '个产品' : (D.products.filter(p => p.status === 'operating').length > 1 ? 'products' : 'product')}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: mono, fontSize: 10, color: '#888', letterSpacing: 1.5, marginBottom: 4 }}>NEXT DROP</div>
                <div style={{ fontFamily: display, fontWeight: 600, fontSize: 17, color: orange }}>~2 weeks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Marquee ─── */}
      <div style={{
        background: ink, color: bg,
        padding: isMobile ? '10px 0' : '14px 0', overflow: 'hidden',
        borderTop: `2px solid ${ink}`, borderBottom: `2px solid ${ink}`,
        fontFamily: display, fontSize: isMobile ? 15 : 22, fontWeight: 700, letterSpacing: -0.5,
      }}>
        <div className="marquee">
          {Array.from({ length: 2 }, (_, side) => (
            <div key={side} className="marquee-row">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 32, paddingRight: 32 }}>
                  {lang === 'zh' ? '先干了再说' : 'SHIP FIRST'}
                  <span style={{ color: yellow }}>★</span>
                  {lang === 'zh' ? '公开建造' : 'BUILD IN PUBLIC'}
                  <span style={{ color: orange }}>●</span>
                  CODE IS CHEAP
                  <span style={{ color: purple }}>◆</span>
                  ¥1,000,000
                  <span className="live-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── PRODUCTS ─── */}
      <div id="sec-work" data-anchor className="rv" style={{ padding: PAD }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between',
          gap: isMobile ? 16 : 0,
          marginBottom: isMobile ? 24 : 40,
        }}>
          <div>
            <div style={{
              fontFamily: mono, fontSize: 12, color: orange,
              letterSpacing: 3, fontWeight: 700, marginBottom: 8,
            }}>§ 01 / {tt(D.ui.products).toUpperCase()}</div>
            <h2 style={{
              fontFamily: display, fontSize: isMobile ? 44 : 88, fontWeight: 700,
              letterSpacing: isMobile ? -1.5 : -3, lineHeight: 0.9, margin: 0,
            }}>
              {lang === 'zh' ? <>做过的 <span style={{ color: orange }}>&</span><br/>在做的。</> : <>Things I've <span style={{ color: orange }}>built</span><br/>& am building.</>}
            </h2>
          </div>
          <div style={{ maxWidth: isMobile ? '100%' : 360, textAlign: isMobile ? 'left' : 'right' }}>
            <div style={{
              fontFamily: body, fontSize: isMobile ? 14 : 15, color: sub, lineHeight: 1.6,
            }}>
              {lang === 'zh'
                ? '从 2021 拿 Grant 写黑客松，到 2026 做 Vibe Coding 挑战。下面是真实状态，不藏停运。'
                : 'From 2021 hackathon grants to the 2026 Vibe Coding challenge. Real status below — including the sunsets.'}
            </div>
          </div>
        </div>

        <div className="rv rv-stagger" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 32 : 24 }}>
          {D.products.map((p, i) => {
            const s = statusMeta[p.status];
            const tint = [yellow, purple, orange][i % 3];
            const shadowName = ['yellow', 'purple', 'orange'][i % 3];
            return (
              <div key={p.id} className={`lift lift-shadow-${shadowName}`} style={{
                background: card, border: `2px solid ${ink}`,
                boxShadow: `6px 6px 0 ${ink}`,
                position: 'relative', display: 'flex', flexDirection: 'column',
                minHeight: isMobile ? 'auto' : 460,
              }}>
                {/* status header bar */}
                <div style={{
                  background: s.bg, padding: '10px 16px',
                  borderBottom: `2px solid ${ink}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: s.dot }} />
                    {s.label.toUpperCase()}
                  </span>
                  <span style={{ color: sub }}>№{String(i + 1).padStart(2, '0')} · {p.year}</span>
                </div>

                {/* cover */}
                <div style={{
                  aspectRatio: '5/3', background: tint,
                  position: 'relative', overflow: 'hidden',
                  borderBottom: `2px solid ${ink}`,
                }}>
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontFamily: display, fontSize: 92, fontWeight: 700,
                    color: ink, letterSpacing: -3,
                  }}>{tt(p.name).slice(0, 1)}</div>
                  {/* corner stripe */}
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 60, height: 60,
                    background: `repeating-linear-gradient(45deg, ${ink} 0, ${ink} 4px, transparent 4px, transparent 10px)`,
                  }} />
                </div>

                <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{
                    fontFamily: display, fontSize: 28, fontWeight: 700,
                    margin: '0 0 4px', letterSpacing: -1,
                  }}>{tt(p.name)}</h3>
                  {p.url && (
                    <div style={{
                      fontFamily: mono, fontSize: 12, color: sub, marginBottom: 12,
                    }}>↗ {p.url}</div>
                  )}
                  <p style={{
                    fontFamily: body, fontSize: 15, color: ink, lineHeight: 1.5,
                    margin: '0 0 16px', flex: 1,
                  }}>{tt(p.desc)}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {p.tags.map((tg, j) => (
                      <span key={j} style={{
                        fontFamily: mono, fontSize: 11, fontWeight: 600,
                        padding: '4px 8px', border: `1.5px solid ${ink}`,
                        background: card, letterSpacing: 0.5,
                      }}>{tg}</span>
                    ))}
                  </div>

                  <div style={{
                    paddingTop: 14, borderTop: `1.5px dashed ${ink}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontFamily: mono, fontSize: 11, color: sub, fontWeight: 600 }}>
                      {tt(p.stat).toUpperCase()}
                    </span>
                    {p.url ? (
                      <a href={'https://' + p.url} target="_blank" rel="noopener noreferrer" style={{
                        fontFamily: display, fontSize: 14, fontWeight: 700,
                        background: ink, color: bg, padding: '6px 12px',
                        textDecoration: 'none', cursor: 'pointer',
                      }}>{tt(D.ui.visit)} →</a>
                    ) : (
                      <span style={{ fontFamily: mono, fontSize: 11, color: mute }}>—</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── TIMELINE — horizontal rail ─── */}
      <div className="rv" style={{
        padding: PAD, background: ink, color: bg,
      }}>
        <div style={{
          fontFamily: mono, fontSize: 12, color: yellow,
          letterSpacing: 3, fontWeight: 700, marginBottom: 8,
        }}>§ 02 / {tt(D.ui.timeline).toUpperCase()}</div>
        <h2 style={{
          fontFamily: display, fontSize: isMobile ? 44 : 88, fontWeight: 700,
          letterSpacing: isMobile ? -1.5 : -3, lineHeight: 0.9,
          margin: isMobile ? '0 0 28px' : '0 0 48px',
        }}>
          {lang === 'zh' ? <>从 <span style={{ color: yellow }}>2021</span> 到 <span style={{ color: orange }}>now</span>.</> : <>From <span style={{ color: yellow }}>2021</span> to <span style={{ color: orange }}>now</span>.</>}
        </h2>

        <div style={{ position: 'relative' }}>
          {/* axis (only visible on desktop) */}
          {!isMobile && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 90, height: 3,
              background: bg,
            }} />
          )}
          <div className="rv rv-stagger" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(6, 1fr)',
            gap: isMobile ? 8 : 0,
          }}>
            {[...D.timeline, { year: 'now', text: { zh: '继续干', en: 'keep shipping' }, isNow: true }].map((tl, i) => {
              const colors = [yellow, purple, orange, green, '#ff79c6', yellow];
              return (
                <div key={i} style={{
                  position: 'relative',
                  paddingTop: 0,
                  paddingLeft: isMobile ? 28 : 0,
                  paddingBottom: isMobile ? 18 : 0,
                  borderLeft: isMobile ? `2px solid ${colors[i]}` : 'none',
                }}>
                  {isMobile && (
                    <div style={{
                      position: 'absolute', left: -9, top: 6, width: 16, height: 16,
                      background: colors[i], border: `3px solid ${ink}`,
                      boxShadow: `0 0 0 3px ${bg}`,
                    }} />
                  )}
                  <div style={{
                    fontFamily: display, fontSize: isMobile ? 32 : 56, fontWeight: 700,
                    color: tl.isNow ? yellow : bg, letterSpacing: isMobile ? -1 : -2, lineHeight: 1,
                    marginBottom: isMobile ? 8 : 16,
                  }}>{tl.year}</div>
                  {/* dot (desktop) */}
                  {!isMobile && <div style={{
                    width: 24, height: 24, background: colors[i],
                    border: `3px solid ${ink}`,
                    boxShadow: `0 0 0 3px ${bg}`,
                    marginBottom: 24, position: 'relative', zIndex: 1,
                  }} />}
                  <div style={{
                    fontFamily: body, fontSize: isMobile ? 13 : 13, lineHeight: 1.5,
                    color: '#ccc', maxWidth: isMobile ? '100%' : 180, whiteSpace: 'pre-line',
                  }}>{tt(tl.text)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats below timeline */}
        <div className="rv-stagger" style={{
          marginTop: isMobile ? 36 : 64, paddingTop: isMobile ? 24 : 32, borderTop: `2px solid ${bg}`,
          display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 32,
        }}>
          {[
            { l: lang === 'zh' ? '资助总计' : 'Total grants', v: '$468K', c: yellow },
            { l: lang === 'zh' ? '上线产品' : 'Shipped', v: '4+', c: orange },
            { l: lang === 'zh' ? '工作年限' : 'Years', v: '5', c: purple },
            { l: lang === 'zh' ? '挑战进度' : 'Challenge', v: pct.toFixed(2) + '%', c: green },
          ].map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily: display, fontSize: isMobile ? 36 : 64, fontWeight: 700,
                color: s.c, letterSpacing: isMobile ? -1 : -2, lineHeight: 1, marginBottom: 8,
                fontVariantNumeric: 'tabular-nums',
              }}>{s.v}</div>
              <div style={{ fontFamily: mono, fontSize: isMobile ? 10 : 12, color: '#888', letterSpacing: 1.5 }}>{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── GRANTS — big list with bold values ─── */}
      <div id="sec-grants" data-anchor className="rv" style={{ padding: PAD }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 28 : 56,
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{
              fontFamily: mono, fontSize: 12, color: orange,
              letterSpacing: 3, fontWeight: 700, marginBottom: 8,
            }}>§ 03 / {tt(D.ui.grants).toUpperCase()}</div>
            <h2 style={{
              fontFamily: display, fontSize: isMobile ? 44 : 88, fontWeight: 700,
              letterSpacing: isMobile ? -1.5 : -3, lineHeight: 0.9, margin: '0 0 20px',
            }}>
              {lang === 'zh' ? <>过去拿过 <br/><span style={{ background: yellow, padding: '0 10px' }}>$468K</span><br/>的资助。</> : <>I've raised<br/><span style={{ background: yellow, padding: '0 10px' }}>$468K</span><br/>in grants.</>}
            </h2>
            <p style={{
              fontFamily: body, fontSize: isMobile ? 15 : 17, color: sub, lineHeight: 1.6, margin: 0, maxWidth: 460,
            }}>{lang === 'zh' ? '从 Starknet 到 Moonbeam 到 EigenLayer。能把 idea 拿到 funded 这件事，我练了 5 年。' : 'From Starknet to Moonbeam to EigenLayer. I\'ve been turning ideas into funded projects for 5 years.'}</p>
          </div>

          <div className="rv rv-stagger" style={{ display: 'flex', flexDirection: 'column' }}>
            {D.grants.map((g, i) => (
              <div key={i} style={{
                padding: isMobile ? '14px 0' : '20px 0',
                borderTop: i === 0 ? `2px solid ${ink}` : 'none',
                borderBottom: `2px solid ${ink}`,
                display: 'grid', gridTemplateColumns: '1fr auto',
                gap: isMobile ? 12 : 24, alignItems: 'center',
                cursor: 'pointer', transition: 'background .15s, padding .25s',
              }}
                onMouseEnter={(e) => { if (isMobile) return; e.currentTarget.style.background = '#fffef9'; e.currentTarget.style.paddingLeft = '12px'; }}
                onMouseLeave={(e) => { if (isMobile) return; e.currentTarget.style.background = ''; e.currentTarget.style.paddingLeft = ''; }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: display, fontSize: isMobile ? 17 : 24, fontWeight: 700,
                    letterSpacing: -0.5, marginBottom: 4,
                  }}>{g.org}</div>
                  <div style={{ fontFamily: body, fontSize: isMobile ? 12 : 14, color: sub, lineHeight: 1.4 }}>
                    {tt(g.label)}
                  </div>
                </div>
                <div style={{
                  fontFamily: display, fontSize: isMobile ? 22 : 36, fontWeight: 700,
                  color: ink, letterSpacing: -1, fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                }}>{g.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── STACK + GITHUB combined ─── */}
      <div className="rv" style={{
        background: bg, padding: PAD,
        borderTop: `2px solid ${ink}`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 36 : 56,
        }}>
          {/* Identity */}
          <div>
            <div style={{
              fontFamily: mono, fontSize: 12, color: orange,
              letterSpacing: 3, fontWeight: 700, marginBottom: 8,
            }}>§ 04 / {tt(D.ui.identity).toUpperCase()}</div>
            <h2 style={{
              fontFamily: display, fontSize: isMobile ? 36 : 64, fontWeight: 700,
              letterSpacing: isMobile ? -1 : -2, lineHeight: 0.95, margin: '0 0 24px',
            }}>
              {lang === 'zh' ? '我是谁。' : 'Who I am.'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* 主业 */}
              <div>
                <div style={{ fontFamily: mono, fontSize: 11, color: sub, letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>
                  / {lang === 'zh' ? '主业' : 'MAIN'}
                </div>
                <div style={{
                  fontFamily: display, fontSize: isMobile ? 20 : 24, fontWeight: 700,
                  letterSpacing: -0.5, lineHeight: 1.3,
                  padding: '10px 16px', background: yellow, border: `2px solid ${ink}`,
                  boxShadow: `3px 3px 0 ${ink}`, display: 'inline-block',
                }}>{tt(D.identity.main)}</div>
              </div>

              {/* 角色 */}
              <div>
                <div style={{ fontFamily: mono, fontSize: 11, color: sub, letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>
                  / {lang === 'zh' ? '角色' : 'ROLES'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {D.identity.roles.map((role, idx) => (
                    <span key={idx} className="stack-pill" style={{
                      padding: '8px 14px', fontFamily: display, fontSize: 16, fontWeight: 700,
                      background: [purple, orange, yellow][idx % 3], border: `2px solid ${ink}`,
                      color: ink, letterSpacing: -0.3,
                      boxShadow: `3px 3px 0 ${ink}`,
                      '--r': `${rot(idx)}deg`,
                    }}>{tt(role)}</span>
                  ))}
                </div>
              </div>

              {/* 方法 */}
              <div>
                <div style={{ fontFamily: mono, fontSize: 11, color: sub, letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>
                  / {lang === 'zh' ? '方法' : 'METHOD'}
                </div>
                <div style={{
                  fontFamily: body, fontSize: isMobile ? 15 : 17, lineHeight: 1.6,
                  color: ink, padding: '12px 16px',
                  borderLeft: `4px solid ${orange}`, background: card,
                }}>{tt(D.identity.method)}</div>
              </div>

              {/* 标签 */}
              <div>
                <div style={{ fontFamily: mono, fontSize: 11, color: sub, letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>
                  / {lang === 'zh' ? '标签' : 'TAG'}
                </div>
                <div style={{
                  fontFamily: display, fontSize: isMobile ? 22 : 28, fontWeight: 700,
                  letterSpacing: -0.5, color: ink, lineHeight: 1.2,
                  borderBottom: `4px solid ${orange}`, paddingBottom: 6,
                  display: 'inline-block',
                }}>{tt(D.identity.tagline)}</div>
              </div>
            </div>
          </div>

          {/* GitHub */}
          <div>
            <div style={{
              fontFamily: mono, fontSize: 12, color: orange,
              letterSpacing: 3, fontWeight: 700, marginBottom: 8,
            }}>§ 05 / GITHUB</div>
            <h2 style={{
              fontFamily: display, fontSize: isMobile ? 36 : 64, fontWeight: 700,
              letterSpacing: isMobile ? -1 : -2, lineHeight: 0.95, margin: '0 0 40px',
            }}>
              @peter-jim
            </h2>

            <div className="rv-stagger" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32,
            }}>
              {[
                { l: 'STARS', v: D.gh.stars, c: yellow },
                { l: 'COMMITS', v: D.gh.commits.toLocaleString(), c: orange },
                { l: 'REPOS', v: D.gh.repos, c: purple },
                { l: 'CONTRIBS', v: D.gh.contribs.toLocaleString(), c: green },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: 20, background: card, border: `2px solid ${ink}`,
                  boxShadow: `4px 4px 0 ${s.c}`,
                }}>
                  <div style={{
                    fontFamily: display, fontSize: 44, fontWeight: 700,
                    color: ink, letterSpacing: -1.5, lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums', marginBottom: 6,
                  }}>{s.v}</div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: sub, letterSpacing: 1.5, fontWeight: 600 }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            {/* contrib heatmap */}
            <div style={{
              padding: 16, background: card, border: `2px solid ${ink}`,
              boxShadow: `4px 4px 0 ${ink}`,
            }}>
              <div style={{
                fontFamily: mono, fontSize: 11, color: sub,
                letterSpacing: 1.5, marginBottom: 10, fontWeight: 600,
              }}>{lang === 'zh' ? '近 26 周提交' : 'LAST 26 WEEKS'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(26, 1fr)', gap: 3 }}>
                {Array.from({ length: 26 * 7 }, (_, i) => {
                  const seed = (i * 41 + 7) % 100;
                  const v = seed > 78 ? 4 : seed > 55 ? 3 : seed > 32 ? 2 : seed > 16 ? 1 : 0;
                  const cols = ['#eae5d8', '#f4d8ad', '#f4cb04', '#ff8c1a', orange];
                  return <div key={i} style={{ aspectRatio: '1', background: cols[v], border: `1px solid ${ink}` }} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── LOG — building in public (commented out — future: blog) ───
      <div id="sec-log" data-anchor className="rv" style={{ padding: PAD, borderTop: `2px solid ${ink}` }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between',
          gap: isMobile ? 16 : 0,
          marginBottom: isMobile ? 24 : 40,
        }}>
          <div>
            <div style={{
              fontFamily: mono, fontSize: 12, color: orange,
              letterSpacing: 3, fontWeight: 700, marginBottom: 8,
            }}>§ 06 / {tt(D.ui.building_in_public).toUpperCase()}</div>
            <h2 style={{
              fontFamily: display, fontSize: isMobile ? 44 : 88, fontWeight: 700,
              letterSpacing: isMobile ? -1.5 : -3, lineHeight: 0.9, margin: 0,
            }}>
              {lang === 'zh' ? <>每天都在<br/>记录<span style={{ color: orange }}>。</span></> : <>I write this<br/>every <span style={{ color: orange }}>day</span>.</>}
            </h2>
          </div>
          <button style={{
            background: ink, color: bg, border: `2px solid ${ink}`,
            padding: isMobile ? '10px 16px' : '12px 20px',
            fontFamily: display, fontSize: isMobile ? 13 : 14, fontWeight: 700,
            cursor: 'pointer', boxShadow: `4px 4px 0 ${orange}`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>{tt(D.ui.view_all)} →</button>
        </div>

        <div className="rv rv-stagger" style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
          gap: isMobile ? 16 : 16,
        }}>
          {D.log.map((e, i) => {
            const tints = [yellow, purple, orange, green, '#ff79c6'];
            const shadowNames = ['yellow', 'purple', 'orange', 'green', 'pink'];
            return (
              <div key={i} className={`lift lift-shadow-${shadowNames[i]}`} style={{
                background: card, padding: 20, border: `2px solid ${ink}`,
                position: 'relative', minHeight: isMobile ? 'auto' : 200,
                marginTop: isMobile ? 0 : (i % 2 === 1 ? 20 : 0),
                boxShadow: `5px 5px 0 ${tints[i]}`,
              }}>
                <div style={{
                  position: 'absolute', top: -10, right: 12,
                  background: tints[i], padding: '4px 10px',
                  fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                  border: `2px solid ${ink}`,
                }}>{e.date}</div>
                <p style={{
                  fontFamily: body, fontSize: 16, lineHeight: 1.5,
                  margin: '20px 0 0', color: ink,
                }}>{tt(e.text)}</p>
              </div>
            );
          })}
        </div>
      </div>
      */}

      {/* ─── FIND ME — Hire / Community / Newsletter ─── */}
      <div id="sec-hire" data-anchor className="rv" style={{
        padding: PAD, background: orange, color: ink,
        borderTop: `2px solid ${ink}`, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 320,
          background: `repeating-linear-gradient(45deg, ${ink} 0, ${ink} 4px, transparent 4px, transparent 16px)`,
          opacity: 0.12,
        }} />

        {/* Header */}
        <div style={{
          position: 'relative',
          marginBottom: isMobile ? 28 : 40,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between',
          gap: isMobile ? 16 : 40,
        }}>
          <div>
            <div style={{
              fontFamily: mono, fontSize: 12, color: ink,
              letterSpacing: 3, fontWeight: 700, marginBottom: 8,
            }}>§ 07 / {lang === 'zh' ? '找到我 · FIND ME' : 'FIND ME · 找到我'}</div>
            <h2 style={{
              fontFamily: display, fontSize: isMobile ? 46 : 96, fontWeight: 700,
              letterSpacing: isMobile ? -2 : -4, lineHeight: 0.9, margin: 0,
            }}>
              {lang === 'zh' ? <>三种方式<br/><span style={{ background: ink, color: orange, padding: '0 12px' }}>跟上我</span><span style={{ color: ink }}>.</span></> : <>Three ways to<br/><span style={{ background: ink, color: orange, padding: '0 12px' }}>follow along</span>.</>}
            </h2>
          </div>
          <div style={{
            maxWidth: isMobile ? '100%' : 360,
            paddingBottom: isMobile ? 0 : 16,
            fontFamily: body, fontSize: isMobile ? 14 : 16, lineHeight: 1.5, color: ink,
          }}>
            {lang === 'zh'
              ? '想合作就发邮件；想跟挑战进度就订阅或加群。慢慢来，比较快。'
              : 'Want to work together → email me. Want the inside view → subscribe or join the circle.'}
          </div>
        </div>

        {/* 3-card grid */}
        <div style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1.45fr 1fr',
          gap: isMobile ? 36 : 24,
          alignItems: 'stretch',
        }}>

          {/* ─── HIRE ─── */}
          <div className="lift lift-shadow-ink" style={{
            background: card, color: ink, padding: 28,
            border: `2px solid ${ink}`, boxShadow: `6px 6px 0 ${ink}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              fontFamily: mono, fontSize: 11, fontWeight: 700, color: orange,
              letterSpacing: 2.5, marginBottom: 16,
            }}>✦ {tt(D.ui.hire).toUpperCase()}</div>
            <h3 style={{
              fontFamily: display, fontSize: 40, fontWeight: 700,
              margin: '0 0 14px', letterSpacing: -1.2, lineHeight: 0.95,
            }}>
              {lang === 'zh' ? <>想一起<br/>做产品？</> : <>Got a project<br/>in mind?</>}
            </h3>
            <p style={{
              fontFamily: body, fontSize: 14, color: sub, lineHeight: 1.55,
              margin: '0 0 20px', flex: 1,
            }}>{tt(D.ui.hire_desc)}</p>

            {/* what's in scope */}
            <div style={{
              padding: '14px 16px', background: '#f8f4e8',
              border: `1.5px dashed ${ink}`, marginBottom: 20,
            }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: sub, letterSpacing: 1.5, marginBottom: 8, fontWeight: 700 }}>
                {lang === 'zh' ? '近期可接' : 'AVAILABLE FOR'}
              </div>
              <div style={{ fontFamily: body, fontSize: 13, lineHeight: 1.55 }}>
                {lang === 'zh' ? (
                  <>· AI 产品 0→1<br/>· Web3 / ZK 工程<br/>· 短期顾问 / Code review</>
                ) : (
                  <>· AI product 0→1<br/>· Web3 / ZK builds<br/>· Short advisory / code review</>
                )}
              </div>
            </div>

            <a href="mailto:deng7209@qq.com" className="magnet" {...magnet(0.15)} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: ink, color: orange, padding: '14px 20px',
              fontFamily: display, fontSize: 15, fontWeight: 700,
              textDecoration: 'none', boxShadow: `4px 4px 0 ${orange === ink ? bg : '#000'}`,
            }}>
              {tt(D.ui.hire_cta)} <span>↗</span>
            </a>
          </div>

          {/* ─── COMMUNITY ¥99 — central, prominent ─── */}
          <div className="lift lift-shadow-yellow" style={{
            background: ink, color: bg, padding: 28,
            border: `2px solid ${ink}`,
            boxShadow: `6px 6px 0 ${yellow}`,
            position: 'relative', display: 'flex', flexDirection: 'column',
          }}>
            {/* corner sticker */}
            <div className="wobble" style={{
              position: 'absolute', top: -16, right: 16, zIndex: 2,
              background: yellow, color: ink, padding: '6px 12px',
              border: `2px solid ${ink}`, boxShadow: `3px 3px 0 ${ink}`,
              fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            }}>★ {lang === 'zh' ? '内圈' : 'INNER CIRCLE'} ★</div>

            <div style={{
              fontFamily: mono, fontSize: 11, fontWeight: 700, color: yellow,
              letterSpacing: 2.5, marginBottom: 14,
            }}>● {tt(D.ui.community_title).toUpperCase()}</div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{
                fontFamily: display, fontSize: 32, fontWeight: 700,
                color: yellow, lineHeight: 1, marginTop: 8,
              }}>{D.community.currency}</span>
              <span style={{
                fontFamily: display, fontSize: 96, fontWeight: 700,
                color: yellow, lineHeight: 0.9, letterSpacing: -4,
                fontVariantNumeric: 'tabular-nums',
              }}>{D.community.price}</span>
              <span style={{
                fontFamily: mono, fontSize: 12, color: '#888',
                letterSpacing: 1, marginLeft: 10, fontWeight: 500,
              }}>RMB</span>
            </div>
            <div style={{
              fontFamily: mono, fontSize: 11, color: '#ccc',
              letterSpacing: 1.5, marginBottom: 18,
            }}>{tt(D.community.type).toUpperCase()}</div>

            <p style={{
              fontFamily: body, fontSize: 14, color: '#ddd', lineHeight: 1.55,
              margin: '0 0 20px',
            }}>{tt(D.ui.community_pitch)}</p>

            {/* Benefits */}
            <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none' }}>
              {(D.community.benefits[lang] || D.community.benefits.en).map((b, i) => (
                <li key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  fontFamily: body, fontSize: 13.5, lineHeight: 1.55, color: bg,
                  padding: '5px 0',
                }}>
                  <span style={{ color: yellow, fontFamily: display, fontWeight: 700, lineHeight: 1.5 }}>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Pay method toggle + QR */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                background: bg, padding: 8, border: `2px solid ${yellow}`,
                position: 'relative',
              }}>
                <img
                  src={payMethod === 'wechat' ? 'b24485cba7361c7566ce8f1568ac2f25.jpg' : 'd45154cee95857eb50131d080be38c0e.jpg'}
                  alt={payMethod === 'wechat' ? '微信支付' : '支付宝'}
                  style={{ width: 160, height: 160, display: 'block', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => setPayMethod('wechat')} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', cursor: 'pointer',
                  background: payMethod === 'wechat' ? '#1aad19' : 'transparent',
                  color: payMethod === 'wechat' ? '#fff' : bg,
                  border: `2px solid ${payMethod === 'wechat' ? '#1aad19' : '#444'}`,
                  fontFamily: display, fontSize: 14, fontWeight: 700,
                  letterSpacing: -0.2, textAlign: 'left',
                }}>
                  <span style={{
                    width: 22, height: 22, background: payMethod === 'wechat' ? '#fff' : '#1aad19',
                    color: payMethod === 'wechat' ? '#1aad19' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: display, fontWeight: 700, fontSize: 13,
                  }}>微</span>
                  {tt(D.ui.community_pay_wechat)}
                </button>
                <button onClick={() => setPayMethod('alipay')} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', cursor: 'pointer',
                  background: payMethod === 'alipay' ? '#1677ff' : 'transparent',
                  color: payMethod === 'alipay' ? '#fff' : bg,
                  border: `2px solid ${payMethod === 'alipay' ? '#1677ff' : '#444'}`,
                  fontFamily: display, fontSize: 14, fontWeight: 700,
                  letterSpacing: -0.2, textAlign: 'left',
                }}>
                  <span style={{
                    width: 22, height: 22, background: payMethod === 'alipay' ? '#fff' : '#1677ff',
                    color: payMethod === 'alipay' ? '#1677ff' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: display, fontWeight: 700, fontSize: 13,
                  }}>支</span>
                  {tt(D.ui.community_pay_alipay)}
                </button>

                {/* Seat count */}
                <div style={{ marginTop: 6 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontFamily: mono, fontSize: 10, color: '#888',
                    letterSpacing: 1, marginBottom: 4, fontWeight: 600,
                  }}>
                    <span>{tt(D.ui.community_seats).toUpperCase()}</span>
                    <span style={{ color: yellow }}>{D.community.seats.current} / {D.community.seats.cap}</span>
                  </div>
                  <div style={{ height: 4, background: '#222', position: 'relative' }}>
                    <div className="progress-fill" style={{
                      position: 'absolute', inset: 0,
                      width: `${mounted ? (D.community.seats.current / D.community.seats.cap) * 100 : 0}%`,
                      background: yellow,
                    }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: 20, paddingTop: 14, borderTop: `1.5px dashed #333`,
              fontFamily: mono, fontSize: 11, color: '#888', lineHeight: 1.6,
              letterSpacing: 0.5,
            }}>
              {tt(D.ui.community_after_pay)}
              <span style={{ color: yellow, fontWeight: 700 }}>deng7209@qq.com</span>
              {lang === 'zh' ? ' 入群' : ''}
            </div>
          </div>

          {/* ─── NEWSLETTER ─── */}
          <div className="lift lift-shadow-ink" style={{
            background: card, color: ink, padding: 28,
            border: `2px solid ${ink}`, boxShadow: `6px 6px 0 ${ink}`,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              fontFamily: mono, fontSize: 11, fontWeight: 700, color: orange,
              letterSpacing: 2.5, marginBottom: 16, display: 'flex', justifyContent: 'space-between',
            }}>
              <span>✉ {tt(D.ui.newsletter).toUpperCase()}</span>
              <span style={{ color: sub }}>{lang === 'zh' ? '免费' : 'FREE'}</span>
            </div>
            <h3 style={{
              fontFamily: display, fontSize: 40, fontWeight: 700,
              margin: '0 0 14px', letterSpacing: -1.2, lineHeight: 0.95,
            }}>
              {lang === 'zh' ? <>每月一封<br/>真实数字。</> : <>One letter,<br/>real numbers.</>}
            </h3>
            <p style={{
              fontFamily: body, fontSize: 14, color: sub, lineHeight: 1.55,
              margin: '0 0 20px', flex: 1,
            }}>{tt(D.ui.newsletter_sub)}</p>

            {/* Form / success state */}
            {!emailOk ? (
              <form onSubmit={submitEmail} noValidate style={{ marginBottom: 14 }}>
                <div style={{
                  display: 'flex', gap: 0,
                  border: `2px solid ${emailErr ? '#c1392b' : ink}`,
                  background: bg,
                  transition: 'border-color .2s',
                }}>
                  <input
                    value={emailVal}
                    onChange={(e) => { setEmailVal(e.target.value); setEmailErr(''); }}
                    placeholder={tt(D.ui.email_placeholder)}
                    type="email"
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      padding: '12px 14px', fontFamily: mono, fontSize: 13,
                      outline: 'none', color: ink,
                    }} />
                  <button type="submit" style={{
                    background: ink, color: bg, border: 'none',
                    padding: '0 16px', fontFamily: display, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  }}>{tt(D.ui.subscribe)} <span>→</span></button>
                </div>
                {emailErr && (
                  <div style={{
                    marginTop: 6, fontFamily: mono, fontSize: 11,
                    color: '#c1392b', letterSpacing: 0.5,
                  }}>↳ {emailErr}</div>
                )}
              </form>
            ) : (
              <div style={{
                marginBottom: 14, padding: '14px 16px',
                background: '#1eaa6f', color: '#fff',
                border: `2px solid ${ink}`, boxShadow: `3px 3px 0 ${ink}`,
                fontFamily: body, fontSize: 14, fontWeight: 600, lineHeight: 1.5,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <span style={{ fontFamily: display, fontSize: 18, marginTop: -1 }}>✓</span>
                <div>
                  <div style={{ marginBottom: 2 }}>{tt(D.ui.subscribed_ok)}</div>
                  <div style={{ fontFamily: mono, fontSize: 11, opacity: 0.85, fontWeight: 500 }}>{emailVal}</div>
                </div>
              </div>
            )}

            {/* Subscriber count + twitter */}
            <div style={{
              paddingTop: 14, borderTop: `1.5px dashed ${ink}`,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: mono, fontSize: 12, color: sub }}>
                <span style={{ display: 'flex', gap: -6 }}>
                  {[yellow, purple, orange, green].map((c, i) => (
                    <span key={i} style={{
                      width: 18, height: 18, borderRadius: 9, background: c,
                      border: `1.5px solid ${ink}`, marginLeft: i > 0 ? -7 : 0,
                    }} />
                  ))}
                </span>
                <span style={{ fontWeight: 600 }}>{tt(D.ui.subscribers_count)}</span>
              </div>
              <a href={D.socials[5].href} target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: body, fontSize: 13, color: ink, textDecoration: 'none',
                fontWeight: 600,
              }}>
                <span style={{
                  width: 22, height: 22, background: ink, color: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: display, fontSize: 13, fontWeight: 700,
                }}>𝕏</span>
                <span>@lancedeng0</span>
                <span style={{ marginLeft: 'auto', color: sub, fontSize: 12 }}>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div style={{
        background: ink, color: bg, padding: isMobile ? '28px 20px 24px' : '40px 56px 32px',
        borderTop: `2px solid ${ink}`,
      }}>
        <div style={{
          fontFamily: display, fontSize: isMobile ? 56 : 140, fontWeight: 700,
          letterSpacing: isMobile ? -2 : -5, lineHeight: 0.85, marginBottom: isMobile ? 18 : 24,
        }}>
          {tt(D.name)}<span style={{ color: orange }}>.</span><span style={{ color: yellow, fontSize: isMobile ? 24 : 60 }}>site</span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1.5fr repeat(3, 1fr)',
          gap: isMobile ? 20 : 32,
          paddingTop: isMobile ? 18 : 24,
          borderTop: `2px solid #333`,
        }}>
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <div style={{ fontFamily: body, fontSize: isMobile ? 13 : 14, color: '#aaa', lineHeight: 1.6 }}>
              {tt(D.tagline)}
              <br />© 2026 · {lang === 'zh' ? '北京' : 'Beijing'}
            </div>
          </div>
          {[
            { h: lang === 'zh' ? '邮箱' : 'Email', items: [D.socials[0]] },
            { h: lang === 'zh' ? '中文平台' : 'CN Social', items: D.socials.slice(1, 4) },
            { h: lang === 'zh' ? '代码 & 国际' : 'Code & Intl', items: D.socials.slice(4) },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontFamily: mono, fontSize: 10, color: '#888', letterSpacing: 2, marginBottom: 10, fontWeight: 600 }}>
                {col.h.toUpperCase()}
              </div>
              {col.items.map((s, j) => (
                <a key={j} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={{
                  display: 'block', fontFamily: display, fontSize: isMobile ? 13 : 15, fontWeight: 600,
                  color: bg, textDecoration: 'none', marginBottom: 4,
                  wordBreak: 'break-word',
                }}>
                  <span style={{ color: '#888', fontSize: 11, fontFamily: mono, marginRight: 8 }}>{s.label}</span>
                  {s.value}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          marginTop: isMobile ? 20 : 28, paddingTop: isMobile ? 14 : 20, borderTop: `1px solid #222`,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 6 : 0,
          justifyContent: 'space-between',
          fontFamily: mono, fontSize: isMobile ? 10 : 11, color: '#666', letterSpacing: 1,
        }}>
          <span>★ {lang === 'zh' ? '公开建造 · 2026·05·08' : 'BUILDING IN PUBLIC SINCE 2026·05·08'}</span>
          <span>{isMobile ? 'SPACE GROTESK · GEIST' : 'SET IN SPACE GROTESK · GEIST · JETBRAINS MONO'}</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes marquee-x{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes float-rotate{0%,100%{transform:rotate(var(--r,0deg)) translateY(0)}50%{transform:rotate(calc(var(--r,0deg) + 1.5deg)) translateY(-3px)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}

        /* reveal-on-scroll */
        .rv{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.2,.65,.2,1),transform .9s cubic-bezier(.2,.65,.2,1);will-change:opacity,transform}
        .rv.rv-in{opacity:1;transform:none}
        .rv.rv-slow{transition-duration:1.2s}
        .rv.rv-fast{transition-duration:.55s;transform:translateY(14px)}
        .rv-stagger > *{opacity:0;transform:translateY(20px);transition:opacity .7s cubic-bezier(.2,.65,.2,1),transform .7s cubic-bezier(.2,.65,.2,1)}
        .rv-stagger.rv-in > *{opacity:1;transform:none}
        .rv-stagger.rv-in > *:nth-child(1){transition-delay:.05s}
        .rv-stagger.rv-in > *:nth-child(2){transition-delay:.13s}
        .rv-stagger.rv-in > *:nth-child(3){transition-delay:.21s}
        .rv-stagger.rv-in > *:nth-child(4){transition-delay:.29s}
        .rv-stagger.rv-in > *:nth-child(5){transition-delay:.37s}
        .rv-stagger.rv-in > *:nth-child(6){transition-delay:.45s}
        .rv-stagger.rv-in > *:nth-child(7){transition-delay:.53s}

        /* hero digits stagger */
        .digit-in{display:inline-block;opacity:0;transform:translateY(40px) rotate(-6deg);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
        .mounted .digit-in{opacity:1;transform:none}
        .mounted .digit-in:nth-child(1){transition-delay:.05s}
        .mounted .digit-in:nth-child(2){transition-delay:.13s}
        .mounted .digit-in:nth-child(3){transition-delay:.21s}
        .mounted .digit-in:nth-child(4){transition-delay:.29s}
        .mounted .digit-in:nth-child(5){transition-delay:.37s}
        .mounted .digit-in:nth-child(6){transition-delay:.45s}
        .mounted .digit-in:nth-child(7){transition-delay:.53s}
        .mounted .digit-in:nth-child(8){transition-delay:.61s}

        /* card lift */
        .lift{transition:transform .25s cubic-bezier(.2,.7,.2,1),box-shadow .25s cubic-bezier(.2,.7,.2,1)}
        .lift:hover{transform:translate(-4px,-4px)}
        .lift-shadow-ink:hover{box-shadow:10px 10px 0 #0e0e0e}
        .lift-shadow-yellow:hover{box-shadow:10px 10px 0 #f4cb04}
        .lift-shadow-orange:hover{box-shadow:10px 10px 0 #ff5722}
        .lift-shadow-purple:hover{box-shadow:10px 10px 0 #6d51e8}
        .lift-shadow-green:hover{box-shadow:10px 10px 0 #1eaa6f}
        .lift-shadow-pink:hover{box-shadow:10px 10px 0 #ff79c6}

        /* magnetic button base — transform set via JS handler */
        .magnet{transition:transform .18s cubic-bezier(.2,.7,.2,1)}

        /* tilt-on-hover for stack pills */
        .stack-pill{transition:transform .2s cubic-bezier(.2,.7,.2,1);transform:rotate(var(--r,0deg))}
        .stack-pill:hover{transform:rotate(0) translateY(-3px) scale(1.04)}

        /* nav link underline */
        .nav-link{position:relative;cursor:pointer;padding:4px 0}
        .nav-link::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:2px;background:#ff5722;transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,.7,.2,1)}
        .nav-link:hover::after{transform:scaleX(1)}

        /* live cursor blink */
        .cursor-blink{animation:blink 1s steps(1) infinite}

        /* marquee track: render the content twice and slide -50% to loop seamlessly */
        .marquee{display:flex;width:max-content;animation:marquee-x 38s linear infinite}
        .marquee-row{display:flex;align-items:center;gap:32px;padding-right:32px}

        /* progress bar fill */
        .progress-fill{transition:width 1.4s cubic-bezier(.2,.7,.2,1)}

        /* float-wobble sticker */
        .wobble{--r:6deg;animation:float-rotate 4s ease-in-out infinite}

        /* live dot pulsing inside marquee */
        .live-dot{display:inline-block;width:8px;height:8px;border-radius:4px;background:#1eaa6f;box-shadow:0 0 8px #1eaa6f;animation:pulse 1.6s infinite}

        /* anchors w/ scroll margin so sticky-feel nav doesn't overlap */
        [data-anchor]{scroll-margin-top:24px}

        /* respect motion preferences */
        @media (prefers-reduced-motion: reduce){
          .rv,.rv-stagger>*,.digit-in,.lift,.stack-pill,.magnet{transition:none !important;animation:none !important;opacity:1 !important;transform:none !important}
          .marquee{animation:none}
        }
      `}</style>
    </div>
  );
}

window.V3Indie = V3Indie;
