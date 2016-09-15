import {List} from 'immutable'
import narr from 'narr'
import {EmptyCell, isKind, copyCell} from './cell'
import {randomInt} from './util'
import {curry} from 'ramda'

export function createGrid(numRows, numCols) {
    return narr(numRows).reduce(grid => {
        return grid.push(narr(numCols).reduce(row => {
            return row.push(List([EmptyCell()]))
        }, List()))
    }, List())
}

export const randomlyPlace = curry((numToPlace, cellTemplate, grid) => {
    // not enough spaces
    if(getNumKind(grid, 'empty') < numToPlace) return grid

    return narr(numToPlace).reduce(gridAcc => {
        const emptySpace = getRandomSpaceKind(gridAcc, 'empty')

        return gridAcc.set(emptySpace.r, gridAcc.get(emptySpace.r).set(emptySpace.c, List([copyCell(cellTemplate)])))
    }, grid)
})

function getRandomSpaceKind(grid, cellKind) {
    const space = getRandomSpace(grid)

    return spaceHasKind(grid.get(space.r).get(space.c), cellKind)
        // found one of correct kind
        ? space
        // keep looking
        : getRandomSpaceKind(grid, cellKind)
}

function spaceHasKind(cells, cellKind) {
    return cells.reduce((found, cell) => {
        if(found) return true

        return isKind(cell, cellKind)
    }, false)
}

function getRandomSpace(grid) {
    const r = randomInt(0, grid.size - 1)
    const c = randomInt(0, grid.get(r).size - 1)

    return {r, c}
}

function getNumKind(grid, cellKind) {
    grid.reduce((n, row) => {
        return row.reduce((n, cells) => {
            return spaceHasKind(cells, cellKind)
                ? n + 1
                : n
        })
    }, 0)
}
