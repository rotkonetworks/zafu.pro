import type { JSX, ParentComponent } from "solid-js";

interface ContainerProps {
  /** Max-width preset. Default "default" (matches nav width, max-w-5xl). */
  size?: "narrow" | "default" | "wide";
  class?: string;
  children?: JSX.Element;
}

const SIZES: Record<NonNullable<ContainerProps["size"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

/** Centered max-width content wrapper with responsive horizontal padding. */
const Container: ParentComponent<ContainerProps> = (props) => {
  return (
    <div
      class={`${SIZES[props.size ?? "default"]} mx-auto w-full px-4 sm:px-6 ${
        props.class ?? ""
      }`}
    >
      {props.children}
    </div>
  );
};

export default Container;
