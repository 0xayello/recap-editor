'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toPng } from 'html-to-image';

const BACKGROUNDS = {
  checker_green: {
    label: 'Xadrez Verde',
    style: {
      backgroundColor: '#fff',
      backgroundImage: 'linear-gradient(45deg,#7dd3a8 25%,transparent 25%),linear-gradient(-45deg,#7dd3a8 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#7dd3a8 75%),linear-gradient(-45deg,transparent 75%,#7dd3a8 75%)',
    },
    footerColor: 'rgba(0,0,0,0.45)',
    swatch: '#7dd3a8',
  },
  checker_navy: {
    label: 'Xadrez Marinho',
    style: {
      backgroundColor: '#fff',
      backgroundImage: 'linear-gradient(45deg,#2d2d6e 25%,transparent 25%),linear-gradient(-45deg,#2d2d6e 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#2d2d6e 75%),linear-gradient(-45deg,transparent 75%,#2d2d6e 75%)',
    },
    footerColor: 'rgba(255,255,255,0.6)',
    swatch: '#2d2d6e',
  },
  deusa_light: {
    label: 'Deusa Clara',
    style: { backgroundImage: 'url(/bg_deusa_light.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    overlay: 'rgba(255,255,255,0.15)',
    footerColor: 'rgba(0,0,0,0.45)',
    swatch: '#c8ddb5',
  },
  deusa_saturated: {
    label: 'Deusa Saturada',
    style: { backgroundImage: 'url(/bg_deusa_saturated.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    overlay: 'rgba(255,255,255,0.25)',
    footerColor: 'rgba(0,0,0,0.45)',
    swatch: '#8bc49a',
  },
  louros: {
    label: 'Louros',
    style: { backgroundImage: 'url(/bg_louros.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    footerColor: 'rgba(0,0,0,0.45)',
    swatch: '#d5d5c0',
  },
  solid_cream: {
    label: 'Creme',
    style: { background: '#F5F0E8' },
    footerColor: 'rgba(0,0,0,0.45)',
    swatch: '#F5F0E8',
  },
  gradient_sage: {
    label: 'Sage',
    style: { background: 'linear-gradient(180deg,#e8ede4 0%,#c5d1bc 100%)' },
    footerColor: 'rgba(0,0,0,0.45)',
    swatch: '#c5d1bc',
  },
};

const DEFAULT_RECAP = [
  { date: 'Sábado', text: 'Trump deu ultimato de 48h ao Irã.\nPetróleo bateu $112.' },
  { date: 'Domingo', text: 'Trump recuou e pausou ataques.\nBTC saltou +5,86% em horas.' },
  { date: 'Domingo', text: 'Hack de $25M na stablecoin USR.\nPreço derreteu 97% em minutos.' },
  { date: 'Domingo', text: 'Backpack Exchange lançou token BP.\nAirdrop de 25%, claim liberado na segunda.\nFDV de ~$150M. Zero alocação pra insiders.' },
  { date: 'Segunda', text: 'SEC e CFTC classificaram\n16 criptos como commodities digitais.\nMarco regulatório histórico.' },
  { date: 'Terça', text: 'Aave bateu $1 trilhão em empréstimos —\nprimeiro protocolo DeFi a atingir a marca.' },
  { date: 'Quinta', text: 'Trump estendeu por +10 dias\na pausa de ataques ao Irã.' },
];

const DEFAULT_PROXIMA = [
  { date: 'Segunda a Quarta', text: 'EthCC Cannes — principal conferência\nEthereum da Europa.\nAave v4, restaking e regulação na pauta.' },
  { date: 'Segunda', text: 'Índice de confiança do consumidor\namericano. Termômetro de recessão.' },
  { date: 'Terça', text: 'PMI industrial dos EUA.\nAbaixo de 50 = contração.' },
  { date: '~Domingo', text: 'Pausa Trump-Irã expira.\nDiplomacia ou escalada —\nsem meio-termo.' },
  { date: 'Semana toda', text: 'Token unlocks: Wormhole (28%),\nPumpFun (23%), LayerZero (5,6%).\nPressão de venda à vista.' },
];

// The actual story card at a given scale
function StoryCard({ title, events, bgKey, scale = 1, innerRef }) {
  const bg = BACKGROUNDS[bgKey];
  const S = (v) => v * scale;

  // Scale background-size/position for checker patterns
  const bgStyle = { ...bg.style };
  if (bgStyle.backgroundImage && bgStyle.backgroundImage.includes('linear-gradient')) {
    bgStyle.backgroundSize = `${S(80)}px ${S(80)}px`;
    bgStyle.backgroundPosition = `0 0, 0 ${S(40)}px, ${S(40)}px -${S(40)}px, -${S(40)}px 0px`;
  }

  return (
    <div
      ref={innerRef}
      style={{
        width: S(1080),
        height: S(1920),
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...bgStyle,
      }}
    >
      {/* Overlay for image backgrounds */}
      {bg.overlay && (
        <div style={{
          position: 'absolute', inset: 0,
          background: bg.overlay, zIndex: 1,
        }} />
      )}

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Card */}
        <div style={{
          width: S(860),
          background: '#FAF6EE',
          borderRadius: S(32),
          border: `${S(3)}px solid #2a2a2a`,
          boxShadow: `${S(12)}px ${S(12)}px 0px #2a2a2a`,
          padding: `${S(56)}px ${S(56)}px 0 ${S(56)}px`,
        }}>
          <h1 style={{
            fontSize: S(46), fontWeight: 900, color: '#1a1a1a',
            lineHeight: 1.2, textAlign: 'center', margin: 0,
          }}>{title}</h1>
          <div style={{
            height: S(4), background: '#1a1a1a',
            margin: `${S(18)}px 0 ${S(8)}px 0`,
          }} />

          {events.map((ev, i) => (
            <div key={i} style={{
              padding: `${S(24)}px 0`,
              borderBottom: i < events.length - 1 ? `${S(1.5)}px solid #c8c0b0` : 'none',
            }}>
              <p style={{
                fontSize: S(30), fontWeight: 800, color: '#1a1a1a',
                margin: 0, textAlign: 'center', letterSpacing: S(1),
                textTransform: 'uppercase',
                marginBottom: S(8),
              }}>{ev.date}</p>
              <p style={{
                fontSize: S(33), lineHeight: 1.45, color: '#2a2a2a',
                fontWeight: 400, margin: 0, whiteSpace: 'pre-wrap',
                textAlign: 'center',
              }}>
                {ev.text}
              </p>
            </div>
          ))}

          <div style={{
            marginTop: S(12), borderTop: `${S(3)}px solid #2a2a2a`,
            padding: `${S(10)}px 0`,
          }} />
        </div>

        {/* Footer */}
        <div style={{ marginTop: S(28), textAlign: 'center' }}>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: S(28), color: bg.footerColor,
          }}>Paradigma.education</span>
        </div>
      </div>
    </div>
  );
}

