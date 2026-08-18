import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, MapPin, Car, Wrench, Star, Clock, Shield, CheckCircle2,
  ChevronRight, ChevronLeft, Upload, Calendar, Bell, User, Settings,
  BarChart3, FileText, MessageCircle, X, Menu, SlidersHorizontal,
  TrendingUp, DollarSign, Users, AlertTriangle, Zap, Battery, Snowflake,
  Disc, Gauge as GaugeIco, Fuel, Phone, Mail, Send, Sparkles, ThumbsUp,
  Award, Building2, CreditCard, LogOut, Plus, ImageIcon, Video, ArrowRight,
  Check, ShieldCheck, ClipboardList, PlayCircle, MapPinned, ChevronDown,
  BadgeCheck, Timer, Percent, Camera
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* TOKENS                                                                  */
/* ---------------------------------------------------------------------- */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

const C = {
  navy950: "#050D1C",
  navy900: "#0B1B32",
  navy800: "#122744",
  navy700: "#1A345A",
  blue500: "#2F6FED",
  blue400: "#5B8AFF",
  cyan400: "#4FD1FF",
  amber500: "#F5A524",
  grey50: "#F5F7FA",
  grey100: "#EDF1F6",
  grey200: "#E1E7EF",
  grey400: "#94A3B8",
  grey500: "#64748B",
  grey700: "#334155",
  white: "#FFFFFF",
};

const displayFont = "'Space Grotesk', sans-serif";
const bodyFont = "'Inter', sans-serif";
const monoFont = "'IBM Plex Mono', monospace";

/* ---------------------------------------------------------------------- */
/* MOCK DATA                                                               */
/* ---------------------------------------------------------------------- */
const PROBLEMS = [
  { id: "vidange", label: "Vidange", icon: Fuel },
  { id: "pneus", label: "Pneus", icon: Disc },
  { id: "freins", label: "Freins", icon: GaugeIco },
  { id: "batterie", label: "Batterie", icon: Battery },
  { id: "embrayage", label: "Embrayage", icon: Settings },
  { id: "distribution", label: "Distribution", icon: Zap },
  { id: "clim", label: "Climatisation", icon: Snowflake },
  { id: "diagnostic", label: "Diagnostic moteur", icon: AlertTriangle },
  { id: "carrosserie", label: "Carrosserie", icon: Car },
  { id: "autre", label: "Autre problème", icon: Wrench },
];

const GARAGES = [
  { id: 1, name: "Garage Lemaitre & Fils", rating: 4.8, reviews: 214, distance: 1.2, city: "Lille", price: 65, verified: true, hue: "#2F6FED",
    specialties: ["Freins", "Vidange", "Diagnostic moteur"], resp: "< 2h",
    slots: ["Auj. 16:30", "Auj. 18:00", "Dem. 09:00"] },
  { id: 2, name: "AutoTech Villeneuve", rating: 4.6, reviews: 132, distance: 2.4, city: "Villeneuve-d'Ascq", price: 58, verified: true, hue: "#4FD1FF",
    specialties: ["Pneus", "Climatisation", "Carrosserie"], resp: "< 1h",
    slots: ["Auj. 17:00", "Dem. 10:30", "Dem. 14:00"] },
  { id: 3, name: "Central Garage Roubaix", rating: 4.4, reviews: 89, distance: 3.1, city: "Roubaix", price: 72, verified: true, hue: "#F5A524",
    specialties: ["Embrayage", "Distribution", "Diagnostic moteur"], resp: "< 3h",
    slots: ["Dem. 09:30", "Dem. 11:00", "Dem. 15:00"] },
  { id: 4, name: "Garage du Vieux-Lille", rating: 4.9, reviews: 301, distance: 0.8, city: "Lille", price: 68, verified: true, hue: "#2F6FED",
    specialties: ["Freins", "Batterie", "Vidange"], resp: "< 1h",
    slots: ["Auj. 15:00", "Auj. 19:00", "Dem. 08:30"] },
  { id: 5, name: "Speed Motors", rating: 4.1, reviews: 54, distance: 4.6, city: "Lomme", price: 49, verified: false, hue: "#94A3B8",
    specialties: ["Pneus", "Vidange"], resp: "< 4h",
    slots: ["Dem. 13:00", "Dem. 16:30"] },
  { id: 6, name: "Nord Carrosserie Pro", rating: 4.7, reviews: 176, distance: 2.9, city: "Lambersart", price: 80, verified: true, hue: "#4FD1FF",
    specialties: ["Carrosserie", "Diagnostic moteur"], resp: "< 2h",
    slots: ["Auj. 18:30", "Dem. 09:00", "Dem. 17:00"] },
];

const TESTIMONIALS = [
  { name: "Camille R.", city: "Lille", text: "Devis reçu en 20 minutes, rendez-vous pris le jour même. Le garage était exactement comme décrit.", rating: 5 },
  { name: "Yanis B.", city: "Roubaix", text: "J'ai comparé trois garages pour mon embrayage et économisé plus de 150€. Interface très claire.", rating: 5 },
  { name: "Sophie M.", city: "Villeneuve-d'Ascq", text: "Le suivi de la réparation en temps réel change tout, je savais exactement où en était ma voiture.", rating: 4 },
];

/* ---------------------------------------------------------------------- */
/* PRIMITIVES                                                              */
/* ---------------------------------------------------------------------- */

