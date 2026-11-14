export type CustomerSegment = 'adult' | 'tourist' | 'corporate';

export type TimeWindow = 'morning_peak' | 'midday' | 'evening_peak' | 'late_night';

export type RidePreference = 'highRated' | 'petFriendly' | 'wheelchairFriendly';

export type SortMode = 'cheapest' | 'fastest' | 'bestMatch';

export type OperatorId = 'grab' | 'gojek' | 'ryde' | 'tada' | 'zig';

export interface SingaporeLocation {
  id: string;
  name: string;
  address: string;
  district: string;
  pickupBayTip: string;
  coordinates: { x: number; y: number };
}

export interface RoutePreset {
  id: string;
  segment: CustomerSegment;
  label: string;
  fromId: string;
  toId: string;
  distanceKm: number;
  baseMinutes: number;
  erpCharge: number;
  corridorName: string;
  insiderTip: string;
  suggestedWindow: string;
}

export interface OperatorQuote {
  id: string;
  operatorId: OperatorId;
  operatorName: string;
  brandColor: string;
  monogram: string;
  serviceName: string;
  vehicleClass: string;
  driverName: string;
  driverRating: number;
  completedTrips: number;
  etaMinutes: number;
  tripMinutes: number;
  baseFare: number;
  surgeAmount: number;
  erpToll: number;
  totalFare: number;
  isCheapest: boolean;
  isFastest: boolean;
  supportsHighRated: boolean;
  supportsPetFriendly: boolean;
  supportsWheelchairFriendly: boolean;
  corporateEligible: boolean;
  cancellationNote: string;
}

export interface TouristRouteGuide {
  id: string;
  title: string;
  fromId: string;
  toId: string;
  corridor: string;
  bestTimePrompt: string;
  trafficCondition: 'Smooth' | 'Moderate Peak' | 'Rain / Heavy Surge';
  estimatedSavings: string;
  insiderTip: string;
  pickupInstruction: string;
  highlights: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  fullBody: string[];
  source: string;
  relatedSources: string[];
  publishedAgo: string;
  readTime: string;
  topic: 'Transport & ERP' | 'Business & Tech' | 'Singapore Culture' | 'Travel & Dining' | 'Corporate Policy';
  segments: CustomerSegment[];
  illustration: 'skyline' | 'mrt' | 'changi' | 'cbd';
  impactNote: string;
  pushEligible: boolean;
}

export interface CorporateTripRecord {
  id: string;
  date: string;
  route: string;
  operator: string;
  service: string;
  costCenter: string;
  fareSgd: number;
  savedVsPeakSgd: number;
  status: 'Approved' | 'Pending Receipt';
}

