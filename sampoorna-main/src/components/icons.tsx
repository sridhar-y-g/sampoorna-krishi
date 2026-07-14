import type { SVGProps } from 'react';

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22v-8" />
      <path d="M20 8.59a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4.01V14a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4.01V8.59z" />
    </svg>
  );
}
