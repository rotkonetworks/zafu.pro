import { Show, type JSX, type ParentComponent } from "solid-js";

interface SpecItemProps {
  title: string;
  description?: string;
  /** Optional mono value shown right of the title (e.g. "STM32H573"). */
  value?: string;
  /** Optional icon slot (unocss icon span or any element). */
  icon?: JSX.Element;
  /** Not yet supported: grays the card and shows an "upcoming" tag. */
  upcoming?: boolean;
  class?: string;
  children?: JSX.Element;
}

/** Card for spec/feature entries: title, optional mono value, description. */
const SpecItem: ParentComponent<SpecItemProps> = (props) => {
  return (
    <div
      class={`card transition-colors hover:border-border-strong ${
        props.upcoming ? "opacity-55" : ""
      } ${props.class ?? ""}`}
    >
      <div class="flex items-baseline justify-between gap-3">
        <h3 class="flex items-center gap-2 text-base font-semibold text-text">
          <Show when={props.icon}>{props.icon}</Show>
          {props.title}
        </h3>
        <Show
          when={!props.upcoming}
          fallback={
            <span class="shrink-0 border border-border px-1.5 py-0.5 font-mono text-xs uppercase tracking-wider text-muted">
              upcoming
            </span>
          }
        >
          <Show when={props.value}>
            <span class="shrink-0 font-mono text-xs text-accent">
              {props.value}
            </span>
          </Show>
        </Show>
      </div>
      <Show when={props.description}>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          {props.description}
        </p>
      </Show>
      {props.children}
    </div>
  );
};

export default SpecItem;