function GaugeRing({ value = 80, size = 72, thickness = 6, color = C.blue500, track = "rgba(255,255,255,0.12)", label, sub, dark = false, ticks = 24 }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const cx = size / 2, cy = size / 2;
  const tickEls = [];
  for (let i = 0; i < ticks; i++) {
    const angle = (i / ticks) * 360;
    const rad = (angle - 90) * (Math.PI / 180);
    const rOuter = size / 2 + 3;
    const rInner = size / 2 + (i % (ticks / 8) === 0 ? -1 : 1);
    const x1 = cx + rOuter * Math.cos(rad);
    const y1 = cy + rOuter * Math.sin(rad);
    const x2 = cx + (rOuter + 3) * Math.cos(rad);
    const y2 = cy + (rOuter + 3) * Math.sin(rad);
    tickEls.push(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={dark ? "rgba(255,255,255,0.18)" : "rgba(11,27,50,0.15)"} strokeWidth={1} />
    );
  }
  return (
    <div style={{ position: "relative", width: size + 10, height: size + 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size + 10} height={size + 10} style={{ position: "absolute", top: 0, left: 0 }}>
        <g transform={`translate(5,5)`}>{tickEls}</g>
      </svg>
      <svg width={size} height={size} style={{ position: "absolute", top: 5, left: 5, transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} stroke={track} strokeWidth={thickness} fill="none" />
        <circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={thickness} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ fontFamily: monoFont, fontWeight: 600, fontSize: size * 0.24, color: dark ? "#fff" : C.navy900, lineHeight: 1 }}>{label}</div>
        {sub && <div style={{ fontFamily: bodyFont, fontSize: size * 0.12, color: dark ? C.grey400 : C.grey500, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Badge({ children, tone = "blue" }) {
  const tones = {
    blue: { bg: "rgba(47,111,237,0.1)", fg: C.blue500 },
    amber: { bg: "rgba(245,165,36,0.12)", fg: "#B4770D" },
    green: { bg: "rgba(34,197,94,0.12)", fg: "#15803D" },
    grey: { bg: C.grey100, fg: C.grey500 },
  };
  const t = tones[tone];
  return (
    <span style={{ background: t.bg, color: t.fg, fontFamily: bodyFont, fontWeight: 600, fontSize: 12, padding: "4px 10px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", size = "md", onClick, style, icon: Icon, full }) {
  const sizes = { sm: "8px 14px", md: "12px 20px", lg: "16px 28px" };
  const fontSizes = { sm: 13, md: 14.5, lg: 16 };
  const base = {
    fontFamily: bodyFont, fontWeight: 600, borderRadius: 10, cursor: "pointer",
    padding: sizes[size], fontSize: fontSizes[size], border: "none",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "all 0.15s ease", width: full ? "100%" : "auto",
  };
  const variants = {
    primary: { background: C.blue500, color: "#fff", boxShadow: "0 4px 14px rgba(47,111,237,0.35)" },
    dark: { background: C.navy900, color: "#fff" },
    outline: { background: "transparent", color: C.navy900, border: `1.5px solid ${C.grey200}` },
    ghost: { background: "transparent", color: C.blue500 },
    white: { background: "#fff", color: C.navy900, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
    amber: { background: C.amber500, color: "#1A1200" },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
      {Icon && <Icon size={size === "lg" ? 19 : 16} />}
      {children}
    </button>
  );
}

function Card({ children, style, hover }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: `1px solid ${C.grey200}`,
      transition: "all 0.2s ease", ...style,
    }}
      onMouseEnter={(e) => { if (hover) { e.currentTarget.style.boxShadow = "0 12px 32px rgba(11,27,50,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; } }}
      onMouseLeave={(e) => { if (hover) { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; } }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 24, height: 2, background: C.blue500 }} />
      <span style={{ fontFamily: monoFont, fontSize: 12.5, letterSpacing: 1.5, color: C.blue500, fontWeight: 600, textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}

function GaragePhoto({ hue, icon: Icon = Wrench, tall }) {
  return (
    <div style={{
      height: tall ? 160 : 120, borderRadius: 12, position: "relative", overflow: "hidden",
      background: `linear-gradient(135deg, ${hue}22, ${C.navy900})`,
    }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <defs>
          <pattern id={`grid-${hue.replace("#", "")}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke={hue} strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${hue.replace("#", "")})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={tall ? 40 : 30} color={hue} strokeWidth={1.5} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* NAVBAR                                                                  */
/* ---------------------------------------------------------------------- */
function Navbar({ view, setView, dark }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { id: "home", label: "Accueil" },
    { id: "results", label: "Trouver un garage" },
    { id: "client", label: "Espace client" },
    { id: "pro", label: "Espace garage" },
    { id: "admin", label: "Admin" },
  ];
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 40, background: dark ? "rgba(5,13,28,0.85)" : "rgba(255,255,255,0.9)",
      backdropFilter: "blur(12px)", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : C.grey200}`,
    }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setView("home")}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.blue500}, ${C.cyan400})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GaugeIco size={19} color="#fff" strokeWidth={2.2} />
          </div>
          <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 20, color: dark ? "#fff" : C.navy900, letterSpacing: -0.5 }}>AutoCare</span>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="autocare-nav-links">
          {links.map((l) => (
            <button key={l.id} onClick={() => setView(l.id)} style={{
              background: view === l.id ? (dark ? "rgba(255,255,255,0.1)" : C.grey100) : "transparent",
              border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer",
              fontFamily: bodyFont, fontSize: 14, fontWeight: 500,
              color: dark ? (view === l.id ? "#fff" : C.grey400) : (view === l.id ? C.navy900 : C.grey500),
            }}>{l.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant={dark ? "white" : "outline"} size="sm" onClick={() => setView("client")}>Se connecter</Button>
          <Button variant="primary" size="sm" onClick={() => setView("request")}>Demander un devis</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* AI ASSISTANT (floating)                                                 */
/* ---------------------------------------------------------------------- */
const AI_KB = [
  { kws: ["frein", "métallique", "grince", "crisse"], reply: "Un bruit métallique au freinage évoque généralement une usure des plaquettes (témoin d'usure qui frotte sur le disque). Je recommande un contrôle plaquettes/disques sous 7 jours.", type: "freins", urgency: "Élevée" },
  { kws: ["démarre pas", "batterie", "démarrage"], reply: "Symptôme typique d'une batterie faible ou d'un alternateur défaillant. Un diagnostic électrique rapide permettra de confirmer la cause.", type: "batterie", urgency: "Élevée" },
  { kws: ["fume", "fumée", "moteur chauffe", "surchauffe"], reply: "Cela peut indiquer une fuite de liquide de refroidissement ou un problème de joint de culasse. À faire vérifier en urgence pour éviter la casse moteur.", type: "diagnostic", urgency: "Urgente" },
  { kws: ["vibre", "volant", "roue"], reply: "Des vibrations dans le volant proviennent souvent d'un déséquilibrage de pneu ou d'une usure irrégulière. Un équilibrage/géométrie est conseillé.", type: "pneus", urgency: "Moyenne" },
  { kws: ["clim", "climatisation", "froid"], reply: "Une climatisation qui ne refroidit plus manque généralement de gaz réfrigérant ou présente une fuite sur le circuit. Une recharge avec contrôle d'étanchéité est recommandée.", type: "clim", urgency: "Faible" },
];

function aiAnalyze(text) {
  const low = text.toLowerCase();
  const hit = AI_KB.find((k) => k.kws.some((kw) => low.includes(kw)));
  if (hit) return hit;
  return { reply: "D'après votre description, plusieurs causes sont possibles. Je vous recommande un diagnostic complet chez un garage partenaire pour identifier précisément le problème.", type: "diagnostic", urgency: "Moyenne" };
}

function AIAssistant({ onOrient }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Bonjour 👋 Décrivez-moi le problème de votre véhicule en quelques mots, je vous aiderai à identifier la cause probable." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    const analysis = aiAnalyze(input);
    const aiMsg = {
      from: "ai", text: analysis.reply, urgency: analysis.urgency,
      cta: PROBLEMS.find((p) => p.id === analysis.type)?.label || "Diagnostic",
      type: analysis.type,
    };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 50, width: 58, height: 58, borderRadius: "50%",
        background: `linear-gradient(135deg, ${C.blue500}, ${C.cyan400})`, border: "none", cursor: "pointer",
        boxShadow: "0 8px 24px rgba(47,111,237,0.4)", display: open ? "none" : "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Sparkles size={24} color="#fff" />
      </button>
      {open && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 50, width: 380, maxWidth: "calc(100vw - 32px)",
          height: 520, maxHeight: "calc(100vh - 48px)", background: "#fff", borderRadius: 20,
          boxShadow: "0 24px 64px rgba(5,13,28,0.35)", display: "flex", flexDirection: "column", overflow: "hidden",
          border: `1px solid ${C.grey200}`,
        }}>
          <div style={{ background: C.navy900, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.blue500}, ${C.cyan400})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: displayFont, color: "#fff", fontSize: 14.5, fontWeight: 700 }}>Assistant AutoCare</div>
                <div style={{ fontFamily: bodyFont, color: C.grey400, fontSize: 11.5 }}>Diagnostic IA en temps réel</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer" }}><X size={19} color="#fff" /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12, background: C.grey50 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                <div style={{
                  background: m.from === "user" ? C.blue500 : "#fff", color: m.from === "user" ? "#fff" : C.navy900,
                  padding: "10px 13px", borderRadius: 14, borderBottomRightRadius: m.from === "user" ? 4 : 14,
                  borderBottomLeftRadius: m.from === "ai" ? 4 : 14, fontFamily: bodyFont, fontSize: 13.5, lineHeight: 1.5,
                  border: m.from === "ai" ? `1px solid ${C.grey200}` : "none",
                }}>
                  {m.text}
                </div>
                {m.urgency && (
                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Badge tone={m.urgency === "Urgente" ? "amber" : "blue"}>Urgence : {m.urgency}</Badge>
                    <button onClick={() => onOrient?.(m.type)} style={{
                      background: "transparent", border: `1.5px solid ${C.blue500}`, color: C.blue500, borderRadius: 999,
                      padding: "4px 10px", fontSize: 11.5, fontFamily: bodyFont, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                    }}>Voir garages {m.cta} <ArrowRight size={12} /></button>
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div style={{ padding: 12, borderTop: `1px solid ${C.grey200}`, display: "flex", gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ex: bruit métallique au freinage..." style={{
                flex: 1, border: `1.5px solid ${C.grey200}`, borderRadius: 10, padding: "10px 12px", fontFamily: bodyFont, fontSize: 13.5, outline: "none",
              }} />
            <button onClick={send} style={{ background: C.blue500, border: "none", borderRadius: 10, width: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Send size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* HOME                                                                     */
/* ---------------------------------------------------------------------- */
function Home({ setView }) {
  const steps = [
    { icon: ClipboardList, title: "Décrivez votre besoin", text: "Problème, véhicule, photos : notre formulaire intelligent qualifie votre demande en 2 minutes." },
    { icon: Users, title: "Comparez les garages", text: "Recevez plusieurs devis de garages vérifiés près de chez vous, avec avis et disponibilités." },
    { icon: Calendar, title: "Réservez en ligne", text: "Choisissez votre créneau, suivez la réparation en temps réel jusqu'à la restitution du véhicule." },
  ];
  const advantages = [
    { icon: ShieldCheck, title: "Garages vérifiés", text: "Chaque professionnel est contrôlé avant validation sur la plateforme." },
    { icon: FileText, title: "Devis transparents", text: "Prix détaillés, pas de frais cachés, comparaison immédiate." },
    { icon: Calendar, title: "Rendez-vous en ligne", text: "Réservez un créneau en 30 secondes, 7j/7." },
    { icon: Timer, title: "Gain de temps", text: "Fini les appels multiples : tout se passe sur AutoCare." },
    { icon: Percent, title: "Prix négociés", text: "Des tarifs préférentiels grâce à notre réseau de partenaires." },
  ];
  return (
    <div>
      {/* HERO */}
      <div style={{ background: `linear-gradient(180deg, ${C.navy950} 0%, ${C.navy900} 60%, ${C.navy900} 100%)`, position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, opacity: 0.35 }} width="100%" height="100%">
          <defs>
            <pattern id="hero-grid" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M 42 0 L 0 0 0 42" fill="none" stroke={C.blue500} strokeWidth="0.5" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
        <div style={{
          position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.blue500}33, transparent 70%)`, filter: "blur(20px)",
        }} />
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 24px 96px", position: "relative" }}>
          <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto" }}>
            <div style={{ display: "inline-flex" }}><Badge tone="blue">+1 200 garages partenaires en France</Badge></div>
            <h1 style={{
              fontFamily: displayFont, fontWeight: 700, fontSize: "clamp(34px, 5vw, 58px)", color: "#fff",
              lineHeight: 1.08, marginTop: 20, letterSpacing: -1,
            }}>
              Trouvez le bon garage,<br />sans perdre de temps.
            </h1>
            <p style={{ fontFamily: bodyFont, fontSize: 17, color: C.grey400, marginTop: 18, lineHeight: 1.6 }}>
              Décrivez votre problème, comparez les devis de garages vérifiés près de chez vous et
              prenez rendez-vous en ligne — comme pour une consultation médicale.
            </p>
          </div>

          {/* Search console */}
          <div style={{
            marginTop: 44, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20, padding: 10, maxWidth: 920, margin: "44px auto 0", backdropFilter: "blur(10px)",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr auto", gap: 8 }} className="autocare-search-grid">
              {[
                { icon: Wrench, ph: "Quel problème avez-vous avec votre voiture ?" },
                { icon: MapPin, ph: "Votre ville ou code postal" },
                { icon: Car, ph: "Votre marque de véhicule" },
              ].map((f, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <f.icon size={17} color={C.cyan400} />
                  <input placeholder={f.ph} style={{
                    background: "transparent", border: "none", outline: "none", color: "#fff",
                    fontFamily: bodyFont, fontSize: 13.5, width: "100%",
                  }} />
                </div>
              ))}
              <Button variant="primary" size="lg" onClick={() => setView("results")} style={{ whiteSpace: "nowrap" }} icon={Search}>
                Trouver un garage
              </Button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
            {["Vidange", "Pneus", "Freins", "Diagnostic moteur", "Carrosserie"].map((t) => (
              <button key={t} onClick={() => setView("results")} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: C.grey400,
                borderRadius: 999, padding: "6px 14px", fontSize: 12.5, fontFamily: bodyFont, cursor: "pointer",
              }}>{t}</button>
            ))}
          </div>

          {/* trust stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 56, marginTop: 64, flexWrap: "wrap" }}>
            {[
              { v: 92, label: "Note moyenne", suffix: "%" },
              { v: 48, label: "Délai devis (min)", suffix: "" },
              { v: 15, label: "Économie moyenne", suffix: "%" },
            ].map((s, i) => (
              <GaugeRing key={i} value={s.v} size={96} dark color={i === 1 ? C.amber500 : C.cyan400} label={s.suffix ? `${s.v}${s.suffix}` : s.v} sub={s.label} />
            ))}
          </div>
        </div>
      </div>

      {/* COMMENT CA MARCHE */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 24px" }}>
        <SectionLabel>Le parcours</SectionLabel>
        <h2 style={{ fontFamily: displayFont, fontSize: 34, fontWeight: 700, color: C.navy900, letterSpacing: -0.5, maxWidth: 520 }}>Comment ça marche ?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 44 }} className="autocare-grid-3">
          {steps.map((s, i) => (
            <div key={i} style={{ position: "relative", padding: "28px 24px", borderRadius: 18, border: `1px solid ${C.grey200}` }}>
              <div style={{ fontFamily: monoFont, fontSize: 13, color: C.grey400, marginBottom: 18 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: C.navy900, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <s.icon size={22} color={C.cyan400} />
              </div>
              <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 18, color: C.navy900, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, lineHeight: 1.6 }}>{s.text}</div>
              {i < 2 && <ArrowRight size={18} color={C.grey200} style={{ position: "absolute", right: -32, top: "50%" }} className="autocare-step-arrow" />}
            </div>
          ))}
        </div>
      </div>

      {/* AVANTAGES */}
      <div style={{ background: C.grey50, padding: "96px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
          <SectionLabel>Pourquoi AutoCare</SectionLabel>
          <h2 style={{ fontFamily: displayFont, fontSize: 34, fontWeight: 700, color: C.navy900, letterSpacing: -0.5, maxWidth: 560 }}>Les avantages d'une plateforme pensée pour vous</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginTop: 44 }} className="autocare-grid-5">
            {advantages.map((a, i) => (
              <Card key={i} hover style={{ padding: 22 }}>
                <a.icon size={22} color={C.blue500} />
                <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: C.navy900, marginTop: 14 }}>{a.title}</div>
                <div style={{ fontFamily: bodyFont, fontSize: 13, color: C.grey500, marginTop: 6, lineHeight: 1.5 }}>{a.text}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* TEMOIGNAGES + AVIS GOOGLE */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 24px" }}>
        <SectionLabel>Ils nous font confiance</SectionLabel>
        <h2 style={{ fontFamily: displayFont, fontSize: 34, fontWeight: 700, color: C.navy900, letterSpacing: -0.5, marginBottom: 44 }}>Témoignages clients</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="autocare-grid-3">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} style={{ padding: 24 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={15} fill={s < t.rating ? C.amber500 : "none"} color={C.amber500} />)}
              </div>
              <p style={{ fontFamily: bodyFont, fontSize: 14.5, color: C.navy900, lineHeight: 1.6, marginTop: 14 }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.grey100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: displayFont, fontWeight: 700, color: C.blue500, fontSize: 13 }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 13.5, color: C.navy900 }}>{t.name}</div>
                  <div style={{ fontFamily: bodyFont, fontSize: 12, color: C.grey500 }}>{t.city}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderRadius: 16, background: C.navy900, flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 700, color: "#fff" }}>4.7</div>
            <div>
              <div style={{ display: "flex", gap: 2 }}>{Array.from({ length: 5 }).map((_, s) => <Star key={s} size={14} fill={C.amber500} color={C.amber500} />)}</div>
              <div style={{ fontFamily: bodyFont, fontSize: 12, color: C.grey400, marginTop: 2 }}>Basé sur 3 482 avis Google</div>
            </div>
          </div>
          <Badge tone="green"><BadgeCheck size={13} /> Avis vérifiés Google</Badge>
        </div>
      </div>

      {/* CARTE */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
        <SectionLabel>Réseau national</SectionLabel>
        <h2 style={{ fontFamily: displayFont, fontSize: 34, fontWeight: 700, color: C.navy900, letterSpacing: -0.5, marginBottom: 28 }}>Nos garages partenaires près de chez vous</h2>
        <div style={{
          borderRadius: 20, overflow: "hidden", border: `1px solid ${C.grey200}`, position: "relative", height: 380,
          background: `linear-gradient(135deg, ${C.grey100}, ${C.grey50})`,
        }}>
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.6 }}>
            <defs>
              <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke={C.grey400} strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>
          {GARAGES.map((g, i) => (
            <div key={g.id} style={{
              position: "absolute", left: `${12 + (i * 14) % 80}%`, top: `${18 + ((i * 23) % 60)}%`,
              display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50% 50% 50% 0", background: C.blue500, transform: "rotate(-45deg)",
                display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(47,111,237,0.4)",
              }}>
                <Wrench size={15} color="#fff" style={{ transform: "rotate(45deg)" }} />
              </div>
            </div>
          ))}
          <div style={{ position: "absolute", bottom: 16, left: 16, background: "#fff", borderRadius: 12, padding: "10px 14px", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
            <MapPinned size={16} color={C.blue500} />
            <span style={{ fontFamily: bodyFont, fontSize: 13, color: C.navy900, fontWeight: 500 }}>{GARAGES.length} garages visibles autour de Lille</span>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy900}, ${C.navy950})`, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Prêt à faire réparer votre véhicule sereinement ?</h2>
        <p style={{ fontFamily: bodyFont, color: C.grey400, marginBottom: 26 }}>Recevez vos premiers devis en moins de 30 minutes.</p>
        <Button variant="primary" size="lg" onClick={() => setView("request")} icon={Search}>Trouver un garage</Button>
      </div>

      {/* CTA PRO */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{
          borderRadius: 20, border: `1px solid ${C.grey200}`, padding: "40px 36px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 24, flexWrap: "wrap", background: C.grey50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: C.navy900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Building2 size={24} color={C.cyan400} />
            </div>
            <div>
              <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 19, color: C.navy900 }}>Vous êtes un garage automobile ?</div>
              <div style={{ fontFamily: bodyFont, fontSize: 13.5, color: C.grey500, marginTop: 4 }}>Inscrivez votre établissement gratuitement et recevez des demandes clients qualifiées près de chez vous.</div>
            </div>
          </div>
          <Button variant="dark" size="md" icon={ArrowRight} onClick={() => setView("pro-signup")}>Inscrire mon garage</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* REQUEST FLOW (4 steps)                                                  */
/* ---------------------------------------------------------------------- */
function RequestFlow({ setView, requestData, setRequestData }) {
  const [step, setStep] = useState(1);
  const total = 4;

  const update = (patch) => setRequestData((d) => ({ ...d, ...patch }));

  const StepDots = () => (
    <div style={{ display: "flex", gap: 8, marginBottom: 30 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i + 1 <= step ? C.blue500 : C.grey200, transition: "background 0.3s" }} />
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: "80vh", background: C.grey50, padding: "48px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: monoFont, fontSize: 12.5, color: C.blue500, fontWeight: 600 }}>ÉTAPE {step} / {total}</span>
          <Badge tone="grey">Formulaire intelligent</Badge>
        </div>
        <StepDots />

        <Card style={{ padding: 36 }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: C.navy900, marginBottom: 6 }}>Quel est le problème ?</h2>
              <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, marginBottom: 24 }}>Sélectionnez la catégorie qui correspond le mieux.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }} className="autocare-grid-2">
                {PROBLEMS.map((p) => (
                  <button key={p.id} onClick={() => update({ problem: p.id })} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "16px 16px", borderRadius: 12, cursor: "pointer",
                    border: `1.5px solid ${requestData.problem === p.id ? C.blue500 : C.grey200}`,
                    background: requestData.problem === p.id ? "rgba(47,111,237,0.06)" : "#fff", textAlign: "left",
                  }}>
                    <p.icon size={19} color={requestData.problem === p.id ? C.blue500 : C.grey500} />
                    <span style={{ fontFamily: bodyFont, fontSize: 14, fontWeight: 500, color: C.navy900 }}>{p.label}</span>
                    {requestData.problem === p.id && <Check size={16} color={C.blue500} style={{ marginLeft: "auto" }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: C.navy900, marginBottom: 6 }}>Votre véhicule</h2>
              <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, marginBottom: 24 }}>Ces informations aident le garage à préparer votre intervention.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="autocare-grid-2">
                {[
                  { k: "marque", ph: "Marque (ex: Peugeot)" },
                  { k: "modele", ph: "Modèle (ex: 308)" },
                  { k: "annee", ph: "Année de mise en circulation" },
                  { k: "km", ph: "Kilométrage" },
                  { k: "motorisation", ph: "Motorisation (essence, diesel, hybride...)" },
                  { k: "immat", ph: "Immatriculation" },
                ].map((f) => (
                  <input key={f.k} placeholder={f.ph} value={requestData[f.k] || ""} onChange={(e) => update({ [f.k]: e.target.value })} style={{
                    border: `1.5px solid ${C.grey200}`, borderRadius: 10, padding: "12px 14px", fontFamily: bodyFont, fontSize: 13.5, outline: "none",
                  }} />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: C.navy900, marginBottom: 6 }}>Photo ou vidéo du problème</h2>
              <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, marginBottom: 24 }}>Facultatif, mais cela permet aux garages d'établir un devis plus précis.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="autocare-grid-2">
                {[{ icon: Camera, label: "Ajouter une photo" }, { icon: Video, label: "Ajouter une vidéo" }].map((u, i) => (
                  <div key={i} onClick={() => update({ [i === 0 ? "photo" : "video"]: true })} style={{
                    border: `2px dashed ${requestData[i === 0 ? "photo" : "video"] ? C.blue500 : C.grey200}`, borderRadius: 14,
                    padding: "36px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer",
                    background: requestData[i === 0 ? "photo" : "video"] ? "rgba(47,111,237,0.05)" : "transparent",
                  }}>
                    {requestData[i === 0 ? "photo" : "video"] ? <CheckCircle2 size={26} color={C.blue500} /> : <u.icon size={26} color={C.grey400} />}
                    <span style={{ fontFamily: bodyFont, fontSize: 13, color: C.grey500, fontWeight: 500 }}>
                      {requestData[i === 0 ? "photo" : "video"] ? "Fichier ajouté" : u.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: C.navy900, marginBottom: 6 }}>Dernières précisions</h2>
              <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, marginBottom: 24 }}>Cela nous aide à prioriser votre demande auprès des garages.</p>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 600, color: C.navy900, marginBottom: 10 }}>Niveau d'urgence</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Faible", "Moyenne", "Urgente"].map((u) => (
                    <button key={u} onClick={() => update({ urgence: u })} style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer", fontFamily: bodyFont, fontSize: 13, fontWeight: 600,
                      border: `1.5px solid ${requestData.urgence === u ? (u === "Urgente" ? C.amber500 : C.blue500) : C.grey200}`,
                      background: requestData.urgence === u ? (u === "Urgente" ? "rgba(245,165,36,0.1)" : "rgba(47,111,237,0.06)") : "#fff",
                      color: requestData.urgence === u ? (u === "Urgente" ? "#B4770D" : C.blue500) : C.grey500,
                    }}>{u}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 600, color: C.navy900, marginBottom: 10 }}>Budget estimé</div>
                <input placeholder="Ex: 150 - 300 €" value={requestData.budget || ""} onChange={(e) => update({ budget: e.target.value })} style={{
                  width: "100%", border: `1.5px solid ${C.grey200}`, borderRadius: 10, padding: "12px 14px", fontFamily: bodyFont, fontSize: 13.5, outline: "none", boxSizing: "border-box",
                }} />
              </div>

              <div>
                <div style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 600, color: C.navy900, marginBottom: 10 }}>Disponibilités</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {["Cette semaine", "Semaine prochaine", "Flexible"].map((d) => (
                    <button key={d} onClick={() => update({ dispo: d })} style={{
                      padding: "8px 16px", borderRadius: 999, cursor: "pointer", fontFamily: bodyFont, fontSize: 13, fontWeight: 500,
                      border: `1.5px solid ${requestData.dispo === d ? C.blue500 : C.grey200}`,
                      background: requestData.dispo === d ? "rgba(47,111,237,0.06)" : "#fff",
                      color: requestData.dispo === d ? C.blue500 : C.grey500,
                    }}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
            <Button variant="outline" icon={ChevronLeft} onClick={() => (step === 1 ? setView("home") : setStep(step - 1))}>
              {step === 1 ? "Annuler" : "Retour"}
            </Button>
            {step < total ? (
              <Button variant="primary" onClick={() => setStep(step + 1)}>Continuer <ChevronRight size={16} /></Button>
            ) : (
              <Button variant="primary" onClick={() => setView("results")} icon={Search}>Voir les garages correspondants</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* GARAGE SIGNUP (inscription professionnelle)                             */
/* ---------------------------------------------------------------------- */
function GarageSignup({ setView, onSubmit }) {
  const [step, setStep] = useState(1);
  const total = 3;
  const [data, setData] = useState({ services: [] });
  const update = (patch) => setData((d) => ({ ...d, ...patch }));
  const toggleService = (id) => setData((d) => ({
    ...d, services: d.services.includes(id) ? d.services.filter((s) => s !== id) : [...d.services, id],
  }));

  const submit = () => {
    onSubmit({ ...data, id: Date.now(), status: "pending", submittedAt: "aujourd'hui" });
    setStep(total + 1);
  };

  return (
    <div style={{ minHeight: "80vh", background: C.grey50, padding: "48px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {step <= total ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: monoFont, fontSize: 12.5, color: C.blue500, fontWeight: 600 }}>INSCRIPTION GARAGE · ÉTAPE {step} / {total}</span>
              <Badge tone="blue"><Building2 size={12} /> Espace professionnel</Badge>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 30 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i + 1 <= step ? C.blue500 : C.grey200 }} />
              ))}
            </div>

            <Card style={{ padding: 36 }}>
              {step === 1 && (
                <div>
                  <h2 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: C.navy900, marginBottom: 6 }}>Créez votre compte garage</h2>
                  <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, marginBottom: 24 }}>Renseignez les informations de votre établissement. Elles seront vérifiées par notre équipe.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="autocare-grid-2">
                    {[
                      { k: "nom", ph: "Nom du garage" },
                      { k: "siret", ph: "Numéro SIRET" },
                      { k: "adresse", ph: "Adresse" },
                      { k: "ville", ph: "Ville / code postal" },
                      { k: "tel", ph: "Téléphone" },
                      { k: "email", ph: "Email professionnel" },
                    ].map((f) => (
                      <input key={f.k} placeholder={f.ph} value={data[f.k] || ""} onChange={(e) => update({ [f.k]: e.target.value })} style={{
                        border: `1.5px solid ${C.grey200}`, borderRadius: 10, padding: "12px 14px", fontFamily: bodyFont, fontSize: 13.5, outline: "none",
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: C.navy900, marginBottom: 6 }}>Vos services et horaires</h2>
                  <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, marginBottom: 20 }}>Sélectionnez les prestations que vous proposez.</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
                    {PROBLEMS.filter((p) => p.id !== "autre").map((p) => {
                      const active = data.services.includes(p.id);
                      return (
                        <button key={p.id} onClick={() => toggleService(p.id)} style={{
                          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, cursor: "pointer",
                          border: `1.5px solid ${active ? C.blue500 : C.grey200}`, background: active ? "rgba(47,111,237,0.06)" : "#fff",
                          color: active ? C.blue500 : C.grey500, fontFamily: bodyFont, fontSize: 13, fontWeight: 500,
                        }}>
                          <p.icon size={14} /> {p.label} {active && <Check size={13} />}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ fontFamily: bodyFont, fontSize: 13, fontWeight: 600, color: C.navy900, marginBottom: 10 }}>Horaires d'ouverture</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="autocare-grid-2">
                    <input placeholder="Lundi - Vendredi (ex: 8h - 18h30)" value={data.horaires1 || ""} onChange={(e) => update({ horaires1: e.target.value })} style={{ border: `1.5px solid ${C.grey200}`, borderRadius: 10, padding: "12px 14px", fontFamily: bodyFont, fontSize: 13.5, outline: "none" }} />
                    <input placeholder="Samedi (ex: 9h - 13h ou Fermé)" value={data.horaires2 || ""} onChange={(e) => update({ horaires2: e.target.value })} style={{ border: `1.5px solid ${C.grey200}`, borderRadius: 10, padding: "12px 14px", fontFamily: bodyFont, fontSize: 13.5, outline: "none" }} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: C.navy900, marginBottom: 6 }}>Justificatifs professionnels</h2>
                  <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, marginBottom: 24 }}>Ces documents permettent à notre équipe de vérifier votre établissement avant activation du compte.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="autocare-grid-2">
                    {[
                      { k: "kbis", label: "Extrait Kbis" },
                      { k: "assurance", label: "Attestation d'assurance pro" },
                    ].map((doc) => (
                      <div key={doc.k} onClick={() => update({ [doc.k]: true })} style={{
                        border: `2px dashed ${data[doc.k] ? C.blue500 : C.grey200}`, borderRadius: 14, padding: "30px 16px",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer",
                        background: data[doc.k] ? "rgba(47,111,237,0.05)" : "transparent",
                      }}>
                        {data[doc.k] ? <CheckCircle2 size={24} color={C.blue500} /> : <Upload size={24} color={C.grey400} />}
                        <span style={{ fontFamily: bodyFont, fontSize: 13, color: C.grey500, fontWeight: 500, textAlign: "center" }}>
                          {data[doc.k] ? "Document ajouté" : doc.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 22, padding: 14, borderRadius: 12, background: C.grey50, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <ShieldCheck size={17} color={C.blue500} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500, lineHeight: 1.6 }}>
                      Votre compte sera examiné sous 24 à 48h par notre équipe. Vous serez notifié par email dès qu'il sera validé et visible des clients.
                    </span>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
                <Button variant="outline" icon={ChevronLeft} onClick={() => (step === 1 ? setView("home") : setStep(step - 1))}>
                  {step === 1 ? "Annuler" : "Retour"}
                </Button>
                {step < total ? (
                  <Button variant="primary" onClick={() => setStep(step + 1)}>Continuer <ChevronRight size={16} /></Button>
                ) : (
                  <Button variant="primary" onClick={submit} icon={ShieldCheck}>Envoyer pour validation</Button>
                )}
              </div>
            </Card>
          </>
        ) : (
          <Card style={{ padding: 48, textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(47,111,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <Clock size={26} color={C.blue500} />
            </div>
            <h2 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 10 }}>Compte créé — en attente de validation</h2>
            <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, maxWidth: 440, margin: "0 auto 26px", lineHeight: 1.6 }}>
              Merci {data.nom ? `pour "${data.nom}"` : ""} ! Votre dossier a été transmis à notre équipe de vérification.
              Vous recevrez un email de confirmation dès que votre profil sera visible des clients.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Button variant="outline" onClick={() => setView("home")}>Retour à l'accueil</Button>
              <Button variant="primary" onClick={() => setView("pro")} icon={Building2}>Voir mon espace garage</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* RESULTS                                                                  */
/* ---------------------------------------------------------------------- */
function Results({ setView, setSelectedGarage }) {
  const [sort, setSort] = useState("distance");
  const [maxPrice, setMaxPrice] = useState(100);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    let list = GARAGES.filter((g) => g.price <= maxPrice && g.rating >= minRating);
    if (sort === "distance") list = [...list].sort((a, b) => a.distance - b.distance);
    if (sort === "price") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [sort, maxPrice, minRating]);

  return (
    <div style={{ background: C.grey50, minHeight: "80vh" }}>
      <div style={{ background: C.navy900, padding: "28px 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ fontFamily: monoFont, fontSize: 12, color: C.cyan400, marginBottom: 6 }}>RÉSULTATS POUR "FREINS" · LILLE</div>
          <h1 style={{ fontFamily: displayFont, fontSize: 26, fontWeight: 700, color: "#fff" }}>{GARAGES.length} garages disponibles près de vous</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 28 }} className="autocare-results-grid">
        {/* Filters */}
        <div>
          <Card style={{ padding: 20, position: "sticky", top: 88 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <SlidersHorizontal size={16} color={C.navy900} />
              <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: C.navy900 }}>Filtres</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: bodyFont, fontSize: 12.5, fontWeight: 600, color: C.grey500, marginBottom: 8 }}>Trier par</div>
              {[["distance", "Distance"], ["price", "Prix"], ["rating", "Note"]].map(([k, l]) => (
                <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer" }}>
                  <input type="radio" checked={sort === k} onChange={() => setSort(k)} />
                  <span style={{ fontFamily: bodyFont, fontSize: 13.5, color: C.navy900 }}>{l}</span>
                </label>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: bodyFont, fontSize: 12.5, fontWeight: 600, color: C.grey500, marginBottom: 8 }}>Prix max : {maxPrice}€</div>
              <input type="range" min="40" max="100" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} style={{ width: "100%", accentColor: C.blue500 }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: bodyFont, fontSize: 12.5, fontWeight: 600, color: C.grey500, marginBottom: 8 }}>Note minimum</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[0, 3, 4, 4.5].map((r) => (
                  <button key={r} onClick={() => setMinRating(r)} style={{
                    padding: "6px 10px", borderRadius: 8, fontSize: 12, fontFamily: bodyFont, cursor: "pointer",
                    border: `1.5px solid ${minRating === r ? C.blue500 : C.grey200}`,
                    background: minRating === r ? "rgba(47,111,237,0.06)" : "#fff", color: minRating === r ? C.blue500 : C.grey500,
                  }}>{r === 0 ? "Tous" : `${r}+`}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: bodyFont, fontSize: 12.5, fontWeight: 600, color: C.grey500, marginBottom: 8 }}>Spécialité</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Freins", "Pneus", "Vidange", "Carrosserie"].map((s) => (
                  <span key={s} style={{ padding: "5px 10px", borderRadius: 999, background: C.grey100, fontSize: 11.5, fontFamily: bodyFont, color: C.grey500, cursor: "pointer" }}>{s}</span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((g) => (
            <Card key={g.id} hover style={{ padding: 20, display: "grid", gridTemplateColumns: "140px 1fr auto", gap: 20, alignItems: "center" }} >
              <GaragePhoto hue={g.hue} tall />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 17, color: C.navy900 }}>{g.name}</span>
                  {g.verified && <Badge tone="green"><ShieldCheck size={12} /> Vérifié</Badge>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={14} fill={C.amber500} color={C.amber500} />
                    <span style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 13.5, color: C.navy900 }}>{g.rating}</span>
                    <span style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500 }}>({g.reviews} avis)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} color={C.grey400} /><span style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500 }}>{g.distance} km · {g.city}</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} color={C.grey400} /><span style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500 }}>Réponse {g.resp}</span></div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  {g.specialties.map((s) => <Badge key={s} tone="grey">{s}</Badge>)}
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500, marginTop: 10 }}>
                  Prix moyen : <span style={{ fontFamily: monoFont, fontWeight: 600, color: C.navy900 }}>{g.price}€</span> · Prochain créneau : <span style={{ fontWeight: 600, color: C.navy900 }}>{g.slots[0]}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 160 }}>
                <Button variant="outline" size="sm" onClick={() => { setSelectedGarage(g.id); setView("garage"); }}>Demander un devis</Button>
                <Button variant="primary" size="sm" onClick={() => { setSelectedGarage(g.id); setView("garage"); }}>Prendre rendez-vous</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* GARAGE DETAIL                                                            */
