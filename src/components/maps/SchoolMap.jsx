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

// Pin color configuration based on project progress
const getProgressColor = (percent = 0) => {
  if (percent >= 100) {
    return {
      bg: '#16a34a',
      border: '#15803d',
      label: 'Completed',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    };
  }
  if (percent > 0) {
    return {
      bg: '#c44a10',
      border: '#a53f0f',
      label: 'In Progress',
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    };
  }
  return {
    bg: '#64748b',
    border: '#475569',
    label: 'Planning',
    badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
  };
};

const createCustomPinIcon = (progressPercent = 0, isSelected = false) => {
  const { bg } = getProgressColor(progressPercent);
  const size = isSelected ? 40 : 32;
  const anchorY = isSelected ? 40 : 32;
  const anchorX = size / 2;

  const innerDot =
    progressPercent >= 100
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>`;

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

const FALLBACK_SCHOOLS = [
  {
    _id: 'sch_mangala',
    name: 'Shree Mangala Devi School',
    area: 'Chaap (Bore)',
    lat: 27.953881857768977,
    lng: 85.2738286829179,
    progressPercent: 65,
    summary: 'Classroom refurbishment and solar lighting installation.',
  },
  {
    _id: 'sch_dudhedevi',
    name: 'Shree Dudhe Devi Secondary School',
    area: 'Jongdada',
    lat: 27.96150824289415,
    lng: 85.29407112293492,
    progressPercent: 80,
    summary: 'Secondary education building support and science lab equipment.',
  },
  {
    _id: 'sch_nirgubhumi',
    name: 'Nirgu Bhume Basic School',
    area: 'Semrang',
    lat: 27.974083333333333,
    lng: 85.29216666666666,
    progressPercent: 50,
    summary: 'Basic primary education facilities and winter supplies.',
  },
  {
    _id: 'sch_gauri',
    name: 'Gauri Shankar',
    area: 'Sano Bhorle',
    lat: 27.964055555555554,
    lng: 85.28744444444445,
    progressPercent: 40,
    summary: 'Community learning center and library books support.',
  },
  {
    _id: 'sch_lachen',
    name: 'Lachen Basic School',
    area: 'Solamane',
    lat: 27.964055555555554,
    lng: 85.28744444444445,
    progressPercent: 35,
    summary: 'Rural primary school reconstruction and clean drinking water.',
  },
  {
    _id: 'sch_kalika',
    name: 'Kalika Devi Basic School',
    area: 'Lachyang',
    lat: 27.946491,
    lng: 85.28996,
    progressPercent: 60,
    summary: 'Classroom upgrades and student learning materials.',
  },
  {
    _id: 'sch_janashakti',
    name: 'Jana Sakti Basic School',
    area: 'Dupcheshwar',
    lat: 27.974083333333333,
    lng: 85.29216666666666,
    progressPercent: 45,
    summary: 'Basic school facilities and educational materials.',
  },
  {
    _id: 'sch_mahakali',
    name: 'Mahakali Basic School',
    area: 'Ditha Saura',
    lat: 27.96683333333333,
    lng: 85.26191666666666,
    progressPercent: 30,
    summary: 'Classroom roof repairs and desk-bench infrastructure.',
  },
];

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
      if (list.length > 0) {
        setSchools(list);
      } else {
        setSchools(FALLBACK_SCHOOLS);
      }
    } catch (err) {
      console.warn('Live API unavailable for schools, using fallback list:', err.message);
      setSchools(FALLBACK_SCHOOLS);
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
              Locating schools and community milestones in Nuwakot...
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
          const icon = createCustomPinIcon(school.progressPercent || 0, isSelected);
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
