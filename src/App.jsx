import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useReducedMotion,
  animate,
  useTransform,
} from 'framer-motion'
import {
  Sun, Moon, ArrowRight, Sparkles, Zap, Shield, BarChart3,
  Workflow, Globe, Bell, Check,
} from 'lucide-react'

/* ---------- вспомогательное: появление по скроллу ---------- */
function Reveal({ children, delay = 0, y = 24, className }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={reduce || inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- анимированный счётчик ---------- */
function Counter({ to, suffix = '', duration = 1.6 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) { setVal(to); return }
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, duration, reduce])
  const shown = to % 1 === 0 ? Math.round(val) : val.toFixed(1)
  return <span ref={ref}>{shown}{suffix}</span>
}

const FEATURES = [
  { icon: Zap, title: 'Реактивные обновления', text: 'Данные пересчитываются на лету — без перезагрузок и ожиданий. Интерфейс отвечает мгновенно.' },
  { icon: BarChart3, title: 'Живые дашборды', text: 'Графики, метрики и когорты в одном месте. Настраиваются перетаскиванием под любую задачу.' },
  { icon: Workflow, title: 'Автоматизации', text: 'Триггеры и сценарии без кода: событие произошло — нужное действие выполнилось само.' },
  { icon: Shield, title: 'Безопасность', text: 'Шифрование, роли и журнал доступа. Ваши данные под контролем на каждом уровне.' },
  { icon: Globe, title: 'API и интеграции', text: 'Подключение к вашим сервисам за минуты. Готовые коннекторы и открытый REST API.' },
  { icon: Bell, title: 'Умные уведомления', text: 'Сообщаем о важном — всплеск, аномалия, достигнутая цель — в Telegram, почту или Slack.' },
]

const STEPS = [
  { title: 'Подключите данные', text: 'Импорт из таблиц, баз и API за пару кликов. Мастер настройки проведёт по шагам.' },
  { title: 'Соберите дашборд', text: 'Перетаскивайте виджеты, выбирайте метрики — конструктор соберёт витрину под вас.' },
  { title: 'Получайте инсайты', text: 'Система сама подсвечивает тренды и аномалии и шлёт уведомления, когда это важно.' },
]

const PLANS = [
  { name: 'Старт', price: '0', period: '/ навсегда', tag: null, featured: false,
    list: ['1 проект', 'До 3 дашбордов', 'Базовые графики', 'Сообщество'] },
  { name: 'Про', price: '990', period: '/ мес', tag: 'Популярный', featured: true,
    list: ['Безлимит проектов', 'Автоматизации', 'API и интеграции', 'Уведомления', 'Приоритетная поддержка'] },
  { name: 'Команда', price: '2 490', period: '/ мес', tag: null, featured: false,
    list: ['Всё из Про', 'Роли и доступы', 'Журнал аудита', 'SLA 99.9%', 'Персональный менеджер'] },
]

