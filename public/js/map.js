const MAP_TOKEN = mapToken;

window.addEventListener("load", () => {
  const mapEl = document.getElementById("map");
  const mapStatus = document.getElementById("map-status");

  if (!mapEl) return;

  if (typeof mapboxgl === "undefined") {
    if (mapStatus) mapStatus.textContent = "Map library failed to load.";
    return;
  }

  if (!MAP_TOKEN) {
    if (mapStatus) mapStatus.textContent = "Map token is missing.";
    return;
  }

  const lng = Number(mapEl.dataset.lng || 77.209);
  const lat = Number(mapEl.dataset.lat || 28.6139);
  const title = mapEl.dataset.title || "Listing";
  const location = mapEl.dataset.location || "";
  const country = mapEl.dataset.country || "";
  const coordinates = [lng, lat];

  mapboxgl.accessToken = MAP_TOKEN;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9
  });

  new mapboxgl.Marker({ color: "#fe424d" })
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${location}</h4><p>Exact Location provided after booking</p>`
      )
    )
    .addTo(map);

  map.on("load", () => {
    if (mapStatus) mapStatus.textContent = "";
    map.resize();
  });
});
