import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

// Structure pour simuler une API de recherche de billets
const simulateTicketSearch = (from, to, date) => {
  // Génération de billets factices avec des prix variables
  const generateFakeTickets = () => {
    const tickets = [];
    const basePrice = Math.floor(Math.random() * 40) + 30; // Prix de base entre 30€ et 70€
    
    // Heures de départ possibles
    const departureTimes = ['06:15', '07:30', '09:45', '11:20', '13:00', '14:30', '16:15', '17:45', '19:30', '21:00'];
    
    // Générer des billets pour différentes heures
    departureTimes.forEach(depTime => {
      // Calculer l'heure d'arrivée (durée aléatoire entre 1h30 et 3h)
      const duration = Math.floor(Math.random() * 90) + 90; // En minutes
      const durationHours = Math.floor(duration / 60);
      const durationMinutes = duration % 60;
      
      // Calculer l'heure d'arrivée
      const [depHours, depMinutes] = depTime.split(':').map(Number);
      let arrHours = depHours + durationHours;
      let arrMinutes = depMinutes + durationMinutes;
      
      if (arrMinutes >= 60) {
        arrHours += 1;
        arrMinutes -= 60;
      }
      
      if (arrHours >= 24) {
        arrHours -= 24;
      }
      
      const arrivalTime = `${String(arrHours).padStart(2, '0')}:${String(arrMinutes).padStart(2, '0')}`;
      
      // Variation de prix selon l'heure (les heures de pointe sont plus chères)
      let priceVariation = 0;
      if (depHours >= 7 && depHours <= 9) priceVariation += 15; // Heures de pointe matinales
      if (depHours >= 16 && depHours <= 19) priceVariation += 12; // Heures de pointe soirées
      
      // Variation aléatoire supplémentaire
      priceVariation += Math.floor(Math.random() * 20) - 10;
      
      // Différentes classes de billets
      const classes = [
        { name: 'Standard', priceModifier: 0 },
        { name: 'Confort', priceModifier: 15 },
        { name: 'Première', priceModifier: 35 }
      ];
      
      // Ajouter un billet pour chaque classe
      classes.forEach(tClass => {
        tickets.push({
          id: `${depTime}-${tClass.name}-${Math.random().toString(36).substring(7)}`,
          departure: depTime,
          arrival: arrivalTime,
          duration: `${durationHours}h${durationMinutes > 0 ? ` ${durationMinutes}min` : ''}`,
          price: basePrice + priceVariation + tClass.priceModifier,
          class: tClass.name,
          available: Math.random() > 0.1 // 10% de chance qu'un billet soit indisponible
        });
      });
    });
    
    return tickets;
  };
  
  return generateFakeTickets();
};

