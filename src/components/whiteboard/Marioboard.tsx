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
import {image} from "../../model/WbImage";

@Singleton
export default class Marioboard {
  private _game: Phaser.Game;
  private _scene: PlatformerScene;

  private _initialized: boolean = false;
  private _sceneInitialized: boolean = false;

  private marioId: number = -1;
  private previousPosition: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

  @Inject
  private marioboardService: MarioboardService;

  constructor(private readonly whiteboardService: WhiteboardService) {
    this.view = this.view.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onAddElement = this.onAddElement.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onMoveElement = this.onMoveElement.bind(this);
    this.onRemoveElement = this.onRemoveElement.bind(this);
    this.onMarioboardServiceReady = this.onMarioboardServiceReady.bind(this);
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

    this.marioboardService.onAddElement.subscribe(this.onAddElement);
    this.marioboardService.onClear.subscribe(this.onClear);
    this.marioboardService.onReady.subscribe(this.onMarioboardServiceReady);
    this.marioboardService.onMoveElement.subscribe(this.onMoveElement);
    this.marioboardService.onRemoveElement.subscribe(this.onRemoveElement)
  }

  private onMarioboardServiceReady(status: boolean) {
    if(!status) return;

    this.marioboardService.onReady.unsubscribe(this.onMarioboardServiceReady);

    // Fetch initial elements and add them to the scene
    this.whiteboardService.getElements().then(elements => {
      elements.forEach(this._scene.addElement.bind(this._scene));
    });

    // Add player to the scene
    this.whiteboardService.addElement(image("https://marioboard.netlify.app/assets/goomba.png", 16, 16)).then(id => {
      this.marioId = id;
      this.scene.nextId = this.marioId+1;

      setInterval(() => {
        let {x, y} = this._scene.player;
        x = Math.round(x);
        y = Math.round(y);
        if(x != this.previousPosition.x || y != this.previousPosition.y) {
          this.whiteboardService.moveElement(this.marioId, x, y);
          this.previousPosition.set(x, y);
        }
      }, 1000/60);
    });
  }

  private onAddElement(element: WbElement) {
    if(element.id == this.marioId) return;
    this._scene.addElement(element);
  }

  private onMoveElement({id, x, y}: {id: number, x: number, y: number}) {
    if(id == this.marioId) return;
    this._scene.moveElement(id, x, y);
  }

  private onRemoveElement(id: number) {
    if(id == this.marioId) return;
    this._scene.removeElement(id);
  }

  private onClear() {
    this._scene.removeAll();
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
