import * as Phaser from "phaser";
import Event from "../../../utils/Event";
import generateAnimations from "./animations";
import WbShape from "../../../model/WbShape";
import {colorToNumber} from "./colorToNumber";
import {isImage, isShape, WbElement} from "../../../model/WbElement";
import WbImage from "../../../model/WbImage";

let MIN_SPEED = 1;
let MAX_SPEED = 3;

export default class PlatformerScene extends Phaser.Scene {
  private _player: Phaser.Physics.Matter.Sprite;
  public nextId: number = 0;

  public get player() {
    return this._player;
  }

  private jumpSensor: MatterJS.BodyType;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private onFloor = false;

  private speed = 0;

  public readonly onClick: Event<Phaser.Math.Vector2> = new Event();

  private readonly elements: Map<number, Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image> = new Map();

  public constructor(private width: number, private height: number) {
    super("Whiteboard");
  }

  public preload() {
    this.load.atlas('atlas', '/assets/mario-atlas.png', '/assets/mario-atlas.json');
    this.load.on('complete', () => {
      generateAnimations(this);
    });
  }

  public addElement(element: WbElement) {
    if (element.id == -1) {
      element.id = this.nextId++;
    }

    if (isShape(element)) {
      this.addShape(element);
    } else if (isImage(element)) {
      if("source" in element) {
        //@ts-ignore
        element.url = element.source;
      }
      this.addImage(element);
    }
  }

  public removeElement(id: number) {
    const element = this.elements.get(id);
    console.trace("id", id, element);
    if (element) {
      this.matter.world.remove(element.body);
      element.destroy();
      this.elements.delete(id);
    }
  }

  public addShape(element: WbShape) {
    console.log("[PlatformerScene] addShape", element);

    if (element.type === "rectangle") {
      console.log("fill", colorToNumber(element.fill), 0xffffff);
      const rect = this.add.rectangle(element.x, element.y, element.width, element.height, colorToNumber(element.fill));
      rect.setStrokeStyle(element.strokeWidth, colorToNumber(element.stroke));
      rect.body = this.matter.add.rectangle(element.x, element.y, element.width, element.height, {
        isStatic: true,
      });
      rect.width = element.width;
      rect.height = element.height;
      this.elements.set(element.id, rect);
    }
  }

  public addImage(image: WbImage) {
    console.log("[PlatformerScene] addImage", image);

    if(image.url == "https://marioboard.netlify.app/assets/goomba.png") {
      const goomba = this.add.sprite(image.x, image.y, "atlas");
      goomba.scale = 2;
      goomba.play("goomba", true);
      this.elements.set(image.id, goomba);
    }else{
      const img = this.add.image(image.x, image.y, image.url);
      img.body = this.matter.add.rectangle(image.x, image.y, 32, 32, {
        isStatic: true,
      });
      this.elements.set(image.id, img);
    }
  }

  public moveElement(id: number, x: number, y: number) {
    const element = this.elements.get(id);
    if(element && (element.x != x || element.y != y)) {
      console.log("element", element);
      element.x = x;
      element.y = y;
    }
  }

  public removeAll() {
    this.elements.forEach((element) => {
      this.matter.world.remove(element.body);
      element.destroy();
    });
    this.elements.clear();
  }

  public create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // Initialisation de MatterJS
    this.matter.world.createDebugGraphic();
    this.matter.world.setBounds(0, 0, this.width, this.height);

// Création des objets de jeu
    this._player = this.matter.add.sprite(200, 300, "atlas");
    this._player.scale = 2;

    const corps = this.matter.bodies.rectangle(0, 0, 32, 32);

    this.matter.alignBody(corps, 0, 0, Phaser.Display.Align.CENTER);

    this.jumpSensor = this.matter.bodies.rectangle(0, 16, 24, 2);
    this.jumpSensor.isSensor = true;
    this.jumpSensor.label = "jumpSensor";

    const body: MatterJS.BodyType = this.matter.world.create(0, 0, 32, 32, {
      parts: [corps, this.jumpSensor],
    });

    this._player.setExistingBody(body);

    this._player.setBounce(0.2);
    this._player.setFriction(1);

    // Gestion des collisions
    this.matter.world.on("collisionstart", (event: MatterJS.IEventCollision<any>) => {
      event.pairs.forEach((collision) => {
        if (collision.bodyA === this.jumpSensor || collision.bodyB === this.jumpSensor) {
          this.onFloor = true;
        }
      });
    });

    this.input.on('pointerdown', (ev: any) => {
      this.onClick.trigger(new Phaser.Math.Vector2  (ev.x, ev.y));
    });
  }

  // Gestion des déplacements
  public update(time: number, delta: number) {
    const factor = delta / (1000 / 144);
    MAX_SPEED = 3 * factor;

    this.matter.world.setGravity(0, factor);

    this._player.angle = 0;
    if (this.cursors.left.isDown) {
      this._player.scaleX = -2;
      this.speed -= delta / 100;
      if (this.speed > -MIN_SPEED) {
        this.speed = -MIN_SPEED;
      } else if (this.speed < -MAX_SPEED) {
        this.speed = -MAX_SPEED;
      }
      this._player.setVelocityX(this.speed);
      this.onFloor && this._player.play('run', true)
    } else if (this.cursors.right.isDown) {
      this._player.scaleX = 2;
      this.speed += delta / 100;
      if (this.speed < MIN_SPEED) {
        this.speed = MIN_SPEED;
      } else if (this.speed > MAX_SPEED) {
        this.speed = MAX_SPEED;
      }
      this._player.setVelocityX(this.speed);
      this.onFloor && this._player.play('run', true)
    } else if (this.onFloor) {
      this._player.setVelocityX(0);
      this.speed = 0;
      this._player.play('idle', true)
    }
    if (this.cursors.up.isDown && this.onFloor) {
      this._player.setAwake();
      this._player.setVelocityY(-10-(factor-1)*5);
      this.onFloor = false;
      this._player.play('jump', true)
    }
  }
}
