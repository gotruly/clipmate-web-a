import { SVGProps } from "react";

const LinkIcon = ({ width = 24, height = 24, ...rest }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="24" height="24" rx="4" fill="white" />
      <g clipPath="url(#clip0_7963_171086)">
        <path
          d="M3.6665 12H20.3332M3.6665 12C3.6665 16.6024 7.39746 20.3334 11.9998 20.3334M3.6665 12C3.6665 7.39765 7.39746 3.66669 11.9998 3.66669M20.3332 12C20.3332 16.6024 16.6022 20.3334 11.9998 20.3334M20.3332 12C20.3332 7.39765 16.6022 3.66669 11.9998 3.66669M11.9998 3.66669C14.0842 5.94865 15.2688 8.91005 15.3332 12C15.2688 15.09 14.0842 18.0514 11.9998 20.3334M11.9998 3.66669C9.91544 5.94865 8.73088 8.91005 8.6665 12C8.73088 15.09 9.91544 18.0514 11.9998 20.3334"
          stroke="#2970FF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_7963_171086">
          <rect width="20" height="20" fill="white" transform="translate(2 2)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default LinkIcon;
