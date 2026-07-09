const NEIGHBORHOODS = [
  {
    id: "east-harlem",
    name: "East Harlem",
    borough: "Manhattan",
    description: "East Harlem faces compounding climate risks from extreme heat and flooding, exacerbated by limited green spaces and significant socioeconomic vulnerability. Teams here examined cooling accessibility, green infrastructure gaps, and sanitation's role in flood resilience.",
    coordinates: [-73.9380, 40.7957],
    color: "#64b9c4",
    projects: ["african-elephants", "alaskan-brown-bears", "blue-whales"],
    partners: [
      { name: "Manhattan Community Board 11", url: "https://www.cb11m.org/" },
      { name: "Randall's Island Park Alliance", url: "https://randallsisland.org/" },
      { name: "Uptown Grand Central", url: "https://uptowngrandcentral.org/" },
      { name: "East Harlem Community Organizations Active in Disaster (COAD)", url: "https://www.eastharlemcoad.org/" }
    ]
  },
  {
    id: "soundview",
    name: "Soundview",
    borough: "Bronx",
    description: "Soundview contends with stormwater flooding and gaps in green infrastructure that leave residents vulnerable during cloudbursts. Teams modeled pluvial floods and assessed heat vulnerability among aging residents, identifying sites for targeted intervention.",
    coordinates: [-73.8730, 40.8170],
    color: "#64b9c4",
    projects: ["giant-canoes", "giant-sequoias", "giant-squids"],
    partners: [
      { name: "Youth Ministries for Peace and Justice", url: "https://www.ympj.org/" }
    ]
  },
  {
    id: "flushing",
    name: "Flushing",
    borough: "Queens",
    description: "Flushing Bay and the surrounding Queens neighborhoods face intense stormwater flooding from cloudbursts and limited sewer capacity. Teams developed AI-powered visualization tools, rain garden models, and stormwater capture frameworks to address compounding flood risk.",
    coordinates: [-73.8330, 40.7675],
    color: "#64b9c4",
    projects: ["gorillas", "hadrosaur-footprints", "king-penguins"],
    partners: [
      { name: "Guardians of Flushing Bay", url: "https://www.guardiansofflushingbay.org/" },
      { name: "Thread Collective", url: "https://threadcollective.com/" }
    ]
  },
  {
    id: "brownsville",
    name: "Brownsville",
    borough: "Brooklyn",
    description: "Brownsville sits at the intersection of extreme heat vulnerability and limited access to cooling resources. Teams developed spatial optimization tools for cooling site placement and a climate-aware emergency routing system to improve resilience for this historically underserved community.",
    coordinates: [-73.9124, 40.6635],
    color: "#64b9c4",
    projects: ["komodo-dragons", "megalodons", "moai-statues"],
    partners: [
      { name: "Pitkin Avenue Business Improvement District", url: "https://www.pitkinavenue.nyc/" },
      { name: "Brooklyn Community Board 16", url: "https://brooklyncb6.cityofnewyork.us/" },
      { name: "Central Brooklyn EDC", url: "https://cbedc.org/" }
    ]
  },
  {
    id: "stapleton",
    name: "Stapleton",
    borough: "Staten Island",
    description: "Stapleton on Staten Island's North Shore faces persistent flooding driven by topography, aging infrastructure, and rising seas. Teams developed tree-planting simulation tools, improved flood modeling, and community-facing alert systems to build long-term resilience.",
    coordinates: [-74.0776, 40.6280],
    color: "#64b9c4",
    projects: ["sperm-whales", "stars-of-india", "titanosaurs"],
    partners: [
      { name: "Staten Island Urban Center", url: "https://www.siurbancenter.org/" },
      { name: "Protectors of Pine Oaks Woods", url: "https://www.siprotectors.org/" }
    ]
  }
];

