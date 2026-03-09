import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function nl2br(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const enquiryType = String(body?.enquiryType || "General Enquiry").trim();
    const message = String(body?.message || "").trim();
    const serviceArea = String(body?.serviceArea || "").trim();

    if (!name || !email || !message) {
      return Response.json(
        {
          ok: false,
          error: "Name, email, and message are required.",
        },
        { status: 400 }
      );
    }

    let subject = `Website Enquiry from ${name}`;
    let heading = "New Website Enquiry";

    if (enquiryType === "Support Coordinator Referral") {
      subject = `New Support Coordinator Referral - ${name}`;
      heading = "New Support Coordinator Referral";
    } else if (enquiryType === "Facility Staffing Request") {
      subject = `New Facility Staffing Request - ${name}`;
      heading = "New Facility Staffing Request";
    } else if (enquiryType === "NDIS Intake Form") {
      subject = `New NDIS Intake Form - ${name}`;
      heading = "New NDIS Intake Form";
    } else if (enquiryType === "Aged Care Labour Hire (PCA Only)") {
      subject = `New PCA Labour Hire Enquiry - ${name}`;
      heading = "New PCA Labour Hire Enquiry";
    } else if (enquiryType === "Employment / Join Our Team") {
      subject = `New Job Enquiry - ${name}`;
      heading = "New Employment Enquiry";
    } else if (enquiryType === "NDIS Services") {
      subject = `New NDIS Services Enquiry - ${name}`;
      heading = "New NDIS Services Enquiry";
    }

    const emailResult = await resend.emails.send({
      from: "Sharon Support Spectrum <info@sharonsupportspectrum.com.au>",
      to: [
        "info@sharonsupportspectrum.com.au",
        "info@sharonsupportservices.services",
      ],
      reply_to: email, subject,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 16px;">${escapeHtml(heading)}</h2>

          <table style="border-collapse: collapse; width: 100%; max-width: 700px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 700; width: 180px;">Name</td>
              <td style="padding: 8px 0;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Email</td>
              <td style="padding: 8px 0;">${escapeHtml(email)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Phone</td>
              <td style="padding: 8px 0;">${escapeHtml(phone || "-")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Enquiry Type</td>
              <td style="padding: 8px 0;">${escapeHtml(enquiryType)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 700;">Service Area</td>
              <td style="padding: 8px 0;">${escapeHtml(serviceArea || "-")}</td>
            </tr>
          </table>

          <div style="margin-top: 24px;">
            <div style="font-weight: 700; margin-bottom: 8px;">Message</div>
            <div style="padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px;">
              ${nl2br(message)}
            </div>
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
            Sent from the Sharon Support Spectrum website contact system.
          </p>
        </div>
      `,
    });

    if ((emailResult as { error?: { message?: string } })?.error) {
      return Response.json(
        {
          ok: false,
          error: emailResult.error?.message || "Failed to send email.",
        },
        { status: 500 }
      );
    }

    const { error: dbError } = await supabaseAdmin.from("crm_leads").insert({
      name,
      email,
      phone,
      enquiry_type: enquiryType,
      service_area: serviceArea,
      message,
      status: "new",
      source: "website",
    });

    if (dbError) {
      console.error("Supabase lead insert error:", dbError);
      return Response.json(
        {
          ok: false,
          error: "Email sent, but CRM logging failed.",
        },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);

    return Response.json(
      {
        ok: false,
        error: "Something went wrong while sending your message.",
      },
      { status: 500 }
    );
  }
}