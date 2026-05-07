"use client";

import Map, { Layer, Marker, NavigationControl, Popup, Source } from "react-map-gl/maplibre";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import type { SiteSummary } from "@/features/monitoring/types";
import { StatusPill } from "@/components/status-pill";
import { sites as rawSites } from "@/features/monitoring/mock-data";

const statusColors = {
  healthy: "#059669",
  warning: "#d97706",
  critical: "#dc2626",
  offline: "#64748b",
};

// River paths
const YSTWYTH: [number, number][] = [
  [-3.8480, 52.3320], [-3.8620, 52.3340], [-3.8780, 52.3355], [-3.8950, 52.3380],
  [-3.9100, 52.3400], [-3.9250, 52.3390], [-3.9400, 52.3370], [-3.9531, 52.3339],
  [-3.9680, 52.3350], [-3.9830, 52.3380], [-3.9970, 52.3420], [-4.0100, 52.3480],
  [-4.0230, 52.3560], [-4.0350, 52.3640], [-4.0450, 52.3730], [-4.0550, 52.3810],
  [-4.0640, 52.3880], [-4.0700, 52.3950], [-4.0760, 52.4020], [-4.0810, 52.4080],
  [-4.0850, 52.4130],
];

const RHEIDOL: [number, number][] = [
  [-3.8500, 52.3780], [-3.8700, 52.3830], [-3.8900, 52.3870], [-3.9100, 52.3910],
  [-3.9300, 52.3950], [-3.9500, 52.3980], [-3.9700, 52.4010], [-3.9900, 52.4050],
  [-4.0100, 52.4080], [-4.0300, 52.4100], [-4.0500, 52.4110], [-4.0650, 52.4130],
  [-4.0821, 52.4152], [-4.0870, 52.4150],
];

const CLARACH: [number, number][] = [
  [-4.0100, 52.4450], [-4.0250, 52.4470], [-4.0400, 52.4500],
  [-4.0530, 52.4530], [-4.0604, 52.4555], [-4.0680, 52.4570], [-4.0780, 52.4580],
];

const ALL_RIVERS = [YSTWYTH, RHEIDOL, CLARACH];

const riverGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Ystwyth" }, geometry: { type: "LineString", coordinates: YSTWYTH } },
    { type: "Feature", properties: { name: "Rheidol" }, geometry: { type: "LineString", coordinates: RHEIDOL } },
    { type: "Feature", properties: { name: "Clarach" }, geometry: { type: "LineString", coordinates: CLARACH } },
  ],
};

// Interpolate a point along a polyline at fraction t (0..1)
function interpolateAlongLine(coords: [number, number][], t: number): [number, number] {
  if (coords.length < 2) return coords[0];
  const totalSegments = coords.length - 1;
  const raw = t * totalSegments;
  const idx = Math.min(Math.floor(raw), totalSegments - 1);
  const frac = raw - idx;
  const [x0, y0] = coords[idx];
  const [x1, y1] = coords[idx + 1];
  return [x0 + (x1 - x0) * frac, y0 + (y1 - y0) * frac];
}

// Generate N particles spread across all rivers
const PARTICLE_COUNT = 30;
function buildInitialParticles() {
  const particles: { river: number; t: number; speed: number }[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      river: i % ALL_RIVERS.length,
      t: Math.random(),
      speed: 0.0003 + Math.random() * 0.0006,
    });
  }
  return particles;
}

function particlesToGeoJSON(particles: { river: number; t: number }[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: particles.map((p) => {
      const coord = interpolateAlongLine(ALL_RIVERS[p.river], p.t);
      return {
        type: "Feature" as const,
        properties: {},
        geometry: { type: "Point" as const, coordinates: coord },
      };
    }),
  };
}

