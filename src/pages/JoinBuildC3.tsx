import React, { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Seo } from "@/components/Seo";
import { pagesConfig } from "@/config/pages";

// ─── Float animation styles ───────────────────────────────────────────────────

const floatStyle = (delay: string, duration = "4s") => ({
  animation: `floatUpDown ${duration} ease-in-out ${delay} infinite`,
});

// inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("float-kf")) {
  const style = document.createElement("style");
  style.id = "float-kf";
  style.textContent = `
    @keyframes floatUpDown {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
}

// ─── Peep community strip ────────────────────────────────────────────────────

const PEEPS = [
  { src: "/peeps/peep-standing-1.svg",  h: "h-40", sitting: false },
  { src: "/peeps/peep-sitting-1.svg",   h: "h-28", sitting: true  },
  { src: "/peeps/peep-standing-3.svg",  h: "h-44", sitting: false },
  { src: "/peeps/peep-standing-5.svg",  h: "h-36", sitting: false },
  { src: "/peeps/peep-sitting-4.svg",   h: "h-28", sitting: true  },
  { src: "/peeps/peep-standing-8.svg",  h: "h-40", sitting: false },
  { src: "/peeps/peep-standing-12.svg", h: "h-44", sitting: false },
  { src: "/peeps/peep-standing-17.svg", h: "h-36", sitting: false },
];

function PeepStrip() {
  return (
    <div className="w-full flex items-end justify-center gap-2 px-4 md:px-8 select-none pointer-events-none">
      {PEEPS.map(({ src, h, sitting }) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`${h} w-auto object-contain ${sitting ? "mb-0" : ""}`}
          draggable={false}
        />
      ))}
    </div>
  );
}

// ─── Floating cards (dark style) ─────────────────────────────────────────────

function FloatingCards() {
  return (
    <div className="hidden lg:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-10">
      <div style={floatStyle("0s")} className="bg-[#9F8064]/10 backdrop-blur-sm border border-[#9F8064]/30 rounded-2xl p-4 w-52 text-foreground">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-[#9F8064]/20 flex items-center justify-center text-sm">✌️</div>
          <div>
            <p className="text-[10px] text-muted-foreground">You're in!</p>
            <p className="text-xs font-semibold">Welcome to BuildC3</p>
          </div>
        </div>
        <div className="h-px bg-[#9F8064]/20 mb-2" />
        <p className="text-[11px] text-muted-foreground">🚀 Ship your product in 2 weeks</p>
      </div>

      <div style={floatStyle("0.5s")} className="bg-[#9F8064]/5 border border-[#9F8064]/20 rounded-2xl p-4 w-52 text-foreground">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Community</p>
        <p className="text-sm font-bold mb-1">0 → 40k users in 6 months</p>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <span key={i} className="text-[#9F8064] text-xs">★</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Waitlist form (prelaunch) ────────────────────────────────────────────────

function WaitlistForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", idea: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/.netlify/functions/submit-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      setStatus("success");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-3">🎉</p>
        <h2 className="text-xl font-bold text-foreground mb-2">You're on the list!</h2>
        <p className="text-muted-foreground text-sm">We'll definitely reach out to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      {/* Stacked inputs */}
      <div className="rounded-xl overflow-hidden border border-[#9F8064]/30">
        {[
          { label: "Name", name: "name", type: "text", placeholder: "Your full name", textarea: false },
          { label: "Phone Number", name: "phone", type: "text", placeholder: "+1 234 567 8900", textarea: false },
          { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com", textarea: false },
        ].map(({ label, name, type, placeholder }, i, arr) => (
          <div
            key={name}
            className={`flex flex-col bg-[#9F8064]/8 px-4 pt-3 pb-2.5 border-b border-[#9F8064]/20`}
          >
            <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={(form as Record<string, string>)[name]}
              onChange={handleChange}
              required
              placeholder={placeholder}
              className="bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground/40 w-full"
            />
          </div>
        ))}
        {/* Idea textarea */}
        <div className="flex flex-col bg-[#9F8064]/8 px-4 pt-3 pb-2.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            Your Idea
          </label>
          <textarea
            name="idea"
            value={form.idea}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Tell us what you want to build..."
            className="bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground/40 w-full resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-3 w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "loading" ? "Submitting…" : "Join Waitlist"}
      </button>

      {status === "error" && (
        <p className="text-xs text-red-400 mt-2 text-center">{errorMsg}</p>
      )}
    </form>
  );
}

// ─── Full application form (version = 'full') ─────────────────────────────────

