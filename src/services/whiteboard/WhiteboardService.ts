import WhiteboardAgent from "./WhiteboardAgent";
import Singleton from "tydi/di/annotations/Singleton";
import {isImage, isShape, WbElement} from "../../model/WbElement";

@Singleton
export default class WhiteboardService {
  private readonly agent: WhiteboardAgent;

  public constructor() {
    this.agent = new WhiteboardAgent();
  }

  public addElement(element: WbElement): Promise<number> {
    if (isShape(element)) {
      return this.agent.addShape(element.type, element.x, element.y, element.width, element.height, element.fill, element.stroke, element.strokeWidth);
    }else if(isImage(element)){
      return this.agent.addImage(element.url, element.x, element.y);
    }
    throw new Error("Unsupported element type "+ JSON.stringify(element));
  }

  public removeElement(element: WbElement) {
    this.agent.removeElement(element.id);
  }

  public moveElement(id: number, x: number, y: number) {
    this.agent.moveTo(id, x, y);
  }

  public updateElementPosition(element: WbElement) {
    this.agent.moveTo(element.id, element.x, element.y);
  }

  public getElements(): Promise<any[]> {
    return this.agent.getElements().then(str => JSON.parse(str));
  }
}
