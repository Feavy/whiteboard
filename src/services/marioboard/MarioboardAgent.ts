import {IGS, iopTypes} from "../../ingescape";
import Event from "../../utils/Event";

export default class MarioboardAgent {
  public readonly onActionInput: Event<string> = new Event();
  public readonly onConnectionStateChange: Event<boolean> = new Event();

  public readonly onReady: Event<boolean> = new Event();

  public constructor(serverURL: string) {
    IGS.netSetServerURL(serverURL);
    IGS.agentSetName("Marioboard");
    IGS.inputCreate("action", iopTypes.IGS_STRING_T, "");
    IGS.observeInput("action", this.whiteboardActionInputCallback.bind(this));
    IGS.outputCreate("lastActionStatus", iopTypes.IGS_STRING_T, "");
    IGS.observeWebSocketState(this.isConnectedToServerChanged.bind(this));
  }

  public start() {
    IGS.start();
  }

  private isConnectedToServerChanged(isConnected: boolean) {
    console.log("isConnectedToServerChanged", isConnected);
    this.onConnectionStateChange.trigger(isConnected);
    this.onReady.trigger(isConnected && this.onActionInput.lastValue !== null);
  }

  private whiteboardActionInputCallback(type: string, name: string, valueType: number, value: string, myData: any) {
    // console.log("[MarioboardAgent] whiteboardActionInputCallback", type, name, valueType, value, myData);

    this.onReady.trigger(true);
    if(value === "") return;
    this.onActionInput.trigger(value);
  }

  public setLastActionStatus(status: string) {
    IGS.outputSetString("lastActionStatus", status);
  }
}
