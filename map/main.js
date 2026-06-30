/* ============================================================
   Urban Futures - Interactive Map
   Ported from leap-hackathon-website (js/main.js), trimmed to the
   map widget only (the source site's standalone header/winners/
   project-index/resources sections aren't needed here - this page
   already covers that content elsewhere).

   Climate layer data is NOT duplicated into this repo - it's fetched
   from the leap-hackathon-website source repo (raw.githubusercontent.com)
   or from the same live ArcGIS / Socrata endpoints the source map uses.
   ============================================================ */

const LEAP_SOURCE_RAW = 'https://raw.githubusercontent.com/leap-stc/leap-hackathon-website/main';

// ArcGIS tile base for DCP flood layers (GfwWNkhOj9bNBqoJ org)
const DCP_TILES = 'https://tiles.arcgis.com/tiles/GfwWNkhOj9bNBqoJ/arcgis/rest/services';

// ---- Source configs for each data overlay ----
const OVERLAY_SOURCES = {
  cloudburst: {
    kind: 'geojson',
    url: `${LEAP_SOURCE_RAW}/data/cloudburst_moderate_current.geojson`,
    color: '#5B8DD9',
    opacity: 0.55
  },
  heat: {
    kind: 'raster',
    tiles: [`${LEAP_SOURCE_RAW}/data/tiles/heat/{z}/{x}/{y}.png`],
    tileSize: 256, minzoom: 9, maxzoom: 14, opacity: 0.75, scheme: 'tms',
    attribution: 'Mean Surface Temp 2020-22 - NYC City Council'
  },
  pfirm: {
    kind: 'raster',
    tiles: [`${DCP_TILES}/2015PFIRMS/MapServer/tile/{z}/{y}/{x}`],
    tileSize: 256, opacity: 0.75,
    attribution: '2015 PFIRM Flood Zones - FEMA / NYC DCP'
  },
  surge2050: {
    kind: 'raster',
    tiles: [`${DCP_TILES}/Future_Floodplain_2050s/MapServer/tile/{z}/{y}/{x}`],
    tileSize: 256, opacity: 0.65,
    attribution: 'Future Floodplain 2050s - NYC DCP'
  },
  surge2080: {
    kind: 'raster',
    tiles: [`${DCP_TILES}/Future_Floodplain_2080s/MapServer/tile/{z}/{y}/{x}`],
    tileSize: 256, opacity: 0.65,
    attribution: 'Future Floodplain 2080s - NYC DCP'
  }
};

const LAYER_DESCRIPTIONS = {
  cloudburst: {
    title: 'Cloudburst Flooding',
    body: 'This layer maps areas at risk of stormwater flooding during moderate cloudburst events, based on NYC stormwater flood modeling. Blue zones indicate predicted inundation under moderate storm conditions across the five boroughs.',
    source: 'NYC Open Data - NYC Stormwater Flood Maps'
  },
  heat: {
    title: 'Urban Heat',
    body: 'Mean surface temperature data from 2020-2022. Warmer tones highlight neighborhoods with the greatest heat burden - typically areas with dense pavement, limited tree canopy, and lower access to cooling resources.',
    source: 'NYC City Council - Mean Surface Temperature 2020-2022'
  },
  pfirm: {
    title: 'PFIRM 2015 Flood Zones',
    body: 'FEMA\'s Preliminary Flood Insurance Rate Maps show regulatory flood risk zones across New York City, distinguishing between 1% annual chance (100-year) and 0.2% annual chance (500-year) floodplains based on current conditions.',
    source: 'FEMA / NYC DCP - 2015 Preliminary Flood Insurance Rate Maps'
  },
  surge2050: {
    title: 'Coastal Surge 2050s',
    body: 'Projected 100-year floodplain under 2050s sea level rise scenarios. This layer reflects moderate acceleration in coastal flood risk driven by rising seas and intensifying storm surge over the coming decades.',
    source: 'NYC Department of City Planning - Future Floodplain 2050s'
  },
  surge2080: {
    title: 'Coastal Surge 2080s',
    body: 'Projected 100-year floodplain under 2080s sea level rise scenarios - the most severe long-term outlook modeled by NYC DCP. Communities shown here face significant displacement and infrastructure risk by end of century without major adaptation.',
    source: 'NYC Department of City Planning - Future Floodplain 2080s'
  },
  'flushing-rain-gardens': {
    title: 'Rain Gardens',
    body: 'Green infrastructure assets constructed by NYC DEP to capture and filter stormwater runoff before it enters the combined sewer system. Each installation reduces the volume of untreated sewage discharged into Flushing Bay during storm events.',
    source: 'NYC DEP - Green Infrastructure Map'
  },
  'flushing-cso': {
    title: 'Combined Sewer Overflow',
    body: 'In combined sewer areas, a single pipe carries both stormwater and sewage. During heavy rain events, the system overflows directly into waterways. This layer shows DEP green infrastructure assets specifically built in combined sewer drainage areas to reduce overflow frequency and volume.',
    source: 'NYC DEP - Green Infrastructure Map'
  },
  'flushing-cloudburst': {
    title: 'Cloudburst Flooding - Flushing',
    body: 'This layer maps areas at risk of stormwater flooding during moderate cloudburst events across the Flushing / Queens area. Blue zones indicate predicted inundation under moderate storm conditions, based on NYC stormwater flood modeling.',
    source: 'NYC Open Data - NYC Stormwater Flood Maps'
  }
};

