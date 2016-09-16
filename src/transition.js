import {Set} from 'immutable'
import {spaceHasKind} from './grid'
import {copyCell} from './cell'
import {curry, compose} from 'ramda'
import {roll, randomInt} from './util'
import {Food} from './food'
import {Animal, Forager} from './animal'

export function iterateGrid(grid) {
    const transitions = grid.reduce((transitions, row, r) => {
        return transitions.concat(row.reduce((transitions, cells, c) => {
            if(cells.size === 0) return transitions.add(getEmptyCellTransition(grid, r, c))
            else return transitions.concat(cells.map((cell, n) => getCellTransition(grid, cell, r, c, n)))
        }, Set()))
    }, Set())

    return transitions.reduce((g, t) => t(g), grid)
}

function getEmptyCellTransition(grid, rowNum, colNum) {
    const doNothing = g => g

    // chance it will turn in to food
    if(roll(0.9)) return addCell(rowNum, colNum, Food())
    else return doNothing
}

function getCellTransition(grid, cell, rowNum, colNum, cellNum) {
    const cellsAround = getCellsAround(grid, cell, rowNum, colNum, cellNum)

    const doNothing = g => g

    switch(cell.kind) {
        case 'food':
            // animal eats it
            if(spaceHasKind(cellsAround.cc, 'animal')) return removeCell(rowNum, colNum, cellNum)
            // chance it just goes away
            else if(roll(10)) return removeCell(rowNum, colNum, cellNum)
            else return doNothing
        case 'animal':
            // another animal, it might die
            if(spaceHasKind(cellsAround.cc, 'animal') && roll(50)) return removeCell(rowNum, colNum, cellNum)
            // another animal, they might multiply
            else if(spaceHasKind(cellsAround.cc, 'animal') && roll(50)) return addCell(rowNum, colNum, Forager())
            // if food, will eat
            else if(spaceHasKind(cellsAround.cc, 'food')) return replaceCell(rowNum, colNum, cellNum, Animal(cell.energy + 4))
            // energy ran out
            else if(cell.energy === 0) return removeCell(rowNum, colNum, cellNum)
            else {
                // const reduceEnergy = replaceCell(rowNum, colNum, cellNum, Animal(cell.energy - 1))
                const reduceEnergy = doNothing

                // if food or animal up, right, down, left
                if(cellsAround.uc && spaceHasKind(cellsAround.uc, ['food', 'animal'])) return compose(moveCellUp(rowNum, colNum, cellNum), reduceEnergy)
                else if(cellsAround.cr && spaceHasKind(cellsAround.cr, ['food', 'animal'])) return compose(moveCellRight(rowNum, colNum, cellNum), reduceEnergy)
                else if(cellsAround.dc && spaceHasKind(cellsAround.dc, ['food', 'animal'])) return compose(moveCellDown(rowNum, colNum, cellNum), reduceEnergy)
                else if(cellsAround.cl && spaceHasKind(cellsAround.cl, ['food', 'animal'])) return compose(moveCellLeft(rowNum, colNum, cellNum), reduceEnergy)
                else return compose(moveCellRandom(rowNum, colNum, cellNum), reduceEnergy)
            }
    }

    return doNothing
}

const removeCell = curry((rowNum, colNum, cellNum, grid) => {
    return grid.deleteIn([rowNum, colNum, cellNum])
})

const addCell = curry((rowNum, colNum, cell, grid) => {
    const newCells = grid.get(rowNum).get(colNum).push(cell)
    return grid.setIn([rowNum, colNum], newCells)
})

const replaceCell = curry((rowNum, colNum, cellNum, cell, grid) => {
    return grid.setIn([rowNum, colNum, cellNum], cell)
})

const moveCell = curry((oldRowNum, oldColNum, oldCellNum, newRowNum, newColNum, grid) => {
    const cell = copyCell(grid.get(oldRowNum).get(oldColNum).get(oldCellNum))
    return compose(addCell(newRowNum, newColNum, cell), removeCell(oldRowNum, oldColNum, oldCellNum))(grid)
})

const moveCellUp = curry((rowNum, colNum, cellNum, grid) => {
    // can't move up
    if(rowNum === 0) return grid
    else return moveCell(rowNum, colNum, cellNum, rowNum - 1, colNum, grid)
})

const moveCellDown = curry((rowNum, colNum, cellNum, grid) => {
    // can't move down
    if(rowNum === grid.size - 1) return grid
    else return moveCell(rowNum, colNum, cellNum, rowNum + 1, colNum, grid)
})

const moveCellLeft = curry((rowNum, colNum, cellNum, grid) => {
    // can't move left
    if(colNum === 0) return grid
    else return moveCell(rowNum, colNum, cellNum, rowNum, colNum - 1, grid)
})

const moveCellRight = curry((rowNum, colNum, cellNum, grid) => {
    // can't move right
    if(colNum === grid.get(rowNum).size - 1) return grid
    else return moveCell(rowNum, colNum, cellNum, rowNum, colNum + 1, grid)
})

const moveCellRandom = curry((rowNum, colNum, cellNum, grid) => {
    // won't worry about whether we can move in each direction
    const directionNum = randomInt(1, 4)

    switch(directionNum) {
        case 1: return moveCellUp(rowNum, colNum, cellNum, grid)
        case 2: return moveCellRight(rowNum, colNum, cellNum, grid)
        case 3: return moveCellDown(rowNum, colNum, cellNum, grid)
        case 4: return moveCellLeft(rowNum, colNum, cellNum, grid)
    }
})

function getCellsAround(grid, cell, rowNum, colNum, cellNum) {
    return {
        ul: rowNum === 0 || colNum === 0
            ? null
            : grid.get(rowNum - 1).get(colNum - 1),
        uc: rowNum === 0
            ? null
            : grid.get(rowNum - 1).get(colNum),
        ur: rowNum === 0 || colNum === grid.get(rowNum - 1).size - 1
            ? null
            : grid.get(rowNum - 1).get(colNum + 1),
        cl: colNum === 0
            ? null
            : grid.get(rowNum).get(colNum - 1),
        // dont include the cell itself
        cc: grid.get(rowNum).get(colNum).filter((_, n) => n !== cellNum),
        cr: colNum === grid.get(rowNum).size - 1
            ? null
            : grid.get(rowNum).get(colNum + 1),
        dl: rowNum === grid.size - 1 || colNum === 0
            ? null
            : grid.get(rowNum + 1).get(colNum - 1),
        dc: rowNum === grid.size - 1
            ? null
            : grid.get(rowNum + 1).get(colNum),
        dr: rowNum === grid.size - 1 || colNum === grid.get(rowNum + 1).size - 1
            ? null
            : grid.get(rowNum + 1).get(colNum + 1),
    }
}
