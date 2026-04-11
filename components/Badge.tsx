import { forwardRef } from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant: "blur" | "border" | "active";
  className?: string;
}

const variantClasses = {
  blur: "backdrop-blur-[9px] bg-[#3F3F3F]/40 text-white",
  border: "border border-[#B4B4B4] text-[#B4B4B4]",
  active: "bg-blue-500 text-white",
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant, className = "" }, ref) => (
    <span
      ref={ref}
      className={`flex items-center justify-center min-w-7 h-5.5 px-2 pt-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
);

Badge.displayName = "Badge";
export default Badge;
