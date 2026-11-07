import { aboutDecor } from '../data/content'
import { AnimatedText } from './AnimatedText'
import { ContactButton } from './ContactButton'
import { FadeIn } from './FadeIn'

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
    >
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute left-[1%] top-[4%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]"
      >
        <img src={aboutDecor.moon} alt="" className="h-auto w-full" />
      </FadeIn>

      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute bottom-[8%] left-[3%] w-[90px] sm:left-[6%] sm:w-[120px] md:left-[10%] md:w-[160px]"
      >
        <img
          src={aboutDecor.rocket}
          alt=""
          className="h-auto w-full -rotate-12"
        />
      </FadeIn>

      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute right-[1%] top-[4%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]"
      >
        <img src={aboutDecor.lego} alt="" className="h-auto w-full" />
      </FadeIn>

      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]"
      >
        <img src={aboutDecor.group} alt="" className="h-auto w-full" />
      </FadeIn>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              Обо мне
            </h2>
          </FadeIn>

          <AnimatedText
            className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
            text="Победитель хакатонов. Собираю веб-сервисы, которые помогают бизнесу, стартапам и проектам расти онлайн. Делаю сильный сайт, удобный сервис и понятный путь до заявки: от первого экрана до записи или обращения. Беру задачу от идеи до готового продукта: продумываю структуру, интерфейс и логику, собираю рабочее решение и довожу его до запуска. Делаю живые демо, быстро вношу правки и отдаю финальную версию, которой реально удобно пользоваться. Слежу за тем, чтобы продукт выглядел уверенно, работал стабильно и помогал получать заявки, а не просто занимал место в портфолио."
          />
        </div>

        <div className="mt-32 sm:mt-36 md:mt-40" id="contact">
          <ContactButton href="#contact" label="Написать" />
        </div>
      </div>
    </section>
  )
}
