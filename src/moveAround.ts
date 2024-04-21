const sesnitivity = -0.4;
const scaleFactor = 1 - 0.1;

export const moveAround = (el: HTMLElement, ctx: CanvasRenderingContext2D): void => {
    let pointerDown = false;
    let startPos: Vector2 = { x: 0, y: 0 };

    el.addEventListener('mousedown', (e) => {
        pointerDown = true;
        startPos = { x: e.clientX, y: e.clientY };
    });

    el.addEventListener('mousemove', (e) => {
        if (pointerDown) {
            const ctxTransform = ctx.getTransform();

            const ctxScale = ctxTransform.a;
            const currentTransformX = ctxTransform.e;
            const currentTransformY = ctxTransform.f;

            const newTransformX = currentTransformX - (e.clientX - startPos.x) * sesnitivity;
            const newTransformY = currentTransformY - (e.clientY - startPos.y) * sesnitivity;

            ctx.setTransform(ctxScale, 0, 0, ctxScale, newTransformX, newTransformY);

            startPos = { x: e.clientX, y: e.clientY };
        }
    });

    // special kid
    el.onmouseleave = () => {
        pointerDown = false;
    }

    el.addEventListener('mouseup', (e) => {
        pointerDown = false;      
    });
}