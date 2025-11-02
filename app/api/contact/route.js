export async function POST(req) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
    });
  }

  console.log("New message received:", { name, email, message });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
