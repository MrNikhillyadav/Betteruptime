import { NavLandingPage } from './NavLandingPage';
import { HeroSection } from './HeroSection';
import { Footer } from './Footer';

export function LandingPage() {

  return (
    <div className={`min-h-screen bg-[#171717] text-gray-100  `}>
        <NavLandingPage/>
        <HeroSection/>
        <Footer/>
    </div>
  );
}

