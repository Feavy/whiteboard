import './Whiteboard.css'
import React, {useEffect, useRef} from "react";
import Toolbar from "./toolbar/Toolbar";
import Phaser from "phaser";
import PlatformerScene from "./scene/PlatformerScene";
import Singleton from "tydi/di/annotations/Singleton";
import config from "./scene/config";
import WbShape, {shape} from "../../model/WbShape";
import WhiteboardService from "../../services/whiteboard/WhiteboardService";
import MarioboardService from "../../services/marioboard/MarioboardService";
import Inject from "tydi/di/annotations/Inject";
import {WbElement} from "../../model/WbElement";

@Singleton
export default class Marioboard {
  private _game: Phaser.Game;
  private _scene: PlatformerScene;

  private _initialized: boolean = false;
  private _sceneInitialized: boolean = false;

  private marioId: number = -1;

  @Inject
  private marioboardService: MarioboardService;

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

  private setupScene(width: number, height: number, canvas: HTMLCanvasElement) {
    if(this._sceneInitialized) return;
    this._sceneInitialized = true;

    this._scene = new PlatformerScene(width, height);
    this._scene.onClick.subscribe(this.onClick);

    config.width = width;
    config.height = height;

    config.canvas = canvas;
    config.scene = this._scene;

    this._game = new Phaser.Game(config);
  }

  private setup() {
    if(this._initialized) return;
    this._initialized = true;

    this.marioboardService.onAddElement.subscribe(this.onAddElement.bind(this));

    this.marioboardService.onReady.subscribe((ready) => {
      if(!ready || ready == this.marioboardService.onReady.lastValue) return;
      this.onMarioboardServiceReady();
    });

    this.marioboardService.onMoveElement.subscribe(({id, x, y}) => this.onMoveElement(id, x, y));
  }

  private onMarioboardServiceReady() {
    // Fetch initial elements and add them to the scene
    this.whiteboardService.getElements().then(elements => {
      // TODO : Transformer WbShape en interface
      elements.forEach(this._scene.addElement.bind(this._scene));
    });

    this.whiteboardService.addElement(shape("rectangle", 100, 100, 32, 32, "white", "black", 1)).then(id => {
      this.marioId = id;

      setInterval(() => {
        const {x, y} = this._scene.player;
        this.whiteboardService.moveElement(this.marioId, x, y);
      }, 100);
    });
  }

  private onAddElement(element: WbElement) {
    this._scene.addElement(element);
  }

  private onMoveElement(id: number, x: number, y: number) {
    if(id == this.marioId) return;
    this._scene.moveElement(id, x, y);
  }

  private onClick(point: Phaser.Math.Vector2) {
    const elem = shape("rectangle", point.x, point.y, 50, 50, "#ffffff", "#000000", 1);
    this.whiteboardService.addElement(elem);
  }

  public view() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if(!canvasRef.current) return;

      const width = containerRef.current?.offsetWidth || 0;
      const height = containerRef.current?.offsetHeight || 0;

      console.log(width, height, canvasRef.current);

      this.setupScene(width, height, canvasRef.current!);
      this.setup();
    }, []);

    const ready = this.marioboardService.onReady.asState();
    const connected = this.marioboardService.onConnectionStateChange.asState();

    return (
        <div id="whiteboard" ref={containerRef}>
          <h1 id="title">Marioboard</h1>
          <div id="status">
            <span style={{color: connected ? "#009688" : "#f44336"}}>{connected ? "Connected" : "Not connected"} </span>
            <span style={{color: ready ? "#009688" : "#f44336"}}>{ready ? "ready" : "unready"}</span>
          </div>
          <canvas id="canvas" ref={canvasRef}/>
          <Toolbar/>
        </div>
    );
  }
}
