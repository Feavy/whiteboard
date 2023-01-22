import WhiteboardAgent from "./WhiteboardAgent";
import WbElement from "../../model/WbElement";
import Singleton from "tydi/di/annotations/Singleton";
import {isWbShape} from "../../model/WbShape";

@Singleton
export default class WhiteboardService {
  private readonly agent: WhiteboardAgent;

  public constructor() {
      this.agent = new WhiteboardAgent();
  }

  public addElement(element: WbElement) {
      if(isWbShape(element)) {
        this.agent.addShape(element.shape, element.x, element.y, element.width, element.height, element.fill, element.stroke, element.strokeWidth);
        return;
      }
      console.log("Unknown element type: " + element.type);
  }

  public removeElement(element: WbElement) {
    this.agent.removeElement(element.id);
  }

  public moveElement(element: WbElement) {
    this.agent.moveTo(element.id, element.x, element.y);
  }
}