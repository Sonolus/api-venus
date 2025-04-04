import fs from 'fs-extra'

fs.emptyDirSync('./dist')

const info = fs.readJsonSync('./src/info.json')
fs.outputJsonSync('./dist/info.json', info)

const localizations = fs.readdirSync('./src/localizations').map((name) => {
    const localization = fs.readJsonSync(`./src/localizations/${name}/Localization.json`)

    return {
        info: {
            name: localization.Meta.Name,
            title: localization.Meta.Title,
        },
        entries: flatten(localization),
    }
})

const keys = new Set(
    localizations.find(({ info }) => info.name === 'en').entries.map(({ key }) => key),
)

fs.outputJsonSync(
    './dist/localizations/list.json',
    localizations.map(({ info }) => info),
)

for (const { info, entries } of localizations) {
    fs.outputJsonSync(
        `./dist/localizations/${info.name}.json`,
        entries.filter(({ key }) => keys.has(key)),
    )
}

function flatten(data, path = []) {
    return Object.entries(data).flatMap(([key, value]) => {
        const newPath = [...path, key]

        switch (typeof value) {
            case 'string':
                return [{ key: newPath.join('.'), value }]
            case 'object':
                return flatten(value, newPath)
            default:
                throw new Error(`Unsupported type: ${typeof value} at ${newPath.join('.')}`)
        }
    })
}
