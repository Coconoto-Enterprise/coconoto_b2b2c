import LegalDocument from '@/components/legal/LegalDocument';
import { LEGAL_PAGES } from '../../../lib/legal-content.js';
import type { LegalPage } from '@/types/legal';

/**
 * Copy lives in `lib/legal-content.js` — the same module `api/seo.js` uses to
 * server-render this page into the HTML shell. Edit the text there, not here.
 */
export default function TermsOfService() {
  return <LegalDocument page={LEGAL_PAGES['/terms-of-service'] as unknown as LegalPage} />;
}
