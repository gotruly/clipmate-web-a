import { SVGProps } from "react";

const PlansCheckIcon = ({ width = 24, height = 25, ...rest }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M0.5 12C0.5 5.37258 5.87258 0 12.5 0C19.1274 0 24.5 5.37258 24.5 12C24.5 18.6274 19.1274 24 12.5 24C5.87258 24 0.5 18.6274 0.5 12Z"
        fill="#079455"
        className="fill-[#DCFAE6] dark:fill-[#079455]"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5964 7.38967L10.4364 14.2997L8.53638 12.2697C8.18638 11.9397 7.63638 11.9197 7.23638 12.1997C6.84638 12.4897 6.73638 12.9997 6.97638 13.4097L9.22638 17.0697C9.44638 17.4097 9.82638 17.6197 10.2564 17.6197C10.6664 17.6197 11.0564 17.4097 11.2764 17.0697C11.6364 16.5997 18.5064 8.40967 18.5064 8.40967C19.4064 7.48967 18.3164 6.67967 17.5964 7.37967V7.38967Z"
        fill="#ABEFC6"
        className="fill-[#079455] dark:fill-[#ABEFC6]"
      />
    </svg>
  );
};

export default PlansCheckIcon;
