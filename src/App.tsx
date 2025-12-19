import "@mantine/core/styles.css";

import { Router } from "./Router";
import { MantineProvider } from "@mantine/core";
import { ConfigProvider } from "./app/context/ConfigContext";

export default function App() {
  return (
    <MantineProvider>
      <ConfigProvider>
        <Router />
      </ConfigProvider>
    </MantineProvider>
  );
}
