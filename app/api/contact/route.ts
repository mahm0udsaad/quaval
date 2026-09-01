import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const runtime = "nodejs"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Please submit the contact form again." }, { status: 400 })
  }

  const requiredFields = ["title", "fullName", "phone", "email", "companyName", "contactName", "country", "address", "postalCode", "industrialSector", "referralSource", "message"] as const
  const values = Object.fromEntries(Object.entries(body).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]))
  const email = String(values.email ?? "")
  const message = String(values.message ?? "")
  const website = String(body.website ?? "").trim()
  const startedAt = Number(body.startedAt)

  // Silently accept honeypot submissions so automated senders cannot tune around it.
  if (website) return NextResponse.json({ ok: true })

  if (requiredFields.some((field) => !String(values[field] ?? "")) || body.terms !== true || body.robot !== true) {
    return NextResponse.json({ message: "Please complete every required field, accept the terms, and confirm that you are not a robot." }, { status: 400 })
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254 || message.length > 5000 || Object.values(values).some((value) => typeof value === "string" && value.length > 5000)) {
    return NextResponse.json({ message: "Please check the form values and try again." }, { status: 400 })
  }
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1500 || Date.now() - startedAt > 24 * 60 * 60 * 1000) {
    return NextResponse.json({ message: "Please confirm that you are not a robot and try again." }, { status: 400 })
  }

  const smtpHost = process.env.CONTACT_SMTP_HOST ?? process.env.CAREERS_SMTP_HOST
  const smtpUser = process.env.CONTACT_SMTP_USER ?? process.env.CAREERS_SMTP_USER
  const smtpPass = process.env.CONTACT_SMTP_PASS ?? process.env.CAREERS_SMTP_PASS
  const recipient = process.env.CONTACT_FORM_RECIPIENT

  if (!smtpHost || !smtpUser || !smtpPass || !recipient) {
    return NextResponse.json({ message: "Message delivery is temporarily unavailable. Please call us instead." }, { status: 503 })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.CONTACT_SMTP_PORT ?? process.env.CAREERS_SMTP_PORT ?? 465),
      secure: (process.env.CONTACT_SMTP_SECURE ?? process.env.CAREERS_SMTP_SECURE) !== "false",
      auth: { user: smtpUser, pass: smtpPass },
    })
    await transporter.sendMail({
      from: process.env.CONTACT_SMTP_FROM ?? process.env.CAREERS_SMTP_FROM ?? smtpUser,
      to: recipient,
      replyTo: email,
      subject: `Website inquiry: ${String(values.subject || values.companyName)}`,
      text: [
        ["Title", values.title], ["Full name", values.fullName], ["Phone", values.phone], ["Fax", values.fax],
        ["Email", email], ["Web", values.web], ["Company name", values.companyName], ["First and last name", values.contactName],
        ["Country", values.country], ["City", values.city], ["Address", values.address], ["Postal code", values.postalCode],
        ["Industrial sector", values.industrialSector], ["Preferred language", values.preferredLanguage], ["Subject", values.subject],
        ["How they heard about Quaval", values.referralSource], ["Message", message],
      ].map(([label, value]) => `${label}: ${String(value || "—")}`).join("\n"),
    })
  } catch (error) {
    console.error("Unable to deliver contact message", error)
    return NextResponse.json({ message: "We could not send your message. Please call us or try again later." }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