function EventEditor({ events, setEvents, label, title, setTitle }) {
  const add = () => setEvents([...events, { date: 'DD/mmm:', text: '' }]);
  const remove = (i) => setEvents(events.filter((_, j) => j !== i));
  const update = (i, field, val) => {
    const copy = [...events];
    copy[i] = { ...copy[i], [field]: val };
    setEvents(copy);
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= events.length) return;
    const copy = [...events];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setEvents(copy);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={labelStyle}>Título</div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          ...inputBase,
          width: '100%', fontWeight: 800, fontSize: 15,
          marginBottom: 16,
        }}
      />

      <div style={labelStyle}>{label}</div>
      {events.map((ev, i) => (
        <div key={i} style={{ display: 'flex', gap: 5, marginBottom: 8, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingTop: 6 }}>
            <button onClick={() => move(i, -1)} disabled={i === 0}
              style={arrowBtn(i === 0)}>▲</button>
            <button onClick={() => move(i, 1)} disabled={i === events.length - 1}
              style={arrowBtn(i === events.length - 1)}>▼</button>
          </div>
          <input value={ev.date} onChange={(e) => update(i, 'date', e.target.value)}
            style={{ ...inputBase, width: 88, fontWeight: 700 }} />
          <textarea value={ev.text} onChange={(e) => update(i, 'text', e.target.value)}
            rows={2}
            style={{
              ...inputBase, flex: 1, resize: 'vertical', minHeight: 38,
              lineHeight: 1.4,
            }} />
          <button onClick={() => remove(i)}
            style={{
              background: 'transparent', border: '1px solid #444',
              color: '#777', borderRadius: 6, padding: '5px 7px',
              cursor: 'pointer', fontSize: 12, marginTop: 5,
            }}>✕</button>
        </div>
      ))}
      <button onClick={add} style={{
        background: 'transparent', border: '1px dashed #444',
        color: '#777', borderRadius: 8, padding: '8px', cursor: 'pointer',
        fontSize: 13, width: '100%',
      }}>+ Evento</button>
    </div>
  );
}

