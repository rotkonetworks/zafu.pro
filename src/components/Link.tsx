import type { JSX, ParentComponent } from "solid-js";
import { A } from "@solidjs/router";

interface LinkProps {
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". Implied for http(s) hrefs. */
  external?: boolean;
  /** Muted style: dim text that brightens on hover (footers, nav). */
  muted?: boolean;
  class?: string;
  children?: JSX.Element;
}

/**
 * Styled link. Uses the router <A> for internal paths and a plain <a>
 * (new tab) for external URLs. Accent-colored by default, muted variant
 * available.
 */
const Link: ParentComponent<LinkProps> = (props) => {
  const isExternal = () => props.external || /^https?:\/\//.test(props.href);
  const classes = () =>
    [
      props.muted
        ? "text-muted hover:text-text"
        : "text-accent hover:text-text",
      "transition-colors",
      props.class ?? "",
    ].join(" ");

  return isExternal() ? (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      class={classes()}
    >
      {props.children}
    </a>
  ) : (
    <A href={props.href} class={classes()}>
      {props.children}
    </A>
  );
};

export default Link;
