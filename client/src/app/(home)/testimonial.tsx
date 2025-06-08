import { Star } from "lucide-react";
import React from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    text: "Best socks I've ever owned! The comfort and quality are unmatched.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "Mike Chen",
    text: "Perfect for my daily runs. They stay comfortable all day long.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    name: "Emily Davis",
    text: "Love the variety of patterns and colors. Great quality materials!",
    rating: 5,
    image:
      "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Join thousands of satisfied customers who have made the switch to
            premium comfort.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-3xl bg-white p-8 shadow-lg transition-transform duration-300 hover:scale-105"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-6xl text-gray-100 transition group-hover:text-green-100">
                “
              </div>

              {/* User Info */}
              <div className="mb-5 flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="ring-primary h-12 w-12 rounded-full object-cover ring-2"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <div className="mt-1 flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 animate-pulse fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Text */}
              <p className="leading-relaxed text-gray-600 italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
