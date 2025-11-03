import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // ✅ Validate input
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
      });
    }

    // ✅ Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Email to YOU (admin)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to yourself
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333; background: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 30px;">
            <h2 style="color: #007bff; text-align: center;">New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p style="margin-top: 20px;"><strong>Message:</strong></p>
            <p style="background: #f1f1f1; padding: 15px; border-radius: 8px;">${message}</p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 14px; color: #888; text-align: center;">This email was sent via your contact form.</p>
          </div>
        </div>
      `,
    };

    // ✅ Auto-reply to the user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // send to the user's email
      subject: `🤝 Thank you for contacting us!`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333; background: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 30px;">
            <h2 style="color: #007bff; text-align: center;">Thank You, ${name}!</h2>
            <p>We’ve received your message and our team will get back to you soon.</p>
            <p>Here’s a copy of your message:</p>
            <blockquote style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; border-radius: 8px;">
              ${message}
            </blockquote>
            <p style="margin-top: 20px;">Best regards,<br><strong>The Support Team</strong></p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 13px; color: #888; text-align: center;">Please do not reply to this automated email.</p>
          </div>
        </div>
      `,
    };

    // ✅ Send both emails (admin first, then user)
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    console.log("✅ Emails sent successfully:", { name, email });

    // ✅ Response back to frontend
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully! We'll get back to you shortly.",
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Email send error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500 }
    );
  }
}
