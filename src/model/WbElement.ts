import WbShape from "./WbShape";
import WbImage from "./WbImage";

export type WbElement = WbShape | WbImage;

export function isShape(element: WbElement): element is WbShape {
  return "type" in element && element.type !== "image";
}

export function isImage(element: WbElement): element is WbImage {
  return "url" in element || "type" in element && element.type === "image";
}