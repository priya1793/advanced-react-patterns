/**
 * ============================================================
 * POLYMORPHIC COMPONENT — `as` prop pattern
 * ============================================================
 *
 * PATTERN: Polymorphic Components
 * --------------------------------
 * A polymorphic component can render as any HTML element or
 * React component via the `as` prop. TypeScript infers the
 * correct props based on what `as` is set to.
 *
 * This is the generic base used by other components.
 *
 * Usage:
 *   <Box as="section" id="main">...</Box>
 *   <Box as="a" href="/about">...</Box>
 *   <Box as={Link} to="/about">...</Box>
 */

import React, { forwardRef } from "react";
import type {
  PolymorphicAs,
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from "./types";

// We use a type assertion pattern because React.forwardRef
// doesn't support generics natively.

type BoxProps<E extends PolymorphicAs = "div"> = PolymorphicPropsWithRef<
  E,
  { children?: React.ReactNode }
>;

type BoxComponent = <E extends PolymorphicAs = "div">(
  props: BoxProps<E>,
) => React.ReactElement | null;

/**
 * Box — A polymorphic container component.
 *
 * Renders as "div" by default. Pass `as` to change the element:
 *   <Box as="section">  → <section>
 *   <Box as="a" href="...">  → <a>
 */
export const Box = forwardRef(function Box<E extends PolymorphicAs = "div">(
  { as, children, ...props }: BoxProps<E>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? "div";
  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}) as BoxComponent;
