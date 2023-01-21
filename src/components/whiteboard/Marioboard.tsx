import './Whiteboard.css'
import React, {useEffect, useRef} from "react";
import Toolbar from "./toolbar/Toolbar";
import Phaser from "phaser";
import PlatformerScene from "./scene/PlatformerScene";
import Singleton from "tydi/di/annotations/Singleton";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  backgroundColor: '#ffffff',
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      enableSleeping: false
    }
  }
};

@Singleton
export default class Marioboard {
  private _game: Phaser.Game;
  private _scene: PlatformerScene;

  constructor() {
    this.view = this.view.bind(this);
  }

  public get game() {
    return this._game;
  }

  public get scene() {
    return this._scene;
  }

  public view() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let initialized: boolean = false;

    useEffect(() => {
      if(initialized) {
        return;
      }

      const width = containerRef.current?.offsetWidth || 0;
      const height = containerRef.current?.offsetHeight || 0;

      this._scene = new PlatformerScene(width, height);

      config.width = width;
      config.height = height;

      config.canvas = canvasRef.current!!;
      config.scene = this._scene;

      this._game = new Phaser.Game(config);

      initialized = true;
    }, []);

    return (
        <div id="whiteboard" ref={containerRef}>
          <h1 id="title">Whiteboard</h1>
          <canvas id="canvas" ref={canvasRef}/>
          <Toolbar/>
        </div>
    );
  }
}
