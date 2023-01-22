import WbElement from "./WbElement";

export default class WbShape extends WbElement {
    public readonly shape: string;
    public readonly fill: string;
    public readonly stroke: string;
    public readonly strokeWidth: number;

    constructor(shape: string, x: number, y: number, width: number, height: number, fill: string, stroke: string, strokeWidth: number) {
        super(-1, x, y, width, height);
        this.shape = shape;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }
}