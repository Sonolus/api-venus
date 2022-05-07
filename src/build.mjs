import fs from 'fs-extra'

fs.emptyDirSync('./dist')

const info = fs.readJsonSync('./src/info.json')
fs.outputJsonSync('./dist/info.json', info)

const list = []
fs.readdirSync('./src/localizations').forEach((name) => {
    const localization = fs.readJsonSync(
        `./src/localizations/${name}/Localization.json`
    )

    list.push({ name: localization.Meta.Name, title: localization.Meta.Title })

    fs.outputJsonSync(
        `./dist/localizations/${localization.Meta.Name}.json`,
        flatten(localization)
    )
})

fs.outputJsonSync('./dist/localizations/list.json', list)

function flatten(data, path = [], entries = []) {
    Object.entries(data).forEach(([key, value]) => {
        const newPath = [...path, key]

        switch (typeof value) {
            case 'string':
                entries.push({ key: newPath.join('.'), value })
                break
            case 'object':
                flatten(value, newPath, entries)
                break
            default:
                throw new Error(
                    `Unsupported type: ${typeof value} at ${newPath.join('.')}`
                )
        }
    })

    return entries
}