export function SiteMap({ sites }: { sites: SiteSummary[] }) {
  const mapRef = useRef<MapRef>(null);
  const [activeSiteId, setActiveSiteId] = useState<string | null>(sites[0]?.id ?? null);
  const activeSite = sites.find((site) => site.id === activeSiteId) ?? null;
  const particlesRef = useRef(buildInitialParticles());
  const animRef = useRef<number>(0);
  const [particleData, setParticleData] = useState<GeoJSON.FeatureCollection>(
    () => particlesToGeoJSON(particlesRef.current)
  );

  const initialViewState = useMemo(
    () => ({ longitude: -3.97, latitude: 52.39, zoom: 11 }),
    [],
  );

  // Animate particles flowing downstream
  const animate = useCallback(() => {
    const ps = particlesRef.current;
    for (const p of ps) {
      p.t += p.speed;
      if (p.t > 1) {
        p.t = 0;
        p.speed = 0.0003 + Math.random() * 0.0006;
      }
    }
    setParticleData(particlesToGeoJSON(ps));
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200" data-testid="site-map">
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: "100%", height: 480 }}
      >
        <NavigationControl position="top-right" />

        {/* River lines — glow + base */}
        <Source id="rivers" type="geojson" data={riverGeoJSON}>
          <Layer id="river-glow" type="line"
            paint={{ "line-color": "#0ea5e9", "line-width": 10, "line-opacity": 0.1, "line-blur": 8 }}
            layout={{ "line-cap": "round", "line-join": "round" }}
          />
          <Layer id="river-base" type="line"
            paint={{ "line-color": "#0ea5e9", "line-width": 3.5, "line-opacity": 0.4 }}
            layout={{ "line-cap": "round", "line-join": "round" }}
          />
        </Source>

        {/* Animated flow particles */}
        <Source id="flow-particles" type="geojson" data={particleData}>
          <Layer id="flow-glow" type="circle"
            paint={{ "circle-radius": 6, "circle-color": "#38bdf8", "circle-opacity": 0.25, "circle-blur": 1 }}
          />
          <Layer id="flow-dots" type="circle"
            paint={{ "circle-radius": 3, "circle-color": "#38bdf8", "circle-opacity": 0.8 }}
          />
        </Source>

        {/* River labels */}
        <Source id="river-labels" type="geojson" data={{
          type: "FeatureCollection",
          features: [
            { type: "Feature", properties: { name: "River Ystwyth" }, geometry: { type: "Point", coordinates: [-3.93, 52.337] } },
            { type: "Feature", properties: { name: "River Rheidol" }, geometry: { type: "Point", coordinates: [-3.94, 52.398] } },
            { type: "Feature", properties: { name: "River Clarach" }, geometry: { type: "Point", coordinates: [-4.04, 52.452] } },
          ],
        }}>
          <Layer id="river-label-text" type="symbol"
            layout={{
              "text-field": ["get", "name"],
              "text-size": 12,
              "text-font": ["Open Sans Regular"],
              "text-offset": [0, -1],
              "text-anchor": "bottom",
            }}
            paint={{ "text-color": "#0369a1", "text-halo-color": "#ffffff", "text-halo-width": 2 }}
          />
        </Source>

        {/* Site markers */}
        {sites.map((site) => {
          const source = rawSites.find((entry) => entry.id === site.id);
          if (!source) return null;
          return (
            <Marker key={site.id} longitude={source.longitude} latitude={source.latitude}>
              <button type="button"
                className="relative h-5 w-5 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: statusColors[site.status] }}
                onClick={() => setActiveSiteId(site.id)}
                aria-label={`Open ${site.name}`}
              >
                {(site.status === "critical" || site.status === "warning") && (
                  <span className="absolute -inset-1 animate-ping rounded-full opacity-40"
                    style={{ backgroundColor: statusColors[site.status] }} />
                )}
              </button>
            </Marker>
          );
        })}

        {/* Popup */}
        {activeSite ? (() => {
          const source = rawSites.find((entry) => entry.id === activeSite.id);
          if (!source) return null;
          return (
            <Popup longitude={source.longitude} latitude={source.latitude}
              closeButton={false} onClose={() => setActiveSiteId(null)}>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <strong>{activeSite.name}</strong>
                  <StatusPill value={activeSite.status} />
                </div>
                <p className="text-xs text-slate-500">{activeSite.river}</p>
                <p>pH {activeSite.latestReading.metrics.ph}</p>
                <p>DO {activeSite.latestReading.metrics.do}</p>
                <p>Nitrate {activeSite.latestReading.metrics.nitrate}</p>
              </div>
            </Popup>
          );
        })() : null}
      </Map>
    </div>
  );
}
