import { lazy } from "solid-js";
import { Navigate, Route, Router } from "@solidjs/router";
import Layout from "./components/Layout";

// Zafu (wallet)
const ZafuHome = lazy(() => import("./pages/zafu/Home"));
const ZafuSecurity = lazy(() => import("./pages/zafu/Security"));
const ZafuSpecs = lazy(() => import("./pages/zafu/Specs"));
const ZafuDocs = lazy(() => import("./pages/zafu/Docs"));
const ZafuRoadmap = lazy(() => import("./pages/zafu/Roadmap"));

// Zigner (hardware signer)
const ZignerHome = lazy(() => import("./pages/zigner/Home"));
const ZignerSecurity = lazy(() => import("./pages/zigner/Security"));
const ZignerSpecs = lazy(() => import("./pages/zigner/Specs"));
const ZignerDocs = lazy(() => import("./pages/zigner/Docs"));
const ZignerRoadmap = lazy(() => import("./pages/zigner/Roadmap"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy like every other route: Release pulls in the QR renderer, and importing
// it eagerly put that ~23 kB in the entry chunk that every page loads.
const Release = lazy(() => import("./pages/Release"));

export default function App() {
  return (
    <Router root={Layout}>
      {/* Root is the Zafu home */}
      <Route path="/" component={ZafuHome} />

      <Route path="/zafu">
        <Route path="/" component={() => <Navigate href="/" />} />
        <Route path="/security" component={ZafuSecurity} />
        <Route path="/specs" component={ZafuSpecs} />
        <Route path="/docs" component={ZafuDocs} />
        <Route path="/roadmap" component={ZafuRoadmap} />
      </Route>

      <Route path="/zigner">
        <Route path="/" component={ZignerHome} />
        <Route path="/security" component={ZignerSecurity} />
        <Route path="/specs" component={ZignerSpecs} />
        <Route path="/docs" component={ZignerDocs} />
        <Route path="/roadmap" component={ZignerRoadmap} />
      </Route>

      <Route path="/dashboard" component={Dashboard} />
      <Route path="/release" component={Release} />

      <Route path="*404" component={NotFound} />
    </Router>
  );
}
