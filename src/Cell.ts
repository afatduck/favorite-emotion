import { getRunning, gsSelectedEmotion } from "./stateManagement";

export class Cell implements CellType {
    id: number;
    pos: Vector2;
    emotion: Emotion | null;
    immune: number;
    links: {
        cell: CellType;
        rendered: boolean;
    }[];

    constructor(id: number, pos: Vector2, emotion: Emotion | null) {
        this.pos = pos;
        this.emotion = emotion;
        this.links = [];
        this.id = id;
        this.immune = 0;
    }

    render(ctx: CanvasRenderingContext2D): void {

        if (this.emotion && this.emotion.id === gsSelectedEmotion.get().id) {
            ctx.beginPath();
            ctx.fillStyle = this.emotion.colour + '55';
            ctx.arc(this.pos.x, this.pos.y, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(this.pos.x, this.pos.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = this.emotion ? this.emotion.colour: '#444';
        ctx.arc(this.pos.x, this.pos.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    renderLinks(ctx: CanvasRenderingContext2D): void {
        this.links.forEach(({ cell, rendered }) => {
            if (!rendered) {
                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.lineTo(cell.pos.x, cell.pos.y);
                ctx.strokeStyle = 'lightgray';
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.closePath();
            }
        });
    }

    link(cell: CellType): void {
        const newCellId = cell.id;
        const alreadyLinked = this.links.some(({ cell }) => cell.id === newCellId);
        if (!alreadyLinked) {
            this.links.push({
                cell,
                rendered: false
            });
            cell.link(this);
        }
    }
}