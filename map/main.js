/* ============================================================
   Urban Futures – Interactive Map (Leaflet variant)
   Same features as the Mapbox build: climate layer toggles,
   clickable neighborhood polygons, project cards, and
   Flushing-specific rain garden/CSO layers tied to cards.
   No token required — Carto light basemap.
   ============================================================ */

const LEAP_SOURCE_RAW = 'https://raw.githubusercontent.com/leap-stc/leap-hackathon-website/main';
const DCP_TILES = 'https://tiles.arcgis.com/tiles/GfwWNkhOj9bNBqoJ/arcgis/rest/services';

const OVERLAY_SOURCES = {
  cloudburst: {
    kind: 'geojson',
    url: 'data/cloudburst_extreme_2080.geojson',
    color: '#5B8DD9', opacity: 0.55
  },
  heat: {
    kind: 'raster',
    url: 'data/tiles/heat/{z}/{x}/{y}.png',
    tms: false, opacity: 0.75,
    attribution: 'Mean Surface Temp Deviation 2020-22 – NYC City Council'
  },
  pfirm: {
    kind: 'raster',
    url: `${DCP_TILES}/2015PFIRMS/MapServer/tile/{z}/{y}/{x}`,
    opacity: 0.75,
    attribution: '2015 PFIRM Flood Zones – FEMA / NYC DCP'
  },
  surge2080: {
    kind: 'raster',
    url: `${DCP_TILES}/Future_Floodplain_2080s/MapServer/tile/{z}/{y}/{x}`,
    opacity: 0.65,
    attribution: 'Future Floodplain 2080s – NYC DCP'
  },
  seaLevelRise: {
    kind: 'raster',
    url: `${DCP_TILES}/High_Tide_2080s/MapServer/tile/{z}/{y}/{x}`,
    opacity: 0.65,
    attribution: 'High Tide 2080s – NYC DCP'
  }
};

