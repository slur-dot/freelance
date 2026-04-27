import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function CompanyHistory() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const rootRef = useRef(null);

  const STATS = [
    { lbl: t('company_history.stats.active_users_lbl', "Utilisateurs actifs"),  val: "10 000+", sub: t('company_history.stats.active_users_sub', "+500 ce mois"),           green: true },
    { lbl: t('company_history.stats.completed_projects_lbl', "Projets complétés"),    val: "25 000+", sub: t('company_history.stats.completed_projects_sub', "98% taux de succès"),      green: true },
    { lbl: t('company_history.stats.expert_freelancers_lbl', "Freelanceurs experts"), val: "1 500+",  sub: t('company_history.stats.expert_freelancers_sub', "Professionnels vérifiés"), green: true },
    { lbl: t('company_history.stats.partners_lbl', "Partenaires"),          val: "50+",     sub: t('company_history.stats.partners_sub', "Local & international"),   green: true },
  ];

  const EMOTIONS = [
    { color: "#2563EB", bg: "#EFF6FF", icon: "📡", title: t('company_history.emotions.title_1', "La distance qui révèle"),   text: t('company_history.emotions.text_1', "Depuis la France, on comprend exactement ce qui manque. On a vu comment marchent les plateformes ici. On sait ce que la Guinée mérite d'avoir. Et on a décidé de le construire.") },
    { color: "#16A34A", bg: "#F0FDF4", icon: "🌱", title: t('company_history.emotions.title_2', "Le talent qui existe déjà"), text: t('company_history.emotions.text_2', "Chaque année, des milliers de jeunes guinéens sortent diplômés avec de vraies compétences. Ce n'est pas le talent qui manque c'est la scène pour l'exprimer. FREELANCE-224 est cette scène.") },
    { color: "#D97706", bg: "#FEF3C7", icon: "💛", title: t('company_history.emotions.title_3', "L'amour qui construit"),    text: t('company_history.emotions.text_3', "FREELANCE-224 n'est pas né d'un calcul commercial. Il est né de cet attachement profond, irrationnel, indéracinable que tout Guinéen de la diaspora porte pour son pays.") },
    { color: "#DC2626", bg: "#FEF2F2", icon: "🔥", title: t('company_history.emotions.title_4', "L'urgence qui accélère"),   text: t('company_history.emotions.text_4', "60% des Guinéens ont moins de 25 ans. Cette jeunesse n'attend pas. Elle a besoin d'outils, de formation, de revenus maintenant. FREELANCE-224 répond à cette urgence.") },
  ];

  const TIMELINE = [
    { done: true,  year: t('company_history.timeline.year_1', "2022–2023 · L'étincelle  France"),         title: t('company_history.timeline.title_1', "Le constat depuis la diaspora"),                 text: t('company_history.timeline.text_1', "Installés en France, les fondateurs voient quotidiennement la fracture : des plateformes numériques matures d'un côté, leurs proches en Guinée compétents, motivés, mais invisibles de l'autre. L'idée naît de cette injustice.") },
    { done: true,  year: t('company_history.timeline.year_2', "2024 · La vision  Entre deux rives"),       title: t('company_history.timeline.title_2', "Architecture d'un écosystème complet"),          text: t('company_history.timeline.text_2', "Entre Paris et Conakry, les allers-retours forgent la conviction : il ne faut pas une simple appli de freelancing. Il faut une infrastructure complète formation, marketplace, paiements en GNF, location B2B. Tout ce qu'un jeune guinéen nécessite pour vivre de ses compétences.") },
    { done: true,  year: t('company_history.timeline.year_3', "2025 · La construction  Retour au pays"),   title: t('company_history.timeline.title_3', "On pose les fondations à Conakry"),              text: t('company_history.timeline.text_3', "L'équipe s'ancre à Sonfonia Gare. Le code est écrit. Les partenariats se tissent. La plateforme prend forme pensée en France, construite en Guinée, pour la Guinée.") },
    { done: true,  year: t('company_history.timeline.year_4', "Mars 2026 · La naissance officielle"),       title: t('company_history.timeline.title_4', "FREELANCE-224 SARL  Constitution à Conakry"),   text: t('company_history.timeline.text_4', "La société est officiellement constituée. Un acte juridique, certes. Mais surtout un acte de foi celui d'une diaspora qui dit : nous croyons en la Guinée assez fort pour y investir notre temps, notre énergie, notre avenir.") },
    { done: false, year: t('company_history.timeline.year_5', "1er mai 2026 · Le lancement"),               title: t('company_history.timeline.title_5', "Le jour où la Guinée change de chapitre"),       text: t('company_history.timeline.text_5', "Le 1er mai Fête internationale du Travail FREELANCE-224 ouvre ses portes à Conakry. Ce jour-là, le monde célèbre les travailleurs. Et FREELANCE-224 dit haut et fort : les travailleurs guinéens méritent leur place dans l'économie numérique mondiale.") },
    { done: false, year: t('company_history.timeline.year_6', "2027–2030 · L'expansion"),                   title: t('company_history.timeline.title_6', "La Guinée, locomotive numérique régionale"),     text: t('company_history.timeline.text_6', "Ancré en Guinée, le modèle rayonne vers les 10 pays d'Afrique de l'Ouest. La Guinée n'est plus seulement bénéficiaire elle devient exportatrice de solutions numériques africaines.") },
  ];

  const PILLARS = [
    { num: "01", name: t('company_history.pillars.freelancing', "Freelancing") },
    { num: "02", name: t('company_history.pillars.academy', "Académie Digitale") },
    { num: "03", name: t('company_history.pillars.marketplace', "Marketplace IT") },
    { num: "04", name: t('company_history.pillars.b2b', "Location B2B") },
    { num: "05", name: t('company_history.pillars.payments', "Paiements GNF") },
  ];

  const AUDIENCES = [
    { bg: "#EFF6FF", iconColor: "#2563EB", flag: "🇬🇳", label: t('company_history.audiences.youth_label', "La jeunesse"),       labelColor: "#2563EB", title: t('company_history.audiences.youth_title', "Les talents de Guinée"),          text: t('company_history.audiences.youth_text', "Tu as une compétence, une idée, une ambition. Tu n'as plus besoin de partir pour réussir. FREELANCE-224 est ton marché, ta formation, ton premier client ici, en Guinée.") },
    { bg: "#FEF3C7", iconColor: "#D97706", flag: "✈️", label: t('company_history.audiences.diaspora_label', "La diaspora"),        labelColor: "#D97706", title: t('company_history.audiences.diaspora_title', "Nos frères et sœurs à l'étranger"), text: t('company_history.audiences.diaspora_text', "Tu vis en France, en Belgique, au Canada, aux États-Unis. La Guinée bat dans ton cœur. Investis dans cette plateforme. Rejoins ceux qui bâtissent depuis l'étranger ce qui manquait au pays.") },
    { bg: "#F0FDF4", iconColor: "#16A34A", flag: "🏛️", label: t('company_history.audiences.state_label', "L'État & institutions"), labelColor: "#16A34A", title: t('company_history.audiences.state_title', "Partenaires institutionnels"),   text: t('company_history.audiences.state_text', "FREELANCE-224 réduit le chômage des jeunes, formalise l'économie informelle et génère des données sur le marché du travail guinéen. Un partenariat avec nous, c'est investir dans la souveraineté numérique de la Guinée.") },
  ];

  const TABS = [
    t('company_history.tabs_new.history', "Histoire"), 
    t('company_history.tabs_new.mission', "Mission & Vision"), 
    t('company_history.tabs_new.impact', "Impact & Chiffres"), 
    t('company_history.tabs_new.partnerships', "Partenariats")
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("ch-in"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".ch-anim").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .ch-anim{opacity:0;transform:translateY(22px);transition:opacity .65s ease,transform .65s ease}
        .ch-anim.ch-in{opacity:1;transform:none}
        .ch-d1{transition-delay:.1s}.ch-d2{transition-delay:.2s}.ch-d3{transition-delay:.3s}.ch-d4{transition-delay:.4s}

        .ch-page{font-family:'Inter',-apple-system,sans-serif;color:#111827;background:#F8FAFF}

        /* HERO */
        .ch-hero{background:linear-gradient(135deg,#1E3A8A 0%,#1E40AF 40%,#2563EB 100%);padding:4rem 2rem 3.5rem;position:relative;overflow:hidden}
        .ch-hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.08) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
        .ch-arc{position:absolute;right:-80px;top:-80px;width:400px;height:400px;border-radius:50%;border:1px solid rgba(255,255,255,.07);pointer-events:none}
        .ch-arc::before,.ch-arc::after{content:'';position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,.04)}
        .ch-arc::before{inset:50px}.ch-arc::after{inset:100px}

        .ch-flag{display:flex;align-items:center;gap:6px;margin-bottom:1.75rem}
        .ch-fs{height:5px;border-radius:2px}
        .ch-farrow{color:rgba(255,255,255,.3);font-size:14px;margin:0 4px}

        .ch-live{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:100px;padding:6px 16px;margin-bottom:1.75rem}
        .ch-ldot{width:8px;height:8px;border-radius:50%;background:#4ADE80;animation:ch-pulse 2s infinite}
        @keyframes ch-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.85)}}
        .ch-live span{font-size:11px;color:rgba(255,255,255,.88);font-weight:500;letter-spacing:.08em;text-transform:uppercase}

        .ch-hero h1{font-size:clamp(1.9rem,4.5vw,3.2rem);color:#fff;line-height:1.15;margin-bottom:1.25rem;font-weight:700}
        .ch-hero h1 em{font-style:italic;color:#93C5FD}
        .ch-hero h1 .acc{color:#FCD116;font-style:normal}
        .ch-hsub{font-size:1.05rem;color:rgba(255,255,255,.68);max-width:560px;line-height:1.85;font-weight:300}
        .ch-hsub strong{color:rgba(255,255,255,.9);font-weight:500}

        /* CONNEXION BAND */
        .ch-cxband{background:#1D4ED8;padding:1rem 2rem;display:flex;align-items:center;justify-content:center;gap:2rem;flex-wrap:wrap}
        .ch-cxi{display:flex;align-items:center;gap:8px}
        .ch-cxarrow{color:rgba(255,255,255,.35);font-size:16px}
        .ch-cxtxt{font-size:13px;color:rgba(255,255,255,.78);font-weight:400}
        .ch-cxtxt strong{color:#fff;font-weight:600}

        /* STATS */
        .ch-stats{display:grid;grid-template-columns:repeat(4,1fr)}
        @media(max-width:640px){.ch-stats{grid-template-columns:repeat(2,1fr)}}
        .ch-st{background:#fff;border-bottom:1px solid #E5E7EB;padding:1.25rem 1.5rem}
        .ch-st+.ch-st{border-left:1px solid #E5E7EB}
        .ch-slbl{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6B7280;margin-bottom:6px}
        .ch-sval{font-size:1.4rem;font-weight:700;color:#111827;margin-bottom:3px}

        /* TABS */
        .ch-tabs{background:#fff;border-bottom:1px solid #E5E7EB;display:flex;padding:0 2rem;overflow-x:auto}
        .ch-tab{padding:1rem 1.25rem;font-size:14px;font-weight:500;color:#6B7280;border:none;border-bottom:2px solid transparent;cursor:pointer;white-space:nowrap;background:none;font-family:inherit;transition:color .15s,border-color .15s}
        .ch-tab.on{color:#2563EB;border-bottom-color:#2563EB}

        /* CONTENT */
        .ch-main{max-width:860px;margin:0 auto;padding:3rem 2rem}

        /* LETTER */
        .ch-letter{background:linear-gradient(135deg,#EFF6FF,#F8FAFF);border:1px solid #DBEAFE;border-radius:16px;padding:2.5rem;margin-bottom:3rem}
        .ch-lfrom{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#2563EB;margin-bottom:1.25rem;display:flex;align-items:center;gap:8px}
        .ch-lfrom::before{content:'';width:16px;height:2px;background:#2563EB;border-radius:1px}
        .ch-letter h2{font-size:1.45rem;color:#1E3A8A;font-weight:700;line-height:1.35;margin-bottom:1.25rem}
        .ch-lp{font-size:1rem;color:#1E40AF;line-height:1.9;margin-bottom:1rem;font-weight:300}
        .ch-lp strong{font-weight:600;color:#1E3A8A}
        .ch-lsig{display:flex;align-items:center;gap:12px;margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid #BFDBFE}
        .ch-lavatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#2563EB,#1D4ED8);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:#fff;flex-shrink:0}
        .ch-lsigt p{font-size:14px;font-weight:600;color:#1E3A8A;margin-bottom:2px}
        .ch-lsigt span{font-size:12px;color:#3B82F6}

        .ch-tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#2563EB;margin-bottom:1rem}
        .ch-tag::before{content:'';width:16px;height:2px;background:#2563EB;border-radius:1px}
        .ch-sh{font-size:1.55rem;color:#111827;font-weight:700;line-height:1.3;margin-bottom:1.25rem}
        .ch-bp{font-size:1rem;line-height:1.9;color:#374151;margin-bottom:1.25rem}
        .ch-bp strong{color:#111827;font-weight:600}
        .ch-bp em{color:#1D4ED8;font-style:italic}
        .ch-drop::first-letter{font-size:4rem;font-weight:700;color:#2563EB;float:left;line-height:.78;padding-right:10px;padding-top:10px}

        /* EMOTION CARDS */
        .ch-ecgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:2rem 0}
        @media(max-width:540px){.ch-ecgrid{grid-template-columns:1fr}}
        .ch-ec{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:1.5rem;position:relative;overflow:hidden}
        .ch-ectop{width:100%;height:3px;position:absolute;top:0;left:0;border-radius:14px 14px 0 0}
        .ch-ecico{font-size:22px;margin-bottom:10px;margin-top:4px}
        .ch-ectitle{font-size:.95rem;font-weight:600;color:#111827;margin-bottom:6px}
        .ch-ectxt{font-size:.85rem;color:#6B7280;line-height:1.7}

        .ch-pq{background:linear-gradient(135deg,#EFF6FF,#fff);border-left:4px solid #2563EB;border-radius:0 12px 12px 0;padding:1.5rem 1.75rem;margin:2.25rem 0}
        .ch-pq p{font-size:1.1rem;font-style:italic;color:#1E3A8A;line-height:1.75}
        .ch-pq cite{display:block;font-size:12px;color:#6B7280;font-style:normal;margin-top:10px}

        .ch-divider{height:1px;background:#E5E7EB;margin:2.75rem 0}

        /* TIMELINE */
        .ch-tl{position:relative;padding-left:2.2rem;margin:1.75rem 0 2.5rem}
        .ch-tl::before{content:'';position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:linear-gradient(to bottom,#2563EB,#DBEAFE)}
        .ch-tli{position:relative;margin-bottom:2.25rem}
        .ch-tldot{position:absolute;left:-2.2rem;top:3px;width:16px;height:16px;border-radius:50%;border:2.5px solid #2563EB;background:#fff}
        .ch-tldot.done{background:#2563EB}
        .ch-tlyr{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#2563EB;margin-bottom:4px}
        .ch-tltt{font-size:1rem;font-weight:600;color:#111827;margin-bottom:6px}
        .ch-tltx{font-size:.9rem;color:#4B5563;line-height:1.78}
        .ch-tltx strong{color:#1E40AF;font-weight:600}

        /* PILLARS */
        .ch-pls{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin:1.5rem 0 2rem}
        @media(max-width:600px){.ch-pls{grid-template-columns:repeat(3,1fr)}}
        .ch-pl{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:1.1rem .75rem;text-align:center;transition:border-color .2s,box-shadow .2s}
        .ch-pl:hover{border-color:#2563EB;box-shadow:0 0 0 3px #EFF6FF}
        .ch-plico{width:38px;height:38px;border-radius:9px;background:#EFF6FF;display:flex;align-items:center;justify-content:center;margin:0 auto 8px}
        .ch-plnum{font-size:11px;font-weight:700;color:#2563EB;margin-bottom:3px;letter-spacing:.04em}
        .ch-plname{font-size:11px;font-weight:600;color:#111827}

        /* NUMBERS */
        .ch-nums{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:1.75rem 0}
        .ch-nc{background:#EFF6FF;border-radius:12px;padding:1.4rem;text-align:center}
        .ch-nb{font-size:2.2rem;font-weight:700;color:#1E3A8A;margin-bottom:4px}
        .ch-nl{font-size:12px;color:#3B82F6;font-weight:500;line-height:1.4}

        /* AUDIENCES */
        .ch-aud{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:1.5rem 0 2.5rem}
        @media(max-width:640px){.ch-aud{grid-template-columns:1fr}}
        .ch-ac{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:1.4rem;transition:box-shadow .2s,border-color .2s}
        .ch-ac:hover{box-shadow:0 4px 20px rgba(37,99,235,.1);border-color:#BFDBFE}
        .ch-actop{display:flex;align-items:center;gap:10px;margin-bottom:12px}
        .ch-acio{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .ch-aclbl{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
        .ch-actitle{font-size:.9rem;font-weight:600;color:#111827;margin-bottom:6px}
        .ch-actxt{font-size:.82rem;color:#6B7280;line-height:1.7}
        .ch-actxt em{color:#2563EB;font-style:normal;font-weight:500}

        /* VISION */
        .ch-vis{background:linear-gradient(135deg,#1E3A8A 0%,#1E40AF 60%,#1D4ED8 100%);border-radius:20px;padding:3rem;margin:2.5rem 0;position:relative;overflow:hidden}
        .ch-vis::before{content:'\\201C';font-size:18rem;color:rgba(255,255,255,.03);position:absolute;top:-4rem;left:1rem;line-height:1;pointer-events:none;font-style:italic}
        .ch-vis .ch-tag{color:#93C5FD}.ch-vis .ch-tag::before{background:#93C5FD}
        .ch-vis h3{font-size:clamp(1.4rem,3vw,1.9rem);color:#fff;line-height:1.35;margin-bottom:1.5rem;font-weight:700}
        .ch-vp{font-size:.95rem;color:rgba(255,255,255,.62);line-height:1.95;margin-bottom:1.1rem}
        .ch-vhl{margin-top:1.5rem;padding:1.25rem;background:rgba(255,255,255,.07);border-radius:12px;border:1px solid rgba(255,255,255,.1)}
        .ch-vhl p{font-size:.95rem;color:#BAE6FD;line-height:1.8}
        .ch-vhl strong{color:#fff;font-weight:600}

        /* PARTNER */
        .ch-pband{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:2.25rem;margin:2.5rem 0}
        .ch-pband h4{font-size:1.2rem;font-weight:700;color:#111827;margin-bottom:.5rem}
        .ch-pband > p{font-size:.9rem;color:#6B7280;margin-bottom:1.5rem;line-height:1.7}
        .ch-ptypes{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:1.5rem}
        @media(max-width:500px){.ch-ptypes{grid-template-columns:repeat(2,1fr)}}
        .ch-pt{background:#F8FAFF;border:1px solid #E5E7EB;border-radius:8px;padding:.75rem;text-align:center}
        .ch-ptlbl{font-size:11px;font-weight:600;color:#374151;margin-top:5px}
        .ch-ctarow{display:flex;gap:10px;flex-wrap:wrap}
        .ch-btnp{background:#2563EB;color:#fff;padding:.75rem 1.75rem;border-radius:8px;font-size:14px;font-weight:600;border:none;cursor:pointer;font-family:inherit;transition:background .2s;letter-spacing:.01em}
        .ch-btnp:hover{background:#1D4ED8}
        .ch-btno{background:transparent;color:#2563EB;border:1.5px solid #2563EB;padding:.75rem 1.75rem;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:background .2s}
        .ch-btno:hover{background:#EFF6FF}
      `}</style>

      <div className="ch-page" ref={rootRef}>

        {/* ── HERO ── */}
        <section className="ch-hero">
          <div className="ch-arc" />

          <h1 className="ch-anim">
            {t('company_history.hero.title_p1', "Un rêve forgé")} <em>{t('company_history.hero.title_p2', "loin de chez soi")}</em>.<br />
            {t('company_history.hero.title_p3', "Une réalité bâtie")} <span className="acc">{t('company_history.hero.title_p4', "pour la Guinée")}</span>.
          </h1>
          <p className="ch-hsub ch-anim ch-d1">
            {t('company_history.hero.subtitle_p1', "Il a fallu traverser la Méditerranée, vivre la distance, ressentir le manque pour comprendre exactement ce que la Guinée méritait d'avoir.")}{" "}
            <strong>{t('company_history.hero.subtitle_p2', "FREELANCE-224 est née de cet amour à distance.")}</strong>
          </p>
        </section>

        {/* ── CONNEXION ── */}
        <div className="ch-cxband">
          <div className="ch-cxi"><span style={{ fontSize: 18 }}>🇫🇷</span><span className="ch-cxtxt">{t('company_history.cx.france', "L'idée naît en")} <strong>{t('company_history.cx.france_bold', "France")}</strong></span></div>
          <span className="ch-cxarrow">→</span>
          <div className="ch-cxi"><span style={{ fontSize: 18 }}>🇬🇳</span><span className="ch-cxtxt">{t('company_history.cx.guinea', "La solution bâtie pour")} <strong>{t('company_history.cx.guinea_bold', "la Guinée")}</strong></span></div>
          <span className="ch-cxarrow">→</span>
          <div className="ch-cxi"><span style={{ fontSize: 18 }}>🌍</span><span className="ch-cxtxt">{t('company_history.cx.africa', "L'ambition : toute")} <strong>{t('company_history.cx.africa_bold', "l'Afrique de l'Ouest")}</strong></span></div>
        </div>

        {/* ── STATS ── */}
        <div className="ch-stats">
          {STATS.map((s) => (
            <div key={s.lbl} className="ch-st">
              <div className="ch-slbl">{s.lbl}</div>
              <div className="ch-sval">{s.val}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#16A34A" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="ch-tabs">
          {TABS.map((tItem, i) => (
            <button key={i} className={`ch-tab${activeTab === i ? " on" : ""}`} onClick={() => setActiveTab(i)}>{tItem}</button>
          ))}
        </div>

        {/* ── MAIN ── */}
        <div className="ch-main">

          {/* LETTRE */}
          <div className="ch-letter ch-anim">
            <div className="ch-lfrom">{t('company_history.letter.from', "Une lettre de la diaspora guinéenne")}</div>
            <h2>« {t('company_history.letter.quote', "J'ai réussi à l'étranger. Mais ma victoire ne compte vraiment que si elle sert la Guinée.")} »</h2>
            <p className="ch-lp">{t('company_history.letter.p1', "Il y a des soirs en France où l'on s'allonge dans sa chambre d'étudiant et où l'on pense à ses parents restés à Conakry. À ce cousin brillant qui ne trouve pas de travail malgré son diplôme. À cette sœur graphiste qui dessine sur son téléphone mais ne sait pas à qui vendre son talent.")}</p>
            <p className="ch-lp">{t('company_history.letter.p2_pt1', "On a tout quitté pour construire quelque chose. On a appris, travaillé, intégré un système qui n'était pas fait pour nous. Et on a réussi. Mais au fond, une question ne lâchait pas : ")}<strong>{t('company_history.letter.p2_pt2', "à quoi sert cette réussite si elle ne traverse pas l'océan ?")}</strong></p>
            <p className="ch-lp">{t('company_history.letter.p3_pt1', "FREELANCE-224 est la réponse à cette question. Pas une startup. Pas un projet de CV. ")}<strong>{t('company_history.letter.p3_pt2', "Un pont entre ceux qui ont eu la chance de partir et ceux qui méritaient les mêmes opportunités en restant.")}</strong></p>
            <div className="ch-lsig">
              <div className="ch-lavatar">F2</div>
              <div className="ch-lsigt">
                <p>{t('company_history.letter.signature', "L'équipe fondatrice FREELANCE-224")}</p>
                <span>{t('company_history.letter.signature_sub', "Guinéens de cœur · Citoyens du monde · Bâtisseurs d'avenir")}</span>
              </div>
            </div>
          </div>

          {/* ORIGIN */}
          <p className="ch-tag ch-anim">{t('company_history.origin.tag', "Le point de départ")}</p>
          <h2 className="ch-sh ch-anim">{t('company_history.origin.title', "Ce que l'exil apprend qu'on ne voit pas de l'intérieur")}</h2>
          <p className="ch-bp ch-drop ch-anim">{t('company_history.origin.p1', "Quand on vit en France et qu'on regarde la Guinée de loin, on voit des choses que ceux qui y sont n'arrivent pas toujours à nommer. On voit un pays qui déborde de jeunes diplômés sans marché. On voit des compétences réelles développement web, comptabilité, design, traduction, marketing qui existent dans les chambres et les appartements de Conakry, de Kindia, de Labé, de N'Zérékoré, mais qui ne trouvent jamais preneur. Non par manque de talent. Par manque d'infrastructure.")}</p>
          <p className="ch-bp ch-anim">{t('company_history.origin.p2_pt1', "On voit aussi quelque chose de douloureux : ")}<strong>{t('company_history.origin.p2_pt2', "ces jeunes qui partent")}</strong>. {t('company_history.origin.p2_pt3', "Pas parce qu'ils ne veulent pas rester. Parce qu'il n'y a pas de raison de rester. Pas de plateforme qui les connecte à des clients. Pas de système qui sécurise leurs paiements. Pas d'académie qui développe leurs compétences dans leur propre langue.")}</p>

          <div className="ch-ecgrid">
            {EMOTIONS.map((e, i) => (
              <div key={i} className={`ch-ec ch-anim ch-d${i + 1}`}>
                <div className="ch-ectop" style={{ background: e.color }} />
                <div className="ch-ecico">{e.icon}</div>
                <div className="ch-ectitle">{e.title}</div>
                <p className="ch-ectxt">{e.text}</p>
              </div>
            ))}
          </div>

          <div className="ch-pq ch-anim">
            <p>« {t('company_history.origin.quote', "Ce n'est pas depuis Conakry que l'on mesure le mieux ce qui manque à Conakry. C'est depuis Paris, Lyon ou Bordeaux, à 5 000 kilomètres, le cœur serré, que l'on comprend enfin ce qu'il faut construire.")} »</p>
            <cite> {t('company_history.origin.quote_cite', "La genèse de FREELANCE-224, née dans la diaspora guinéenne de France")}</cite>
          </div>

          <p className="ch-bp ch-anim">{t('company_history.origin.p3_pt1', "Le nom lui-même est une déclaration. ")}<strong>224</strong> {t('company_history.origin.p3_pt2', "l'indicatif téléphonique de la Guinée. Ces trois chiffres que tout Guinéen de la diaspora compose quand il veut entendre la voix de sa mère, de son père, de sa terre. Ils sont devenus le nom de cette plateforme. Parce que FREELANCE-224, c'est exactement ça : ")}<em>{t('company_history.origin.p3_pt3', "un appel passé depuis l'étranger, qui dit à la Guinée nous sommes là, nous construisons pour toi.")}</em></p>

          <div className="ch-divider" />

          {/* TIMELINE */}
          <p className="ch-tag ch-anim">{t('company_history.timeline.tag', "Chronologie")}</p>
          <h2 className="ch-sh ch-anim">{t('company_history.timeline.title', "De la nostalgie au mouvement")}</h2>
          <div className="ch-tl">
            {TIMELINE.map((item, i) => (
              <div key={i} className={`ch-tli ch-anim ch-d${Math.min(i + 1, 4)}`}>
                <div className={`ch-tldot${item.done ? " done" : ""}`} />
                <p className="ch-tlyr">{item.year}</p>
                <p className="ch-tltt">{item.title}</p>
                <p className="ch-tltx" dangerouslySetInnerHTML={{ __html: item.text.replace(/([^.]+méritent[^.]+\.)/, '<strong>$1</strong>') }} />
              </div>
            ))}
          </div>

          {/* PILLARS */}
          <p className="ch-tag ch-anim">{t('company_history.pillars.tag', "L'écosystème")}</p>
          <h2 className="ch-sh ch-anim">{t('company_history.pillars.title', "Cinq piliers. Zéro compromis.")}</h2>
          <p className="ch-bp ch-anim">{t('company_history.pillars.desc', "Chaque pilier répond à un manque réel identifié depuis la diaspora et confirmé sur le terrain. Ensemble, ils couvrent l'intégralité du parcours d'un talent guinéen de la formation au premier salaire.")}</p>
          <div className="ch-pls">
            {PILLARS.map((p) => (
              <div key={p.num} className="ch-pl ch-anim">
                <div className="ch-plico">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#2563EB" />
                    <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#2563EB" opacity=".35" />
                    <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#2563EB" opacity=".35" />
                    <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#2563EB" opacity=".35" />
                  </svg>
                </div>
                <div className="ch-plnum">{p.num}</div>
                <div className="ch-plname">{p.name}</div>
              </div>
            ))}
          </div>

          <div className="ch-nums">
            <div className="ch-nc ch-anim"><div className="ch-nb">60%</div><div className="ch-nl">{t('company_history.numbers.stat_1', "des Guinéens ont moins de 25 ans")}</div></div>
            <div className="ch-nc ch-anim ch-d1"><div className="ch-nb">20+</div><div className="ch-nl">{t('company_history.numbers.stat_2', "secteurs économiques couverts")}</div></div>
            <div className="ch-nc ch-anim ch-d2"><div className="ch-nb">50 000</div><div className="ch-nl">{t('company_history.numbers.stat_3', "jeunes à autonomiser d'ici 2030")}</div></div>
          </div>

          <div className="ch-divider" />

          {/* AUDIENCES */}
          <p className="ch-tag ch-anim">{t('company_history.audiences.tag', "Pour qui ?")}</p>
          <h2 className="ch-sh ch-anim">{t('company_history.audiences.title', "Cette histoire vous appartient aussi.")}</h2>
          <div className="ch-aud">
            {AUDIENCES.map((a, i) => (
              <div key={i} className={`ch-ac ch-anim ch-d${i + 1}`}>
                <div className="ch-actop">
                  <div className="ch-acio" style={{ background: a.bg }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="3.5" fill={a.iconColor} />
                      <path d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={a.iconColor} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="ch-aclbl" style={{ color: a.labelColor }}>{a.flag} {a.label}</span>
                </div>
                <div className="ch-actitle">{a.title}</div>
                <p className="ch-actxt">{a.text}</p>
              </div>
            ))}
          </div>

          {/* VISION */}
          <div className="ch-vis ch-anim">
            <p className="ch-tag">{t('company_history.vision.tag', "Notre raison d'être")}</p>
            <h3>{t('company_history.vision.title_pt1', "Nous ne construisons pas une startup.")}<br />{t('company_history.vision.title_pt2', "Nous rendons à la Guinée ce qu'elle nous a donné.")}</h3>
            <p className="ch-vp">{t('company_history.vision.p1', "La Guinée nous a donné notre identité, notre langue, nos valeurs, notre sens de la famille et de la solidarité. Elle nous a donné l'envie de nous battre. Elle mérite qu'on lui rende quelque chose de concret pas des promesses, mais une infrastructure qui travaille chaque jour pour ses enfants.")}</p>
            <p className="ch-vp">{t('company_history.vision.p2', "Chaque fois qu'un jeune de Matoto décroche sa première mission via FREELANCE-224, chaque fois qu'une étudiante de l'Université de Conakry se forme sur notre Académie et devient indépendante, chaque fois qu'une PME de Kindia équipe son bureau grâce à notre Location B2B c'est un bout de notre mission qui s'accomplit.")}</p>
            <p className="ch-vp">{t('company_history.vision.p3', "Nous n'attendons pas que la Guinée change pour agir. Nous agissons pour que la Guinée change.")}</p>
            <div className="ch-vhl">
              <p><strong>{t('company_history.vision.hl_title', "Notre engagement pour 2030 :")}</strong> {t('company_history.vision.hl_text', "50 000 jeunes guinéens vivant dignement de leurs compétences numériques. Un écosystème rayonnant vers les 10 pays d'Afrique de l'Ouest. Une Guinée qui exporte ses solutions et non plus seulement ses cerveaux.")}</p>
            </div>
          </div>

          {/* PARTNER */}
          <div className="ch-pband ch-anim">
            <h4>{t('company_history.partner.title', "Construisons ensemble.")}</h4>
            <p>{t('company_history.partner.desc', "FREELANCE-224 est ouverte à tout partenariat qui partage notre vision : une Guinée où le talent est valorisé, rémunéré et célébré. Que vous soyez une institution publique, une ONG, un investisseur ou un acteur du secteur privé parlons-nous.")}</p>
            <div className="ch-ptypes">
              {[
                ["🏛️", t('company_history.partner.type_1', "Institutions")],
                ["🤝", t('company_history.partner.type_2', "ONG & Fondations")],
                ["💼", t('company_history.partner.type_3', "Secteur privé")],
                ["🌍", t('company_history.partner.type_4', "Diaspora")]
              ].map(([ico, lbl]) => (
                <div key={lbl} className="ch-pt"><div style={{ fontSize: 18 }}>{ico}</div><div className="ch-ptlbl">{lbl}</div></div>
              ))}
            </div>
            <div className="ch-ctarow">
              <button className="ch-btnp" onClick={() => window.location.href = "/register"}>{t('company_history.partner.btn_join', "Rejoindre la plateforme")}</button>
              <button className="ch-btno" onClick={() => window.location.href = "/contact"}>{t('company_history.partner.btn_contact', "Proposer un partenariat →")}</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
