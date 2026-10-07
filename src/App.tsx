import { lazy } from "solid-js";
import { Navigate, Route, Router } from "@solidjs/router";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));

// Products
const Zafu = lazy(() => import("./pages/Zafu"));
const Zigner = lazy(() => import("./pages/Zigner"));
const Zcli = lazy(() => import("./pages/Zcli"));
const Cloud = lazy(() => import("./pages/Cloud"));

// Reference pages, rendered from src/content
const ZafuSecurity = lazy(() => import("./pages/zafu/Security"));
const ZafuSpecs = lazy(() => import("./pages/zafu/Specs"));
const ZafuDocs = lazy(() => import("./pages/zafu/Docs"));
const ZignerSecurity = lazy(() => import("./pages/zigner/Security"));
const ZignerSpecs = lazy(() => import("./pages/zigner/Specs"));
const ZignerDocs = lazy(() => import("./pages/zigner/Docs"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Brand = lazy(() => import("./pages/Brand"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Blog: markdown posts compiled at build time (virtual:zafu-posts). Lazy so
// the rendered-HTML payload only loads on /blog routes.
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Lazy like every other route: Release pulls in the QR renderer, and importing
// it eagerly put that ~23 kB in the entry chunk that every page loads.
const Release = lazy(() => import("./pages/Release"));
const Ceremony = lazy(() => import("./pages/Ceremony"));
const Zapps = lazy(() => import("./pages/Zapps"));
// zafu.pro/c#<card> and /j#<code>: shared from zafu, read in the browser only
const SharedLink = lazy(() => import("./pages/SharedLink"));

export default function App() {
  return (
    <Router root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/buy" component={() => <Navigate href="/zafu/docs#get-zec" />} />
      <Route path="/roadmap" component={() => <Navigate href="/" />} />
      <Route path="/zcli" component={Zcli} />
      <Route path="/cloud" component={Cloud} />

      <Route path="/zafu">
        <Route path="/" component={Zafu} />
        <Route path="/security" component={ZafuSecurity} />
        <Route path="/specs" component={ZafuSpecs} />
        <Route path="/docs" component={ZafuDocs} />
        <Route path="/roadmap" component={() => <Navigate href="/" />} />
      </Route>

      <Route path="/zigner">
        <Route path="/" component={Zigner} />
        <Route path="/security" component={ZignerSecurity} />
        <Route path="/specs" component={ZignerSpecs} />
        <Route path="/docs" component={ZignerDocs} />
        <Route path="/roadmap" component={() => <Navigate href="/" />} />
      </Route>

      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />

      <Route path="/dashboard" component={Dashboard} />
      <Route path="/brand" component={Brand} />
      <Route path="/release" component={Release} />
      <Route path="/ceremony" component={Ceremony} />
      <Route path="/zapps" component={Zapps} />
      <Route path="/c" component={() => <SharedLink kind="c" />} />
      <Route path="/j" component={() => <SharedLink kind="j" />} />

      <Route path="*404" component={NotFound} />
    </Router>
  );
}