const formatDate = (dateObj) => {
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

// Composant principal
const TrainTicketCompare = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [fromCity, setFromCity] = useState('Paris');
  const [toCity, setToCity] = useState('Lyon');
  const [departureDate, setDepartureDate] = useState(formatDate(tomorrow));
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [filterClass, setFilterClass] = useState('all');
  
  // Liste de villes françaises pour les suggestions
  const popularCities = [
    'Paris', 'Lyon', 'Marseille', 'Lille', 'Bordeaux', 'Toulouse', 'Nice', 'Nantes', 
    'Strasbourg', 'Montpellier', 'Rennes', 'Grenoble', 'Toulon', 'Dijon', 'Angers'
  ];
  
  const searchTickets = () => {
    setLoading(true);
    
    // Simuler un délai de chargement
    setTimeout(() => {
      const results = simulateTicketSearch(fromCity, toCity, departureDate);
      setTickets(results);
      setLoading(false);
    }, 1000);
  };
  
  // Fonction pour trier les billets
  const sortedTickets = [...tickets].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'departure':
        return a.departure.localeCompare(b.departure);
      case 'duration':
        // Convertir la durée en minutes pour le tri
        const getDurationMinutes = (durStr) => {
          const hours = parseInt(durStr.match(/(\d+)h/)?.[1] || '0');
          const minutes = parseInt(durStr.match(/(\d+)min/)?.[1] || '0');
          return hours * 60 + minutes;
        };
        return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
      default:
        return 0;
    }
  });
  
  // Filtrer par classe
  const filteredTickets = filterClass === 'all' 
    ? sortedTickets 
    : sortedTickets.filter(ticket => ticket.class === filterClass);
  
  // Fonction pour échanger les villes
  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };
  
  // Fonction pour changer la date (jour suivant/précédent)
  const changeDate = (days) => {
    const currentDate = parseDate(departureDate);
    currentDate.setDate(currentDate.getDate() + days);
    setDepartureDate(formatDate(currentDate));
  };
  
  return (
    <div className="flex flex-col p-4 mx-auto max-w-4xl bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">Comparateur de Prix de Billets de Train</h1>
      
      {/* Formulaire de recherche */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
            <input
              type="text"
              list="fromCities"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
            />
            <datalist id="fromCities">
              {popularCities.map(city => (
                <option key={`from-${city}`} value={city} />
              ))}
            </datalist>
          </div>
          
          <div className="flex items-center justify-center">
            <button 
              onClick={swapCities}
              className="p-2 text-blue-600 hover:text-blue-800"
              aria-label="Échanger les villes"
            >
              ⇄
            </button>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
            <input
              type="text"
              list="toCities"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
            />
            <datalist id="toCities">
              {popularCities.map(city => (
                <option key={`to-${city}`} value={city} />
              ))}
            </datalist>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Date de départ</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => changeDate(-1)} 
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Jour précédent
                </button>
                <button 
                  onClick={() => changeDate(1)} 
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Jour suivant
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                className="w-full p-2 pl-10 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="JJ/MM/AAAA"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <button
              onClick={searchTickets}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Résultats de recherche */}
      {tickets.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold mb-2 md:mb-0">
              {fromCity} → {toCity} <span className="text-sm font-normal text-gray-600">({departureDate})</span>
            </h2>
            
            <div className="flex flex-col md:flex-row gap-2">
              <div>
                <label className="text-sm text-gray-600 mr-2">Trier par:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-1 border border-gray-300 rounded text-sm"
                >
                  <option value="price">Prix</option>
                  <option value="departure">Heure de départ</option>
                  <option value="duration">Durée</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mr-2">Classe:</label>
                <select 
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="p-1 border border-gray-300 rounded text-sm"
                >
                  <option value="all">Toutes</option>
                  <option value="Standard">Standard</option>
                  <option value="Confort">Confort</option>
                  <option value="Première">Première</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-2">
            {filteredTickets.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredTickets.map(ticket => (
                  <div key={ticket.id} className={`py-4 ${!ticket.available ? 'opacity-50' : ''}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center space-x-6 mb-2 md:mb-0">
                        <div className="text-xl font-mono">
                          {ticket.departure} <span className="text-gray-400">→</span> {ticket.arrival}
                        </div>
                        <div className="text-sm text-gray-600">
                          Durée: {ticket.duration}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex flex-col items-end mr-4">
                          <span className="text-xl font-bold">{ticket.price} €</span>
                          <span className="text-xs text-gray-600">{ticket.class}</span>
                        </div>
                        
                        <button
                          className={`px-4 py-2 rounded ${
                            ticket.available 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-gray-300 cursor-not-allowed text-gray-600'
                          }`}
                          disabled={!ticket.available}
                        >
                          {ticket.available ? 'Réserver' : 'Complet'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                Aucun billet ne correspond à vos critères.
              </div>
            )}
          </div>
        </div>
      )}
      
      {tickets.length === 0 && !loading && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center text-gray-600">
          Entrez votre trajet et la date souhaitée pour trouver les meilleurs tarifs.
        </div>
      )}
      
      {loading && (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Recherche des meilleurs tarifs...</p>
        </div>
      )}
    </div>
  );
};

export default TrainTicketCompare;