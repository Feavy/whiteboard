import Phaser from "phaser";

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

export default config;