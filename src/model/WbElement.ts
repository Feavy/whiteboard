import WbShape from "./WbShape";
import WbImage from "./WbImage";

export type WbElement = WbShape | WbImage;

export function isShape(element: WbElement): element is WbShape {
  return "type" in element;
}

export function isImage(element: WbElement): element is WbImage {
  return "id" in element;
}