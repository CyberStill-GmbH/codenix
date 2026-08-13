import { LegalDocumentView } from '@/features/legal/components/LegalDocumentView'
import { termsOfService } from '@/features/legal/constants/legalDocuments'

export function TermsPage() {
  return <LegalDocumentView document={termsOfService} />
}
