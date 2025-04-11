import { useWindowDimensions } from "react-native";

const getOs = (): string | undefined => {
  const osList = ["Win", "Mac"];
  const navigator = typeof window !== "undefined" ? window.navigator : undefined;

  return navigator
    ? osList.find((v) => navigator.platform.includes(v))
    : undefined;
};

const isFirefox = (): boolean => {
  const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";
  return /firefox|fxios/i.test(userAgent);
};

export const useDim = () => {
  const { width, height, scale: s, fontScale } = useWindowDimensions();
  const scale = getOs() === "Win" && !isFirefox() ? s : 1;

  return {
    width: width * Math.max(scale || 1, 1),
    height: height * Math.max(scale || 1, 1),
    scale: Math.max(scale || 1, 1),
    fontScale,
  };
};
