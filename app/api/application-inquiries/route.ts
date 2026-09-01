import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const runtime = "nodejs"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fields = ["companyName", "fullName", "phone", "email", "application", "industry", "use", "quantity"] as const

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ message: "Please submit the application form again." }, { status: 400 }) }
  const values = Object.fromEntries(Object.entries(body).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]))
  if (String(values.website || "")) return NextResponse.json({ ok: true })
  if (fields.some((field) => !String(values[field] || "")) || values.terms !== true || values.robot !== true) return NextResponse.json({ message: "Please provide every application detail, accept the terms, and confirm that you are not a robot." }, { status: 400 })
  if (!EMAIL_PATTERN.test(String(values.email)) || Object.values(values).some((value) => typeof value === "string" && value.length > 5000)) return NextResponse.json({ message: "Please check the form values and try again." }, { status: 400 })
  const startedAt = Number(values.startedAt)
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1500 || Date.now() - startedAt > 24 * 60 * 60 * 1000) return NextResponse.json({ message: "Please confirm that you are not a robot and try again." }, { status: 400 })

  const smtpHost = process.env.APPLICATION_SMTP_HOST ?? process.env.CONTACT_SMTP_HOST ?? process.env.CAREERS_SMTP_HOST
  const smtpUser = process.env.APPLICATION_SMTP_USER ?? process.env.CONTACT_SMTP_USER ?? process.env.CAREERS_SMTP_USER
  const smtpPass = process.env.APPLICATION_SMTP_PASS ?? process.env.CONTACT_SMTP_PASS ?? process.env.CAREERS_SMTP_PASS
  const recipient = process.env.APPLICATION_INQUIRY_RECIPIENT ?? process.env.CONTACT_FORM_RECIPIENT
  if (!smtpHost || !smtpUser || !smtpPass || !recipient) return NextResponse.json({ message: "Inquiry delivery is temporarily unavailable. Please call us instead." }, { status: 503 })

  try {
    const transporter = nodemailer.createTransport({ host: smtpHost, port: Number(process.env.APPLICATION_SMTP_PORT ?? process.env.CONTACT_SMTP_PORT ?? process.env.CAREERS_SMTP_PORT ?? 465), secure: (process.env.APPLICATION_SMTP_SECURE ?? process.env.CONTACT_SMTP_SECURE ?? process.env.CAREERS_SMTP_SECURE) !== "false", auth: { user: smtpUser, pass: smtpPass } })
    await transporter.sendMail({ from: process.env.APPLICATION_SMTP_FROM ?? process.env.CONTACT_SMTP_FROM ?? process.env.CAREERS_SMTP_FROM ?? smtpUser, to: recipient, replyTo: String(values.email), subject: `Bearing application inquiry: ${String(values.companyName)}`, text: fields.map((field) => `${field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}: ${String(values[field])}`).join("\n") })
  } catch (error) { console.error("Unable to deliver application inquiry", error); return NextResponse.json({ message: "We could not send your inquiry. Please call us or try again later." }, { status: 502 }) }
  return NextResponse.json({ ok: true })
}
