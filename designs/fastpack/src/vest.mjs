const in_to_mm = 25.4
const vsw = 7.538 * in_to_mm
const w = 48 * in_to_mm
const hps_waist_f = 17 * in_to_mm
const vstw = 6.026 * in_to_mm

function draftVestYoke({ Path, Point, paths, points, measurements, options, store, part }) {
  points
  return part
}

function draftVestMain({ Path, Point, paths, points, measurements, options, store, part }) {
  const vsl = hps_waist_f * 1.147
  const vsbw = (w / 4) * 0.874

  points.vestTopCenter = new Point(0, 0)
  points.vestCenterNeck = new Point(0, vsl * 0.06)
  points.vestNeckRight = new Point(vstw * 0.407, vsl * 0.167)
  points.vestYokeBottomLeft = new Point(vstw * 0.305, 0.4065 * vsl)
  points.vestStrapMidLeft = new Point(vstw * 0.329, 0.777 * vsl)
  points.vestStrapMidRight = new Point(vsbw, vsl - 0.373 * vsl)
  points.vestStrapBottomRight = new Point(vsbw, vsl)
  points.vestYokeTopright = points.vestTopCenter.shift(180 - 4.743, 6.047 * in_to_mm)

  paths.top = new Path().move(points.vestTopCenter).line(points.vestYokeTopright)

  return part
}

export const vestYoke = {
  name: 'fastpack.vestYoke',
  draft: draftVestYoke,
  after: [],
  measurements: ['waist'],
}

export const vestMain = {
  name: 'fastpack.vestMain',
  draft: draftVestMain,
  after: [],
  measurements: [],
}
