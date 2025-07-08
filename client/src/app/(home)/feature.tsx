import { Heart, Shield, Truck, Zap, CheckCircle } from "lucide-react";
import React from "react";

const FeatureSection = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Zap className="h-4 w-4" />
            Premium Quality
          </span>
          <h2 className="mb-5 text-4xl font-bold text-gray-900 md:text-5xl">
            Why Choose <span className="text-primary">SockCo</span>?
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 md:text-2xl md:leading-relaxed">
            We're committed to providing the highest quality socks with
            unmatched comfort and style that your feet deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-green-100">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-green-100 opacity-20 transition-all duration-500 group-hover:scale-150"></div>
            <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 to-red-50 shadow-md">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="relative z-10 mb-4 text-2xl font-bold text-gray-900">
              Premium Comfort
            </h3>
            <p className="relative z-10 text-gray-600">
              Crafted with the finest materials for all-day comfort that your
              feet will absolutely love and cherish.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {["Bamboo", "Organic Cotton", "Breathable"].map((item) => (
                <span
                  key={item}
                  className="flex items-center text-sm font-medium whitespace-nowrap text-green-600"
                >
                  <CheckCircle className="mr-1 h-4 w-4" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-green-100">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-green-100 opacity-20 transition-all duration-500 group-hover:scale-150"></div>
            <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 shadow-md">
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="relative z-10 mb-4 text-2xl font-bold text-gray-900">
              Built to Last
            </h3>
            <p className="relative z-10 text-gray-600">
              Reinforced construction with premium materials ensures your socks
              stand the test of time and wear.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {["Double-Stitched", "Reinforced Heel", "Anti-Pilling"].map(
                (item) => (
                  <span
                    key={item}
                    className="flex items-center text-sm font-medium whitespace-nowrap text-green-600"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" /> {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-green-100">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-green-100 opacity-20 transition-all duration-500 group-hover:scale-150"></div>
            <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-green-50 shadow-md">
              <Truck className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="relative z-10 mb-4 text-2xl font-bold text-gray-900">
              Fast & Free Shipping
            </h3>
            <p className="relative z-10 text-gray-600">
              Free shipping on orders over $50 with fast, reliable delivery
              right to your doorstep within 2-3 days.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {["Free Returns", "Carbon Neutral", "24/7 Support"].map(
                (item) => (
                  <span
                    key={item}
                    className="flex items-center text-sm font-medium whitespace-nowrap text-green-600"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" /> {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
