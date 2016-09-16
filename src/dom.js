import {curry} from 'ramda'

// gridToDom :: Element -> List -> (state) -> List
export const gridToDom = curry((gridEl, grid) => {
    // the grid doesn't exist yet
    if(!gridEl.querySelectorAll('.cell').length) {
        createGrid(gridEl, grid)
    }
    else {
        fillGrid(gridEl, grid)
    }

    return grid
})

// fillGrid :: Element -> List -> (state)
function fillGrid(gridEl, grid) {
    grid.forEach((gridRow, r) => {
        gridRow.forEach((gridCells, c) => {
            const cellEl = document.getElementById(`cell-${r}-${c}`)
            if(!cellEl) return

            removeAllClasses(cellEl)
            addClass(cellEl, 'cell')
            addClass(cellEl, getClassFromCells(gridCells))
        })
    })
}

function getClassFromCells(cells) {
    if(cells.size === 0) return 'empty'
    else if(cells.size === 1) return cells.get(0).kind
    else return 'mixed'
}

// createGrid :: Element -> List -> (state)
function createGrid(gridEl, grid) {
    empty(gridEl)

    grid.forEach((gridRow, r) => {
        const row = document.createElement('div')
        row.setAttribute('class', 'row')
        row.setAttribute('id', `row-${r}`)
        gridEl.appendChild(row)

        gridRow.forEach((gridCells, c) => {
            const cell = document.createElement('div')
            cell.setAttribute('class', `cell ${getClassFromCells(gridCells)}`)
            cell.setAttribute('id', `cell-${r}-${c}`)

            row.appendChild(cell)
        })
    })
}

// emty :: Element -> (state)
function empty(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild)
    }
}

/*
function removeClass(el, className) { el.classList.remove(className) }
*/

function removeAllClasses(el) { el.className = '' }

function addClass(el, className) {
    el.classList.add(className)
}
