/**
 * Vintage Dashboard — data export engine.
 *
 * Zero dependencies. Produces:
 *   - CSV  (Excel-friendly, UTF-8 BOM so the Naira sign survives)
 *   - JSON (nested, machine readable, typed values preserved)
 *   - XLSX (real spreadsheet: one sheet per section + a Summary sheet)
 *   - PDF  (print-optimised HTML document -> browser "Save as PDF")
 *
 * Design notes for the data team:
 *   - Columns are derived from the actual rows, so a newly added Supabase column
 *     shows up in the export without touching this file.
 *   - `id` always comes first, known/important fields keep a stable order,
 *     anything unexpected is appended alphabetically. Nothing is ever dropped.
 */

export type ExportFormat = 'xlsx' | 'csv' | 'json' | 'pdf';
export type CellValue = string | number | boolean | null;
export type CellType = 'text' | 'number' | 'currency' | 'date' | 'id';

export interface ExportSectionDef {
  /** key in the `allData` object, or a virtual key for emails */
  id: string;
  label: string;
  /** Supabase table name — included as metadata so the data team knows the source */
  table: string;
  description: string;
  /** Preferred column order. Unknown columns are appended automatically. */
  columns: string[];
  /** Field used for date-range filtering, in order of preference */
  dateFields: string[];
}

export interface ExportColumn {
  key: string;
  label: string;
  type: CellType;
}

export interface ExportTable {
  id: string;
  label: string;
  table: string;
  columns: ExportColumn[];
  rows: Record<string, CellValue>[];
}

export interface ExportMeta {
  generatedAt: string;
  generatedBy: string;
  filters: string;
  sections: string[];
}

/* ------------------------------------------------------------------ */
/* Section registry                                                    */
/* ------------------------------------------------------------------ */

export const EXPORT_SECTIONS: ExportSectionDef[] = [
  {
    id: 'bookEventRequests',
    label: 'DrinkEat Requests',
    table: 'book_event_requests',
    description: 'Event / DrinkEat booking requests',
    columns: [
      'full_name', 'email', 'phone', 'company', 'event_type', 'event_date',
      'guests', 'price', 'location', 'message', 'status', 'created_at',
    ],
    dateFields: ['event_date', 'created_at'],
  },
  {
    id: 'machineOrders',
    label: 'Machine Orders',
    table: 'machine_orders',
    description: 'Coconut processing machine orders',
    columns: [
      'name', 'email', 'phone', 'company', 'type', 'quantity', 'total_price',
      'installation_address', 'state', 'city', 'notes', 'status', 'created_at', 'submitted_at',
    ],
    dateFields: ['created_at', 'submitted_at'],
  },
  {
    id: 'productOrders',
    label: 'Product Orders',
    table: 'product_orders',
    description: 'Product purchases from the shop',
    columns: [
      'name', 'email', 'phone', 'products', 'products_interested', 'quantity',
      'total_price', 'delivery_address', 'notes', 'status', 'created_at',
    ],
    dateFields: ['created_at'],
  },
  {
    id: 'serviceContacts',
    label: 'Contact Messages',
    table: 'service_contacts',
    description: 'Support / contact form submissions',
    columns: ['name', 'email', 'phone', 'subject', 'message', 'status', 'created_at'],
    dateFields: ['created_at'],
  },
  {
    id: 'huskSaleRequests',
    label: 'Husk Sales',
    table: 'husk_sale_requests',
    description: 'Coconut husk sale enquiries',
    columns: [
      'name', 'email', 'phone', 'company', 'number_of_sacks', 'price',
      'location', 'address', 'message', 'status', 'created_at',
    ],
    dateFields: ['created_at'],
  },
  {
    id: 'waitlist',
    label: 'Waitlist',
    table: 'waitlist',
    description: 'Marketplace waitlist sign-ups',
    columns: [
      'name', 'email', 'phone', 'company', 'account_type', 'country', 'state', 'city',
      'business_type', 'business_category', 'monthly_volume', 'years_experience',
      'products_interested', 'products_other', 'primary_use_case', 'hear_about_us',
      'additional_info', 'status', 'created_at',
    ],
    dateFields: ['created_at'],
  },
  {
    id: 'businessEmails',
    label: 'Business Emails',
    table: 'email_logs',
    description: 'Email log — team + customer copies',
    columns: ['to', 'from', 'subject', 'last_event', 'status', 'created_at'],
    dateFields: ['created_at'],
  },
  {
    id: 'investmentInquiries',
    label: 'Investment Inquiries',
    table: 'investment_inquiries',
    description: 'Investor enquiries',
    columns: ['name', 'email', 'phone', 'company', 'amount', 'message', 'status', 'created_at'],
    dateFields: ['created_at'],
  },
  {
    id: 'toxicResults',
    label: 'Toxic Results',
    table: 'toxic_results',
    description: 'Product toxicity / lab result submissions',
    columns: ['name', 'email', 'phone', 'company', 'result', 'status', 'created_at'],
    dateFields: ['created_at'],
  },
];

