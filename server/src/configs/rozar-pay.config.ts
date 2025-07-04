import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface ReceiptOptions {
  amount: number;
  currency: "INR";
  receipt?: string;
  payment_capture?: boolean;
  notes?: Record<string, string>;
}

export const getOptions = (
  amount: number,
  currency: "INR" = "INR",
  receipt?: string
): ReceiptOptions => ({
  amount: amount * 100,
  currency,
  receipt,
  payment_capture: true,
});
