import { Hero } from './Hero';
import { Services } from './Services';
import { Features } from './Features';

export function HomePage() {
  return (
    <main className="bg-white">
      <Hero />
      <Services />
      <Features />
    </main>
  );
}

