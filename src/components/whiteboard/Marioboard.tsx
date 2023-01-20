import './Whiteboard.css'
import { fabric } from 'fabric';
import {useEffect, useRef, useState} from "react";
import Toolbar from "./toolbar/Toolbar";
import Phaser from "phaser";
import PlatformerScene from "./scene/PlatformerScene";

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

function Marioboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let initialized: boolean = false;

  useEffect(() => {
    if(initialized) {
      return;
    }

    const width = containerRef.current?.clientWidth || 0;
    const height = containerRef.current?.clientHeight || 0;

    const scene = new PlatformerScene(width, height);

    config.width = width;
    config.height = height;
    console.log("ref", canvasRef)
    config.canvas = canvasRef.current!!;
    config.scene = scene;

    new Phaser.Game(config);

    initialized = true;
  });

  return (
      <div id="whiteboard" ref={containerRef}>
        <h1 id="title">Whiteboard</h1>
        <canvas id="canvas" ref={canvasRef}/>
        <Toolbar/>
      </div>
  )
}

export default Marioboard;
