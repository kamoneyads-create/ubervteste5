
export enum AppView {
  LOGIN = 'LOGIN',
  PASSWORD = 'PASSWORD',
  REGISTER = 'REGISTER',
  VERIFICATION = 'VERIFICATION',
  DASHBOARD = 'DASHBOARD',
  EARNINGS = 'EARNINGS',
  INBOX = 'INBOX',
  PROFILE = 'PROFILE',
  PROFILE_DETAIL = 'PROFILE_DETAIL',
  PUBLIC_PROFILE = 'PUBLIC_PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  ACCOUNT = 'ACCOUNT',
  DOCUMENTS = 'DOCUMENTS',
  TRIP_DOCUMENTS = 'TRIP_DOCUMENTS',
  VEHICLES = 'VEHICLES',
  MANAGE_VEHICLES = 'MANAGE_VEHICLES',
  ADD_VEHICLE = 'ADD_VEHICLE',
  PAYOUT_INFO = 'PAYOUT_INFO',
  ACTIVE_TRIP = 'ACTIVE_TRIP',
  TRIP_AGENDA = 'TRIP_AGENDA',
  TRIP_SUPPORT = 'TRIP_SUPPORT',
  TRIP_CHAT = 'TRIP_CHAT',
  OPPORTUNITIES = 'OPPORTUNITIES',
  REFERRALS = 'REFERRALS',
  UBER_ACCOUNT = 'UBER_ACCOUNT',
  APP_SETTINGS = 'APP_SETTINGS',
  RESET_PASSWORD = 'RESET_PASSWORD'
}

export interface TripRequest {
  id: string;
  passengerName: string;
  rating: number;
  ratingCount: number;
  distanceToPickup: string; // ex: 2.4 km
  timeToPickup: string; // ex: 8 minutos
  tripDistance: string; // ex: 16.3 km
  duration: string; // ex: 33 minutos
  price: number;
  surgePrice: number; // Valor do preço dinâmico variável
  pickup: string;
  destination: string;
  type: 'UberX' | 'Comfort' | 'Black' | 'Moto' | 'Bicicleta' | 'Uber Flash';
}

export interface EarningsData {
  day: string;
  value: number;
}
