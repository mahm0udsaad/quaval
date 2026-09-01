"use client"

import type { ChangeEvent, FormEvent } from "react"
import { useRef, useState } from "react"
import Image from "next/image"
import { Building2, CheckCircle2, Factory, Gauge, Send, Settings2, TableProperties } from "lucide-react"

const industries = ["Manufacturing", "Mining", "Steel & Metal Processing", "Automotive", "Pulp & Paper", "Oil & Gas", "Material Handling", "Industrial Machinery", "Forestry & Wood Products", "Agriculture", "Food Processing", "Cement & Construction Materials", "Transportation & Logistics", "HVAC & Industrial Equipment", "Railways", "Power Generation", "Marine & Ports", "Technology & IT", "Pharmaceutical Manufacturing", "Aerospace & Defense", "Robotics", "Fishing", "Electric Motors", "Textile Industry", "Fans & Blowers"]
const machines = ["Electric motor", "Water pump", "Gearbox", "Conveyor", "Crusher", "Fan", "Agricultural machine", "Wheel hub", "Transmission", "Machine tool", "Rolling mill", "Industrial reducer", "Machines", "Equipment", "Train", "Truck", "Street car", "Production line", "Ships", "Metro", "Buses", "Road and construction equipment"]
const conditions = ["Radial load", "Axial load", "Combined loads", "Speed", "Temperature", "Vibration", "Shock loads", "Dust and contamination", "Moisture / water", "Corrosive environments", "Required service life"]
const bearingApplications = [
  ["Deep groove ball bearings", "Motors, pumps, fans, conveyors"],
  ["Angular contact ball bearings", "Machine tools, pumps, precision equipment"],
  ["Cylindrical roller bearings", "Gearboxes, motors, heavy machinery"],
  ["Tapered roller bearings", "Wheel hubs, transmissions, heavy loads"],
  ["Spherical roller bearings", "Mining, conveyors, crushers"],
  ["Needle roller bearings", "Transmissions, compact machinery"],
  ["Thrust bearings", "Applications with high axial loads"],
] as const
const fieldClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"

type Panel = "industry" | "machine" | "bearing" | "conditions"
const panels = [
  ["industry", Factory, "Applications by industry"],
  ["machine", Settings2, "Applications by machine"],
  ["bearing", TableProperties, "Bearing type → application"],
  ["conditions", Gauge, "Application conditions"],
] as const

export default function ApplicationPage() {
  const [activePanel, setActivePanel] = useState<Panel>("industry")
  return <div className="bg-background">
    <section className="relative isolate overflow-hidden bg-secondary py-20 sm:py-28">
      <Image src="/images/gallery/batch3-03.jpg" alt="Industrial application" fill priority className="object-cover opacity-25" />
      <div className="absolute inset-0 bg-secondary/80" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Application engineering</p><h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">The right bearing starts with the right application data.</h1><p className="mt-5 text-base leading-7 text-white/80 sm:text-lg">Bearings are used across different industries and machinery, and selection depends on load, speed, temperature, environment, and operating conditions.</p></div></div>
    </section>

    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <section aria-labelledby="application-explorer-heading">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Explore applications</p>
        <h2 id="application-explorer-heading" className="mt-2 text-3xl font-bold text-secondary">Match the bearing to the work.</h2>
        <p className="mt-3 max-w-3xl leading-7 text-text-light">Hover, focus, or select a category to review the industries, machinery, bearing types, and operating conditions requested by Quaval.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {panels.map(([id, Icon, label]) => <button key={id} type="button" onMouseEnter={() => setActivePanel(id)} onFocus={() => setActivePanel(id)} onClick={() => setActivePanel(id)} aria-pressed={activePanel === id} className={`flex items-center gap-3 rounded-2xl border p-4 text-left font-semibold transition ${activePanel === id ? "border-primary bg-primary text-white shadow-md" : "border-slate-200 bg-white text-secondary hover:border-primary/40"}`}><Icon className="h-5 w-5 shrink-0" />{label}</button>)}
        </div>
        <div className="mt-5 min-h-80 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {activePanel === "industry" && <ChipList title="Applications by industry" items={industries} />}
          {activePanel === "machine" && <ChipList title="Applications by machine" items={machines} />}
          {activePanel === "conditions" && <ChipList title="Application conditions" items={conditions} />}
          {activePanel === "bearing" && <div><h3 className="text-2xl font-bold text-secondary">Bearing type → application</h3><div className="mt-6 overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-left"><thead className="bg-secondary text-white"><tr><th className="px-4 py-3 text-sm">Bearing type</th><th className="px-4 py-3 text-sm">Main applications</th></tr></thead><tbody>{bearingApplications.map(([bearing, application]) => <tr key={bearing} className="border-t border-slate-200"><th scope="row" className="px-4 py-3 text-sm font-semibold text-secondary">{bearing}</th><td className="px-4 py-3 text-sm text-text-light">{application}</td></tr>)}</tbody></table></div></div>}
        </div>
      </section>

      <ApplicationInquiryForm />
    </main>
  </div>
}

