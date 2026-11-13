import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft,
  X,
  MapPin,
  Calendar,
  Loader2,
  RefreshCw,
  Phone,
  Layers,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Droplet,
  HeartPulse,
  Users,
  User,
} from 'lucide-react';
import { getMediaUrl } from '../../utils/mediaUrl';
import api from '../../services/api';

// Type-based SVG icon generator
const getTypeSvg = (type = '') => {
  const t = (type || '').trim().toLowerCase();
  if (t.includes('school') || t.includes('education') || t.includes('vidyalaya')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
  }
  if (t.includes('water') || t.includes('well') || t.includes('tap') || t.includes('dhara')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
  }
  if (t.includes('health') || t.includes('clinic') || t.includes('post') || t.includes('hospital')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
  }
  return `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
};

// Custom SVG Type-based Pin Icon
const createTypePinIcon = (loc, isSelected = false) => {
  const bg = '#c44a10';
  const size = isSelected ? 44 : 38;
  const anchorY = isSelected ? 44 : 38;
  const anchorX = size / 2;
  const innerIcon = getTypeSvg(loc?.type);

  return L.divIcon({
    className: 'location-type-marker',
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        ${
          isSelected
            ? `<div style="position: absolute; inset: -6px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: ${bg}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
            : ''
        }
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${bg};
          border: ${isSelected ? '2.5px' : '2px'} solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 14px rgba(0,0,0,0.32);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
          ${innerIcon}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [anchorX, anchorY],
  });
};

// Region Label Marker Icon
const createRegionLabelIcon = (regionName = 'Nuwakot') => {
  return L.divIcon({
    className: 'region-district-label',
    html: `
      <div style="
        background: rgba(255, 255, 255, 0.94);
        backdrop-filter: blur(6px);
        border: 2px solid #c44a10;
        color: #c44a10;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.04em;
        box-shadow: 0 4px 12px rgba(196, 74, 16, 0.18);
        display: flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
        pointer-events: none;
      ">
        <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#c44a10;"></span>
        ${regionName} District
      </div>
    `,
    iconSize: [120, 28],
    iconAnchor: [60, 14],
  });
};

// Map click handler to close modal on background tap
function MapBackgroundClickHandler({ onDeselect }) {
  useMapEvents({
    click: (e) => {
      const target = e.originalEvent?.target;
      if (
        target &&
        (target.closest('.leaflet-marker-icon') ||
          target.closest('.leaflet-popup') ||
          target.closest('.location-type-marker') ||
          target.closest('.school-leaflet-popup') ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="dialog"]'))
      ) {
        return;
      }
      onDeselect();
    },
  });
  return null;
}

