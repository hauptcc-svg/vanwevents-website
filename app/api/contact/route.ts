import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEnquiryEmails } from "@/lib/email";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  cruiseInterest: z.string().min(1),
  cabinPreference: z.string().min(1),
  partySize: z.string().min(1),
  message: z.string().optional().default(""),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // In development without a real Resend key, skip sending
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your_api_key_here") {
    console.log("[Contact API] No real Resend key — skipping email, returning success");
    console.log("[Contact API] Form data:", parsed.data);
    return NextResponse.json({ success: true, dev: true });
  }

  try {
    await sendEnquiryEmails(parsed.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact API] Email send error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
