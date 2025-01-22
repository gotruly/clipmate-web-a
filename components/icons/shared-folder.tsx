import React, { SVGProps } from "react";

const ShareFolderIcon = ({ width = 24, height = 24, ...rest }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.07989 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803M2 7V16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21H8.99976"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g clipPath="url(#clip0_8562_16388)">
        <path
          d="M11.75 18H24.25M11.75 18C11.75 21.4518 14.5482 24.25 18 24.25M11.75 18C11.75 14.5482 14.5482 11.75 18 11.75M24.25 18C24.25 21.4518 21.4518 24.25 18 24.25M24.25 18C24.25 14.5482 21.4518 11.75 18 11.75M18 11.75C19.5633 13.4615 20.4517 15.6825 20.5 18C20.4517 20.3175 19.5633 22.5385 18 24.25M18 11.75C16.4367 13.4615 15.5483 15.6825 15.5 18C15.5483 20.3175 16.4367 22.5385 18 24.25"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_8562_16388">
          <rect width="15" height="15" fill="white" transform="translate(10.5 10.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ShareFolderIcon;
