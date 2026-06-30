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
    url: `${LEAP_SOURCE_RAW}/data/cloudburst_moderate_current.geojson`,
    color: '#5B8DD9', opacity: 0.55
  },
  heat: {
    kind: 'raster',
    url: `${LEAP_SOURCE_RAW}/data/tiles/heat/{z}/{x}/{y}.png`,
    tms: true, opacity: 0.75,
    attribution: 'Mean Surface Temp 2020-22 – NYC City Council'
  },
  pfirm: {
    kind: 'raster',
    url: `${DCP_TILES}/2015PFIRMS/MapServer/tile/{z}/{y}/{x}`,
    opacity: 0.75,
    attribution: '2015 PFIRM Flood Zones – FEMA / NYC DCP'
  },
  surge2050: {
    kind: 'raster',
    url: `${DCP_TILES}/Future_Floodplain_2050s/MapServer/tile/{z}/{y}/{x}`,
    opacity: 0.65,
    attribution: 'Future Floodplain 2050s – NYC DCP'
  },
  surge2080: {
    kind: 'raster',
    url: `${DCP_TILES}/Future_Floodplain_2080s/MapServer/tile/{z}/{y}/{x}`,
    opacity: 0.65,
    attribution: 'Future Floodplain 2080s – NYC DCP'
  }
};

const LAYER_DESCRIPTIONS = {
  cloudburst: {
    title: 'Cloudburst Flooding',
    body: 'This layer maps areas at risk of stormwater flooding during moderate cloudburst events, based on NYC stormwater flood modeling. Blue zones indicate predicted inundation under moderate storm conditions across the five boroughs.',
    source: 'NYC Open Data – NYC Stormwater Flood Maps'
  },
  heat: {
    title: 'Urban Heat',
    body: 'Mean surface temperature data from 2020–2022. Warmer tones highlight neighborhoods with the greatest heat burden – typically areas with dense pavement, limited tree canopy, and lower access to cooling resources.',
    source: 'NYC City Council – Mean Surface Temperature 2020–2022'
  },
  pfirm: {
    title: 'PFIRM 2015 Flood Zones',
    body: 'FEMA\'s Preliminary Flood Insurance Rate Maps show regulatory flood risk zones across New York City, distinguishing between 1% annual chance (100-year) and 0.2% annual chance (500-year) floodplains based on current conditions.',
    source: 'FEMA / NYC DCP – 2015 Preliminary Flood Insurance Rate Maps'
  },
  surge2050: {
    title: 'Coastal Surge 2050s',
    body: 'Projected 100-year floodplain under 2050s sea level rise scenarios. This layer reflects moderate acceleration in coastal flood risk driven by rising seas and intensifying storm surge over the coming decades.',
    source: 'NYC Department of City Planning – Future Floodplain 2050s'
  },
  surge2080: {
    title: 'Coastal Surge 2080s',
    body: 'Projected 100-year floodplain under 2080s sea level rise scenarios – the most severe long-term outlook modeled by NYC DCP. Communities shown here face significant displacement and infrastructure risk by end of century without major adaptation.',
    source: 'NYC Department of City Planning – Future Floodplain 2080s'
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
  }
};

