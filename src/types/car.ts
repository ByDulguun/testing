import { CarStatusEnum } from "@/firebase/enum/car";

export interface CarType {
  category: string | null;
  id?: string;
  brand: string;
  model: string;
  vin?: string;
  year: number;
  price: number;
  mileage: number;
  images: { url: string; public_id: string }[];
  discount?: number;
  type: CarStatusEnum;
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid" | "Gas";
  engineCapacity: number;
  engineCc?: number;
  bodyType: string;
  color: string;
  steering?: "LHD" | "RHD";
  transmission?: "automatic" | "manual";
  seats?: number;
  detail: string;
  time: string;
  expiryTime: string;
}
