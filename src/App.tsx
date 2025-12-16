import "@mantine/core/styles.css";

import { Router } from "./Router";
import { MantineProvider } from "@mantine/core";

export default function App() {
  return (
    <MantineProvider>
      <Router />
    </MantineProvider>
  );
}
