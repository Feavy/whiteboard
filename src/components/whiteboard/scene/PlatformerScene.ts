import * as Phaser from "phaser";
import Event from "../../../utils/Event";
import generateAnimations from "./animations";

const MIN_SPEED = 1;
const MAX_SPEED = 3;

export default class PlatformerScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Sprite;

  private jumpSensor: MatterJS.BodyType;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private onFloor = false;


  private speed = 0;

  public readonly onClick: Event<Phaser.Geom.Point> = new Event();

  public constructor(private width: number, private height: number) {
    super("Whiteboard");
  }

  public preload() {
    this.load.atlas('atlas', '/assets/mario-atlas.png', '/assets/mario-atlas.json');
    this.load.on('complete', () => {
      generateAnimations(this);
    });
  }

  public create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.matter.set30Hz();

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
      this.onClick.trigger(new Phaser.Geom.Point(ev.x, ev.y));
      this.matter.add.rectangle(ev.worldX, ev.worldY, 50, 50, {
        isStatic: true,
      });
    });
  }

  public update(time: number, delta: number) {
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
      this.player.setVelocityY(-10);
      this.onFloor = false;
      this.player.play('jump', true)
    }
  }
}
