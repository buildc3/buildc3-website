import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { pagesConfig } from "@/config/pages";

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
    <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[112%]">
        <div className="floaty bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 w-52 text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-sm">✌️</div>
            <div>
              <p className="text-[10px] text-white/50">You're in!</p>
              <p className="text-xs font-semibold">Welcome to BuildC3</p>
            </div>
          </div>
          <div className="h-px bg-white/10 mb-2" />
          <p className="text-[11px] text-white/50">🚀 Ship your product in 2 weeks</p>
        </div>
      </div>

      <div className="absolute right-0 top-[44%] -translate-y-1/2 translate-x-[112%]">
        <div className="floaty-slow bg-white/5 border border-white/10 rounded-2xl p-4 w-52 text-white">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Community</p>
          <p className="text-sm font-bold mb-1">0 → 40k users in 6 months</p>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className="text-yellow-400 text-xs">★</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Waitlist form (prelaunch) ────────────────────────────────────────────────

function WaitlistForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", ideaBrief: "" });
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
        <div className="relative mx-auto mb-4 h-16 w-16">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
          <div className="absolute inset-1 rounded-full bg-emerald-500/30 animate-pulse" />
          <div className="relative h-16 w-16 rounded-full bg-emerald-500/90 flex items-center justify-center text-white text-2xl">
            ✓
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">You're on the list!</h2>
        <p className="text-white/60 text-sm">! Thanks for showing interest in joining BuildC3. We shall be reaching out to you soom !</p>
        <p className="text-white/50 text-sm mt-4">Make sure to have a look at our other projects.</p>
        <Link
          to="/projects"
          className="inline-flex items-center justify-center mt-3 px-4 py-2 rounded-xl bg-white text-gray-900 text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors"
        >
          View Projects
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-white/10 bg-[#0f0f15] p-4">
      {/* Stacked dark inputs */}
      <div className="rounded-xl overflow-hidden border border-white/10">
        {[
          { label: "Name", name: "name", type: "text", placeholder: "Your full name" },
          { label: "Phone Number", name: "phone", type: "text", placeholder: "+1 234 567 8900" },
          { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com" },
        ].map(({ label, name, type, placeholder }, i, arr) => (
          <div
            key={name}
            className={`flex flex-col bg-white/5 px-4 pt-3 pb-2.5 ${i < arr.length - 1 ? "border-b border-white/10" : ""}`}
          >
            <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-0.5">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={(form as Record<string, string>)[name]}
              onChange={handleChange}
              required
              placeholder={placeholder}
              className="bg-transparent text-white text-sm focus:outline-none placeholder:text-white/20 w-full"
            />
          </div>
        ))}
        <div className="flex flex-col bg-white/5 px-4 pt-3 pb-2.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-0.5">
            Enter your Idea in a brief
          </label>
          <textarea
            name="ideaBrief"
            value={form.ideaBrief}
            onChange={handleChange}
            rows={3}
            placeholder="A short summary of your idea"
            className="bg-transparent text-white text-sm focus:outline-none placeholder:text-white/20 w-full resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-3 w-full py-3 rounded-xl bg-white text-gray-900 text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Submitting…" : "Join Community"}
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
        <h2 className="text-xl font-bold text-white mb-2">Application submitted!</h2>
        <p className="text-white/50 text-sm">We'll review and get back to you soon.</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/25 transition";

  return (
    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10">
      {/* Benefits */}
      <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-lg font-bold text-white mb-8">What you get by joining BuildC3</h2>
        <div className="space-y-8">
          {[
            { n: "1", title: "Mentors who've done it", body: "Access to mentors who have grown apps from 0 to 40 users in just 6 months." },
            { n: "2", title: "Full deployment support", body: "Help and deployment support from BuildC3 so you never get stuck." },
            { n: "3", title: "Ship in 2 weeks, get users fast", body: "Build, ship, and get your first users in 2 weeks to start your feedback loop." },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">{n}</span>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">{title}</p>
                <p className="text-white/50 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 rounded-2xl border border-purple-500/30 bg-white/5 p-8 shadow-[0_8px_40px_-8px_rgba(124,58,237,0.4)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Name", name: "name", type: "text", placeholder: "Your full name" },
            { label: "Phone Number", name: "phone", type: "text", placeholder: "+1 234 567 8900" },
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Portfolio Link", name: "portfolio", type: "text", placeholder: "https://yourportfolio.com", optional: true },
            { label: "LinkedIn", name: "linkedin", type: "text", placeholder: "https://linkedin.com/in/yourname" },
          ].map(({ label, name, type, placeholder, optional }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                {label}{optional && <span className="text-white/30 font-normal ml-1">(optional)</span>}
              </label>
              <input type={type} name={name} value={(form as Record<string, string>)[name]} onChange={handleChange} required={!optional} placeholder={placeholder} className={inputClass} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Project Idea</label>
            <textarea name="projectIdea" value={form.projectIdea} onChange={handleChange} required rows={3} placeholder="Describe your project idea..." className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Why do you want to join?</label>
            <textarea name="whyJoin" value={form.whyJoin} onChange={handleChange} required rows={3} placeholder="Tell us what motivates you..." className={`${inputClass} resize-none`} />
          </div>
          {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
          <button type="submit" disabled={status === "loading"} className="w-full py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-white/90 transition-colors disabled:opacity-60">
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
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{
        backgroundColor: "#0a0a0f",
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <SiteHeader />

      {isPrelaunch ? (
        <main className="flex-1 flex flex-col relative">
          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-2 relative z-10">
            {/* Heading */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-4xl select-none text-white/80"
                style={{ display: "inline-block", transform: "rotate(-15deg)" }}
              >
                ☎
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                Join our waitlist
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-white/45 text-center max-w-md mb-10 text-sm md:text-base leading-relaxed">
              We're in our pre-launch phase — building something special for makers and builders.
              Drop your details and we'll{" "}
              <span className="font-semibold text-white/70">definitely</span> reach out to you soon!
            </p>

            <div className="relative w-full max-w-sm">
              <FloatingCards />
              <WaitlistForm />
            </div>
          </div>

          {/* Peep strip pinned to bottom */}
          <div className="mt-auto pt-6">
            <PeepStrip />
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12 tracking-tight text-white">
            Join BuildC3
          </h1>
          <FullForm />
        </main>
      )}
    </div>
  );
}
