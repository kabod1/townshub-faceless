import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, role, inviterName, inviterEmail } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: "email and role are required" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://faceless.townshub.com";

    // Use Resend if configured, otherwise fall back to a mailto-style confirmation
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Townshub <noreply@townshub.com>",
          to: [email],
          subject: `${inviterName || "Someone"} invited you to Townshub`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#080D1A;font-family:'Inter',sans-serif;color:#E8F0FF;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0F1828;border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <tr><td style="padding:28px 32px;background:linear-gradient(135deg,rgba(0,212,255,0.12),rgba(0,128,204,0.06));border-bottom:1px solid rgba(255,255,255,0.06);">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <div style="display:inline-block;width:38px;height:38px;background:#fff;border-radius:10px;text-align:center;line-height:38px;margin-right:12px;vertical-align:middle;">
                <img src="${appUrl}/logo.svg" width="28" height="28" alt="TH" style="vertical-align:middle;" />
              </div>
              <span style="font-size:16px;font-weight:800;color:#fff;vertical-align:middle;letter-spacing:-0.3px;">Townshub</span>
            </td>
            <td align="right">
              <span style="font-size:10px;font-weight:700;color:#00D4FF;letter-spacing:0.12em;text-transform:uppercase;">VIDEO STUDIO</span>
            </td>
          </tr></table>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 32px 24px;">
          <p style="font-size:22px;font-weight:800;color:#fff;margin:0 0 10px;letter-spacing:-0.5px;">You&rsquo;ve been invited</p>
          <p style="font-size:14px;color:#94a3b8;margin:0 0 24px;line-height:1.6;">
            <strong style="color:#e2e8f0;">${inviterName || inviterEmail}</strong> has invited you to join their Townshub workspace as an
            <strong style="color:#00D4FF;">${role.charAt(0).toUpperCase() + role.slice(1)}</strong>.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="background:linear-gradient(135deg,rgba(0,212,255,0.1),rgba(0,128,204,0.06));border:1px solid rgba(0,212,255,0.2);border-radius:12px;padding:16px 20px;">
              <p style="font-size:12px;font-weight:700;color:#00D4FF;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px;">Your role</p>
              <p style="font-size:14px;color:#e2e8f0;margin:0;">${role.charAt(0).toUpperCase() + role.slice(1)}</p>
            </td></tr>
          </table>
          <a href="${appUrl}/login" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#00D4FF,#0080cc);color:#04080F;font-size:14px;font-weight:800;border-radius:11px;text-decoration:none;">Accept Invitation &rarr;</a>
          <p style="font-size:12px;color:#475569;margin:20px 0 0;line-height:1.6;">
            Sign in or create an account using this email address (<strong>${email}</strong>) to accept the invitation.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="font-size:11px;color:#475569;margin:0;">Townshub Faceless Video Studio &bull; <a href="${appUrl}" style="color:#475569;">${appUrl.replace("https://","")}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Resend error:", err);
        // Don't fail the whole request — log and continue
        return NextResponse.json({ success: true, emailSent: false, note: "Invite recorded. Email delivery unavailable." });
      }

      return NextResponse.json({ success: true, emailSent: true });
    }

    // No Resend key — still succeed (invite is tracked in UI)
    return NextResponse.json({ success: true, emailSent: false, note: "Invite recorded. Add RESEND_API_KEY to send real emails." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
