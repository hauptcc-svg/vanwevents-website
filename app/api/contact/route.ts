import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEnquiryEmails } from "@/lib/email";
import { getDepositZAR } from "@/lib/cruises";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  cruiseInterest: z.string().min(1),
  cabinPreference: z.string().min(1),
  partySize: z.string().min(1),
  message: z.string().optional().default(""),
  paystackReference: z.string().min(1),
});

async function verifyPaystackPayment(
  reference: string
): Promise<{ verified: boolean; amount?: number }> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.warn("[Paystack] No secret key — skipping verification");
    return { verified: true };
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      console.error("[Paystack] Verify HTTP error:", res.status);
      return { verified: false };
    }

    const json = await res.json();
    const txn = json?.data;

    if (txn?.status === "success") {
      return { verified: true, amount: Math.round(txn.amount / 100) }; // kobo to ZAR
    }

    console.warn("[Paystack] Transaction not successful:", txn?.status);
    return { verified: false };
  } catch (err) {
    console.error("[Paystack] Verify fetch error:", err);
    return { verified: false };
  }
}

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

  const { paystackReference, ...formData } = parsed.data;

  // Verify the payment with Paystack
  const { verified, amount } = await verifyPaystackPayment(paystackReference);
  if (!verified) {
    return NextResponse.json(
      { error: "Payment could not be verified. Please contact support." },
      { status: 402 }
    );
  }

  const depositPaidZAR = amount ?? getDepositZAR(formData.cruiseInterest);

  // Skip email in dev without a real Resend key
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your_api_key_here") {
    console.log("[Contact API] Dev mode — skipping email");
    console.log("[Contact API] Form data:", formData);
    console.log("[Contact API] Paystack ref:", paystackReference, "| deposit:", depositPaidZAR);
    return NextResponse.json({ success: true, dev: true });
  }

  try {
    await sendEnquiryEmails({
      ...formData,
      paystackReference,
      depositPaidZAR,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact API] Email send error:", err);
    return NextResponse.json(
      { error: "Failed to send confirmation email. Please try again." },
      { status: 500 }
    );
  }
}
