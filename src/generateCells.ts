import { Cell } from "./Cell"
import { getEmotions } from "./generateEmotions"

export const layerCount = 8
export const layerDistance = 60
const spreadFrom = 6
const cells: Cell[] = []
const layers: Cell[][] = []
let c = 0

export const generateCells = (): void =>{
    cells.length = 0
    layers.length = 0

    const emotions = getEmotions()
    const emotionCount = emotions.length

    for (let i = 0; i <= layerCount; i++) {
        const newLayer: Cell[] = []
        const dense = Math.max(0, i-3)
        const spreads = i >= spreadFrom
    
        if (i === 0) {
            const newCell = new Cell(c++, { x: 0, y: 0 }, null)
            cells.push(newCell)
            newLayer.push(newCell)
            layers.push(newLayer)
            continue
        }
    
        for (let j = 0; j < emotionCount; j++) {
            const angle = (360 / emotionCount * j) * Math.PI / 180
            const x = Math.cos(angle) * layerDistance * i
            const y = Math.sin(angle) * layerDistance * i
            const newCell = new Cell(c++, { x, y }, null)
    
            let l = dense;
            for (let k = 0; l > 0 && !spreads; k++) {            
                const angle = (360 / emotionCount * j - ((--l + 1) / (dense + 1) * 360 / emotionCount)) * Math.PI / 180
                const x = Math.cos(angle) * layerDistance * i   
                const y = Math.sin(angle) * layerDistance * i
                const newCell = new Cell(c++, { x, y }, null)
                cells.push(newCell)
                newLayer.push(newCell)
            }
            cells.push(newCell)
            newLayer.push(newCell)
        }
    
        const lastLayer = layers[i - 1]
        let l = 0
        if (!spreads) for (let j = 0; j < newLayer.length; j++) {
            const next = newLayer[(j + 1) % newLayer.length]
            newLayer[j].link(next)
            
            if (dense && (j % (dense + 1) !== dense)) continue
            l++
    
            if (lastLayer.length == 1) newLayer[j].link(lastLayer[0])
            else lastLayer[(j-dense)/(dense + 1) + l * Math.max(0, (dense - 1))]?.link(newLayer[j])
        } else {
            for (let j = 0; j < newLayer.length; j++) {
                if (spreadFrom - i === 0) lastLayer[j + (dense - 1) + j * Math.max(0, (dense - 1))]?.link(newLayer[j])
                else lastLayer[j]?.link(newLayer[j])   
            }
        }
    
        layers.push(newLayer)
    }
    
    const lastLayer = layers[layers.length-1]
    for (let i = 0; i < lastLayer.length; i++) {
        const theCell = lastLayer[i]
        theCell.emotion = emotions[i]
        for (let j = -1; j <= 1; j+=2) {
            const angle = (360 / emotionCount * i + j * 3) * Math.PI / 180
            const x = Math.cos(angle) * layerDistance * (layerCount + .5)
            const y = Math.sin(angle) * layerDistance * (layerCount + .5)
            const newCell = new Cell(c++, { x, y }, emotions[i])
            cells.push(newCell)
            theCell.link(newCell)
        }
    }
}

generateCells()

export const getCells = (): Cell[] => cells;