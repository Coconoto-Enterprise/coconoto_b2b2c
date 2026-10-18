import pw from 'file:///C:/Users/ENOCH/.workbuddy-ai/binaries/node/workspace/node_modules/playwright/index.js';
const { chromium } = pw;

const A4_CONTENT_PX = 270 / 25.4 * 96; // 270mm usable height at 96dpi ~= 1020.5
const A4_WIDTH_PX = 186 / 25.4 * 96;   // 186mm usable width ~= 703

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: Math.round(A4_WIDTH_PX), height: 1200 } });
await page.goto('file:///C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/design-spec/CocoConnect-Marketplace-Design-Spec.html');
await page.waitForTimeout(600);

const rows = await page.$$eval('section.page', (secs) =>
  secs.map((s, i) => {
    const h2 = s.querySelector('h2');
    return {
      i,
      title: h2 ? h2.textContent.trim() : (s.querySelector('.cover h1') ? 'COVER' : '(no title)'),
      h: Math.round(s.getBoundingClientRect().height),
    };
  })
);

let total = 0;
for (const r of rows) {
  const pages = r.h / A4_CONTENT_PX;
  total += Math.ceil(pages - 0.001);
  const flag = pages > 1.001 ? '  <== OVERFLOW x' + pages.toFixed(2) : '';
  console.log(String(r.i).padStart(2) + '  ' + r.title.padEnd(34) + String(r.h).padStart(5) + 'px  ' + pages.toFixed(2) + 'pg' + flag);
}
console.log('\nprojected total pages:', total, '(limit', A4_CONTENT_PX.toFixed(0), 'px per page)');
await browser.close();
