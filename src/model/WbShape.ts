export default interface WbShape {
    id: number;
    type: string;

    x: number;
    y: number;

    width: number;
    height: number;

    fill: string;
    stroke: string;
    strokeWidth: number;
}

export function shape(type: string, x: number, y: number, width: number, height: number, fill: string, stroke: string, strokeWidth: number): WbShape {
    return {
        id: -1,
        type: type,
        x: x,
        y: y,
        width: width,
        height: height,
        fill: fill,
        stroke: stroke,
        strokeWidth: strokeWidth
    };
}

export function shapeFromArgs(args: string[]): WbShape {
    return shape(args[0], Number.parseInt(args[1]), Number.parseInt(args[2]), Number.parseInt(args[3]), Number.parseInt(args[4]), args[5], args[6], Number.parseInt(args[7]));
}