const PROJECTS = [
  // East Harlem
  {
    id: "african-elephants",
    neighborhoodId: "east-harlem",
    title: "Risk to Response: Rethinking Heat Resilience in East Harlem",
    team: "African Elephants",
    members: "Claire Helms, Eve Lu, Nami Jain, Glen Chua, Tamara Jeffries",
    description: "Developed a cooling accessibility score integrating multiple datasets to identify areas with poor access to cooling centers. Proposed using local assets like schools and businesses as supplemental cooling sites, alongside an asset-based communication program involving high schoolers and community organizations to improve heat preparedness year-round.",
    isWinner: false,
    tags: ["heat", "cooling-access", "equity", "community"],
    demoAvailable: false,
    datasets: ["CorrDiff downscaled dataset", "NYC We Cool", "MTA GTFS transit data", "OpenStreetMap", "2020 U.S. Census", "NYC Subway Routes"]
  },
  {
    id: "alaskan-brown-bears",
    neighborhoodId: "east-harlem",
    title: "Hyper-local Street Tree Census",
    team: "Alaskan Brown Bears",
    members: "Alana Menendez, Andre Nguyen, Brooke Walker-Concepcion, Jose Solorzano Escobar, Rania Khan",
    description: "Developed EcoMaps, an interactive tool for young community members to visualize green space benefits and a hyperlocal tree census database to secure maintenance funding. The Jupyter notebook tool enables ecological trend analysis and visualization of tree care benefits, designed for engagement at public schools and community events.",
    isWinner: false,
    tags: ["green-infrastructure", "urban-forestry", "community", "youth"],
    demoAvailable: true,
    datasets: ["Heat Vulnerability Index", "Forestry tree points dataset", "Street Tree Eco-benefit", "NYC Council mean heat deviation"]
  },
  {
    id: "blue-whales",
    neighborhoodId: "east-harlem",
    title: "Catch Basin Pandas",
    team: "Blue Whales",
    members: "Archy Guo, Charlotte Rhoads, Pooja Thakur, Raheem Williams, Tracy Obirika",
    description: "Investigated how East Harlem's history as a salt marsh and ongoing sanitation neglect exacerbate flooding. Geospatial analysis revealed an uneven distribution of trash cans compared to wealthier neighborhoods, identifying high-risk areas where inadequate sanitation infrastructure directly contributes to clogged drains and intensified flood risk.",
    isWinner: true,
    isWinnerCategory: "Best Incorporation of Risk Assessment + Projection",
    evalQuote: "Strong integration of multiple datasets demonstrating the clear link between sanitation infrastructure and flood resilience.",
    tags: ["flooding", "sanitation", "equity", "geospatial"],
    demoAvailable: false,
    datasets: ["311 service requests", "NYCDEP catch basins", "DSNY litter basket locations", "NYC stormwater flood maps"]
  },

  
  // Soundview
  {
    id: "giant-canoes",
    neighborhoodId: "soundview",
    title: "Green Transformation of Underutilized Lots",
    team: "Giant Canoes",
    members: "Archy Guo, Charlotte Rhoads, Pooja Thakur, Raheem Williams, Tracy Obirika",
    description: "Modeled pluvial floods in Soundview using digital elevation models and Sphinx open-source software to identify optimal sites for green infrastructure like rain gardens and bioswales. Developed an interactive map visualizing how converting underutilized areas such as parking lots could improve permeability and reduce flood risk.",
    isWinner: false,
    tags: ["stormwater", "green-infrastructure", "flood-modeling", "mapping"],
    demoAvailable: true,
    datasets: ["NYC Digital Elevation Model", "ESA WorldCover 2021", "HRRR precipitation data", "USGS discharge data"]
  },
  {
    id: "giant-sequoias",
    neighborhoodId: "soundview",
    title: "Reducing Heat Stress in Soundview",
    team: "Giant Sequoias",
    members: "Arya Roi, Caroline Shaum, Kevin Chan, Laura Lovelace, Zoe Tseng",
    description: "Assessed heat vulnerability in Soundview focusing on residents over 65 using Google Earth Engine surface temperature data and CESM2 climate projections for 2030 and 2035. Identified 49 brownfield sites as potential redevelopment locations for cooling interventions.",
    isWinner: false,
    tags: ["heat", "aging-populations", "remote-sensing", "brownfields"],
    demoAvailable: false,
    datasets: ["Google Earth Engine surface temperature", "CESM2 Earth System Model (SSP2-4.5)", "Brownfield site reports", "GIS / EJNYC"]
  },
  {
    id: "giant-squids",
    neighborhoodId: "soundview",
    title: "Reducing Emissions on the Cross Bronx Expressway",
    team: "Giant Squids",
    description: "Modeled the emissions and health impact of a freight tax on the Cross-Bronx Expressway in Soundview using NYC DOT truck route data and EPA PM2.5 health-cost estimates. Built an interactive simulator showing how tax rates from $0 to $100 shift daily truck volume, air pollution, and public health outcomes for the neighborhood.",
    isWinner: false,
    tags: ["freight", "emissions", "public-health", "policy-simulation"],
    demoAvailable: false,
    datasets: ["NYC DOT truck route data", "EPA PM2.5 health-cost estimates", "NYC DOHMH Environment & Health Data Portal — Asthma ED visits by NTA, ages 5-17 (2017–2019)"]
  },

  // Flushing / Queens
  {
    id: "gorillas",
    neighborhoodId: "flushing",
    title: "When the Clouds Panic",
    team: "Gorillas",
    members: "Khushi Mehta, Tehreem Qureshi, Bayonle Ibukun, Ariann Duncan, Steven Smith",
    description: "Developed Cloudburst AI, an interactive 3D visualization platform and AI agent addressing frequent flooding in Queens. The tool uses an open-source ALAMA model with climate specialist, scientific validator, and community planner roles to communicate flood relief potential and integrate expert feedback from the Guardians of Flushing Bay.",
    isWinner: false,
    tags: ["cloudburst", "AI", "3D-visualization", "community"],
    demoAvailable: true,
    datasets: ["CorrDiff downscaled climate dataset", "NYC Planimetric Database", "Queens weather data 1895–2025", "NYC Flood Vulnerability Index", "NYC311 flooding complaints"]
  },
  {
    id: "hadrosaur-footprints",
    neighborhoodId: "flushing",
    title: "Rain Garden Decision Support Tool",
    team: "Hadrosaur Footprints",
    members: "Aayush Parekh, Connor Feldman, Gianluca Astudillo, Lea Coquet, Shreeya KC",
    description: "Modeled the impact of rain gardens on stormwater runoff in Flushing Bay to improve flood resilience and reduce combined sewer overflow. The model integrates physical neighborhood characteristics, sewer system data, and rainfall time series to evaluate the effectiveness of existing and optimized rain garden designs.",
    isWinner: false,
    tags: ["rain-gardens", "stormwater", "CSO", "modeling"],
    demoAvailable: true,
    datasets: ["NYC rain garden locations", "Flushing physical characteristics", "NYC Planning sewer data", "FloodNet NYC rainfall data", "EPA SWMM parameters"]
  },
  {
    id: "king-penguins",
    neighborhoodId: "flushing",
    title: "Model of a Rain Garden",
    team: "King Penguins",
    members: "Audrey Jenkins, Gregory Randazzo, Sunni Hu, Tyler Janoski, Xinchi Zhang",
    description: "Developed a model to estimate stormwater capture and infiltration from rain gardens based on rainfall rate, soil infiltration, slope, and drainage area. Focused on reducing combined sewer overflow in the Flushing Bay area to improve water quality and mitigate flooding risk in urban environments.",
    isWinner: false,
    tags: ["rain-gardens", "stormwater", "CSO", "infiltration"],
    demoAvailable: false,
    datasets: ["Combined Sewer Overflow data", "Forestry Tree Points", "Forestry Planting Spaces", "Mean slope data", "USDA SSURGO soil data"]
  },

  // Brownsville
  {
    id: "komodo-dragons",
    neighborhoodId: "brownsville",
    title: "Spray Caps and Greedy Trees",
    team: "Komodo Dragons",
    members: "Karla Pinzón, Jorge Bravo, Cathy Deng, Forrest Pan",
    description: "Addressed extreme heat vulnerability in Brownsville by improving access to cooling resources through optimized placement of fire hydrant spray caps. Developed an interactive web map applying spatial optimization algorithms (K-center problem using greedy methods and K-d trees) to minimize the distance residents must travel to reach cooling sources during heat waves.",
    isWinner: true,
    isWinnerCategory: "Best Built Environment Proposal",
    evalQuote: "Innovative application of spatial optimization to a concrete, implementable intervention for heat resilience.",
    tags: ["heat", "cooling", "spatial-optimization", "equity"],
    demoAvailable: false,
    datasets: ["NYC Hydrant Map", "Cool It! NYC 2020 Cooling Sites", "NYC Parks Drinking Fountains", "ERA5 and CorrDiff", "Boundaries NYC"]
  },
  {
    id: "megalodons",
    neighborhoodId: "brownsville",
    title: "OUR-ERA (Open Urban Resilience – Emergency Routing Assistant)",
    team: "Megalodons",
    members: "Aarnav Hariramani, Adam Rahman, Sunima Dangol, William Manriquez, Xinyu Yan",
    description: "Developed OUR-ERA, a climate-aware georouting tool designed to improve emergency response and resource accessibility in Brownsville. The system integrates climate risk indicators including flooding, heat vulnerability, air quality, and terrain slope into a dynamic routing model to support safer navigation and more efficient emergency service planning.",
    isWinner: true,
    isWinnerCategory: "Best Community Communication Tool",
    evalQuote: "A sophisticated and immediately useful tool that meaningfully integrates climate risk into emergency routing for an underserved community.",
    tags: ["emergency-routing", "climate-risk", "accessibility", "georouting"],
    demoAvailable: true,
    datasets: ["NYC Stormwater Flood Map", "Street Tree Census", "NYCCAS Air Survey", "Heat Vulnerability Index", "OpenStreetMap / OSMnx", "Open-Elevation API"]
  },
  {
    id: "moai-statues",
    neighborhoodId: "brownsville",
    title: "CLIM-ALIGN",
    team: "Moai Statues",
    members: "Kelsey Wang, Yolanda Trujia Adria, George Milly",
    description: "Developed CLIM-ALIGN, a climate retrofit analysis tool assessing heat vulnerability in NYCHA public housing developments and supporting decision-making for building retrofits in response to rising temperatures and aging infrastructure.",
    isWinner: true,
    isWinnerCategory: "Best Visualization of Data & Best Overall Project",
    evalQuote: "Exceptional visualization and a directly actionable framework for NYCHA retrofit prioritization. A standout project on every dimension.",
    tags: ["NYCHA", "heat", "retrofit", "public-housing"],
    demoAvailable: true,
    datasets: ["ERA5 Reanalysis Data", "NYC 311 heat and water complaints", "NYU Furman Center HVI data", "NYCHA housing data"]
  },

  // Stapleton
  {
    id: "sperm-whales",
    neighborhoodId: "stapleton",
    title: "Precision Heat Relief",
    team: "Sperm Whales",
    members: "Chaitanya Kukreja, Julia Barcelo Figueras, Kai Xu",
    description: "Developed an interactive platform to identify heat vulnerability at a hyper-local street level in Staten Island and simulate how targeted tree-planting could reduce neighborhood temperatures. The tool combines environmental and socioeconomic data to help communities and planners visualize where cooling interventions would have the greatest equity impact.",
    isWinner: false,
    tags: ["heat", "urban-forestry", "equity", "simulation"],
    demoAvailable: true,
    datasets: ["NASA Landsat 8 surface temperature", "WorldPop & ACS demographic data", "NYC Street Tree Census 2015"]
  },
  {
    id: "stars-of-india",
    neighborhoodId: "stapleton",
    title: "Revitalizing a Community Landmark to Address Flooding",
    team: "Stars of India",
    members: "Nikita Pande, Syed Mahmood, Jugal Pumbhadia, Benjamin Coco",
    description: "Addressed flood risks in Stapleton by improving flood modeling to better reflect both physical topography and human impacts. Analyzed how elevation and infrastructure contribute to floodwater accumulation and proposed community-centered green infrastructure solutions such as permeable pavements and sponge gardens.",
    isWinner: false,
    tags: ["flooding", "green-infrastructure", "topography", "community"],
    demoAvailable: false,
    datasets: ["NYC 1ft Digital Elevation Model (LiDAR)", "Zillow Home Index", "NYC Resilience AI Agent coastal flood data"]
  },
  {
    id: "titanosaurs",
    neighborhoodId: "stapleton",
    title: "FloodLinkNYC",
    team: "Titanosaurs",
    members: "Devon James, Marilyn Moy, Mark Bauer, Milka Vincentiya, NJ Smith",
    description: "Developed a rainfall prediction model and proposed FloodLinkNYC, a community-facing flood alert system using LinkNYC kiosks. Combines SARIMAX precipitation forecasting with public digital infrastructure to improve early warning and flood preparedness in vulnerable neighborhoods.",
    isWinner: false,
    tags: ["flood-alerts", "precipitation-modeling", "early-warning", "community"],
    demoAvailable: false,
    datasets: ["FloodNYC sensor data", "Stapleton topography data", "Sea level rise projections", "Total Column Water Vapor data", "Historical rainfall 2019–2025", "LinkNYC infrastructure data"]
  }
];

