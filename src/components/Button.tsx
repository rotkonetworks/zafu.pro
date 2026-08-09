import { Show, type JSX, type ParentComponent } from "solid-js";

interface ButtonProps {
  /** When set, renders an <a>; otherwise a <button>. */
  href?: string;
  /** Opens in a new tab. Implied for http(s) hrefs. */
  external?: boolean;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  type?: "button" | "submit";
  disabled?: boolean;
  class?: string;
  children?: JSX.Element;
}

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-accent text-accent-contrast border border-accent hover:opacity-85",
  outline:
    "bg-transparent text-text border border-border-strong hover:border-accent hover:text-accent",
  ghost:
    "bg-transparent text-muted border border-transparent hover:text-accent",
};

const SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

/** Download / navigation button. Renders <a> when href is given. */
const Button: ParentComponent<ButtonProps> = (props) => {
  const isExternal = () =>
    props.external || (props.href ? /^https?:\/\//.test(props.href) : false);

  const classes = () =>
    [
      "inline-flex items-center justify-center gap-2 font-mono font-semibold transition-all cursor-pointer select-none",
      VARIANTS[props.variant ?? "primary"],
      SIZES[props.size ?? "md"],
      props.disabled ? "opacity-50 pointer-events-none" : "",
      props.class ?? "",
    ].join(" ");

  return (
    <Show
      when={props.href}
      fallback={
        <button
          type={props.type ?? "button"}
          onClick={props.onClick}
          disabled={props.disabled}
          class={classes()}
        >
          {props.children}
        </button>
      }
    >
      <a
        href={props.href}
        {...(isExternal()
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        class={classes()}
      >
        {props.children}
      </a>
    </Show>
  );
};

export default Button;
