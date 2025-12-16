import { BrowserRouter, Route, Routes } from "react-router-dom";
import SimulationConfig from "./app/pages/config/Configuration";
import Homepage from "./app/pages/home/Homepage";
// import { ScrollToTop } from "./app/utils/scoll";

export function Router() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Routes>
        <Route path="/" element={<Homepage />}>
          <Route path="configuration" element={<SimulationConfig />} />
        </Route>
        <Route path="*" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}