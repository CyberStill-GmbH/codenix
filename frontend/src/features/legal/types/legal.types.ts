export type LegalSection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export type LegalDocument = {
  eyebrow: string
  title: string
  updatedAt: string
  intro: string
  sections: LegalSection[]
}
