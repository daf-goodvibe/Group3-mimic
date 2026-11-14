import React, { useEffect, useRef, useState } from 'react';
import {
  AdvancedMarker,
  APILoadingStatus,
  APIProvider,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { AlertCircle, MapPin, Navigation } from 'lucide-react';

interface GoogleRouteMapProps {
  originName: string;
  originAddress: string;
  originTip: string;
  destinationName: string;
  destinationAddress: string;
  heightClass?: string;
  onRouteStats?: (stats: { distanceKm: number; durationMin: number } | null) => void;
}

interface RouteOverlayProps {
  originName: string;
  originAddress: string;
  originTip: string;
  destinationName: string;
  destinationAddress: string;
  onRouteStats?: (stats: { distanceKm: number; durationMin: number } | null) => void;
  onStatusChange: (status: { loading: boolean; error: string | null; distanceKm?: number; durationMin?: number }) => void;
}

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface LatLngObj {
  lat: () => number;
  lng: () => number;
}

interface PolylineObj {
  setOptions: (opts: { strokeColor?: string; strokeOpacity?: number; strokeWeight?: number }) => void;
  setMap: (map: unknown) => void;
}

interface ComputedRouteObj {
  path?: LatLngObj[];
  distanceMeters?: number;
  durationMillis?: number;
  viewport?: unknown;
  legs?: Array<{
    startLocation?: LatLngObj;
    endLocation?: LatLngObj;
  }>;
  createPolylines: () => PolylineObj[];
}

declare global {
  interface Window {
    __ANCHORSG_CONFIG__?: {
      googleMapsApiKey?: string;
    };
  }
}

function getInitialMapsApiKey(): string {
  const viteKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  if (viteKey) return viteKey;
  if (typeof window !== 'undefined') {
    const runtimeKey = (window.__ANCHORSG_CONFIG__?.googleMapsApiKey || '').trim();
    if (runtimeKey) return runtimeKey;
  }
  return '';
}

function RouteOverlay({
  originName,
  originAddress,
  originTip,
  destinationName,
  destinationAddress,
  onRouteStats,
  onStatusChange,
}: RouteOverlayProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<PolylineObj[]>([]);

  const [originPos, setOriginPos] = useState<LatLngLiteral | null>(null);
  const [destPos, setDestPos] = useState<LatLngLiteral | null>(null);
  const [openInfo, setOpenInfo] = useState<'origin' | 'dest' | null>('origin');

  useEffect(() => {
    if (!routesLib || !map || !originAddress || !destinationAddress) return;

    let cancelled = false;
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    onStatusChange({ loading: true, error: null });

    const request = {
      origin: originAddress,
      destination: destinationAddress,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs'],
    };

    const RouteClass = (routesLib as unknown as {
      Route: {
        computeRoutes: (req: typeof request) => Promise<{
          routes?: ComputedRouteObj[];
        }>;
      };
    }).Route;

    RouteClass.computeRoutes(request)
      .then((res) => {
        if (cancelled) return;
        const primaryRoute = res.routes?.[0];
        if (!primaryRoute) {
          onStatusChange({ loading: false, error: 'Unable to calculate route between these locations.' });
          onRouteStats?.(null);
          return;
        }

        const newPolylines = primaryRoute.createPolylines();
        newPolylines.forEach((polyline) => {
          polyline.setOptions({
            strokeColor: '#059669',
            strokeOpacity: 0.92,
            strokeWeight: 6,
          });
          polyline.setMap(map);
        });
        polylinesRef.current = newPolylines;

        if (primaryRoute.viewport) {
          (map as unknown as {
            fitBounds: (
              bounds: unknown,
              padding?: { top: number; right: number; bottom: number; left: number }
            ) => void;
          }).fitBounds(primaryRoute.viewport, { top: 48, right: 48, bottom: 48, left: 48 });
        }

        const pathPoints = primaryRoute.path ?? [];
        const firstPt = pathPoints[0] ?? primaryRoute.legs?.[0]?.startLocation;
        const lastPt =
          pathPoints[pathPoints.length - 1] ?? primaryRoute.legs?.[0]?.endLocation;

        if (firstPt) {
          setOriginPos({ lat: firstPt.lat(), lng: firstPt.lng() });
        }
        if (lastPt) {
          setDestPos({ lat: lastPt.lat(), lng: lastPt.lng() });
        }

        const distanceKm = +(((primaryRoute.distanceMeters ?? 0) / 1000)).toFixed(1);
        const durationMin = Math.max(1, Math.round((primaryRoute.durationMillis ?? 0) / 60000));

        onStatusChange({ loading: false, error: null, distanceKm, durationMin });
        onRouteStats?.({ distanceKm, durationMin });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const errMsg = err instanceof Error ? err.message : String(err);
        if (
          errMsg.includes('OVER_QUERY_LIMIT') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('QuotaExceeded') ||
          errMsg.includes('429')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onStatusChange({
          loading: false,
          error: 'Route preview unavailable right now. Check API settings or try another corridor.',
        });
        onRouteStats?.(null);
      });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, originAddress, destinationAddress]);

  return (
    <>
      {originPos && (
        <AdvancedMarker
          position={originPos}
          onClick={() => setOpenInfo(openInfo === 'origin' ? null : 'origin')}
        >
          <Pin background="#059669" glyphColor="#FFFFFF" borderColor="#065F46" />
        </AdvancedMarker>
      )}

      {destPos && (
        <AdvancedMarker
          position={destPos}
          onClick={() => setOpenInfo(openInfo === 'dest' ? null : 'dest')}
        >
          <Pin background="#0F172A" glyphColor="#FFFFFF" borderColor="#020617" />
        </AdvancedMarker>
      )}

      {originPos && openInfo === 'origin' && (
        <InfoWindow position={originPos} onCloseClick={() => setOpenInfo(null)}>
          <div className="max-w-xs p-1 text-slate-900">
            <p className="text-xs font-bold text-emerald-700">Pickup · {originName}</p>
            <p className="text-xs text-slate-600 mt-1">{originTip}</p>
          </div>
        </InfoWindow>
      )}

      {destPos && openInfo === 'dest' && (
        <InfoWindow position={destPos} onCloseClick={() => setOpenInfo(null)}>
          <div className="max-w-xs p-1 text-slate-900">
            <p className="text-xs font-bold text-slate-900">Dropoff · {destinationName}</p>
            <p className="text-xs text-slate-600 mt-0.5">{destinationAddress}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function MapStatusGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-center p-6">
        <AlertCircle className="w-7 h-7 text-amber-600 mb-2" aria-hidden="true" />
        <p className="text-sm font-semibold text-slate-900">
          Google Maps failed to authorize
        </p>
        <p className="text-xs text-slate-600 mt-1 max-w-sm">
          Verify your Google Maps Platform API key and allowed HTTP referrers to render interactive routes.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export const GoogleRouteMap: React.FC<GoogleRouteMapProps> = ({
  originName,
  originAddress,
  originTip,
  destinationName,
  destinationAddress,
  heightClass = 'h-[360px] sm:h-[420px]',
  onRouteStats,
}) => {
  const [apiKey, setApiKey] = useState<string>(() => getInitialMapsApiKey());
  const [checkingKey, setCheckingKey] = useState<boolean>(() => !getInitialMapsApiKey());
  const [routeStatus, setRouteStatus] = useState<{
    loading: boolean;
    error: string | null;
    distanceKm?: number;
    durationMin?: number;
  }>({ loading: false, error: null });

  useEffect(() => {
    if (apiKey) {
      setCheckingKey(false);
      return;
    }
    let cancelled = false;
    fetch('/api/maps-config')
      .then((res) => res.text())
      .then((text) => {
        if (cancelled) return;
        try {
          const parsed = JSON.parse(text) as { apiKey?: string };
          const fetchedKey = (parsed.apiKey || '').trim();
          if (fetchedKey) {
            setApiKey(fetchedKey);
          }
        } catch {
          // Ignore non-JSON response in static preview
        }
      })
      .catch(() => {
        // Ignore network error
      })
      .finally(() => {
        if (!cancelled) setCheckingKey(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Top Route Telemetry Strip */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Navigation className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">
              {originName.split(' (')[0]} → {destinationName.split(' (')[0]}
            </p>
            <p className="text-xs text-slate-400 truncate">
              Google Maps Route Visual · Driving Corridor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums shrink-0">
          {routeStatus.loading ? (
            <span className="text-slate-300">Computing route...</span>
          ) : routeStatus.distanceKm !== undefined ? (
            <>
              <span className="text-emerald-400 font-semibold">
                {routeStatus.distanceKm} km
              </span>
              <span className="text-slate-500" aria-hidden="true">
                |
              </span>
              <span className="text-white font-semibold">
                ~{routeStatus.durationMin} min drive
              </span>
            </>
          ) : (
            <span className="text-slate-300">Singapore Island</span>
          )}
        </div>
      </div>

      {/* Explicit-Height Map Canvas */}
      <div className={`relative w-full ${heightClass} bg-slate-100`}>
        {checkingKey ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
            <MapPin className="w-7 h-7 text-emerald-600 mb-2" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-900">
              Loading Singapore route map...
            </p>
          </div>
        ) : !apiKey ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
            <MapPin className="w-7 h-7 text-slate-400 mb-2" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-900">
              Google Maps API key not detected
            </p>
            <p className="text-xs text-slate-600 mt-1 max-w-sm">
              Enable Google Maps in AI Studio settings and reload to display interactive Singapore routes.
            </p>
          </div>
        ) : (
          <APIProvider apiKey={apiKey} language="en" region="SG">
            <MapStatusGuard>
              <GoogleMap
                mapId="DEMO_MAP_ID"
                defaultCenter={{ lat: 1.3521, lng: 103.8198 }}
                defaultZoom={12}
                gestureHandling="greedy"
                streetViewControl={false}
                mapTypeControl={false}
                fullscreenControl={true}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
              >
                <RouteOverlay
                  originName={originName}
                  originAddress={originAddress}
                  originTip={originTip}
                  destinationName={destinationName}
                  destinationAddress={destinationAddress}
                  onRouteStats={onRouteStats}
                  onStatusChange={setRouteStatus}
                />
              </GoogleMap>
            </MapStatusGuard>
          </APIProvider>
        )}
      </div>

      {routeStatus.error && (
        <div className="px-5 py-2.5 bg-amber-50 border-t border-amber-200 text-xs text-amber-900">
          {routeStatus.error}
        </div>
      )}
    </div>
  );
};
