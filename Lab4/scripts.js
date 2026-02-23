const accessToken = "pk.eyJ1IjoibWF4d2hpdGVob3VzZSIsImEiOiJjbG9peW9nY3UxZTN5MnJvMWV2ZGVxZ3VqIn0.a8iEZsSCZA7IP7mtskj4TQ";

const mapboxTiles = L.tileLayer(
  'https://api.mapbox.com/styles/v1/maxwhitehouse/cmlyedwpt000w01ptbx299yqa/tiles/512/{z}/{x}/{y}?access_token=' + accessToken,
  {
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 20,
    attribution: "© OpenStreetMap © Mapbox"
  }
);

var map = L.map('map', {
  center: [39, -98],
  zoom: 4,
  layers: [mapboxTiles]
});
L.popup({
    closeOnClick: true
})
.setLatLng([39,-98])
.setContent(
"<h3>NCAA Men's Volleyball Map</h3>" +
"<p>This interactive map shows all Division I men's volleyball programs in the United States.</p>" +
"<p>Each volleyball icon represents a different conference.</p>"
)
.openOn(map);

var vb1 = L.icon({ iconUrl: 'pics/vb1.png', iconSize: [35,35], iconAnchor: [17,17] });
var vb2 = L.icon({ iconUrl: 'pics/vb2.png', iconSize: [35,35], iconAnchor: [17,17] });
var vb3 = L.icon({ iconUrl: 'pics/vb3.png', iconSize: [35,35], iconAnchor: [17,17] });
var vb4 = L.icon({ iconUrl: 'pics/vb4.png', iconSize: [35,35], iconAnchor: [17,17] });
var vb5 = L.icon({ iconUrl: 'pics/vb5.png', iconSize: [35,35], iconAnchor: [17,17] });
var vb6 = L.icon({ iconUrl: 'pics/vb6.png', iconSize: [35,35], iconAnchor: [17,17] });

function getIcon(conf) {
  if (conf === "Big West") return vb1;
  if (conf === "MPSF") return vb2;
  if (conf === "MIVA") return vb3;
  if (conf === "EIVA") return vb4;
  if (conf === "NEC") return vb5;
  if (conf === "Conference Carolinas") return vb6;
  return vb1;
}

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');

  div.style.background = "white";
  div.style.padding = "10px";
  div.style.borderRadius = "8px";
  div.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  div.style.fontSize = "14px";
  div.style.lineHeight = "22px";

  div.innerHTML =
    "<b>Conferences</b><br><br>" +
    '<img src="pics/vb1.png" width="20" style="vertical-align:middle;margin-right:6px;"> Big West<br>' +
    '<img src="pics/vb2.png" width="20" style="vertical-align:middle;margin-right:6px;"> MPSF<br>' +
    '<img src="pics/vb3.png" width="20" style="vertical-align:middle;margin-right:6px;"> MIVA<br>' +
    '<img src="pics/vb4.png" width="20" style="vertical-align:middle;margin-right:6px;"> EIVA<br>' +
    '<img src="pics/vb5.png" width="20" style="vertical-align:middle;margin-right:6px;"> NEC<br>' +
    '<img src="pics/vb6.png" width="20" style="vertical-align:middle;margin-right:6px;"> Conf Carolinas<br>';

  return div;
};

legend.addTo(map);

fetch("data/d1_ncaa_mens_volleyball_with_conferences.geojson")
  .then(r => r.json())
  .then(data => {
    var teams = L.geoJSON(data, {

      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: getIcon(feature.properties.conference)
        });
      },

      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<b>" + feature.properties.school + "</b><br>" +
          feature.properties.conference
        );
      }

    }).addTo(map);

    map.fitBounds(teams.getBounds());

  })
  .catch(err => console.error("GeoJSON load error:", err));