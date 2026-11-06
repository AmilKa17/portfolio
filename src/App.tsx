import { AboutSection } from './components/AboutSection'
import { HeroSection } from './components/HeroSection'
import { MarqueeSection } from './components/MarqueeSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ServicesSection } from './components/ServicesSection'
import { SmoothScroll } from './components/SmoothScroll'

export default function App() {
  return (
    <div style={{ overflowX: 'clip', background: '#0C0C0C' }}>
      <SmoothScroll />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </div>
  )
}
