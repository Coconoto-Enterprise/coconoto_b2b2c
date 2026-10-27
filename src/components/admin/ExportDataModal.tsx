import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Check,
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  Printer,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Table2,
} from 'lucide-react';
import {
  EXPORT_SECTIONS,
  buildExportTable,
  exportTables,
  type ExportFormat,
  type ExportTable,
} from '../../utils/dashboardExport';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Raw rows keyed by section id (e.g. bookEventRequests, businessEmails). */
  data: Record<string, any[]>;
  /** Preselect these sections — used when opened from a single tab. */
  initialSelection?: string[];
  /** Current per-section status filter, e.g. { bookEventRequests: 'pending' }. */
  statusFilters?: Record<string, string>;
}

interface FormatOption {
  id: ExportFormat;
  label: string;
  extension: string;
  description: string;
  icon: React.ElementType;
  best: string;
}

const FORMATS: FormatOption[] = [
  {
    id: 'xlsx',
    label: 'Excel workbook',
    extension: '.xlsx',
    description: 'One sheet per section plus a summary sheet. Best for the data team.',
    icon: FileSpreadsheet,
    best: 'Recommended',
  },
  {
    id: 'csv',
    label: 'CSV',
    extension: '.csv',
    description: 'Flat table, opens in Excel, Sheets, Python or R. One column per field.',
    icon: Table2,
    best: 'Universal',
  },
  {
    id: 'json',
    label: 'JSON',
    extension: '.json',
    description: 'Structured data with column types — for scripts, APIs and databases.',
    icon: FileJson,
    best: 'Developers',
  },
  {
    id: 'pdf',
    label: 'PDF (print view)',
    extension: '.pdf',
    description: 'Formatted tables in a print dialog — choose “Save as PDF”.',
    icon: Printer,
    best: 'Read-only',
  },
];

