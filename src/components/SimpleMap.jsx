// src/components/SimpleMap.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Marker ikonkasini o'chirish
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ============ BARCHA DAVLATLAR (190+ DAVLAT) ============
const allCountries = [
  // A
  { id: "AF", name: "Afg'oniston", nameEn: "Afghanistan", capital: "Kobul", lat: 33.9391, lng: 67.7100, population: "38,000,000", flag: "🇦🇫", region: "Osiyo" },
  { id: "AL", name: "Albaniya", nameEn: "Albania", capital: "Tirana", lat: 41.1533, lng: 20.1683, population: "2,800,000", flag: "🇦🇱", region: "Yevropa" },
  { id: "DZ", name: "Jazoir", nameEn: "Algeria", capital: "Jazoir", lat: 28.0339, lng: 1.6596, population: "44,000,000", flag: "🇩🇿", region: "Afrika" },
  { id: "AD", name: "Andorra", nameEn: "Andorra", capital: "Andorra la Vella", lat: 42.5462, lng: 1.6016, population: "77,000", flag: "🇦🇩", region: "Yevropa" },
  { id: "AO", name: "Angola", nameEn: "Angola", capital: "Luanda", lat: -11.2027, lng: 17.8739, population: "33,000,000", flag: "🇦🇴", region: "Afrika" },
  { id: "AG", name: "Antigua va Barbuda", nameEn: "Antigua and Barbuda", capital: "Sent John's", lat: 17.0608, lng: -61.7964, population: "97,000", flag: "🇦🇬", region: "Karib" },
  { id: "AR", name: "Argentina", nameEn: "Argentina", capital: "Buenos Aires", lat: -38.4161, lng: -63.6167, population: "45,000,000", flag: "🇦🇷", region: "Janubiy Amerika" },
  { id: "AM", name: "Armaniston", nameEn: "Armenia", capital: "Yerevan", lat: 40.0691, lng: 45.0382, population: "3,000,000", flag: "🇦🇲", region: "Osiyo" },
  { id: "AU", name: "Avstraliya", nameEn: "Australia", capital: "Kanberra", lat: -25.2744, lng: 133.7751, population: "25,700,000", flag: "🇦🇺", region: "Okeaniya" },
  { id: "AT", name: "Avstriya", nameEn: "Austria", capital: "Vena", lat: 47.5162, lng: 14.5501, population: "9,000,000", flag: "🇦🇹", region: "Yevropa" },
  { id: "AZ", name: "Ozarbayjon", nameEn: "Azerbaijan", capital: "Boku", lat: 40.1431, lng: 47.5769, population: "10,100,000", flag: "🇦🇿", region: "Osiyo" },
  
  // B
  { id: "BS", name: "Bagama orollari", nameEn: "Bahamas", capital: "Nassau", lat: 25.0343, lng: -77.3963, population: "393,000", flag: "🇧🇸", region: "Karib" },
  { id: "BH", name: "Bahrayn", nameEn: "Bahrain", capital: "Manama", lat: 26.0667, lng: 50.5577, population: "1,700,000", flag: "🇧🇭", region: "O'rta Sharq" },
  { id: "BD", name: "Bangladesh", nameEn: "Bangladesh", capital: "Dakka", lat: 23.6850, lng: 90.3563, population: "166,000,000", flag: "🇧🇩", region: "Osiyo" },
  { id: "BB", name: "Barbados", nameEn: "Barbados", capital: "Bridgetown", lat: 13.1939, lng: -59.5432, population: "287,000", flag: "🇧🇧", region: "Karib" },
  { id: "BY", name: "Belarus", nameEn: "Belarus", capital: "Minsk", lat: 53.7098, lng: 27.9534, population: "9,400,000", flag: "🇧🇾", region: "Yevropa" },
  { id: "BE", name: "Belgiya", nameEn: "Belgium", capital: "Bryussel", lat: 50.5039, lng: 4.4699, population: "11,500,000", flag: "🇧🇪", region: "Yevropa" },
  { id: "BZ", name: "Beliz", nameEn: "Belize", capital: "Belmopan", lat: 17.1899, lng: -88.4976, population: "398,000", flag: "🇧🇿", region: "Markaziy Amerika" },
  { id: "BJ", name: "Benin", nameEn: "Benin", capital: "Porto-Novo", lat: 9.3077, lng: 2.3158, population: "12,000,000", flag: "🇧🇯", region: "Afrika" },
  { id: "BT", name: "Butan", nameEn: "Bhutan", capital: "Thimphu", lat: 27.5142, lng: 90.4336, population: "771,000", flag: "🇧🇹", region: "Osiyo" },
  { id: "BO", name: "Boliviya", nameEn: "Bolivia", capital: "La Paz", lat: -16.2902, lng: -63.5887, population: "11,700,000", flag: "🇧🇴", region: "Janubiy Amerika" },
  { id: "BA", name: "Bosniya va Gersegovina", nameEn: "Bosnia and Herzegovina", capital: "Sarajevo", lat: 43.9159, lng: 17.6791, population: "3,300,000", flag: "🇧🇦", region: "Yevropa" },
  { id: "BW", name: "Botsvana", nameEn: "Botswana", capital: "Gaborone", lat: -22.3285, lng: 24.6849, population: "2,400,000", flag: "🇧🇼", region: "Afrika" },
  { id: "BR", name: "Braziliya", nameEn: "Brazil", capital: "Brazilia", lat: -14.2350, lng: -51.9253, population: "213,000,000", flag: "🇧🇷", region: "Janubiy Amerika" },
  { id: "BN", name: "Bruney", nameEn: "Brunei", capital: "Bandar Seri Begawan", lat: 4.5353, lng: 114.7277, population: "437,000", flag: "🇧🇳", region: "Osiyo" },
  { id: "BG", name: "Bolgariya", nameEn: "Bulgaria", capital: "Sofiya", lat: 42.7339, lng: 25.4858, population: "6,900,000", flag: "🇧🇬", region: "Yevropa" },
  { id: "BF", name: "Burkina-Faso", nameEn: "Burkina Faso", capital: "Uagadugu", lat: 12.2383, lng: -1.5616, population: "21,000,000", flag: "🇧🇫", region: "Afrika" },
  { id: "BI", name: "Burundi", nameEn: "Burundi", capital: "Gitega", lat: -3.3731, lng: 29.9189, population: "12,000,000", flag: "🇧🇮", region: "Afrika" },
  
  // C
  { id: "CV", name: "Kabo-Verde", nameEn: "Cabo Verde", capital: "Praya", lat: 16.5388, lng: -23.0418, population: "556,000", flag: "🇨🇻", region: "Afrika" },
  { id: "KH", name: "Kambodja", nameEn: "Cambodia", capital: "Pnompen", lat: 12.5657, lng: 104.9910, population: "16,700,000", flag: "🇰🇭", region: "Osiyo" },
  { id: "CM", name: "Kamerun", nameEn: "Cameroon", capital: "Yaunde", lat: 7.3697, lng: 12.3547, population: "26,000,000", flag: "🇨🇲", region: "Afrika" },
  { id: "CA", name: "Kanada", nameEn: "Canada", capital: "Ottava", lat: 56.1304, lng: -106.3468, population: "38,000,000", flag: "🇨🇦", region: "Shimoliy Amerika" },
  { id: "CF", name: "Markaziy Afrika Respublikasi", nameEn: "Central African Republic", capital: "Bangi", lat: 6.6111, lng: 20.9394, population: "4,800,000", flag: "🇨🇫", region: "Afrika" },
  { id: "TD", name: "Chad", nameEn: "Chad", capital: "Njamena", lat: 15.4542, lng: 18.7322, population: "16,000,000", flag: "🇹🇩", region: "Afrika" },
  { id: "CL", name: "Chili", nameEn: "Chile", capital: "Santyago", lat: -35.6751, lng: -71.5430, population: "19,000,000", flag: "🇨🇱", region: "Janubiy Amerika" },
  { id: "CN", name: "Xitoy", nameEn: "China", capital: "Pekin", lat: 35.8617, lng: 104.1954, population: "1,400,000,000", flag: "🇨🇳", region: "Osiyo" },
  { id: "CO", name: "Kolumbiya", nameEn: "Colombia", capital: "Bogota", lat: 4.5709, lng: -74.2973, population: "50,000,000", flag: "🇨🇴", region: "Janubiy Amerika" },
  { id: "KM", name: "Komor orollari", nameEn: "Comoros", capital: "Moroni", lat: -11.6455, lng: 43.3333, population: "870,000", flag: "🇰🇲", region: "Afrika" },
  { id: "CG", name: "Kongo", nameEn: "Congo", capital: "Brazzavil", lat: -0.2280, lng: 15.8277, population: "5,500,000", flag: "🇨🇬", region: "Afrika" },
  { id: "CD", name: "Kongo DR", nameEn: "DR Congo", capital: "Kinshasa", lat: -4.0383, lng: 21.7587, population: "90,000,000", flag: "🇨🇩", region: "Afrika" },
  { id: "CR", name: "Kosta-Rika", nameEn: "Costa Rica", capital: "San-Xose", lat: 9.7489, lng: -83.7534, population: "5,100,000", flag: "🇨🇷", region: "Markaziy Amerika" },
  { id: "CI", name: "Kot-d'Ivuar", nameEn: "Côte d'Ivoire", capital: "Yamusukro", lat: 7.5400, lng: -5.5471, population: "26,000,000", flag: "🇨🇮", region: "Afrika" },
  { id: "HR", name: "Xorvatiya", nameEn: "Croatia", capital: "Zagreb", lat: 45.1000, lng: 15.2000, population: "4,100,000", flag: "🇭🇷", region: "Yevropa" },
  { id: "CU", name: "Kuba", nameEn: "Cuba", capital: "Gavana", lat: 21.5218, lng: -77.7812, population: "11,300,000", flag: "🇨🇺", region: "Karib" },
  { id: "CY", name: "Kipr", nameEn: "Cyprus", capital: "Nikosiya", lat: 35.1264, lng: 33.4299, population: "1,200,000", flag: "🇨🇾", region: "Yevropa" },
  { id: "CZ", name: "Chexiya", nameEn: "Czechia", capital: "Praga", lat: 49.8175, lng: 15.4730, population: "10,700,000", flag: "🇨🇿", region: "Yevropa" },
  
  // D
  { id: "DK", name: "Daniya", nameEn: "Denmark", capital: "Kopengagen", lat: 56.2639, lng: 9.5018, population: "5,800,000", flag: "🇩🇰", region: "Yevropa" },
  { id: "DJ", name: "Jibuti", nameEn: "Djibouti", capital: "Jibuti", lat: 11.8251, lng: 42.5903, population: "988,000", flag: "🇩🇯", region: "Afrika" },
  { id: "DM", name: "Dominika", nameEn: "Dominica", capital: "Rozo", lat: 15.4150, lng: -61.3710, population: "72,000", flag: "🇩🇲", region: "Karib" },
  { id: "DO", name: "Dominikan Respublikasi", nameEn: "Dominican Republic", capital: "Santo Domingo", lat: 18.7357, lng: -70.1627, population: "10,800,000", flag: "🇩🇴", region: "Karib" },
  
  // E
  { id: "EC", name: "Ekvador", nameEn: "Ecuador", capital: "Kito", lat: -1.8312, lng: -78.1834, population: "17,600,000", flag: "🇪🇨", region: "Janubiy Amerika" },
  { id: "EG", name: "Misr", nameEn: "Egypt", capital: "Qohira", lat: 26.8206, lng: 30.8025, population: "102,000,000", flag: "🇪🇬", region: "Afrika" },
  { id: "SV", name: "Salvador", nameEn: "El Salvador", capital: "San-Salvador", lat: 13.7942, lng: -88.8965, population: "6,500,000", flag: "🇸🇻", region: "Markaziy Amerika" },
  { id: "GQ", name: "Ekvatorial Gvineya", nameEn: "Equatorial Guinea", capital: "Malabo", lat: 1.6508, lng: 10.2679, population: "1,400,000", flag: "🇬🇶", region: "Afrika" },
  { id: "ER", name: "Eritreya", nameEn: "Eritrea", capital: "Asmera", lat: 15.1794, lng: 39.7823, population: "3,600,000", flag: "🇪🇷", region: "Afrika" },
  { id: "EE", name: "Estoniya", nameEn: "Estonia", capital: "Tallin", lat: 58.5953, lng: 25.0136, population: "1,300,000", flag: "🇪🇪", region: "Yevropa" },
  { id: "SZ", name: "Svazilend", nameEn: "Eswatini", capital: "Mbabane", lat: -26.5225, lng: 31.4659, population: "1,160,000", flag: "🇸🇿", region: "Afrika" },
  { id: "ET", name: "Efiopiya", nameEn: "Ethiopia", capital: "Addis-Abeba", lat: 9.1450, lng: 40.4897, population: "115,000,000", flag: "🇪🇹", region: "Afrika" },
  
  // F
  { id: "FJ", name: "Fiji", nameEn: "Fiji", capital: "Suva", lat: -17.7134, lng: 178.0650, population: "896,000", flag: "🇫🇯", region: "Okeaniya" },
  { id: "FI", name: "Finlyandiya", nameEn: "Finland", capital: "Xelsinki", lat: 61.9241, lng: 25.7482, population: "5,500,000", flag: "🇫🇮", region: "Yevropa" },
  { id: "FR", name: "Fransiya", nameEn: "France", capital: "Parij", lat: 46.2276, lng: 2.2137, population: "67,000,000", flag: "🇫🇷", region: "Yevropa" },
  
  // G
  { id: "GA", name: "Gabon", nameEn: "Gabon", capital: "Librevil", lat: -0.8037, lng: 11.6094, population: "2,200,000", flag: "🇬🇦", region: "Afrika" },
  { id: "GM", name: "Gambiya", nameEn: "Gambia", capital: "Banjul", lat: 13.4432, lng: -15.3101, population: "2,400,000", flag: "🇬🇲", region: "Afrika" },
  { id: "GE", name: "Gruziya", nameEn: "Georgia", capital: "Tbilisi", lat: 42.3154, lng: 43.3569, population: "3,700,000", flag: "🇬🇪", region: "Osiyo" },
  { id: "DE", name: "Germaniya", nameEn: "Germany", capital: "Berlin", lat: 51.1657, lng: 10.4515, population: "83,000,000", flag: "🇩🇪", region: "Yevropa" },
  { id: "GH", name: "Gana", nameEn: "Ghana", capital: "Akkra", lat: 7.9465, lng: -1.0232, population: "31,000,000", flag: "🇬🇭", region: "Afrika" },
  { id: "GR", name: "Gretsiya", nameEn: "Greece", capital: "Afina", lat: 39.0742, lng: 21.8243, population: "10,400,000", flag: "🇬🇷", region: "Yevropa" },
  { id: "GD", name: "Grenada", nameEn: "Grenada", capital: "Sent George's", lat: 12.1165, lng: -61.6790, population: "112,000", flag: "🇬🇩", region: "Karib" },
  { id: "GT", name: "Gvatemala", nameEn: "Guatemala", capital: "Gvatemala", lat: 15.7835, lng: -90.2308, population: "17,900,000", flag: "🇬🇹", region: "Markaziy Amerika" },
  { id: "GN", name: "Gvineya", nameEn: "Guinea", capital: "Konakri", lat: 9.9456, lng: -9.6966, population: "13,100,000", flag: "🇬🇳", region: "Afrika" },
  { id: "GW", name: "Gvineya-Bisau", nameEn: "Guinea-Bissau", capital: "Bisau", lat: 11.8037, lng: -15.1804, population: "2,000,000", flag: "🇬🇼", region: "Afrika" },
  { id: "GY", name: "Gayana", nameEn: "Guyana", capital: "Jorjtaun", lat: 4.8604, lng: -58.9302, population: "787,000", flag: "🇬🇾", region: "Janubiy Amerika" },
  
  // H
  { id: "HT", name: "Gaiti", nameEn: "Haiti", capital: "Port-o-Prens", lat: 18.9712, lng: -72.2852, population: "11,400,000", flag: "🇭🇹", region: "Karib" },
  { id: "HN", name: "Gonduras", nameEn: "Honduras", capital: "Tegusigalpa", lat: 15.2000, lng: -86.2419, population: "9,900,000", flag: "🇭🇳", region: "Markaziy Amerika" },
  { id: "HU", name: "Vengriya", nameEn: "Hungary", capital: "Budapesht", lat: 47.1625, lng: 19.5033, population: "9,700,000", flag: "🇭🇺", region: "Yevropa" },
  
  // I
  { id: "IS", name: "Islandiya", nameEn: "Iceland", capital: "Reykyavik", lat: 64.9631, lng: -19.0208, population: "366,000", flag: "🇮🇸", region: "Yevropa" },
  { id: "IN", name: "Hindiston", nameEn: "India", capital: "Dehli", lat: 20.5937, lng: 78.9629, population: "1,380,000,000", flag: "🇮🇳", region: "Osiyo" },
  { id: "ID", name: "Indoneziya", nameEn: "Indonesia", capital: "Jakarta", lat: -0.7893, lng: 113.9213, population: "273,000,000", flag: "🇮🇩", region: "Osiyo" },
  { id: "IR", name: "Eron", nameEn: "Iran", capital: "Tehron", lat: 32.4279, lng: 53.6880, population: "84,000,000", flag: "🇮🇷", region: "O'rta Sharq" },
  { id: "IQ", name: "Iroq", nameEn: "Iraq", capital: "Bag'dod", lat: 33.2232, lng: 43.6793, population: "40,000,000", flag: "🇮🇶", region: "O'rta Sharq" },
  { id: "IE", name: "Irlandiya", nameEn: "Ireland", capital: "Dublin", lat: 53.1424, lng: -7.6921, population: "5,000,000", flag: "🇮🇪", region: "Yevropa" },
  { id: "IL", name: "Isroil", nameEn: "Israel", capital: "Quddus", lat: 31.0461, lng: 34.8516, population: "9,300,000", flag: "🇮🇱", region: "O'rta Sharq" },
  { id: "IT", name: "Italiya", nameEn: "Italy", capital: "Rim", lat: 41.8719, lng: 12.5674, population: "60,000,000", flag: "🇮🇹", region: "Yevropa" },
  
  // J
  { id: "JM", name: "Yamayka", nameEn: "Jamaica", capital: "Kingston", lat: 18.1096, lng: -77.2975, population: "2,960,000", flag: "🇯🇲", region: "Karib" },
  { id: "JP", name: "Yaponiya", nameEn: "Japan", capital: "Tokio", lat: 35.6762, lng: 139.6503, population: "125,000,000", flag: "🇯🇵", region: "Osiyo" },
  { id: "JO", name: "Iordaniya", nameEn: "Jordan", capital: "Ammon", lat: 30.5852, lng: 36.2384, population: "10,200,000", flag: "🇯🇴", region: "O'rta Sharq" },
  
  // K
  { id: "KZ", name: "Qozog'iston", nameEn: "Kazakhstan", capital: "Nur-Sulton", lat: 48.0196, lng: 66.9237, population: "18,800,000", flag: "🇰🇿", region: "Markaziy Osiyo" },
  { id: "KE", name: "Keniya", nameEn: "Kenya", capital: "Nayrobi", lat: -0.0236, lng: 37.9062, population: "54,000,000", flag: "🇰🇪", region: "Afrika" },
  { id: "KI", name: "Kiribati", nameEn: "Kiribati", capital: "Tarava", lat: -3.3704, lng: -168.7340, population: "119,000", flag: "🇰🇮", region: "Okeaniya" },
  { id: "KP", name: "Shimoliy Koreya", nameEn: "North Korea", capital: "Pxenyan", lat: 40.3399, lng: 127.5101, population: "25,800,000", flag: "🇰🇵", region: "Osiyo" },
  { id: "KR", name: "Janubiy Koreya", nameEn: "South Korea", capital: "Seul", lat: 35.9078, lng: 127.7669, population: "51,700,000", flag: "🇰🇷", region: "Osiyo" },
  { id: "KW", name: "Kuvayt", nameEn: "Kuwait", capital: "Kuvayt", lat: 29.3117, lng: 47.4818, population: "4,200,000", flag: "🇰🇼", region: "O'rta Sharq" },
  { id: "KG", name: "Qirg'iziston", nameEn: "Kyrgyzstan", capital: "Bishkek", lat: 41.2044, lng: 74.7661, population: "6,500,000", flag: "🇰🇬", region: "Markaziy Osiyo" },
  
  // L
  { id: "LA", name: "Laos", nameEn: "Laos", capital: "Ventyan", lat: 19.8563, lng: 102.4955, population: "7,300,000", flag: "🇱🇦", region: "Osiyo" },
  { id: "LV", name: "Latviya", nameEn: "Latvia", capital: "Riga", lat: 56.8796, lng: 24.6032, population: "1,900,000", flag: "🇱🇻", region: "Yevropa" },
  { id: "LB", name: "Livan", nameEn: "Lebanon", capital: "Bayrut", lat: 33.8547, lng: 35.8623, population: "6,800,000", flag: "🇱🇧", region: "O'rta Sharq" },
  { id: "LS", name: "Lesoto", nameEn: "Lesotho", capital: "Maseru", lat: -29.6100, lng: 28.2336, population: "2,100,000", flag: "🇱🇸", region: "Afrika" },
  { id: "LR", name: "Liberiya", nameEn: "Liberia", capital: "Monroviya", lat: 6.4281, lng: -9.4295, population: "5,000,000", flag: "🇱🇷", region: "Afrika" },
  { id: "LY", name: "Liviya", nameEn: "Libya", capital: "Tripoli", lat: 26.3351, lng: 17.2283, population: "6,900,000", flag: "🇱🇾", region: "Afrika" },
  { id: "LI", name: "Lixtenshteyn", nameEn: "Liechtenstein", capital: "Vaduts", lat: 47.1660, lng: 9.5554, population: "38,000", flag: "🇱🇮", region: "Yevropa" },
  { id: "LT", name: "Litva", nameEn: "Lithuania", capital: "Vilnyus", lat: 55.1694, lng: 23.8813, population: "2,800,000", flag: "🇱🇹", region: "Yevropa" },
  { id: "LU", name: "Lyuksemburg", nameEn: "Luxembourg", capital: "Lyuksemburg", lat: 49.8153, lng: 6.1296, population: "626,000", flag: "🇱🇺", region: "Yevropa" },
  
  // M
  { id: "MG", name: "Madagaskar", nameEn: "Madagascar", capital: "Antananarivu", lat: -18.7669, lng: 46.8691, population: "27,700,000", flag: "🇲🇬", region: "Afrika" },
  { id: "MW", name: "Malavi", nameEn: "Malawi", capital: "Lilongve", lat: -13.2543, lng: 34.3015, population: "19,100,000", flag: "🇲🇼", region: "Afrika" },
  { id: "MY", name: "Malayziya", nameEn: "Malaysia", capital: "Kuala-Lumpur", lat: 4.2105, lng: 101.9758, population: "32,000,000", flag: "🇲🇾", region: "Osiyo" },
  { id: "MV", name: "Maldiv", nameEn: "Maldives", capital: "Male", lat: 3.2028, lng: 73.2207, population: "541,000", flag: "🇲🇻", region: "Osiyo" },
  { id: "ML", name: "Mali", nameEn: "Mali", capital: "Bamako", lat: 17.5707, lng: -3.9962, population: "20,200,000", flag: "🇲🇱", region: "Afrika" },
  { id: "MT", name: "Malta", nameEn: "Malta", capital: "Valletta", lat: 35.9375, lng: 14.3754, population: "514,000", flag: "🇲🇹", region: "Yevropa" },
  { id: "MH", name: "Marshall orollari", nameEn: "Marshall Islands", capital: "Majuro", lat: 7.1315, lng: 171.1845, population: "59,000", flag: "🇲🇭", region: "Okeaniya" },
  { id: "MR", name: "Mavritaniya", nameEn: "Mauritania", capital: "Nuakshot", lat: 21.0079, lng: -10.9408, population: "4,600,000", flag: "🇲🇷", region: "Afrika" },
  { id: "MU", name: "Mavrikiy", nameEn: "Mauritius", capital: "Port-Lui", lat: -20.3484, lng: 57.5522, population: "1,270,000", flag: "🇲🇺", region: "Afrika" },
  { id: "MX", name: "Meksika", nameEn: "Mexico", capital: "Mexiko", lat: 23.6345, lng: -102.5528, population: "128,000,000", flag: "🇲🇽", region: "Shimoliy Amerika" },
  { id: "FM", name: "Mikroneziya", nameEn: "Micronesia", capital: "Palikir", lat: 6.9147, lng: 158.1610, population: "115,000", flag: "🇫🇲", region: "Okeaniya" },
  { id: "MD", name: "Moldova", nameEn: "Moldova", capital: "Kishinyov", lat: 47.4116, lng: 28.3699, population: "2,600,000", flag: "🇲🇩", region: "Yevropa" },
  { id: "MC", name: "Monako", nameEn: "Monaco", capital: "Monako", lat: 43.7384, lng: 7.4246, population: "39,000", flag: "🇲🇨", region: "Yevropa" },
  { id: "MN", name: "Mo'g'uliston", nameEn: "Mongolia", capital: "Ulan-Bator", lat: 46.8625, lng: 103.8467, population: "3,300,000", flag: "🇲🇳", region: "Osiyo" },
  { id: "ME", name: "Chernogoriya", nameEn: "Montenegro", capital: "Podgoritsa", lat: 42.7087, lng: 19.3744, population: "628,000", flag: "🇲🇪", region: "Yevropa" },
  { id: "MA", name: "Marokash", nameEn: "Morocco", capital: "Rabot", lat: 31.7917, lng: -7.0926, population: "37,000,000", flag: "🇲🇦", region: "Afrika" },
  { id: "MZ", name: "Mozambik", nameEn: "Mozambique", capital: "Maputu", lat: -18.6657, lng: 35.5296, population: "31,000,000", flag: "🇲🇿", region: "Afrika" },
  { id: "MM", name: "Myanma", nameEn: "Myanmar", capital: "Naypyidaw", lat: 21.9162, lng: 95.9560, population: "54,000,000", flag: "🇲🇲", region: "Osiyo" },
  
  // N
  { id: "NA", name: "Namibiya", nameEn: "Namibia", capital: "Vindxuk", lat: -22.9576, lng: 18.4904, population: "2,500,000", flag: "🇳🇦", region: "Afrika" },
  { id: "NR", name: "Nauru", nameEn: "Nauru", capital: "Yaren", lat: -0.5228, lng: 166.9315, population: "11,000", flag: "🇳🇷", region: "Okeaniya" },
  { id: "NP", name: "Nepal", nameEn: "Nepal", capital: "Katmandu", lat: 28.3949, lng: 84.1240, population: "29,000,000", flag: "🇳🇵", region: "Osiyo" },
  { id: "NL", name: "Niderlandiya", nameEn: "Netherlands", capital: "Amsterdam", lat: 52.1326, lng: 5.2913, population: "17,400,000", flag: "🇳🇱", region: "Yevropa" },
  { id: "NZ", name: "Yangi Zelandiya", nameEn: "New Zealand", capital: "Vellington", lat: -40.9006, lng: 174.8860, population: "5,000,000", flag: "🇳🇿", region: "Okeaniya" },
  { id: "NI", name: "Nikaragua", nameEn: "Nicaragua", capital: "Managua", lat: 12.8654, lng: -85.2072, population: "6,600,000", flag: "🇳🇮", region: "Markaziy Amerika" },
  { id: "NE", name: "Niger", nameEn: "Niger", capital: "Niamey", lat: 17.6078, lng: 8.0817, population: "24,000,000", flag: "🇳🇪", region: "Afrika" },
  { id: "NG", name: "Nigeriya", nameEn: "Nigeria", capital: "Abuja", lat: 9.0820, lng: 8.6753, population: "206,000,000", flag: "🇳🇬", region: "Afrika" },
  { id: "NO", name: "Norvegiya", nameEn: "Norway", capital: "Oslo", lat: 60.4720, lng: 8.4689, population: "5,400,000", flag: "🇳🇴", region: "Yevropa" },
  
  // O
  { id: "OM", name: "Ummon", nameEn: "Oman", capital: "Maskat", lat: 21.4735, lng: 55.9754, population: "5,000,000", flag: "🇴🇲", region: "O'rta Sharq" },
  
  // P
  { id: "PK", name: "Pokiston", nameEn: "Pakistan", capital: "Islomobod", lat: 30.3753, lng: 69.3451, population: "220,000,000", flag: "🇵🇰", region: "Osiyo" },
  { id: "PW", name: "Palau", nameEn: "Palau", capital: "Ngerulmud", lat: 7.5150, lng: 134.5825, population: "18,000", flag: "🇵🇼", region: "Okeaniya" },
  { id: "PS", name: "Falastin", nameEn: "Palestine", capital: "Ramalla", lat: 31.9522, lng: 35.2332, population: "5,100,000", flag: "🇵🇸", region: "O'rta Sharq" },
  { id: "PA", name: "Panama", nameEn: "Panama", capital: "Panama", lat: 8.5380, lng: -80.7821, population: "4,300,000", flag: "🇵🇦", region: "Markaziy Amerika" },
  { id: "PG", name: "Papua-Yangi Gvineya", nameEn: "Papua New Guinea", capital: "Port Moresbi", lat: -6.3150, lng: 143.9555, population: "8,900,000", flag: "🇵🇬", region: "Okeaniya" },
  { id: "PY", name: "Paragvay", nameEn: "Paraguay", capital: "Asunson", lat: -23.4425, lng: -58.4438, population: "7,100,000", flag: "🇵🇾", region: "Janubiy Amerika" },
  { id: "PE", name: "Peru", nameEn: "Peru", capital: "Lima", lat: -9.1900, lng: -75.0152, population: "33,000,000", flag: "🇵🇪", region: "Janubiy Amerika" },
  { id: "PH", name: "Filippin", nameEn: "Philippines", capital: "Manila", lat: 12.8797, lng: 121.7740, population: "109,000,000", flag: "🇵🇭", region: "Osiyo" },
  { id: "PL", name: "Polsha", nameEn: "Poland", capital: "Varshava", lat: 51.9194, lng: 19.1451, population: "38,000,000", flag: "🇵🇱", region: "Yevropa" },
  { id: "PT", name: "Portugaliya", nameEn: "Portugal", capital: "Lissabon", lat: 39.3999, lng: -8.2245, population: "10,300,000", flag: "🇵🇹", region: "Yevropa" },
  
  // Q
  { id: "QA", name: "Qatar", nameEn: "Qatar", capital: "Doha", lat: 25.3548, lng: 51.1839, population: "2,800,000", flag: "🇶🇦", region: "O'rta Sharq" },
  
  // R
  { id: "RO", name: "Ruminiya", nameEn: "Romania", capital: "Buxarest", lat: 45.9432, lng: 24.9668, population: "19,300,000", flag: "🇷🇴", region: "Yevropa" },
  { id: "RU", name: "Rossiya", nameEn: "Russia", capital: "Moskva", lat: 61.5240, lng: 105.3188, population: "146,000,000", flag: "🇷🇺", region: "Yevropa/Osiyo" },
  { id: "RW", name: "Ruanda", nameEn: "Rwanda", capital: "Kigali", lat: -1.9403, lng: 29.8739, population: "13,000,000", flag: "🇷🇼", region: "Afrika" },
  
  // S
  { id: "KN", name: "Sent-Kits va Nevis", nameEn: "Saint Kitts and Nevis", capital: "Baster", lat: 17.3578, lng: -62.7830, population: "53,000", flag: "🇰🇳", region: "Karib" },
  { id: "LC", name: "Sent-Lusiya", nameEn: "Saint Lucia", capital: "Kastris", lat: 13.9094, lng: -60.9789, population: "184,000", flag: "🇱🇨", region: "Karib" },
  { id: "VC", name: "Sent-Vinsent va Grenadin", nameEn: "Saint Vincent and the Grenadines", capital: "Kingstaun", lat: 12.9843, lng: -61.2872, population: "111,000", flag: "🇻🇨", region: "Karib" },
  { id: "WS", name: "Samoa", nameEn: "Samoa", capital: "Apia", lat: -13.7590, lng: -172.1046, population: "198,000", flag: "🇼🇸", region: "Okeaniya" },
  { id: "SM", name: "San-Marino", nameEn: "San Marino", capital: "San-Marino", lat: 43.9424, lng: 12.4578, population: "34,000", flag: "🇸🇲", region: "Yevropa" },
  { id: "ST", name: "San-Tome va Prinsipi", nameEn: "Sao Tome and Principe", capital: "San-Tome", lat: 0.1864, lng: 6.6131, population: "219,000", flag: "🇸🇹", region: "Afrika" },
  { id: "SA", name: "Saudiya Arabistoni", nameEn: "Saudi Arabia", capital: "Ar-Riyod", lat: 23.8859, lng: 45.0792, population: "35,000,000", flag: "🇸🇦", region: "O'rta Sharq" },
  { id: "SN", name: "Senegal", nameEn: "Senegal", capital: "Dakar", lat: 14.4974, lng: -14.4524, population: "16,700,000", flag: "🇸🇳", region: "Afrika" },
  { id: "RS", name: "Serbiya", nameEn: "Serbia", capital: "Belgrad", lat: 44.0165, lng: 21.0059, population: "7,000,000", flag: "🇷🇸", region: "Yevropa" },
  { id: "SC", name: "Seyshel orollari", nameEn: "Seychelles", capital: "Viktoriya", lat: -4.6796, lng: 55.4920, population: "98,000", flag: "🇸🇨", region: "Afrika" },
  { id: "SL", name: "Syerra-Leone", nameEn: "Sierra Leone", capital: "Fritaun", lat: 8.4606, lng: -11.7799, population: "8,000,000", flag: "🇸🇱", region: "Afrika" },
  { id: "SG", name: "Singapur", nameEn: "Singapore", capital: "Singapur", lat: 1.3521, lng: 103.8198, population: "5,700,000", flag: "🇸🇬", region: "Osiyo" },
  { id: "SK", name: "Slovakiya", nameEn: "Slovakia", capital: "Bratislava", lat: 48.6690, lng: 19.6990, population: "5,460,000", flag: "🇸🇰", region: "Yevropa" },
  { id: "SI", name: "Sloveniya", nameEn: "Slovenia", capital: "Lyublyana", lat: 46.1512, lng: 14.9955, population: "2,100,000", flag: "🇸🇮", region: "Yevropa" },
  { id: "SB", name: "Solomon orollari", nameEn: "Solomon Islands", capital: "Xoniara", lat: -9.6457, lng: 160.1562, population: "687,000", flag: "🇸🇧", region: "Okeaniya" },
  { id: "SO", name: "Somali", nameEn: "Somalia", capital: "Mogadisho", lat: 5.1521, lng: 46.1996, population: "15,900,000", flag: "🇸🇴", region: "Afrika" },
  { id: "ZA", name: "Janubiy Afrika", nameEn: "South Africa", capital: "Pretoriya", lat: -30.5595, lng: 22.9375, population: "60,000,000", flag: "🇿🇦", region: "Afrika" },
  { id: "SS", name: "Janubiy Sudan", nameEn: "South Sudan", capital: "Juba", lat: 6.8770, lng: 31.3070, population: "11,000,000", flag: "🇸🇸", region: "Afrika" },
  { id: "ES", name: "Ispaniya", nameEn: "Spain", capital: "Madrid", lat: 40.4637, lng: -3.7492, population: "47,000,000", flag: "🇪🇸", region: "Yevropa" },
  { id: "LK", name: "Shri-Lanka", nameEn: "Sri Lanka", capital: "Kolombo", lat: 7.8731, lng: 80.7718, population: "21,400,000", flag: "🇱🇰", region: "Osiyo" },
  { id: "SD", name: "Sudan", nameEn: "Sudan", capital: "Xartum", lat: 12.8628, lng: 30.2176, population: "44,000,000", flag: "🇸🇩", region: "Afrika" },
  { id: "SR", name: "Surinam", nameEn: "Suriname", capital: "Paramaribo", lat: 3.9193, lng: -56.0278, population: "587,000", flag: "🇸🇷", region: "Janubiy Amerika" },
  { id: "SE", name: "Shvetsiya", nameEn: "Sweden", capital: "Stokgolm", lat: 60.1282, lng: 18.6435, population: "10,400,000", flag: "🇸🇪", region: "Yevropa" },
  { id: "CH", name: "Shveytsariya", nameEn: "Switzerland", capital: "Bern", lat: 46.8182, lng: 8.2275, population: "8,600,000", flag: "🇨🇭", region: "Yevropa" },
  { id: "SY", name: "Suriya", nameEn: "Syria", capital: "Damashq", lat: 34.8021, lng: 38.9968, population: "17,500,000", flag: "🇸🇾", region: "O'rta Sharq" },
  
  // T
  { id: "TW", name: "Tayvan", nameEn: "Taiwan", capital: "Taypey", lat: 23.6978, lng: 120.9605, population: "23,800,000", flag: "🇹🇼", region: "Osiyo" },
  { id: "TJ", name: "Tojikiston", nameEn: "Tajikistan", capital: "Dushanbe", lat: 38.5598, lng: 68.7870, population: "9,500,000", flag: "🇹🇯", region: "Markaziy Osiyo" },
  { id: "TZ", name: "Tanzaniya", nameEn: "Tanzania", capital: "Dodoma", lat: -6.3690, lng: 34.8888, population: "60,000,000", flag: "🇹🇿", region: "Afrika" },
  { id: "TH", name: "Tailand", nameEn: "Thailand", capital: "Bangkok", lat: 15.8700, lng: 100.9925, population: "69,000,000", flag: "🇹🇭", region: "Osiyo" },
  { id: "TL", name: "Timor-Leste", nameEn: "Timor-Leste", capital: "Dili", lat: -8.8742, lng: 125.7275, population: "1,320,000", flag: "🇹🇱", region: "Osiyo" },
  { id: "TG", name: "Togo", nameEn: "Togo", capital: "Lome", lat: 8.6195, lng: 0.8248, population: "8,300,000", flag: "🇹🇬", region: "Afrika" },
  { id: "TO", name: "Tonga", nameEn: "Tonga", capital: "Nukualofa", lat: -21.1790, lng: -175.1982, population: "106,000", flag: "🇹🇴", region: "Okeaniya" },
  { id: "TT", name: "Trinidad va Tobago", nameEn: "Trinidad and Tobago", capital: "Port-of-Speyn", lat: 10.6918, lng: -61.2225, population: "1,400,000", flag: "🇹🇹", region: "Karib" },
  { id: "TN", name: "Tunis", nameEn: "Tunisia", capital: "Tunis", lat: 33.8869, lng: 9.5375, population: "11,800,000", flag: "🇹🇳", region: "Afrika" },
  { id: "TR", name: "Turkiya", nameEn: "Turkey", capital: "Ankara", lat: 38.9637, lng: 35.2433, population: "84,000,000", flag: "🇹🇷", region: "Yevropa/Osiyo" },
  { id: "TM", name: "Turkmaniston", nameEn: "Turkmenistan", capital: "Ashxobod", lat: 38.9697, lng: 59.5563, population: "6,000,000", flag: "🇹🇲", region: "Markaziy Osiyo" },
  { id: "TV", name: "Tuvalu", nameEn: "Tuvalu", capital: "Funafuti", lat: -7.1095, lng: 177.6493, population: "12,000", flag: "🇹🇻", region: "Okeaniya" },
  
  // U
  { id: "UG", name: "Uganda", nameEn: "Uganda", capital: "Kampala", lat: 1.3733, lng: 32.2903, population: "45,700,000", flag: "🇺🇬", region: "Afrika" },
  { id: "UA", name: "Ukraina", nameEn: "Ukraine", capital: "Kiyev", lat: 48.3794, lng: 31.1656, population: "41,000,000", flag: "🇺🇦", region: "Yevropa" },
  { id: "AE", name: "Birlashgan Arab Amirliklari", nameEn: "United Arab Emirates", capital: "Dubay", lat: 23.4241, lng: 53.8478, population: "9,900,000", flag: "🇦🇪", region: "O'rta Sharq" },
  { id: "GB", name: "Buyuk Britaniya", nameEn: "United Kingdom", capital: "London", lat: 55.3781, lng: -3.4360, population: "67,000,000", flag: "🇬🇧", region: "Yevropa" },
  { id: "US", name: "AQSh", nameEn: "United States", capital: "Vashington", lat: 37.0902, lng: -95.7129, population: "331,000,000", flag: "🇺🇸", region: "Shimoliy Amerika" },
  { id: "UY", name: "Urugvay", nameEn: "Uruguay", capital: "Montevideo", lat: -32.5228, lng: -55.7658, population: "3,500,000", flag: "🇺🇾", region: "Janubiy Amerika" },
  { id: "UZ", name: "O'zbekiston", nameEn: "Uzbekistan", capital: "Toshkent", lat: 41.2995, lng: 69.2401, population: "35,000,000", flag: "🇺🇿", region: "Markaziy Osiyo" },
  
  // V
  { id: "VU", name: "Vanuatu", nameEn: "Vanuatu", capital: "Port-Vila", lat: -15.3767, lng: 166.9592, population: "307,000", flag: "🇻🇺", region: "Okeaniya" },
  { id: "VA", name: "Vatikan", nameEn: "Vatican City", capital: "Vatikan", lat: 41.9029, lng: 12.4534, population: "800", flag: "🇻🇦", region: "Yevropa" },
  { id: "VE", name: "Venesuela", nameEn: "Venezuela", capital: "Karakas", lat: 6.4238, lng: -66.5897, population: "28,000,000", flag: "🇻🇪", region: "Janubiy Amerika" },
  { id: "VN", name: "Vyetnam", nameEn: "Vietnam", capital: "Xanoy", lat: 14.0583, lng: 108.2772, population: "97,000,000", flag: "🇻🇳", region: "Osiyo" },
  
  // Y
  { id: "YE", name: "Yaman", nameEn: "Yemen", capital: "Sano", lat: 15.5527, lng: 48.5164, population: "29,000,000", flag: "🇾🇪", region: "O'rta Sharq" },
  
  // Z
  { id: "ZM", name: "Zambiya", nameEn: "Zambia", capital: "Lusaka", lat: -13.1339, lng: 27.8493, population: "18,400,000", flag: "🇿🇲", region: "Afrika" },
  { id: "ZW", name: "Zimbabve", nameEn: "Zimbabwe", capital: "Xarare", lat: -19.0154, lng: 29.1549, population: "14,900,000", flag: "🇿🇼", region: "Afrika" }
];

