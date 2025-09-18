function fetchTravelData() {
  fetch('travel_recommendation_api.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Si vous souhaitez accéder à un détail spécifique, par exemple le nom du lieu :
      // console.log(data.nom_du_lieu);
    })
    .catch(error => {
      console.error('Il y a eu un problème avec la récupération des données:', error);
    });
}

// Appel de la fonction pour tester
fetchTravelData();

// Fonction pour gérer la recherche
function handleSearch() {
    const input = document.getElementById('conditionInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
  
    const keywords = {
      plage: ['plage', 'plages'],
      temples: ['temple', 'temples'],
      pays: ['pays', 'nation', 'nations']
    };
  
    let matchedCategory = null;
  
    for (const category in keywords) {
      if (keywords[category].includes(input)) {
        matchedCategory = category;
        break;
      }
    }
  
    if (matchedCategory) {
      resultsDiv.innerHTML = `Vous avez recherché : ${matchedCategory}`;
    } else {
      resultsDiv.innerHTML = 'Aucun résultat trouvé pour votre recherche.';
    }
  }
  
  // Ajout de l'écouteur d'événement
  document.getElementById('btnSearch').addEventListener('click', handleSearch);