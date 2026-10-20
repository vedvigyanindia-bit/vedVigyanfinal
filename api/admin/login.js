module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { pin, password } = req.body || {};
    const validSecret = process.env.ADMIN_PIN || "vedvigyan2026";

    if ((pin && pin === validSecret) || (password && password === validSecret)) {
      return res.status(200).json({ success: true, token: "vv_admin_authorized" });
    }

    return res.status(401).json({ error: "Invalid Admin PIN / Password" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
