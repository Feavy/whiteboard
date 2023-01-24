import Singleton from "tydi/di/annotations/Singleton";
import MarioboardAgent from "./MarioboardAgent";
import Startup from "tydi/di/annotations/Startup";
import Event from "../../utils/Event";

@Singleton
export default class MarioboardService {
  private readonly agent: MarioboardAgent;

  public readonly onReady = new Event<void>();

  public constructor(serverURL: string) {
    this.agent = new MarioboardAgent(serverURL);
    this.agent.onActionInput.subscribe(this.whiteboardActionInputCallback.bind(this));
  }

  @Startup
  public start() {
    this.agent.start();
    setTimeout(() => {
      console.log("Marioboard Ready!")
      this.onReady.trigger();
    }, 3000);
  }

  private whiteboardActionInputCallback(value: string) {
    const service = value.split(": ")[0].split(" ")[1];
    const args = value.split(": ")[1].split(", ");

    console.log("[MarioboardService]", service, "called with args", args);
  }

}