const SITE_CONFIG = {
  title: "LEAP Hackathon 2026",
  subtitle: "Climate Resilience Through Collaborative Data Science",
  date: "January 2026",
  location: "New York City",
  mapCenter: [-73.93, 40.73],
  mapZoom: 10.5,
  dataSources: [
    { name: "NYC Stormwater Flood Maps (Cloudburst)", url: "https://data.cityofnewyork.us/Environment/NYC-Stormwater-Flood-Maps/9i7c-xyvv/about_data", org: "NYC Open Data" },
    { name: "NYC Heat Vulnerability Index", url: "https://github.com/NewYorkCityCouncil/heat_map", org: "NYC City Council" },
    { name: "Sea Level Rise Maps – 2050s", url: "https://data.cityofnewyork.us/Environment/Sea-Level-Rise-Maps-2050s-100-year-Floodplain-/hbw8-2bah", org: "NYC Open Data" },
    { name: "Sea Level Rise Maps – 2080s", url: "https://data.cityofnewyork.us/Environment/Sea-Level-Rise-Maps-2080s-100-year-Floodplain-/ek8y-fsqz/about_data", org: "NYC Open Data" },
    { name: "Forestry Tree Points (live inventory)", url: "https://data.cityofnewyork.us/Environment/Forestry-Tree-Points/hn5i-inap/about_data", org: "NYC Parks" },
    { name: "PFIRM Flood Insurance Rate Maps", url: "https://www.arcgis.com/apps/webappviewer/index.html?id=1c37d271fba14163bbb520517153d6d5", org: "FEMA / NYC" },
    { name: "CorrDiff Downscaled Climate Dataset", url: "https://leap.columbia.edu", org: "LEAP / NVIDIA" },
    { name: "FloodNet NYC Sensor Data", url: "https://www.floodnet.nyc", org: "FloodNet NYC" }
  ],
  sponsors: [
    { name: "LEAP NYC", url: "#" },
    { name: "Urban Omnibus", url: "https://urbanomnibus.net" },
    { name: "NYC Department of City Planning", url: "https://www.nyc.gov/site/planning" },
    { name: "JupyterHub / 2i2c", url: "https://2i2c.org" }
  ]
};
