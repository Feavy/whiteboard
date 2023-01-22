import {IGS} from "../../ingescape";

export default class WhiteboardAgent {
  public addShape(shape: string, x: number, y: number, width: number, height: number, fill: string, stroke: string, strokeWidth: number) {
    let args: any[] = [];
    IGS.serviceArgsAddString(args, shape);
    IGS.serviceArgsAddDouble(args, x);
    IGS.serviceArgsAddDouble(args, y);
    IGS.serviceArgsAddDouble(args, width);
    IGS.serviceArgsAddDouble(args, height);
    IGS.serviceArgsAddString(args, fill);
    IGS.serviceArgsAddString(args, stroke);
    IGS.serviceArgsAddDouble(args, strokeWidth);

    return IGS.serviceCall("Whiteboard", "addShape", args, '');
  }

  public removeElement(elementId: number) {
    let args: any[] = [];
    IGS.serviceArgsAddInt(args, elementId);

    return IGS.serviceCall("Whiteboard", "remove", args, '');
  }

  public moveTo(elementId: number, x: number, y: number) {
    let args: any[] = [];
    IGS.serviceArgsAddInt(args, elementId);
    IGS.serviceArgsAddDouble(args, x);
    IGS.serviceArgsAddDouble(args, y);

    return IGS.serviceCall("Whiteboard", "moveTo", args, '');
  }
}