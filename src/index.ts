const fps = 60;

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

import { moveAround } from "./moveAround";
import { zoom } from "./zoom";

import { getCells, layerCount, layerDistance } from "./generateCells";

import "./renderHTML";
import "./simulation";
import { updateDOM } from "./renderHTML";

let { width, height } = canvas;

const initTransform = () => {
    width = document.body.clientWidth;
    height = document.body.clientHeight;

    canvas.width = width;
    canvas.height = height;

    const shortest = Math.min(width, height);
    const spaceNeeded = 2 * layerDistance * (layerCount + 2);
    const scale = shortest / spaceNeeded;

    ctx.transform(scale, 0, 0, scale, width / 2, height / 2);
}

initTransform();
zoom(canvas, ctx);
moveAround(canvas, ctx);

const draw = () => {

    const cells = getCells();

    cells.forEach(cell => cell.renderLinks(ctx));
    cells.forEach(cell => cell.render(ctx));
}

window.setInterval(() => {

    // This feels wrong
    const saveTransform = ctx.getTransform();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.setTransform(saveTransform);

    draw();
}, 1000 / fps);

window.addEventListener('resize', initTransform);

updateDOM();