/* ---------------------------------------------------------------------- */
function GarageDetail({ garageId, setView }) {
  const g = GARAGES.find((x) => x.id === garageId) || GARAGES[0];
  const [booked, setBooked] = useState(null);
  return (
    <div style={{ background: C.grey50, minHeight: "80vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <button onClick={() => setView("results")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: C.grey500, fontFamily: bodyFont, fontSize: 13, marginBottom: 18 }}>
          <ChevronLeft size={16} /> Retour aux résultats
        </button>
        <Card style={{ padding: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontFamily: displayFont, fontSize: 26, fontWeight: 700, color: C.navy900 }}>{g.name}</h1>
                {g.verified && <Badge tone="green"><ShieldCheck size={12} /> Vérifié</Badge>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={15} fill={C.amber500} color={C.amber500} /><b style={{ fontFamily: bodyFont, fontSize: 14 }}>{g.rating}</b><span style={{ fontFamily: bodyFont, fontSize: 13, color: C.grey500 }}>({g.reviews} avis)</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.grey500, fontFamily: bodyFont, fontSize: 13 }}><MapPin size={14} /> {g.distance} km · {g.city}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.grey500, fontFamily: bodyFont, fontSize: 13 }}><Phone size={14} /> 03 20 XX XX XX</div>
              </div>
            </div>
            <GaugeRing value={g.rating * 20} size={72} color={C.blue500} label={g.rating} sub="/ 5" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24 }} className="autocare-grid-3">
            {[1, 2, 3].map((i) => <GaragePhoto key={i} hue={g.hue} icon={[Wrench, Car, Disc][i - 1]} />)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, marginTop: 32 }} className="autocare-results-grid">
            <div>
              <h3 style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 16, color: C.navy900, marginBottom: 10 }}>Services proposés</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {g.specialties.map((s) => <Badge key={s} tone="blue">{s}</Badge>)}
              </div>
              <h3 style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 16, color: C.navy900, marginBottom: 10 }}>À propos</h3>
              <p style={{ fontFamily: bodyFont, fontSize: 13.5, color: C.grey500, lineHeight: 1.7 }}>
                Garage familial reconnu depuis plus de 15 ans, spécialisé dans l'entretien courant et les réparations mécaniques.
                Équipe certifiée, devis gratuit et pièces d'origine ou équivalentes garanties.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, padding: 14, borderRadius: 12, background: C.grey50 }}>
                <DollarSign size={18} color={C.blue500} />
                <span style={{ fontFamily: bodyFont, fontSize: 13.5, color: C.navy900 }}>Prix moyen constaté : <b style={{ fontFamily: monoFont }}>{g.price}€</b> / intervention</span>
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 16, color: C.navy900, marginBottom: 10 }}>Créneaux disponibles</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {g.slots.map((s) => (
                  <button key={s} onClick={() => setBooked(s)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                    border: `1.5px solid ${booked === s ? C.blue500 : C.grey200}`, background: booked === s ? "rgba(47,111,237,0.06)" : "#fff",
                  }}>
                    <span style={{ fontFamily: bodyFont, fontSize: 13.5, color: C.navy900, fontWeight: 500 }}>{s}</span>
                    {booked === s ? <Check size={16} color={C.blue500} /> : <ChevronRight size={15} color={C.grey400} />}
                  </button>
                ))}
              </div>
              <Button variant="primary" full style={{ marginTop: 16 }} onClick={() => setView("client")} icon={Calendar}>
                {booked ? `Confirmer le ${booked}` : "Choisir un créneau"}
              </Button>
              <Button variant="outline" full style={{ marginTop: 10 }} icon={FileText}>Demander un devis</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* CLIENT DASHBOARD                                                         */
