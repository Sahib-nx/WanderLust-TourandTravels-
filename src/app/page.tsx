import { HeroSection } from '../Pages/Hero'
import { Newsletter, StatsSection, Testimonials } from '@/types'


export default function HomePage() {
  return (
    <main className="relative">
      <HeroSection />


      <Testimonials />

      <StatsSection />

      <Newsletter />
    </main>
  )
}