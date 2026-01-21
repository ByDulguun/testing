import { Suspense } from "react";
import CarsPage from "./showroom/CarsPage";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsPage />
    </Suspense>
  );
}
