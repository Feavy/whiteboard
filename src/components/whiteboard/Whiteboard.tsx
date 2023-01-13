import './Whiteboard.css'
import { fabric } from 'fabric';
import {useEffect, useRef} from "react";
import Toolbar from "./toolbar/Toolbar";

function Whiteboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const width = containerRef.current?.clientWidth || 0;
    const height = containerRef.current?.clientHeight || 0;

    const canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true,
      backgroundColor: 'white',
      width: width,
      height: height,
    });
    canvasRef.current = canvas;
    return () => {
      canvas.dispose();
      canvasRef.current = null;
    };
  });

  return (
      <div id="whiteboard" ref={containerRef}>
        <h1 id="title">Whiteboard</h1>
        <canvas id="canvas" ref={canvasRef}/>
        <Toolbar/>
      </div>
  )
}

export default Whiteboard;
