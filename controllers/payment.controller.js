import Payment from "../models/payment.model.js";

const getPayments = async (req, res) => {
  try {
    const paymentList = await Payment.find().sort({
        createdAt: -1,
      });
    res.status(200).json(paymentList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getstatistics = async (req, res) => {
  try {
    const paymentCount = await Payment.countDocuments();
    res.status(200).json({paymentCount: paymentCount});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: "payment not found" });
    }

    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export {
  getPayments,
  getstatistics,
  getPayment,
};