const NEIGHBORHOOD_LAYERS = {
  flushing: [
    {
      id: 'flushing-cloudburst',
      label: 'Cloudburst Flooding',
      color: '#5B8DD9',
      kind: 'filtered-overlay',
      style: { color: '#5B8DD9', weight: 1, opacity: 0.8, fillColor: '#5B8DD9', fillOpacity: 0.55 }
    },
    {
      id: 'flushing-rain-gardens',
      label: 'Rain Gardens',
      color: '#22c55e',
      kind: 'point',
      fetchUrl: "https://data.cityofnewyork.us/resource/df32-vzax.geojson?$where=within_box(the_geom%2C40.78%2C-73.84%2C40.74%2C-73.78)%20AND%20(asset_type%3D'Rain%20Garden'%20OR%20asset_type%3D'ROWRG')&$limit=200",
      circleOptions: { radius: 5, fillColor: '#22c55e', color: '#16a34a', weight: 1.5, opacity: 1, fillOpacity: 0.9 }
    },
    {
      id: 'flushing-cso',
      label: 'Combined Sewer Overflow',
      color: '#6366f1',
      kind: 'point',
      fetchUrl: "https://data.cityofnewyork.us/resource/df32-vzax.geojson?$where=within_box(the_geom%2C40.78%2C-73.84%2C40.74%2C-73.78)%20AND%20sewer_type%3D'Combined'&$limit=2000",
      circleOptions: { radius: 4, fillColor: '#6366f1', color: '#4338ca', weight: 1, opacity: 1, fillOpacity: 0.7 }
    }
  ]
};

const PROJECT_LAYER_MAP = {
  'gorillas': 'flushing-cloudburst',
  'hadrosaur-footprints': 'flushing-rain-gardens',
  'king-penguins': ['flushing-rain-gardens', 'flushing-cso']
};

const NEIGHBORHOOD_COLORS = {
  'east-harlem': '#C8373A',
  'soundview': '#1B5E8A',
  'flushing': '#1D6B45',
  'brownsville': '#6B2D8B',
  'stapleton': '#C4611A'
};

// ---- Map state ----
let map;
let activeNeighborhood = null;
let neighborhoodGeometries = {};
let activeProjectId = null;

