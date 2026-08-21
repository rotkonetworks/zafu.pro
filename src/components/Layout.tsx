import { Suspense, type ParentComponent } from "solid-js";
import { ThemeProvider } from "./ThemeProvider";
import Nav from "./Nav";
import Footer from "./Footer";
import Canonical from "./Canonical";

/**
 * Shared shell for every route: theme context, nav, page content, footer.
 * Used as the root component of the router, so `props.children` is the
 * matched route.
 */
const Layout: ParentComponent = (props) => {
  return (
    <ThemeProvider>
      <Canonical />
      <div class="min-h-screen flex flex-col bg-bg text-text">
        <Nav />
        <main class="flex-1">
          <Suspense>{props.children}</Suspense>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
