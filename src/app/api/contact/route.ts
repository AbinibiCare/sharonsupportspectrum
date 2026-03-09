import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  await resend.emails.send({
    from: "Sharon Support Spectrum <info@sharonsupportspectrum.com.au>",
    to: ["info@sharonsupportspectrum.com.au"],
    subject: `Website Enquiry from ${body.name}`,
    html: `
      <h2>New Website Enquiry</h2>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Phone:</strong> ${body.phone}</p>
      <p><strong>Message:</strong></p>
      <p>${body.message}</p>
    `,
  });

  return Response.json({ ok: true });
}