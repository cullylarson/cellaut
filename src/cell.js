import {randomString} from './util'

export function Cell(kind) {
    return {kind, id: randomString(20)}
}

export function isKind(cell, cellKind) {
    return cell.kind === cellKind
}

export function sameCell(cellA, cellB) {
    return cellA.id === cellB.id
}

export function copyCell(cell) {
    return {...cell}
}
