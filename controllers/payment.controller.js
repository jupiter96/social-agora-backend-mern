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
    const totalAmount = await Payment.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);

    const total = totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;

    res.status(200).json({ totalAmount: total });
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
