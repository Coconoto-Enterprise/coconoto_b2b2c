import React from 'react';
import AboutFooter from '../about/AboutFooter';

/**
 * Chrome for the Figma pages.
 *
 * These pages used to draw their own 505px dark footer (soil photo at 85% black,
 * its own column grid and contact details — which had drifted onto placeholder
 * emails like `info@bdbfarm.com`). They now render the **real site footer**, the
 * same `AboutFooter` the live site, `/about`, `/services` and `/product` all use,
 * so the footer can never drift out of sync again.
 *
 * Note: this retires the `footer-bg` and `footer-logo` image slots. The real
 * footer uses the committed `fotterimage.png` and `Logo_1.png` assets directly,
 * so those two slots are no longer referenced by any page.
 */
export default function FigmaFooter() {
  return <AboutFooter />;
}
