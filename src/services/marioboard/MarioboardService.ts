import Singleton from "tydi/di/annotations/Singleton";
import MarioboardAgent from "./MarioboardAgent";
import Startup from "tydi/di/annotations/Startup";
import Event from "../../utils/Event";
import {WbElement} from "../../model/WbElement";
import {shapeFromArgs} from "../../model/WbShape";
import {imageFromArgs} from "../../model/WbImage";

@Singleton
export default class MarioboardService {
  private readonly agent: MarioboardAgent;

  public readonly onConnectionStateChange = new Event<boolean>();
  public readonly onReady = new Event<boolean>();
  public readonly onClear = new Event<void>();

  public readonly onAddElement = new Event<WbElement>();
  public readonly onMoveElement = new Event<{ id: number, x: number, y: number }>();
  public readonly onRemoveElement = new Event<number>();

  public constructor(serverURL: string) {
    this.agent = new MarioboardAgent(serverURL);
    this.agent.onActionInput.subscribe(this.whiteboardActionInputCallback.bind(this));
    this.onConnectionStateChange = this.agent.onConnectionStateChange;
    this.onReady = this.agent.onReady;
  }

  @Startup
  public start() {
    this.agent.start();
  }

  private whiteboardActionInputCallback(value: string) {
    const service = value.includes(":") ? value.split(": ")[0].split(" ")[1] : value;
    const args = value.includes(":") ? value.split(": ")[1].split(", ") : [];

    // console.log("[MarioboardService] Received input: ", value);

    switch (service) {
      case "addShape":
        this.onAddElement.trigger(shapeFromArgs(args));
        break;
      case "addImageFromUrl":
        this.onAddElement.trigger(imageFromArgs(args));
      case "moveTo":
        this.onMoveElement.trigger({id: parseInt(args[0]), x: parseInt(args[1]), y: parseInt(args[2])});
        break;
      case "remove":
        console.log("remove");
        this.onRemoveElement.trigger(parseInt(args[0]));
        break;
      case "clear":
        console.log("clear");
        this.onClear.trigger();
        break;
      default:
        console.log("[MarioboardService] Input not handled: ", service);
    }
  }
}
