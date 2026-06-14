import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SiteHeader } from '@/components/SiteHeader';

const CARD_BG = '#F3EBDD';
const ACCENT = '#9F8064';
const MUTED = '#7A6654';
const KEY_COLOR = '#B5683E';   // warm terracotta for JSON keys
const VALUE_COLOR = '#7A6654'; // muted brown for JSON values

const FIELDS = [
  { key: 'name', value: 'BuildC3', href: undefined, quoted: true },
  { key: 'tagline', value: 'Build in, with, and for the community.', href: undefined, quoted: true },
  { key: 'phone', value: '+91 90761 50904', href: 'tel:+919076150904', quoted: true },
  { key: 'email', value: 'bbuildc3@gmail.com', href: 'mailto:bbuildc3@gmail.com', quoted: false },
  { key: 'instagram', value: '@buildc3', href: 'https://www.instagram.com/buildc3', quoted: false },
  { key: 'join', value: 'buildc3.tech/join-buildc3', href: '/join-buildc3', quoted: false },
];

type Segment = { text: string; color: string };

/** Build the JSON as an array of lines, each line a list of colored segments. */
function buildLines(): { segments: Segment[]; href?: string }[] {
  const lines: { segments: Segment[]; href?: string }[] = [];
  lines.push({ segments: [{ text: '{', color: MUTED }] });
  FIELDS.forEach((f, idx) => {
    const isLast = idx === FIELDS.length - 1;
    const display = f.quoted ? `"${f.value}"` : f.value;
    lines.push({
      href: f.href,
      segments: [
        { text: '  ', color: MUTED },
        { text: `"${f.key}"`, color: KEY_COLOR },
        { text: ': ', color: MUTED },
        { text: display, color: VALUE_COLOR },
        ...(isLast ? [] : [{ text: ',', color: MUTED }]),
      ],
    });
  });
  lines.push({ segments: [{ text: '}', color: MUTED }] });
  return lines;
}

/** Typewriter that reveals lines sequentially, typing each line char-by-char. */
function useTypewriter(
  lineLengths: number[],
  { start, speed = 22, lineDelay = 90 }: { start: boolean; speed?: number; lineDelay?: number }
) {
  const [line, setLine] = useState(0);   // current line index being typed
  const [chars, setChars] = useState(0); // chars revealed on current line
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!start) return;
    if (line >= lineLengths.length) return;

    const len = lineLengths[line];
    if (chars < len) {
      timer.current = setTimeout(() => setChars((c) => c + 1), speed);
    } else {
      // line complete → pause, then move to next line
      timer.current = setTimeout(() => {
        setLine((l) => l + 1);
        setChars(0);
      }, lineDelay);
    }
    return () => clearTimeout(timer.current);
  }, [start, line, chars, lineLengths, speed, lineDelay]);

  const done = line >= lineLengths.length;
  return { line, chars, done };
}

const Contact = () => {
  const lines = useMemo(buildLines, []);
  const lineLengths = useMemo(() => lines.map((l) => l.segments.reduce((n, s) => n + s.text.length, 0)), [lines]);

  // start typing shortly after the card finishes its entrance animation
  const [startTyping, setStartTyping] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStartTyping(true), 650);
    return () => clearTimeout(t);
  }, []);

  const { line: activeLine, chars, done } = useTypewriter(lineLengths, { start: startTyping });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-20 md:pt-24">
        <section className="px-4 md:px-6 pb-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: ACCENT }}>
              Contact Us
            </h1>
            <p className="mt-4 text-base md:text-lg max-w-md mx-auto font-light leading-relaxed" style={{ color: MUTED }}>
              Reach out, follow along, or come build with us.
            </p>
          </motion.div>

          {/* ── Editor window "business card" ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden border border-[#9F8064]/30 shadow-[0_20px_48px_rgba(60,35,15,0.18)]"
            style={{ backgroundColor: CARD_BG }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-4 px-5 py-4 border-b border-[#9F8064]/25"
              style={{ backgroundColor: '#EAdfcd' }}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: '#E0625B' }} />
                <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: '#E3B341' }} />
                <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: '#8FB573' }} />
              </div>
              <span className="flex-1 text-center text-base md:text-lg font-semibold" style={{ color: ACCENT }}>
                business-card.json
              </span>
              <span className="w-14" />
            </div>

            {/* Code body */}
            <div className="px-4 sm:px-6 md:px-14 py-8 md:py-16 font-mono text-sm sm:text-base md:text-2xl leading-loose">
              {lines.map((l, lineIdx) => {
                const isActive = lineIdx === activeLine;
                const isRevealed = lineIdx < activeLine;
                // how many chars of this line to show
                const visible = isRevealed ? lineLengths[lineIdx] : isActive ? chars : 0;
                // don't render lines that haven't started yet (keeps height stable-ish)
                return (
                  <CodeLine key={lineIdx} n={lineIdx + 1} dim={!isRevealed && !isActive}>
                    <TypedLine
                      segments={l.segments}
                      visible={visible}
                      href={l.href}
                      showCaret={isActive && !done}
                    />
                  </CodeLine>
                );
              })}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

/** Renders a line's colored segments, clipped to `visible` characters. */
const TypedLine = ({
  segments,
  visible,
  href,
  showCaret,
}: {
  segments: Segment[];
  visible: number;
  href?: string;
  showCaret: boolean;
}) => {
  let remaining = visible;
  const rendered = segments.map((seg, i) => {
    if (remaining <= 0) return <span key={i} />;
    const slice = seg.text.slice(0, remaining);
    remaining -= slice.length;
    return (
      <span key={i} style={{ color: seg.color, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {slice}
      </span>
    );
  });

  const fullyTyped = visible >= segments.reduce((n, s) => n + s.text.length, 0);
  const content = (
    <>
      {rendered}
      {showCaret && (
        <span
          className="inline-block w-[0.55ch] ml-0.5 animate-pulse"
          style={{ backgroundColor: ACCENT, color: 'transparent' }}
        >
          .
        </span>
      )}
    </>
  );

  // make the value clickable once the line is fully typed
  if (href && fullyTyped) {
    return (
      <a
        href={href}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-[#9F8064] hover:text-[#8a6d54]"
      >
        {content}
      </a>
    );
  }
  return content;
};

const CodeLine = ({
  n,
  dim,
  children,
}: {
  n: number;
  dim?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex items-start min-h-[1.6em]">
    <span
      className="select-none w-6 md:w-10 shrink-0 text-right pr-2 md:pr-4 opacity-50"
      style={{ color: MUTED, visibility: dim ? 'hidden' : 'visible' }}
    >
      {n}
    </span>
    <span className="min-w-0 flex-1 break-words">{children}</span>
  </div>
);

export default Contact;
