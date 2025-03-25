import { useWindowDimensions } from "react-native";

const getOs = () => {
  const os = ["Win", "Mac"]; // add your OS values
  return os.find(
    (v) => (global as any).window?.navigator.platform.indexOf(v) >= 0
  );
};

const isFirefox = () => {
  return (global as any).window?.navigator.userAgent?.match(/firefox|fxios/i);
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
