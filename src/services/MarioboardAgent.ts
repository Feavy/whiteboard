import {Agent, IGS, iopTypes} from "../ingescape";
import Singleton from "tydi/di/annotations/Singleton";
import Startup from "tydi/di/annotations/Startup";

@Singleton
export default class MarioboardAgent {

  public constructor(serverURL: string = "ws://localhost:5000") {
    IGS.netSetServerURL(serverURL);
    IGS.agentSetName("Marioboard");
    IGS.inputCreate("whiteboardAction", iopTypes.IGS_STRING_T, "");
    IGS.outputCreate("userAction", iopTypes.IGS_STRING_T, "");
    IGS.observeInput("whiteboardAction", this.whiteboardActionInputCallback.bind(this));
  }

  @Startup
  public start() {
    IGS.start();
  }

  public whiteboardActionInputCallback(type: string, name: string, valueType: number, value: string, myData: any) {
    console.log(type, name, valueType, value, myData);

    const service = value.split(": ")[0].split(" ")[1];
    const args = value.split(": ")[1].split(", ");

    console.log(service, "called with args", args);

    // switch (service) {
    //   case "addShape":
    //     this.onAddShape(args[0], args[1], args[2], args[3], args[4], args[5]);
    //     break;
    //   case "remove":
    //     this.onRemoveShape(args[0], args[1], args[2], args[3], args[4], args[5]);
    //     break;
    //   case "moveTo":
    //     this.onMoveTo(args[0], args[1], args[2], args[3], args[4], args[5]);
    //     break;
    //   default:
    //     console.log("Unknown service called", service);
    // }

    // 1 'whiteboardAction' 3 'Service addShape: ellipse, 100, 300, 200, 100, #0000ff, #000000, 4' undefined

  }

  public onAddShape(senderAgentName: string, senderAgentUUID: string, serviceName: string, serviceArguments: any[], token: string, myData: any) {
    const typeValue = serviceArguments[0].value;
    const xValue = serviceArguments[1].value;
    const yValue = serviceArguments[2].value;
    const widthValue = serviceArguments[3].value;
    const heightValue = serviceArguments[4].value;
    const fillValue = serviceArguments[5].value;
    const strokeValue = serviceArguments[6].value;
    const strokeWidthValue = serviceArguments[7].value;

    const log = senderAgentName + " called service " + serviceName;
    console.log(log)

    //add code here if needed
  }

  public onRemoveShape(senderAgentName: string, senderAgentUUID: string, serviceName: string, serviceArguments: any[], token: string, myData: any) {
    const elementIdValue = serviceArguments[0].value;

    const log = senderAgentName + " called service " + serviceName;
    console.log(log)
    //add code here if needed
  }

  public onMoveTo(senderAgentName: string, senderAgentUUID: string, serviceName: string, serviceArguments: any[], token: string, myData: any) {
    const elementIdValue = serviceArguments[0].value;
    const xValue = serviceArguments[1].value;
    const yValue = serviceArguments[2].value;

    const log = senderAgentName + " called service " + serviceName;
    console.log(log)
    //add code here if needed
  }
}