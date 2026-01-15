/* =========================================================
   NAIROBIFY – GLOBAL CONSTANTS
   Single source of truth for the entire app
   ========================================================= */

/* -----------------------------
   ISSUE CATEGORIES (CITY SERVICES)
-------------------------------- */
export const ISSUE_CATEGORIES = [
  {
    id: "garbage",
    label: "Garbage Not Collected",
    icon: "🗑️",
  },
  {
    id: "roads",
    label: "Potholes / Damaged Roads",
    icon: "🛣️",
  },
  {
    id: "street_lighting",
    label: "Broken Street Lights",
    icon: "💡",
  },
  {
    id: "water",
    label: "Water Outage / Leakage",
    icon: "🚰",
  },
  {
    id: "drainage",
    label: "Blocked Drainage / Flooding",
    icon: "🌧️",
  },
  {
    id: "sewer",
    label: "Sewer Burst / Overflow",
    icon: "🚽",
  },
  {
    id: "illegal_dumping",
    label: "Illegal Dumping",
    icon: "🚯",
  },
  {
    id: "public_property",
    label: "Damaged Public Property",
    icon: "🏢",
  },
  {
    id: "noise",
    label: "Noise Pollution",
    icon: "🔊",
  },
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number]["id"];

/* -----------------------------
   SECURITY & MISSING PERSONS
-------------------------------- */
export const SECURITY_CATEGORIES = [
  {
    id: "theft",
    label: "Theft / Robbery",
    priority: "high",
  },
  {
    id: "assault",
    label: "Assault / Violence",
    priority: "high",
  },
  {
    id: "suspicious_activity",
    label: "Suspicious Activity",
    priority: "medium",
  },
  {
    id: "vandalism",
    label: "Vandalism",
    priority: "medium",
  },
  {
    id: "missing_person",
    label: "Missing Person",
    priority: "critical",
  },
] as const;

/* -----------------------------
   ISSUE STATUS FLOW
-------------------------------- */
export const ISSUE_STATUSES = [
  {
    id: "reported",
    label: "Reported",
    color: "yellow",
  },
  {
    id: "in_progress",
    label: "In Progress",
    color: "blue",
  },
  {
    id: "resolved",
    label: "Resolved",
    color: "green",
  },
] as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[number]["id"];

/* -----------------------------
   NAIROBI COUNTY – ALL WARDS
   (Official 85 wards)
-------------------------------- */
export const NAIROBI_WARDS = [
  // WESTLANDS
  "Kitisuru",
  "Parklands/Highridge",
  "Karura",
  "Kangemi",
  "Mountain View",

  // DAGORETTI
  "Kilimani",
  "Kawangware",
  "Gatina",
  "Kileleshwa",
  "Kabiro",

  // LANG'ATA
  "Karen",
  "Nairobi West",
  "Mugumo-Ini",
  "South C",
  "Nyayo Highrise",

  // KIBRA
  "Laini Saba",
  "Lindi",
  "Makina",
  "Woodley/Kenyatta Golf Course",
  "Sarang'ombe",

  // ROYSAMBU
  "Githurai",
  "Kahawa West",
  "Zimmerman",
  "Roysambu",
  "Kahawa",

  // KASARANI
  "Clay City",
  "Mwiki",
  "Kasarani",
  "Njiru",
  "Ruai",

  // RUARAKA
  "Baba Dogo",
  "Utalii",
  "Mathare North",
  "Lucky Summer",
  "Korogocho",

  // EMBAKASI SOUTH
  "Imara Daima",
  "Kwa Njenga",
  "Kwa Reuben",
  "Pipeline",
  "Kware",

  // EMBAKASI NORTH
  "Kariobangi North",
  "Dandora Area I",
  "Dandora Area II",
  "Dandora Area III",
  "Dandora Area IV",

  // EMBAKASI CENTRAL
  "Kayole North",
  "Kayole Central",
  "Kayole South",
  "Komarock",
  "Matopeni/Spring Valley",

  // EMBAKASI EAST
  "Upper Savanna",
  "Lower Savanna",
  "Embakasi",
  "Utawala",
  "Mihango",

  // EMBAKASI WEST
  "Umoja I",
  "Umoja II",
  "Mowlem",
  "Kariobangi South",

  // MAKADARA
  "Maringo/Hamza",
  "Viwandani",
  "Harambee",
  "Makongeni",

  // KAMUKUNJI
  "Pumwani",
  "Eastleigh North",
  "Eastleigh South",
  "Airbase",
  "California",

  // STAREHE
  "Nairobi Central",
  "Ngara",
  "Pangani",
  "Ziwani/Kariokor",
  "Landimawe",
  "Nairobi South",

  // MATHARE
  "Hospital",
  "Mabatini",
  "Huruma",
  "Ngei",
  "Mlango Kubwa",
  "Kiamaiko",
] as const;

export type NairobiWard = (typeof NAIROBI_WARDS)[number];

/* -----------------------------
   LOCATION HELPERS
-------------------------------- */
export const LOCATION_TYPES = [
  "Road / Street",
  "Estate / Apartment",
  "Market",
  "School",
  "Hospital",
  "Bus Stop / Stage",
  "Public Park",
  "Other",
] as const;

/* -----------------------------
   APP META (OPTIONAL)
-------------------------------- */
export const APP_META = {
  name: "Nairobify",
  tagline: "Report. Track. Resolve.",
  city: "Nairobi City County",
};