const LAYER_DESCRIPTIONS = {
  heat: {
    title: 'Extreme Heat',
    body: 'Of all four climate risks, the most injuries and fatalities are caused by extreme heat. Extreme heat is defined as three or more consecutive days when the temperature reaches 90 degrees fahrenheit or more. This map from the New York City Council shows average surface temperatures on a summer day, relative to the citywide average. Red areas are hotter than average by 1 to 8 degrees fahrenheit; blue areas are cooler than average by 1 to 8 degrees fahrenheit.',
    source: 'New York City Council Data Science Team'
  },
  pfirm: {
    title: 'PFIRM 2015 Flood Zones',
    body: 'FEMA\'s Preliminary Flood Insurance Rate Maps show regulatory flood risk zones across New York City, distinguishing between 1% annual chance (100-year) and 0.2% annual chance (500-year) floodplains based on current conditions.',
    source: 'FEMA – 2015 Preliminary Flood Insurance Rate Maps'
  },
  'flushing-rain-gardens': {
    title: 'Rain Gardens',
    body: 'Green infrastructure assets constructed by NYC DEP to capture and filter stormwater runoff before it enters the combined sewer system. Each installation reduces the volume of untreated sewage discharged into Flushing Bay during storm events.',
    source: 'NYC DEP – Green Infrastructure Map'
  },
  'flushing-cso': {
    title: 'Combined Sewer Overflow',
    body: 'In combined sewer areas, a single pipe carries both stormwater and sewage. During heavy rain events, the system overflows directly into waterways. This layer shows DEP green infrastructure assets specifically built in combined sewer drainage areas to reduce overflow frequency and volume.',
    source: 'NYC DEP – Green Infrastructure Map'
  },
  'flushing-cloudburst': {
    title: 'Cloudburst Flooding – Flushing',
    body: 'This layer maps areas at risk of stormwater flooding during moderate cloudburst events across the Flushing / Queens area. Blue zones indicate predicted inundation under moderate storm conditions, based on NYC stormwater flood modeling.',
    source: 'NYC Open Data – NYC Stormwater Flood Maps'
  },
  cloudburst: {
    title: 'Cloudburst Flooding 2080s',
    body: 'A cloudburst is a sudden downpour that can flood streets and basements. This layer shows NYC DEP\'s Extreme Flood scenario (3.66 inches/hour of rainfall) combined with projected 2080 sea level rise — the most severe of DEP\'s published stormwater flood scenarios. It is important to note that cloudbursts happen in specific locations because of the concentration of rainfall – while one neighborhood may experience flooding, another may not. Shading follows DEP\'s depth-based legend: lighter blue marks shallower predicted flooding (Category 1), darker blue marks deeper predicted flooding (Category 3).',
    source: 'NYC DEP – NYC Stormwater Flood Maps (Extreme Flood, 2080 Sea Level Rise)'
  },
  greenInfra: {
    title: 'Green Infrastructure',
    body: 'NYC DEP green infrastructure assets, including rain gardens and right-of-way stormwater practices that absorb runoff before it reaches the sewer system.',
    source: 'NYC DEP – Green Infrastructure Map'
  },
  cso: {
    title: 'Combined Sewer Context',
    body: 'Green infrastructure assets in combined sewer drainage areas. These points show stormwater interventions most directly tied to reducing combined sewer overflow pressure during heavy rain.',
    source: 'NYC DEP – Green Infrastructure Map'
  },
  csoLocations: {
    title: 'CSO Locations',
    body: 'Permitted combined sewer overflow (CSO) outfall points where excess stormwater and untreated sewage discharge directly into local waterways during heavy rain, filtered to those near Flushing Bay and Flushing River/Creek.',
    source: 'NYS DEC, CSO Outfalls (2026)'
  },
  floodNetSensors: {
    title: 'Flood Net Sensors',
    body: 'Locations of NYC FloodNet street-level flood sensors, which continuously measure the height of floodwater to support real-time flood detection and sensor-siting assessments.',
    source: 'NYC FloodNet, Sensor Deployment Metadata (2026)'
  },
  litterBaskets: {
    title: 'DSNY Litter Baskets',
    body: 'Locations and types of public litter baskets tracked by DSNY. Uneven basket distribution is linked to street litter and clogged catch basins, compounding flood risk in areas with aging sanitation infrastructure.',
    source: 'NYC DSNY – Litter Basket Map'
  },
  floodComplaints311: {
    title: '311 Flood Complaints',
    body: 'NYC 311 service requests reporting street flooding, catch basin flooding, and highway flooding from 2020 through the present. Each point is a resident-reported flooding incident, used to communicate lived flood impact directly from residents\' own reports.',
    source: 'NYC 311 Service Requests from 2020 to Present'
  },
  surge2080: {
    title: 'Coastal Surge 2080s',
    body: 'Storm surge is when high winds from a hurricane push water from the ocean inland such as during Hurricane Sandy in 2012. The FEMA PFIRM maps shows areas that could flood today, according to FEMA, for what is called a “100-year coastal storm.” Surge can also happen during smaller storms such as Nor’easters. The Coastal Surge 2080s map shows flooding that could happen 50 years from now based on projections by the NPCC.',
    source: 'FEMA; New York City Panel on Climate Change Projections'
  },
  seaLevelRise: {
    title: 'Sea Level Rise 2080s',
    body: 'High tides are getting higher around the world as the amount of water in oceans increases and expands because of higher temperatures. Coastal areas may be flooded twice a day in the future because the tide will come further inland. This map shows the NPCC’s projection for chronic tidal flooding 50 years from now.',
    source: 'New York City Panel on Climate Change Projections'
  },
  coolIt: {
    title: 'Cool It! Sites',
    body: 'Cooling resources from the Cool It! NYC program, including cooling sites, misting stations, and hydrant spray-cap locations used by the heat-access teams.',
    source: 'NYC Open Data – Cool It! NYC 2020 Cooling Sites'
  },
  fireHydrants: {
    title: 'Fire Hydrants',
    body: 'NYC fire hydrant locations, used to identify candidate sites for hydrant spray caps during extreme heat.',
    source: 'NYC Open Data – Hydrant Map (2026)'
  },
  treeCanopy: {
    title: 'Tree Census',
    body: 'Live tree inventory points showing local tree presence, species, and condition. This is NYC Parks Forestry\'s continuously updated tree inventory, giving tree-equity and urban forestry projects a closer visual match than rain-garden infrastructure alone.',
    source: 'NYC Parks – Forestry Tree Points'
  },
  brownfields: {
    title: 'Brownfield Sites',
    body: 'Environmental remediation and brownfield cleanup locations, filtered around the selected neighborhood to support redevelopment and cooling-intervention siting.',
    source: 'NYS DEC – Environmental Remediation Sites'
  },
  nycha: {
    title: 'NYCHA Communities',
    body: 'The New York City Housing Authority (NYCHA) is the nation\'s largest public housing landlord, providing affordable housing to hundreds of thousands of low- and moderate-income New Yorkers across the five boroughs. This layer shows the footprints of individual NYCHA housing developments — the building complexes and grounds that make up each community — used as the base layer for CLIM-ALIGN and other public-housing retrofit analysis, since these communities are often disproportionately exposed to climate risk and have historically received less investment in resilience upgrades.',
    source: 'NYC Open Data – NYCHA Public Housing Developments'
  },
  childAsthmaED: {
    title: 'Child Asthma ED Visits',
    body: 'Emergency department visits for asthma among children ages 5-17, by neighborhood tabulation area (NTA), averaged annually over 2017–2019. The three NTAs covering Soundview see between 240 and 272 visits per 10,000 children per year — darker fill indicates a higher rate.',
    source: 'NYC DOHMH Environment & Health Data Portal — Asthma ED visits (age 5-17), by NTA'
  },
  underutilizedSites: {
    title: 'Underutilized Sites',
    body: 'Strategic underutilized/redevelopment site candidates identified by Youth Ministries for Peace and Justice (YMPJ) across their Brownfield Opportunity Area study, filtered to the sites that fall within Soundview.',
    source: 'Underutilized Sites, YMPJ (2025)'
  }
};

