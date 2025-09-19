// Variable globale pour stocker les données JSON
let travelData = null;

// Fonction pour charger les données JSON une seule fois
function loadTravelData() {
  return fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      travelData = data;
    })
    .catch(error => {
      console.error('Erreur lors du chargement des données:', error);
    });
}

// Appel pour charger les données au chargement de la page
loadTravelData();

// Fonction pour normaliser le texte
function normalizeText(text) {
  let normalized = text.trim().toLowerCase();
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return normalized;
}

// Fonction pour vérifier si le mot-clé saisi correspond à une catégorie
function matchKeyword(input, categoryKeywords) {
  return categoryKeywords.some(keyword => input.includes(keyword));
}

// Fonction pour filtrer les données en fonction du type de recherche
function filtrerDonnees(travelData, typeRecherche) {
  switch (typeRecherche) {
    case 'plage':
      return {
        beaches: travelData.beaches,
        temples: [],
        countries: [],
      };
    case 'temple':
      return {
        beaches: [],
        temples: travelData.temples,
        countries: [],
      };
    case 'pays':
      return {
        beaches: [],
        temples: [],
        countries: travelData.countries,
      };
    default:
      return travelData; // Si aucun mot-clé, retourner toutes les données
  }
}

// Fonction pour afficher les recommandations
function afficherRecommandationsHTML(data) {
    const container = document.getElementById('recommendations');
    container.innerHTML = '';
  
    // Affichage des pays et villes
    data.countries.forEach(country => {
      const countryElem = document.createElement('h2');
      countryElem.textContent = country.name;
      container.appendChild(countryElem);
  
      country.cities.forEach(city => {
        const cityContainer = document.createElement('div');
        
        const cityImg = document.createElement('img');
        cityImg.src = city.imageUrl;
        cityImg.alt = city.name;
        cityImg.style.width = '600px';
  
        const cityDesc = document.createElement('p');
        cityDesc.innerHTML = `<strong>${city.name}</strong>: ${city.description}`;
  
        cityContainer.appendChild(cityImg);
        cityContainer.appendChild(cityDesc);
        container.appendChild(cityContainer);
      });
    });
  
    // Affichage des temples
    const templesHeader = document.createElement('h2');
    templesHeader.textContent = 'Temples';
    container.appendChild(templesHeader);
    data.temples.forEach(temple => {
      const templeContainer = document.createElement('div');
  
      const templeImg = document.createElement('img');
      templeImg.src = temple.imageUrl;
      templeImg.alt = temple.name;
      templeImg.style.width = '600px';
  
      const templeDesc = document.createElement('p');
      templeDesc.innerHTML = `<strong>${temple.name}</strong>: ${temple.description}`;
  
      templeContainer.appendChild(templeImg);
      templeContainer.appendChild(templeDesc);
      container.appendChild(templeContainer);
    });
  
    // Affichage des plages
    const beachesHeader = document.createElement('h2');
    beachesHeader.textContent = 'Beaches';
    container.appendChild(beachesHeader);
    data.beaches.forEach(beach => {
      const beachContainer = document.createElement('div');
  
      const beachImg = document.createElement('img');
      beachImg.src = beach.imageUrl;
      beachImg.alt = beach.name;
      beachImg.style.width = '600px';
  
      const beachDesc = document.createElement('p');
      beachDesc.innerHTML = `<strong>${beach.name}</strong>: ${beach.description}`;
  
      beachContainer.appendChild(beachImg);
      beachContainer.appendChild(beachDesc);
      container.appendChild(beachContainer);
    });
  }

// Gestionnaire d'événement pour le bouton de recherche
document.getElementById('searchButton').addEventListener('click', () => {
  if (!travelData) {
    // Si les données ne sont pas encore chargées, les charger puis traiter
    loadTravelData().then(() => {
      traiterRecherche();
    });
  } else {
    traiterRecherche();
  }
});

// Déclaration globale des mots-clés
const keywords = {
  plage: ['plage', 'plages'],
  temple: ['temple', 'temples'],
  pays: ['pays', 'pays']
};

// Fonction pour traiter la recherche
function traiterRecherche() {
  const input = document.getElementById('searchInput').value.trim();
  const normalizedInput = normalizeText(input);
  let resultMessage = '';
  let filteredData;

  if (matchKeyword(normalizedInput, keywords.plage)) {
    resultMessage = 'Résultat pour plage';
    filteredData = filtrerDonnees(travelData, 'plage');
  } else if (matchKeyword(normalizedInput, keywords.temple)) {
    resultMessage = 'Résultat pour temple';
    filteredData = filtrerDonnees(travelData, 'temple');
  } else if (matchKeyword(normalizedInput, keywords.pays)) {
    resultMessage = 'Résultat pour pays';
    filteredData = filtrerDonnees(travelData, 'pays');
  } else {
    resultMessage = 'Aucun résultat trouvé.';
    filteredData = { beaches: [], temples: [], countries: [] };
  }

  document.getElementById('results').textContent = resultMessage;

  // Si la recherche n'est pas vide, afficher recommandations filtrées
  if (input !== '' && travelData) {
    afficherRecommandationsHTML(filteredData);
    // Rendre visible la section recommandations
    document.getElementById('recommendations').style.display = 'block';
    document.getElementById('introduction').style.display = 'none';
  } else {
    // Sinon, cacher la section
    document.getElementById('recommendations').style.display = 'none';
  }
}

document.getElementById('resetButton').addEventListener('click', reinitialiser);

function reinitialiser() {
    // Effacer le champ de recherche
    document.getElementById('searchInput').value = '';
  
    // Cacher la section recommandations
    document.getElementById('recommendations').style.display = 'none';
  
    // Réinitialiser le message de résultats
    document.getElementById('results').textContent = '';
  
    // Afficher la section d'introduction si nécessaire
    document.getElementById('introduction').style.display = 'block';
  
    // Optionnel : vous pouvez aussi réinitialiser d'autres éléments si besoin
  }