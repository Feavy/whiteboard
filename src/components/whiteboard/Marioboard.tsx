import './Whiteboard.css'
import React, {useEffect, useRef} from "react";
import Toolbar from "./toolbar/Toolbar";
import Phaser from "phaser";
import PlatformerScene from "./scene/PlatformerScene";
import Singleton from "tydi/di/annotations/Singleton";
import config from "./scene/config";
import WbShape from "../../model/WbShape";
import WhiteboardService from "../../services/whiteboard/WhiteboardService";

@Singleton
export default class Marioboard {
  private _game: Phaser.Game;
  private _scene: PlatformerScene;

  private _initialized: boolean = false;

  constructor(private readonly whiteboardService: WhiteboardService) {
    this.view = this.view.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  public get game() {
    return this._game;
  }

  public get scene() {
    return this._scene;
  }

  private setup(width: number, height: number, canvas: HTMLCanvasElement) {
    if(this._initialized) return;

    this._scene = new PlatformerScene(width, height);
    this._scene.onClick.subscribe(this.onClick);

    config.width = width;
    config.height = height;

    config.canvas = canvas;
    config.scene = this._scene;

    this._game = new Phaser.Game(config);

    this._initialized = true;
    this.whiteboardService.getElements();
  }

  private onClick(point: Phaser.Math.Vector2) {
    const elem = new WbShape("rectangle", point.x, point.y, 50, 50, "white", "black", 1);
    this.scene.addElement(elem);
    this.whiteboardService.addElement(elem);
  }

  public view() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const width = containerRef.current?.offsetWidth || 0;
      const height = containerRef.current?.offsetHeight || 0;

      this.setup(width, height, canvasRef.current!);
    }, []);

    return (
        <div id="whiteboard" ref={containerRef}>
          <h1 id="title">Marioboard</h1>
          <canvas id="canvas" ref={canvasRef}/>
          <Toolbar/>
        </div>
    );
  }
}
