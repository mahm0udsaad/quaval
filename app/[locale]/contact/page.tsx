"use client"

import type { ChangeEvent, FormEvent, ReactNode } from "react"
import { useRef, useState } from "react"
import { CheckCircle2, MapPin, Phone, Send } from "lucide-react"

type FormState = { name: string; email: string; subject: string; message: string; website: string; robot: boolean }
const initialForm: FormState = { name: "", email: "", subject: "", message: "", website: "", robot: false }
const fieldClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-secondary outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"

export default function ContactPage() {
  const [formData, setFormData] = useState(initialForm)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const startedAt = useRef(Date.now())

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("sending")
    setMessage("")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, startedAt: startedAt.current }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.message || "We could not send your message. Please try again.")
      setFormData(initialForm)
      startedAt.current = Date.now()
      setStatus("success")
      setMessage("Thank you. Your message has been sent to the Quaval team.")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "We could not send your message. Please try again.")
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = event.target
    const nextValue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value
    setFormData((current) => ({ ...current, [name]: nextValue }))
  }

  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden bg-secondary py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,86,179,0.55),_transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Contact Quaval</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Let&apos;s keep industry moving.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">Tell us what you need and our team will follow up about products, technical support, sourcing, or commercial opportunities.</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="contact-form-heading">
            <h2 id="contact-form-heading" className="text-2xl font-bold text-secondary sm:text-3xl">Send us a message</h2>
            <p className="mt-2 text-sm leading-6 text-text-light">All fields are required. Your email is used only so our team can reply.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" id="name"><input id="name" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" maxLength={100} className={fieldClass} /></Field>
                <Field label="Email address" id="email"><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" maxLength={254} className={fieldClass} /></Field>
              </div>
              <Field label="Subject" id="subject"><input id="subject" name="subject" value={formData.subject} onChange={handleChange} required maxLength={160} className={fieldClass} /></Field>
              <Field label="Message" id="message"><textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={7} maxLength={5000} className={`${fieldClass} resize-y`} /></Field>
              <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website</label><input id="website" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>
              <label className="flex w-fit cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-secondary">
                <input type="checkbox" name="robot" checked={formData.robot} onChange={handleChange} required className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />I&apos;m not a robot
              </label>
              {message && <p role="status" className={`rounded-xl px-4 py-3 text-sm ${status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{message}</p>}
              <button type="submit" disabled={status === "sending"} className="inline-flex items-center rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Send message"}<Send className="ml-2 h-4 w-4" />
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-secondary p-6 text-white shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold">Contact information</h2>
              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4"><MapPin className="mt-0.5 h-6 w-6 shrink-0 text-blue-300" /><div><h3 className="font-semibold">Laval office</h3><p className="mt-1 text-sm leading-6 text-white/75">3055 Saint-Martin West, Suite T500<br />Laval, Quebec, Canada H7T 0J3</p></div></div>
                <div className="flex items-start gap-4"><Phone className="mt-0.5 h-6 w-6 shrink-0 text-blue-300" /><div><h3 className="font-semibold">Phone</h3><a href="tel:+15142086840" className="mt-1 block text-sm text-white/75 transition hover:text-white">+1 (514) 208-6840</a></div></div>
                <div className="flex items-start gap-4"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-blue-300" /><div><h3 className="font-semibold">Direct response</h3><p className="mt-1 text-sm leading-6 text-white/75">Use the secure form and your inquiry will be routed to the appropriate Quaval representative.</p></div></div>
              </div>
            </section>
            <div className="h-[360px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
              <iframe title="Quaval office location in Laval, Quebec" src="https://www.google.com/maps?q=3055%20Boulevard%20Saint-Martin%20Ouest%2C%20Laval%2C%20QC%20H7T%200J3&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return <div><label htmlFor={id} className="mb-1.5 block text-sm font-medium text-secondary">{label}</label>{children}</div>
}
