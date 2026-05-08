let allAgents = []; 
let allCards = []; 
let allWeapons = [];
let allMaps = [];

async function fetchData() {
    try {
        const [agentRes, cardRes, weaponRes, mapRes] = await Promise.all([
            fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true'),
            fetch('https://valorant-api.com/v1/playercards'),
            fetch('https://valorant-api.com/v1/weapons'),
            fetch('https://valorant-api.com/v1/maps')
        ]);
        
        const agentJson = await agentRes.json();
        const cardJson = await cardRes.json();
        const weaponJson = await weaponRes.json();
        const mapJson = await mapRes.json();
        
        allAgents = agentJson.data;
        allCards = cardJson.data;
        allWeapons = weaponJson.data;
        allMaps = mapJson.data;

        // Update stats
        document.getElementById('agent-count').innerText = allAgents.length;
        document.getElementById('maps-count').innerText = allMaps.length;
        document.getElementById('total-count').innerText = allAgents.length + allCards.length + allWeapons.length + allMaps.length;

        displayAgents(allAgents);
        displayCards(allCards);
        displayWeapons(allWeapons);
        displayMaps(allMaps);
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

function displayAgents(agents) {
    const container = document.getElementById('agent-container');
    if (!container) return;
    container.innerHTML = ''; 

    agents.forEach(agent => {
        const card = document.createElement('div');
        card.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
        
        card.innerHTML = `
            <div class="agent-card h-100" onclick="showAgentDetails('${agent.uuid}')" style="cursor: pointer;">
                <div class="agent-img-container" style="background-image: url('${agent.background}')">
                    <img src="${agent.fullPortrait}" class="agent-portrait">
                    <div class="agent-name-overlay">
                        <h2>${agent.displayName}</h2>
                        <span class="role-tag">
                            <img src="${agent.role.displayIcon}" width="12"> ${agent.role.displayName}
                        </span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function showAgentDetails(uuid) {
    const agent = allAgents.find(a => a.uuid === uuid);
    if(!agent) return;

    document.getElementById('modal-name').innerText = agent.displayName;
    document.getElementById('modal-role').innerText = agent.role.displayName;
    document.getElementById('modal-desc').innerText = agent.description;
    document.getElementById('modal-img').src = agent.fullPortrait;
    document.getElementById('modal-bg').style.backgroundImage = `url('${agent.background}')`;

    const abilitiesContainer = document.getElementById('modal-abilities');
    abilitiesContainer.innerHTML = agent.abilities.map(ab => `
        <div class="col-6">
            <div class="d-flex align-items-center p-2 bg-black bg-opacity-25 rounded h-100 border border-secondary border-opacity-25">
                <img src="${ab.displayIcon || ''}" width="25" class="me-2" style="filter: brightness(0) invert(1);">
                <span style="font-size: 0.75rem;">${ab.displayName}</span>
            </div>
        </div>
    `).join('');

    const modalElement = document.getElementById('agentModal');
    const myModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    myModal.show();
}

function showWeaponDetails(uuid) {
    const weapon = allWeapons.find(w => w.uuid === uuid);
    if(!weapon) return;

    document.getElementById('weapon-modal-title').innerText = weapon.displayName;
    document.getElementById('weapon-modal-img').src = weapon.displayIcon;

    const statsContainer = document.getElementById('weapon-stats');
    if (weapon.weaponStats) {
        statsContainer.innerHTML = `
            <div class="row g-3">
                <div class="col-6">
                    <div class="p-3 bg-dark rounded">
                        <small class="text-cyan">Fire Rate</small>
                        <h5 class="text-white">${weapon.weaponStats.fireRate || 'N/A'}</h5>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-3 bg-dark rounded">
                        <small class="text-cyan">Magazine</small>
                        <h5 class="text-white">${weapon.weaponStats.magazineSize || 'N/A'}</h5>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-3 bg-dark rounded">
                        <small class="text-cyan">Reload Time</small>
                        <h5 class="text-white">${weapon.weaponStats.reloadTimeSeconds ? weapon.weaponStats.reloadTimeSeconds + 's' : 'N/A'}</h5>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-3 bg-dark rounded">
                        <small class="text-cyan">Cost</small>
                        <h5 class="text-white">${weapon.shopData ? weapon.shopData.cost : 'N/A'}</h5>
                    </div>
                </div>
            </div>
        `;
    } else {
        statsContainer.innerHTML = '<p class="text-white">No stats available</p>';
    }

    const skinsContainer = document.getElementById('weapon-skins-container');
    if (weapon.skins && weapon.skins.length > 0) {
        skinsContainer.innerHTML = weapon.skins.slice(0, 6).map(skin => `
            <div class="col-6 col-md-4">
                <div class="skin-item p-2 bg-dark rounded text-center">
                    <img src="${skin.displayIcon || ''}" class="img-fluid" style="max-height: 60px;" alt="${skin.displayName}">
                    <small class="text-white d-block mt-1">${skin.displayName}</small>
                </div>
            </div>
        `).join('');
    } else {
        skinsContainer.innerHTML = '<p class="text-white">No skins available</p>';
    }

    const modalElement = document.getElementById('weaponModal');
    const myModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    myModal.show();
}

function showMapDetails(uuid) {
    const map = allMaps.find(m => m.uuid === uuid);
    if(!map) return;

    document.getElementById('map-modal-name').innerText = map.displayName;
    document.getElementById('map-modal-img').src = map.splash;

    const infoContainer = document.getElementById('map-info');
    infoContainer.innerHTML = `
        <div class="col-12">
            <p class="text-white">${map.narrativeDescription || 'No description available'}</p>
        </div>
        <div class="col-md-6">
            <small class="text-cyan">Coordinates</small>
            <p class="text-white">${map.coordinates || 'N/A'}</p>
        </div>
        <div class="col-md-6">
            <small class="text-cyan">Tactical Description</small>
            <p class="text-white">${map.tacticalDescription || 'N/A'}</p>
        </div>
    `;

    const modalElement = document.getElementById('mapModal');
    const myModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    myModal.show();
}

function displayCards(cards) {
    const container = document.getElementById('cards-container');
    if (!container) return;
    container.innerHTML = ''; 
    cards.forEach(card => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="player-card-item">
                <div class="card-img-wrapper">
                    <img src="${card.largeArt}" class="img-fluid rounded" alt="${card.displayName}" loading="lazy">
                </div>
                <p class="card-name text-truncate mt-1">${card.displayName}</p>
            </div>
        `;
        container.appendChild(col);
    });
}

function displayWeapons(weapons) {
    const container = document.getElementById('weapon-container');
    if (!container) return;
    container.innerHTML = ''; 
    weapons.forEach(weapon => {
        const weaponName = weapon.displayName ? weapon.displayName.trim() : 'Unknown Weapon';
        const card = document.createElement('div');
        card.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
        
        card.innerHTML = `
            <div class="weapon-card h-100" onclick="showWeaponDetails('${weapon.uuid}')" style="cursor: pointer;">
                <div class="weapon-img-container">
                    <img src="${weapon.displayIcon}" class="weapon-icon">
                    <div class="weapon-name-overlay">
                        <h2>${weaponName}</h2>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function displayMaps(maps) {
    const container = document.getElementById('maps-container');
    if (!container) return;
    container.innerHTML = ''; 
    maps.forEach(map => {
        const card = document.createElement('div');
        card.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
        
        card.innerHTML = `
            <div class="map-card h-100" onclick="showMapDetails('${map.uuid}')" style="cursor: pointer;">
                <div class="map-img-container">
                    <img src="${map.splash}" class="map-splash">
                    <div class="map-name-overlay">
                        <h2>${map.displayName}</h2>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

const searchInput = document.getElementById('globalSearch');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        const activeTab = document.querySelector('.nav-link.active').id;

        if (activeTab === 'agents-tab') {
            const filtered = allAgents.filter(a => a.displayName.toLowerCase().includes(val));
            displayAgents(filtered);
        } else if (activeTab === 'weapons-tab') {
            const filtered = allWeapons.filter(w => w.displayName.toLowerCase().includes(val));
            displayWeapons(filtered);
        } else if (activeTab === 'maps-tab') {
            const filtered = allMaps.filter(m => m.displayName.toLowerCase().includes(val));
            displayMaps(filtered);
        } else {
            const filtered = allCards.filter(c => c.displayName.toLowerCase().includes(val));
            displayCards(filtered);
        }
    });
}

fetchData();