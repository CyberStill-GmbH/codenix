import { LegalDocumentView } from '@/features/legal/components/LegalDocumentView'
import { privacyPolicy } from '@/features/legal/constants/legalDocuments'

export function PrivacyPage() {
  return <LegalDocumentView document={privacyPolicy} />
}
