import { SVGProps } from "react";

const DashedLine = ({ width = 24, height = "2", ...rest }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 422 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M1 1H421" stroke="currentColor" strokeLinecap="round" strokeDasharray="4 4" />
    </svg>
  );
};

export default DashedLine;
