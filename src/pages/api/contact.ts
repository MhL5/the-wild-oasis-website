import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({
      success: false,
      message: "Method is not allowed, please send a post request",
    });

  const { fullName, email, subject, message } = JSON.parse(req.body);
  if (!fullName || !email || !subject || !message)
    return res.status(400).json({
      success: false,
      message: "fullName, email, subject, message are required",
    });

  const contactData = { fullName, email, subject, message };
  const { error } = await supabase.from("contact").insert([contactData]);

  if (error)
    return res.status(500).json({
      success: false,
      message: "Could not send your message, please try again",
    });

  return res.status(200).json({
    success: true,
    message: "thanks for your message, we will contact you soon",
  });
}
