import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import AboutBlurb from "@/components/AboutBlurb";
import FeaturedCruises from "@/components/FeaturedCruises";
import WhyBookWithUs from "@/components/WhyBookWithUs";
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <Hero />
      <AboutBlurb />
      <FeaturedCruises />
      <WhyBookWithUs />
      <EnquiryForm />
      <Footer />
    </main>
  );
}
