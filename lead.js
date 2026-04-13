// SE GLOBAL — Lead Capture API (Vercel Serverless)

export default async function handler(req, res) {
  // ─────────────────────────────
  // METHOD GUARD
  // ─────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    // ─────────────────────────────
    // PARSE INPUT
    // ─────────────────────────────
    const {
      name = "",
      email = "",
      service = "",
      message = "",
      source = "unknown",
      time
    } = req.body || {};

    // ─────────────────────────────
    // BASIC VALIDATION
    // ─────────────────────────────
    if (!name.trim()) {
      return res.status(400).json({
        success: false,
        error: "Name is required"
      });
    }

    if (!email.trim() || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        error: "Valid email is required"
      });
    }

    // ─────────────────────────────
    // NORMALIZE DATA
    // ─────────────────────────────
    const lead = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service: service.trim(),
      message: message.trim(),
      source,
      time: time || new Date().toISOString(),
      ip:
        req.headers["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        "unknown",
      userAgent: req.headers["user-agent"] || "unknown"
    };

    // ─────────────────────────────
    // LOG (VISIBLE IN VERCEL DASHBOARD)
    // ─────────────────────────────
    console.log("NEW_LEAD_CAPTURED", JSON.stringify(lead, null, 2));

    // ─────────────────────────────
    // RESPONSE
    // ─────────────────────────────
    return res.status(200).json({
      success: true,
      message: "Lead captured successfully",
      data: {
        name: lead.name,
        email: lead.email
      }
    });

  } catch (error) {
    // ─────────────────────────────
    // ERROR HANDLING
    // ─────────────────────────────
    console.error("LEAD_API_ERROR", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}