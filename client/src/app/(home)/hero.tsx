import AppImages from "@/constants/images";
import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <section className="pt-16">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Text Content */}
          <div className="flex h-[40rem] flex-col justify-center">
            <div className="text-center lg:text-left">
              <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 lg:text-5xl">
                Walk Through Life With
                <span className="text-primary block">Elegance Beneath</span>
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-gray-600">
                Where luxury meets comfort - premium socks crafted from the
                finest organic cottons and sustainable materials. Elevate every
                step with timeless designs that pamper your feet.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <button className="focus:ring-opacity-50 bg-primary transform rounded-full px-8 py-4 text-lg font-semibold text-black shadow-lg transition-all hover:scale-105 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none">
                  Discover Your Perfect Pair
                </button>
                <button className="focus:ring-opacity-50 rounded-full border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-green-600 hover:text-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none">
                  Our Craftsmanship
                </button>
              </div>

              {/* Stats */}
              <div className="mt-12 flex items-center justify-center space-x-8 lg:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Happy Feet</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                  <div className="text-sm text-gray-600">Star Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Eco-Friendly</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image Poster */}
          <div className="relative h-[40rem] place-items-center">
            <div className="center relative h-full w-full">
              <Image
                src={AppImages.poster}
                alt="Luxury Socks Collection"
                height={460}
                width={560}
                className="rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Decorative Circles */}
            <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-green-100 opacity-30 mix-blend-multiply blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 h-64 w-64 rounded-full bg-emerald-100 opacity-30 mix-blend-multiply blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