/* ---------------------------------------------------------------------- */
function ClientDashboard() {
  const [tab, setTab] = useState("apercu");
  const vehicles = [{ marque: "Peugeot 308", annee: 2019, km: "68 400 km", immat: "AB-123-CD", moteur: "Diesel 1.5 BlueHDi" }];
  const requests = [
    { id: 1, problem: "Freins", garage: "Garage du Vieux-Lille", status: "En cours", progress: 65 },
    { id: 2, problem: "Vidange", garage: "AutoTech Villeneuve", status: "Devis reçu", progress: 25 },
  ];
  const quotes = [
    { garage: "Garage du Vieux-Lille", amount: 210, items: "Plaquettes + disques avant" },
    { garage: "Central Garage Roubaix", amount: 245, items: "Plaquettes + disques avant" },
    { garage: "Speed Motors", amount: 175, items: "Plaquettes + disques avant" },
  ];

  const tabs = [
    { id: "apercu", label: "Aperçu", icon: BarChart3 },
    { id: "vehicules", label: "Mes véhicules", icon: Car },
    { id: "demandes", label: "Mes demandes", icon: ClipboardList },
    { id: "devis", label: "Devis reçus", icon: FileText },
    { id: "rdv", label: "Rendez-vous", icon: Calendar },
  ];

  return (
    <div style={{ background: C.grey50, minHeight: "80vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 28 }} className="autocare-results-grid">
        {/* sidebar */}
        <div>
          <Card style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.navy900, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: displayFont, fontWeight: 700 }}>ML</div>
              <div>
                <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 14, color: C.navy900 }}>Marie Lefèvre</div>
                <div style={{ fontFamily: bodyFont, fontSize: 12, color: C.grey500 }}>marie.lefevre@mail.fr</div>
              </div>
            </div>
          </Card>
          <Card style={{ padding: 8 }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: tab === t.id ? "rgba(47,111,237,0.08)" : "transparent", color: tab === t.id ? C.blue500 : C.grey500, marginBottom: 2,
                fontFamily: bodyFont, fontSize: 13.5, fontWeight: 500, textAlign: "left",
              }}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
            <div style={{ height: 1, background: C.grey200, margin: "8px 0" }} />
            <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "transparent", color: C.grey500, fontFamily: bodyFont, fontSize: 13.5 }}>
              <Bell size={16} /> Notifications <Badge tone="amber">2</Badge>
            </button>
          </Card>
        </div>

        {/* content */}
        <div>
          {tab === "apercu" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 24, fontWeight: 700, color: C.navy900, marginBottom: 20 }}>Bonjour Marie 👋</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="autocare-grid-3">
                <Card style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                  <GaugeRing value={65} size={64} color={C.blue500} label="65%" />
                  <div><div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 13.5, color: C.navy900 }}>Réparation en cours</div><div style={{ fontFamily: bodyFont, fontSize: 12, color: C.grey500 }}>Freins · Garage du Vieux-Lille</div></div>
                </Card>
                <Card style={{ padding: 20 }}>
                  <FileText size={20} color={C.blue500} />
                  <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 22, color: C.navy900, marginTop: 10 }}>3</div>
                  <div style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500 }}>devis en attente de réponse</div>
                </Card>
                <Card style={{ padding: 20 }}>
                  <Calendar size={20} color={C.blue500} />
                  <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 22, color: C.navy900, marginTop: 10 }}>Ven. 14:00</div>
                  <div style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500 }}>prochain rendez-vous</div>
                </Card>
              </div>

              <h3 style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 16, color: C.navy900, margin: "28px 0 12px" }}>Suivi de réparation</h3>
              <Card style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 14, color: C.navy900 }}>Freins — Garage du Vieux-Lille</span>
                  <Badge tone="blue">En cours</Badge>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                  {["Diagnostic", "Devis validé", "Réparation", "Contrôle qualité", "Prêt"].map((s, i) => (
                    <div key={s} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                      <div style={{
                        width: 12, height: 12, borderRadius: "50%", margin: "0 auto 8px", background: i <= 2 ? C.blue500 : C.grey200, zIndex: 1, position: "relative",
                      }} />
                      {i < 4 && <div style={{ position: "absolute", top: 5, left: "50%", width: "100%", height: 2, background: i < 2 ? C.blue500 : C.grey200 }} />}
                      <span style={{ fontFamily: bodyFont, fontSize: 11, color: i <= 2 ? C.navy900 : C.grey400, fontWeight: i <= 2 ? 600 : 400 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === "vehicules" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900 }}>Mes véhicules</h1>
                <Button variant="primary" size="sm" icon={Plus}>Ajouter une voiture</Button>
              </div>
              {vehicles.map((v, i) => (
                <Card key={i} style={{ padding: 22, display: "grid", gridTemplateColumns: "80px 1fr", gap: 18, marginBottom: 14 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 14, background: C.navy900, display: "flex", alignItems: "center", justifyContent: "center" }}><Car size={30} color={C.cyan400} /></div>
                  <div>
                    <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 16, color: C.navy900 }}>{v.marque}</div>
                    <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                      {[["Année", v.annee], ["Kilométrage", v.km], ["Motorisation", v.moteur], ["Immatriculation", v.immat]].map(([l, val]) => (
                        <div key={l}><div style={{ fontFamily: bodyFont, fontSize: 11, color: C.grey400 }}>{l}</div><div style={{ fontFamily: monoFont, fontSize: 13, color: C.navy900, fontWeight: 600 }}>{val}</div></div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
              <Card style={{ padding: 22, border: `2px dashed ${C.grey200}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", color: C.grey500 }}>
                <Plus size={16} /> <span style={{ fontFamily: bodyFont, fontSize: 13.5 }}>Ajouter marque, modèle, année, kilométrage, motorisation, immatriculation</span>
              </Card>
            </div>
          )}

          {tab === "demandes" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 18 }}>Mes demandes de réparation</h1>
              {requests.map((r) => (
                <Card key={r.id} style={{ padding: 18, marginBottom: 12, display: "flex", alignItems: "center", gap: 18 }}>
                  <GaugeRing value={r.progress} size={56} color={C.blue500} label={`${r.progress}%`} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 14, color: C.navy900 }}>{r.problem} — {r.garage}</div>
                    <Badge tone={r.status === "En cours" ? "blue" : "amber"}>{r.status}</Badge>
                  </div>
                  <ChevronRight size={17} color={C.grey400} />
                </Card>
              ))}
            </div>
          )}

          {tab === "devis" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 18 }}>Comparer les devis reçus</h1>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {quotes.sort((a, b) => a.amount - b.amount).map((q, i) => (
                  <Card key={i} style={{ padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
                    {i === 0 && <Badge tone="green"><Award size={12} /> Meilleur prix</Badge>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 14, color: C.navy900 }}>{q.garage}</div>
                      <div style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500 }}>{q.items}</div>
                    </div>
                    <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 20, color: C.navy900 }}>{q.amount}€</div>
                    <Button variant="primary" size="sm">Accepter</Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tab === "rdv" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 18 }}>Mes rendez-vous</h1>
              <Card style={{ padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: C.navy900, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 16 }}>14</span>
                  <span style={{ fontFamily: bodyFont, fontSize: 9 }}>VEN</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 14, color: C.navy900 }}>Contrôle freins — 14:00</div>
                  <div style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500 }}>Garage du Vieux-Lille</div>
                </div>
                <Badge tone="blue">Confirmé</Badge>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* PRO DASHBOARD                                                            */
/* ---------------------------------------------------------------------- */
function ProDashboard({ account, setView }) {
  const [tab, setTab] = useState("stats");

  if (!account) {
    return (
      <div style={{ background: C.grey50, minHeight: "80vh", padding: "80px 24px" }}>
        <Card style={{ maxWidth: 620, margin: "0 auto", padding: 44, textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: C.navy900, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Building2 size={26} color={C.cyan400} />
          </div>
          <h2 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 10 }}>Vous êtes un garage ?</h2>
          <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, maxWidth: 420, margin: "0 auto 26px", lineHeight: 1.6 }}>
            Créez gratuitement votre compte professionnel pour recevoir des demandes clients, envoyer des devis
            et gérer votre agende de rendez-vous. Validation par notre équipe sous 24-48h.
          </p>
          <Button variant="primary" size="lg" icon={ArrowRight} onClick={() => setView("pro-signup")}>Inscrire mon garage</Button>
        </Card>
      </div>
    );
  }

  if (account.status === "pending") {
    return (
      <div style={{ background: C.grey50, minHeight: "80vh", padding: "80px 24px" }}>
        <Card style={{ maxWidth: 620, margin: "0 auto", padding: 44, textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(245,165,36,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Clock size={26} color="#B4770D" />
          </div>
          <h2 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 10 }}>{account.nom || "Votre garage"} — en attente de validation</h2>
          <Badge tone="amber">Dossier soumis {account.submittedAt}</Badge>
          <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.grey500, maxWidth: 420, margin: "20px auto 0", lineHeight: 1.6 }}>
            Notre équipe vérifie actuellement votre Kbis et votre attestation d'assurance. Votre tableau de bord
            sera automatiquement activé dès validation par un administrateur.
          </p>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "stats", label: "Statistiques", icon: BarChart3 },
    { id: "profil", label: "Mon profil", icon: Building2 },
    { id: "demandes", label: "Demandes reçues", icon: ClipboardList },
    { id: "devis", label: "Devis envoyés", icon: FileText },
    { id: "agenda", label: "Calendrier", icon: Calendar },
  ];
  const incoming = [
    { client: "T. Marchand", problem: "Diagnostic moteur", vehicle: "Renault Clio 2017", urgent: true },
    { client: "L. Dubois", problem: "Vidange", vehicle: "Citroën C3 2020", urgent: false },
    { client: "S. Petit", problem: "Pneus x4", vehicle: "VW Golf 2018", urgent: false },
  ];
  return (
    <div style={{ background: C.grey50, minHeight: "80vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 28 }} className="autocare-results-grid">
        <div>
          <Card style={{ padding: 20, marginBottom: 16, background: C.navy900, border: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${C.blue500}, ${C.cyan400})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={20} color="#fff" /></div>
              <div>
                <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 13.5, color: "#fff" }}>{account.nom || "Garage du Vieux-Lille"}</div>
                <Badge tone="green"><ShieldCheck size={11} /> Partenaire vérifié</Badge>
              </div>
            </div>
          </Card>
          <Card style={{ padding: 8 }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: tab === t.id ? "rgba(47,111,237,0.08)" : "transparent", color: tab === t.id ? C.blue500 : C.grey500, marginBottom: 2,
                fontFamily: bodyFont, fontSize: 13.5, fontWeight: 500, textAlign: "left",
              }}><t.icon size={16} /> {t.label}</button>
            ))}
          </Card>
        </div>

        <div>
          {tab === "stats" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 18 }}>Tableau de bord</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="autocare-grid-4">
                {[
                  { label: "Demandes reçues", value: "47", icon: ClipboardList, sub: "ce mois-ci" },
                  { label: "Chiffre d'affaires", value: "12 480 €", icon: DollarSign, sub: "ce mois-ci" },
                  { label: "Note moyenne", value: "4.9 / 5", icon: Star, sub: "301 avis" },
                  { label: "RDV à venir", value: "9", icon: Calendar, sub: "7 prochains jours" },
                ].map((s, i) => (
                  <Card key={i} style={{ padding: 18 }}>
                    <s.icon size={18} color={C.blue500} />
                    <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 20, color: C.navy900, marginTop: 10 }}>{s.value}</div>
                    <div style={{ fontFamily: bodyFont, fontSize: 12, color: C.grey500 }}>{s.label} · {s.sub}</div>
                  </Card>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }} className="autocare-grid-2">
                <Card style={{ padding: 20 }}>
                  <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: C.navy900, marginBottom: 14 }}>Taux de conversion devis</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <GaugeRing value={72} size={90} color={C.blue500} label="72%" />
                    <div style={{ fontFamily: bodyFont, fontSize: 13, color: C.grey500, lineHeight: 1.6 }}>72% des devis envoyés sont acceptés par les clients, contre 58% en moyenne sur la plateforme.</div>
                  </div>
                </Card>
                <Card style={{ padding: 20 }}>
                  <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: C.navy900, marginBottom: 14 }}>Satisfaction client</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <GaugeRing value={98} size={90} color={"#16A34A"} label="98%" />
                    <div style={{ fontFamily: bodyFont, fontSize: 13, color: C.grey500, lineHeight: 1.6 }}>98% de clients satisfaits recommanderaient votre garage à leur entourage.</div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === "profil" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 18 }}>Mon profil garage</h1>
              <Card style={{ padding: 24, marginBottom: 16 }}>
                <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: C.navy900, marginBottom: 14 }}>Informations générales</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="autocare-grid-2">
                  {["Nom du garage", "Adresse", "Téléphone", "SIRET"].map((f) => (
                    <input key={f} placeholder={f} style={{ border: `1.5px solid ${C.grey200}`, borderRadius: 10, padding: "11px 13px", fontFamily: bodyFont, fontSize: 13.5, outline: "none" }} />
                  ))}
                </div>
              </Card>
              <Card style={{ padding: 24, marginBottom: 16 }}>
                <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: C.navy900, marginBottom: 14 }}>Services proposés</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PROBLEMS.map((p) => <Badge key={p.id} tone={["freins", "vidange", "diagnostic"].includes(p.id) ? "blue" : "grey"}>{p.label}</Badge>)}
                </div>
              </Card>
              <Card style={{ padding: 24 }}>
                <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: C.navy900, marginBottom: 14 }}>Horaires d'ouverture</div>
                {["Lundi - Vendredi", "Samedi", "Dimanche"].map((d, i) => (
                  <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.grey100}` : "none" }}>
                    <span style={{ fontFamily: bodyFont, fontSize: 13.5, color: C.navy900 }}>{d}</span>
                    <span style={{ fontFamily: monoFont, fontSize: 13, color: C.grey500 }}>{d === "Dimanche" ? "Fermé" : d === "Samedi" ? "9h00 - 13h00" : "8h00 - 18h30"}</span>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {tab === "demandes" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 18 }}>Demandes clients</h1>
              {incoming.map((r, i) => (
                <Card key={i} style={{ padding: 18, marginBottom: 12, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.grey100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: displayFont, fontWeight: 700, color: C.navy900 }}>{r.client.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 14, color: C.navy900 }}>{r.client} — {r.problem}</div>
                    <div style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500 }}>{r.vehicle}</div>
                  </div>
                  {r.urgent && <Badge tone="amber"><AlertTriangle size={11} /> Urgent</Badge>}
                  <Button variant="outline" size="sm">Refuser</Button>
                  <Button variant="primary" size="sm">Envoyer un devis</Button>
                </Card>
              ))}
            </div>
          )}

          {tab === "devis" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 18 }}>Devis envoyés</h1>
              {[
                { client: "M. Lefèvre", amount: 210, status: "Accepté" },
                { client: "K. Nguyen", amount: 340, status: "En attente" },
                { client: "R. Faure", amount: 95, status: "Refusé" },
              ].map((d, i) => (
                <Card key={i} style={{ padding: 16, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ flex: 1, fontFamily: bodyFont, fontWeight: 600, fontSize: 13.5, color: C.navy900 }}>{d.client}</div>
                  <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 15, color: C.navy900 }}>{d.amount}€</div>
                  <Badge tone={d.status === "Accepté" ? "green" : d.status === "Refusé" ? "grey" : "amber"}>{d.status}</Badge>
                </Card>
              ))}
            </div>
          )}

          {tab === "agenda" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: C.navy900, marginBottom: 18 }}>Calendrier</h1>
              <Card style={{ padding: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                  {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <div key={i} style={{ textAlign: "center", fontFamily: monoFont, fontSize: 11, color: C.grey400, marginBottom: 6 }}>{d}</div>)}
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} style={{
                      aspectRatio: "1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: bodyFont, fontSize: 12.5,
                      background: [4, 9, 14, 21].includes(i) ? "rgba(47,111,237,0.12)" : C.grey50, color: [4, 9, 14, 21].includes(i) ? C.blue500 : C.grey500, fontWeight: [4, 9, 14, 21].includes(i) ? 700 : 400,
                    }}>{i + 1}</div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* ADMIN                                                                    */
