import './App.css'
import Marioboard from "./components/whiteboard/Marioboard";
import Chat from "./components/chat/Chat";
import Singleton from "tydi/di/annotations/Singleton";
import ReactDOM from "react-dom/client";
import React from "react";
import Startup from "tydi/di/annotations/Startup";
import Produces from "tydi/di/annotations/Produces";

@Singleton
export default class App {
  @Produces
  public serverURL: string = "ws://localhost:5001";

  constructor(private readonly marioboard: Marioboard) {
  }

  @Startup
  public render() {
    const Marioboard = this.marioboard.view;

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <React.StrictMode>
          <div id="app">
            <Marioboard/>
          </div>
        </React.StrictMode>
    );
  }
}

// function App() {
//   return (
//     <div id="app">
//       <Marioboard />
//       <Chat />
//     </div>
//   )
// }
