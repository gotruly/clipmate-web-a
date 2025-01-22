/* eslint-disable @next/next/no-img-element */
"use client";

import { cn, isValidImageURL } from "@/lib/utils";
import Image from "next/image";
import React, { HTMLAttributes, useEffect, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";

interface Props extends HTMLAttributes<HTMLPictureElement> {
  src: string;
  alt: string;
}

const ClipmateImage = ({ src, alt, ...rest }: Props) => {
  return (
    <picture
      draggable={false}
      className={cn("w-full h-full object-cover object-center", rest.className)}
    >
      <source srcSet={src} type="image/png" />
      <source srcSet={src} type="image/jpeg" />
      <img
        draggable={false}
        className="w-full h-full object-cover object-center text-xs"
        {...rest}
        src="/broken.png"
        alt={alt}
        fetchPriority="high"
        decoding="async"
        loading="lazy"
      />
    </picture>
  );
};

/**
 * Helpers - Placeholder
 */
const LightShimmer = (): string => `
<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#e6e6e6" offset="20%" />
      <stop stop-color="#e3e3e3" offset="50%" />
      <stop stop-color="#e6e6e6" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#e6e6e6" />
  <rect id="r" width="100%" height="100%" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-100%" to="100%" dur="1s" repeatCount="indefinite"  />
</svg>`;

const DarkShimmer = (): string => `
<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#292929" offset="20%" />
      <stop stop-color="#2b2b2b" offset="50%" />
      <stop stop-color="#292929" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#292929" />
  <rect id="r" width="100%" height="100%" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-100%" to="100%" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) => btoa(str);

interface NextImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  onError?: () => void;
  onLoaded?: () => void;
  hasError?: (b: boolean) => void;
  bgClass?: string;
}

export const ClipmateNextImage = React.memo(
  ({ src, alt, onError, onLoaded, hasError, bgClass, ...rest }: NextImageProps) => {
    const { theme } = useTheme();
    const [URL, setURL] = useState<string>(src);

    useEffect(() => {
      setURL(src);
    }, [hasError, src]);

    const handleLoad = useCallback(() => {
      onLoaded && onLoaded();
    }, [onLoaded]);

    const handleError = useCallback(() => {
      setURL("/broken.png");
    }, []);

    const MemoizedURL = useMemo(() => URL, [URL]);

    if (!MemoizedURL || MemoizedURL === "self" || !isValidImageURL(MemoizedURL)) return null;

    return (
      <div className={cn("w-fit h-fit bg-background", bgClass)}>
        <Image
          draggable={false}
          {...rest}
          src={MemoizedURL}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          sizes="100vw"
          width={100}
          height={100}
          loading="lazy"
          placeholder={`data:image/svg+xml;base64,${toBase64(
            theme === "dark" ? DarkShimmer() : LightShimmer()
          )}`}
          quality={100}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    );
  }
);

ClipmateNextImage.displayName = "ClipmateNextImage";

export default ClipmateImage;
