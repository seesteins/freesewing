//

import { Design } from '@freesewing/core'
import { i18n } from '../i18n/index.mjs'
import { data } from '../data.mjs'
// Parts
import { box } from './box.mjs'
import { backTop } from './back.mjs'

// Create new design
const Fastpack = new Design({
  data: {
    name: 'fastpack',
    version: '0.0.1',
  },
  parts: [box, backTop],
})

// Named exports
export { backTop, box, i18n, Fastpack }
