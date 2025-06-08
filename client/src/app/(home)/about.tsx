import { Heart, Shield, Users } from "lucide-react";
import React from "react";

const About = () => {
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Text Content */}
          <div>
            <h2 className="mb-6 text-4xl font-bold text-black">Our Story</h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              Founded in 2020, SockCo was born from a simple idea: everyone
              deserves comfortable, high-quality socks that don't compromise on
              style. We partner with sustainable manufacturers to create socks
              that are good for your feet and good for the planet.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              From our premium cotton blends to our innovative moisture-wicking
              athletic line, every pair is designed with attention to detail and
              a commitment to excellence.
            </p>

            {/* Icon Highlights */}
            <div className="flex items-center space-x-10">
              <div className="text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                <div className="text-sm text-gray-600">Team of 25+</div>
              </div>
              <div className="text-center">
                <Heart className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                <div className="text-sm text-gray-600">Made with Love</div>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                <div className="text-sm text-gray-600">Quality Guaranteed</div>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/7679725/pexels-photo-7679725.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Our Workshop"
              className="h-96 w-full rounded-3xl object-cover shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