const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  onClose,
  data,
  initialSelection,
  statusFilters = {},
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [format, setFormat] = useState<ExportFormat>('xlsx');
  const [applyStatusFilter, setApplyStatusFilter] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  /* ---- reset when opened ---- */
  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setResult(null);
    setBusy(false);
    setFormat('xlsx');
    setApplyStatusFilter(false);
    setFromDate('');
    setToDate('');
    setSelected(
      initialSelection && initialSelection.length > 0
        ? initialSelection
        : EXPORT_SECTIONS.map((s) => s.id)
    );
  }, [isOpen, initialSelection]);

  /* ---- scroll lock + escape ---- */
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  /* ---- counts per section ---- */
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    EXPORT_SECTIONS.forEach((def) => {
      const rows = data[def.id];
      map[def.id] = Array.isArray(rows) ? rows.length : 0;
    });
    return map;
  }, [data]);

  const totalRows = EXPORT_SECTIONS.reduce((s, d) => s + (counts[d.id] || 0), 0);
  const selectedRows = selected.reduce((s, id) => s + (counts[id] || 0), 0);
  const allSelected = selected.length === EXPORT_SECTIONS.length;

  const toggleSection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : EXPORT_SECTIONS.map((s) => s.id));
  };

  const activeStatusSections = EXPORT_SECTIONS.filter((d) => {
    const status = statusFilters[d.id];
    return status && status !== 'all';
  });

  const buildTables = (): ExportTable[] => {
    const options = { from: fromDate || undefined, to: toDate || undefined };
    return EXPORT_SECTIONS.filter((def) => selected.includes(def.id)).map((def) =>
      buildExportTable(def, data[def.id] || [], {
        ...options,
        statusFilter: applyStatusFilter ? statusFilters[def.id] : undefined,
      })
    );
  };

  const handleExport = () => {
    if (selected.length === 0) {
      setResult({ ok: false, message: 'Select at least one section first.' });
      return;
    }
    setBusy(true);
    setResult(null);

    // Let the button paint its busy state before the (synchronous) work.
    window.setTimeout(() => {
      try {
        const tables = buildTables();
        const filterBits: string[] = [];
        if (applyStatusFilter && activeStatusSections.length > 0) {
          filterBits.push(
            `status = ${activeStatusSections
              .map((d) => `${d.label}: ${statusFilters[d.id]}`)
              .join(', ')}`
          );
        }
        if (fromDate || toDate) {
          filterBits.push(`date ${fromDate || 'start'} → ${toDate || 'today'}`);
        }

        const outcome = exportTables(tables, format, {
          generatedAt: new Date().toLocaleString('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
          generatedBy:
            (typeof localStorage !== 'undefined' &&
              localStorage.getItem('currentMailUser') &&
              (() => {
                try {
                  const u = JSON.parse(localStorage.getItem('currentMailUser') as string);
                  return u?.name || u?.email || 'Vintage Dashboard admin';
                } catch {
                  return 'Vintage Dashboard admin';
                }
              })()) ||
            'Vintage Dashboard admin',
          filters: filterBits.join(' · '),
          sections: tables.map((t) => t.label),
        });

        setResult(outcome);
        if (outcome.ok && format !== 'pdf') {
          window.setTimeout(() => onClose(), 1400);
        }
      } catch (err) {
        setResult({
          ok: false,
          message:
            err instanceof Error ? `Export failed: ${err.message}` : 'Export failed unexpectedly.',
        });
      } finally {
        setBusy(false);
      }
    }, 60);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2
              id="export-modal-title"
              className="flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg"
            >
              <Download className="h-5 w-5 flex-shrink-0 text-green-600" />
              Export dashboard data
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              {step === 1
                ? 'Choose which sections the data team should receive.'
                : 'Choose the file format for the download.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="-mr-1 flex-shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            title="Close"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex flex-shrink-0 items-center gap-2 border-b bg-gray-50 px-4 py-2 text-xs sm:px-6">
          <span
            className={`inline-flex items-center gap-1.5 font-semibold ${
              step === 1 ? 'text-green-700' : 'text-gray-400'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                step === 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
              }`}
            >
              {step === 2 ? <Check className="h-3 w-3" /> : '1'}
            </span>
            Sections
          </span>
          <div className="h-px flex-1 bg-gray-200" />
          <span
            className={`inline-flex items-center gap-1.5 font-semibold ${
              step === 2 ? 'text-green-700' : 'text-gray-400'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                step === 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </span>
            Format
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {step === 1 ? (
            <div className="space-y-3">
              {/* Select all */}
              <button
                type="button"
                onClick={toggleAll}
                className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors ${
                  allSelected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/40'
                }`}
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${
                    allSelected
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {allSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">
                    All sections
                  </span>
                  <span className="block text-xs text-gray-500">
                    {EXPORT_SECTIONS.length} sections · {totalRows} records total
                  </span>
                </span>
                <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                  {selected.length}/{EXPORT_SECTIONS.length}
                </span>
              </button>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {EXPORT_SECTIONS.map((def) => {
                  const checked = selected.includes(def.id);
                  const count = counts[def.id] || 0;
                  return (
                    <button
                      type="button"
                      key={def.id}
                      onClick={() => toggleSection(def.id)}
                      className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition-colors ${
                        checked
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 ${
                          checked
                            ? 'border-green-600 bg-green-600 text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-1">
                          <span className="truncate text-[13px] font-semibold text-gray-900">
                            {def.label}
                          </span>
                          <span
                            className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                              count > 0
                                ? 'bg-white text-green-700 ring-1 ring-green-200'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {count}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-gray-500">
                          {def.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="pt-1 text-[11px] leading-relaxed text-gray-500">
                Every database field is exported — not just the columns shown on screen — so the
                data team receives the full record.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formats */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {FORMATS.map((opt) => {
                  const Icon = opt.icon;
                  const active = format === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setFormat(opt.id)}
                      className={`relative flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors ${
                        active
                          ? 'border-green-500 bg-green-50 ring-1 ring-green-200'
                          : 'border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                          active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[13px] font-semibold text-gray-900">
                            {opt.label}
                          </span>
                          <span className="rounded bg-gray-100 px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-500">
                            {opt.extension}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-gray-500">
                          {opt.description}
                        </span>
                        <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-green-700">
                          {opt.best}
                        </span>
                      </span>
                      {active && (
                        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-white">
                          <Check className="h-2.5 w-2.5" strokeWidth={4} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Options */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Options
                </p>

                <label
                  className={`flex items-start gap-2.5 ${
                    activeStatusSections.length === 0 ? 'opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={applyStatusFilter}
                    disabled={activeStatusSections.length === 0}
                    onChange={(e) => setApplyStatusFilter(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium text-gray-800">
                      Apply the current status filters
                    </span>
                    <span className="block text-[11px] text-gray-500">
                      {activeStatusSections.length === 0
                        ? 'No status filter is active on the dashboard right now.'
                        : `Only rows matching: ${activeStatusSections
                            .map((d) => `${d.label} = ${statusFilters[d.id]}`)
                            .join(', ')}`}
                    </span>
                  </span>
                </label>

                <div className="mt-3 border-t border-gray-200 pt-3">
                  <p className="mb-1.5 text-[13px] font-medium text-gray-800">
                    Date range <span className="font-normal text-gray-500">(optional)</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-xs focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      aria-label="From date"
                    />
                    <span className="text-xs text-gray-400">to</span>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-xs focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      aria-label="To date"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Filters on each section&apos;s own date field (created_at, event_date, …).
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-[11px] text-green-800">
                <span className="font-semibold">
                  {selected.length} section{selected.length === 1 ? '' : 's'}
                </span>
                <span className="text-green-600">·</span>
                <span>{selectedRows} records selected</span>
                <span className="text-green-600">·</span>
                <span className="uppercase">{FORMATS.find((f) => f.id === format)?.extension}</span>
              </div>

              {result && (
                <div
                  className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
                    result.ok
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {result.ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{result.message}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between gap-2 border-t bg-gray-50 px-4 py-3 sm:px-6">
          {step === 1 ? (
            <>
              <span className="text-[11px] text-gray-500">
                {selected.length === 0
                  ? 'Nothing selected'
                  : `${selectedRows} record${selectedRows === 1 ? '' : 's'} ready`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={selected.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
                >
                  Choose format
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setResult(null);
                  setStep(1);
                }}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 sm:text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleExport}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60 sm:px-4 sm:text-sm"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {busy ? 'Preparing…' : 'Export data'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportDataModal;
