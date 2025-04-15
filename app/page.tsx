import Category from "@/page/Category";
import FeaturedJobs from "@/page/FeaturedJobs";
import HeroSection from "@/page/HeroSection";
import dynamic from "next/dynamic";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Category />
      <FeaturedJobs />
    </div>
  );
}
