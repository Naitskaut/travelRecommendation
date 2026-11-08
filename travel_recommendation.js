const resultsEl = document.getElementById('results');
const searchInput = document.getElementById('searchInput');
let travelData = null;

// Fetch recommendation data
fetch('travel_recommendation_api.json')
  .then((response) => response.json())
  .then((data) => {
    travelData = data;
    console.log(data);
  })
  .catch((error) => console.error('Error fetching data:', error));

// Optional: local time for a destination
const timeZones = {
  'Sydney, Australia': 'Australia/Sydney',
  'Melbourne, Australia': 'Australia/Melbourne',
  'Tokyo, Japan': 'Asia/Tokyo',
  'Kyoto, Japan': 'Asia/Tokyo',
  'Rio de Janeiro, Brazil': 'America/Sao_Paulo',
  'São Paulo, Brazil': 'America/Sao_Paulo',
  'Angkor Wat, Cambodia': 'Asia/Phnom_Penh',
  'Taj Mahal, India': 'Asia/Kolkata',
  'Bora Bora, French Polynesia': 'Pacific/Tahiti',
  'Copacabana Beach, Brazil': 'America/Sao_Paulo'
};

function localTime(name) {
  const zone = timeZones[name];
  if (!zone) return '';
  const options = { timeZone: zone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date().toLocaleTimeString('en-US', options);
}

function createCard(place) {
  const card = document.createElement('div');
  card.className = 'card';
  const time = localTime(place.name);
  card.innerHTML = `
    <img src="${place.imageUrl}" alt="${place.name}"
         onerror="this.onerror=null;this.src='https://picsum.photos/seed/${encodeURIComponent(place.name)}/640/400';">
    <div class="card-body">
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      ${time ? `<div class="time">Current local time: ${time}</div>` : ''}
      <button class="btn">Visit</button>
    </div>`;
  return card;
}

function showMessage(text) {
  resultsEl.innerHTML = `<div class="message">${text}</div>`;
}

function search() {
  const keyword = searchInput.value.trim().toLowerCase();
  resultsEl.innerHTML = '';

  if (!keyword) {
    showMessage('Please enter a keyword: beach, temple or country.');
    return;
  }
  if (!travelData) {
    showMessage('Data is still loading, please try again in a moment.');
    return;
  }

  let places = [];

  if (keyword === 'beach' || keyword === 'beaches') {
    places = travelData.beaches;
  } else if (keyword === 'temple' || keyword === 'temples') {
    places = travelData.temples;
  } else if (keyword === 'country' || keyword === 'countries') {
    places = travelData.countries.flatMap((country) => country.cities);
  } else {
    // Search by a specific country name, e.g. "japan"
    const country = travelData.countries.find((c) => c.name.toLowerCase() === keyword);
    if (country) places = country.cities;
  }

  if (places.length === 0) {
    showMessage(`No recommendations found for "${searchInput.value}". Try beach, temple or country.`);
    return;
  }

  places.forEach((place) => resultsEl.appendChild(createCard(place)));
}

function clearResults() {
  searchInput.value = '';
  resultsEl.innerHTML = '';
}

document.getElementById('btnSearch').addEventListener('click', search);
document.getElementById('btnClear').addEventListener('click', clearResults);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') search();
});
