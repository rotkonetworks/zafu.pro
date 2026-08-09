import { A } from "@solidjs/router";
import Page from "../components/Page";

export default function NotFound() {
  return (
    <Page title="404">
      <div class="text-center py-24">
        <p class="text-6xl font-bold text-accent mb-4">404</p>
        <p class="text-muted mb-8">This page does not exist.</p>
        <A href="/" class="btn-outline">
          back home
        </A>
      </div>
    </Page>
  );
}
