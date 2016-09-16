import {createGrid, randomlyPlace} from './grid'
import {gridToDom} from './dom'
import {compose} from 'ramda'
import {Forager} from './animal'
import {Food} from './food'
import {iterateGrid} from './transition'

window.onload = () => {
    const grid = createGrid(10, 10)
    const main = document.getElementById('main')

    let gridInterval = compose(randomlyPlace(10, Food()), randomlyPlace(5, Forager()))(grid)
    gridToDom(main, gridInterval)

    setInterval(() => {
        gridInterval = compose(gridToDom(main), iterateGrid)(gridInterval)
    }, 1000)
}
