import Singleton from "tydi/di/annotations/Singleton";
import MarioboardAgent from "./MarioboardAgent";
import Startup from "tydi/di/annotations/Startup";

@Singleton
export default class MarioboardService {
  private readonly agent: MarioboardAgent;

  public constructor(serverURL: string) {
    this.agent = new MarioboardAgent(serverURL);
    this.agent.onActionInput.subscribe(this.whiteboardActionInputCallback.bind(this));
  }

  @Startup
  public start() {
    this.agent.start();
  }

  private whiteboardActionInputCallback(value: string) {
    const service = value.split(": ")[0].split(" ")[1];
    const args = value.split(": ")[1].split(", ");

    console.log("[MarioboardService]", service, "called with args", args);
  }

}