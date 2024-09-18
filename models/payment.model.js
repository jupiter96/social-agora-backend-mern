import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
