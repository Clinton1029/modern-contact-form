import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
      });
    }

    // ✅ Use STARTTLS on port 587 instead of SSL (465)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📩 New Contact Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", { name, email });

    return new Response(JSON.stringify({ success: true, message: "Email sent!" }), { status: 200 });
  } catch (error) {
    console.error("❌ Email send error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to send email" }), { status: 500 });
  }
}
