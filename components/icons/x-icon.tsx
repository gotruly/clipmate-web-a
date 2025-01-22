import { SVGProps } from "react";

const XIcon = ({ width = 24, height = 24, ...rest }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="24" height="24" rx="4" fill="#242E36" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7465 20L10.8829 14.2473L6.04622 20H4L9.97508 12.8953L4 4H9.25355L12.8949 9.42183L17.4573 4H19.5036L13.8058 10.7756L20 20H14.7465ZM17.0252 18.3782H15.6475L6.92988 5.62182H8.30767L11.7992 10.7296L12.4029 11.6159L17.0252 18.3782Z"
        fill="white"
      />
    </svg>
  );
};

export default XIcon;
