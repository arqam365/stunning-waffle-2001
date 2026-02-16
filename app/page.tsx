import { Navigation } from '@/components/Navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { HeroSection } from '@/components/sections/HeroSection'
import { PhilosophySection } from '@/components/sections/PhilosophySection'
import { MetricsSection } from '@/components/sections/MetricsSection'
import { SystemsSection } from '@/components/sections/SystemsSection'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { ContributionSection } from '@/components/sections/ContributionSection'
import { ContactSection } from '@/components/sections/ContactSection'

export default function Page() {
  return (
    <>
      <Navigation />
      <ThemeToggle />
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <HeroSection />
        <PhilosophySection />
        <MetricsSection />
        <SystemsSection />
        <TimelineSection />
        <ContributionSection />
        <ContactSection />
      </main>
    </>
  )
}
