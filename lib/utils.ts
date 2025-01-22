import { ALLOWED_FILES } from "@/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "./env";
import { FirebaseError } from "firebase/app";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractDomain = (link: string): string => {
  const domain = link.split("//")[1].split("/")[0].replace("www.", "");
  return domain;
};

export const slugify = (text: string): string => {
  return text.toLowerCase().split(" ").join("-");
};

export const AllowedFiles = (filetype: string) => {
  return ALLOWED_FILES.includes(filetype);
};

export const isValidImageURL = (str: string): boolean => {
  return str.startsWith("/") || str.startsWith("http://") || str.startsWith("https://");
};

export const formatDate = (d: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
};

export const formatCurrency = (amount: number, curr?: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: curr?.toUpperCase() || "USD",
  }).format(amount);
};

export const scrollToTop = (selector: string) => {
  const el = document.querySelector(selector) as HTMLElement;
  el.scrollTo({ top: 0, behavior: "smooth" });
};

export const CopyToClipboard = (
  text: string,
  options: { onSucess?: () => void; onError?: () => void }
) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      options.onSucess && options.onSucess();
    })
    .catch(() => {
      options.onError && options.onError();
    });
};

export const sanitizeFBe = (value: string): string => {
  const firstStage: string[] = value.split("/")[1].split("-").join(" ").split(")")[0].split(" ");

  for (let i = 0; i < firstStage.length; i++) {
    firstStage[i] = firstStage[i].charAt(0).toUpperCase() + firstStage[i].slice(1);
  }

  return firstStage.join(" ");
};

export const handleError = (e: unknown) => {
  const error: FirebaseError = e as FirebaseError;
  const modified: FirebaseError = {
    ...error,
    ...{
      message: sanitizeFBe(error.message),
    },
  };
  return { error: modified };
};

export const sendTokenToChromeExtension = async (firebaseToken: string) => {
  try {
    if (chrome?.runtime) {
      chrome.runtime.sendMessage(
        env.chrome_extension_id,
        { action: "setFirebaseToken", token: firebaseToken },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error from chrome.runtime.lastError:",
              chrome.runtime.lastError.message
            );
          } else {
            console.log("Token sent to extension, response:", response);
          }
        }
      );
    } else {
      console.error("Chrome runtime not found");
    }
  } catch (error) {
    console.error("Error sending token to chrome extension:", error);
  }
};

export const ProgmaEscape = () => {
  const EscEvent = new KeyboardEvent("keydown", {
    key: "Escape",
    code: "Escape",
    keyCode: 27,
    which: 27,
    bubbles: true,
    cancelable: true,
  });

  document.dispatchEvent(EscEvent);
};