// Automatically fit map to boundary and locations comfortably
function MapBoundsHandler({ geojsonData, locations, selectedLocation }) {
  const map = useMap();
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (hasFittedRef.current) return;

    const bounds = L.latLngBounds();
    let hasPoints = false;

    // Extend bounds with all valid location coordinates
    locations.forEach((loc) => {
      const lat = Number(loc.lat);
      const lng = Number(loc.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.extend([lat, lng]);
        hasPoints = true;
      }
    });

    // Also extend with GeoJSON bounds if available
    if (geojsonData) {
      try {
        const geoLayer = L.geoJSON(geojsonData);
        const geoBounds = geoLayer.getBounds();
        if (geoBounds.isValid()) {
          bounds.extend(geoBounds);
          hasPoints = true;
        }
      } catch (e) {
        console.warn('GeoJSON bounds extension failed:', e);
      }
    }

    if (hasPoints && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 12 });
      hasFittedRef.current = true;
    }
  }, [geojsonData, locations, map]);

  useEffect(() => {
    if (selectedLocation && selectedLocation.lat != null && selectedLocation.lng != null) {
      const targetZoom = Math.max(map.getZoom(), 15);
      map.flyTo([Number(selectedLocation.lat), Number(selectedLocation.lng)], targetZoom, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedLocation, map]);

  return null;
}

// Map resize handler to prevent grey tiles and force full container sizing
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function ProjectMap({ projectSlug }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [takingLonger, setTakingLonger] = useState(false);
  const [error, setError] = useState(null);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showLocationsList, setShowLocationsList] = useState(false);
  const [regionGeoJSON, setRegionGeoJSON] = useState(null);

  const modalRef = useRef(null);

  // Helper to load static Nuwakot GeoJSON boundary from frontend/public
  const loadStaticBoundary = useCallback(async () => {
    try {
      const geoRes = await fetch('/nuwakot.geojson');
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        setRegionGeoJSON(geoData);
      }
    } catch {
      // Fallback gracefully
    }
  }, []);

  // Fetch dynamic project map data from backend API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTakingLonger(false);

    const timer = setTimeout(() => {
      setTakingLonger(true);
    }, 3500);

    const rawSlug = projectSlug || 'scholarship-and-school-support';
    const activeSlug =
      rawSlug === 'undefined' || rawSlug === 'null' || !rawSlug
        ? 'scholarship-and-school-support'
        : rawSlug;

    try {
      let res;
      try {
        res = await api.get(`/projects/${activeSlug}/map?_t=${Date.now()}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        });
      } catch (err1) {
        // If the specific slug failed and wasn't the main project slug, attempt default
        if (activeSlug !== 'scholarship-and-school-support') {
          res = await api.get(`/projects/scholarship-and-school-support/map?_t=${Date.now()}`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
            },
          });
        } else {
          throw err1;
        }
      }

      const json = res.data;
      if (json && json.project) {
        setData({
          success: true,
          project: json.project,
          locations: Array.isArray(json.locations) ? json.locations : [],
        });

        if (json.project?.regionGeoJSON) {
          setRegionGeoJSON(json.project.regionGeoJSON);
        } else {
          loadStaticBoundary();
        }
      } else {
        throw new Error('Project map data not found.');
      }
    } catch (err) {
      console.warn('Map endpoint request failed, attempting dynamic database fallback:', err.message);
      try {
        // Dynamic fallback: fetch project from /projects and schools from /schools directly
        const [projRes, schoolsRes] = await Promise.allSettled([
          api.get(`/projects/s/${activeSlug}`).catch(() => api.get('/projects')),
          api.get('/schools'),
        ]);

        let fallbackProject = null;
        if (projRes.status === 'fulfilled' && projRes.value?.data) {
          const pData = projRes.value.data.data || projRes.value.data;
          fallbackProject = Array.isArray(pData) ? pData[0] : pData;
        }

        let fallbackLocations = [];
        if (schoolsRes.status === 'fulfilled' && schoolsRes.value?.data) {
          const sData = schoolsRes.value.data.data || schoolsRes.value.data;
          if (Array.isArray(sData)) {
            fallbackLocations = sData.map((s) => ({
              _id: s._id,
              name: s.name,
              area: s.address || s.area || 'Lachyang, Suryagadhi-1',
              type: 'School',
              lat: s.lat ?? s.coordinates?.lat,
              lng: s.lng ?? s.coordinates?.lng,
              photos: s.photos || s.images || [],
              details: [
                s.studentCount ? { label: 'Students', value: `${s.studentCount} enrolled` } : null,
                s.level ? { label: 'Level', value: s.level } : null,
                s.headmaster ? { label: 'Headmaster', value: s.headmaster } : null,
              ].filter(Boolean),
            }));
          }
        }

        if (fallbackProject || fallbackLocations.length > 0) {
          setData({
            success: true,
            project: {
              title: fallbackProject?.title || 'Scholarship and School Support Project',
              slug: fallbackProject?.slug || 'scholarship-and-school-support',
              summary: fallbackProject?.summary || '',
              description: fallbackProject?.description || '',
              location: fallbackProject?.location || 'Lachyang, Suryagadhi-1, Nuwakot, Nepal',
            },
            locations: fallbackLocations,
          });
          loadStaticBoundary();
        } else {
          setError(err.response?.data?.message || err.message || 'Unable to connect to the project map service.');
        }
      } catch (fallbackErr) {
        setError(fallbackErr.message || 'Unable to connect to the project map service.');
      }
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }, [projectSlug, loadStaticBoundary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedLocation(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset active photo index when selected location changes
  useEffect(() => {
    setActivePhotoIndex(0);
  }, [selectedLocation?._id]);

  // Valid coordinate locations with automatic offset for identical coordinates so ALL 8 pins are visible
  const validLocations = useMemo(() => {
    if (!data?.locations) return [];
    const valid = data.locations.filter((loc) => {
      const lat = Number(loc.lat);
      const lng = Number(loc.lng);
      return (
        loc.lat != null &&
        loc.lng != null &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      );
    });

    // Detect duplicate/identical lat/lng (e.g. NirguBhumi & Jana Shakti, Lachyang & Gauri Shankar)
    // and apply a distinct ~65-meter display offset so both markers are visible side-by-side
    const coordMap = new Map();
    return valid.map((loc) => {
      const key = `${Number(loc.lat).toFixed(5)}_${Number(loc.lng).toFixed(5)}`;
      const seenIndex = coordMap.get(key) || 0;
      coordMap.set(key, seenIndex + 1);

      if (seenIndex === 0) {
        return {
          ...loc,
          displayLat: Number(loc.lat),
          displayLng: Number(loc.lng),
          isOffset: false,
        };
      }

      // Offset subsequent markers with the exact same coordinate by ~65m
      const angle = seenIndex * 1.57; // 90° radial offset
      const dist = 0.0006; // ~65 meters in latitude/longitude
      return {
        ...loc,
        displayLat: Number(loc.lat) + dist * Math.cos(angle),
        displayLng: Number(loc.lng) + dist * Math.sin(angle),
        isOffset: true,
      };
    });
  }, [data?.locations]);

  // Unified details extraction merging details array, studentCount, principalName, and contact
  const displayedDetails = useMemo(() => {
    if (!selectedLocation) return [];
    const list = Array.isArray(selectedLocation.details) ? [...selectedLocation.details] : [];
    const seen = new Set(list.map((d) => (d.label || '').toLowerCase().trim()));

    if (
      selectedLocation.studentCount != null &&
      !seen.has('students') &&
      !seen.has('student count') &&
      !seen.has('students enrolled')
    ) {
      list.unshift({ label: 'Students', value: `${selectedLocation.studentCount} enrolled` });
    }
    if (
      selectedLocation.principalName &&
      !seen.has('principal') &&
      !seen.has('principal name') &&
      !seen.has('headmaster')
    ) {
      list.push({ label: 'Principal', value: selectedLocation.principalName });
    }
    if (
      selectedLocation.contact &&
      !seen.has('contact') &&
      !seen.has('contact number') &&
      !seen.has('phone')
    ) {
      list.push({ label: 'Contact', value: selectedLocation.contact });
    }
    return list;
  }, [selectedLocation]);

  // Clear terracotta border (2.5px) and light translucent fill
  const regionStyle = useMemo(
    () => ({
      color: '#c44a10',
      weight: 2.5,
      opacity: 0.95,
      fillColor: '#db5f1f',
      fillOpacity: 0.08,
    }),
    []
  );

  const defaultCenter = [27.93, 85.25]; // Central Nuwakot region default
  const regionLabelPosition = useMemo(() => [27.915, 85.165], []);

  // Friendly error / not found state
  if (error && !loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#faf8f5] p-6 text-center">
        <div className="bg-white max-w-sm w-full p-8 rounded-3xl shadow-xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-[#c44a10] flex items-center justify-center mx-auto mb-4">
            <MapPin size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Map Not Found</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            This project map is either not active or does not exist.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={fetchData}
              className="w-full py-2.5 bg-[#c44a10] text-white rounded-xl text-xs font-semibold hover:bg-[#a53f0f] transition-colors"
            >
              <RefreshCw size={14} className="inline mr-1.5" /> Try Again
            </button>
            <Link
              to="/projects"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const project = data?.project;
  const backToProjectLink = project?.slug ? `/projects/${project.slug}` : '/projects';

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#f6f3ee]">
      {/* Loading Overlay with Render spin-up explanation */}
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white max-w-sm w-full p-6 sm:p-7 rounded-2xl shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-[#c44a10]">
              <Loader2 className="animate-spin" size={24} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
              Loading Project Map
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
              Locating project sites across Nuwakot...
            </p>
            {takingLonger && (
              <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 text-left text-xs text-amber-900">
                <p className="font-semibold mb-1">Connecting to server</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Render instances take ~30-50 seconds to boot up after inactivity. Your map will appear in just a moment!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top-Left Floating Controls: Back button & Compact Project Info Box */}
      <div className="absolute top-4 left-4 z-[500] max-w-xs sm:max-w-sm space-y-2 pointer-events-none">
        {/* Back to main site / project button */}
        <div className="pointer-events-auto">
          <Link
            to={backToProjectLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold rounded-full shadow-md border border-slate-200/80 hover:bg-white hover:text-[#c44a10] active:scale-95 transition-all"
            title="Back to project details"
          >
            <ArrowLeft size={14} className="text-[#c44a10]" />
            <span>Back to project</span>
          </Link>
        </div>

        {/* Small project info panel */}
        {project && (
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-slate-200/80 transition-all">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c44a10]" />
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[240px]">
                  {project.name || project.title}
                </h1>
              </div>
            </div>

            <div className="mt-1.5 space-y-1">
              {project.about && (
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {project.about}
                </p>
              )}
              <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium pt-1">
                {project.regionName && (
                  <span className="flex items-center gap-1 text-[#c44a10] font-semibold">
                    <Layers size={11} /> {project.regionName} District
                  </span>
                )}
                {project.startDate && (
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />{' '}
                    {new Date(project.startDate).toLocaleDateString(undefined, {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              {/* Verified School Sites List Toggle */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowLocationsList(!showLocationsList)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#c44a10] hover:text-[#9a3412] transition-colors"
                >
                  <MapPin size={12} />
                  <span>{validLocations.length} School Sites</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({showLocationsList ? 'hide' : 'browse all'})
                  </span>
                </button>
              </div>

              {showLocationsList && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 max-h-48 overflow-y-auto space-y-1 pr-1">
                  {validLocations.map((loc) => (
                    <button
                      key={loc._id}
                      type="button"
                      onClick={() => setSelectedLocation(loc)}
                      className={`w-full text-left p-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        selectedLocation?._id === loc._id
                          ? 'bg-amber-100 text-[#c44a10] font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="font-semibold truncate">{loc.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{loc.area || 'Nuwakot'}</div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {Number(loc.lat).toFixed(5)}, {Number(loc.lng).toFixed(5)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map */}
      <MapContainer
        center={defaultCenter}
        zoom={10}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
      >
        <MapResizeHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Deselect on clicking map background */}
        <MapBackgroundClickHandler onDeselect={() => setSelectedLocation(null)} />

        {/* Region Boundary GeoJSON Highlight */}
        {regionGeoJSON && <GeoJSON data={regionGeoJSON} style={regionStyle} />}

        {/* Region District Centroid Label Badge */}
        {regionGeoJSON && (
          <Marker
            position={regionLabelPosition}
            icon={createRegionLabelIcon(project?.regionName || 'Nuwakot')}
            interactive={false}
          />
        )}

        {/* Automatic Viewport Bounds Fitting */}
        <MapBoundsHandler
          geojsonData={regionGeoJSON}
          locations={validLocations}
          selectedLocation={selectedLocation}
        />

        {/* Custom Type-Based Location Markers */}
        {validLocations.map((loc) => {
          const isSelected = selectedLocation?._id === loc._id;
          const icon = createTypePinIcon(loc, isSelected);
          const markerPos = [
            Number(loc.displayLat ?? loc.lat),
            Number(loc.displayLng ?? loc.lng),
          ];

          const studentVal =
            loc.details?.find((d) => (d.label || '').toLowerCase().includes('student'))?.value ||
            (loc.studentCount != null ? String(loc.studentCount) : null);
          const principalVal =
            loc.details?.find((d) => (d.label || '').toLowerCase().includes('principal'))?.value ||
            loc.principalName;
          const contactVal =
            loc.details?.find((d) => (d.label || '').toLowerCase().includes('contact'))?.value ||
            loc.contact;

          return (
            <Marker
              key={`${loc._id}_${loc.displayLat ?? loc.lat}_${loc.displayLng ?? loc.lng}_${isSelected ? 'active' : 'idle'}`}
              position={markerPos}
              icon={icon}
              eventHandlers={{
                click: (e) => {
                  if (e?.originalEvent) {
                    e.originalEvent.stopPropagation();
                  }
                  setSelectedLocation(loc);
                },
              }}
            >
              <Popup className="school-leaflet-popup" offset={[0, -22]} maxWidth={300}>
                <div className="p-1 space-y-2 text-slate-800">
                  {loc.photos && loc.photos.length > 0 && (
                    <div className="h-28 w-full rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                      <img
                        src={getMediaUrl(loc.photos[0])}
                        alt={loc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#c44a10]">
                      {loc.type || 'Community School'}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {loc.name}
                    </h4>
                    {loc.area && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                        <MapPin size={11} className="text-[#c44a10]" /> {loc.area}
                      </div>
                    )}
                  </div>

                  {/* Quick stats pills */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5 text-[11px]">
                    {studentVal && (
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                        <Users size={11} className="text-[#c44a10]" /> {studentVal} Students
                      </span>
                    )}
                    {principalVal && (
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded inline-flex items-center gap-1 font-medium">
                        <User size={11} /> {principalVal}
                      </span>
                    )}
                    {contactVal && (
                      <a
                        href={`tel:${contactVal}`}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded inline-flex items-center gap-1 hover:underline font-semibold"
                      >
                        <Phone size={11} /> {contactVal}
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation(loc);
                    }}
                    className="w-full mt-2 py-2 px-3 bg-[#c44a10] hover:bg-[#9a3412] text-white text-xs font-bold rounded-xl text-center transition-colors shadow-xs"
                  >
                    View Full School Profile
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* ── BIG POP-UP MODAL CARD (Desktop Centered 560-640px / Mobile Bottom Sheet) ── */}
      {selectedLocation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedLocation(null);
            }
          }}
          className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            ref={modalRef}
            className={`
              relative w-full sm:max-w-[600px]
              bg-white shadow-2xl
              rounded-t-3xl sm:rounded-3xl
              border border-slate-200/90
              max-h-[88vh] sm:max-h-[85vh]
              flex flex-col overflow-hidden
              animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200
            `}
          >
            {/* Mobile Sheet Drag Handle */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
              <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedLocation(null)}
              className="absolute top-3.5 right-3.5 z-20 p-2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto flex-1">
              {/* Photo Carousel, Single Image, or Decorative School Banner */}
              {selectedLocation.photos && selectedLocation.photos.length > 0 ? (
                <div className="relative w-full h-56 sm:h-64 bg-slate-900 shrink-0 overflow-hidden">
                  <img
                    src={getMediaUrl(selectedLocation.photos[activePhotoIndex] || selectedLocation.photos[0])}
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedLocation.photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIndex((prev) =>
                            prev === 0 ? selectedLocation.photos.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIndex((prev) =>
                            prev === selectedLocation.photos.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all"
                        aria-label="Next photo"
                      >
                        <ChevronRight size={16} />
                      </button>

                      {/* Photo indicator dots */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {selectedLocation.photos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIndex(idx)}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === activePhotoIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                            }`}
                            aria-label={`Go to photo ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative w-full h-32 sm:h-36 bg-gradient-to-r from-amber-700 to-[#c44a10] shrink-0 flex items-center justify-center p-6 text-white text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <GraduationCap size={24} className="text-white" />
                    </div>
                    <span className="text-xs font-bold tracking-wider uppercase text-amber-100">
                      {selectedLocation.type || 'Community School'}
                    </span>
                  </div>
                </div>
              )}

              {/* Main Content Body */}
              <div className="p-6 sm:p-7 space-y-6">
                {/* Header: Name, Area, Status Badge */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-1.5">
                    <span className="text-xs font-bold text-[#c44a10] uppercase tracking-wider">
                      {selectedLocation.type || 'Community School'}
                    </span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Active School Site
                    </span>
                  </div>

                  <h2
                    id="location-modal-title"
                    className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight"
                  >
                    {selectedLocation.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    {selectedLocation.area && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin size={13} className="text-[#c44a10] shrink-0" />
                        <span>{selectedLocation.area}</span>
                      </div>
                    )}
                    {selectedLocation.lat != null && selectedLocation.lng != null && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        <span>GPS: {Number(selectedLocation.lat).toFixed(6)}, {Number(selectedLocation.lng).toFixed(6)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary narrative */}
                {selectedLocation.summary && (
                  <p className="text-sm text-slate-600 leading-relaxed bg-[#faf8f5] p-4 rounded-2xl border border-slate-100">
                    {selectedLocation.summary}
                  </p>
                )}

                {/* Dynamic Details Key-Value Cards */}
                {displayedDetails && displayedDetails.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {displayedDetails.map((item, idx) => {
                      const isPhone =
                        (item.label || '').toLowerCase().includes('contact') ||
                        (item.label || '').toLowerCase().includes('phone');
                      return (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-left"
                        >
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            {item.label}
                          </div>
                          {isPhone ? (
                            <a
                              href={`tel:${item.value}`}
                              className="text-xs sm:text-sm font-semibold text-[#c44a10] hover:underline flex items-center gap-1.5"
                            >
                              <Phone size={13} /> {item.value}
                            </a>
                          ) : (
                            <div className="text-xs sm:text-sm font-semibold text-slate-800 break-words">
                              {item.value}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Exact GPS Coordinates Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>GPS Coordinates</span>
                  <span className="font-mono text-slate-600 font-semibold">
                    {Number(selectedLocation.lat).toFixed(6)}, {Number(selectedLocation.lng).toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