const BASE_NEIGHBORHOOD_LAYER_DEFS = {
  greenInfraAll: {
    label: 'Green Infrastructure',
    color: '#22c55e',
    kind: 'point',
    descriptionId: 'greenInfra',
    endpoint: 'https://data.cityofnewyork.us/resource/df32-vzax.geojson',
    geometryField: 'the_geom',
    limit: 1500,
    circleOptions: { radius: 5, fillColor: '#22c55e', color: '#16a34a', weight: 1.5, opacity: 1, fillOpacity: 0.9 }
  },
  cso: {
    label: 'CSO Context',
    color: '#6366f1',
    kind: 'point',
    descriptionId: 'cso',
    endpoint: 'https://data.cityofnewyork.us/resource/df32-vzax.geojson',
    geometryField: 'the_geom',
    where: "sewer_type='Combined'",
    limit: 1000,
    circleOptions: { radius: 4, fillColor: '#6366f1', color: '#4338ca', weight: 1, opacity: 1, fillOpacity: 0.7 }
  },
  csoLocations: {
    label: 'CSO Locations',
    color: '#7C3AED',
    kind: 'point',
    descriptionId: 'csoLocations',
    fetchUrl: 'data/nyc-cso-outfalls.geojson',
    bufferMeters: 150,
    circleOptions: { radius: 5, fillColor: '#7C3AED', color: '#4C1D95', weight: 1, opacity: 1, fillOpacity: 0.85 }
  },
  floodNetSensors: {
    label: 'Flood Net Sensors',
    color: '#0891B2',
    kind: 'point',
    descriptionId: 'floodNetSensors',
    endpoint: 'https://data.cityofnewyork.us/resource/kb2e-tjy3.geojson',
    geometryField: 'location',
    limit: 500,
    circleOptions: { radius: 5, fillColor: '#0891B2', color: '#155E75', weight: 1, opacity: 1, fillOpacity: 0.85 }
  },
  floodComplaints311: {
    label: '311 Flood Complaints',
    color: '#B91C1C',
    kind: 'point',
    descriptionId: 'floodComplaints311',
    endpoint: 'https://data.cityofnewyork.us/resource/erm2-nwe9.geojson',
    geometryField: 'location',
    where: "complaint_type='Sewer' AND descriptor like '%Flooding%'",
    limit: 1000,
    circleOptions: { radius: 4, fillColor: '#B91C1C', color: '#7F1D1D', weight: 1, opacity: 1, fillOpacity: 0.75 }
  },
  litterBaskets: {
    label: 'DSNY Litter Baskets',
    color: '#B8860B',
    kind: 'point',
    descriptionId: 'litterBaskets',
    endpoint: 'https://data.cityofnewyork.us/resource/8znf-7b2c.geojson',
    geometryField: 'point',
    limit: 1000,
    circleOptions: { radius: 4, fillColor: '#B8860B', color: '#7A5A05', weight: 1, opacity: 1, fillOpacity: 0.75 }
  },
  surge2080: {
    label: 'Coastal Surge 2080s',
    color: '#0A3F6B',
    kind: 'overlay',
    overlayId: 'surge2080',
    descriptionId: 'surge2080'
  },
  coolIt: {
    label: 'Cool It! Sites',
    color: '#00A6A6',
    kind: 'point',
    descriptionId: 'coolIt',
    endpoint: 'https://data.cityofnewyork.us/resource/h2bn-gu9k.geojson',
    latField: 'y',
    lngField: 'x',
    limit: 1000,
    circleOptions: { radius: 5, fillColor: '#00A6A6', color: '#047878', weight: 1.5, opacity: 1, fillOpacity: 0.85 }
  },
  fireHydrants: {
    label: 'Fire Hydrants',
    color: '#DC2626',
    kind: 'point',
    descriptionId: 'fireHydrants',
    endpoint: 'https://data.cityofnewyork.us/resource/5bgh-vtsn.geojson',
    geometryField: 'the_geom',
    limit: 1500,
    circleOptions: { radius: 3, fillColor: '#DC2626', color: '#991B1B', weight: 0.8, opacity: 1, fillOpacity: 0.75 }
  },
  treeCanopy: {
    label: 'Tree Census',
    color: '#2F7D32',
    kind: 'point',
    descriptionId: 'treeCanopy',
    endpoint: 'https://data.cityofnewyork.us/resource/hn5i-inap.geojson',
    geometryField: 'location',
    where: "tpstructure='Full'",
    limit: 5000,
    circleOptions: { radius: 3, fillColor: '#2F7D32', color: '#1B5E20', weight: 0.8, opacity: 0.9, fillOpacity: 0.65 }
  },
  brownfields: {
    label: 'Brownfield Sites',
    color: '#8B5A2B',
    kind: 'point',
    descriptionId: 'brownfields',
    endpoint: 'https://data.ny.gov/resource/c6ci-rzpg.geojson',
    useBounds: false,
    where: "program_type='BCP'",
    limit: 5000,
    circleOptions: { radius: 5, fillColor: '#8B5A2B', color: '#5D3918', weight: 1.3, opacity: 1, fillOpacity: 0.82 }
  },
  nycha: {
    label: 'NYCHA Communities',
    color: '#C8373A',
    kind: 'geojson',
    descriptionId: 'nycha',
    endpoint: 'https://data.cityofnewyork.us/resource/phvi-damg.geojson',
    limit: 1000,
    style: { color: '#C8373A', weight: 1.5, opacity: 0.9, fillColor: '#C8373A', fillOpacity: 0.28 }
  },
  childAsthmaED: {
    label: 'Child Asthma ED Visits',
    color: '#1E3A8A',
    kind: 'geojson',
    descriptionId: 'childAsthmaED',
    fetchUrl: 'data/soundview-child-asthma-ed.geojson',
    style: (feature) => {
      const rate = (feature.properties && feature.properties.rate_per_10k_children) || 200;
      const t = Math.max(0, Math.min(1, (rate - 200) / (280 - 200)));
      const lerp = (a, b) => Math.round(a + (b - a) * t);
      const fillColor = `rgb(${lerp(191, 30)}, ${lerp(219, 58)}, ${lerp(254, 138)})`;
      return { color: '#1E3A8A', weight: 1.5, opacity: 0.9, fillColor, fillOpacity: 0.65 };
    }
  },
  underutilizedSites: {
    label: 'Underutilized Sites',
    color: '#1A1A1A',
    kind: 'point',
    descriptionId: 'underutilizedSites',
    fetchUrl: 'data/soundview-underutilized-sites.geojson',
    circleOptions: { radius: 5, fillColor: '#1A1A1A', color: '#000000', weight: 1, opacity: 1, fillOpacity: 0.85 }
  }
};