export default function App() {
  const reduce = useReducedMotion()
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark',
  )
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('nebula-theme', theme)
  }, [theme])

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  // лёгкий параллакс для аврора-пятен героя
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const auroraY = useTransform(heroScroll, [0, 1], [0, 120])

  const barHeights = [46, 68, 52, 84, 60, 96, 74]

  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX: progress }} />

      {/* ---------- навигация ---------- */}
      <nav className="nav">
        <div className="container nav__inner">
          <div className="logo">
            <span className="logo__mark" />
            Nebula
          </div>
          <div className="nav__links">
            <a href="#features">Возможности</a>
            <a href="#how">Как это работает</a>
            <a href="#pricing">Тарифы</a>
          </div>
          <div className="nav__spacer" />
          <div className="nav__actions">
            <button
              className="icon-btn"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label="Сменить тему"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a className="btn btn--primary" href="#pricing">Начать бесплатно</a>
          </div>
        </div>
      </nav>

      {/* ---------- герой ---------- */}
      <header className="hero" ref={heroRef}>
        <motion.div className="aurora" style={{ y: auroraY }}>
          <motion.span animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.span animate={{ scale: [1, 1.2, 1], y: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.span animate={{ scale: [1.1, 1, 1.1], x: [0, -25, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>

        <div className="container hero__inner">
          <motion.div
            className="badge"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={15} color="var(--accent)" />
            Новое поколение аналитики <b>· v2.0</b>
          </motion.div>

          <motion.h1
            initial={reduce ? false : 'hidden'}
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          >
            {['Аналитика,', 'которая', 'опережает.'].map((word, i) => (
              <motion.span
                key={i}
                style={{ display: 'inline-block', marginRight: '0.28em' }}
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {i === 2 ? <span className="gradient-text">{word}</span> : word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="hero__sub"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Nebula превращает разрозненные данные в живые дашборды, автоматизации
            и уведомления — за минуты, без единой строчки кода.
          </motion.p>

          <motion.div
            className="hero__cta"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <a className="btn btn--primary btn--lg" href="#pricing">
              Попробовать бесплатно <ArrowRight size={18} />
            </a>
            <a className="btn btn--ghost btn--lg" href="#features">Смотреть возможности</a>
          </motion.div>
        </div>

        {/* макет-дашборд */}
        <motion.div
          className="container hero__mock"
          initial={reduce ? false : { opacity: 0, y: 60, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="mock"
            animate={reduce ? {} : { y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="mock__bar">
              <span className="mock__dot" /><span className="mock__dot" /><span className="mock__dot" />
              <div className="mock__title" style={{ margin: '0 0 0 12px' }}>nebula · дашборд «Продажи»</div>
            </div>
            <div className="mock__body">
              <div className="mock__panel">
                <div className="mock__title">Выручка по дням</div>
                <div className="chart">
                  {barHeights.map((h, i) => (
                    <motion.div
                      key={i}
                      className="bar"
                      initial={reduce ? false : { height: 8 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.8, delay: reduce ? 0 : 1 + i * 0.08, ease: 'easeOut' }}
                    />
                  ))}
                </div>
              </div>
              <div className="mock__panel">
                <div className="mock__title">Ключевые метрики</div>
                <div className="kpi">
                  <div className="kpi__item"><span>Конверсия</span><span className="kpi__val">4,8% <span className="kpi__up">↑ 12%</span></span></div>
                  <div className="kpi__item"><span>Средний чек</span><span className="kpi__val">2 480 ₽</span></div>
                  <div className="kpi__item"><span>Активные</span><span className="kpi__val">1 204 <span className="kpi__up">↑ 8%</span></span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* лента логотипов */}
        <div className="marquee">
          <div className="marquee__label">Нам доверяют команды</div>
          <div className="marquee__track">
            {['Ориент', 'Данкор', 'Логистерра', 'Финмост', 'Айкраф', 'Восток', 'Ориент', 'Данкор', 'Логистерра', 'Финмост', 'Айкраф', 'Восток'].map((n, i) => (
              <span key={i}>{n}</span>
            ))}
          </div>
        </div>
      </header>

      {/* ---------- статистика ---------- */}
      <section className="block container">
        <div className="stats">
          {[
            { to: 12, suffix: 'k+', label: 'команд используют' },
            { to: 99.9, suffix: '%', label: 'аптайм по SLA' },
            { to: 4.9, suffix: '', label: 'средняя оценка' },
            { to: 40, suffix: '%', label: 'экономия времени' },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="stat">
                <div className="stat__num gradient-text"><Counter to={s.to} suffix={s.suffix} /></div>
                <div className="stat__label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- возможности ---------- */}
      <section className="block container" id="features">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">Возможности</div>
            <h2>Всё, что нужно для роста</h2>
            <p>Один инструмент вместо десятка вкладок. Собрали то, чем команды пользуются каждый день.</p>
          </div>
        </Reveal>
        <div className="features">
          {FEATURES.map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 0.1}>
              <div className="feature">
                <div className="feature__icon"><f.icon size={24} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- как это работает ---------- */}
      <section className="block container" id="how">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">Процесс</div>
            <h2>Запуск за три шага</h2>
            <p>От подключения данных до первых инсайтов — меньше десяти минут.</p>
          </div>
        </Reveal>
        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className="step">
                <div className="step__n">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- тарифы ---------- */}
      <section className="block container" id="pricing">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">Тарифы</div>
            <h2>Честные цены</h2>
            <p>Начните бесплатно, платите только когда вырастете. Без скрытых условий.</p>
          </div>
        </Reveal>
        <div className="pricing">
          {PLANS.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className={`plan ${p.featured ? 'plan--featured' : ''}`}>
                {p.tag && <span className="plan__tag">{p.tag}</span>}
                <div className="plan__name">{p.name}</div>
                <div className="plan__price">{p.price} ₽ <span>{p.period}</span></div>
                <ul className="plan__list">
                  {p.list.map((li, j) => (
                    <li key={j}><Check size={17} /> {li}</li>
                  ))}
                </ul>
                <a className={`btn ${p.featured ? 'btn--primary' : 'btn--ghost'}`} style={{ width: '100%', justifyContent: 'center' }} href="#">
                  Выбрать
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- отзыв ---------- */}
      <section className="block container">
        <Reveal>
          <div className="quote">
            <p>«Раньше отчёты собирали вручную по полдня. С Nebula дашборд обновляется сам, а команда наконец занимается делом, а не таблицами».</p>
            <div className="quote__author"><b>Мария Соколова</b> — операционный директор, Логистерра</div>
          </div>
        </Reveal>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="block container">
        <Reveal>
          <div className="cta-band">
            <div className="aurora">
              <span /><span /><span />
            </div>
            <h2>Готовы увидеть данные иначе?</h2>
            <p>Подключите первый источник за пять минут. Бесплатно, без карты.</p>
            <a className="btn btn--primary btn--lg" href="#">Создать дашборд <ArrowRight size={18} /></a>
          </div>
        </Reveal>
      </section>

      {/* ---------- футер ---------- */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="logo"><span className="logo__mark" /> Nebula</div>
          <div>Демо-проект · React + Framer Motion · <a href="https://github.com/slakertop1">github.com/slakertop1</a></div>
        </div>
      </footer>
    </>
  )
}
