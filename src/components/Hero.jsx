import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
        Your AI-Powered Partner for Smarter, Faster, and More Effective Studying!
      </h1>
      <Button className="mt-8" size="lg">
        Get Start
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