function ChipList({ title, items }: { title: string; items: string[] }) {
  return <div><h3 className="text-2xl font-bold text-secondary">{title}</h3><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <div key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-secondary"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{item}</div>)}</div></div>
}

function ApplicationInquiryForm() {
  const [form, setForm] = useState({ companyName: "", fullName: "", phone: "", email: "", application: "", industry: "", use: "", quantity: "", website: "", terms: false, robot: false })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [feedback, setFeedback] = useState("")
  const startedAt = useRef(Date.now())
  const change = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = event.target
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value }))
  }
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus("sending"); setFeedback("")
    try {
      const response = await fetch("/api/application-inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, startedAt: startedAt.current }) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.message || "We could not send your inquiry. Please try again.")
      setForm({ companyName: "", fullName: "", phone: "", email: "", application: "", industry: "", use: "", quantity: "", website: "", terms: false, robot: false }); startedAt.current = Date.now(); setStatus("success"); setFeedback("Thank you. Your application inquiry has been sent.")
    } catch (error) { setStatus("error"); setFeedback(error instanceof Error ? error.message : "We could not send your inquiry. Please try again.") }
  }
  return <section className="mt-14 grid gap-8 rounded-3xl bg-secondary p-6 text-white sm:p-8 lg:grid-cols-[0.7fr_1.3fr]" aria-labelledby="application-help-heading">
    <div><Building2 className="h-10 w-10 text-blue-300" /><h2 id="application-help-heading" className="mt-5 text-3xl font-bold">Need help selecting the right bearing?</h2><p className="mt-3 leading-7 text-white/75">Provide every application detail so the technical team can evaluate the requirement accurately.</p></div>
    <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-5 text-secondary sm:grid-cols-2 sm:p-6">
      <Input label="Company name" name="companyName" value={form.companyName} onChange={change} />
      <Input label="First and last name" name="fullName" value={form.fullName} onChange={change} />
      <Input label="Phone number" name="phone" value={form.phone} onChange={change} type="tel" />
      <Input label="Email address" name="email" value={form.email} onChange={change} type="email" />
      <Input label="Application" name="application" value={form.application} onChange={change} />
      <Input label="Industry" name="industry" value={form.industry} onChange={change} />
      <Input label="Use" name="use" value={form.use} onChange={change} />
      <Input label="Quantity" name="quantity" value={form.quantity} onChange={change} />
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="application-website">Website</label><input id="application-website" name="website" value={form.website} onChange={change} tabIndex={-1} autoComplete="off" /></div>
      <label className="flex items-start gap-3 text-sm leading-6 sm:col-span-2"><input type="checkbox" name="terms" checked={form.terms} onChange={change} required className="mt-1 h-4 w-4 shrink-0" />I agree to the company&apos;s policies, terms, and conditions.</label>
      <label className="flex w-fit items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium sm:col-span-2"><input type="checkbox" name="robot" checked={form.robot} onChange={change} required className="h-4 w-4" />I&apos;m not a robot</label>
      {feedback && <p role="status" className={`rounded-xl px-4 py-3 text-sm sm:col-span-2 ${status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{feedback}</p>}
      <button type="submit" disabled={status === "sending"} className="inline-flex w-fit items-center rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60 sm:col-span-2">{status === "sending" ? "Sending…" : "Submit inquiry"}<Send className="ml-2 h-4 w-4" /></button>
    </form>
  </section>
}

function Input({ label, name, value, onChange, type = "text" }: { label: string; name: string; value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return <label className="text-sm font-medium">{label} *<input type={type} name={name} value={value} onChange={onChange} required maxLength={type === "email" ? 254 : 200} className={`${fieldClass} mt-1.5`} /></label>
}
