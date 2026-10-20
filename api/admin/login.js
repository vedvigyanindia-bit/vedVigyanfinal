function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch {}
    }
    const { pin, password } = body || {};
    const validSecret = process.env.ADMIN_PIN || "vedvigyan2026";

    if ((pin && pin === validSecret) || (password && password === validSecret)) {
      return sendJson(res, 200, { success: true, token: "vv_admin_authorized" });
    }

    return sendJson(res, 401, { error: "Invalid Admin PIN / Password" });
  } catch (err) {
    return sendJson(res, 500, { error: err.message });
  }
};
