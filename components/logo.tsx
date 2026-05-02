interface LogoProps {
  size?: number;
  className?: string;
  title?: string;
}

export function Logo({ size = 28, className, title = "KeyForge" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        <linearGradient id="kf-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="currentColor" stopOpacity="1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="7" fill="url(#kf-grad)" />
      <path
        d="M11 9 L11 23 M11 16 L19 9 M11 16 L19 23"
        stroke="hsl(var(--background))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
