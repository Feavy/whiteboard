import WhiteboardAgent from "./WhiteboardAgent";
import WbElement from "../../model/WbElement";
import Singleton from "tydi/di/annotations/Singleton";
import WbShape from "../../model/WbShape";

@Singleton
export default class WhiteboardService {
  private idGenerator: number = 0;
  private readonly agent: WhiteboardAgent;

  public constructor() {
    this.agent = new WhiteboardAgent();
  }

  public addElement(element: WbElement) {
    if (element instanceof WbShape) {
      element.id = this.idGenerator++;
      this.agent.addShape(element.shape, element.x, element.y, element.width, element.height, element.fill, element.stroke, element.strokeWidth);
      return;
    }
    console.log("Unknown element: " + element);
  }

  public removeElement(element: WbElement) {
    this.agent.removeElement(element.id);
  }

  public moveElement(element: WbElement) {
    this.agent.moveTo(element.id, element.x, element.y);
  }

  public getElements() {
    this.agent.getElements();
  }
}