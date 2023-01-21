import {IGS, iopTypes} from "../ingescape";
import Singleton from "tydi/di/annotations/Singleton";
import Startup from "tydi/di/annotations/Startup";

@Singleton
export default class MarioboardAgent {

  public constructor(serverURL: string) {
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

  private whiteboardActionInputCallback(type: string, name: string, valueType: number, value: string, myData: any) {
    console.log(type, name, valueType, value, myData);

    const service = value.split(": ")[0].split(" ")[1];
    const args = value.split(": ")[1].split(", ");

    console.log(service, "called with args", args);
  }

  public outputClientAction() {
    IGS.outputSetString("clientAction", "");
  }
}