import {Cell} from './cell'

export function Animal(energy) {
    return {
        ...Cell('animal'),
        energy,
    }
}

export function Forager() {
    return Animal(5)
}
