import NavigationBar from "./navigation-bar";
import HeroSection from "./hero";
import FeatureSection from "./feature";
import ProductsSection from "./product";
import Testimonials from "./testimonial";
import About from "./about";
import Footer from "./footer";

function App() {
  return (
    <div className="min-h-screen bg-green-50">
      <HeroSection />
      <FeatureSection />
      <ProductsSection />
      <Testimonials />
      <About />
      <Footer />
    </div>
  );
}

export default App;