function nhoodLayer(neighborhoodId, baseId) {
  const base = BASE_NEIGHBORHOOD_LAYER_DEFS[baseId];
  return { ...base, id: `${neighborhoodId}--${baseId}`, baseId };
}

const NEIGHBORHOOD_LAYERS = {
  'east-harlem': [
    nhoodLayer('east-harlem', 'coolIt'),
    nhoodLayer('east-harlem', 'treeCanopy'),
    nhoodLayer('east-harlem', 'litterBaskets')
  ],
  soundview: [
    nhoodLayer('soundview', 'childAsthmaED'),
    nhoodLayer('soundview', 'underutilizedSites')
  ],
  flushing: [
    nhoodLayer('flushing', 'greenInfraAll'),
    nhoodLayer('flushing', 'floodComplaints311'),
    nhoodLayer('flushing', 'csoLocations')
  ],
  brownsville: [
    nhoodLayer('brownsville', 'nycha'),
    nhoodLayer('brownsville', 'fireHydrants'),
    nhoodLayer('brownsville', 'treeCanopy')
  ],
  stapleton: [
    nhoodLayer('stapleton', 'treeCanopy'),
    nhoodLayer('stapleton', 'greenInfraAll'),
    nhoodLayer('stapleton', 'floodNetSensors')
  ]
};

const PROJECT_LAYER_MAP = {
  'african-elephants': 'east-harlem--coolIt',
  'alaskan-brown-bears': 'east-harlem--treeCanopy',
  'blue-whales': 'east-harlem--litterBaskets',
  'giant-canoes': 'soundview--underutilizedSites',
  'giant-sequoias': 'soundview--underutilizedSites',
  'giant-squids': 'soundview--childAsthmaED',
  'gorillas': 'flushing--floodComplaints311',
  'hadrosaur-footprints': 'flushing--greenInfraAll',
  'king-penguins': 'flushing--csoLocations',
  'komodo-dragons': 'brownsville--fireHydrants',
  'megalodons': 'brownsville--treeCanopy',
  'moai-statues': 'brownsville--nycha',
  'sperm-whales': 'stapleton--treeCanopy',
  'stars-of-india': 'stapleton--greenInfraAll',
  'titanosaurs': 'stapleton--floodNetSensors'
};

const NEIGHBORHOOD_COLORS = {
  'east-harlem': '#64b9c4',
  'soundview': '#64b9c4',
  'flushing': '#64b9c4',
  'brownsville': '#64b9c4',
  'stapleton': '#64b9c4'
};

// ---- Map state ----
let map;
let activeNeighborhood = null;
let neighborhoodGeometries = {};
let activeProjectId = null;

let neighborhoodLayer = null;
let neighborhoodLabelGroup = null;
let neighborhoodLabelMarkers = {};
let overlayLayers = {};
let cloudburst_data = null;
let neighborhoodSpecificLayers = {};
let clippedOverlayCleanups = {};

function nhColor(id) {
  return NEIGHBORHOOD_COLORS[id] || '#888888';
}

