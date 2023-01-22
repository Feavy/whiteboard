import {IGS, iopTypes} from "../../ingescape";
import Event from "../../utils/Event";

export default class MarioboardAgent {
  public readonly onActionInput: Event<string> = new Event();

  public constructor(serverURL: string) {
    IGS.netSetServerURL(serverURL);
    IGS.agentSetName("Marioboard");
    IGS.inputCreate("whiteboardAction", iopTypes.IGS_STRING_T, "");
    IGS.outputCreate("userAction", iopTypes.IGS_STRING_T, "");
    IGS.observeInput("whiteboardAction", this.whiteboardActionInputCallback.bind(this));
  }

  public start() {
    IGS.start();
  }

  private whiteboardActionInputCallback(type: string, name: string, valueType: number, value: string, myData: any) {
    console.log("whiteboardActionInputCallback", type, name, valueType, value, myData);

    this.onActionInput.trigger(value);
  }

  public outputClientAction(output: string) {
    IGS.outputSetString("clientAction", output);
  }
}