export function Cell(kind) {
    return {kind}
}

export function EmptyCell() {
    return Cell('empty')
}

export function isKind(cell, cellKind) {
    return cell.kind === cellKind
}

export function copyCell(cell) {
    return {...cell}
}
