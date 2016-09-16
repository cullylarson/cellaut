import {List} from 'immutable'
import narr from 'narr'
import {isKind, copyCell} from './cell'
import {randomInt} from './util'
import {curry} from 'ramda'

export function createGrid(numRows, numCols) {
    return narr(numRows).reduce(grid => {
        return grid.push(narr(numCols).reduce(row => {
            return row.push(List())
        }, List()))
    }, List())
}

export const randomlyPlace = curry((numToPlace, cellTemplate, grid) => {
    // not enough spaces
    if(getNumEmpty(grid) < numToPlace) return grid

    return narr(numToPlace).reduce(gridAcc => {
        const emptySpace = getRandomEmptySpace(gridAcc)

        return gridAcc.set(emptySpace.r, gridAcc.get(emptySpace.r).set(emptySpace.c, List([copyCell(cellTemplate)])))
    }, grid)
})

/*
function getRandomSpaceKind(grid, cellKind) {
    const space = getRandomSpace(grid)

    return spaceHasKind(grid.get(space.r).get(space.c), cellKind)
        // found one of correct kind
        ? space
        // keep looking
        : getRandomSpaceKind(grid, cellKind)
}
*/

function getRandomEmptySpace(grid) {
    const space = getRandomSpace(grid)

    return grid.get(space.r).get(space.c).size === 0
        // found an empty space
        ? space
        // keep looking
        : getRandomEmptySpace(grid)
}

export function spaceHasKind(cells, cellKind) {
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

function getNumEmpty(grid) {
    grid.reduce((n, row) => {
        return row.reduce((n, cells) => {
            return cells.size === 0
                ? n + 1
                : n
        })
    }, 0)
}
