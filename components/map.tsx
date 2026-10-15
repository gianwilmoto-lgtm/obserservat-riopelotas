"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
export function WorkMap({
  lat,
  lng,
  title,
}: {
  lat: number;
  lng: number;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, E] = useState(false);
  useEffect(() => {
    let disposed = false;
    let map: import("leaflet").Map | undefined;
    import("leaflet")
      .then((L) => {
        if (disposed || !ref.current) return;
        map = L.map(ref.current).setView([lat, lng], 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        })
          .on("tileerror", () => E(true))
          .addTo(map);
        L.circleMarker([lat, lng], {
          radius: 10,
          color: "#163c37",
          fillColor: "#b7e15d",
          fillOpacity: 1,
        })
          .addTo(map)
          .bindTooltip(title);
      })
      .catch(() => E(true));
    return () => {
      disposed = true;
      map?.remove();
    };
  }, [lat, lng, title]);
  return (
    <>
      <div
        ref={ref}
        className="map"
        aria-label={"Localização aproximada: " + title}
      />
      {error && (
        <p className="small" role="status">
          Mapa externo indisponível. Coordenadas aproximadas: {lat}, {lng}.
        </p>
      )}
      <p className="small muted">
        Localização fictícia. O carregamento do mapa envia seu IP ao
        OpenStreetMap.
      </p>
    </>
  );
}
