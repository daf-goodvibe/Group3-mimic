import React from 'react';
import { ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import { CorporateTripRecord } from '../data/platformData';

interface CorporateBenefitsSectionProps {
  trips: CorporateTripRecord[];
  onBackToMain: () => void;
}

export const CorporateBenefitsSection: React.FC<CorporateBenefitsSectionProps> = ({
  trips,
  onBackToMain,
}) => {
  const monthlyAllowance = 320.0;
  const totalSpent = trips.reduce((sum, t) => sum + t.fareSgd, 0);
  const totalSaved = trips.reduce((sum, t) => sum + t.savedVsPeakSgd, 0);
  const remaining = Math.max(0, monthlyAllowance - totalSpent);

  const handleExportCsv = () => {
    const header = [
      'Trip ID',
      'Date',
      'Route',
      'Operator',
      'Service',
      'Cost Center',
      'Fare (SGD)',
      'Peak Savings (SGD)',
      'Status',
    ];
    const rows = trips.map((t) => [
      t.id,
      t.date,
      `"${t.route}"`,
      t.operator,
      t.service,
      t.costCenter,
      t.fareSgd.toFixed(2),
      t.savedVsPeakSgd.toFixed(2),
      t.status,
    ]);
    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'anchorsg-corporate-mobility-gst.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="corporate-hub"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackToMain}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Ride Compare &amp; News</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-emerald-700 mb-1">
            Employee Mobility Benefit Program
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Corporate Allowance &amp; GST Expense Hub
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Unified company ride benefits across Grab, Gojek, Tada, and Zig with automated cost-center logging.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Export GST CSV</span>
        </button>
      </div>

      {/* 4-Column Allowance Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <span className="text-xs font-medium text-slate-500">Monthly Benefit Cap</span>
          <p className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-1">
            S${monthlyAllowance.toFixed(2)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            Nov 2026 · Auto-renews 1st
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <span className="text-xs font-medium text-slate-500">Utilised This Month</span>
          <p className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-1">
            S${totalSpent.toFixed(2)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {trips.length} policy-verified rides
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <span className="text-xs font-medium text-slate-500">Remaining Balance</span>
          <p className="font-mono tabular-nums text-2xl font-bold text-emerald-700 mt-1">
            S${remaining.toFixed(2)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            Max S$35.00 per single trip
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <span className="text-xs font-medium text-slate-500">Peak Surge Saved</span>
          <p className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-1">
            S${totalSaved.toFixed(2)}
          </p>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            Via multi-operator routing
          </span>
        </div>
      </div>

      {/* Policy Note + Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>
              Policy: Auto-selects cheapest compliant ride across Grab, Gojek, Tada &amp; Zig · Wheelchair/Assist overrides surge cap.
            </span>
          </div>
          <span className="font-mono text-slate-500 shrink-0">GST Reg: 2019-ANCHOR-SG</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="py-3 px-5">Trip ID</th>
                <th className="py-3 px-5">Date &amp; Time</th>
                <th className="py-3 px-5">Route</th>
                <th className="py-3 px-5">Operator</th>
                <th className="py-3 px-5">Cost Center</th>
                <th className="py-3 px-5 text-right">Peak Saved</th>
                <th className="py-3 px-5 text-right">Fare (SGD)</th>
                <th className="py-3 px-5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-5 font-mono text-xs text-slate-500 whitespace-nowrap">
                    {trip.id}
                  </td>
                  <td className="py-3 px-5 font-mono text-xs tabular-nums text-slate-600 whitespace-nowrap">
                    {trip.date}
                  </td>
                  <td className="py-3 px-5 font-medium text-slate-900 whitespace-nowrap">
                    {trip.route}
                  </td>
                  <td className="py-3 px-5 text-slate-700 whitespace-nowrap">
                    {trip.operator} · {trip.service}
                  </td>
                  <td className="py-3 px-5 text-slate-600 whitespace-nowrap">
                    {trip.costCenter}
                  </td>
                  <td className="py-3 px-5 font-mono tabular-nums text-right text-emerald-700 whitespace-nowrap">
                    -S${trip.savedVsPeakSgd.toFixed(2)}
                  </td>
                  <td className="py-3 px-5 font-mono tabular-nums font-semibold text-right text-slate-900 whitespace-nowrap">
                    S${trip.fareSgd.toFixed(2)}
                  </td>
                  <td className="py-3 px-5 text-right text-xs font-medium whitespace-nowrap">
                    <span
                      className={
                        trip.status === 'Approved' ? 'text-emerald-700' : 'text-amber-700'
                      }
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