export const SINGAPORE_LOCATIONS: SingaporeLocation[] = [
  {
    id: 'raffles_place',
    name: 'Raffles Place / MBFC Tower 2',
    address: 'Marina Bay Financial Centre Tower 2, Singapore',
    district: 'CBD Core',
    pickupBayTip: 'Use Marina Boulevard Driveway B for 2-min faster pickup during 18:00 rush.',
    coordinates: { x: 430, y: 270 },
  },
  {
    id: 'changi_t3',
    name: 'Changi Airport Terminal 3',
    address: 'Changi Airport Terminal 3, Singapore',
    district: 'East',
    pickupBayTip: 'Arrival Pick-up Bay Door 4 has lower taxi/PHV queue congestion than Door 1.',
    coordinates: { x: 740, y: 185 },
  },
  {
    id: 'orchard_ion',
    name: 'Orchard Road (ION / Paterson)',
    address: 'ION Orchard, 2 Orchard Turn, Singapore',
    district: 'Central',
    pickupBayTip: 'Walk 90m to Orchard Turn drop-off bay to bypass main Orchard Rd bus-lane bottlenecks.',
    coordinates: { x: 350, y: 195 },
  },
  {
    id: 'marina_bay_sands',
    name: 'Marina Bay Sands (Tower 1)',
    address: 'Marina Bay Sands Hotel, 10 Bayfront Avenue, Singapore',
    district: 'Marina Bay',
    pickupBayTip: 'Choose Bayfront Avenue North entrance; casino porte-cochère backs up after 17:30.',
    coordinates: { x: 485, y: 280 },
  },
  {
    id: 'one_north',
    name: 'one-north / Fusionopolis',
    address: 'Fusionopolis Way, one-north, Singapore',
    district: 'West Tech Belt',
    pickupBayTip: 'Galaxis North driveway gives quickest exit onto AYE toward city.',
    coordinates: { x: 215, y: 235 },
  },
  {
    id: 'sentosa_rws',
    name: 'Sentosa Resorts World',
    address: 'Resorts World Sentosa, 8 Sentosa Gateway, Singapore',
    district: 'Southern Islands',
    pickupBayTip: 'Basement 1 Coach & Ride-Hail Zone avoids S$6 island gantry re-entry loops.',
    coordinates: { x: 345, y: 360 },
  },
  {
    id: 'tampines_hub',
    name: 'Our Tampines Hub',
    address: 'Our Tampines Hub, 1 Tampines Walk, Singapore',
    district: 'East Regional',
    pickupBayTip: 'Tampines Walk Pick-up Point C connects straight to PIE Westbound.',
    coordinates: { x: 640, y: 160 },
  },
  {
    id: 'little_india',
    name: 'Little India / Tekka Centre',
    address: 'Tekka Centre, Bukit Timah Road, Singapore',
    district: 'Heritage District',
    pickupBayTip: 'Buffalo Road side lane avoids Serangoon Road evening pedestrian crowds.',
    coordinates: { x: 435, y: 175 },
  },
  {
    id: 'gardens_bay',
    name: 'Gardens by the Bay (Main Entrance)',
    address: 'Gardens by the Bay, 18 Marina Gardens Drive, Singapore',
    district: 'Marina South',
    pickupBayTip: 'Golden Garden pick-up bay clears faster than Supertree Grove after 20:45 light show.',
    coordinates: { x: 530, y: 295 },
  },
  {
    id: 'jurong_east',
    name: 'Jurong East (JEM / Westgate)',
    address: 'Westgate, 3 Gateway Drive, Singapore',
    district: 'West Regional',
    pickupBayTip: 'Venture Drive Westgate Taxi Stand saves 4 mins over Boon Lay Way.',
    coordinates: { x: 135, y: 200 },
  },
];

export const ROUTE_PRESETS: RoutePreset[] = [
  {
    id: 'adult_cbd_home',
    segment: 'adult',
    label: 'Raffles Place → Tampines Hub',
    fromId: 'raffles_place',
    toId: 'tampines_hub',
    distanceKm: 18.4,
    baseMinutes: 23,
    erpCharge: 2.0,
    corridorName: 'ECP → PIE East',
    insiderTip: 'Tada zero-commission drivers accept fastest along Marina Coastal Expressway between 18:00–19:15.',
    suggestedWindow: 'Leave before 17:50 or after 19:10 to skip S$2.00 MCE ERP.',
  },
  {
    id: 'adult_tech_cbd',
    segment: 'adult',
    label: 'one-north → Raffles Place',
    fromId: 'one_north',
    toId: 'raffles_place',
    distanceKm: 10.6,
    baseMinutes: 16,
    erpCharge: 1.5,
    corridorName: 'AYE → Keppel Viaduct',
    insiderTip: 'Zig street-hail metered taxis often beat dynamic PHV surge on AYE morning inbound.',
    suggestedWindow: 'Optimal dispatch at 08:40 once school-zone peak clears.',
  },
  {
    id: 'tourist_changi_mbs',
    segment: 'tourist',
    label: 'Changi T3 → Marina Bay Sands',
    fromId: 'changi_t3',
    toId: 'marina_bay_sands',
    distanceKm: 19.2,
    baseMinutes: 21,
    erpCharge: 1.0,
    corridorName: 'ECP Scenic Waterfront',
    insiderTip: 'Airport surcharge applies (+S$6–8 on taxis). Fixed-fare PHVs via Tada or Grab avoid meter crawl.',
    suggestedWindow: '10:30–16:00 delivers unobstructed Singapore Strait views along ECP.',
  },
  {
    id: 'tourist_orchard_sentosa',
    segment: 'tourist',
    label: 'Orchard ION → Sentosa RWS',
    fromId: 'orchard_ion',
    toId: 'sentosa_rws',
    distanceKm: 8.9,
    baseMinutes: 17,
    erpCharge: 1.0,
    corridorName: 'CTE → Lower Delta → Sentosa Gateway',
    insiderTip: 'Sentosa gantry fee is waived for drop-offs via VivoCity/HarbourFront or included in fixed quote.',
    suggestedWindow: 'Depart at 09:45 before 11:00 attraction opening queues.',
  },
  {
    id: 'corporate_cbd_changi',
    segment: 'corporate',
    label: 'MBFC Tower 2 → Changi Terminal 3',
    fromId: 'raffles_place',
    toId: 'changi_t3',
    distanceKm: 20.1,
    baseMinutes: 22,
    erpCharge: 2.0,
    corridorName: 'MCE → ECP Express',
    insiderTip: 'Policy-compliant fixed corporate fare locks receipt GST breakdown automatically.',
    suggestedWindow: 'Buffer +12 mins on Friday 17:30–19:30 ECP outbound.',
  },
  {
    id: 'corporate_jurong_cbd',
    segment: 'corporate',
    label: 'Jurong East → Raffles Place',
    fromId: 'jurong_east',
    toId: 'raffles_place',
    distanceKm: 17.5,
    baseMinutes: 24,
    erpCharge: 2.5,
    corridorName: 'AYE Express Corridor',
    insiderTip: 'Pre-matching 4.9★+ executive drivers reduces client-meeting arrival variance to ±2 min.',
    suggestedWindow: '08:15 peak requires +6 min AYE Clementi merge allowance.',
  },
];