let neighborhoodLayer = null;
let neighborhoodLabelGroup = null;
let overlayLayers = {};
let cloudburst_data = null;
let neighborhoodSpecificLayers = {};

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
    maxZoom: 16
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.control.scale({ imperial: true, metric: false, position: 'bottomleft' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }).addTo(map);

  // Pre-fetch cloudburst GeoJSON (shared between global overlay and Flushing filter)
  fetch(OVERLAY_SOURCES.cloudburst.url)
    .then(r => r.json())
    .then(data => {
      cloudburst_data = data;
      overlayLayers['cloudburst'] = L.geoJSON(data, {
        style: {
          color: OVERLAY_SOURCES.cloudburst.color,
          weight: 1, opacity: 0.8,
          fillColor: OVERLAY_SOURCES.cloudburst.color,
          fillOpacity: OVERLAY_SOURCES.cloudburst.opacity
        }
      });
    });

  ['heat', 'pfirm', 'surge2050', 'surge2080'].forEach(key => {
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

      // Labels via divIcon — centered with CSS transform
      neighborhoodLabelGroup = L.layerGroup();
      gj.features.forEach(f => {
        const center = L.geoJSON(f).getBounds().getCenter();
        L.marker(center, {
          icon: L.divIcon({ className: 'uf-map-nhood-label', html: f.properties.name }),
          interactive: false
        }).addTo(neighborhoodLabelGroup);
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

// ---- Flushing-only neighborhood layers ----
function fetchAndAddNeighborhoodLayer(cfg, polygon) {
  if (cfg.kind === 'filtered-overlay') {
    addFlushingCloudburst(polygon, cfg.style);
    return;
  }

  fetch(cfg.fetchUrl)
    .then(res => {
      if (!res.ok) throw new Error(`Layer fetch failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!neighborhoodSpecificLayers[cfg.id]) {
        neighborhoodSpecificLayers[cfg.id] = L.geoJSON(data, {
          pointToLayer: (feature, latlng) => L.circleMarker(latlng, cfg.circleOptions)
        });
      }
      neighborhoodSpecificLayers[cfg.id].addTo(map);
    })
    .catch(err => console.error(`Neighborhood layer ${cfg.id}:`, err));
}

function addFlushingCloudburst(polygon, style) {
  if (!cloudburst_data) {
    // Not loaded yet — wait for it
    setTimeout(() => addFlushingCloudburst(polygon, style), 400);
    return;
  }
  if (neighborhoodSpecificLayers['flushing-cloudburst']) {
    neighborhoodSpecificLayers['flushing-cloudburst'].addTo(map);
    return;
  }
  const bounds = L.geoJSON(polygon).getBounds();
  const filtered = {
    type: 'FeatureCollection',
    features: cloudburst_data.features.filter(f => {
      try { return bounds.intersects(L.geoJSON(f).getBounds()); }
      catch (_) { return false; }
    })
  };
  neighborhoodSpecificLayers['flushing-cloudburst'] = L.geoJSON(filtered, { style }).addTo(map);
}

function removeNeighborhoodLayer(cfg) {
  const layer = neighborhoodSpecificLayers[cfg.id];
  if (layer) map.removeLayer(layer);
}

function setLayerDescriptionVisible(layerId, visible) {
  const container = document.getElementById('uf-layer-descriptions');
  if (visible) {
    if (container.querySelector(`.uf-map-layer-desc-block[data-layer="${layerId}"]`)) return;
    const desc = LAYER_DESCRIPTIONS[layerId];
    if (!desc) return;
    const block = document.createElement('div');
    block.className = 'uf-map-layer-desc-block';
    block.dataset.layer = layerId;
    block.innerHTML = `<p class="uf-map-ldb-title">${desc.title}</p><p class="uf-map-ldb-body">${desc.body}</p><p class="uf-map-ldb-source">Source: ${desc.source}</p>`;
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

  if (activeNeighborhood) hideNeighborhoodLayers(activeNeighborhood);
  activeNeighborhood = neighborhoodId;

  // Leaflet flyTo uses [lat, lng]
  const [lng, lat] = nhood.coordinates;
  map.flyTo([lat, lng], 13, { duration: 1 });

  document.getElementById('uf-nhood-name').textContent = nhood.name;
  document.getElementById('uf-nhood-borough').textContent = nhood.borough;
  document.getElementById('uf-nhood-desc').textContent = nhood.description;
  document.getElementById('uf-nhood-state').removeAttribute('hidden');

  showNeighborhoodLayers(neighborhoodId);

  const projects = PROJECTS.filter(p => p.neighborhoodId === neighborhoodId);
  const inner = document.getElementById('uf-nhood-projects-inner');
  inner.style.gridTemplateColumns = `repeat(${Math.min(projects.length, 3)}, 1fr)`;
  inner.innerHTML = projects.map(p => {
    const hasLayer = !!PROJECT_LAYER_MAP[p.id];
    return `
      <div class="uf-map-project-card${p.isWinner ? ' uf-map-project-card--winner' : ''}${hasLayer ? ' uf-map-project-card--linked' : ''}"
           id="uf-nhood-card-${p.id}"
           ${hasLayer ? `onclick="onProjectCardClick('${p.id}')"` : ''}>
        ${p.isWinner ? `<span class="uf-map-winner-tag">${p.isWinnerCategory}</span>` : ''}
        <p class="uf-map-project-team">${p.team}</p>
        ${p.title ? `<p class="uf-map-project-title">${p.title}</p>` : ''}
        <p class="uf-map-project-desc">${p.description}</p>
        ${p.demoAvailable ? `<span class="uf-map-demo-tag">Demo available</span>` : ''}
        ${hasLayer ? `<span class="uf-map-layer-hint">Click to explore layer &#8594;</span>` : ''}
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
  if (activeNeighborhood) hideNeighborhoodLayers(activeNeighborhood);
  activeNeighborhood = null;
  activeProjectId = null;

  const [lng, lat] = SITE_CONFIG.mapCenter;
  map.flyTo([lat, lng], Math.round(SITE_CONFIG.mapZoom), { duration: 0.8 });

  document.getElementById('uf-nhood-state').setAttribute('hidden', '');
  document.getElementById('uf-nhood-projects').setAttribute('hidden', '');
  const inner = document.getElementById('uf-nhood-projects-inner');
  inner.style.gridTemplateColumns = '';
  inner.innerHTML = '';
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', initMap);
