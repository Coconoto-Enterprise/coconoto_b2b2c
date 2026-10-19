import LegalDocument from '@/components/legal/LegalDocument';
import { LEGAL_PAGES } from '../../../api/_legal-content.js';
import type { LegalPage } from '@/types/legal';

/**
 * Copy lives in `api/_legal-content.js` — the same module `api/seo.js` uses to
 * server-render this page into the HTML shell. Edit the text there, not here.
 */
export default function CookiePolicy() {
  return <LegalDocument page={LEGAL_PAGES['/cookie-policy'] as unknown as LegalPage} />;
}
