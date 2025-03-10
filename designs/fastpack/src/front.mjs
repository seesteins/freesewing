import { side } from './side.mjs'
const in_to_mm = 25.4
const ftw = 10.597 * in_to_mm
const fbw = 7.508 * in_to_mm

function draftFront({ Path, Point, paths, points, measurements, options, store, part }) {
  const frontTopWidth = ftw
  const frontBottomWidth = fbw
  const frontCurveLength = store.get('frontCurveLength')
  const frontHeight =
    frontCurveLength ^ (2 - (frontTopWidth / 2 - frontBottomWidth / 2)) ^ 2 ^ (1 / 2)
  store.set('frontTopWidth', frontTopWidth)
  points.topCenter = new Point(0, 0)
  points.topRight = points.topCenter.shift(0, frontTopWidth / 2)
  points.topLeft = points.topCenter.flipX()
  points.bottomCenter = points.topCenter.shift(90, frontHeight)
  points.bottomRight = points.bottomCenter.shift(0, frontBottomWidth / 2)
  points.bottomLeft = points.bottomRight.flipX()

  paths.frontPanel = new Path()
    .move(points.topCenter)
    .line(points.bottomCenter)
    .line(points.bottomRight)
    .line(points.topRight)
    .close()

  return part
}

export const front = {
  name: 'fastpack.front',
  draft: draftFront,
  after: [side],
  measurements: [],
}
