// @ts-nocheck
// Imports
import App from "./App";
import Dependencies from "tydi/lib/Dependencies";
import Marioboard from "./components/whiteboard/Marioboard";
import MarioboardService from "./services/marioboard/MarioboardService";
import WhiteboardService from "./services/whiteboard/WhiteboardService";

// DependencyManager
const dependencies_5 = new Dependencies();

// Dependencies
const whiteboardService_10 = new WhiteboardService();
const marioboard_7 = new Marioboard(whiteboardService_10);
const app_1 = new App(marioboard_7);
const serverURL_4 = app_1.serverURL;
const marioboardService_9 = new MarioboardService(serverURL_4);

// Lazy injects

// Register dependencies in DependencyManager
dependencies_5.register("App", app_1);
dependencies_5.register("serverURL", serverURL_4);
dependencies_5.register("Dependencies", dependencies_5);
dependencies_5.register("Marioboard", marioboard_7);
dependencies_5.register("MarioboardService", marioboardService_9);
dependencies_5.register("WhiteboardService", whiteboardService_10);

// Run @Startup methods
app_1.render();
marioboardService_9.start();
