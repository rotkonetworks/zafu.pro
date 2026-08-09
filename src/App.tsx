import { lazy, Suspense } from "solid-js";
import Nav from "./components/Nav";

const ZafuHero = lazy(() => import("./components/ZafuHero"));
const ZignerHero = lazy(() => import("./components/ZignerHero"));
const Features = lazy(() => import("./components/Features"));
const ColdSigning = lazy(() => import("./components/ColdSigning"));
const Multisig = lazy(() => import("./components/Multisig"));
const Footer = lazy(() => import("./components/Footer"));

export default function App() {
  return (
    <div class="font-mono min-h-screen" style={{ background: "#0a0a0f", color: "#c8c8d8" }}>
      <Nav />
      <Suspense>
        <ZafuHero />
        <ZignerHero />
        <Features />
        <ColdSigning />
        <Multisig />
      </Suspense>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  );
}
