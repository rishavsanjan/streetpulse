export interface Profile {
  id: string;
  bio: string | null;
  avatar: string | null;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile: Profile | null;
}