function initMap() {
  const [lng, lat] = SITE_CONFIG.mapCenter;

  map = L.map('map', {
    center: [lat, lng],
    zoom: Math.round(SITE_CONFIG.mapZoom),
    zoomControl: false,
    minZoom: 9,
    maxZoom: 16,
    preferCanvas: true
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.control.scale({ imperial: true, metric: false, position: 'bottomleft' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }).addTo(map);

  // Pre-fetch cloudburst GeoJSON (shared between global overlay and per-neighborhood filters).
  // The source file is two enormous multi-thousand-vertex MultiPolygons (citywide, by flooding
  // category) — flattening into individual polygons up front keeps both the global render and
  // the per-neighborhood bbox filtering fast instead of running full polygon math on the whole city.
  fetch(OVERLAY_SOURCES.cloudburst.url)
    .then(r => r.json())
    .then(data => {
      cloudburst_data = (window.turf) ? turf.flatten(data) : data;
      const cloudburstShades = { 1: '#BFDBFE', 2: '#5B8DD9', 3: '#1E3A8A' };
      overlayLayers['cloudburst'] = L.geoJSON(cloudburst_data, {
        smoothFactor: 0.25,
        style: (feature) => {
          const fillColor = cloudburstShades[feature.properties.flooding_category] || OVERLAY_SOURCES.cloudburst.color;
          return {
            stroke: false,
            fillColor,
            fillOpacity: OVERLAY_SOURCES.cloudburst.opacity
          };
        }
      });
    });

  ['heat', 'pfirm', 'surge2080', 'seaLevelRise'].forEach(key => {
    const cfg = OVERLAY_SOURCES[key];
    overlayLayers[key] = L.tileLayer(cfg.url, {
      tms: cfg.tms || false,
      opacity: cfg.opacity,
      attribution: cfg.attribution || ''
    });
  });

  addNeighborhoodLayer();
  setupLayerToggles();
}

function addNeighborhoodLayer() {
  fetch(`${LEAP_SOURCE_RAW}/data/neighborhoods.geojson`)
    .then(r => r.json())
    .then(gj => {
      gj.features.forEach(f => {
        neighborhoodGeometries[f.properties.id] = f.geometry;
      });

      neighborhoodLayer = L.geoJSON(gj, {
        style: f => ({
          color: nhColor(f.properties.id),
          weight: 1.5, opacity: 0.9,
          fillColor: nhColor(f.properties.id),
          fillOpacity: 0.15
        }),
        onEachFeature: (feature, layer) => {
          layer.on('mouseover', () => {
            layer.setStyle({ fillOpacity: 0.35 });
            map.getContainer().style.cursor = 'pointer';
          });
          layer.on('mouseout', () => {
            layer.setStyle({ fillOpacity: 0.15 });
            map.getContainer().style.cursor = '';
          });
          layer.on('click', () => showNeighborhoodPanel(feature.properties.id));
        }
      }).addTo(map);

      // Labels via divIcon — callout box with a bottom tail, centered on the neighborhood
      neighborhoodLabelGroup = L.layerGroup();
      gj.features.forEach(f => {
        const center = L.geoJSON(f).getBounds().getCenter();
        const marker = L.marker(center, {
          icon: L.divIcon({
            className: 'uf-map-nhood-label',
            html: `<span class="uf-map-nhood-label-inner"><span class="uf-map-nhood-label-box">${(NEIGHBORHOODS.find(n => n.id === f.properties.id) || {}).name || f.properties.name}</span><span class="uf-map-nhood-label-tail"></span></span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0]
          }),
          interactive: false
        }).addTo(neighborhoodLabelGroup);
        neighborhoodLabelMarkers[f.properties.id] = marker;
      });
      neighborhoodLabelGroup.addTo(map);
    });
}

function setupLayerToggles() {
  document.querySelectorAll('.uf-map-controls > .uf-map-control-panel .uf-map-layer-toggle input[type="checkbox"]').forEach(toggle => {
    toggle.addEventListener('change', () => {
      const layerId = toggle.dataset.layer;

      if (layerId === 'neighborhoods') {
        if (toggle.checked) {
          if (neighborhoodLayer) neighborhoodLayer.addTo(map);
          if (neighborhoodLabelGroup) neighborhoodLabelGroup.addTo(map);
        } else {
          if (neighborhoodLayer) map.removeLayer(neighborhoodLayer);
          if (neighborhoodLabelGroup) map.removeLayer(neighborhoodLabelGroup);
        }
        return;
      }

      const layer = overlayLayers[layerId];
      if (!layer) return;
      if (toggle.checked) layer.addTo(map);
      else map.removeLayer(layer);

      setLayerDescriptionVisible(layerId, toggle.checked);
    });
  });
}

// ---- Neighborhood project layers ----
function getLayerDescription(layerId) {
  if (LAYER_DESCRIPTIONS[layerId]) return LAYER_DESCRIPTIONS[layerId];
  const cfg = Object.values(NEIGHBORHOOD_LAYERS).flat().find(l => l.id === layerId);
  return cfg ? LAYER_DESCRIPTIONS[cfg.descriptionId || cfg.baseId] : null;
}

function buildSocrataUrl(cfg, polygon) {
  if (cfg.fetchUrl) return cfg.fetchUrl;
  const params = [];
  const whereParts = [];

  if (polygon && cfg.useBounds !== false) {
    const bounds = L.geoJSON(polygon).getBounds();
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const west = bounds.getWest();

    if (cfg.geometryField) {
      whereParts.push(`within_box(${cfg.geometryField},${north},${west},${south},${east})`);
    } else if (cfg.latField && cfg.lngField) {
      whereParts.push(`${cfg.latField} between ${south} and ${north}`);
      whereParts.push(`${cfg.lngField} between ${west} and ${east}`);
    }
  }

  if (cfg.where) whereParts.push(cfg.where);
  if (whereParts.length) params.push(`$where=${encodeURIComponent(whereParts.join(' AND '))}`);
  params.push(`$limit=${cfg.limit || 1000}`);

  return `${cfg.endpoint}?${params.join('&')}`;
}

function normalizePointGeometry(data, cfg) {
  if (!cfg.latField || !cfg.lngField) return data;
  data.features.forEach(feature => {
    if (feature.geometry) return;
    const props = feature.properties || {};
    const lat = parseFloat(props[cfg.latField]);
    const lng = parseFloat(props[cfg.lngField]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      feature.geometry = { type: 'Point', coordinates: [lng, lat] };
    }
  });
  data.features = data.features.filter(feature => feature.geometry);
  return data;
}

function getPolygonBounds(polygon) {
  return polygon ? L.geoJSON(polygon).getBounds() : null;
}

function neighborhoodFeature(polygon, bufferMeters) {
  if (!polygon) return null;
  const feature = { type: 'Feature', properties: {}, geometry: polygon };
  if (bufferMeters && window.turf) {
    try { return turf.buffer(feature, bufferMeters, { units: 'meters' }); }
    catch (_) { return feature; }
  }
  return feature;
}

function featureCoordinates(feature) {
  const coords = [];
  const collect = value => {
    if (!Array.isArray(value)) return;
    if (typeof value[0] === 'number' && typeof value[1] === 'number') {
      coords.push(value);
      return;
    }
    value.forEach(collect);
  };
  collect(feature.geometry && feature.geometry.coordinates);
  return coords;
}

function pointInNeighborhood(coord, nhoodFeature) {
  if (!nhoodFeature || !window.turf) return true;
  try { return turf.booleanPointInPolygon(turf.point(coord), nhoodFeature); }
  catch (_) { return false; }
}

function featureTouchesNeighborhood(feature, nhoodFeature) {
  if (!nhoodFeature || !feature.geometry) return true;
  if (window.turf) {
    try {
      if (feature.geometry.type === 'Point') {
        return turf.booleanPointInPolygon(feature, nhoodFeature);
      }
      return turf.booleanIntersects(feature, nhoodFeature);
    } catch (_) {}
  }
  return featureCoordinates(feature).some(coord => pointInNeighborhood(coord, nhoodFeature));
}

function clipFeatureToNeighborhood(feature, nhoodFeature) {
  if (!nhoodFeature || !feature.geometry) return feature;
  if (feature.geometry.type === 'Point') {
    return pointInNeighborhood(feature.geometry.coordinates, nhoodFeature) ? feature : null;
  }
  if (!window.turf) return featureTouchesNeighborhood(feature, nhoodFeature) ? feature : null;

  try {
    if (!turf.booleanIntersects(feature, nhoodFeature)) return null;
    if (feature.geometry.type.includes('Polygon')) {
      const clipped = turf.intersect(turf.featureCollection([feature, nhoodFeature]));
      if (clipped) {
        clipped.properties = feature.properties || {};
        return clipped;
      }
    }
  } catch (_) {
    try {
      const clipped = turf.intersect(feature, nhoodFeature);
      if (clipped) {
        clipped.properties = feature.properties || {};
        return clipped;
      }
    } catch (__) {}
  }
  return featureTouchesNeighborhood(feature, nhoodFeature) ? feature : null;
}

function constrainGeoJsonToNeighborhood(data, polygon, bufferMeters) {
  const nhoodFeature = neighborhoodFeature(polygon, bufferMeters);
  if (!nhoodFeature || !data || !Array.isArray(data.features)) return data;
  data.features = data.features
    .map(feature => clipFeatureToNeighborhood(feature, nhoodFeature))
    .filter(Boolean);
  return data;
}

function polygonOuterRings(polygon) {
  if (!polygon) return [];
  if (polygon.type === 'Polygon') return [polygon.coordinates[0]];
  if (polygon.type === 'MultiPolygon') return polygon.coordinates.map(poly => poly[0]);
  return [];
}

function ringArea(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    sum += (ring[i][0] * ring[i + 1][1]) - (ring[i + 1][0] * ring[i][1]);
  }
  return Math.abs(sum / 2);
}

function primaryPolygonRing(polygon) {
  return polygonOuterRings(polygon).sort((a, b) => ringArea(b) - ringArea(a))[0] || [];
}

function applyPaneClipPath(pane, polygon) {
  const ring = primaryPolygonRing(polygon);
  if (!pane || ring.length === 0) return;
  const points = ring.map(coord => {
    const point = map.latLngToLayerPoint([coord[1], coord[0]]);
    return `${point.x}px ${point.y}px`;
  });
  pane.style.clipPath = `polygon(${points.join(',')})`;
}

function createBoundedOverlayLayer(cfg, polygon) {
  const source = OVERLAY_SOURCES[cfg.overlayId];
  if (!source) return null;
  const paneName = `uf-pane-${cfg.id}`;
  let pane = map.getPane(paneName);
  if (!pane) {
    pane = map.createPane(paneName);
    pane.style.zIndex = 410;
    pane.style.pointerEvents = 'none';
  }
  const options = {
    pane: paneName,
    tms: source.tms || false,
    opacity: source.opacity,
    attribution: source.attribution || ''
  };
  const bounds = getPolygonBounds(polygon);
  if (bounds) options.bounds = bounds;

  const updateClip = () => applyPaneClipPath(pane, polygon);
  map.on('move zoom zoomend moveend resize', updateClip);
  requestAnimationFrame(updateClip);
  clippedOverlayCleanups[cfg.id] = () => {
    map.off('move zoom zoomend moveend resize', updateClip);
    pane.style.clipPath = '';
  };

  return L.tileLayer(source.url, options);
}

function fetchAndAddNeighborhoodLayer(cfg, polygon) {
  if (cfg.kind === 'overlay') {
    if (!neighborhoodSpecificLayers[cfg.id]) {
      neighborhoodSpecificLayers[cfg.id] = createBoundedOverlayLayer(cfg, polygon);
    }
    if (neighborhoodSpecificLayers[cfg.id]) neighborhoodSpecificLayers[cfg.id].addTo(map);
    return;
  }

  const fetchUrl = buildSocrataUrl(cfg, polygon);
  fetch(fetchUrl)
    .then(res => {
      if (!res.ok) throw new Error(`Layer fetch failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      normalizePointGeometry(data, cfg);
      constrainGeoJsonToNeighborhood(data, polygon, cfg.bufferMeters);
      if (!neighborhoodSpecificLayers[cfg.id]) {
        neighborhoodSpecificLayers[cfg.id] = L.geoJSON(data, {
          style: cfg.style,
          pointToLayer: (feature, latlng) => L.circleMarker(latlng, cfg.circleOptions)
        });
      }
      neighborhoodSpecificLayers[cfg.id].addTo(map);
    })
    .catch(err => console.error(`Neighborhood layer ${cfg.id}:`, err));
}

function removeNeighborhoodLayer(cfg) {
  if (cfg.kind === 'overlay') {
    const layer = neighborhoodSpecificLayers[cfg.id];
    if (layer) map.removeLayer(layer);
    if (clippedOverlayCleanups[cfg.id]) {
      clippedOverlayCleanups[cfg.id]();
      delete clippedOverlayCleanups[cfg.id];
    }
    return;
  }
  const layer = neighborhoodSpecificLayers[cfg.id];
  if (layer) map.removeLayer(layer);
}

function setLayerDescriptionVisible(layerId, visible) {
  const container = document.getElementById('uf-layer-descriptions');
  if (visible) {
    if (container.querySelector(`.uf-map-layer-desc-block[data-layer="${layerId}"]`)) return;
    const desc = getLayerDescription(layerId);
    if (!desc) return;
    const block = document.createElement('div');
    block.className = 'uf-map-layer-desc-block';
    block.dataset.layer = layerId;
    block.innerHTML = `<p class="uf-map-ldb-body"><span class="uf-map-ldb-title">${desc.title}:</span> ${desc.body}</p><p class="uf-map-ldb-source">Source: ${desc.source}</p>`;
    container.appendChild(block);
    container.removeAttribute('hidden');
  } else {
    const block = container.querySelector(`.uf-map-layer-desc-block[data-layer="${layerId}"]`);
    if (block) block.remove();
    if (container.children.length === 0) container.setAttribute('hidden', '');
  }
}

function showNeighborhoodLayers(neighborhoodId) {
  const layers = NEIGHBORHOOD_LAYERS[neighborhoodId];
  const panel = document.getElementById('uf-nhood-layers-control');
  if (!layers || layers.length === 0) { panel.setAttribute('hidden', ''); return; }

  const polygon = neighborhoodGeometries[neighborhoodId] || null;
  panel.innerHTML = `<div class="uf-map-control-title">${NEIGHBORHOODS.find(n => n.id === neighborhoodId)?.name} Data</div>` +
    layers.map(l => `
      <label class="uf-map-layer-toggle">
        <input type="checkbox" data-layer="${l.id}" data-nhood-layer="true">
        <span class="uf-map-layer-dot" style="background: ${l.color};"></span>
        <span>${l.label}</span>
      </label>
    `).join('');

  panel.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      const cfg = layers.find(l => l.id === cb.dataset.layer);
      if (!cfg) return;
      if (cb.checked) fetchAndAddNeighborhoodLayer(cfg, polygon);
      else removeNeighborhoodLayer(cfg);
      setLayerDescriptionVisible(cb.dataset.layer, cb.checked);
    });
  });
  panel.removeAttribute('hidden');
}

function hideNeighborhoodLayers(neighborhoodId) {
  const layers = NEIGHBORHOOD_LAYERS[neighborhoodId] || [];
  layers.forEach(cfg => {
    removeNeighborhoodLayer(cfg);
    setLayerDescriptionVisible(cfg.id, false);
  });
  const panel = document.getElementById('uf-nhood-layers-control');
  panel.innerHTML = '';
  panel.setAttribute('hidden', '');
}

// ---- Neighborhood panel ----
function showNeighborhoodPanel(neighborhoodId) {
  const nhood = NEIGHBORHOODS.find(n => n.id === neighborhoodId);
  if (!nhood) return;

  if (activeNeighborhood) {
    hideNeighborhoodLayers(activeNeighborhood);
    const prevLabel = neighborhoodLabelMarkers[activeNeighborhood];
    if (prevLabel && neighborhoodLabelGroup) neighborhoodLabelGroup.addLayer(prevLabel);
  }
  activeNeighborhood = neighborhoodId;

  // Leaflet flyTo uses [lat, lng]
  const [lng, lat] = nhood.coordinates;
  map.flyTo([lat, lng], 13, { duration: 1 });

  document.getElementById('uf-city-overview').setAttribute('hidden', '');
  document.getElementById('uf-info-name').textContent = nhood.name;
  document.getElementById('uf-info-borough').textContent = nhood.borough;
  document.getElementById('uf-info-desc').textContent = nhood.description;

  const partnersEl = document.getElementById('uf-info-partners');
  if (nhood.partners && nhood.partners.length) {
    const items = nhood.partners
      .map(p => `<li><a href="${p.url}" target="_blank" rel="noopener" style="color: var(--text);">${p.name}</a></li>`)
      .join('');
    partnersEl.innerHTML = `The ${nhood.name} neighborhood partners included:<ul style="margin: 8px 0 0; padding-left: 20px;">${items}</ul>`;
  } else {
    partnersEl.innerHTML = '';
  }

  document.getElementById('uf-nhood-info').removeAttribute('hidden');
  document.getElementById('uf-map-back-row').removeAttribute('hidden');
  document.getElementById('uf-map-neighborhood-hint').setAttribute('hidden', '');

  const activeLabel = neighborhoodLabelMarkers[neighborhoodId];
  if (activeLabel && neighborhoodLabelGroup) neighborhoodLabelGroup.removeLayer(activeLabel);

  showNeighborhoodLayers(neighborhoodId);

  const projects = PROJECTS.filter(p => p.neighborhoodId === neighborhoodId);
  const inner = document.getElementById('uf-nhood-projects-inner');
  inner.style.gridTemplateColumns = `repeat(${Math.min(projects.length, 3)}, 1fr)`;
  inner.innerHTML = projects.map(p => {
    const hasLayer = !!PROJECT_LAYER_MAP[p.id];
    const projectTitle = p.title || p.team;
    return `
      <div class="uf-map-project-card${p.isWinner ? ' uf-map-project-card--winner' : ''}${hasLayer ? ' uf-map-project-card--linked' : ''}"
           id="uf-nhood-card-${p.id}"
           ${hasLayer ? `onclick="onProjectCardClick('${p.id}')"` : ''}>
        <p class="uf-map-project-title">${projectTitle}</p>
        <p class="uf-map-project-team">${p.team}</p>
        <p class="uf-map-project-desc">${p.description}</p>
      </div>
    `;
  }).join('');
  document.getElementById('uf-nhood-projects').removeAttribute('hidden');
}

function onProjectCardClick(projectId) {
  const mapping = PROJECT_LAYER_MAP[projectId];
  if (!mapping) return;
  const layerIds = Array.isArray(mapping) ? mapping : [mapping];

  const card = document.getElementById(`uf-nhood-card-${projectId}`);
  const isActive = card.classList.contains('uf-map-project-card--active');

  if (activeProjectId && activeProjectId !== projectId) {
    const prevMapping = PROJECT_LAYER_MAP[activeProjectId];
    const prevIds = Array.isArray(prevMapping) ? prevMapping : [prevMapping];
    prevIds.forEach(lid => {
      const t = document.querySelector(`input[data-layer="${lid}"]`);
      if (t && t.checked) { t.checked = false; t.dispatchEvent(new Event('change')); }
    });
    const prevCard = document.getElementById(`uf-nhood-card-${activeProjectId}`);
    if (prevCard) prevCard.classList.remove('uf-map-project-card--active');
  }

  if (isActive) {
    layerIds.forEach(lid => {
      const t = document.querySelector(`input[data-layer="${lid}"]`);
      if (t && t.checked) { t.checked = false; t.dispatchEvent(new Event('change')); }
    });
    card.classList.remove('uf-map-project-card--active');
    activeProjectId = null;
  } else {
    layerIds.forEach(lid => {
      const t = document.querySelector(`input[data-layer="${lid}"]`);
      if (t && !t.checked) { t.checked = true; t.dispatchEvent(new Event('change')); }
    });
    card.classList.add('uf-map-project-card--active');
    activeProjectId = projectId;
  }
}

function closeNeighborhoodPanel() {
  if (activeNeighborhood) {
    hideNeighborhoodLayers(activeNeighborhood);
    const prevLabel = neighborhoodLabelMarkers[activeNeighborhood];
    if (prevLabel && neighborhoodLabelGroup) neighborhoodLabelGroup.addLayer(prevLabel);
  }
  activeNeighborhood = null;
  activeProjectId = null;

  const [lng, lat] = SITE_CONFIG.mapCenter;
  map.flyTo([lat, lng], Math.round(SITE_CONFIG.mapZoom), { duration: 0.8 });

  document.getElementById('uf-nhood-info').setAttribute('hidden', '');
  document.getElementById('uf-city-overview').removeAttribute('hidden');
  document.getElementById('uf-map-back-row').setAttribute('hidden', '');
  document.getElementById('uf-map-neighborhood-hint').removeAttribute('hidden');
  document.getElementById('uf-nhood-projects').setAttribute('hidden', '');
  const inner = document.getElementById('uf-nhood-projects-inner');
  inner.style.gridTemplateColumns = '';
  inner.innerHTML = '';
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', initMap);
