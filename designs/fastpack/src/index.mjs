//

import { Design } from '@freesewing/core'
import { i18n } from '../i18n/index.mjs'
import { data } from '../data.mjs'
// Parts
import { backTop, backBottom } from './back.mjs'
import { side } from './side.mjs'
import { front } from './front.mjs'
import { top } from './top.mjs'

// Create new design
const Fastpack = new Design({
  data: {
    name: 'fastpack',
    version: '0.0.1',
  },
  parts: [backTop, backBottom, side, front, top],
})

// Named exports
export { top, front, backTop, backBottom, i18n, Fastpack }
