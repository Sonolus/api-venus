import 'zx/globals'
import fs from 'fs-extra'

const contributors = [...new Set((await $`git log --pretty="%aN"`).stdout.split('\n'))]
    .filter((line) => !!line)
    .sort()
fs.outputJsonSync('./src/contributors.json', contributors, { spaces: 4 })