const NEIGHBORHOOD_LAYERS = {
  flushing: [
    {
      id: 'flushing-cloudburst',
      label: 'Cloudburst Flooding',
      color: '#5B8DD9',
      kind: 'filtered-overlay',
      sourceId: 'overlay-cloudburst',
      layerId: 'lyr-flushing-cloudburst',
      lineLayerId: 'lyr-flushing-cloudburst-line',
      fillPaint: { 'fill-color': '#5B8DD9', 'fill-opacity': 0.55 },
      linePaint: { 'line-color': '#5B8DD9', 'line-width': 1, 'line-opacity': 0.8 }
    },
    {
      id: 'flushing-rain-gardens',
      label: 'Rain Gardens',
      color: '#22c55e',
      sourceId: 'src-flushing-rain-gardens',
      layerId: 'lyr-flushing-rain-gardens',
      // Bounding box must stay scoped to Flushing - a borough-level query
      // against this Socrata endpoint causes socket errors.
      fetchUrl: "https://data.cityofnewyork.us/resource/df32-vzax.geojson?$where=within_box(the_geom%2C40.78%2C-73.84%2C40.74%2C-73.78)%20AND%20(asset_type%3D'Rain%20Garden'%20OR%20asset_type%3D'ROWRG')&$limit=200",
      paint: {
        'circle-color': '#22c55e',
        'circle-radius': 5,
        'circle-opacity': 0.9,
        'circle-stroke-color': '#16a34a',
        'circle-stroke-width': 1.5
      }
    },
    {
      id: 'flushing-cso',
      label: 'Combined Sewer Overflow',
      color: '#6366f1',
      sourceId: 'src-flushing-cso',
      layerId: 'lyr-flushing-cso',
      fetchUrl: "https://data.cityofnewyork.us/resource/df32-vzax.geojson?$where=within_box(the_geom%2C40.78%2C-73.84%2C40.74%2C-73.78)%20AND%20sewer_type%3D'Combined'&$limit=2000",
      paint: {
        'circle-color': '#6366f1',
        'circle-radius': 4,
        'circle-opacity': 0.7,
        'circle-stroke-color': '#4338ca',
        'circle-stroke-width': 1
      }
    }
  ]
};

const PROJECT_LAYER_MAP = {
  'gorillas': 'flushing-cloudburst',
  'hadrosaur-footprints': 'flushing-rain-gardens',
  'king-penguins': ['flushing-rain-gardens', 'flushing-cso']
};

// ---- Map state ----
let map;
let activeNeighborhood = null;
let neighborhoodGeometries = {};
let activeProjectId = null;

function initMap() {
  mapboxgl.accessToken = SITE_CONFIG.mapboxToken;

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: SITE_CONFIG.mapCenter,
    zoom: SITE_CONFIG.mapZoom,
    minZoom: 9,
    maxZoom: 16
  });

  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
  map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'imperial' }), 'bottom-left');

  fetch(`${LEAP_SOURCE_RAW}/data/neighborhoods.geojson`)
    .then(r => r.json())
    .then(gj => {
      gj.features.forEach(f => {
        neighborhoodGeometries[f.properties.id] = f.geometry;
      });
    });

  map.on('load', () => {
    addNeighborhoodLayer();
    addOverlayLayers();
    setupLayerToggles();
  });
}

