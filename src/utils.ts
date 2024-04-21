export const easeOut = (set: (n: number) => void, start : number, stop: number, duration = .5) => {
    const change = Math.abs(stop - start);
    const negative = stop < start;
    const startTime = Date.now();
    let progression = 0;
    let timeProgression = 0;
    let cancel: () => void = () => {};
    const intervalID = setInterval(() => {
        timeProgression = (Date.now() - startTime) / 1000 / duration;
        progression = 1 - (1 - timeProgression) * (1 - timeProgression);
        if (timeProgression >= 1) {
            set(stop);
            cancel();
            return;
        };
        set(start + change * progression * (negative ? -1 : 1));
    }, 1000 / 60);
    cancel = () => clearInterval(intervalID);
    return cancel;
};