const CURRENCY_KEYS = new Set(['price', 'total_price', 'amount', 'unit_price', 'subtotal']);
const DATE_KEYS = new Set(['created_at', 'updated_at', 'submitted_at', 'event_date', 'date', 'deleted_at']);

const LABEL_OVERRIDES: Record<string, string> = {
  id: 'ID',
  full_name: 'Full Name',
  email: 'Email',
  phone: 'Phone',
  created_at: 'Created At',
  updated_at: 'Updated At',
  submitted_at: 'Submitted At',
  event_type: 'Event Type',
  event_date: 'Event Date',
  total_price: 'Total Price',
  number_of_sacks: 'Sacks',
  account_type: 'Account Type',
  last_event: 'Last Event',
  to: 'To',
  from: 'From',
  subject: 'Subject',
  status: 'Status',
};

export function humanizeKey(key: string): string {
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key];
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function columnType(key: string): CellType {
  if (key === 'id') return 'id';
  if (CURRENCY_KEYS.has(key)) return 'currency';
  if (DATE_KEYS.has(key)) return 'date';
  if (key.endsWith('_at') || key.endsWith('_date')) return 'date';
  return 'text';
}

/* ------------------------------------------------------------------ */
/* Value coercion                                                      */
/* ------------------------------------------------------------------ */

/** Turn an arbitrary Supabase value into something a spreadsheet can hold. */
function coerce(value: unknown): CellValue {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'boolean') return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value) || typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  const str = String(value);
  return str === '' ? null : str;
}

function sortableTime(value: CellValue): number | null {
  if (value === null) return null;
  if (typeof value === 'number') return value;
  const t = Date.parse(String(value));
  return Number.isNaN(t) ? null : t;
}

/* ------------------------------------------------------------------ */
/* Table builder                                                       */
/* ------------------------------------------------------------------ */

export interface BuildOptions {
  from?: string; // YYYY-MM-DD inclusive
  to?: string; // YYYY-MM-DD inclusive
  statusFilter?: string; // 'all' | 'pending' | 'processing' | 'completed' | undefined
}

/**
 * Build one export table from raw rows.
 * Columns = preferred order (only those actually present) + any extra keys.
 */