/* ---------------------------------------------------------------------- */
function AdminDashboard({ garageAccount, onValidate, onReject }) {
  const [tab, setTab] = useState("stats");
  const tabs = [
    { id: "stats", label: "Statistiques globales", icon: TrendingUp },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "garages", label: "Validation garages", icon: ShieldCheck },
    { id: "commissions", label: "Commissions", icon: Percent },
    { id: "paiements", label: "Paiements", icon: CreditCard },
  ];
  const mockPending = [
    { name: "Mécanique Express", city: "Tourcoing", date: "12 août" },
    { name: "Garage Boulanger", city: "Wattignies", date: "14 août" },
  ];
  const pendingGarages = garageAccount && garageAccount.status === "pending"
    ? [{ name: garageAccount.nom || "Nouveau garage", city: garageAccount.ville || "Non renseignée", date: "aujourd'hui", isReal: true }, ...mockPending]
    : mockPending;
  return (
    <div style={{ background: C.navy950, minHeight: "80vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "230px 1fr", gap: 28 }} className="autocare-results-grid">
        <div>
          <div style={{ fontFamily: monoFont, fontSize: 11, color: C.grey400, marginBottom: 14, letterSpacing: 1 }}>ADMINISTRATION</div>
          <Card style={{ padding: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: tab === t.id ? "rgba(47,111,237,0.18)" : "transparent", color: tab === t.id ? C.cyan400 : C.grey400, marginBottom: 2,
                fontFamily: bodyFont, fontSize: 13.5, fontWeight: 500, textAlign: "left",
              }}><t.icon size={16} /> {t.label}</button>
            ))}
          </Card>
        </div>

        <div>
          {tab === "stats" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 18 }}>Statistiques globales</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="autocare-grid-4">
                {[
                  { label: "Utilisateurs actifs", value: "18 240" },
                  { label: "Garages partenaires", value: "1 204" },
                  { label: "Demandes ce mois", value: "6 812" },
                  { label: "GMV plateforme", value: "842 K€" },
                ].map((s, i) => (
                  <div key={i} style={{ padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 22, color: "#fff" }}>{s.value}</div>
                    <div style={{ fontFamily: bodyFont, fontSize: 12, color: C.grey400 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 22, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 16 }}>Croissance mensuelle des demandes</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
                  {[40, 55, 48, 62, 70, 66, 82, 90, 78, 95, 88, 100].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${C.cyan400}, ${C.blue500})`, opacity: 0.85 }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "users" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 18 }}>Gestion des utilisateurs</h1>
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                {["Marie Lefèvre", "Thomas Marchand", "Léa Dubois", "Karim Nguyen"].map((n, i) => (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", background: i % 2 ? "rgba(255,255,255,0.03)" : "transparent" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(47,111,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: displayFont, fontSize: 12, color: C.cyan400, fontWeight: 700 }}>{n.charAt(0)}</div>
                    <span style={{ flex: 1, fontFamily: bodyFont, fontSize: 13.5, color: "#fff" }}>{n}</span>
                    <span style={{ fontFamily: monoFont, fontSize: 12, color: C.grey400 }}>Client</span>
                    <Badge tone="green">Actif</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "garages" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 18 }}>Validation des garages partenaires</h1>
              {pendingGarages.length === 0 && (
                <div style={{ padding: 24, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", color: C.grey400, fontFamily: bodyFont, fontSize: 13.5 }}>
                  Aucun dossier en attente de validation.
                </div>
              )}
              {pendingGarages.map((g) => (
                <div key={g.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 10 }}>
                  <Building2 size={20} color={C.cyan400} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 14, color: "#fff" }}>{g.name}</div>
                    <div style={{ fontFamily: bodyFont, fontSize: 12, color: C.grey400 }}>{g.city} · Inscrit le {g.date}{g.isReal ? " · Kbis + assurance fournis" : ""}</div>
                  </div>
                  <Badge tone="amber">En attente</Badge>
                  <Button variant="outline" size="sm" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }} onClick={g.isReal ? onReject : undefined}>Refuser</Button>
                  <Button variant="primary" size="sm" onClick={g.isReal ? onValidate : undefined}>Valider</Button>
                </div>
              ))}
            </div>
          )}

          {tab === "commissions" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 18 }}>Gestion des commissions</h1>
              <div style={{ padding: 22, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontFamily: bodyFont, fontSize: 13.5, color: C.grey400, marginBottom: 10 }}>Taux de commission par transaction</div>
                <div style={{ fontFamily: displayFont, fontSize: 34, fontWeight: 700, color: "#fff" }}>8.5%</div>
                <input type="range" min="0" max="20" defaultValue="8.5" step="0.5" style={{ width: "100%", marginTop: 16, accentColor: C.cyan400 }} />
              </div>
            </div>
          )}

          {tab === "paiements" && (
            <div>
              <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 18 }}>Paiements</h1>
              {[
                { garage: "Garage du Vieux-Lille", amount: "3 240 €", status: "Versé" },
                { garage: "AutoTech Villeneuve", amount: "1 890 €", status: "En traitement" },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 10 }}>
                  <CreditCard size={18} color={C.cyan400} />
                  <span style={{ flex: 1, fontFamily: bodyFont, fontSize: 13.5, color: "#fff" }}>{p.garage}</span>
                  <span style={{ fontFamily: monoFont, fontWeight: 700, color: "#fff" }}>{p.amount}</span>
                  <Badge tone={p.status === "Versé" ? "green" : "amber"}>{p.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* APP ROOT                                                                 */
/* ---------------------------------------------------------------------- */
export default function App() {
  const [view, setView] = useState("home");
  const [selectedGarage, setSelectedGarage] = useState(1);
  const [requestData, setRequestData] = useState({});
  const [garageAccount, setGarageAccount] = useState(null); // null = pas de compte garage créé

  const dark = view === "home" || view === "admin";

  return (
    <div style={{ fontFamily: bodyFont, background: "#fff", minHeight: "100vh" }}>
      <style>{FONTS}{`
        * { box-sizing: border-box; }
        input:focus { border-color: ${C.blue500} !important; }
        ::placeholder { color: ${C.grey400}; }
        @media (max-width: 860px) {
          .autocare-grid-2, .autocare-grid-3, .autocare-grid-4, .autocare-grid-5, .autocare-results-grid, .autocare-search-grid { grid-template-columns: 1fr !important; }
          .autocare-nav-links { display: none !important; }
          .autocare-step-arrow { display: none !important; }
        }
      `}</style>

      <Navbar view={view} setView={setView} dark={dark} />

      {view === "home" && <Home setView={setView} />}
      {view === "request" && <RequestFlow setView={setView} requestData={requestData} setRequestData={setRequestData} />}
      {view === "results" && <Results setView={setView} setSelectedGarage={setSelectedGarage} />}
      {view === "garage" && <GarageDetail garageId={selectedGarage} setView={setView} />}
      {view === "client" && <ClientDashboard />}
      {view === "pro-signup" && <GarageSignup setView={setView} onSubmit={setGarageAccount} />}
      {view === "pro" && <ProDashboard account={garageAccount} setView={setView} />}
      {view === "admin" && (
        <AdminDashboard
          garageAccount={garageAccount}
          onValidate={() => setGarageAccount((a) => (a ? { ...a, status: "active" } : a))}
          onReject={() => setGarageAccount(null)}
        />
      )}

      <AIAssistant onOrient={() => setView("results")} />

      <div style={{ background: C.navy950, padding: "40px 24px", marginTop: view === "admin" ? 0 : 40 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GaugeIco size={16} color={C.cyan400} />
            <span style={{ fontFamily: displayFont, fontWeight: 700, color: "#fff", fontSize: 14 }}>AutoCare</span>
          </div>
          <span style={{ fontFamily: bodyFont, fontSize: 12.5, color: C.grey500 }}>© 2026 AutoCare — Prototype de démonstration</span>
        </div>
      </div>
    </div>
  );
}
