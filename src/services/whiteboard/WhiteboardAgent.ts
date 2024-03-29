import {IGS, iopTypes} from "../../ingescape";
import Event from "../../utils/Event";

export default class WhiteboardAgent {
  private readonly onElementCreated: Event<number> = new Event();
  private readonly onGetElements: Event<string> = new Event();

  constructor() {
    IGS.serviceInit("elementCreated", this.elementCreatedServiceCallback.bind(this));
    IGS.serviceArgAdd("elementCreated", "elementId", iopTypes.IGS_INTEGER_T);
    IGS.serviceInit("elements", this.elementsServiceCallback.bind(this));
    IGS.serviceArgAdd("elements", "jsonArray", iopTypes.IGS_STRING_T);
  }

  public addShape(shape: string, x: number, y: number, width: number, height: number, fill: string, stroke: string, strokeWidth: number): Promise<number> {
    return new Promise((resolve, reject) => {
      let args: any[] = [];
      IGS.serviceArgsAddString(args, shape);
      IGS.serviceArgsAddDouble(args, x);
      IGS.serviceArgsAddDouble(args, y);
      IGS.serviceArgsAddDouble(args, width);
      IGS.serviceArgsAddDouble(args, height);
      IGS.serviceArgsAddString(args, fill);
      IGS.serviceArgsAddString(args, stroke);
      IGS.serviceArgsAddDouble(args, strokeWidth);

      if (!IGS.serviceCall("Whiteboard", "addShape", args, '')) {
        reject("An error occurred on addShape");
      }

      this.onElementCreated.subscribeOnce(value => {
        resolve(value);
      });
    });
  }

  public addImage(url: string, x: number, y: number): Promise<number> {
    return new Promise((resolve, reject) => {
      let args: any[] = [];
      IGS.serviceArgsAddString(args, url);
      IGS.serviceArgsAddDouble(args, x);
      IGS.serviceArgsAddDouble(args, y);

      if(!IGS.serviceCall("Whiteboard", "addImageFromUrl", args, '')) {
        reject("An error occurred on addImage");
      }

      this.onElementCreated.subscribeOnce(value => {
        resolve(value);
      });
    });
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

  public getElements(): Promise<string> {
    console.log("Get elements called")
    return new Promise((resolve, reject) => {
      let args: any[] = [];
      const ret = IGS.serviceCall("Whiteboard", "getElements", args, '');
      if (!ret) {
        reject(ret);
        throw new Error("An error occurred on getElements");
      } else {
        this.onGetElements.subscribeOnce(value => {
          resolve(value);
        })
      }
    });
  }

  private elementCreatedServiceCallback(senderAgentName: string, senderAgentUUID: string, serviceName: string, serviceArguments: any[], token: string, myData: any) {
    console.log(senderAgentName, senderAgentUUID, serviceArguments);

    const elementId: number = serviceArguments[0].value;

    const log = senderAgentName + " called service " + serviceName;
    console.log(log)
    this.onElementCreated.trigger(elementId);
  }

  private elementsServiceCallback(senderAgentName: string, senderAgentUUID: string, serviceName: string, serviceArguments: any, token: string, myData: any) {
    console.log("jsonArray", serviceArguments);
    var jsonArrayValue = serviceArguments[0].value;

    var log = senderAgentName + " called service " + serviceName;
    console.log(log)
    //add code here if needed
    this.onGetElements.trigger(jsonArrayValue);
  }
}
