interface LogoProps {
  size?: number;
  className?: string;
  title?: string;
}

/**
 * APIKit mark — a stylized "{ }" inside a tinted square. Connotes braces /
 * a code block / an API payload, not the previous "K" lockup.
 */
export function Logo({ size = 28, className, title = "APIKit" }: LogoProps) {
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
        <linearGradient id="ak-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="currentColor" stopOpacity="1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="7" fill="url(#ak-grad)" />
      {/* opening + closing braces */}
      <path
        d="M12.5 9 C 10.5 9, 10 10, 10 12 L 10 14 C 10 15.2, 9.4 16, 8.5 16 C 9.4 16, 10 16.8, 10 18 L 10 20 C 10 22, 10.5 23, 12.5 23"
        stroke="hsl(var(--background))"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M19.5 9 C 21.5 9, 22 10, 22 12 L 22 14 C 22 15.2, 22.6 16, 23.5 16 C 22.6 16, 22 16.8, 22 18 L 22 20 C 22 22, 21.5 23, 19.5 23"
        stroke="hsl(var(--background))"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