function FullForm() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    projectIdea: "", whyJoin: "", portfolio: "", linkedin: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/.netlify/functions/submit-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-10">
        <p className="text-3xl mb-3">🎉</p>
        <h2 className="text-xl font-bold text-foreground mb-2">Application submitted!</h2>
        <p className="text-muted-foreground text-sm">We'll review and get back to you soon.</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-[#9F8064]/8 border border-[#9F8064]/25 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#9F8064]/30 placeholder:text-muted-foreground/40 transition";

  return (
    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10">
      {/* Benefits */}
      <div className="flex-1 rounded-2xl border border-[#9F8064]/30 bg-[#9F8064]/5 p-8">
        <h2 className="text-lg font-bold text-foreground mb-8">What you get by joining BuildC3</h2>
        <div className="space-y-8">
          {[
            { n: "1", title: "Mentors who've done it", body: "Access to mentors who have grown apps from 0 to 40 users in just 6 months." },
            { n: "2", title: "Full deployment support", body: "Help and deployment support from BuildC3 so you never get stuck." },
            { n: "3", title: "Ship in 2 weeks, get users fast", body: "Build, ship, and get your first users in 2 weeks to start your feedback loop." },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-[#9F8064]/20 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-sm">{n}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 rounded-2xl border border-[#9F8064]/40 bg-[#9F8064]/5 p-8 shadow-[0_8px_40px_-8px_rgba(159,128,100,0.2)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Name", name: "name", type: "text", placeholder: "Your full name" },
            { label: "Phone Number", name: "phone", type: "text", placeholder: "+1 234 567 8900" },
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Portfolio Link", name: "portfolio", type: "text", placeholder: "https://yourportfolio.com", optional: true },
            { label: "LinkedIn", name: "linkedin", type: "text", placeholder: "https://linkedin.com/in/yourname" },
          ].map(({ label, name, type, placeholder, optional }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {label}{optional && <span className="text-muted-foreground font-normal ml-1">(optional)</span>}
              </label>
              <input type={type} name={name} value={(form as Record<string, string>)[name]} onChange={handleChange} required={!optional} placeholder={placeholder} className={inputClass} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1.5">Project Idea</label>
            <textarea name="projectIdea" value={form.projectIdea} onChange={handleChange} required rows={3} placeholder="Describe your project idea..." className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1.5">Why do you want to join?</label>
            <textarea name="whyJoin" value={form.whyJoin} onChange={handleChange} required rows={3} placeholder="Tell us what motivates you..." className={`${inputClass} resize-none`} />
          </div>
          {status === "error" && <p className="text-sm text-red-500">{errorMsg}</p>}
          <button type="submit" disabled={status === "loading"} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
            {status === "loading" ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JoinBuildC3() {
  const isPrelaunch = pagesConfig.join.version === "prelaunch";

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-background">
      <Seo
        title="Join BuildC3"
        path="/join-buildc3"
        description="Join BuildC3 — become part of a community of builders and developers shipping real products together. Build in, with, and for the community."
      />
      <SiteHeader />

      {isPrelaunch ? (
        <main className="flex-1 flex flex-col">
          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-6">

            {/* Heading */}
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-4xl select-none text-foreground/70"
                style={{ display: "inline-block", transform: "rotate(-15deg)" }}
              >
                ☎
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                Join our waitlist
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-muted-foreground text-center max-w-md mb-8 text-sm md:text-base leading-relaxed">
              We're in our pre-launch phase — building something special for makers and builders.
              Drop your details and we'll{" "}
              <span className="font-semibold text-foreground/80">definitely</span> reach out to you soon!
            </p>

            {/* Cards + Form row */}
            <div className="w-full max-w-5xl flex items-start justify-center gap-5">

              {/* Left column — 2 cards, staggered vertically */}
              <div className="hidden lg:flex flex-col gap-4 w-52 shrink-0 pt-6">
                <div style={floatStyle("0s", "4.2s")} className="bg-[#9F8064]/10 border border-[#9F8064]/30 rounded-2xl p-4 text-foreground rotate-[-1.5deg]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#9F8064]/20 flex items-center justify-center text-sm">✌️</div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">You're in!</p>
                      <p className="text-xs font-semibold">Welcome to BuildC3</p>
                    </div>
                  </div>
                  <div className="h-px bg-[#9F8064]/20 mb-2" />
                  <p className="text-[11px] text-muted-foreground">🚀 Ship your product in 2 weeks</p>
                </div>

                <div style={{ ...floatStyle("0.8s", "3.8s"), marginLeft: "12px" }} className="bg-[#9F8064]/5 border border-[#9F8064]/20 rounded-2xl p-4 text-foreground rotate-[1deg]">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">The Problem</p>
                  <p className="text-sm font-bold leading-snug">Great ideas die waiting for the right team</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5">You bring the idea — we bring the team.</p>
                </div>
              </div>

              {/* Form */}
              <div className="w-full max-w-sm shrink-0">
                <WaitlistForm />
              </div>

              {/* Right column — 3 cards, staggered vertically */}
              <div className="hidden lg:flex flex-col gap-4 w-52 shrink-0 pt-2">
                <div style={{ ...floatStyle("0.3s", "4.5s"), marginLeft: "8px" }} className="bg-[#9F8064]/5 border border-[#9F8064]/20 rounded-2xl p-4 text-foreground rotate-[1.5deg]">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Community</p>
                  <p className="text-sm font-bold mb-1">0 → 40k users in 6 months</p>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <span key={i} className="text-[#9F8064] text-xs">★</span>)}
                  </div>
                </div>

                <div style={floatStyle("1.1s", "4s")} className="bg-[#9F8064]/10 border border-[#9F8064]/30 rounded-2xl p-4 text-foreground rotate-[-1deg]">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Mentorship</p>
                  <p className="text-sm font-bold leading-snug">Learn from builders who've done it</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5">Real mentors. Real products. Real advice.</p>
                </div>

                <div style={{ ...floatStyle("1.6s", "3.6s"), marginLeft: "10px" }} className="bg-[#9F8064]/5 border border-[#9F8064]/20 rounded-2xl p-4 text-foreground rotate-[1deg]">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Mission</p>
                  <p className="text-sm font-bold leading-snug">Idea → Live in 2 weeks</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5">Not someday. Now.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Peep strip pinned to bottom */}
          <div className="mt-auto pt-4">
            <PeepStrip />
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12 tracking-tight text-foreground">
            Join BuildC3
          </h1>
          <FullForm />
        </main>
      )}
    </div>
  );
}
