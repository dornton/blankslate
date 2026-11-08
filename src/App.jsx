import { useEffect, useRef, useState } from 'react';
import AsciiField from './components/AsciiField.jsx';
import { ScrollVelocity } from './components/ScrollVelocity.jsx';
import TechText from './components/TechText.jsx';
import MetallicPaint from './components/MetallicPaint.jsx';

const DEPTHS = [
  { id: 'email', label: 'Email only', fields: ['email', 'handle'] },
  { id: 'phone', label: 'Email + phone', fields: ['email', 'phone', 'handle'] },
  {
    id: 'full',
    label: 'Full persona',
    fields: ['name', 'address', 'email', 'phone', 'handle']
  }
];

const DEMO = {
  id: 'bls_94c2 · 7f3a · 1e08',
  name: 'Mara Ellison',
  address: '0000 Placeholder Ln, Unit 0, Nowhere, NM 00000',
  email: 'm.ellison@demo.invalid',
  phone: '+1 555 0100 000',
  handle: '@m_ellison_demo'
};

const LABELS = {
  name: 'name',
  address: 'address',
  email: 'email',
  phone: 'phone',
  handle: 'handle'
};

const FAQ = [
  {
    q: 'What do I actually get?',
    a: 'A name, an address, an email, a phone number. The full depth adds a handle. It arrives as one card you can copy from field by field.'
  },
  {
    q: 'How long does it last?',
    a: 'Five minutes by default. The clock sits on the card. When it reaches zero the identity is gone. Kill it sooner if you are done.'
  },
  {
    q: 'Do you keep the details?',
    a: 'The card lives in your browser for the session. Nothing is written down and nothing survives the timer.'
  },
  {
    q: 'Why do some platforms block it?',
    a: 'Banks, government services and most large platforms check more than a phone number. A shared number fails those checks. The blocked list is honest about it.'
  },
  {
    q: 'Can I make calls with the number?',
    a: 'No. Numbers are SMS only and shared between users. Read the code, do not call it.'
  },
  {
    q: 'What is it not for?',
    a: 'Impersonating someone, dodging a check that matters, or anything that needs a real identity. This page is a preview: sample data, no account, no payment, no mail.'
  }
];

const STEPS = [
  {
    n: '01',
    title: 'Pick a depth',
    body: 'Email only. Email and phone. Or the full persona. Choose how much you need, nothing more.'
  },
  {
    n: '02',
    title: 'Generate',
    body: 'One click. The card fills in. Names, addresses, mail, numbers. All of it disposable.'
  },
  {
    n: '03',
    title: 'Use it. Then kill it.',
    body: 'Everything lives on a timer. When it runs out, the identity is gone. Or end it early yourself.'
  }
];

const WORKS = ['Signal', 'Telegram', 'Discord', 'Reddit', 'Steam', 'Bluesky'];
const BLOCKED = ['Google', 'WhatsApp', 'Apple ID', 'Banks', 'Crypto exchanges', 'Government'];

