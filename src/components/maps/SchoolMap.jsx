import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft,
  X,
  MapPin,
  Users,
  User,
  Phone,
  CheckCircle2,
  Circle,
  Calendar,
  Loader2,
  RefreshCw,
  School,
} from 'lucide-react';
import { getMediaUrl } from '../../utils/mediaUrl';
import api from '../../services/api';

const createCustomPinIcon = (isSelected = false) => {
  const bg = '#c44a10';
  const size = isSelected ? 40 : 32;
  const anchorY = isSelected ? 40 : 32;
  const anchorX = size / 2;

  const innerDot = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;

  return L.divIcon({
    className: 'school-marker-pin',
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
          border: ${isSelected ? '3px' : '2.5px'} solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          ${innerDot}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [anchorX, anchorY],
  });
};

function FitBoundsToPins({ schools, selectedSchool }) {
  const map = useMap();
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (schools.length === 0 || hasFittedRef.current) return;

    const validCoords = schools
      .filter((s) => s.lat != null && s.lng != null && !isNaN(Number(s.lat)) && !isNaN(Number(s.lng)))
      .map((s) => [Number(s.lat), Number(s.lng)]);

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 13,
        animate: true,
      });
      hasFittedRef.current = true;
    }
  }, [schools, map]);

  useEffect(() => {
    if (selectedSchool && selectedSchool.lat != null && selectedSchool.lng != null) {
      map.panTo([Number(selectedSchool.lat), Number(selectedSchool.lng)], {
        animate: true,
        duration: 0.6,
      });
    }
  }, [selectedSchool, map]);

  return null;
}

export default function SchoolMap() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [takingLonger, setTakingLonger] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTakingLonger(false);

    const timer = setTimeout(() => {
      setTakingLonger(true);
    }, 3500);

    try {
      const res = await api.get(`/schools?_t=${Date.now()}`);
      const list = res.data?.data || [];
      setSchools(list);
    } catch (err) {
      console.error('API error fetching schools:', err.message);
      setError(err.response?.data?.message || err.message || 'Unable to load schools from server.');
      setSchools([]);
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const schoolsWithCoordinates = useMemo(() => {
    const valid = schools.filter((school) => {
      const lat = Number(school.lat);
      const lng = Number(school.lng);
      return (
        school.lat != null &&
        school.lng != null &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      );
    });

    const coordMap = new Map();
    return valid.map((s) => {
      const key = `${Number(s.lat).toFixed(5)}_${Number(s.lng).toFixed(5)}`;
      const seen = coordMap.get(key) || 0;
      coordMap.set(key, seen + 1);

      if (seen === 0) {
        return {
          ...s,
          displayLat: Number(s.lat),
          displayLng: Number(s.lng),
        };
      }

      const angle = seen * 1.57;
      const dist = 0.0006;
      return {
        ...s,
        displayLat: Number(s.lat) + dist * Math.cos(angle),
        displayLng: Number(s.lng) + dist * Math.sin(angle),
      };
    });
  }, [schools]);

  const defaultCenter = [27.95, 85.3];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#f6f3ee]">
      <div className="absolute top-4 left-4 z-[500]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white/95 backdrop-blur-md text-slate-800 text-xs sm:text-sm font-semibold rounded-full shadow-lg border border-slate-200/80 hover:bg-white hover:text-[#c44a10] active:scale-95 transition-all duration-200"
          title="Return to Sa-Sewa Foundation Homepage"
        >
          <ArrowLeft size={16} className="text-[#c44a10]" />
          <span>Back to main site</span>
        </Link>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white max-w-sm w-full p-6 sm:p-7 rounded-2xl shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-[#c44a10]">
              <Loader2 className="animate-spin" size={24} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
              Loading School Locations
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
              Locating schools across Nuwakot...
            </p>
          </div>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={10}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBoundsToPins
          schools={schoolsWithCoordinates}
          selectedSchool={selectedSchool}
        />

        {schoolsWithCoordinates.map((school) => {
          const isSelected = selectedSchool?._id === school._id;
          const icon = createCustomPinIcon(isSelected);
          const markerPos = [
            Number(school.displayLat ?? school.lat),
            Number(school.displayLng ?? school.lng),
          ];

          return (
            <Marker
              key={school._id}
              position={markerPos}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedSchool(school);
                },
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
