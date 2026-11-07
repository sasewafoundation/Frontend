import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiMapPin, FiX } from 'react-icons/fi';

// Custom crisp SVG pin icon that doesn't depend on external image assets
const createPinIcon = () =>
  L.divIcon({
    className: 'leaflet-admin-pin',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        background: #c44a10;
        border: 2.5px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(196,74,16,0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
      ">
        <div style="
          width: 9px;
          height: 9px;
          background: #ffffff;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    },
  });
  return null;
}

function MapCenterSync({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] != null && center[1] != null) {
      map.setView(center, Math.max(map.getZoom(), 12), { animate: true });
    }
  }, [center, map]);
  return null;
}

const LocationPicker = ({ lat, lng, onChange }) => {
  const pinIcon = useMemo(() => createPinIcon(), []);

  const hasLocation = lat != null && lng != null && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));
  const currentCenter = hasLocation ? [Number(lat), Number(lng)] : [27.95, 85.3]; // Default to Nuwakot / Nepal region
  const defaultZoom = hasLocation ? 12 : 9;

  const handleSelect = (newLat, newLng) => {
    onChange(newLat, newLng);
  };

  const handleMarkerDrag = (e) => {
    const marker = e.target;
    const pos = marker.getLatLng();
    onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
  };

  const handleClear = () => {
    onChange(null, null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
          <FiMapPin className="text-primary-600" />
          Click on the map or drag the pin to set site coordinates:
        </span>
        {hasLocation ? (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-white hover:bg-red-50 hover:text-red-700 border border-neutral-300 hover:border-red-300 rounded-xl shadow-xs transition-colors"
          >
            <FiX size={13} /> Clear location
          </button>
        ) : (
          <span className="text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full font-bold text-xs shadow-xs">
            No location set yet
          </span>
        )}
      </div>

      <div className="h-64 w-full rounded-xl overflow-hidden border border-neutral-300 shadow-sm relative z-0">
        <MapContainer
          center={currentCenter}
          zoom={defaultZoom}
          scrollWheelZoom={false}
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onSelect={handleSelect} />
          {hasLocation && (
            <>
              <Marker
                position={[Number(lat), Number(lng)]}
                icon={pinIcon}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDrag,
                }}
              />
              <MapCenterSync center={[Number(lat), Number(lng)]} />
            </>
          )}
        </MapContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-neutral-800 font-bold uppercase tracking-wider text-[11px] mb-1">
            Latitude (-90 to 90)
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 27.831971"
            value={lat ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Number(e.target.value);
              onChange(val, lng);
            }}
            className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs font-mono font-semibold shadow-xs"
          />
        </div>
        <div>
          <label className="block text-neutral-800 font-bold uppercase tracking-wider text-[11px] mb-1">
            Longitude (-180 to 180)
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 85.411231"
            value={lng ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? null : Number(e.target.value);
              onChange(lat, val);
            }}
            className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs font-mono font-semibold shadow-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
