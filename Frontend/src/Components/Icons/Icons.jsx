export const Arrow = ({ className }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    className={className}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

export const ArrowForward = ({ className }) => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z" />
  </svg>
);

export const Search = ({ className }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    className={className}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeWidth="32"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="32"
      d="M338.29 338.29L448 448"
    />
  </svg>
);

export const HamburgerMenu = ({ className }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 15 15"
    className={className}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.5 3C1.22 3 1 3.22 1 3.5C1 3.78 1.22 4 1.5 4H13.5C13.78 4 14 3.78 14 3.5C14 3.22 13.78 3 13.5 3H1.5ZM1 7.5C1 7.22 1.22 7 1.5 7H13.5C13.78 7 14 7.22 14 7.5C14 7.78 13.78 8 13.5 8H1.5C1.22 8 1 7.78 1 7.5ZM1 11.5C1 11.22 1.22 11 1.5 11H13.5C13.78 11 14 11.22 14 11.5C14 11.78 13.78 12 13.5 12H1.5C1.22 12 1 11.78 1 11.5Z"
    />
  </svg>
);

export const Edit = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-pen-line ${className || ""}`}
  >
    <path d="M13 21h8" />
    <path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" />
  </svg>
);

export const Send = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-send-horizontal-icon lucide-send-horizontal ${className}`}
  >
    <path d="M3.71 3.05a.5.5 0 0 0-.68.63l2.84 7.63a2 2 0 0 1 0 1.4l-2.84 7.63a.5.5 0 0 0 .68.63l18-8.5a.5.5 0 0 0 0-.9z" />
    <path d="M6 12h16" />
  </svg>
)

export const Pending = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-clock-fading-icon lucide-clock-fading"
  >
    <path d="M12 2a10 10 0 0 1 7.38 16.75" />
    <path d="M12 6v6l4 2" />
    <path d="M2.5 8.88a10 10 0 0 0-.5 3" />
    <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
    <path d="M4.64 5.24a10 10 0 0 1 .89-.86" />
    <path d="M8.64 21.42a10 10 0 0 0 7.63-.38" />
  </svg>
);

export const Generate = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-user-cog-icon lucide-user-cog"
  >
    <path d="M10 15H6a4 4 0 0 0-4 4v2" />
    <path d="m14.31 16.53.92-.38" />
    <path d="m15.23 13.85-.92-.38" />
    <path d="m16.85 12.23-.38-.92" />
    <path d="m16.85 17.77-.38.92" />
    <path d="m19.15 12.23.38-.92" />
    <path d="m19.53 18.7-.38-.92" />
    <path d="m20.77 13.85.92-.38" />
    <path d="m20.77 16.15.92.38" />
    <circle cx="18" cy="15" r="3" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

export const Manage = ({ className }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    className={className}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const Approved = ({ className }) => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    className={className}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
  </svg>
);

export const Active = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-play-icon lucide-play"
  >
    <path d="M5 5a2 2 0 0 1 3.01-1.73l12 7a2 2 0 0 1 0 3.46l-12 7A2 2 0 0 1 5 19z" />
  </svg>
);

export const Churn = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-globe-off-icon lucide-globe-off"
  >
    <path d="M10.11 4.46A14.5 14.5 0 0 1 12 2a10 10 0 0 1 9.31 13.64" />
    <path d="M15.56 15.56A14.5 14.5 0 0 1 12 22 10 10 0 0 1 4.93 4.93" />
    <path d="M15.89 10.23A14.5 14.5 0 0 0 12 2a10 10 0 0 0-3.64.69" />
    <path d="M17.66 12H22" />
    <path d="M19.07 19.07A10 10 0 0 1 12 22 14.5 14.5 0 0 1 8.44 8.45" />
    <path d="M2 12h10" />
    <path d="m2 2 20 20" />
  </svg>
);