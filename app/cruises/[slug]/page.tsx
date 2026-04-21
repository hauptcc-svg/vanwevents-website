import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingPage from "@/components/BookingPage";
import { getCruiseBySlug } from "@/lib/cruises";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cruise = getCruiseBySlug(slug);
  if (!cruise) return {};
  return {
    title: `${cruise.name} – Book Now | VanWEvents`,
    description: cruise.blurb,
  };
}

export default async function CruisePage({ params }: Props) {
  const { slug } = await params;
  const cruise = getCruiseBySlug(slug);
  if (!cruise) notFound();

  return (
    <main>
      <Navigation />
      <BookingPage cruise={cruise} />
      <Footer />
    </main>
  );
}
