import {createGrid, randomlyPlace} from './grid'
import {gridToDom} from './dom'
import {compose} from 'ramda'

window.onload = () => {
    const grid = createGrid(10, 10)
    const main = document.getElementById('main')

    compose(gridToDom(main), randomlyPlace(10, 'food'), randomlyPlace(5, 'animal'))(grid)
}
