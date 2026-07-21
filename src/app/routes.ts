import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Beranda } from "./components/Beranda";
import { DashboardPeta } from "./components/DashboardPeta";
import { HasilRekomendasi } from "./components/HasilRekomendasi";
import { TentangMetodologi } from "./components/TentangMetodologi";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Beranda },
      { path: "dashboard", Component: DashboardPeta },
      { path: "hasil", Component: HasilRekomendasi },
      { path: "tentang", Component: TentangMetodologi },
    ],
  },
]);
