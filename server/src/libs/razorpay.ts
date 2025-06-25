import Razorpay from "razorpay";

class RazorpayServer {
  private static instance: Razorpay;

  public static getInstance(): Razorpay {
    if (!this.instance) {
      this.instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });
    }

    return this.instance;
  }
}