function formatClock(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const [depth, setDepth] = useState('phone');
  const [phase, setPhase] = useState('idle');
  const [seconds, setSeconds] = useState(300);
  const [copied, setCopied] = useState(null);
  const timer = useRef(null);
  const copyTimer = useRef(null);

  const active = DEPTHS.find(item => item.id === depth) ?? DEPTHS[1];

  useEffect(() => {
    if (phase !== 'live') return undefined;
    const tick = window.setInterval(() => {
      setSeconds(value => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(tick);
  }, [phase]);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(copyTimer.current);
    },
    []
  );

  const generate = () => {
    window.clearTimeout(timer.current);
    setPhase('generating');
    setSeconds(300);
    timer.current = window.setTimeout(() => setPhase('live'), 700);
  };

  const kill = () => {
    window.clearTimeout(timer.current);
    setPhase('idle');
    setSeconds(300);
  };

  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(null), 1200);
    } catch {
      setCopied(null);
    }
  };

  const expired = phase === 'live' && seconds === 0;

  return (
    <div className="page">
      <header className="nav">
        <a className="nav__brand" href="#top" aria-label="BlankSlate home">
          <span className="wordmark wordmark--small">
            bl<span className="wordmark__slash">/</span>anks<span className="wordmark__slash">/</span>ate
          </span>
        </a>
        <nav className="nav__links" aria-label="Sections">
          <a href="#how">How it works</a>
          <a href="#limits">Limits</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav__cta" href="#generate">
          Generate
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__field" aria-hidden="true">
            <AsciiField cellSize={12} opacity={0.42} />
          </div>

          <div className="hero__inner">
            <div className="hero__mark">
              <MetallicPaint
                imageSrc="/blankslate-mark.png"
                color="#eae4d8"
                density={2.2}
                softness={0.62}
                dispersion={0.22}
                distortion={0.03}
                edgeBend={0.55}
                angle={58}
                speed={0.7}
                scale={0.92}
                mouseTilt={0.6}
              />
            </div>
            <p className="eyebrow">Burner identity Generator</p>
            <h1 className="hero__title mosh">
              <span className="mosh__base">
                Start as <span className="hero__title-accent">no one.</span>
              </span>
              <span className="mosh__layer mosh__layer--a" aria-hidden="true">
                Start as <span className="hero__title-accent">no one.</span>
              </span>
              <span className="mosh__layer mosh__layer--b" aria-hidden="true">
                Start as <span className="hero__title-accent">no one.</span>
              </span>
            </h1>
            <p className="hero__sub">
              A full burner identity. Name, address, phone, email. Generated in one click. Gone when
              you say so.
            </p>

            <div className="controls" id="generate">
              <div className="depth" role="group" aria-label="Identity depth">
                <span className="depth__label">depth</span>
                {DEPTHS.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className={`depth__option${depth === item.id ? ' is-active' : ''}`}
                    aria-pressed={depth === item.id}
                    onClick={() => setDepth(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="primary"
                onClick={generate}
                disabled={phase === 'generating'}
              >
                {phase === 'generating' ? 'Generating' : 'Generate identity'}
              </button>
            </div>
        </section>

        <section className="panel" aria-live="polite">
          <article className={`card${expired ? ' card--expired' : ''}`}>
            <div className="card__bar">
              <span className="card__status">
                <span className={`dot${phase === 'live' && !expired ? ' dot--live' : ''}`} />
                {phase === 'live' ? 'session.live' : phase === 'generating' ? 'session.pending' : 'session.empty'}
              </span>
              <span className="card__clock">
                {expired ? 'expired' : formatClock(phase === 'live' ? seconds : 300)}
              </span>
            </div>

            <dl className="card__fields">
              {active.fields.map(key => {
                const value = phase === 'live' ? DEMO[key] : phase === 'generating' ? '· · ·' : '—';
                return (
                  <div className="field" key={key}>
                    <dt>{LABELS[key]}</dt>
                    <dd>
                      <span className={`field__value${phase === 'live' ? '' : ' field__value--empty'}`}>
                        {value}
                      </span>
                      {phase === 'live' ? (
                        <button
                          type="button"
                          className="copy"
                          onClick={() => copy(key, DEMO[key])}
                          aria-label={`Copy ${LABELS[key]}`}
                        >
                          {copied === key ? 'copied' : 'copy'}
                        </button>
                      ) : null}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="card__foot">
              <span className="card__id">{phase === 'live' ? DEMO.id : 'bls_———— · ————'}</span>
              <div className="card__actions">
                <button type="button" className="ghost" onClick={kill} disabled={phase === 'idle'}>
                  Kill now
                </button>
              </div>
            </div>
          </article>
        </section>

        <section className="band" aria-label="BlankSlate">
          <div className="band__field" aria-hidden="true">
            <AsciiField cellSize={9} opacity={0.16} origin="center" />
          </div>
          <ScrollVelocity
            texts={[
              <span key="a" className="band__text">
                Start as no one
              </span>,
              <span key="b" className="band__text band__text--outline">
                BlankSlate
              </span>
            ]}
            velocity={45}
            skewWithVelocity={10}
            scaleWithVelocity={0.08}
            draggable
            separator="/"
            fadeEdges
            pauseOnHover
            fontSize={68}
            fontWeight={900}
            gap={8}
            className="band__copy"
          />
        </section>

        <section className="section" id="how">
          <div className="section__head">
            <p className="eyebrow">How it works</p>
          </div>
          <div className="steps">
            {STEPS.map(step => (
              <article className="step" key={step.n}>
                <span className="step__n">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--split" id="limits">
          <div className="limits">
            <p className="eyebrow">Works with</p>
            <ul className="list list--ok">
              {WORKS.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="limits">
            <p className="eyebrow">Known blocked</p>
            <ul className="list list--no">
              {BLOCKED.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="limits__note">
              Numbers are shared and SMS only, platforms change their rules without
              warning. Check before you rely on one.
            </p>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="section__head">
            <p className="eyebrow">FAQ</p>

          </div>
          <div className="faq">
            {FAQ.map(item => (
              <details className="faq__item" key={item.q}>
                <summary>
                  <span>{item.q}</span>
                  <span className="faq__mark" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

      </main>

      <footer className="footer">
        <div className="footer__left">
          <div className="footer__wordmark">
            <TechText
              text="bl/anks/ate"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight={800}
              fontSize={128}
              letterSpacing={-0.015}
              align="center"
              color="#ede8de"
              accentColor="#b7c5c6"
              reveal="letter"
              dashLength={3}
              dashGap={3}
              specks={8}
              selection={false}
              labels={false}
              draggable
              clickKick
              intro="none"
              sweep
              speed={0.7}
            />
          </div>
        </div>
        <p className="footer__meta">hello, world</p>
      </footer>
    </div>
  );
}