export const TIME_WINDOWS: {
  id: TimeWindow;
  label: string;
  clock: string;
  surgeLabel: string;
  multiplier: number;
  etaBonus: number;
}[] = [
  {
    id: 'morning_peak',
    label: 'Morning Rush',
    clock: '08:15 SGT',
    surgeLabel: 'High Demand · ERP Active',
    multiplier: 1.32,
    etaBonus: 3,
  },
  {
    id: 'midday',
    label: 'Midday Smooth',
    clock: '14:15 SGT',
    surgeLabel: 'Standard Fare · Fast Dispatch',
    multiplier: 1.0,
    etaBonus: 0,
  },
  {
    id: 'evening_peak',
    label: 'Evening Peak',
    clock: '18:20 SGT',
    surgeLabel: 'Peak Surge · Rain Advisory',
    multiplier: 1.44,
    etaBonus: 4,
  },
  {
    id: 'late_night',
    label: 'Late Night',
    clock: '23:30 SGT',
    surgeLabel: 'Night Surcharge Window',
    multiplier: 1.24,
    etaBonus: 2,
  },
];

export function computeOperatorQuotes(
  fromId: string,
  toId: string,
  timeWindow: TimeWindow,
  preferences: RidePreference[],
  segment: CustomerSegment
): OperatorQuote[] {
  const fromIdx = SINGAPORE_LOCATIONS.findIndex((l) => l.id === fromId);
  const toIdx = SINGAPORE_LOCATIONS.findIndex((l) => l.id === toId);
  const seed = Math.abs(fromIdx - toIdx) + (fromIdx + 1) * 0.7;
  const distanceKm = fromId === toId ? 3.5 : Math.max(5.4, Math.min(24.5, 6.2 + seed * 2.1));
  const baseMinutes = Math.round(distanceKm * 1.25 + 5);

  const windowConfig = TIME_WINDOWS.find((w) => w.id === timeWindow) ?? TIME_WINDOWS[2];
  const isPeak = timeWindow === 'morning_peak' || timeWindow === 'evening_peak';
  const erpToll = isPeak ? 2.0 : 0.0;
  const airportFee = fromId === 'changi_t3' || toId === 'changi_t3' ? 5.0 : 0.0;

  const hasPet = preferences.includes('petFriendly');
  const hasWheelchair = preferences.includes('wheelchairFriendly');
  const hasHighRated = preferences.includes('highRated');

  const baseTripCost = 4.2 + distanceKm * 0.92 + airportFee;

  const rawOperators: Array<{
    operatorId: OperatorId;
    operatorName: string;
    brandColor: string;
    monogram: string;
    serviceName: string;
    vehicleClass: string;
    driverName: string;
    driverRating: number;
    completedTrips: number;
    priceFactor: number;
    surgeFactor: number;
    baseEta: number;
    supportsHighRated: boolean;
    supportsPetFriendly: boolean;
    supportsWheelchairFriendly: boolean;
    corporateEligible: boolean;
    cancellationNote: string;
  }> = [
    {
      operatorId: 'tada',
      operatorName: 'Tada',
      brandColor: '#2563EB',
      monogram: 'TD',
      serviceName: hasPet ? 'TADA Pets' : 'AnyTADA Fair',
      vehicleClass: 'Hybrid Sedan',
      driverName: 'Marcus Tan',
      driverRating: 4.94,
      completedTrips: 3180,
      priceFactor: 0.92,
      surgeFactor: 0.78,
      baseEta: 4,
      supportsHighRated: true,
      supportsPetFriendly: true,
      supportsWheelchairFriendly: false,
      corporateEligible: true,
      cancellationNote: 'Zero platform commission · 4 min grace',
    },
    {
      operatorId: 'zig',
      operatorName: 'Zig',
      brandColor: '#0284C7',
      monogram: 'ZG',
      serviceName: hasWheelchair ? 'Zig Medifleet' : hasPet ? 'Zig Pet Taxi' : 'CDG Zig Fixed',
      vehicleClass: hasWheelchair ? 'WAV Accessible Van' : 'Hyundai Ioniq Taxi',
      driverName: 'Suresh Nair',
      driverRating: 4.96,
      completedTrips: 6420,
      priceFactor: 0.97,
      surgeFactor: 0.72,
      baseEta: 3,
      supportsHighRated: true,
      supportsPetFriendly: true,
      supportsWheelchairFriendly: true,
      corporateEligible: true,
      cancellationNote: 'Taxi stand priority · GST e-receipt ready',
    },
    {
      operatorId: 'grab',
      operatorName: 'Grab',
      brandColor: '#00B14F',
      monogram: 'GR',
      serviceName: hasWheelchair
        ? 'GrabAssist'
        : hasPet
          ? 'GrabPet'
          : segment === 'corporate'
            ? 'GrabExec'
            : 'JustGrab',
      vehicleClass: hasWheelchair ? 'Assist MPV' : 'Toyota Prius / MPV',
      driverName: 'Wei Ming Lim',
      driverRating: 4.93,
      completedTrips: 4890,
      priceFactor: 1.04,
      surgeFactor: 1.05,
      baseEta: 2,
      supportsHighRated: true,
      supportsPetFriendly: true,
      supportsWheelchairFriendly: true,
      corporateEligible: true,
      cancellationNote: 'Largest nearby fleet · Instant corporate tag',
    },
    {
      operatorId: 'gojek',
      operatorName: 'Gojek',
      brandColor: '#00AA13',
      monogram: 'GJ',
      serviceName: segment === 'corporate' ? 'GoCar Priority' : 'GoCar',
      vehicleClass: 'Comfort Sedan',
      driverName: 'Farhan Rosli',
      driverRating: 4.91,
      completedTrips: 2740,
      priceFactor: 0.95,
      surgeFactor: 0.92,
      baseEta: 3,
      supportsHighRated: true,
      supportsPetFriendly: false,
      supportsWheelchairFriendly: false,
      corporateEligible: true,
      cancellationNote: 'Fixed upfront fare · No peak meter creep',
    },
    {
      operatorId: 'ryde',
      operatorName: 'Ryde',
      brandColor: '#E11D48',
      monogram: 'RY',
      serviceName: hasPet ? 'RydePET' : 'RydeX',
      vehicleClass: 'Compact SUV',
      driverName: 'Rachel Wong',
      driverRating: 4.88,
      completedTrips: 1920,
      priceFactor: 0.9,
      surgeFactor: 0.85,
      baseEta: 6,
      supportsHighRated: false,
      supportsPetFriendly: true,
      supportsWheelchairFriendly: false,
      corporateEligible: false,
      cancellationNote: 'Low base rate · 3% cashback wallet credit',
    },
  ];

  const petPremium = hasPet ? 4.5 : 0;
  const wavPremium = hasWheelchair ? 6.0 : 0;
  const highRatedAdjustment = hasHighRated ? 1.2 : 0;

  let quotes: OperatorQuote[] = rawOperators.map((op) => {
    const rawBase = +(baseTripCost * op.priceFactor + petPremium + wavPremium + highRatedAdjustment).toFixed(2);
    const surgeRaw = +((rawBase * (windowConfig.multiplier - 1)) * op.surgeFactor).toFixed(2);
    const totalFare = +(rawBase + surgeRaw + erpToll).toFixed(2);
    const etaMinutes = Math.max(2, op.baseEta + windowConfig.etaBonus + (hasWheelchair ? 2 : 0));
    const tripMinutes = Math.max(8, Math.round(baseMinutes * (isPeak ? 1.22 : 1.0)));

    return {
      id: `${op.operatorId}-${fromId}-${toId}-${timeWindow}`,
      operatorId: op.operatorId,
      operatorName: op.operatorName,
      brandColor: op.brandColor,
      monogram: op.monogram,
      serviceName: op.serviceName,
      vehicleClass: op.vehicleClass,
      driverName: op.driverName,
      driverRating: op.driverRating,
      completedTrips: op.completedTrips,
      etaMinutes,
      tripMinutes,
      baseFare: rawBase,
      surgeAmount: surgeRaw,
      erpToll,
      totalFare,
      isCheapest: false,
      isFastest: false,
      supportsHighRated: op.supportsHighRated,
      supportsPetFriendly: op.supportsPetFriendly,
      supportsWheelchairFriendly: op.supportsWheelchairFriendly,
      corporateEligible: op.corporateEligible,
      cancellationNote: op.cancellationNote,
    };
  });

  // Filter based on active personalisation criteria
  quotes = quotes.filter((q) => {
    if (preferences.includes('highRated') && !q.supportsHighRated) return false;
    if (preferences.includes('petFriendly') && !q.supportsPetFriendly) return false;
    if (preferences.includes('wheelchairFriendly') && !q.supportsWheelchairFriendly) return false;
    return true;
  });

  if (quotes.length > 0) {
    const minFare = Math.min(...quotes.map((q) => q.totalFare));
    const minEta = Math.min(...quotes.map((q) => q.etaMinutes));
    quotes = quotes.map((q) => ({
      ...q,
      isCheapest: q.totalFare === minFare,
      isFastest: q.etaMinutes === minEta,
    }));
  }

  return quotes;
}

