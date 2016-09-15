export default class {
    constructor(kind) {
        this.kind = kind
        Object.freeze(this)
    }

    isKind(someKind) { return this.kind === someKind }
}
