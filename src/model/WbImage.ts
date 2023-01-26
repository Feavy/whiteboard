export default interface WbImage {
  id: number;
  x: number;
  y: number;
  url: string;
}

export function image(url: string, x: number, y: number): WbImage {
  return {
    id: -1,
    url: url,
    x: x,
    y: y
  };
}

export function imageFromArgs(args: string[]): WbImage {
  return image(args[0], parseFloat(args[1]), parseFloat(args[2]));
}