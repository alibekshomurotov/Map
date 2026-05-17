// src/services/api.js
import axios from 'axios';

// 1. OpenStreetMap Nominatim API (shaharlar va joylar uchun)
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

// 2. REST Countries API (davlatlar ma'lumoti uchun)
const COUNTRIES_URL = 'https://restcountries.com/v3.1';

// 3. OpenWeatherMap API (ob-havo uchun - ixtiyoriy)
const WEATHER_API_KEY = 'YOUR_API_KEY'; // https://openweathermap.org dan olish

class GeoAPI {
  // Barcha davlatlarni olish
  async getAllCountries() {
    try {
      const response = await axios.get(`${COUNTRIES_URL}/all?fields=name,capital,latlng,population,area,flags,region,subregion,languages,currencies`);
      return response.data.map(country => ({
        id: country.cca3,
        name: country.name.common,
        capital: country.capital?.[0] || 'Noma\'lum',
        lat: country.latlng?.[0] || 0,
        lng: country.latlng?.[1] || 0,
        population: country.population,
        area: country.area,
        flag: country.flags?.png,
        flagEmoji: country.flag,
        region: country.region,
        subregion: country.subregion,
        languages: Object.values(country.languages || {}),
        currencies: Object.values(country.currencies || {}).map(c => `${c.name} (${c.symbol})`)
      }));
    } catch (error) {
      console.error("Davlatlarni yuklashda xatolik:", error);
      return this.getLocalCountries(); // Offline rejim uchun
    }
  }

  // Shaharlarni qidirish (qidiruv bo'yicha)
  async searchCities(query, country = null) {
    try {
      let searchQuery = query;
      if (country) {
        searchQuery = `${query}, ${country}`;
      }
      
      const response = await axios.get(`${NOMINATIM_URL}/search`, {
        params: {
          q: searchQuery,
          format: 'json',
          limit: 20,
          addressdetails: 1,
          namedetails: 1
        },
        headers: {
          'User-Agent': 'EarthExplorer/1.0'
        }
      });
      
      return response.data.map(city => ({
        name: city.name,
        displayName: city.display_name,
        lat: parseFloat(city.lat),
        lng: parseFloat(city.lon),
        type: city.type,
        importance: city.importance,
        country: city.address?.country,
        state: city.address?.state,
        population: city.extratags?.population || 'Noma\'lum'
      }));
    } catch (error) {
      console.error("Shaharlarni qidirishda xatolik:", error);
      return [];
    }
  }

  // Shahar ma'lumotlarini koordinata bo'yicha olish
  async getCityByCoordinates(lat, lng) {
    try {
      const response = await axios.get(`${NOMINATIM_URL}/reverse`, {
        params: {
          lat: lat,
          lon: lng,
          format: 'json',
          addressdetails: 1
        }
      });
      return response.data;
    } catch (error) {
      console.error("Koordinata bo'yicha joy topishda xatolik:", error);
      return null;
    }
  }

  // Davlatning barcha shaharlarini olish (katta shaharlar)
  async getCitiesByCountry(countryName) {
    try {
      // Katta shaharlarni qidirish
      const response = await axios.get(`${NOMINATIM_URL}/search`, {
        params: {
          q: `${countryName} city`,
          format: 'json',
          limit: 30,
          featuretype: 'city',
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'EarthExplorer/1.0'
        }
      });
      
      // Filtrlash va tartiblash
      const cities = response.data
        .filter(city => city.type === 'city' || city.type === 'town')
        .map(city => ({
          name: city.name,
          lat: parseFloat(city.lat),
          lng: parseFloat(city.lon),
          population: city.extratags?.population || 'Noma\'lum',
          importance: city.importance
        }))
        .sort((a, b) => (b.importance || 0) - (a.importance || 0))
        .slice(0, 15); // Eng muhim 15 ta shahar
      
      return cities;
    } catch (error) {
      console.error("Shaharlarni yuklashda xatolik:", error);
      return this.getLocalCities(countryName);
    }
  }

  // Offline rejim uchun lokal ma'lumotlar
  getLocalCountries() {
    return [
      { id: 'UZB', name: "Oʻzbekiston", capital: "Toshkent", lat: 41.3775, lng: 64.5853, population: 35000000, area: 447400, flagEmoji: "🇺🇿", region: "Markaziy Osiyo" },
      { id: 'TUR', name: "Turkiya", capital: "Ankara", lat: 38.9637, lng: 35.2433, population: 84000000, area: 783562, flagEmoji: "🇹🇷", region: "Yevropa/Osiyo" },
      { id: 'USA', name: "AQSh", capital: "Vashington", lat: 37.0902, lng: -95.7129, population: 331000000, area: 9833520, flagEmoji: "🇺🇸", region: "Shimoliy Amerika" },
      { id: 'JPN', name: "Yaponiya", capital: "Tokio", lat: 36.2048, lng: 138.2529, population: 125000000, area: 377975, flagEmoji: "🇯🇵", region: "Osiyo" },
      { id: 'FRA', name: "Fransiya", capital: "Parij", lat: 46.2276, lng: 2.2137, population: 67390000, area: 551695, flagEmoji: "🇫🇷", region: "Yevropa" },
      { id: 'GER', name: "Germaniya", capital: "Berlin", lat: 51.1657, lng: 10.4515, population: 83190556, area: 357022, flagEmoji: "🇩🇪", region: "Yevropa" },
      { id: 'CHN', name: "Xitoy", capital: "Pekin", lat: 35.8617, lng: 104.1954, population: 1411778724, area: 9596961, flagEmoji: "🇨🇳", region: "Osiyo" },
      { id: 'IND', name: "Hindiston", capital: "Dehli", lat: 20.5937, lng: 78.9629, population: 1380004385, area: 3287263, flagEmoji: "🇮🇳", region: "Osiyo" },
      { id: 'RUS', name: "Rossiya", capital: "Moskva", lat: 61.5240, lng: 105.3188, population: 145934462, area: 17098246, flagEmoji: "🇷🇺", region: "Yevropa/Osiyo" },
      { id: 'BRA', name: "Braziliya", capital: "Brazilia", lat: -14.2350, lng: -51.9253, population: 212559417, area: 8515767, flagEmoji: "🇧🇷", region: "Janubiy Amerika" },
    ];
  }

  getLocalCities(countryName) {
    const localCities = {
      "Oʻzbekiston": [
        { name: "Toshkent", lat: 41.2995, lng: 69.2401, population: "2.5M" },
        { name: "Samarqand", lat: 39.6542, lng: 66.9597, population: "550K" },
        { name: "Buxoro", lat: 39.7747, lng: 64.4286, population: "280K" }
      ],
      "Turkiya": [
        { name: "Istanbul", lat: 41.0082, lng: 28.9784, population: "15.5M" },
        { name: "Ankara", lat: 39.9334, lng: 32.8597, population: "5.7M" },
        { name: "Izmir", lat: 38.4189, lng: 27.1287, population: "4.4M" }
      ]
    };
    return localCities[countryName] || [];
  }
}

export default new GeoAPI();