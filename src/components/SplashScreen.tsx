import { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DURATION_MS = 3800;

const captions = [
  { at: 10, text: "Every recovery begins with a steady heart..." },
  { at: 38, text: "A gentle hand, a watchful eye..." },
  { at: 68, text: "Trained to care. Empowered to heal." }
];

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [percent, setPercent] = useState(0);
  const [currentCaption, setCurrentCaption] = useState('');
  const [stage, setStage] = useState<'scene' | 'opening' | 'done'>('scene');
  const [playDoors, setPlayDoors] = useState(false);
  const [exiting, setExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const start = performance.now();
    let animId: number;

    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));
      setPercent(pct);

      // Update captions
      for (let i = captions.length - 1; i >= 0; i--) {
        if (pct >= captions[i].at) {
          setCurrentCaption(captions[i].text);
          break;
        }
      }

      if (elapsed < DURATION_MS) {
        animId = requestAnimationFrame(tick);
      } else {
        // Switch to Stage 2: Logo Opening
        setStage('opening');
        setTimeout(() => {
          setPlayDoors(true);
          // Transition to Stage 3: Site reveal
          setTimeout(() => {
            setExiting(true);
            setTimeout(() => {
              setStage('done');
              onDone();
            }, 750);
          }, 2100);
        }, 100);
      }
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [onDone]);

  function handleApply() {
    setExiting(true);
    setTimeout(() => {
      setStage('done');
      onDone();
      navigate('/admission');
    }, 350);
  }

  if (stage === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] overflow-hidden select-none transition-opacity duration-700 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        fontFamily: "'Segoe UI', 'Helvetica Neue', system-ui, sans-serif",
      }}
    >

      {/* ============================================================ */}
      {/* STAGE 1 : CARE SCENE                                         */}
      {/* ============================================================ */}
      <div
        id="scene"
        className={`fixed inset-0 flex items-center justify-center transition-all duration-700 ${
          stage !== 'scene' ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
        }`}
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(28,93,160,.55), transparent 55%), radial-gradient(circle at 75% 80%, rgba(28,154,75,.28), transparent 50%), linear-gradient(180deg, #0a2648 0%, #123f70 100%)',
          zIndex: 20,
        }}
      >
        <div className="flex flex-col items-center gap-5 w-full max-w-lg px-4">
          <div className="relative w-full max-w-[460px] aspect-[480/300]">
            <svg viewBox="0 0 480 300" className="w-full h-full block overflow-visible">
              <defs>
                <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f2c49b" />
                  <stop offset="1" stopColor="#dfa476" />
                </linearGradient>
                <linearGradient id="uniformGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#e9eff3" />
                </linearGradient>
                <linearGradient id="pantsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1c5da0" />
                  <stop offset="1" stopColor="#0f3d70" />
                </linearGradient>
                <linearGradient id="blanketGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#39c06c" />
                  <stop offset="1" stopColor="#189646" />
                </linearGradient>
                <linearGradient id="mattressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#dde5ea" />
                </linearGradient>
                <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4a3220" />
                  <stop offset="1" stopColor="#2c1c10" />
                </linearGradient>
                <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#000000" stopOpacity=".35" />
                  <stop offset="1" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ground Shadow */}
              <ellipse cx="240" cy="272" rx="200" ry="14" fill="url(#floorShadow)" />

              {/* Heart Monitor */}
              <g id="monitorGroup" style={{ animation: 'monIn .5s ease forwards 1.5s', opacity: 0 }}>
                <rect x="18" y="176" width="10" height="60" rx="3" fill="#7c8b96" />
                <rect x="6" y="140" width="66" height="48" rx="7" fill="#0c2033" />
                <rect x="13" y="147" width="52" height="30" rx="3" fill="#08141f" />
                <polyline
                  className="ecg-line"
                  points="15,163 24,163 29,152 34,175 39,163 46,163 50,155 54,163 65,163"
                  fill="none"
                  stroke="#39c06c"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 140,
                    strokeDashoffset: 140,
                    animation: 'ecgDraw 1.8s linear infinite 2s',
                  }}
                />
                <circle
                  className="mon-dot"
                  cx="60"
                  cy="152"
                  r="2.6"
                  fill="#39c06c"
                  style={{ animation: 'dotBlink 1.8s ease-in-out infinite 2s' }}
                />
              </g>

              {/* Hospital Bed */}
              <g id="bedGroup">
                <rect x="72" y="244" width="6" height="24" rx="2" fill="#9aa7b0" />
                <rect x="286" y="244" width="6" height="24" rx="2" fill="#9aa7b0" />
                <circle cx="75" cy="270" r="5" fill="#6d7981" />
                <circle cx="289" cy="270" r="5" fill="#6d7981" />
                <rect x="60" y="238" width="240" height="8" rx="3" fill="#8b98a3" />
                <rect x="58" y="206" width="244" height="36" rx="10" fill="url(#mattressGrad)" />
                <path d="M64,200 q0,-14 20,-14 h30 q18,0 18,14 v10 q0,8 -18,8 h-30 q-20,0 -20,-8 z" fill="#ffffff" />
                <path d="M78,197 q10,5 22,0" fill="none" stroke="#d8dfe4" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M118,214 q6,-10 20,-8 q10,-8 22,-2 q14,-8 26,0 q12,-6 22,2 q10,-6 20,2 q10,4 12,14 v18 q0,6 -8,6 h-118 q-8,0 -8,-6 v-16 q0,-6 12,-10 z"
                  fill="url(#blanketGrad)"
                />
                <path d="M126,222 q60,-10 130,2" fill="none" stroke="#12833f" strokeWidth="2" opacity=".5" strokeLinecap="round" />
              </g>

              {/* Patient (breathing animation) */}
              <g
                id="patientGroup"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: '100px 250px',
                  animation: 'breathe 3.6s ease-in-out infinite',
                }}
              >
                <path d="M132,212 q18,-6 34,-2 q6,2 6,8 q0,6 -8,6 h-30 q-8,0 -8,-6 q0,-4 6,-6 z" fill="url(#skinGrad)" />
                <circle cx="168" cy="216" r="7" fill="url(#skinGrad)" />
                <ellipse cx="94" cy="198" rx="20" ry="19" fill="url(#skinGrad)" />
                <path d="M74,196 q-4,-24 20,-26 q22,-2 24,16 q1,6 -3,10 q-1,-10 -10,-12 q-14,-2 -18,8 q-2,4 -3,6 q-6,2 -10,-2 z" fill="url(#hairGrad)" />
                <ellipse cx="112" cy="200" rx="3" ry="5" fill="#dfa476" />
                <path d="M85,199 q3,3 7,0" stroke="#3a2416" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M99,199 q3,3 7,0" stroke="#3a2416" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M89,208 q6,4 12,0" stroke="#b97a54" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              </g>

              {/* Floating Heart */}
              <path
                id="careHeart"
                d="M148,175 c-9,-7 -15,-12 -15,-19 c0,-5.4 4.3,-9.6 9.6,-9.6 c3.1,0 6,1.5 7.4,3.8 c1.4,-2.3 4.3,-3.8 7.4,-3.8 c5.3,0 9.6,4.2 9.6,9.6 c0,7 -6,12 -15,19 z"
                fill="#39c06c"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  opacity: 0,
                  animation: 'heartFloat 2.6s ease-in-out infinite .4s, heartIn .5s ease forwards 1.2s',
                }}
              />

              {/* Nurse with Tending Arm */}
              <g id="nurseGroup">
                <path d="M388,168 q10,10 8,30 q-1,7 -7,7 q-6,0 -7,-7 q-2,-18 4,-30 z" fill="url(#uniformGrad)" />
                <circle cx="389" cy="204" r="6.5" fill="url(#skinGrad)" />
                <rect x="337" y="222" width="20" height="46" rx="7" fill="url(#pantsGrad)" />
                <rect x="361" y="222" width="20" height="46" rx="7" fill="url(#pantsGrad)" />
                <rect x="332" y="264" width="28" height="10" rx="5" fill="#f4f7f9" />
                <rect x="358" y="264" width="28" height="10" rx="5" fill="#f4f7f9" />
                <path d="M330,168 q-4,-14 14,-16 h30 q18,2 14,16 l4,56 q1,7 -8,7 h-50 q-9,0 -8,-7 z" fill="url(#uniformGrad)" />
                <rect x="336" y="196" width="14" height="10" rx="2" fill="none" stroke="#c7d0d7" strokeWidth="1.4" />
                <rect x="345" y="190" width="2.4" height="14" fill="#1c5da0" />
                <rect x="362" y="188" width="9" height="12" rx="1.5" fill="#eef3f7" stroke="#c7d0d7" strokeWidth="1" />
                <circle cx="366.5" cy="192.5" r="1.6" fill="#1c9a4b" />
                <g transform="translate(355,172)">
                  <rect x="-6" y="-1.6" width="12" height="3.2" rx="1" fill="#1c9a4b" />
                  <rect x="-1.6" y="-6" width="3.2" height="12" rx="1" fill="#1c9a4b" />
                </g>
                <path d="M340,162 q-6,10 0,20 q4,7 12,7 q7,0 8,-7" fill="none" stroke="#9aa7b0" strokeWidth="3" strokeLinecap="round" />
                <circle cx="360" cy="189" r="4" fill="#7c8b96" />

                {/* Tending arm (animated group) */}
                <g
                  id="tendArm"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: '337px 168px',
                    animation: 'tend 2.8s ease-in-out infinite',
                  }}
                >
                  <path d="M332,172 q-30,4 -46,20 q-6,6 -3,12" fill="none" stroke="url(#uniformGrad)" strokeWidth="16" strokeLinecap="round" />
                  <circle cx="283" cy="205" r="8" fill="url(#skinGrad)" />
                </g>

                <rect x="348" y="150" width="12" height="12" fill="url(#skinGrad)" />
                <ellipse cx="354" cy="136" rx="19" ry="18" fill="url(#skinGrad)" />
                <path d="M337,132 q-3,10 3,18 q-2,-10 2,-16 z" fill="url(#hairGrad)" />
                <path d="M371,132 q3,10 -3,18 q2,-10 -2,-16 z" fill="url(#hairGrad)" />
                <circle cx="347" cy="136" r="1.8" fill="#2c1c10" />
                <circle cx="361" cy="136" r="1.8" fill="#2c1c10" />
                <path d="M347,145 q7,5 14,0" stroke="#b97a54" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M333,122 q21,-14 42,0 q3,2 1,5 q-22,-10 -44,0 q-2,-3 1,-5 z" fill="#ffffff" />
                <rect x="335" y="126" width="38" height="7" rx="3.5" fill="#ffffff" />
                <g transform="translate(354,116)">
                  <rect x="-3.6" y="-1.1" width="7.2" height="2.2" rx="1" fill="#1c9a4b" />
                  <rect x="-1.1" y="-3.6" width="2.2" height="7.2" rx="1" fill="#1c9a4b" />
                </g>
              </g>
            </svg>
          </div>

          {/* Live Dynamic Caption */}
          <div className="min-h-[22px] text-center">
            {currentCaption && (
              <span
                key={currentCaption}
                className="text-xs sm:text-sm tracking-wide text-[#dce7f2] font-medium"
                style={{ animation: 'capFade .5s ease forwards' }}
              >
                {currentCaption}
              </span>
            )}
          </div>

          {/* Progress Percent */}
          <div className="text-[12px] text-white/50 tracking-widest font-mono">
            {percent}%
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* STAGE 2 : LOGO OPENING (Sliding Doors Reveal)                */}
      {/* ============================================================ */}
      <div
        id="opening"
        className={`fixed inset-0 flex items-center justify-center transition-all duration-300 ${
          stage === 'opening' ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ background: '#f4f7f9', zIndex: 30 }}
      >
        {/* Sliding Doors */}
        <div
          className="door door-l absolute top-0 bottom-0 left-0 w-1/2"
          style={{
            background: 'linear-gradient(160deg, #1c5da0, #0a2648)',
            transformOrigin: 'left center',
            animation: playDoors ? 'openL 1.1s cubic-bezier(.76,0,.24,1) forwards .15s' : 'none',
            zIndex: 2,
          }}
        />
        <div
          className="door door-r absolute top-0 bottom-0 right-0 w-1/2"
          style={{
            background: 'linear-gradient(160deg, #1c5da0, #0a2648)',
            transformOrigin: 'right center',
            animation: playDoors ? 'openR 1.1s cubic-bezier(.76,0,.24,1) forwards .15s' : 'none',
            zIndex: 2,
          }}
        />
        
        {/* Glowing Center Seam */}
        <div
          className="door-seam absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-[1px]"
          style={{
            background: 'rgba(255,255,255,.35)',
            boxShadow: '0 0 24px 4px rgba(255,255,255,.5)',
            zIndex: 3,
          }}
        />

        {/* Revealed Official Logo Content */}
        <div
          className="relative z-10 flex flex-col items-center gap-3.5 px-4 text-center"
          style={{
            opacity: 0,
            transform: 'scale(0.88)',
            animation: playDoors ? 'logoPop .9s cubic-bezier(.34,1.3,.4,1) forwards .75s' : 'none',
          }}
        >
          <img
            src="/mahalakshmi_nursing_logo.png"
            alt="Mahalakshmi College of Nursing"
            className="w-auto h-auto max-h-[160px] sm:max-h-[190px] max-w-[80vw] object-contain drop-shadow-md"
          />

          <div
            className="text-xs sm:text-sm tracking-[2.2px] text-gray-500 uppercase font-bold"
            style={{
              opacity: 0,
              animation: playDoors ? 'capFade .6s ease forwards 1.4s' : 'none',
            }}
          >
            Mahalakshmi College of Nursing • Tiruchirappalli
          </div>

          <div
            className="inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-widest text-primary-800 uppercase bg-primary-50 border border-primary-200 px-3.5 py-1 rounded-full mt-1"
            style={{
              opacity: 0,
              animation: playDoors ? 'capFade .6s ease forwards 1.6s' : 'none',
            }}
          >
            <ShieldCheck size={13} className="text-green-600" />
            <span>INC CODE: 986 • Affiliated to Dr. M.G.R. Medical University</span>
          </div>

          {/* Quick Apply Action Button */}
          <button
            onClick={handleApply}
            className="mt-3 flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            style={{
              opacity: 0,
              animation: playDoors ? 'capFade .6s ease forwards 1.8s' : 'none',
            }}
          >
            <Sparkles size={14} className="text-amber-300" />
            <span>Admissions 2026–27 Open</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Embedded Scoped Keyframes */}
      <style>{`
        @keyframes breathe {
          0%,100% { transform: scaleY(1); }
          50% { transform: scaleY(1.02) translateY(-1px); }
        }
        @keyframes tend {
          0%,100% { transform: rotate(-3deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes heartFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.1); }
        }
        @keyframes heartIn {
          to { opacity: 1; }
        }
        @keyframes monIn {
          to { opacity: 1; }
        }
        @keyframes ecgDraw {
          0% { stroke-dashoffset: 140; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -140; }
        }
        @keyframes dotBlink {
          0%,100% { opacity: .3; }
          50% { opacity: 1; }
        }
        @keyframes capFade {
          to { opacity: 1; }
        }
        @keyframes openL {
          to { transform: translateX(-100%); }
        }
        @keyframes openR {
          to { transform: translateX(100%); }
        }
        @keyframes logoPop {
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
