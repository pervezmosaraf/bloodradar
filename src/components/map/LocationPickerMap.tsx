"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Navigation, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Custom high-visibility SVG pin to prevent missing asset 404s in Next.js
const customPinIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <span style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background-color: rgba(225, 29, 72, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <div style="width: 28px; height: 28px; border-radius: 9999px; background: linear-gradient(135deg, #e11d48, #be123c); border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; color: white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 30],
});

interface MapClickHandlerProps {
  onLocationSelected: (lat: number, lng: number) => void;
}

function MapClickHandler({ onLocationSelected }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onLocationSelected(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

export interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onChange: (lat: number, lng: number) => void;
  error?: string;
}

export default function LocationPickerMap({
  initialLat,
  initialLng,
  onChange,
  error,
}: LocationPickerMapProps) {
  const defaultCenter = { lat: 23.8103, lng: 90.4125 }; // Central Dhaka
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleSelectLocation = useCallback(
    (lat: number, lng: number) => {
      const roundedLat = Math.round(lat * 10000) / 10000;
      const roundedLng = Math.round(lng * 10000) / 10000;
      setSelectedPosition({ lat: roundedLat, lng: roundedLng });
      onChange(roundedLat, roundedLng);
      setGeoError(null);
    },
    [onChange]
  );

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLocating(false);
        const { latitude, longitude } = position.coords;
        if (latitude < 20 || latitude > 27 || longitude < 88 || longitude > 93) {
          setGeoError(
            "Your detected location is outside Bangladesh. Please pick a location within Dhaka manually."
          );
          return;
        }
        handleSelectLocation(latitude, longitude);
      },
      (err) => {
        setGeoLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Location permission denied. Please click on the map to set your location.");
        } else {
          setGeoError("Unable to retrieve location. Please click on the map.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const markerPosition = selectedPosition || defaultCenter;

  const eventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        const marker = e.target;
        if (marker != null) {
          const latlng = marker.getLatLng();
          handleSelectLocation(latlng.lat, latlng.lng);
        }
      },
    }),
    [handleSelectLocation]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brand-600" />
          <span>Donor Coverage Location <span className="text-brand-600">*</span></span>
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={geoLocating}
          className="text-xs gap-1.5 h-8 py-0 border-slate-300 hover:bg-slate-50 text-slate-700"
        >
          <Navigation className={`w-3.5 h-3.5 text-brand-600 ${geoLocating ? "animate-spin" : ""}`} />
          {geoLocating ? "Detecting GPS..." : "Use My Current Location"}
        </Button>
      </div>

      <p className="text-xs text-slate-500">
        Click on the map or drag the pin to set where you are available to respond to emergencies.
      </p>

      {geoError && (
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Map Container */}
      <div className={`relative h-64 sm:h-72 w-full rounded-xl overflow-hidden border ${error ? "border-red-400 ring-2 ring-red-100" : "border-slate-300 shadow-inner"}`}>
        <MapContainer
          center={[markerPosition.lat, markerPosition.lng]}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", zIndex: 10 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelected={handleSelectLocation} />
          {selectedPosition && (
            <>
              <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={[selectedPosition.lat, selectedPosition.lng]}
                icon={customPinIcon}
              />
              <RecenterMap lat={selectedPosition.lat} lng={selectedPosition.lng} />
            </>
          )}
        </MapContainer>

        {!selectedPosition && (
          <div className="absolute inset-0 bg-slate-900/10 pointer-events-none z-20 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-slate-200 text-xs font-semibold text-slate-800 text-center">
              📍 Click anywhere on the map to place your pin
            </div>
          </div>
        )}
      </div>

      {/* Selected Confirmation */}
      {selectedPosition ? (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Location selected: <strong>{selectedPosition.lat.toFixed(4)}°N, {selectedPosition.lng.toFixed(4)}°E</strong>.
            <span className="text-emerald-700 font-normal ml-1">
              (Stored as PostGIS geography point. Your exact location is never exposed publicly.)
            </span>
          </span>
        </div>
      ) : (
        error && <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
