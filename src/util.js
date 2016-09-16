import narr from 'narr'

export function randomInt(min, max) { return Math.floor(Math.random() * (max - min)) + min }

export function randomString(len) {
    return narr(len).reduce((carry) => carry + randomChar(), '')
}

export function randomChar() {
    const characters = 'abcdefghijklmonpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return characters.substr(randomInt(0, characters.length), 1)
}

export function roll(percentChance) {
    const percentOfAThousand = percentChance * 10

    return randomInt(1, 1000) <= percentOfAThousand
}

export function mapObj(f, obj) {
    return Object.keys(obj).reduce(
        (acc, key) => { return {...acc, [key]: f(obj[key])} },
        {})
}
