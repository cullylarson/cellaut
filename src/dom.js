import {curry} from 'ramda'

// gridToDom :: Element -> List -> (state)
export const gridToDom = curry((gridEl, grid) => {
    // the grid doesn't exist yet
    if(!gridEl.querySelectorAll('.cell').length) {
        createGrid(gridEl, grid)
    }
    else {
        fillGrid(gridEl, grid)
    }
})

// fillGrid :: Element -> List -> (state)
function fillGrid(gridEl, grid) {
    grid.forEach((gridRow, r) => {
        gridRow.forEach((gridCell, c) => {
            const cellEl = gridEl.getElementById(`cell-${r}-${c}`)
            if(!cellEl) return

            removeAllClasses(cellEl)
            addClass(cellEl, 'cell')
            addClass(cellEl, gridCell.kind)
        })
    })
}

// createGrid :: Element -> List -> (state)
function createGrid(gridEl, grid) {
    empty(gridEl)

    grid.forEach((gridRow, r) => {
        const row = document.createElement('div')
        row.setAttribute('class', 'row')
        row.setAttribute('id', `row-${r}`)
        gridEl.appendChild(row)

        gridRow.forEach((gridCell, c) => {
            const cell = document.createElement('div')
            cell.setAttribute('class', `cell ${gridCell.kind}`)
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
