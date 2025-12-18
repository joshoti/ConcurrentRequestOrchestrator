import { BrowserRouter, Route, Routes } from "react-router-dom";
import SimulationConfig from "./app/pages/config/Configuration";
import Homepage from "./app/pages/home/Homepage";
import Simulation from "./app/pages/simulation/Simulation";
import SimulationReport from "./app/pages/report/SimulationReport";
// import { ScrollToTop } from "./app/utils/scoll";

export function Router() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/configuration" element={<SimulationConfig />} />
        <Route path="/simulate" element={<Simulation />} />
        <Route path="/report" element={<SimulationReport />} />
        <Route path="*" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}