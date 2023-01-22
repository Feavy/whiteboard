import WbElement from "./WbElement";

export default interface WbShape extends WbElement {
  type: "shape";
  shape: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export function isWbShape(element: WbElement): element is WbShape {
  return element.type === "shape";
}