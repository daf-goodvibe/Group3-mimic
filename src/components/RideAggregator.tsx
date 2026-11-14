import React, { useMemo, useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  ArrowUpDown,
  CarFront,
  CheckCircle2,
  Dog,
  Info,
  MapPin,
  PawPrint,
  Star,
  Timer,
  TrendingDown,
} from 'lucide-react';
import {
  computeOperatorQuotes,
  OperatorQuote,
  RidePreference,
  ROUTE_PRESETS,
  SINGAPORE_LOCATIONS,
  SortMode,
  TimeWindow,
} from '../data/platformData';
import { GoogleRouteMap } from './GoogleRouteMap';

export interface ActiveBooking {
  quote: OperatorQuote;
  fromName: string;
  toName: string;
  pickupTip: string;
  costCenter?: string;
  stage: 'matching' | 'assigned' | 'arriving';
  bookedAt: string;
}

interface RideAggregatorProps {
  timeWindow: TimeWindow;
  fromId: string;
  toId: string;
  onChangeFrom: (id: string) => void;
  onChangeTo: (id: string) => void;
  activeBooking: ActiveBooking | null;
  onBookRide: (quote: OperatorQuote) => void;
  onAdvanceBooking: () => void;
  onCancelBooking: () => void;
}

export const RideAggregator: React.FC<RideAggregatorProps> = ({
  timeWindow,
  fromId,
  toId,
  onChangeFrom,
  onChangeTo,
  activeBooking,
  onBookRide,
  onAdvanceBooking,
  onCancelBooking,
}) => {
  const [preferences, setPreferences] = useState<RidePreference[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>('cheapest');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [liveRouteStats, setLiveRouteStats] = useState<{
    distanceKm: number;
    durationMin: number;
  } | null>(null);

  const fromLoc =
    SINGAPORE_LOCATIONS.find((l) => l.id === fromId) ?? SINGAPORE_LOCATIONS[0];
  const toLoc =
    SINGAPORE_LOCATIONS.find((l) => l.id === toId) ?? SINGAPORE_LOCATIONS[6];

  const matchingPreset = ROUTE_PRESETS.find(
    (p) => p.fromId === fromId && p.toId === toId
  );

  const featuredPresets = ROUTE_PRESETS.slice(0, 4);

  const togglePreference = (pref: RidePreference) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const quotes = useMemo(() => {
    const raw = computeOperatorQuotes(fromId, toId, timeWindow, preferences, 'adult');
    const sorted = [...raw];
    if (sortMode === 'cheapest') {
      sorted.sort((a, b) => a.totalFare - b.totalFare || a.etaMinutes - b.etaMinutes);
    } else if (sortMode === 'fastest') {
      sorted.sort((a, b) => a.etaMinutes - b.etaMinutes || a.totalFare - b.totalFare);
    } else {
      sorted.sort(
        (a, b) =>
          a.totalFare * 0.7 + a.etaMinutes * 1.1 - (b.totalFare * 0.7 + b.etaMinutes * 1.1)
      );
    }
    return sorted;
  }, [fromId, toId, timeWindow, preferences, sortMode]);

  const selectedQuote =
    quotes.find((q) => q.id === selectedQuoteId) ?? quotes[0] ?? null;

  const maxFare = quotes.length > 0 ? Math.max(...quotes.map((q) => q.totalFare)) : 0;
  const minFare = quotes.length > 0 ? Math.min(...quotes.map((q) => q.totalFare)) : 0;
  const maxSavings = +(maxFare - minFare).toFixed(2);
  const fastestEta = quotes.length > 0 ? Math.min(...quotes.map((q) => q.etaMinutes)) : 0;

  const handleSwap = () => {
    const prevFrom = fromId;
    onChangeFrom(toId);
    onChangeTo(prevFrom);
  };

  const prefOptions: {
    id: RidePreference;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'highRated',
      label: '4.9★+ Drivers',
      icon: <Star className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    {
      id: 'petFriendly',
      label: 'Pet-Friendly',
      icon: <PawPrint className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    {
      id: 'wheelchairFriendly',
      label: 'Wheelchair-Friendly',
      icon: <Accessibility className="w-3.5 h-3.5" aria-hidden="true" />,
    },
  ];

  return (
    <section id="ride-compare" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Route Input & Presets Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Live Operator Comparison
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Compare Grab, Gojek, Ryde, Tada, and Zig side by side with ERP tolls and peak demand factored in.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Popular routes:</span>
            {featuredPresets.map((preset) => {
              const isCurrent = preset.fromId === fromId && preset.toId === toId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onChangeFrom(preset.fromId);
                    onChangeTo(preset.toId);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Origin / Destination Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div>
            <label
              htmlFor="pickup-select"
              className="block text-xs font-medium text-slate-600 mb-1.5"
            >
              Pickup location
            </label>
            <div className="relative">
              <MapPin
                className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="pickup-select"
                value={fromId}
                onChange={(e) => onChangeFrom(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                {SINGAPORE_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.district})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap pickup and dropoff locations"
            className="h-11 px-3 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <ArrowUpDown className="w-4 h-4" aria-hidden="true" />
          </button>

          <div>
            <label
              htmlFor="dropoff-select"
              className="block text-xs font-medium text-slate-600 mb-1.5"
            >
              Dropoff destination
            </label>
            <div className="relative">
              <MapPin
                className="w-4 h-4 text-slate-700 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="dropoff-select"
                value={toId}
                onChange={(e) => onChangeTo(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                {SINGAPORE_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.district})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ride Personalisation & Sort Controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1">
              Ride personalisation:
            </span>
            {prefOptions.map((opt) => {
              const active = preferences.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => togglePreference(opt.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                    active
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              );
            })}
            {preferences.length > 0 && (
              <button
                type="button"
                onClick={() => setPreferences([])}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-slate-500">Rank by:</span>
            <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
              {(
                [
                  { id: 'cheapest', label: 'Cheapest' },
                  { id: 'fastest', label: 'Fastest ETA' },
                  { id: 'bestMatch', label: 'Best Balance' },
                ] as { id: SortMode; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSortMode(tab.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    sortMode === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-Column Visual Workspace: Comparison Table + Google Map + Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Peak Savings Spotlight + Visual Operator Fare Comparison */}
        <div className="lg:col-span-7 space-y-4">
          {quotes.length > 0 && (
            <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <TrendingDown className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-300">
                    Peak-Hour Cost &amp; Wait Optimizer
                  </p>
                  <p className="text-sm text-slate-100 mt-0.5">
                    {matchingPreset
                      ? `${matchingPreset.corridorName}: ${matchingPreset.suggestedWindow}`
                      : `Comparing ${quotes.length} live Singapore fleets from ${fromLoc.district} to ${toLoc.district}.`}
                  </p>
                </div>
              </div>
              <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0 font-mono tabular-nums border-t sm:border-t-0 pt-3 sm:pt-0 border-emerald-900">
                <span className="text-lg font-bold text-emerald-400">
                  Save S${maxSavings.toFixed(2)}
                </span>
                <span className="text-xs text-slate-300">
                  Fastest {fastestEta} min pickup
                </span>
              </div>
            </div>
          )}

          {/* Operator Quotes Visual List */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {quotes.length === 0 ? (
              <div className="p-10 text-center">
                <Dog className="w-8 h-8 text-slate-400 mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-display text-base font-semibold text-slate-900">
                  No single operator matches every filter simultaneously
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Try clearing either Pet-Friendly or Wheelchair-Friendly to view available fleets.
                </p>
                <button
                  type="button"
                  onClick={() => setPreferences([])}
                  className="mt-4 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Reset Ride Filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {quotes.map((quote) => {
                  const isSelected = selectedQuote?.id === quote.id;
                  const deltaFromMin = +(quote.totalFare - minFare).toFixed(2);
                  const barRatio =
                    maxFare > 0 ? Math.max(28, Math.round((quote.totalFare / maxFare) * 100)) : 100;
                  const displayTripMin = liveRouteStats?.durationMin ?? quote.tripMinutes;

                  return (
                    <div
                      key={quote.id}
                      onClick={() => setSelectedQuoteId(quote.id)}
                      className={`p-5 transition-colors duration-150 cursor-pointer ${
                        isSelected ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Operator Identity */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center font-display text-xs font-extrabold text-white shrink-0"
                            style={{ backgroundColor: quote.brandColor }}
                            aria-hidden="true"
                          >
                            {quote.monogram}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-base font-bold text-slate-900">
                                {quote.operatorName}
                              </span>
                              <span className="text-sm font-medium text-slate-600 truncate">
                                {quote.serviceName}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span>
                                {quote.driverName} ·{' '}
                                <span className="font-mono tabular-nums text-slate-700 font-medium">
                                  {quote.driverRating.toFixed(2)}★
                                </span>
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1">
                                <CarFront className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                {quote.vehicleClass}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price + ETA + Action */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                          <div className="text-left sm:text-right">
                            <span className="font-mono tabular-nums text-sm font-semibold text-slate-900 block">
                              {quote.etaMinutes} min ETA
                            </span>
                            <span className="font-mono tabular-nums text-xs text-slate-500 block">
                              ~{displayTripMin} min drive
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-mono tabular-nums text-lg font-extrabold text-slate-900 block">
                              S${quote.totalFare.toFixed(2)}
                            </span>
                            <span
                              className={`font-mono tabular-nums text-xs block font-semibold ${
                                deltaFromMin === 0 ? 'text-emerald-700' : 'text-slate-500'
                              }`}
                            >
                              {deltaFromMin === 0
                                ? 'Lowest fare'
                                : `+S$${deltaFromMin.toFixed(2)}`}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuoteId(quote.id);
                              onBookRide(quote);
                            }}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                              isSelected
                                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                          >
                            Book
                          </button>
                        </div>
                      </div>

                      {/* Visual Fare Comparison Bar & Highlight */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${barRatio}%`,
                              backgroundColor: quote.isCheapest ? '#059669' : quote.brandColor,
                            }}
                          />
                        </div>
                        <div className="text-xs text-slate-500 shrink-0 flex items-center gap-2">
                          {quote.isCheapest && (
                            <span className="font-semibold text-emerald-700">Cheapest</span>
                          )}
                          {quote.isCheapest && quote.isFastest && <span aria-hidden="true">·</span>}
                          {quote.isFastest && (
                            <span className="font-semibold text-slate-900">Fastest</span>
                          )}
                          {!quote.isCheapest && !quote.isFastest && (
                            <span className="hidden sm:inline">{quote.cancellationNote}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Live Google Maps Route Visual + Dispatch Breakdown */}
        <aside id="route-map" className="lg:col-span-5 space-y-4">
          <GoogleRouteMap
            originName={fromLoc.name}
            originAddress={fromLoc.address}
            originTip={fromLoc.pickupBayTip}
            destinationName={toLoc.name}
            destinationAddress={toLoc.address}
            heightClass="h-[300px] sm:h-[340px]"
            onRouteStats={setLiveRouteStats}
          />

          {activeBooking ? (
            <div className="bg-white border border-emerald-300 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {activeBooking.stage === 'matching'
                      ? 'Confirming Operator Dispatch'
                      : activeBooking.stage === 'assigned'
                        ? 'Driver Confirmed'
                        : 'Driver Arriving at Bay'}
                  </h3>
                </div>
                <span className="font-mono text-xs tabular-nums text-slate-500">
                  {activeBooking.bookedAt}
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Operator</span>
                  <span className="font-semibold text-slate-900">
                    {activeBooking.quote.operatorName} · {activeBooking.quote.serviceName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Driver</span>
                  <span className="font-medium text-slate-900">
                    {activeBooking.quote.driverName} ({activeBooking.quote.driverRating.toFixed(2)}★)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Guaranteed Fare</span>
                  <span className="font-mono tabular-nums font-bold text-slate-900">
                    S${activeBooking.quote.totalFare.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                <strong className="block font-semibold text-slate-900 mb-0.5">
                  Pickup Bay Instruction
                </strong>
                {activeBooking.pickupTip}
              </div>

              <div className="mt-4 flex items-center gap-2">
                {activeBooking.stage !== 'arriving' && (
                  <button
                    type="button"
                    onClick={onAdvanceBooking}
                    className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Simulate Next Status
                  </button>
                )}
                <button
                  type="button"
                  onClick={onCancelBooking}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel Trip
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Fare Breakdown &amp; Pickup Tip
                </h3>
                {selectedQuote && (
                  <span className="text-xs font-semibold text-emerald-700">
                    {selectedQuote.operatorName}
                  </span>
                )}
              </div>

              {selectedQuote && (
                <>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Base distance fare</span>
                      <span className="font-mono tabular-nums text-slate-900">
                        S${selectedQuote.baseFare.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Peak demand adjustment</span>
                      <span className="font-mono tabular-nums text-slate-900">
                        S${selectedQuote.surgeAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Estimated ERP gantry toll</span>
                      <span className="font-mono tabular-nums text-slate-900">
                        S${selectedQuote.erpToll.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-semibold text-slate-900">
                      <span>Upfront total</span>
                      <span className="font-mono tabular-nums text-lg">
                        S${selectedQuote.totalFare.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                    <Timer className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{fromLoc.pickupBayTip}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookRide(selectedQuote)}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
                  >
                    <span>
                      Dispatch {selectedQuote.operatorName} ({selectedQuote.etaMinutes} min)
                    </span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </>
              )}

              {matchingPreset && (
                <div className="mt-3 flex items-start gap-2 text-xs text-slate-500">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{matchingPreset.insiderTip}</span>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};