export const TOURIST_ROUTE_GUIDES: TouristRouteGuide[] = [
  {
    id: 'guide_changi_marina',
    title: 'Changi Airport → Marina Bay & Civic District',
    fromId: 'changi_t3',
    toId: 'marina_bay_sands',
    corridor: 'ECP Coastal Expressway',
    bestTimePrompt: 'Suggested travel window: 10:15–16:15 or after 20:00',
    trafficCondition: 'Smooth',
    estimatedSavings: 'Save S$7.40 vs metered airport surcharge peak',
    insiderTip:
      'Skip Terminal 3 taxi stand lines during evening flight waves (17:30–19:30). Fixed-price Tada or Grab via Arrival Door 4 avoids ECP exit bottlenecks.',
    pickupInstruction: 'Wait at Arrival Hall Door 4 (Green Pillar) for immediate expressway ramp access.',
    highlights: ['Benjamin Sheares Bridge skyline view', 'Zero island-gantry detours', 'Direct hotel porte-cochère'],
  },
  {
    id: 'guide_orchard_sentosa',
    title: 'Orchard Road → Sentosa Resorts World',
    fromId: 'orchard_ion',
    toId: 'sentosa_rws',
    corridor: 'CTE Tunnel → Keppel Road',
    bestTimePrompt: 'Suggested travel window: 09:30–11:15 (before weekend mall rush)',
    trafficCondition: 'Moderate Peak',
    estimatedSavings: 'Save 11 mins wait time via Orchard Turn pickup',
    insiderTip:
      'Afternoon tropical showers between 15:00–17:30 double dynamic surge on Orchard Boulevard. Book from Orchard Turn side lane or hop 1 stop on Thomson-East Coast Line before hailing.',
    pickupInstruction: 'Set pin to ION Orchard Taxi/PHV Bay (Orchard Turn) rather than Paterson Road.',
    highlights: ['Includes Sentosa Gateway entry', 'CTE tunnel bypasses CBD ERP', 'Under 20 mins off-peak'],
  },
  {
    id: 'guide_little_india_gardens',
    title: 'Little India → Gardens by the Bay',
    fromId: 'little_india',
    toId: 'gardens_bay',
    corridor: 'Rochor Canal → Marina Boulevard',
    bestTimePrompt: 'Suggested travel window: 18:15 arrival for 19:45 Garden Rhapsody show',
    trafficCondition: 'Rain / Heavy Surge',
    estimatedSavings: 'Save S$5.20 by departing before 17:45 CBD surge',
    insiderTip:
      'After the 20:45 Supertree light show, 2,000+ visitors request rides simultaneously at Supertree Grove. Walk 4 minutes to Golden Garden Pick-Up Bay or Marina Barrage.',
    pickupInstruction: 'Pick up at Buffalo Road corner in Little India to skip Serangoon Road bus bays.',
    highlights: ['Golden hour Marina Barrage pass', 'Wheelchair-friendly drop-off bay', 'Night illumination route'],
  },
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news_erp_dynamic',
    title: 'LTA rolls out next-gen ERP 2.0 congestion nudges across Marina Coastal & CTE corridors',
    summary:
      'Real-time OBU traffic advisories now alert commuters 15 minutes before peak gantry activation, cutting evening CBD wait times by 18%.',
    fullBody: [
      'Commuters travelling out of Raffles Place and Marina Bay during the 17:30–19:30 window now receive predictive gantry guidance integrated directly into aggregator dispatch feeds.',
      'Transport analysts note that shifting departure by just 12 minutes or switching from dynamic PHV apps to zero-commission and metered taxi networks saves regular CBD workers between S$64 and S$110 per month.',
      'AnchorSG automatically factors active ERP gantries and historical rain-surge multipliers into every side-by-side operator quote so riders see the true door-to-door fare upfront.',
    ],
    source: 'The Straits Times',
    relatedSources: ['CNA', 'LTA Mobility Brief'],
    publishedAgo: '18m ago',
    readTime: '3 min read',
    topic: 'Transport & ERP',
    segments: ['adult', 'corporate', 'tourist'],
    illustration: 'skyline',
    impactNote: 'Evening MCE outbound ERP active 18:00–19:00 (+S$2.00)',
    pushEligible: true,
  },
  {
    id: 'news_changi_t5_link',
    title: 'Changi Airport expands sheltered ride-hail bays and express baggage corridors ahead of holiday peak',
    summary:
      'Arriving visitors at Terminals 1 and 3 gain dedicated Door 4 fixed-fare pickup lanes with real-time queue telemetry.',
    fullBody: [
      'Changi Airport Group has introduced colour-coded ride-hail pickup zones designed to separate short-dwell fixed-fare PHVs from traditional metered taxi queues.',
      'Tourists heading toward Marina Bay, Orchard, and Sentosa can shave up to 14 minutes off post-landing wait times by selecting Arrival Door 4 instead of the main terminal taxi rank during 17:00–21:00 arrival banks.',
      'Pet-friendly and wheelchair-accessible vehicles also receive priority curb clearance at designated accessible bays.',
    ],
    source: 'CNA',
    relatedSources: ['VisitSingapore', 'The Business Times'],
    publishedAgo: '42m ago',
    readTime: '4 min read',
    topic: 'Travel & Dining',
    segments: ['tourist', 'corporate'],
    illustration: 'changi',
    impactNote: 'Arrival Door 4 wait time currently under 4 mins',
    pushEligible: true,
  },
  {
    id: 'news_corporate_mobility',
    title: 'Singapore firms shift employee commute stipends toward multi-operator mobility anchors',
    summary:
      'HR and finance teams report 22% lower monthly transport spend when staff compare Grab, Gojek, Tada, and Zig in one policy-checked flow.',
    fullBody: [
      'Rather than locking employees into a single high-surge ride-hailing tier, regional headquarters in Marina Bay and one-north are adopting unified mobility allowances.',
      'Automated GST e-receipts and cost-center tagging eliminate manual end-of-month expense claims for young professionals working late or travelling between client sites.',
      'Corporate sustainability policies also prioritise hybrid and electric vehicle fleets across partner operators.',
    ],
    source: 'The Business Times',
    relatedSources: ['HRM Asia', 'Nikkei Asia'],
    publishedAgo: '1h ago',
    readTime: '3 min read',
    topic: 'Corporate Policy',
    segments: ['corporate', 'adult'],
    illustration: 'cbd',
    impactNote: 'Policy cap check: S$35/trip auto-approved across 4 operators',
    pushEligible: true,
  },
  {
    id: 'news_mrt_crosstown',
    title: 'Cross Island & Thomson-East Coast Line interchange upgrades reshape morning peak commutes',
    summary:
      'First-mile ride-hailing demand around Jurong East, Tampines, and Marina South surges as hybrid workers pair short rides with express rail.',
    fullBody: [
      'Data from Singapore mobility platforms shows a 29% rise in short 3–6 km first-mile rides linking residential hubs to express MRT stations before 08:30.',
      'Combining a S$7–9 off-surge feeder ride on Ryde or Tada with the Thomson-East Coast Line cuts total CBD door-to-door time while avoiding central expressway slowdowns.',
    ],
    source: 'Today Online',
    relatedSources: ['The Straits Times', 'Mothership'],
    publishedAgo: '2h ago',
    readTime: '2 min read',
    topic: 'Transport & ERP',
    segments: ['adult', 'tourist'],
    illustration: 'mrt',
    impactNote: 'Short feeder rides under 5km show fastest Tada/Ryde match',
    pushEligible: false,
  },
  {
    id: 'news_cbd_fintech',
    title: 'Singapore FinTech & AI hubs expand flexible hybrid schedules around Marina Bay',
    summary:
      'Young professionals in Raffles Place and one-north increasingly time commutes using predictive fare and briefing feeds.',
    fullBody: [
      'With flexible start windows becoming standard across Marina Bay and Fusionopolis employers, professionals are aligning morning departures with 08:40 post-peak fare drops.',
      'Personalised morning news digests bundled into commute apps have emerged as the fastest way to scan MAS policy updates, regional deal flow, and weather advisories before stepping into a car.',
    ],
    source: 'Tech in Asia',
    relatedSources: ['The Business Times', 'CNA'],
    publishedAgo: '3h ago',
    readTime: '4 min read',
    topic: 'Business & Tech',
    segments: ['adult', 'corporate'],
    illustration: 'cbd',
    impactNote: '08:40 departure cuts average AYE/ECP fare by 19%',
    pushEligible: true,
  },
  {
    id: 'news_heritage_night',
    title: 'Weekend night markets & riverfront dining festivals light up Kampong Gelam and Clarke Quay',
    summary:
      'Road closures along Arab Street and Boat Quay begin at 18:00 Friday through Sunday — plan drop-off pins one block outside.',
    fullBody: [
      'Visitors heading to evening heritage trails in Little India, Kampong Gelam, and the Singapore River should set ride-hail drop-offs on Beach Road or Eu Tong Sen Street to avoid pedestrianised lane detours.',
      'Late-night return rides after 23:00 see faster dispatch via Zig metered taxis or pre-booked Grab/Gojek pickups.',
    ],
    source: 'Time Out Singapore',
    relatedSources: ['CNA Lifestyle', 'VisitSingapore'],
    publishedAgo: '4h ago',
    readTime: '3 min read',
    topic: 'Singapore Culture',
    segments: ['tourist', 'adult'],
    illustration: 'skyline',
    impactNote: 'Set drop-off at Beach Road after 18:00 Fri–Sun',
    pushEligible: false,
  },
];

