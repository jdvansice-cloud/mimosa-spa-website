import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { HeroSection } from '@/components/home/HeroSection'
import { MenuSection } from '@/components/home/MenuSection'
import { PromotionsSection } from '@/components/home/PromotionsSection'
import { AboutSection } from '@/components/home/AboutSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MenuSection />
        <PromotionsSection />
        <AboutSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