function addNeighborhoodLayer() {
  map.addSource('neighborhoods', {
    type: 'geojson',
    data: `${LEAP_SOURCE_RAW}/data/neighborhoods.geojson`
  });

  const colorMatch = [
    'match', ['get', 'id'],
    'east-harlem', '#C8373A',
    'soundview', '#1B5E8A',
    'flushing', '#1D6B45',
    'brownsville', '#6B2D8B',
    'stapleton', '#C4611A',
    '#888888'
  ];

  map.addLayer({
    id: 'neighborhoods-fill',
    type: 'fill',
    source: 'neighborhoods',
    paint: { 'fill-color': colorMatch, 'fill-opacity': 0.15 }
  });

  map.addLayer({
    id: 'neighborhoods-fill-hover',
    type: 'fill',
    source: 'neighborhoods',
    paint: {
      'fill-color': colorMatch,
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.35, 0]
    }
  });

  map.addLayer({
    id: 'neighborhoods-line',
    type: 'line',
    source: 'neighborhoods',
    paint: { 'line-color': colorMatch, 'line-width': 1.5, 'line-opacity': 0.9 }
  });

  map.addLayer({
    id: 'neighborhoods-label',
    type: 'symbol',
    source: 'neighborhoods',
    layout: {
      'text-field': ['get', 'name'],
      'text-size': 11,
      'text-anchor': 'center'
    },
    paint: {
      'text-color': '#0F1117',
      'text-halo-color': 'rgba(245,242,236,0.85)',
      'text-halo-width': 2
    }
  });

  let hoveredId = null;
  map.on('mousemove', 'neighborhoods-fill', (e) => {
    if (e.features.length > 0) {
      if (hoveredId !== null) {
        map.setFeatureState({ source: 'neighborhoods', id: hoveredId }, { hover: false });
      }
      hoveredId = e.features[0].id;
      map.setFeatureState({ source: 'neighborhoods', id: hoveredId }, { hover: true });
      map.getCanvas().style.cursor = 'pointer';
    }
  });

  map.on('mouseleave', 'neighborhoods-fill', () => {
    if (hoveredId !== null) {
      map.setFeatureState({ source: 'neighborhoods', id: hoveredId }, { hover: false });
    }
    hoveredId = null;
    map.getCanvas().style.cursor = '';
  });

  map.on('click', 'neighborhoods-fill', (e) => {
    if (e.features.length > 0) {
      showNeighborhoodPanel(e.features[0].properties.id);
    }
  });
}

function addOverlayLayers() {
  Object.entries(OVERLAY_SOURCES).forEach(([key, cfg]) => {
    if (cfg.kind === 'raster') {
      map.addSource(`overlay-${key}`, {
        type: 'raster',
        tiles: cfg.tiles,
        tileSize: cfg.tileSize,
        ...(cfg.minzoom != null && { minzoom: cfg.minzoom }),
        ...(cfg.maxzoom != null && { maxzoom: cfg.maxzoom }),
        ...(cfg.scheme && { scheme: cfg.scheme }),
        attribution: cfg.attribution || ''
      });
      map.addLayer({
        id: `overlay-${key}`,
        type: 'raster',
        source: `overlay-${key}`,
        paint: { 'raster-opacity': cfg.opacity },
        layout: { visibility: 'none' }
      }, 'neighborhoods-line');
    } else {
      map.addSource(`overlay-${key}`, { type: 'geojson', data: cfg.url });
      map.addLayer({
        id: `overlay-${key}`,
        type: 'fill',
        source: `overlay-${key}`,
        paint: { 'fill-color': cfg.color, 'fill-opacity': cfg.opacity },
        layout: { visibility: 'none' }
      }, 'neighborhoods-line');
      map.addLayer({
        id: `overlay-${key}-line`,
        type: 'line',
        source: `overlay-${key}`,
        paint: { 'line-color': cfg.color, 'line-width': 1, 'line-opacity': 0.8 },
        layout: { visibility: 'none' }
      }, 'neighborhoods-line');
    }
  });
}

