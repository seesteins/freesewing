const in_to_mm = 25.4
const bth = 1.5 * in_to_mm
const sw = 12 * in_to_mm
const sd = 1.475 * in_to_mm

function shoulderPath(Path, Point, paths, points) {
  const shoulderWidth = sw
  const backTopPanelHeight = bth
  points.center = new Point(0, 0)
  points.right = points.center.shift(0, shoulderWidth / 2).shift(270, backTopPanelHeight)
  points.left = points.right.flipX()
  paths.shoulderSeam = new Path().move(points.left).line(points.center).line(points.right)

  return paths.shoulderSeam
}

function draftBackTop({ Path, Point, paths, points, measurements, options, part }) {
  const shoulderDrop = sd
  const shoulderWidth = sw
  const backTopPanelHeight = bth
  const bottom = shoulderPath(Path, Point, paths, points)
  points.centerTop = new Point(0, -shoulderDrop)
  points.rightTop = points.centerTop.shift(0, shoulderWidth / 2)
  points.leftTop = points.rightTop.flipX()
  paths.backTop = new Path().move(points.leftTop).line(points.centerTop).line(points.rightTop)
  paths.backTop.join(bottom).close()

  return part
}

export const backTop = {
  name: 'fastpack.backTop',
  draft: draftBackTop,
  measurements: [],
}
/*
export const backBottom = {
    name: "fastpack.backBottom",
    draft: draftBackBottom,
    measurements: [],
}
    */