// Xarita kontrolleri
const MapController = ({ selectedCountry }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedCountry) {
      map.flyTo([selectedCountry.lat, selectedCountry.lng], 5, { duration: 1.5 });
    }
  }, [selectedCountry, map]);
  
  return null;
};

const SimpleMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [search, setSearch] = useState('');
  const mapRef = useRef(null);

  const selectCountry = (country) => {
    setSelectedCountry(country);
  };

  const resetView = () => {
    setSelectedCountry(null);
    setSearch('');
    if (mapRef.current) {
      mapRef.current.flyTo([41.2995, 69.2401], 4, { duration: 1.5 });
    }
  };

  // Qidiruv - o'zbek va ingliz nomlarida
  const filteredCountries = allCountries.filter(c => {
    const searchLower = search.toLowerCase().trim();
    if (searchLower === '') return true;
    return c.name.toLowerCase().includes(searchLower) || 
           c.nameEn.toLowerCase().includes(searchLower) ||
           c.capital.toLowerCase().includes(searchLower);
  });

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && filteredCountries.length > 0) {
      selectCountry(filteredCountries[0]);
      setSearch('');
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <style>{`
        .panel { position: absolute; left: 20px; top: 20px; width: 340px; max-height: calc(100vh - 40px); background: rgba(0,0,0,0.92); backdrop-filter: blur(20px); border-radius: 24px; z-index: 1000; border: 1px solid rgba(255,255,255,0.15); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .panel-header { padding: 16px 18px; background: rgba(102,126,234,0.2); border-bottom: 1px solid rgba(255,255,255,0.1); color: white; font-weight: 600; display: flex; align-items: center; gap: 10px; position: sticky; top: 0; z-index: 1; }
        .list { max-height: calc(100vh - 100px); overflow-y: auto; padding: 12px; }
        .item { display: flex; align-items: center; gap: 14px; padding: 10px 12px; margin: 4px 0; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .item:hover { background: rgba(102,126,234,0.3); transform: translateX(4px); border-color: rgba(102,126,234,0.4); }
        .item.active { background: linear-gradient(135deg, #667eea, #764ba2); box-shadow: 0 5px 15px rgba(102,126,234,0.3); }
        .flag { font-size: 28px; }
        .name { color: white; font-weight: 600; font-size: 13px; }
        .capital { color: #aaa; font-size: 10px; margin-top: 2px; }
        .region { color: #667eea; font-size: 9px; margin-top: 2px; }
        
        .info { position: absolute; bottom: 20px; right: 20px; width: 340px; max-height: 70vh; overflow-y: auto; background: rgba(0,0,0,0.96); backdrop-filter: blur(20px); border-radius: 20px; padding: 20px; color: white; z-index: 1000; border: 1px solid rgba(255,255,255,0.2); animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        .close { position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.1); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 18px; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
        .close:hover { background: #ff4757; transform: rotate(90deg); }
        .info-flag { font-size: 56px; text-align: center; margin-bottom: 10px; }
        .info-name { text-align: center; font-size: 22px; margin: 10px 0; color: #ffaa00; font-weight: bold; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .label { color: #667eea; font-size: 13px; font-weight: 500; }
        .value { color: white; font-size: 13px; }
        
        .search-box { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); width: 400px; z-index: 1000; }
        .search-box input { width: 100%; padding: 12px 24px; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 50px; color: white; font-size: 14px; text-align: center; outline: none; transition: all 0.3s; }
        .search-box input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.3); }
        .search-box input::placeholder { color: #aaa; }
        
        .reset-btn { position: absolute; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 10px 22px; border-radius: 40px; cursor: pointer; z-index: 1000; transition: all 0.3s; font-size: 13px; font-weight: 500; }
        .reset-btn:hover { background: linear-gradient(135deg, #667eea, #764ba2); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102,126,234,0.3); }
        
        .counter { position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 20px; font-size: 11px; color: #aaa; z-index: 1000; }
        
        .leaflet-container { background: #0a0a1a; }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #667eea; border-radius: 4px; }
        
        @media (max-width: 768px) {
          .panel { left: 10px; top: 70px; width: 280px; max-height: calc(100vh - 80px); }
          .info { bottom: 10px; right: 10px; left: 10px; width: auto; max-height: 50vh; }
          .search-box { top: 10px; width: calc(100% - 40px); }
          .reset-btn { bottom: 10px; left: 10px; padding: 8px 16px; }
          .flag { font-size: 24px; }
          .name { font-size: 12px; }
        }
      `}</style>
      
      {/* Chap panel */}
      <div className="panel">
        <div className="panel-header">
          <span style={{ fontSize: 20 }}>🌍</span>
          <span>Davlatlar</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, background: 'rgba(102,126,234,0.3)', padding: '2px 10px', borderRadius: 20 }}>{filteredCountries.length}</span>
        </div>
        <div className="list">
          {filteredCountries.map(c => (
            <div key={c.id} className={`item ${selectedCountry?.id === c.id ? 'active' : ''}`} onClick={() => selectCountry(c)}>
              <span className="flag">{c.flag}</span>
              <div style={{ flex: 1 }}>
                <div className="name">{c.name}</div>
                <div className="capital">{c.capital}</div>
                <div className="region">{c.region}</div>
              </div>
              <div style={{ fontSize: 18 }}>✈️</div>
            </div>
          ))}
          {filteredCountries.length === 0 && search && (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#aaa' }}>
              🔍 "{search}" bo'yicha hech narsa topilmadi
            </div>
          )}
        </div>
      </div>
      
      {/* Info panel */}
      {selectedCountry && (
        <div className="info">
          <button className="close" onClick={() => setSelectedCountry(null)}>✕</button>
          <div className="info-flag">{selectedCountry.flag}</div>
          <div className="info-name">{selectedCountry.name}</div>
          <div className="row">
            <span className="label">🏛️ Poytaxt:</span>
            <span className="value">{selectedCountry.capital}</span>
          </div>
          <div className="row">
            <span className="label">👥 Aholi:</span>
            <span className="value">{selectedCountry.population}</span>
          </div>
          <div className="row">
            <span className="label">📍 Koordinata:</span>
            <span className="value">{selectedCountry.lat.toFixed(2)}°, {selectedCountry.lng.toFixed(2)}°</span>
          </div>
        </div>
      )}
      
      {/* Xarita */}
      <MapContainer
        center={[41.2995, 69.2401]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
        />
        <MapController selectedCountry={selectedCountry} />
      </MapContainer>
      
      {/* Tugmalar */}
      <button className="reset-btn" onClick={resetView}>
        🌍 Butun Yer
      </button>
      
      {/* Qidiruv */}
      <div className="search-box">
        <input 
          type="text" 
          placeholder="🔍 Davlat nomi bilan qidirish (Sudan, Iran, Turkey, USA, Uzbekistan...)" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleSearchKeyPress}
        />
      </div>
      
      {/* Maslahat */}
      <div className="counter">
        📊 {allCountries.length} ta davlat | 🗺️ Barcha davlatlar qo'shilgan
      </div>
    </div>
  );
};

export default SimpleMap;