export function buildExportTable(
  def: ExportSectionDef,
  rawRows: unknown[],
  options: BuildOptions = {}
): ExportTable {
  const source = Array.isArray(rawRows) ? rawRows : [];

  // 1. Coerce every row once.
  const coerced: Record<string, CellValue>[] = source
    .filter((row) => row && typeof row === 'object')
    .map((row) => {
      const out: Record<string, CellValue> = {};
      for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
        // Skip noisy payloads that would explode the sheet.
        if (k === 'html' || k === 'raw' || k === 'body_html') {
          out[k] = v ? '[html omitted]' : null;
          continue;
        }
        out[k] = coerce(v);
      }
      return out;
    });

  // 2. Discover columns.
  //    With no rows we still emit the known schema, so an empty section shows a
  //    proper header row instead of a blank sheet (or disappearing entirely).
  const present = new Set<string>();
  if (coerced.length === 0) def.columns.forEach((k) => present.add(k));
  coerced.forEach((row) => Object.keys(row).forEach((k) => present.add(k)));

  const ordered: string[] = [];
  const push = (k: string) => {
    if (present.has(k) && !ordered.includes(k)) ordered.push(k);
  };
  push('id');
  def.columns.forEach(push);
  Array.from(present)
    .filter((k) => !ordered.includes(k))
    .sort((a, b) => a.localeCompare(b))
    .forEach(push);

  const columns: ExportColumn[] = ordered.map((key) => ({
    key,
    label: humanizeKey(key),
    type: columnType(key),
  }));

  // 3. Filters.
  const fromTs = options.from ? Date.parse(`${options.from}T00:00:00`) : null;
  const toTs = options.to ? Date.parse(`${options.to}T23:59:59.999`) : null;
  const statusFilter = options.statusFilter && options.statusFilter !== 'all' ? options.statusFilter : null;

  const rows = coerced.filter((row) => {
    if (statusFilter) {
      const rowStatus = (row.status ?? 'pending') as string;
      if (String(rowStatus) !== statusFilter) return false;
    }
    if (fromTs !== null || toTs !== null) {
      let ts: number | null = null;
      for (const field of def.dateFields) {
        ts = sortableTime(row[field] ?? null);
        if (ts !== null) break;
      }
      if (ts === null) return false;
      if (fromTs !== null && ts < fromTs) return false;
      if (toTs !== null && ts > toTs) return false;
    }
    return true;
  });

  return { id: def.id, label: def.label, table: def.table, columns, rows };
}

/* ------------------------------------------------------------------ */
/* Display formatting                                                  */
/* ------------------------------------------------------------------ */

const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 2,
});

