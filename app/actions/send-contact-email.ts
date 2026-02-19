'use server'

import { z } from 'zod'
import nodemailer from 'nodemailer'
import { headers } from 'next/headers'
import { getAdminEmailTemplate } from './email-template-admin'
import { getSenderEmailTemplate } from './email-template-sender'

// ── Validation schema ────────────────────────────────────────────────────────
const contactSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name is too long')
        .regex(/^[a-zA-Z\s\-']+$/, 'Name contains invalid characters'),
    email: z
        .string()
        .email('Invalid email address')
        .max(255, 'Email is too long'),
    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(5000, 'Message is too long'),
})

type ContactFormData = z.infer<typeof contactSchema>

// ── Rate limiting (in-memory) ────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 3 // 3 submissions per hour per IP

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (!record || now > record.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
        return { allowed: true, remaining: MAX_REQUESTS - 1 }
    }

    if (record.count >= MAX_REQUESTS) {
        return { allowed: false, remaining: 0 }
    }

    record.count++
    return { allowed: true, remaining: MAX_REQUESTS - record.count }
}

// ── Spam detection (basic honeypot + timing) ─────────────────────────────────
function detectSpam(data: ContactFormData, metadata: { timing?: number }): boolean {
    const { name, email, message } = data

    // Too fast (< 3 seconds = likely bot)
    if (metadata.timing && metadata.timing < 3000) return true

    // Excessive links
    const linkCount = (message.match(/https?:\/\//gi) || []).length
    if (linkCount > 2) return true

    // Common spam keywords
    const spamKeywords = ['crypto', 'investment', 'bitcoin', 'viagra', 'casino', 'loan']
    const lowerMessage = message.toLowerCase()
    if (spamKeywords.some(kw => lowerMessage.includes(kw))) return true

    // Gibberish name check (too many consonants in a row)
    if (/[bcdfghjklmnpqrstvwxyz]{7,}/i.test(name)) return true

    return false
}

// ── SMTP Transporter ─────────────────────────────────────────────────────────
function createTransporter() {
    // IMPORTANT: Replace with your SMTP credentials
    // Recommended: Use environment variables
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || 'your-email@gmail.com',
            pass: process.env.SMTP_PASS || 'your-app-password',
        },
    })
}

// ── Main action ──────────────────────────────────────────────────────────────
export async function sendContactEmail(
    data: ContactFormData,
    metadata?: { timing?: number }
) {
    try {
        // 1. Validate input
        const validatedData = contactSchema.parse(data)

        // 2. Get client IP and user agent
        const headersList = await headers()
        const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
        const userAgent = headersList.get('user-agent') || 'unknown'

        // 3. Rate limiting
        const { allowed, remaining } = checkRateLimit(ip)
        if (!allowed) {
            return {
                success: false,
                error: 'Too many requests. Please try again later.',
                code: 'RATE_LIMIT_EXCEEDED',
            }
        }

        // 4. Spam detection
        if (detectSpam(validatedData, metadata || {})) {
            console.warn('[SPAM DETECTED]', { ip, data: validatedData })
            // Return success to not tip off bots, but don't actually send
            return { success: true }
        }

        // 5. Create transporter
        const transporter = createTransporter()

        // 6. Prepare email data
        const { name, email, message } = validatedData
        const timestamp = new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'long',
        })

        // 7. Send email to admin (you)
        const adminEmail = process.env.ADMIN_EMAIL || 'mbilalsheikh2001@gmail.com'
        await transporter.sendMail({
            from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            subject: `📩 New message from ${name}`,
            html: getAdminEmailTemplate({
                name,
                email,
                message,
                timestamp,
                userAgent,
                ipAddress: ip,
            }),
            replyTo: email,
        })

        // 8. Send confirmation email to sender
        await transporter.sendMail({
            from: `"Mohammed Bilal Sheikh" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Thanks for reaching out, ${name.split(' ')[0]}! 👋`,
            html: getSenderEmailTemplate({ name }),
        })

        // 9. Log success
        console.log('[EMAIL SENT]', { to: adminEmail, from: email, remaining })

        return {
            success: true,
            remaining,
        }

    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0].message,
                code: 'VALIDATION_ERROR',
            }
        }

        // Handle SMTP errors
        if (error instanceof Error) {
            console.error('[EMAIL ERROR]', error)
            return {
                success: false,
                error: 'Failed to send message. Please try again or email directly.',
                code: 'SMTP_ERROR',
            }
        }

        // Unexpected errors
        console.error('[UNEXPECTED ERROR]', error)
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.',
            code: 'UNKNOWN_ERROR',
        }
    }
}