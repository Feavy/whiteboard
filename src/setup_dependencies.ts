// @ts-nocheck
// Imports
import App from "./App";
import MarioboardAgent from "./agents/MarioboardAgent";
import Dependencies from "tydi/lib/Dependencies";
import Marioboard from "./components/whiteboard/Marioboard";

// DependencyManager
const dependencies_7 = new Dependencies();

// Dependencies
const marioboard_8 = new Marioboard();
const app_1 = new App(marioboard_8);
const serverURL_4 = app_1.serverURL;
const marioboardAgent_6 = new MarioboardAgent(serverURL_4);

// Lazy injects

// Register dependencies in DependencyManager
dependencies_7.register("App", app_1);
dependencies_7.register("serverURL", serverURL_4);
dependencies_7.register("MarioboardAgent", marioboardAgent_6);
dependencies_7.register("Dependencies", dependencies_7);
dependencies_7.register("Marioboard", marioboard_8);

// Run @Startup methods
app_1.render();
marioboardAgent_6.start();
