import Hero from '@/components/Hero';
import Discover from '@/components/Discover';
import WaveDivider from '@/components/WaveDivider';

export default function HomePage() {
  return (
    <>
      <Hero />
      <WaveDivider flip height={100} />
      <Discover />
    </>
  );
}
