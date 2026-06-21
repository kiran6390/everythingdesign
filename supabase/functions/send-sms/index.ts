// Supabase "Send SMS" Auth Hook → delivers the OTP via MSG91 (India + DLT).
// Supabase generates & verifies the OTP; this function only sends the SMS.
//
// Deploy:  supabase functions deploy send-sms --no-verify-jwt
// Secrets: supabase secrets set MSG91_AUTHKEY=... MSG91_TEMPLATE_ID=... SEND_SMS_HOOK_SECRET="v1,whsec_..."
// Then: Dashboard → Authentication → Hooks → enable "Send SMS hook" → point to this function.

import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

Deno.serve(async (req) => {
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  // 1) Verify the request really came from Supabase (recommended)
  const hookSecret = Deno.env.get("SEND_SMS_HOOK_SECRET");
  if (hookSecret) {
    try {
      const base64 = hookSecret.replace("v1,whsec_", "");
      new Webhook(base64).verify(payload, headers);
    } catch {
      return new Response(JSON.stringify({ error: "invalid signature" }), { status: 401, headers: { "content-type": "application/json" } });
    }
  }

  // 2) Pull the phone + the OTP Supabase generated
  const { user, sms } = JSON.parse(payload) as { user: { phone: string }; sms: { otp: string } };
  const mobiles = user.phone.replace(/\D/g, ""); // e.g. "919876543210"
  const otp = sms.otp;

  // 3) Send via MSG91 OTP API — pass Supabase's own code into your OTP template.
  //    (Supabase still verifies it via verifyOtp; MSG91 only delivers the SMS.)
  const url = new URL("https://control.msg91.com/api/v5/otp");
  url.searchParams.set("template_id", Deno.env.get("MSG91_TEMPLATE_ID") ?? "");
  url.searchParams.set("mobile", mobiles); // 91XXXXXXXXXX
  url.searchParams.set("otp", otp);        // use Supabase's code, not MSG91's

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      authkey: Deno.env.get("MSG91_AUTHKEY") ?? "",
      "Content-Type": "application/json",
      accept: "application/json",
    },
  });

  const body = await res.json().catch(() => ({}));
  // MSG91 returns { type: "success" | "error", message }
  if (!res.ok || body?.type === "error") {
    return new Response(JSON.stringify({ error: `MSG91 send failed: ${JSON.stringify(body)}` }), { status: 500, headers: { "content-type": "application/json" } });
  }

  return new Response(JSON.stringify({}), { headers: { "content-type": "application/json" } });
});
