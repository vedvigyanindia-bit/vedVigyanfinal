const shiprocketService = require("../../backend/src/services/shiprocketService");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const pincode = req.query.pincode;
    const weight = Number(req.query.weight || 0.5);
    const isCod = req.query.isCod === "true" || req.query.isCod === "1";

    if (!pincode || !/^\d{6}$/.test(pincode.trim())) {
      return res.status(400).json({ serviceable: false, message: "Valid 6-digit Indian Pincode is required" });
    }

    const result = await shiprocketService.checkPincodeServiceability(pincode.trim(), weight, isCod);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ serviceable: false, message: error.message || "Pincode serviceability check failed" });
  }
};
