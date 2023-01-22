export default abstract class WbElement {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;

  protected constructor(id: number, x: number, y: number, width: number, height: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}