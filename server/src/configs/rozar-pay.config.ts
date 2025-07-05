import Razorpay from "razorpay";

export interface ReceiptOptions {
  amount: number;
  currency: "INR";
  receipt?: string;
  payment_capture?: boolean;
  notes?: Record<string, string>;
  partial_payment?: boolean;
  first_payment_min_amount?: number;
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const getOptions = (
  amount: number,
  currency: "INR" = "INR",
  receipt?: string,
  notes?: Record<string, string>
): ReceiptOptions => ({
  amount: amount * 100,
  currency,
  receipt: receipt || `receipt_${Date.now()}`,
  payment_capture: true,
  notes: notes || {},
});
