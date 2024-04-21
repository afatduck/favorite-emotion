import { easeOut } from "./utils";

// for the love of god, please don't look at this code

const scaleFactor = 1 - .38;

export const zoom = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {

    let cancelLastEase: () => void = () => {};

    const cursor = { x: 0, y: 0 };
    const gsCursor: getSet<Vector2> = {
        get: () => cursor,
        set: (v: Vector2) => {
            cursor.x = v.x;
            cursor.y = v.y;
        }
    };
    
    let scale = ctx.getTransform().a;
    const gsScale: getSet<number> = {
        get: () => scale,
        set: (s: number) => {
            const { e, f } = ctx.getTransform();
            
            const offsetX = e;
            const offsetY = f;

            const cursorX = gsCursor.get().x;
            const cursorY = gsCursor.get().y;

            const newOffsetX = cursorX - (cursorX - offsetX) * (s / scale);
            const newOffsetY = cursorY - (cursorY - offsetY) * (s / scale);

            scale = s;

            ctx.setTransform(s, 0, 0, s, newOffsetX, newOffsetY);
        }
    }

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        cancelLastEase();
        const oldScale = gsScale.get();
        const newScale = oldScale * (e.deltaY > 0 ? scaleFactor : 1 / scaleFactor);

        const cursorX = e.clientX - canvas.getBoundingClientRect().left;
        const cursorY = e.clientY - canvas.getBoundingClientRect().top;

        gsCursor.set({ x: cursorX, y: cursorY });

        cancelLastEase = easeOut(gsScale.set, oldScale, newScale)
    });

    // make the mobile experience less bad ✅
    // add hide gui button ✅
    // make move and zoom work for mobile ✅
    // try to make things look better, less rigid
    // make ticksleft update when emotions are added or removed ✅
    // add reset button ✅
    // add default settings button ✅
    // add a little window that shows the number of occupied cells by each emotion ✅
    // gray out emotion settings while simulation is running ✅

    // we got the product!!!! 🎉🎉🎉🎉🎉

};