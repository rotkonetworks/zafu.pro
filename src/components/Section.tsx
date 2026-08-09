import { Show, type JSX, type ParentComponent } from "solid-js";
import Container from "./Container";

interface SectionProps {
  id?: string;
  /** Optional small mono eyebrow rendered above the title (e.g. "01 / security"). */
  label?: string;
  title?: string;
  subtitle?: string;
  /** Draw a top border separating this section from the previous one. Default true. */
  bordered?: boolean;
  /** Container width preset, passed through to Container. */
  size?: "narrow" | "default" | "wide";
  class?: string;
  children?: JSX.Element;
}

/** Page section with optional heading block and top border. */
const Section: ParentComponent<SectionProps> = (props) => {
  return (
    <section
      id={props.id}
      class={`py-14 sm:py-20 ${
        props.bordered !== false ? "border-t border-border" : ""
      } ${props.class ?? ""}`}
    >
      <Container size={props.size}>
        <Show when={props.label || props.title || props.subtitle}>
          <div class="mb-8 sm:mb-12">
            <Show when={props.label}>
              <p class="mb-2 font-mono text-xs uppercase tracking-widest text-accent">
                {props.label}
              </p>
            </Show>
            <Show when={props.title}>
              <h2 class="text-2xl font-bold text-text sm:text-3xl">
                {props.title}
              </h2>
            </Show>
            <Show when={props.subtitle}>
              <p class="mt-3 max-w-2xl text-base text-muted">
                {props.subtitle}
              </p>
            </Show>
          </div>
        </Show>
        {props.children}
      </Container>
    </section>
  );
};

export default Section;
