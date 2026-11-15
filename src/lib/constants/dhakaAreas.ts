export interface AreaLocation {
  name: string;
  lat: number;
  lng: number;
  zone: string;
}

export const DHAKA_AREAS: AreaLocation[] = [
  { name: "Dhanmondi", lat: 23.7465, lng: 90.3760, zone: "Central West" },
  { name: "Shahbagh (BSMMU / DMCH)", lat: 23.7388, lng: 90.3957, zone: "Central" },
  { name: "Gulshan-1", lat: 23.7808, lng: 90.4172, zone: "North" },
  { name: "Gulshan-2", lat: 23.7925, lng: 90.4149, zone: "North" },
  { name: "Banani", lat: 23.7937, lng: 90.4043, zone: "North" },
  { name: "Uttara Sector 3", lat: 23.8681, lng: 90.3982, zone: "Far North" },
  { name: "Mirpur-10", lat: 23.8071, lng: 90.3686, zone: "North West" },
  { name: "Mohakhali", lat: 23.7779, lng: 90.4057, zone: "Central North" },
  { name: "Badda", lat: 23.7806, lng: 90.4267, zone: "East" },
  { name: "Motijheel", lat: 23.7330, lng: 90.4176, zone: "South Central" },
  { name: "Old Dhaka (Sadarghat)", lat: 23.7099, lng: 90.4071, zone: "South" },
  { name: "Khilgaon", lat: 23.7533, lng: 90.4278, zone: "East" },
  { name: "Mohammadpur", lat: 23.7592, lng: 90.3585, zone: "West" },
];

export const DHAKA_HOSPITALS = [
  {
    name: "Dhaka Medical College Hospital (DMCH)",
    lat: 23.7258,
    lng: 90.3976,
    address: "Secretariat Rd, Dhaka 1000",
  },
  {
    name: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
    lat: 23.7388,
    lng: 90.3957,
    address: "Shahbagh, Dhaka 1000",
  },
  {
    name: "Square Hospital",
    lat: 23.7530,
    lng: 90.3817,
    address: "18/F Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka",
  },
  {
    name: "Evercare Hospital Dhaka",
    lat: 23.8099,
    lng: 90.4312,
    address: "Plot 81, Block E, Bashundhara R/A, Dhaka",
  },
  {
    name: "United Hospital",
    lat: 23.7997,
    lng: 90.4131,
    address: "Plot 15, Rd 71, Gulshan-2, Dhaka 1212",
  },
  {
    name: "BIRDEM General Hospital",
    lat: 23.7410,
    lng: 90.3959,
    address: "122 Kazi Nazrul Islam Ave, Shahbagh, Dhaka",
  },
  {
    name: "National Heart Foundation Hospital",
    lat: 23.8028,
    lng: 90.3592,
    address: "Plot 4, Mirpur-2, Dhaka 1216",
  },
  {
    name: "Kurmitola General Hospital",
    lat: 23.8242,
    lng: 90.4079,
    address: "Dhaka - Mymensingh Hwy, Cantonment, Dhaka",
  },
];
