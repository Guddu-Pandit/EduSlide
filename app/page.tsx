import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import HowItWorks from "./components/landing/HowItWorks";
import Features from "./components/landing/Features";
import Security from "./components/landing/Security";
import CtaStrip from "./components/landing/CtaStrip";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-surface-3 text-text-strong">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Security />
      <CtaStrip />
      <Footer />
    </div>
  );
}
