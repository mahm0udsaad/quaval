import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const runtime = "nodejs"

const MAX_RESUME_SIZE = 8 * 1024 * 1024
const allowedResumeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])
const requiredFields = [
  "fullName", "email", "phone", "cityProvince", "address", "position", "department", "employmentType", "startDate",
  "currentEmployer", "jobTitle", "experience", "education", "employmentHistory", "skills", "interest", "referenceName",
  "referenceCompany", "referencePosition", "referenceContact", "referenceRelationship", "consent",
] as const

const labelFor = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (character) => character.toUpperCase())

export async function POST(request: Request) {
  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ message: "Please submit the application form with your resume." }, { status: 400 })
  }

  const missing = requiredFields.filter((field) => !String(formData.get(field) ?? "").trim())
  const resume = formData.get("resume")

  if (missing.length > 0 || !(resume instanceof File)) {
    return NextResponse.json({ message: "Please complete all required fields and attach your resume." }, { status: 400 })
  }

  if (resume.size === 0 || resume.size > MAX_RESUME_SIZE || !allowedResumeTypes.has(resume.type)) {
    return NextResponse.json({ message: "Your resume must be a PDF, DOC, or DOCX file no larger than 8 MB." }, { status: 400 })
  }

  const smtpHost = process.env.CAREERS_SMTP_HOST
  const smtpUser = process.env.CAREERS_SMTP_USER
  const smtpPass = process.env.CAREERS_SMTP_PASS
  const recipient = process.env.CAREERS_APPLICATION_RECIPIENT

  if (!smtpHost || !smtpUser || !smtpPass || !recipient) {
    return NextResponse.json({ message: "Application delivery is temporarily unavailable. Please try again later." }, { status: 503 })
  }

  const text = [...requiredFields, "additionalInformation"].map((field) => `${labelFor(field)}: ${String(formData.get(field) ?? "").trim()}`).join("\n")

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.CAREERS_SMTP_PORT ?? 465),
      secure: process.env.CAREERS_SMTP_SECURE !== "false",
      auth: { user: smtpUser, pass: smtpPass },
    })

    await transporter.sendMail({
      from: process.env.CAREERS_SMTP_FROM ?? smtpUser,
      to: recipient,
      replyTo: String(formData.get("email")),
      subject: `Careers application: ${String(formData.get("position"))} — ${String(formData.get("fullName"))}`,
      text,
      attachments: [{ filename: resume.name, content: Buffer.from(await resume.arrayBuffer()), contentType: resume.type }],
    })
  } catch (error) {
    console.error("Unable to deliver careers application", error)
    return NextResponse.json({ message: "Application delivery is temporarily unavailable. Please try again later." }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
