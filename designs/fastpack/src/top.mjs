import { front } from './front.mjs'
import { side } from './side.mjs'
import { backTop } from './back.mjs'

const in_to_mm = 25.4
const cth = 8.5 * in_to_mm

function draftTop({ Path, Point, paths, points, measurements, options, store, part }) {
  const cinchTopHeight = cth
  const frontTopWidth = store.get('frontTopWidth')
  const shoulderWidth = store.get('shoulderWidth')
  const backTopPanelHeight = store.get('backTopPanelHeight')
  const depthTop = store.get('depthTop')

  points.centerTop = new Point(0, 0)
  points.centerBottom = new Point(0, cinchTopHeight)
  points.frontSideRight = points.centerBottom.shift(0, frontTopWidth / 2)
  points.sideBackRight = points.frontSideRight.shift(0, depthTop).shift(90, backTopPanelHeight)
  points.centerBackRight = points.sideBackRight.shift(0, shoulderWidth / 2)
  points.topRight = new Point(points.centerTop.dx(points.centerBackRight), 0)

  paths.top = new Path()
    .move(points.topRight)
    .line(points.centerTop)
    .line(points.centerBottom)
    .line(points.frontSideRight)
    .line(points.sideBackRight)
    .line(points.centerBackRight)
    .close()

  return part
}

function draftCinchChannel({ Path, Point, paths, points, measurements, options, store, part }) {
  return part
}

export const top = {
  name: 'fastpack.top',
  draft: draftTop,
  after: [backTop, side, front],
  measurements: [],
}
