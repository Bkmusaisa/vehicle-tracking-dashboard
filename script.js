const sheetURL = "https://script.google.com/macros/s/AKfycbwoQx-qbNPQS9h4sibvu_8MZDUbIVpW7qI_gcb_eIc/dev";

const map = L.map("map").setView([11.0667, 7.7167], 14); // ABU Zaria

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const vehicleMarkers = {};

function fetchData() {
  fetch(sheetURL)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((vehicle) => {
        const { id, lat, lng, speed, time, color } = vehicle;

        const position = [parseFloat(lat), parseFloat(lng)];

        if (!vehicleMarkers[id]) {
          const marker = L.circleMarker(position, {
            radius: 8,
            color: color || "blue"
          }).addTo(map);
          marker.bindPopup(`<b>Vehicle ${id}</b><br>Speed: ${speed} km/h<br>Time: ${time}`);
          vehicleMarkers[id] = marker;
        } else {
          vehicleMarkers[id].setLatLng(position);
          vehicleMarkers[id].setStyle({ color: color || "blue" });
          vehicleMarkers[id].setPopupContent(`<b>Vehicle ${id}</b><br>Speed: ${speed} km/h<br>Time: ${time}`);
        }
      });
    })
    .catch((err) => console.error("Failed to fetch data:", err));
}

function sendOverride(state) {
  fetch(sheetURL + "?override=" + state)
    .then(() => {
      document.getElementById("status").innerHTML = `Status: <span>Override ${state}</span>`;
    })
    .catch(() => {
      document.getElementById("status").innerHTML = `Status: <span style="color:red">Error Sending</span>`;
    });
}

setInterval(fetchData, 5000); // Update every 5 seconds
fetchData();
// comments
