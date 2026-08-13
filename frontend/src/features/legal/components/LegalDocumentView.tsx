import { FileText, ShieldCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { Navbar } from '@/features/landing/components/Navbar'
import type { LegalDocument } from '@/features/legal/types/legal.types'
import { LegalSection } from '../types/legal.types';

type LegalDocumentViewProps = {
  document: LegalDocument
}

const legalNavigationItems = [
  {
    label: 'Politica de privacidad',
    description: 'Datos, OAuth y proteccion de informacion.',
    href: '/privacy',
    Icon: ShieldCheck,
  },
  {
    label: 'Terminos de servicio',
    description: 'Reglas de uso, cuentas y responsabilidades.',
    href: '/terms',
    Icon: FileText,
  },
]

export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <main className="legal-page">
        <section className="legal-page__hero" aria-labelledby="legal-title">
          <p className="legal-page__eyebrow">{document.eyebrow}</p>
          <h1 id="legal-title" className="legal-page__title">
            {document.title}
          </h1>
          <p className="legal-page__updated">
            Last updated: {document.updatedAt}
          </p>
          <p className="legal-page__intro">{document.intro}</p>
          <nav className="legal-page__switcher" aria-label="Documentos legales">
            {legalNavigationItems.map(({ label, description, href, Icon }) => {
              const isActive = location.pathname === href

              return (
                <Link
                  key={href}
                  to={href}
                  className={
                    isActive
                      ? 'legal-page__switcher-item legal-page__switcher-item--active'
                      : 'legal-page__switcher-item'
                  }
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="legal-page__switcher-icon">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="legal-page__switcher-copy">
                    <span className="legal-page__switcher-label">{label}</span>
                    <span className="legal-page__switcher-description">
                      {description}
                    </span>
                  </span>
                </Link>
              )
            })}
          </nav>
        </section>

        <article key={location.pathname} className="legal-page__content">
          {document.sections.map((section: LegalSection) => (
            <section key={section.title} className="legal-page__section">
              <h2 className="legal-page__section-title">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="legal-page__paragraph">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="legal-page__list">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>
    </>
  )
}