export const INITIAL_CORPORATE_TRIPS: CorporateTripRecord[] = [
  {
    id: 'TRP-9041',
    date: '13 Nov · 08:22',
    route: 'one-north → Raffles Place',
    operator: 'Zig',
    service: 'CDG Zig Fixed',
    costCenter: 'Client Advisory',
    fareSgd: 16.4,
    savedVsPeakSgd: 4.8,
    status: 'Approved',
  },
  {
    id: 'TRP-9038',
    date: '12 Nov · 19:05',
    route: 'MBFC Tower 2 → Changi Terminal 3',
    operator: 'Tada',
    service: 'AnyTADA Fair',
    costCenter: 'APAC Travel',
    fareSgd: 25.9,
    savedVsPeakSgd: 6.3,
    status: 'Approved',
  },
  {
    id: 'TRP-9024',
    date: '11 Nov · 21:40',
    route: 'Raffles Place → Tampines Hub',
    operator: 'Grab',
    service: 'GrabExec',
    costCenter: 'Overtime Commute',
    fareSgd: 24.5,
    savedVsPeakSgd: 3.1,
    status: 'Approved',
  },
  {
    id: 'TRP-9019',
    date: '10 Nov · 14:10',
    route: 'Jurong East → Raffles Place',
    operator: 'Gojek',
    service: 'GoCar Priority',
    costCenter: 'Client Advisory',
    fareSgd: 19.8,
    savedVsPeakSgd: 2.9,
    status: 'Pending Receipt',
  },
];
