import { services } from '../data/content'
import { FadeIn } from './FadeIn'

export function ServicesSection() {
  return (
    <section
      id="services"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <h2
        className="mb-16 text-center font-black uppercase text-[#0C0C0C] sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Услуги
      </h2>

      <div className="mx-auto w-full max-w-5xl">
        {services.map((item, index) => (
          <FadeIn
            key={item.n}
            delay={index * 0.1}
            className="border-b border-[rgba(12,12,12,0.15)] py-8 first:border-t sm:py-10 md:py-12"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8 md:gap-12">
              <span
                className="shrink-0 font-black leading-none text-[#0C0C0C]"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {item.n}
              </span>
              <div className="pt-2 sm:pt-4 md:pt-6">
                <h3
                  className="mb-3 font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed text-[#0C0C0C] opacity-60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {item.text}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
