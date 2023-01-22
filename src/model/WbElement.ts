export default interface WbElement {
  id: number;
  type: "shape" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
}