export function formatForDisplay(value: CellValue, type: CellType): string {
  if (value === null || value === undefined) return '';
  if (type === 'currency' && typeof value === 'number') return naira.format(value);
  if (type === 'date' && typeof value === 'string') {
    // Date-only fields (YYYY-MM-DD) must not pick up a timezone-shifted clock time.
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
    const d = new Date(dateOnly ? `${value}T00:00:00` : value);
    if (!Number.isNaN(d.getTime())) {
      const datePart = d.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
      if (dateOnly) return datePart;
      const timePart = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      return `${datePart}, ${timePart}`;
    }
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function plain(value: CellValue): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

/* ------------------------------------------------------------------ */
/* File naming + download                                              */
/* ------------------------------------------------------------------ */

function stamp(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

export function buildFileName(tables: ExportTable[], format: ExportFormat): string {
  const slug =
    tables.length === 1
      ? tables[0].id.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      : tables.length > 1
      ? 'all-sections'
      : 'empty';
  return `coconoto-vintage-${slug}-${stamp()}.${format}`;
}

export function downloadBlob(
  data: Blob | string | Uint8Array,
  fileName: string,
  mime: string
): void {
  const blob =
    data instanceof Blob ? data : new Blob([data as BlobPart], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Give the browser a beat to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* ------------------------------------------------------------------ */
/* CSV                                                                 */
/* ------------------------------------------------------------------ */

function csvCell(value: string): string {
  if (value === '') return '';
  if (/[",\r\n]/.test(value) || /^\s|\s$/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function tablesToCSV(tables: ExportTable[], meta: ExportMeta): string {
  const lines: string[] = [];

  if (tables.length > 1) {
    // One flat table, section column first — easiest for import into any tool.
    const union: ExportColumn[] = [];
    tables.forEach((t) =>
      t.columns.forEach((c) => {
        if (!union.some((u) => u.key === c.key)) union.push(c);
      })
    );
    lines.push(['Section', ...union.map((c) => csvCell(c.label))].join(','));
    tables.forEach((t) => {
      t.rows.forEach((row) => {
        const cells = union.map((c) => csvCell(plain(row[c.key] ?? null)));
        lines.push([csvCell(t.label), ...cells].join(','));
      });
    });
  } else if (tables.length === 1) {
    const t = tables[0];
    lines.push(t.columns.map((c) => csvCell(c.label)).join(','));
    t.rows.forEach((row) => {
      lines.push(t.columns.map((c) => csvCell(plain(row[c.key] ?? null))).join(','));
    });
  }

  // Provenance trailer, blank line separated so parsers stop at it cleanly.
  lines.push('');
  lines.push(csvCell(`# Exported from the Coconoto Vintage Dashboard on ${meta.generatedAt}`));
  lines.push(csvCell(`# Generated by: ${meta.generatedBy}`));
  if (meta.filters) lines.push(csvCell(`# Filters: ${meta.filters}`));
  lines.push(csvCell(`# Rows: ${tables.reduce((s, t) => s + t.rows.length, 0)}`));

  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

/* ------------------------------------------------------------------ */
/* JSON                                                                */
/* ------------------------------------------------------------------ */

export function tablesToJSON(tables: ExportTable[], meta: ExportMeta): string {
  return JSON.stringify(
    {
      meta: {
        ...meta,
        source: 'Coconoto Vintage Dashboard',
        total_rows: tables.reduce((s, t) => s + t.rows.length, 0),
      },
      sections: tables.map((t) => ({
        id: t.id,
        label: t.label,
        table: t.table,
        row_count: t.rows.length,
        columns: t.columns.map((c) => ({ key: c.key, label: c.label, type: c.type })),
        rows: t.rows,
      })),
    },
    null,
    2
  );
}

/* ------------------------------------------------------------------ */
/* XLSX (hand-rolled OOXML + stored ZIP)                               */
/* ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

interface ZipEntry {
  name: string;
  data: Uint8Array;
}

/** Build a ZIP archive with stored (uncompressed) entries — valid OOXML container. */
function zipStore(entries: ZipEntry[], modified = new Date()): Uint8Array {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  const dosTime =
    ((modified.getHours() << 11) | (modified.getMinutes() << 5) | (modified.getSeconds() >> 1)) & 0xffff;
  const dosDate =
    (((modified.getFullYear() - 1980) << 9) | ((modified.getMonth() + 1) << 5) | modified.getDate()) & 0xffff;

  for (const entry of entries) {
    const nameBytes = enc.encode(entry.name);
    const crc = crc32(entry.data);
    const size = entry.data.length;

    const local = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, 0x0800, true); // UTF-8 flag
    lv.setUint16(8, 0, true); // stored
    lv.setUint16(10, dosTime, true);
    lv.setUint16(12, dosDate, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    local.set(nameBytes, 30);

    chunks.push(local, entry.data);

    const cd = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true); // version needed
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, dosTime, true);
    cv.setUint16(14, dosDate, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    cd.set(nameBytes, 46);
    central.push(cd);

    offset += local.length + size;
  }

  const centralSize = central.reduce((s, c) => s + c.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const all = [...chunks, ...central, eocd];
  const total = all.reduce((s, c) => s + c.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const c of all) {
    out.set(c, pos);
    pos += c.length;
  }
  return out;
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    // strip control chars Excel rejects
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

function colName(index: number): string {
  let n = index + 1;
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function sheetName(raw: string, used: Set<string>): string {
  let name = raw.replace(/[\\/?*[\]:]/g, '-').slice(0, 31) || 'Sheet';
  let candidate = name;
  let i = 2;
  while (used.has(candidate.toLowerCase())) {
    const suffix = ` (${i++})`;
    candidate = `${name.slice(0, 31 - suffix.length)}${suffix}`;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

const STYLE_DEFAULT = 0;
const STYLE_HEADER = 1;
const STYLE_BODY = 2;
const STYLE_TITLE = 3;
const STYLE_LABEL = 4;
const STYLE_NOTE = 5;

interface SheetSpec {
  name: string;
  /** header row is styled + frozen when true */
  headerRow: boolean;
  rows: CellValue[][];
  columnWidths?: number[];
}

function sheetXml(spec: SheetSpec): string {
  const widths = spec.columnWidths ?? [];
  const maxCols = spec.rows.reduce((m, r) => Math.max(m, r.length), 1);
  const lastCol = colName(Math.max(maxCols - 1, 0));
  const lastRow = Math.max(spec.rows.length, 1);

  const cols =
    widths.length > 0
      ? `<cols>${widths
          .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
          .join('')}</cols>`
      : '';

  const pane = spec.headerRow
    ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
    : `<sheetViews><sheetView workbookViewId="0"/></sheetViews>`;

  const body = spec.rows
    .map((cells, r) => {
      const rowNum = r + 1;
      const style = spec.headerRow && r === 0 ? STYLE_HEADER : STYLE_BODY;
      const cellXml = cells
        .map((value, c) => {
          const ref = `${colName(c)}${rowNum}`;
          if (value === null || value === undefined || value === '') {
            return `<c r="${ref}" s="${style}"/>`;
          }
          if (typeof value === 'number') {
            return `<c r="${ref}" s="${style}"><v>${value}</v></c>`;
          }
          if (typeof value === 'boolean') {
            return `<c r="${ref}" s="${style}" t="b"><v>${value ? 1 : 0}</v></c>`;
          }
          const text = xmlEscape(String(value)).slice(0, 32000);
          return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${text}</t></is></c>`;
        })
        .join('');
      const height = spec.headerRow && r === 0 ? ' ht="22" customHeight="1"' : '';
      return `<row r="${rowNum}"${height}>${cellXml}</row>`;
    })
    .join('');

  const autoFilter = spec.headerRow ? `<autoFilter ref="A1:${lastCol}${lastRow}"/>` : '';

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<dimension ref="A1:${lastCol}${lastRow}"/>
${pane}
<sheetFormatPr defaultRowHeight="15"/>
${cols}
<sheetData>${body}</sheetData>
${autoFilter}
<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>
</worksheet>`;
}

function stylesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="5">
<font><sz val="11"/><color rgb="FF1F2937"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
<font><sz val="10"/><color rgb="FF1F2937"/><name val="Calibri"/></font>
<font><b/><sz val="14"/><color rgb="FF14532D"/><name val="Calibri"/></font>
<font><b/><sz val="10"/><color rgb="FF374151"/><name val="Calibri"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF17AD10"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="6">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"><alignment vertical="top" wrapText="1"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
<dxfs count="0"/>
<tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>
</styleSheet>`;
}

function widthFor(columns: ExportColumn[], rows: Record<string, CellValue>[], key: string): number {
  const header = humanizeKey(key).length;
  let longest = header;
  const sample = rows.slice(0, 200);
  for (const row of sample) {
    const len = plain(row[key] ?? null).length;
    if (len > longest) longest = len;
  }
  return Math.min(Math.max(longest + 2, 12), 52);
}

export function tablesToXLSX(tables: ExportTable[], meta: ExportMeta): Uint8Array {
  const used = new Set<string>();
  const sheets: SheetSpec[] = [];

  // ---- Summary sheet ----
  const summaryRows: CellValue[][] = [
    ['Coconoto — Vintage Dashboard Export'],
    [],
    ['Generated at', meta.generatedAt],
    ['Generated by', meta.generatedBy],
    ['Filters applied', meta.filters || 'None (all records)'],
    ['Sections exported', String(tables.length)],
    ['Total records', tables.reduce((s, t) => s + t.rows.length, 0)],
    [],
    ['Section', 'Supabase table', 'Records', 'Columns', 'Columns exported'],
    ...tables.map((t) => [
      t.label,
      t.table,
      t.rows.length,
      t.columns.length,
      t.columns.map((c) => c.label).join(', '),
    ]),
    [],
    ['Note', 'One sheet per section follows this summary. Column names match the database fields.'],
  ];

  sheets.push({
    name: sheetName('Summary', used),
    headerRow: false,
    rows: summaryRows,
    columnWidths: [24, 34, 12, 12, 90],
  });

  // ---- One sheet per section ----
  for (const t of tables) {
    const header = t.columns.map((c) => c.label);
    const rows: CellValue[][] = [header];
    t.rows.forEach((row) => {
      rows.push(t.columns.map((c) => row[c.key] ?? null));
    });
    sheets.push({
      name: sheetName(t.label, used),
      headerRow: true,
      rows,
      columnWidths: t.columns.map((c) => widthFor(t.columns, t.rows, c.key)),
    });
  }

  const enc = new TextEncoder();
  const entries: ZipEntry[] = [];
  const push = (name: string, content: string) =>
    entries.push({ name, data: enc.encode(content) });

  const sheetCount = sheets.length;

  push(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
${sheets
  .map(
    (_s, i) =>
      `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  )
  .join('\n')}
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>`
  );

  push(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>`
  );

  push(
    'docProps/core.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>Coconoto Vintage Dashboard Export</dc:title>
<dc:creator>${xmlEscape(meta.generatedBy)}</dc:creator>
<cp:lastModifiedBy>${xmlEscape(meta.generatedBy)}</cp:lastModifiedBy>
<dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
</cp:coreProperties>`
  );

  push(
    'xl/workbook.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>
${sheets.map((s, i) => `<sheet name="${xmlEscape(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('\n')}
</sheets>
</workbook>`
  );

  push(
    'xl/_rels/workbook.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${sheets
  .map(
    (_s, i) =>
      `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`
  )
  .join('\n')}
<Relationship Id="rId${sheetCount + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
  );

  push('xl/styles.xml', stylesXml());

  sheets.forEach((s, i) => push(`xl/worksheets/sheet${i + 1}.xml`, sheetXml(s)));

  return zipStore(entries);
}

/* ------------------------------------------------------------------ */
/* PDF (print view)                                                    */
/* ------------------------------------------------------------------ */

function htmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildPrintDocument(tables: ExportTable[], meta: ExportMeta): string {
  const total = tables.reduce((s, t) => s + t.rows.length, 0);

  const sections = tables
    .map((t) => {
      const head = t.columns.map((c) => `<th>${htmlEscape(c.label)}</th>`).join('');
      const body = t.rows
        .map(
          (row) =>
            `<tr>${t.columns
              .map((c) => {
                const raw = row[c.key] ?? null;
                let text = formatForDisplay(raw, c.type);
                if (c.key === 'status' && text) {
                  text = text.charAt(0).toUpperCase() + text.slice(1);
                }
                const cls =
                  c.type === 'currency' ? 'num' : c.type === 'id' ? 'id' : '';
                return `<td class="${cls}">${htmlEscape(text)}</td>`;
              })
              .join('')}</tr>`
        )
        .join('');

      const empty = t.rows.length === 0
        ? `<tr><td colspan="${t.columns.length || 1}" class="empty">No records in this section for the selected range.</td></tr>`
        : '';

      return `<section>
  <h2>${htmlEscape(t.label)} <span class="count">${t.rows.length} record${t.rows.length === 1 ? '' : 's'}</span></h2>
  <div class="meta">Source table: <code>${htmlEscape(t.table)}</code> · ${t.columns.length} columns</div>
  <table>
    <thead><tr>${head}</tr></thead>
    <tbody>${body}${empty}</tbody>
  </table>
</section>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<title>Coconoto Vintage Dashboard Export</title>
<style>
  @page { size: A4 landscape; margin: 10mm 8mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; margin: 0; padding: 0 4mm 10mm; font-size: 8.5px; }
  header { border-bottom: 2px solid #17AD10; padding-bottom: 6px; margin-bottom: 10px; }
  h1 { font-size: 15px; margin: 0 0 2px; color: #14532D; letter-spacing: -0.2px; }
  .sub { color: #4b5563; font-size: 9px; }
  .pill { display: inline-block; background: #ecfdf5; color: #14532D; border: 1px solid #a7f3d0; border-radius: 999px; padding: 1px 7px; font-size: 8px; margin-right: 4px; }
  section { margin-bottom: 14px; page-break-inside: auto; }
  h2 { font-size: 11px; margin: 0 0 2px; color: #14532D; border-left: 3px solid #17AD10; padding-left: 6px; }
  h2 .count { font-weight: 500; color: #6b7280; font-size: 8.5px; }
  .meta { color: #6b7280; font-size: 7.5px; margin: 0 0 4px 9px; }
  .meta code { background: #f3f4f6; padding: 0 3px; border-radius: 2px; }
  table { width: 100%; border-collapse: collapse; table-layout: auto; }
  thead { display: table-header-group; }
  th { background: #17AD10; color: #fff; text-align: left; font-weight: 600; font-size: 7.5px; padding: 3px 4px; border: 1px solid #128a0d; text-transform: uppercase; letter-spacing: 0.2px; }
  td { border: 1px solid #e5e7eb; padding: 3px 4px; vertical-align: top; word-break: break-word; }
  tbody tr:nth-child(even) td { background: #f9fafb; }
  tr { page-break-inside: avoid; }
  td.num { text-align: right; white-space: nowrap; }
  td.id { font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; font-size: 7px; color: #6b7280; }
  td.empty { text-align: center; color: #6b7280; font-style: italic; padding: 10px; }
  footer { margin-top: 10px; border-top: 1px solid #e5e7eb; padding-top: 5px; color: #6b7280; font-size: 7.5px; }
  .toolbar { position: sticky; top: 0; background: #fff; padding: 6px 0; margin-bottom: 6px; border-bottom: 1px solid #e5e7eb; z-index: 5; }
  .toolbar button { background: #17AD10; color: #fff; border: 0; border-radius: 4px; padding: 6px 14px; font-size: 11px; font-weight: 600; cursor: pointer; }
  .toolbar span { font-size: 9px; color: #6b7280; margin-left: 8px; }
  @media print { .toolbar { display: none !important; } }
</style></head>
<body>
<div class="toolbar">
  <button onclick="window.print()">Save as PDF</button>
  <span>In the print dialog choose <strong>Destination: Save as PDF</strong>, layout <strong>Landscape</strong>.</span>
</div>
<header>
  <h1>Coconoto — Vintage Dashboard Export</h1>
  <div class="sub">
    <span class="pill">${tables.length} section${tables.length === 1 ? '' : 's'}</span>
    <span class="pill">${total} record${total === 1 ? '' : 's'}</span>
    Generated ${htmlEscape(meta.generatedAt)} · by ${htmlEscape(meta.generatedBy)}
  </div>
  ${meta.filters ? `<div class="sub" style="margin-top:3px">Filters: ${htmlEscape(meta.filters)}</div>` : ''}
</header>
${sections}
<footer>Coconoto Vintage Dashboard · ${htmlEscape(meta.sections.join(' · '))} · Data exported for internal analysis.</footer>
</body></html>`;
}

/** Open the print view in a new tab; the browser turns it into a PDF on save. */
export function openPrintView(tables: ExportTable[], meta: ExportMeta): boolean {
  const html = buildPrintDocument(tables, meta);
  const win = window.open('', '_blank', 'width=1180,height=860');
  if (!win) return false;
  win.document.open();
  win.document.write(html);
  win.document.close();
  // Let layout settle before the dialog appears.
  setTimeout(() => {
    try {
      win.focus();
      win.print();
    } catch {
      /* user can still press the toolbar button */
    }
  }, 500);
  return true;
}

/* ------------------------------------------------------------------ */
/* Orchestrator                                                        */
/* ------------------------------------------------------------------ */

export function exportTables(
  tables: ExportTable[],
  format: ExportFormat,
  meta: ExportMeta
): { ok: boolean; message: string } {
  if (tables.length === 0) {
    return { ok: false, message: 'Select at least one section to export.' };
  }
  const fileName = buildFileName(tables, format);

  if (format === 'csv') {
    downloadBlob(tablesToCSV(tables, meta), fileName, 'text/csv;charset=utf-8');
    return { ok: true, message: `CSV downloaded (${fileName})` };
  }
  if (format === 'json') {
    downloadBlob(tablesToJSON(tables, meta), fileName, 'application/json;charset=utf-8');
    return { ok: true, message: `JSON downloaded (${fileName})` };
  }
  if (format === 'xlsx') {
    const bytes = tablesToXLSX(tables, meta);
    downloadBlob(
      new Blob([bytes as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      fileName,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    return { ok: true, message: `Excel workbook downloaded (${fileName})` };
  }
  const opened = openPrintView(tables, meta);
  return opened
    ? { ok: true, message: 'Print view opened — choose "Save as PDF".' }
    : { ok: false, message: 'Your browser blocked the print window. Allow pop-ups and retry.' };
}
