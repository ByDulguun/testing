import { Suspense } from "react";
import CarsPage from "./CarsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsPage />
    </Suspense>
  );
}
