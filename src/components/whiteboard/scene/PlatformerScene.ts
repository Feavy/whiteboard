import * as Phaser from "phaser";

export default class PlatformerScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Image;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private canJump = false;

  public constructor(private width: number, private height: number) {
    super("Whiteboard");
  }

  public preload() {
    this.load.image("player", "assets/player.png");
  }

  public create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // Initialisation de MatterJS
    this.matter.world.createDebugGraphic();
    this.matter.world.setBounds(0, 0, this.width, this.height);

// Création des objets de jeu
    this.player = this.matter.add.image(200, 300, "player");
    this.player.setBody({
      type: "circle",
      radius: 25
    });
    this.player.setBounce(0.2);
    this.player.setFriction(0.05);

// Gestion des collisions
    this.matter.world.on("collisionstart", (event: MatterJS.IEventCollision<any>) => {
      event.pairs.forEach((collision) => {
        const playerBody = collision.bodyA === this.player.body ? collision.bodyA : collision.bodyB;
        const point = collision.activeContacts[0];

        if (point.vertex.y > this.player.y+20) {
          this.canJump = true;
          console.log("Can jump !");
        }
      });
    });

    this.input.on('pointerdown', (ev: any) => {
      console.log(ev.worldX, ev.worldY);
      this.matter.add.rectangle(ev.worldX, ev.worldY, 50, 50, {
        isStatic: true,
      });
    });
  }

  public update(time: number, delta: number) {
    const speed = delta / (1000 / 60);
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-3*speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(3*speed);
    } else {
      this.player.setVelocityX(this.player.body.velocity.x * 0.90 / speed);
    }
    if (this.cursors.up.isDown && this.canJump) {
      this.player.setAwake();
      console.log("Jump !");
      this.player.setVelocityY(-10*speed);
      this.canJump = false;
    }
  }
}
