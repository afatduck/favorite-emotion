import { generateCells } from "./generateCells";
import { initSimulation } from "./simulation";
import { gsSelectedEmotion } from "./stateManagement";

const df = [
    "Tranqiulity",
    "Euphoria",
    "Joy",
    "Surprise",
    "Contentment",
    "Excitement",
    "Relief",
    "Love",
    "Pride",
    "Curiosity",
]

const hslToRgbHex = (h: number, s: number, l: number) => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    const rHex = Math.floor((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.floor((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.floor((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}

const generateColors = (count: number) => {
    const step = 360 / count;
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(hslToRgbHex(i * step, 1, .5));
    }
    return colors;
}

export const generateEmotions = (emotions = df): Emotion[] => {
    const count = emotions.length;
    const colors = generateColors(count);
    return emotions.map((emotion, i) => ({ 
        id: i,
        name: emotion,
        colour: colors[i],
        defence: 1,
        frquency: 1,
        growth: 1,
        power: 1,
        realDefence: 1,
        realFrequency: 1,
        realGrowth: 1,
        realPower: 1
     }));
}

const emotionsJSON = localStorage.getItem('emotions');
let emotions: Emotion[];

export const regerateColors = () => {
    const count = emotions.length;
    const colors = generateColors(count);
    for (let i = 0; i < count; i++) {
        emotions[i].colour = colors[i];
    }
    generateCells();
    initSimulation();
}

try {
    emotions = JSON.parse(emotionsJSON as string);
    if (!emotions) throw new Error('No emotions');
}
catch { 
    emotions = generateEmotions();
}

export const emotionsToDefault = () => {
    const gsSelected = gsSelectedEmotion;
    gsSelected.set(emotions[0]);
    emotions = generateEmotions();
    localStorage.setItem('emotions', JSON.stringify(emotions));
    regerateColors();
}

export const getEmotions = () => emotions;
