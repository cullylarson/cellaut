import {Set, List} from 'immutable'
import {spaceHasKind} from './grid'
import {copyCell} from './cell'
import {curry, compose} from 'ramda'
import {roll} from './util'
import {Food} from './food'

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
    if(roll(.9)) return addCell(rowNum, colNum, Food())
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
    }

    return doNothing
}

const removeCell = curry((rowNum, colNum, cellNum, grid) => {
    return grid.deleteIn([rowNum, colNum, cellNum])
})

const addCell = curry((rowNum, colNum, cell, grid) => {
    return grid.mergeIn([rowNum, colNum], List([cell]))
})

// TODO -- remove 'export'
export function moveCell(grid, oldRowNum, oldColNum, oldCellNum, newRowNum, newColNum) {
    const cell = copyCell(grid.get(oldRowNum).get(oldColNum).get(oldCellNum))
    return compose(addCell(newRowNum, newColNum, cell), removeCell(oldRowNum, oldColNum, oldCellNum))(grid)
}

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
        ll: rowNum === grid.size - 1 || colNum === 0
            ? null
            : grid.get(rowNum + 1).get(colNum - 1),
        lc: rowNum === grid.size - 1
            ? null
            : grid.get(rowNum + 1).get(colNum),
        lr: rowNum === grid.size - 1 || colNum === grid.get(rowNum + 1).size - 1
            ? null
            : grid.get(rowNum + 1).get(colNum + 1),
    }
}
