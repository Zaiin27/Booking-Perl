import * as React from "react";
import PropTypes from "prop-types";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils";

const Button = React.forwardRef(({ className, shimmer = false, children ,variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
    yellow: "bg-yellow-300 hover:bg-[rgb(220,192,4)]",
  };

  // const variantClasses = {
  //     primary: "bg-primary-600 hover:bg-primary-700 text-white",
  //     secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  //     default: "bg-white hover:bg-[#EDF2F6] text-gray-800 border border-gray-300",
  //     yellow: "bg-yellow-300 hover:bg-yellow-700",
  //   };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };

  return (
    <Comp
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  >
    {shimmer && (
      <span className="absolute h-full w-[100px] top-0 left-[-100px] [background:linear-gradient(132deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0)_70%)] opacity-30 group-hover:left-full transition-all duration-1000"></span>
    )}
    {children}
  </Comp>
  );
});

Button.displayName = "Button";

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "destructive", "outline", "secondary", "ghost", "link"]),
  size: PropTypes.oneOf(["default", "sm", "lg", "icon"]),
  asChild: PropTypes.bool,
};

export { Button };
