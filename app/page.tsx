import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedCruises from "@/components/FeaturedCruises";
import WhyBookWithUs from "@/components/WhyBookWithUs";
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <Hero />
      <FeaturedCruises />
      <WhyBookWithUs />
      <EnquiryForm />
      <Footer />
    </main>
  );
}