function setupLayerToggles() {
  document.querySelectorAll('.uf-map-controls > .uf-map-control-panel .uf-map-layer-toggle input[type="checkbox"]').forEach(toggle => {
    toggle.addEventListener('change', () => {
      const layerId = toggle.dataset.layer;
      const visibility = toggle.checked ? 'visible' : 'none';

      if (layerId === 'neighborhoods') {
        ['neighborhoods-fill', 'neighborhoods-line', 'neighborhoods-label', 'neighborhoods-fill-hover']
          .forEach(id => map.setLayoutProperty(id, 'visibility', visibility));
        return;
      }

      if (map.getLayer(`overlay-${layerId}`)) {
        map.setLayoutProperty(`overlay-${layerId}`, 'visibility', visibility);
      }
      if (map.getLayer(`overlay-${layerId}-line`)) {
        map.setLayoutProperty(`overlay-${layerId}-line`, 'visibility', visibility);
      }

      setLayerDescriptionVisible(layerId, toggle.checked);
    });
  });
}

// ---- Flushing-only neighborhood layers ----
function fetchAndAddNeighborhoodLayer(cfg, polygon) {
  fetch(cfg.fetchUrl)
    .then(res => {
      if (!res.ok) throw new Error(`Layer fetch failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!map.getSource(cfg.sourceId)) {
        map.addSource(cfg.sourceId, { type: 'geojson', data });
      }
      if (!map.getLayer(cfg.layerId)) {
        const layerDef = { id: cfg.layerId, type: 'circle', source: cfg.sourceId, paint: cfg.paint };
        if (polygon) layerDef.filter = ['within', polygon];
        map.addLayer(layerDef);
      }
    })
    .catch(err => console.error(`Neighborhood layer ${cfg.id}:`, err));
}

function removeNeighborhoodLayer(cfg) {
  if (cfg.kind === 'filtered-overlay') {
    if (map.getLayer(cfg.lineLayerId)) map.removeLayer(cfg.lineLayerId);
    if (map.getLayer(cfg.layerId)) map.removeLayer(cfg.layerId);
    return;
  }
  if (map.getLayer(cfg.layerId)) map.removeLayer(cfg.layerId);
  if (map.getSource(cfg.sourceId)) map.removeSource(cfg.sourceId);
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
  if (!layers || layers.length === 0) {
    panel.setAttribute('hidden', '');
    return;
  }
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
      if (cfg.kind === 'filtered-overlay') {
        if (cb.checked) {
          if (!map.getLayer(cfg.layerId)) {
            const filter = polygon ? ['within', polygon] : undefined;
            map.addLayer({ id: cfg.layerId, type: 'fill', source: cfg.sourceId, paint: cfg.fillPaint, ...(filter && { filter }) });
            map.addLayer({ id: cfg.lineLayerId, type: 'line', source: cfg.sourceId, paint: cfg.linePaint, ...(filter && { filter }) });
          }
        } else {
          removeNeighborhoodLayer(cfg);
        }
      } else {
        if (cb.checked) fetchAndAddNeighborhoodLayer(cfg, polygon);
        else removeNeighborhoodLayer(cfg);
      }
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

// ---- Neighborhood panel (back button steps exactly one level: neighborhood -> whole map) ----
function showNeighborhoodPanel(neighborhoodId) {
  const nhood = NEIGHBORHOODS.find(n => n.id === neighborhoodId);
  if (!nhood) return;

  if (activeNeighborhood) hideNeighborhoodLayers(activeNeighborhood);
  activeNeighborhood = neighborhoodId;

  map.flyTo({ center: nhood.coordinates, zoom: 13, duration: 1000 });

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
  map.flyTo({ center: SITE_CONFIG.mapCenter, zoom: SITE_CONFIG.mapZoom, duration: 800 });

  document.getElementById('uf-nhood-state').setAttribute('hidden', '');
  document.getElementById('uf-nhood-projects').setAttribute('hidden', '');
  const inner = document.getElementById('uf-nhood-projects-inner');
  inner.style.gridTemplateColumns = '';
  inner.innerHTML = '';
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  if (typeof mapboxgl !== 'undefined') {
    initMap();
  } else {
    document.getElementById('map').innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--hinted);font-family:Inter,sans-serif;font-size:13px;color:var(--secondary);text-align:center;padding:32px;">
        Map requires a Mapbox token.<br>Add yours to data/config.js
      </div>`;
  }
});
