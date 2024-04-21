import { getCells } from "./generateCells";
import { getEmotions } from "./generateEmotions";
import { updateSimulationStats } from "./renderHTML";
import { getRunning } from "./stateManagement";

const ticksPerSecond = 10;
let emotions: Emotion[] = []
let ticksLeft: TicksLeft[] = [];

const growthCD = 10;
let growthCounter = 0;

export const initSimulation = () => {
    emotions = getEmotions();
    ticksLeft = emotions.map(emotion => ({ num: emotion.realFrequency, emotion }));
}

setInterval(() => {    
    const running = getRunning();
    if (!running) return;

    const cells = getCells();
    emotions = getEmotions();
    const attackedCells: AttackedCell[] = [];

    growthCounter++;
    if (growthCounter === growthCD) {
        growthCounter = 0;
        emotions.forEach(emotion => {
            emotion.realPower += emotion.realGrowth;
        });
    }

    ticksLeft.forEach(tl => {        
        tl.num--;
        if (tl.num === 0) {
            tl.num = tl.emotion.realFrequency;

            const ownedCells = cells.filter(cell => cell.emotion === tl.emotion);

            ownedCells.forEach(cell => {
                
                cell.links.forEach(link => {
                    const targetCell = link.cell;

                    // if owned by the same emotion, ignore
                    if (targetCell.emotion === tl.emotion) return;

                    if (targetCell.immune > 0) {
                        targetCell.immune--;
                        return;
                    }

                    const critical = Math.random() < tl.emotion.realGrowth;
                    const damage = critical ? tl.emotion.realPower * 1.6 : tl.emotion.realPower;

                    const alreadyAttacked = attackedCells.find(ac => ac.cell === targetCell);
                    if (alreadyAttacked) {
                        
                        const alreadyAttackedByThisEmotion = alreadyAttacked.damageDealt.find(dd => dd.by === tl.emotion);

                        if (alreadyAttackedByThisEmotion) {
                            alreadyAttackedByThisEmotion.amount += damage;
                        } else {
                            alreadyAttacked.damageDealt.push({ by: tl.emotion, amount: damage });
                        }

                    } else {
                        attackedCells.push({ cell: targetCell, damageDealt: [{ by: tl.emotion, amount: damage }] });
                    }

                });
            });
        }
    });

    attackedCells.forEach(ac => {
        let shield = ac.cell.emotion?.realDefence || 0;
        const emotion = ac.cell.emotion;
        if (emotion != null) {
            ac.cell.links.forEach(link => {
                if (link.cell.emotion === ac.cell.emotion) {
                    shield += emotion.realDefence * 0.2;
                }
            });
        }
        const greatestAttack = ac.damageDealt.reduce((prev, current) => prev.amount > current.amount ? prev : current);
        
        if (shield < greatestAttack.amount) {
            ac.cell.emotion = greatestAttack.by;
            const { power, defence, frquency, growth } = ac.cell.emotion;
            ac.cell.immune = Math.trunc((power + defence + frquency + growth) / 4);
        }
    });

    if (attackedCells.length > 0) {
        updateSimulationStats();
    }

}, 1000 / ticksPerSecond);