import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: 'hsl(var(--accent))'}} />
          <stop offset="33%" style={{stopColor: '#ff7e5f'}} />
          <stop offset="66%" style={{stopColor: '#de4839'}} />
          <stop offset="100%" style={{stopColor: 'hsl(var(--primary))'}} />
        </linearGradient>
      </defs>
      <path d="M12 22V12" stroke="url(#logo-gradient)" />
      <path d="M4.5 12H19.5" stroke="url(#logo-gradient)" />
      <path d="M12 2L18 7V12L12 17L6 12V7L12 2Z" stroke="url(#logo-gradient)" />
    </svg>
  ),
};
