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

  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim()
  const subject = String(body.subject ?? "").trim()
  const message = String(body.message ?? "").trim()
  const website = String(body.website ?? "").trim()
  const startedAt = Number(body.startedAt)

  // Silently accept honeypot submissions so automated senders cannot tune around it.
  if (website) return NextResponse.json({ ok: true })

  if (!name || !email || !subject || !message || body.robot !== true) {
    return NextResponse.json({ message: "Please complete every field and confirm that you are not a robot." }, { status: 400 })
  }
  if (!EMAIL_PATTERN.test(email) || name.length > 100 || email.length > 254 || subject.length > 160 || message.length > 5000) {
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
      subject: `Website inquiry: ${subject}`,
      text: `Name: ${name}\nReply email: ${email}\nSubject: ${subject}\n\n${message}`,
    })
  } catch (error) {
    console.error("Unable to deliver contact message", error)
    return NextResponse.json({ message: "We could not send your message. Please call us or try again later." }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
