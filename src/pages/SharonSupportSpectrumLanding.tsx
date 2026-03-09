"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { contactConfig } from "../config/contact";

type Service = {
  title: string;
  desc: string;
  bullets: string[];
  badge?: string;
};

const PRIMARY_EMAIL = contactConfig.primaryEmail;
const SECONDARY_EMAIL = contactConfig.secondaryEmail;
const SUPPORT_EMAIL = contactConfig.supportEmail;

const PHONE = "0468819199";
const PHONE_PRETTY = "0468 819 199";
const SERVICE_AREA = "Adelaide • Gawler • Murray Bridge";

function waLinkFromAuMobile(mobile: string) {
  const trimmed = mobile.replace(/\s+/g, "");
  const intl = trimmed.startsWith("04") ? `61${trimmed.slice(1)}` : trimmed;
  return `https://wa.me/${intl}`;
}

function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function SharonSupportSpectrumLanding() {
  useScrollReveal();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    enquiryType: "NDIS Services",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const services: Service[] = useMemo(
    () => [
      {
        badge: "NDIS",
        title: "Disability Support Services",
        desc: "Person-centred support designed around dignity, independence, and meaningful outcomes.",
        bullets: [
          "Personal care & daily living support",
          "Community access & social participation",
          "Support with appointments & transport",
          "Domestic assistance & meal preparation",
          "Mental health / psychosocial support (where appropriate)",
          "Support coordination referrals (if you have a coordinator)",
        ],
      },
      {
        badge: "NDIS",
        title: "In-Home Support Workers",
        desc: "Reliable support workers matched to your goals, preferences, and culture.",
        bullets: [
          "Flexible shifts (AM/PM/evenings/weekends)",
          "Goal-based support plans",
          "Culturally inclusive and respectful care",
          "Progress notes and clear communication",
          "Privacy, safety, and dignity-first approach",
        ],
      },
      {
        badge: "Aged Care Labour Hire",
        title: "PCA Labour Hire for Aged Care Facilities",
        desc: `We supply qualified Personal Care Assistants (PCAs) across ${SERVICE_AREA}.`,
        bullets: [
          "PCA shift coverage (urgent & planned)",
          "Credential-checked PCA staff pool",
          "Reliable attendance and professional conduct",
          "Clear escalation pathways & incident reporting",
          "Quality-focused support aligned with facility expectations",
        ],
      },
      {
        badge: "Aged Care Labour Hire",
        title: "Facility Workforce Partnership",
        desc: "A dependable staffing partner—designed to make workforce management effortless.",
        bullets: [
          "PCA compliance pack per worker",
          "Professional communication with CCMs/Managers",
          "Shift confirmations, timesheets, and transparency",
          "Ongoing training and performance oversight",
          "Consistent service delivery across South Australia locations",
        ],
      },
    ],
    []
  );

  const highlights = [
    {
      title: "Care and Support with Heart",
      desc: "Respectful care that protects dignity and promotes independence.",
    },
    {
      title: "Culturally Safe & Inclusive",
      desc: "We support diverse communities with cultural understanding and clear communication.",
    },
    {
      title: "Premium Workforce Support",
      desc: "Professional, verified PCA staffing support for aged care facilities.",
    },
    {
      title: "Safety & Compliance Focus",
      desc: "Clear documentation, incident escalation, and safe practice standards.",
    },
  ];

  const faqs = [
    {
      q: "Do you support NDIS participants who are plan-managed or self-managed?",
      a: "Yes. We support self-managed and plan-managed participants. If your plan requires registered providers, we can discuss options based on your plan type.",
    },
    {
      q: "Do you provide support coordination?",
      a: "We work with your Support Coordinator, Recovery Coach, or Plan Manager. If you don’t have one, we can help you find a suitable coordinator.",
    },
    {
      q: "Do you supply staff to residential aged care facilities?",
      a: `Yes. We supply qualified PCAs across ${SERVICE_AREA}. Compliance packs and clear communication processes are provided.`,
    },
    {
      q: "What areas do you cover?",
      a: SERVICE_AREA,
    },
  ];

  const isFacility = form.enquiryType.toLowerCase().includes("labour");
  const enquiryHint = isFacility
    ? "Tip: Include facility name, shift date/time, location, and number of PCAs required."
    : "Tip: Include your suburb, support goals, preferred days/times, and plan type (self/plan-managed).";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setFormFeedback({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          serviceArea: SERVICE_AREA,
          primaryEmail: PRIMARY_EMAIL,
          secondaryEmail: SECONDARY_EMAIL,
          supportEmail: SUPPORT_EMAIL,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        const errorMessage =
          data.error || "Message could not be sent. Please try again.";
        setFormFeedback({
          type: "error",
          message: errorMessage,
        });
        setToast({
          type: "error",
          message: errorMessage,
        });
        return;
      }

      setFormFeedback({
        type: "success",
        message: "Your message has been delivered successfully.",
      });

      setToast({
        type: "success",
        message: "Message delivered successfully.",
      });

      setForm({
        name: "",
        phone: "",
        email: "",
        enquiryType: "NDIS Services",
        message: "",
      });
    } catch (error) {
      setFormFeedback({
        type: "error",
        message: "Network error. Please check your internet and try again.",
      });

      setToast({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  const waLink = waLinkFromAuMobile(PHONE);

  return (
    <div className="min-h-screen bg-[#070A0F] text-white">
      {toast && (
        <div className="fixed left-1/2 top-4 z-[100] w-[92%] max-w-md -translate-x-1/2">
          <div
            className={`rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
              toast.type === "success"
                ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                : "border-red-400/30 bg-red-500/15 text-red-100"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-400/25 via-fuchsia-500/10 to-sky-400/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-220px] h-[520px] w-[520px] rounded-full bg-gradient-to-br from-amber-400/15 via-emerald-500/10 to-indigo-500/15 blur-3xl" />
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 sm:bottom-5 sm:right-5">
        <a
          href={`tel:${PHONE}`}
          className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur hover:bg-white/15"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-black">
            📞
          </span>
          <span className="hidden sm:inline">Call {PHONE_PRETTY}</span>
        </a>

        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur hover:bg-white/15"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-black">
            💬
          </span>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white p-1 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)] ring-1 ring-black/5">
              <Image
                src="/logo.png"
                alt="Sharon Support Spectrum logo"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>

            <div className="leading-tight">
              <div className="font-semibold tracking-wide text-white">
                Sharon Support Spectrum
              </div>
              <div className="text-xs text-white/70">
                …care and support with heart
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-3 md:flex">
            <a href="#services" className="text-sm text-white/70 hover:text-white">
              Services
            </a>
            <a href="#aged-care" className="text-sm text-white/70 hover:text-white">
              PCA Labour Hire
            </a>
            <a href="#about" className="text-sm text-white/70 hover:text-white">
              About
            </a>
            <a href="#contact" className="text-sm text-white/70 hover:text-white">
              Contact
            </a>

            <a
              href={`tel:${PHONE}`}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Call {PHONE_PRETTY}
            </a>

            <a
              href="#contact"
              className="rounded-xl bg-gradient-to-r from-amber-300 to-amber-100 px-4 py-2 text-sm font-semibold text-[#1A1305] hover:opacity-95"
            >
              Enquire Now
            </a>
          </nav>
        </div>
      </header>

      <section className="relative">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:gap-10 md:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              NDIS Disability Support + PCA Labour Hire ({SERVICE_AREA})
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Premium care. <span className="text-amber-200">Professional</span>{" "}
              workforce support.
            </h1>

            <p className="mt-4 text-base text-white/75 sm:text-lg">
              Sharon Support Spectrum provides person-centred disability supports
              and supplies qualified PCAs to aged care facilities—delivering
              service with dignity, safety, and excellence.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#services"
                className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-[#070A0F] hover:opacity-95"
              >
                Explore Services
              </a>

              <a
                href={`tel:${PHONE}`}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
              >
                Call Now
              </a>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
              >
                WhatsApp
              </a>
            </div>

            <div className="mt-8 reveal" data-reveal>
              <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_-60px_rgba(0,0,0,0.9)]">
                <Image
                  src="/images/ndis-support-services-trust-badges.jpg"
                  alt="NDIS Disability Support, Qualified Support Workers, PCA Labour Hire, Adelaide Gawler Murray Bridge"
                  width={1200}
                  height={650}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 md:pl-6">
            <div
              className="reveal relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_-60px_rgba(0,0,0,0.9)]"
              data-reveal
            >
              <Image
                src="/images/homepage-hero-care-support.jpg"
                alt="NDIS disability support and aged care services by Sharon Support Spectrum"
                width={1200}
                height={900}
                className="hero-animate h-auto w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>

            <div
              className="reveal rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur sm:p-6"
              data-reveal
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    Priority Enquiry
                  </div>
                  <p className="mt-1 text-sm text-white/70">
                    Share your needs and we’ll respond as soon as possible.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                  {SERVICE_AREA}
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-5 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <input
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />

                <select
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-amber-300/30"
                  value={form.enquiryType}
                  onChange={(e) =>
                    setForm({ ...form, enquiryType: e.target.value })
                  }
                >
                  <option>NDIS Services</option>
                  <option>Aged Care Labour Hire (PCA Only)</option>
                  <option>Employment / Join Our Team</option>
                  <option>General Enquiry</option>
                </select>

                <textarea
                  className="min-h-[120px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30"
                  placeholder="Tell us what you need..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />

                <div className="text-xs text-white/55">{enquiryHint}</div>

                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-2xl bg-gradient-to-r from-amber-300 to-amber-100 px-6 py-3 text-sm font-semibold text-[#1A1305] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send Enquiry"}
                </button>

                <div aria-live="polite">
                  {formFeedback.type === "success" && (
                    <p className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      {formFeedback.message}
                    </p>
                  )}

                  {formFeedback.type === "error" && (
                    <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {formFeedback.message}
                    </p>
                  )}
                </div>

                <p className="text-xs text-white/50">
                  Your enquiry will be sent to {PRIMARY_EMAIL} and{" "}
                  {SECONDARY_EMAIL}.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              "NDIS Participant Support",
              "Police Checked Support Workers",
              "Culturally Inclusive Care",
              "PCA Workforce for Facilities",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm font-semibold text-white/85"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-white/70">
          Working toward compliance with the NDIS Practice Standards and Quality
          Indicators. All workers are identity verified, police checked, and
          trained in safe support practices.
        </div>
      </section>

      <section id="about" className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-14 reveal" data-reveal>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold">
              About Sharon Support Spectrum
            </h2>
            <p className="mt-3 text-white/75">
              We deliver respectful, culturally responsive, goal-focused
              support. For aged care facilities, we provide dependable PCA
              staffing support with strong communication, documentation, and
              compliance practices.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="card-glow rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_-60px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{h.title}</div>
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                </div>
                <div className="mt-2 text-sm text-white/70">{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-14 reveal" data-reveal>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold">Services</h2>
              <p className="mt-2 text-white/75">
                Tailored supports designed around your goals, preferences, and
                wellbeing.
              </p>
            </div>
            <a
              href="#contact"
              className="mt-4 inline-flex w-fit items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 md:mt-0"
            >
              Request Capability Statement
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.title}
                className="card-glow rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-7 shadow-[0_20px_90px_-70px_rgba(0,0,0,0.95)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-semibold">{s.title}</div>
                  {s.badge ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                      {s.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-white/70">{s.desc}</p>
                <ul className="mt-5 grid gap-2 text-sm text-white/75">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-300/90" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="aged-care" className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-14 reveal" data-reveal>
          <div className="grid gap-6 md:grid-cols-2 md:items-start">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold">
                Aged Care Labour Hire (PCA Only)
              </h2>
              <p className="mt-3 text-white/75">
                We supply qualified PCAs across {SERVICE_AREA}—supporting urgent
                cover and planned roster needs. Rate card and compliance pack
                available on request.
              </p>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="font-semibold">What facilities get</div>
                <ul className="mt-3 grid gap-2 text-sm text-white/75">
                  {[
                    "Qualified Personal Care Assistants (PCAs)",
                    "Short notice shift coverage",
                    "Planned roster support",
                    "Compliance documentation",
                    "Clear escalation pathway and communication",
                  ].map((i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-300/90" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_-60px_rgba(0,0,0,0.9)]">
              <Image
                src="/images/aged-care-pca-labour-hire.jpg"
                alt="PCA Labour Hire for aged care facilities"
                width={1200}
                height={900}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-semibold">Facility Manager?</div>
                <div className="text-sm text-white/70">
                  Request our labour hire pack (capability statement +
                  compliance + rate card).
                </div>
              </div>
              <a
                href="#contact"
                className="rounded-2xl bg-gradient-to-r from-amber-300 to-amber-100 px-6 py-3 text-center text-sm font-semibold text-[#1A1305] hover:opacity-95"
              >
                Get Labour Hire Pack
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-14 reveal" data-reveal>
          <h2 className="text-2xl font-semibold">FAQs</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="card-glow rounded-3xl border border-white/10 bg-white/5 p-7 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="font-semibold">{f.q}</div>
                <p className="mt-2 text-sm text-white/70">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-14 reveal" data-reveal>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold">Contact</h2>
              <p className="mt-3 text-white/75">
                Send an enquiry and we’ll respond as soon as possible.
              </p>

              <div className="mt-7 grid gap-3 text-sm text-white/75">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="font-semibold text-white">Phone</div>
                  <a
                    className="mt-1 inline-block hover:text-white"
                    href={`tel:${PHONE}`}
                  >
                    {PHONE_PRETTY}
                  </a>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="font-semibold text-white">Primary Email</div>
                  <a
                    className="mt-1 inline-block break-all hover:text-white"
                    href={`mailto:${PRIMARY_EMAIL}`}
                  >
                    {PRIMARY_EMAIL}
                  </a>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="font-semibold text-white">Secondary Email</div>
                  <a
                    className="mt-1 inline-block break-all hover:text-white"
                    href={`mailto:${SECONDARY_EMAIL}`}
                  >
                    {SECONDARY_EMAIL}
                  </a>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="font-semibold text-white">Service Area</div>
                  <div className="mt-1">{SERVICE_AREA}</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <div className="text-lg font-semibold">Send an enquiry</div>
              <p className="mt-1 text-sm text-white/70">
                This form sends directly to our contact inboxes.
              </p>

              <form onSubmit={onSubmit} className="mt-5 grid gap-3">
                <input
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
                <input
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <select
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-amber-300/30"
                  value={form.enquiryType}
                  onChange={(e) =>
                    setForm({ ...form, enquiryType: e.target.value })
                  }
                >
                  <option>NDIS Services</option>
                  <option>Aged Care Labour Hire (PCA Only)</option>
                  <option>Employment / Join Our Team</option>
                  <option>General Enquiry</option>
                </select>
                <textarea
                  className="min-h-[120px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30"
                  placeholder="Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />

                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-2xl bg-gradient-to-r from-amber-300 to-amber-100 px-6 py-3 text-sm font-semibold text-[#1A1305] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Submit"}
                </button>

                <div aria-live="polite">
                  {formFeedback.type === "success" && (
                    <p className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      {formFeedback.message}
                    </p>
                  )}

                  {formFeedback.type === "error" && (
                    <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {formFeedback.message}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold">Join Our Support Team</h2>
          <p className="mt-3 text-white/70">
            We are always looking for compassionate support workers and PCAs who
            want to make a difference in people's lives.
          </p>

          <a
            href="#contact"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-amber-300 to-amber-100 px-6 py-3 font-semibold text-[#1A1305]"
          >
            Apply to Join Our Team
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <div>© 2026 Sharon Support Spectrum. All rights reserved.</div>
          <div className="break-all">
            Phone: {PHONE_PRETTY} • Email: {PRIMARY_EMAIL} • Alternate:{" "}
            {SECONDARY_EMAIL} • Service Area: {SERVICE_AREA}
          </div>
        </div>
      </footer>
    </div>
  );
}