const labelStyle = {
  fontSize: 11, fontWeight: 700, color: '#666',
  letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8,
};
const inputBase = {
  padding: '8px 10px', border: '1px solid #333', borderRadius: 6,
  background: '#1a1a1a', color: '#fff', fontSize: 13,
  fontFamily: 'Inter, sans-serif',
};
const arrowBtn = (disabled) => ({
  background: 'transparent', border: 'none',
  color: disabled ? '#2a2a2a' : '#777',
  cursor: disabled ? 'default' : 'pointer',
  fontSize: 10, padding: '1px 4px', lineHeight: 1,
});

export default function RecapEditor() {
  const searchParams = useSearchParams();
  const [recapEvents, setRecapEvents] = useState(DEFAULT_RECAP);
  const [proximaEvents, setProximaEvents] = useState(DEFAULT_PROXIMA);
  const [recapTitle, setRecapTitle] = useState('Recap da Semana');
  const [proximaTitle, setProximaTitle] = useState('Próxima Semana');
  const [bg, setBg] = useState('checker_green');
  const [activeStory, setActiveStory] = useState('recap');
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const previewRef = useRef(null);
  const exportRef = useRef(null);

  // Hydrate from URL params on mount
  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(dataParam))));
        if (decoded.recap) {
          if (decoded.recap.title) setRecapTitle(decoded.recap.title);
          if (decoded.recap.events) setRecapEvents(decoded.recap.events);
        }
        if (decoded.proxima) {
          if (decoded.proxima.title) setProximaTitle(decoded.proxima.title);
          if (decoded.proxima.events) setProximaEvents(decoded.proxima.events);
        }
        if (decoded.bg && BACKGROUNDS[decoded.bg]) setBg(decoded.bg);
        if (decoded.story) setActiveStory(decoded.story);
      } catch (e) {
        console.warn('Failed to parse ?data param:', e);
      }
    }
  }, [searchParams]);

  const PREVIEW_SCALE = 0.34;

  const currentTitle = activeStory === 'recap' ? recapTitle : proximaTitle;
  const currentEvents = activeStory === 'recap' ? recapEvents : proximaEvents;

  const exportPng = useCallback(async () => {
    setExporting(true);
    try {
      const el = exportRef.current;
      if (!el) return;
      const dataUrl = await toPng(el, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${activeStory}_${bg}.png`;
      a.click();
    } catch (err) {
      console.error('Export error:', err);
      alert('Erro no export. Tente novamente.');
    }
    setExporting(false);
  }, [activeStory, bg]);

  return (
    <div style={{
      display: 'flex', height: '100vh', background: '#111',
      color: '#eee', fontFamily: "'Inter', sans-serif", overflow: 'hidden',
    }}>
      {/* LEFT — Controls */}
      <div style={{
        width: 360, padding: '20px 14px', overflowY: 'auto',
        borderRight: '1px solid #222', flexShrink: 0,
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 18, color: '#F7941D' }}>
          ⚡ Recap Editor
        </div>

        {/* Story tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          {['recap', 'proxima'].map((s) => (
            <button key={s} onClick={() => setActiveStory(s)} style={{
              flex: 1, padding: '9px 0',
              background: activeStory === s ? '#F7941D' : '#1a1a1a',
              color: activeStory === s ? '#000' : '#777',
              border: '1px solid #333', borderRadius: 8,
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>
              {s === 'recap' ? '⚡ Recap' : '🗓️ Próxima'}
            </button>
          ))}
        </div>

        {/* Background picker */}
        <div style={labelStyle}>Fundo</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          {Object.entries(BACKGROUNDS).map(([key, val]) => (
            <button key={key} onClick={() => setBg(key)} style={{
              width: 40, height: 40,
              background: val.swatch,
              border: bg === key ? '3px solid #F7941D' : '2px solid #333',
              borderRadius: 8, cursor: 'pointer',
              position: 'relative',
            }}>
              {bg === key && <span style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#000', fontWeight: 900, fontSize: 14,
              }}>✓</span>}
            </button>
          ))}
        </div>

        {/* Event editor */}
        {activeStory === 'recap' ? (
          <EventEditor events={recapEvents} setEvents={setRecapEvents}
            label="Eventos" title={recapTitle} setTitle={setRecapTitle} />
        ) : (
          <EventEditor events={proximaEvents} setEvents={setProximaEvents}
            label="Eventos" title={proximaTitle} setTitle={setProximaTitle} />
        )}

        {/* Export button */}
        <button onClick={exportPng} disabled={exporting} style={{
          width: '100%', padding: '13px 0', background: '#F7941D',
          color: '#000', border: 'none', borderRadius: 10,
          fontWeight: 800, fontSize: 14, cursor: 'pointer',
          letterSpacing: 1, opacity: exporting ? 0.5 : 1,
          marginTop: 8,
        }}>
          {exporting ? 'Exportando...' : '⬇ Exportar PNG 1080×1920'}
        </button>

        <button onClick={() => {
          const payload = {
            recap: { title: recapTitle, events: recapEvents },
            proxima: { title: proximaTitle, events: proximaEvents },
            bg,
            story: activeStory,
          };
          const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
          const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
          navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }} style={{
          width: '100%', padding: '11px 0',
          background: copied ? '#22C55E' : '#1a1a1a',
          color: copied ? '#000' : '#999',
          border: '1px solid #333', borderRadius: 10,
          fontWeight: 700, fontSize: 13, cursor: 'pointer',
          marginTop: 6, transition: 'all 0.2s',
        }}>
          {copied ? '✓ Link copiado!' : '🔗 Copiar link preenchido'}
        </button>

        <div style={{ fontSize: 10, color: '#444', marginTop: 10, lineHeight: 1.5 }}>
          O PNG exporta em resolução full 1080×1920 direto do browser.
        </div>
      </div>

      {/* RIGHT — Preview (scaled) */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a', overflow: 'auto', padding: 20,
      }}>
        <div ref={previewRef} style={{
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <StoryCard title={currentTitle} events={currentEvents}
            bgKey={bg} scale={PREVIEW_SCALE} />
        </div>
      </div>

      {/* Hidden full-size render for export */}
      <div style={{ position: 'fixed', left: -9999, top: 0 }}>
        <StoryCard title={currentTitle} events={currentEvents}
          bgKey={bg} scale={1} innerRef={exportRef} />
      </div>
    </div>
  );
}
