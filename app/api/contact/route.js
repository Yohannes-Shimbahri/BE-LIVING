import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, phone, service, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Be-Living Website <onboarding@resend.dev>',
      to: 'bersabel.og@gmail.com',
      replyTo: email,
      subject: `New enquiry from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0D0D0D;padding:28px 32px;text-align:center">
            <h1 style="color:#C9A84C;margin:0;font-size:24px">Be-Living</h1>
            <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:13px">New Website Enquiry</p>
          </div>
          <div style="padding:32px;background:#fff;border:1px solid #eee">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:700;width:120px;color:#333">Name</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#555">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:700;color:#333">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#555">${email}</td></tr>
              ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:700;color:#333">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#555">${phone}</td></tr>` : ''}
              ${service ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:700;color:#333">Service</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#555">${service}</td></tr>` : ''}
            </table>
            <div style="margin-top:24px">
              <p style="font-weight:700;color:#333;margin-bottom:8px">Message</p>
              <p style="color:#555;line-height:1.7;background:#f9f9f9;padding:16px;border-radius:6px">${message}</p>
            </div>
          </div>
          <div style="padding:20px 32px;background:#f9f9f9;text-align:center">
            <p style="color:#999;font-size:12px;margin:0">Sent from be-living.vercel.app</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log("RESEND SUCCESS:", data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}