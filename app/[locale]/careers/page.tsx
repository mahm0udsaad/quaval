"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import { BriefcaseBusiness, CheckCircle2, FileText, MapPin, Send, ShieldCheck, Upload } from "lucide-react"

const inputClassName = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
const labelClassName = "block text-sm font-semibold text-secondary"

type ApplicationState = "idle" | "submitting" | "success" | "error"

export default function CareersPage() {
  const [status, setStatus] = useState<ApplicationState>("idle")
  const [message, setMessage] = useState("")
  const [resumeName, setResumeName] = useState("")

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setResumeName(file?.name ?? "")
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const resume = formData.get("resume")

    if (!(resume instanceof File) || resume.size === 0) {
      setStatus("error")
      setMessage("Please attach your resume before submitting your application.")
      return
    }

    setStatus("submitting")
    setMessage("")

    try {
      const response = await fetch("/api/careers/applications", { method: "POST", body: formData })
      const result = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(result.message || "Your application could not be submitted. Please try again.")
      }

      form.reset()
      setResumeName("")
      setStatus("success")
      setMessage("Thank you. Your application has been received for current and future opportunities.")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Your application could not be submitted. Please try again.")
    }
  }

  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden bg-secondary py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,86,179,0.55),_transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              <BriefcaseBusiness className="h-3.5 w-3.5" /> Careers at Quaval
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Build the future of industrial reliability.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Join a team focused on dependable products, thoughtful service, and long-term customer partnerships.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <section aria-labelledby="opportunities-heading" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Current opportunities</p>
              <h2 id="opportunities-heading" className="mt-2 text-3xl font-bold text-secondary">Find the role that fits your experience.</h2>
              <p className="mt-3 leading-7 text-text-light">Every posted role will include its title, location, employment type, description, qualifications, responsibilities, and application instructions.</p>
            </div>
            <a href="#application" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark">
              Submit an application <Send className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center sm:p-8">
            <BriefcaseBusiness className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 text-lg font-semibold text-secondary">No roles are published at this time.</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-light">We welcome applications from qualified candidates and may consider them for future opportunities.</p>
          </div>
        </section>

        <section id="application" aria-labelledby="application-heading" className="mt-12 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <aside className="rounded-3xl bg-secondary p-6 text-white sm:p-8 lg:sticky lg:top-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Apply to Quaval</p>
            <h2 id="application-heading" className="mt-3 text-3xl font-bold">Tell us about your experience.</h2>
            <p className="mt-4 leading-7 text-white/75">Please complete each section and attach your resume. We collect this information only to assess current or future employment opportunities.</p>
            <ul className="mt-8 space-y-4 text-sm text-white/85">
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />Personal and position information</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />Professional background and references</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />Resume, declaration, and privacy consent</li>
            </ul>
            <div className="mt-8 border-t border-white/15 pt-6 text-sm text-white/70">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />Laval, Quebec, Canada</div>
              <div className="mt-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Your details are handled for recruitment purposes.</div>
            </div>
          </aside>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <fieldset className="col-span-full">
                <legend className="text-xl font-bold text-secondary">Personal information</legend>
              </fieldset>
              <div>
                <label className={labelClassName} htmlFor="fullName">Full name</label>
                <input className={inputClassName} id="fullName" name="fullName" autoComplete="name" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="email">Email address</label>
                <input className={inputClassName} id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="phone">Phone number</label>
                <input className={inputClassName} id="phone" name="phone" type="tel" autoComplete="tel" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="cityProvince">City / province</label>
                <input className={inputClassName} id="cityProvince" name="cityProvince" autoComplete="address-level1" required />
              </div>
              <div className="col-span-full">
                <label className={labelClassName} htmlFor="address">Address</label>
                <input className={inputClassName} id="address" name="address" autoComplete="street-address" required />
              </div>

              <fieldset className="col-span-full mt-4 border-t border-slate-100 pt-7">
                <legend className="text-xl font-bold text-secondary">Position information</legend>
              </fieldset>
              <div>
                <label className={labelClassName} htmlFor="position">Position applied for</label>
                <input className={inputClassName} id="position" name="position" placeholder="e.g., Sales Representative" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="department">Department</label>
                <input className={inputClassName} id="department" name="department" placeholder="e.g., Sales or Operations" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="employmentType">Employment type</label>
                <select className={inputClassName} id="employmentType" name="employmentType" required defaultValue="">
                  <option value="" disabled>Select employment type</option>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Temporary</option>
                </select>
              </div>
              <div>
                <label className={labelClassName} htmlFor="startDate">Preferred start date</label>
                <input className={inputClassName} id="startDate" name="startDate" type="date" required />
              </div>

              <fieldset className="col-span-full mt-4 border-t border-slate-100 pt-7">
                <legend className="text-xl font-bold text-secondary">Professional background</legend>
              </fieldset>
              <div>
                <label className={labelClassName} htmlFor="currentEmployer">Current or most recent employer</label>
                <input className={inputClassName} id="currentEmployer" name="currentEmployer" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="jobTitle">Position / job title</label>
                <input className={inputClassName} id="jobTitle" name="jobTitle" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="experience">Years of experience</label>
                <input className={inputClassName} id="experience" name="experience" type="number" min="0" max="70" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="education">Education / certifications</label>
                <input className={inputClassName} id="education" name="education" required />
              </div>
              <div className="col-span-full">
                <label className={labelClassName} htmlFor="employmentHistory">Previous employment history</label>
                <textarea className={inputClassName} id="employmentHistory" name="employmentHistory" rows={4} required />
              </div>
              <div className="col-span-full">
                <label className={labelClassName} htmlFor="skills">Relevant skills</label>
                <textarea className={inputClassName} id="skills" name="skills" rows={3} required />
              </div>

              <fieldset className="col-span-full mt-4 border-t border-slate-100 pt-7">
                <legend className="text-xl font-bold text-secondary">Additional information</legend>
              </fieldset>
              <div className="col-span-full">
                <label className={labelClassName} htmlFor="interest">Why are you interested in joining our company?</label>
                <textarea className={inputClassName} id="interest" name="interest" rows={4} required />
              </div>
              <div className="col-span-full">
                <label className={labelClassName} htmlFor="additionalInformation">Anything else relevant to your application?</label>
                <textarea className={inputClassName} id="additionalInformation" name="additionalInformation" rows={4} />
              </div>

              <fieldset className="col-span-full mt-4 border-t border-slate-100 pt-7">
                <legend className="text-xl font-bold text-secondary">Reference</legend>
              </fieldset>
              <div>
                <label className={labelClassName} htmlFor="referenceName">Reference name</label>
                <input className={inputClassName} id="referenceName" name="referenceName" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="referenceCompany">Company</label>
                <input className={inputClassName} id="referenceCompany" name="referenceCompany" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="referencePosition">Position</label>
                <input className={inputClassName} id="referencePosition" name="referencePosition" required />
              </div>
              <div>
                <label className={labelClassName} htmlFor="referenceContact">Phone / email</label>
                <input className={inputClassName} id="referenceContact" name="referenceContact" required />
              </div>
              <div className="col-span-full">
                <label className={labelClassName} htmlFor="referenceRelationship">Relationship to applicant</label>
                <input className={inputClassName} id="referenceRelationship" name="referenceRelationship" required />
              </div>

              <div className="col-span-full mt-4">
                <label className={labelClassName} htmlFor="resume">Upload resume</label>
                <label htmlFor="resume" className="mt-1.5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm transition hover:border-primary hover:bg-blue-50">
                  <span className="flex min-w-0 items-center gap-3"><Upload className="h-5 w-5 shrink-0 text-primary" /><span className="truncate text-slate-600">{resumeName || "Choose a PDF, DOC, or DOCX file (max. 8 MB)"}</span></span>
                  <FileText className="h-5 w-5 shrink-0 text-slate-400" />
                </label>
                <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" onChange={handleResumeChange} required />
              </div>

              <div className="col-span-full mt-2 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                <p className="font-semibold text-secondary">Applicant declaration</p>
                <p className="mt-2">I certify that the information provided in this application is accurate and complete to the best of my knowledge. I understand that submitting this application does not create any obligation on the part of the company to hire me or to conduct an interview. However, my application may be considered for current or future employment opportunities for which I may be qualified.</p>
                <p className="mt-4 font-semibold text-secondary">Privacy consent</p>
                <p className="mt-2">I consent to the collection, use, and retention of the personal information provided in this application for the purpose of evaluating my suitability for current or future employment opportunities with Quaval.</p>
                <label className="mt-4 flex cursor-pointer items-start gap-3 font-medium text-secondary"><input name="consent" type="checkbox" value="agreed" className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" required /><span>I agree to the above terms and conditions.</span></label>
              </div>
            </div>

            {status !== "idle" && <p role="status" className={`mt-6 rounded-xl px-4 py-3 text-sm ${status === "success" ? "bg-emerald-50 text-emerald-800" : status === "error" ? "bg-red-50 text-red-800" : "bg-blue-50 text-primary"}`}>{message || "Submitting your application…"}</p>}
            <button disabled={status === "submitting"} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-70">
              {status === "submitting" ? "Submitting application…" : "Submit application"}<Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
