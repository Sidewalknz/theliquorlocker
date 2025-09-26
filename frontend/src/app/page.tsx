import Hero from '@/components/Hero';
import Discover from '@/components/Discover';
import WaveDivider from '@/components/WaveDivider';
import FeaturedProducts from '@/components/FeaturedProducts';

export default function HomePage() {
  return (
    <>
      <Hero />
      <WaveDivider flip height={100} />
      <Discover />
      <WaveDivider height={100} />
      <FeaturedProducts />  
    </>
  );
}
