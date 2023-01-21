// @ts-nocheck
// Imports
import App from "./App";
import MarioboardAgent from "./services/MarioboardAgent";
import Dependencies from "tydi/lib/Dependencies";

// DependencyManager
const dependencies_5 = new Dependencies();

// Dependencies
const app_0 = new App();
const serverURL_2 = app_0.serverURL;
const marioboardAgent_4 = new MarioboardAgent(serverURL_2);

// Lazy injects

// Register dependencies in DependencyManager
dependencies_5.register("App", app_0);
dependencies_5.register("serverURL", serverURL_2);
dependencies_5.register("MarioboardAgent", marioboardAgent_4);
dependencies_5.register("Dependencies", dependencies_5);

// Run @Startup methods
app_0.render();
marioboardAgent_4.start();
