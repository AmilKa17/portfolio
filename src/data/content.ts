export type MarqueeItem = {
  src: string
  poster?: string
  kind: 'video' | 'image'
  title: string
}

const assetPath = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

/** Videos only once; rest are stills so the reel stays smooth. */
export const marqueeItems: MarqueeItem[] = [
  {
    kind: 'video',
    src: assetPath('shots/marquee/beta.mp4'),
    poster: assetPath('shots/marquee/beta.png'),
    title: 'Beta Site',
  },
  {
    kind: 'image',
    src: assetPath('shots/marquee/doris.png'),
    title: 'Doris',
  },
  {
    kind: 'video',
    src: assetPath('shots/marquee/fizmat.webm'),
    poster: assetPath('shots/marquee/fizmat.png'),
    title: 'ФизМатХаб',
  },
  {
    kind: 'image',
    src: assetPath('shots/marquee/trudo.png'),
    title: 'Трудозатраты',
  },
  {
    kind: 'video',
    src: assetPath('shots/marquee/stickman.mp4'),
    poster: assetPath('shots/marquee/stickman.png'),
    title: 'Stickman',
  },
  {
    kind: 'image',
    src: assetPath('shots/beta-site.png'),
    title: 'Beta Site UI',
  },
  {
    kind: 'image',
    src: assetPath('shots/fizmathub.png'),
    title: 'ФизМатХаб кабинет',
  },
  {
    kind: 'image',
    src: assetPath('shots/fizmathub-student.png'),
    title: 'ФизМатХаб ученик',
  },
  {
    kind: 'image',
    src: assetPath('shots/trudozatraty-entry.png'),
    title: 'Трудозатраты ввод',
  },
  {
    kind: 'image',
    src: assetPath('shots/marquee/beta.png'),
    title: 'Beta кадр',
  },
]

export const aboutDecor = {
  moon: 'https://jovxgdctpqexoiwfspue.supabase.co/storage/v1/object/sign/asset-media/4fe55ce1-0755-4b6a-94de-305b93cc786e/f8dd09b65cc8-moon_icon.11395d36.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMjk0Y2Y1ZS01ODRhLTQ5ODItOGY3MS04NGQzZDAwMzJiNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldC1tZWRpYS80ZmU1NWNlMS0wNzU1LTRiNmEtOTRkZS0zMDViOTNjYzc4NmUvZjhkZDA5YjY1Y2M4LW1vb25faWNvbi4xMTM5NWQzNi5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2MDIxNzcxLCJleHAiOjIxMDEzODE3NzF9.fonb2Q_1wdwAvMSvRxMZuJUYIfCQM43cNoe2kLpaeZw',
  rocket: assetPath('assets/about/rocket.png'),
  lego: 'https://jovxgdctpqexoiwfspue.supabase.co/storage/v1/object/sign/asset-media/4fe55ce1-0755-4b6a-94de-305b93cc786e/82ad84b2275d-lego_icon-1.703bb594.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMjk0Y2Y1ZS01ODRhLTQ5ODItOGY3MS04NGQzZDAwMzJiNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldC1tZWRpYS80ZmU1NWNlMS0wNzU1LTRiNmEtOTRkZS0zMDViOTNjYzc4NmUvODJhZDg0YjIyNzVkLWxlZ29faWNvbi0xLjcwM2JiNTk0LnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODYwMjE3NzMsImV4cCI6MjEwMTM4MTc3M30.rAJfEfYi2Us2qtZ2jc9smYFskpeHTHGzXKHbq-OUxUM',
  group:
    'https://jovxgdctpqexoiwfspue.supabase.co/storage/v1/object/sign/asset-media/4fe55ce1-0755-4b6a-94de-305b93cc786e/c778291e52db-Group_134-1.2e04f3ce.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMjk0Y2Y1ZS01ODRhLTQ5ODItOGY3MS04NGQzZDAwMzJiNzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldC1tZWRpYS80ZmU1NWNlMS0wNzU1LTRiNmEtOTRkZS0zMDViOTNjYzc4NmUvYzc3ODI5MWU1MmRiLUdyb3VwXzEzNC0xLjJlMDRmM2NlLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODYwMjE3NzUsImV4cCI6MjEwMTM4MTc3NX0.aH7T_F_54M7HTQLwgS63dGvrmBuVhII7JaeJC4lpEnc',
}

export const services = [
  {
    n: '01',
    title: 'Сайты с записью',
    text: 'Лендинги для салонов и студий: услуги, мастера, онлайн-запись и заявка в мессенджер без лишнего шума.',
  },
  {
    n: '02',
    title: 'Школьные порталы',
    text: 'Кабинеты ученика и админа, мероприятия, заявки, дипломы и рейтинг - интерфейс, который понятен с первого экрана.',
  },
  {
    n: '03',
    title: 'Учет и системы',
    text: 'Рабочие системы учета часов, ролей и отчетов: от формы ввода до выгрузки в Excel.',
  },
  {
    n: '04',
    title: 'Интерфейсы',
    text: 'Чистая типографика, спокойная сетка и сильные акценты. Сайт выглядит собранно и продающе.',
  },
  {
    n: '05',
    title: 'Прототип за неделю',
    text: 'Быстрый старт: демо, правки, запуск. Подходит, когда нужно показать точку на Картах уже сейчас.',
  },
]

export const projects = [
  {
    n: '01',
    category: 'Клиент',
    name: 'Beta Site',
    live: true,
    href: 'https://amilka17.github.io/beta-site/',
    images: {
      top: assetPath('shots/beta-site-top.png'),
      bottom: assetPath('shots/beta-site-masters.png'),
      tall: assetPath('shots/beta-scroll.png'),
    },
    topKind: 'image' as const,
    tallKind: 'scroll' as const,
    objectPositions: {
      top: 'center top',
      bottom: 'center top',
      tall: 'center top',
    },
  },
  {
    n: '02',
    category: 'Хакатон',
    name: 'ФизМатХаб',
    live: false,
    href: '#projects',
    images: {
      top: assetPath('shots/fizmathub-events.png'),
      bottom: assetPath('shots/fizmathub-student.png'),
      tall: assetPath('shots/fizmat-scroll.png'),
    },
    topKind: 'image' as const,
    tallKind: 'scroll' as const,
    objectPositions: {
      top: 'center top',
      bottom: 'center top',
      tall: 'center top',
    },
  },
  {
    n: '03',
    category: 'Продукт',
    name: 'Трудозатраты',
    live: false,
    href: '#projects',
    images: {
      top: assetPath('shots/trudozatraty-admin.png'),
      bottom: assetPath('shots/trudozatraty-entry.png'),
      tall: assetPath('shots/trudo-scroll.png'),
    },
    topKind: 'image' as const,
    topFit: 'contain' as const,
    tallKind: 'scroll' as const,
    objectPositions: {
      top: 'center center',
      bottom: 'center top',
      tall: 'center top',
    },
  },
  {
    n: '04',
    category: 'Сервис',
    name: 'LearnAI',
    live: false,
    href: 'https://github.com/AmilKa17/learnai',
    images: {
      top: assetPath('shots/learnai.png'),
      bottom: assetPath('shots/learnai-mid.png'),
      tall: assetPath('shots/learnai-scroll.png'),
    },
    topKind: 'image' as const,
    tallKind: 'scroll' as const,
    objectPositions: {
      top: 'center top',
      bottom: 'center top',
      tall: 'center top',
    },
  },
]
