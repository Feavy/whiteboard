import * as Phaser from "phaser";
import Event from "../../../utils/Event";
import generateAnimations from "./animations";
import WbElement from "../../../model/WbElement";

let MIN_SPEED = 1;
let MAX_SPEED = 3;

export default class PlatformerScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Sprite;

  private jumpSensor: MatterJS.BodyType;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private onFloor = false;

  private speed = 0;

  public readonly onClick: Event<Phaser.Math.Vector2> = new Event();

  private readonly elements: Map<number, WbElement> = new Map();

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
    this.matter.add.rectangle(element.x, element.y, element.width, element.height, {
      isStatic: true,
    });
    if(element.id == -1) {
      element.id = this.elements.size;
      console.error("Adding element with id -1!");
    }
    this.elements.set(element.id, element);
  }

  public create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // Initialisation de MatterJS
    this.matter.world.createDebugGraphic();
    this.matter.world.setBounds(0, 0, this.width, this.height);

// Création des objets de jeu
    this.player = this.matter.add.sprite(200, 300, "atlas");
    this.player.scale = 2;

    const corps = this.matter.bodies.rectangle(0, 0, 32, 32);

    this.matter.alignBody(corps, 0, 0, Phaser.Display.Align.CENTER);

    this.jumpSensor = this.matter.bodies.rectangle(0, 16, 24, 2);
    this.jumpSensor.isSensor = true;
    this.jumpSensor.label = "jumpSensor";

    const body: MatterJS.BodyType = this.matter.world.create(0, 0, 32, 32, {
      parts: [corps, this.jumpSensor],
    });

    this.player.setExistingBody(body);

    this.player.setBounce(0.2);
    this.player.setFriction(1);

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

    this.player.angle = 0;
    if (this.cursors.left.isDown) {
      this.player.scaleX = -2;
      this.speed -= delta / 100;
      if (this.speed > -MIN_SPEED) {
        this.speed = -MIN_SPEED;
      } else if (this.speed < -MAX_SPEED) {
        this.speed = -MAX_SPEED;
      }
      this.player.setVelocityX(this.speed);
      this.onFloor && this.player.play('run', true)
    } else if (this.cursors.right.isDown) {
      this.player.scaleX = 2;
      this.speed += delta / 100;
      if (this.speed < MIN_SPEED) {
        this.speed = MIN_SPEED;
      } else if (this.speed > MAX_SPEED) {
        this.speed = MAX_SPEED;
      }
      this.player.setVelocityX(this.speed);
      this.onFloor && this.player.play('run', true)
    } else if (this.onFloor) {
      this.player.setVelocityX(0);
      this.speed = 0;
      this.player.play('idle', true)
    }
    if (this.cursors.up.isDown && this.onFloor) {
      this.player.setAwake();
      this.player.setVelocityY(-10-(factor-1)*5);
      this.onFloor = false;
      this.player.play('jump', true)
    }
  }
}
