export default (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'run',
    frames: scene.anims.generateFrameNames('atlas', {
      prefix: 'mario-atlas_',
      start: 1,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1
  });

  scene.anims.create({
    key: 'idle',
    frames: [{ key: 'atlas', frame: 'mario-atlas_0' }],
    frameRate: 10
  });

  scene.anims.create({
    key: 'jump',
    frames: [{ key: 'atlas', frame: 'mario-atlas_4' }],
    frameRate: 10
  });

  scene.anims.create({
    key: 'die',
    frames: [{ key: 'atlas', frame: 'mario-atlas_5' }],
    frameRate: 10
  });

  scene.anims.create({
    key: 'goomba',
    frames: scene.anims.generateFrameNames('atlas', {
      prefix: 'goomba-atlas_',
      start: 0,
      end: 1,
    }),
    frameRate: 4,
    repeat: -1
  });
};