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

    // Get the start and end of the current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1); // Set to the first day of the current month
  startOfMonth.setHours(0, 0, 0, 0); // Set hours to 00:00:00 for accurate comparison

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Set to the first day of next month
  endOfMonth.setHours(0, 0, 0, 0); // Set hours to 00:00:00

  // Get total amount of completed payments for the current month
  const monthlyTotalAmount = await Payment.aggregate([
    {
      $match: {
        status: "Completed",
        createdAt: { $gte: startOfMonth, $lt: endOfMonth } // Filter for current month
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" }
      }
    }
  ]);

  const monthlyTotal = monthlyTotalAmount.length > 0 ? monthlyTotalAmount[0].totalAmount : 0;

    res.status(200).json({ totalAmount: total, monthlyTotal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getChartData = async (req, res) => {
  try {
    const monthlyData = await Payment.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  
    const formattedMonthlyData = monthlyData.map(data => {
      const date = new Date(data._id);
      const utcMonth = date.getUTCMonth();
      const month = new Date(Date.UTC(date.getUTCFullYear(), utcMonth+1)).toLocaleString('default', { month: 'long' });
    
      return { month, totalSales: data.totalSales };
    });
  
    res.status(200).json({ monthlyData: formattedMonthlyData });
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
  getChartData
};
