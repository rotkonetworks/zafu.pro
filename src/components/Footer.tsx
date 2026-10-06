import { For } from "solid-js";
import { A } from "@solidjs/router";
import { DONATION_ADDRESS } from "../content/donation";
import { SUPPORT_CHANNELS } from "../content/support";
import { ZAFU_GITHUB_URL } from "../content/links";
import { NAV_LINKS } from "./Nav";
import { Seal } from "./Seal";

const col = "m-0 flex list-none flex-col gap-1.5 p-0 text-sm";

export default function Footer() {
  return (
    <footer class="border-t border-border py-12">
      <div class="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 md:flex-row md:justify-between">
        <div class="max-w-sm">
          <Seal size={30} />
          <p class="mt-4 text-sm text-muted">
            zafu, zigner and zcli, made by{" "}
            <a href="https://rotko.net" class="accent-link">rotko networks</a>. open source under the{" "}
            <a href={`${ZAFU_GITHUB_URL}/blob/main/LICENSE`} class="accent-link">MIT license</a>.
          </p>
          <p class="mt-4 break-all text-xs text-dim2">donations, shielded: {DONATION_ADDRESS}</p>
        </div>
        <div class="flex gap-14">
          <ul class={col}>
            <For each={NAV_LINKS}>
              {(l) => (
                <li>
                  <A href={l.href} class="text-muted hover:text-text">{l.label}</A>
                </li>
              )}
            </For>
          </ul>
          <ul class={col}>
            <For each={SUPPORT_CHANNELS}>
              {(c) => (
                <li>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" class="text-muted hover:text-text">
                    {c.title}
                  </a>
                </li>
              )}
            </For>
            <li>
              <a href={ZAFU_GITHUB_URL} class="text-muted hover:text-text">github</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
