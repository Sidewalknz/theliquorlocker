import Hero from '@/components/Hero';
import Discover from '@/components/Discover';
import WaveDivider from '@/components/WaveDivider';
import FeaturedProducts from '@/components/FeaturedProducts';
import About from '@/components/About';
import WorkTogether from '@/components/WorkTogether';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Hero />
      <WaveDivider flip height={100} />
      <About />
      <WaveDivider height={100} />
      <FeaturedProducts />  
      <WaveDivider flip height={100} />
      <Discover />
      <WaveDivider height={100} />
      <WorkTogether />
      <WaveDivider flip height={100} color="var(--foreground)" />
      <Footer />
    </>
  );
}
