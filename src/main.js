import {createGrid, randomlyPlace} from './grid'
import {gridToDom} from './dom'
import {compose} from 'ramda'
import {Forager} from './animal'
import {Food} from './food'

window.onload = () => {
    const grid = createGrid(10, 10)
    const main = document.getElementById('main')

    compose(gridToDom(main), randomlyPlace(10, Food()), randomlyPlace(5, Forager()))(grid)
}
