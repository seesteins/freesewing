const in_to_mm = 25.4
const bth = 1.5 * in_to_mm
const sw = 12 * in_to_mm
const sd = 1.475 * in_to_mm
const bl = 16.25 * in_to_mm
const bbw = 7.643 * in_to_mm
//needs some modifications to go in the correct direction - ccw
function shoulderPath(Path, Point, paths, points, store) {
  const shoulderWidth = sw
  const backTopPanelHeight = bth
  const shoulderDrop = sd
  store.set('backTopPanelHeight', backTopPanelHeight + shoulderDrop)
  store.set('shoulderWidth', shoulderWidth)
  points.center = new Point(0, 0)
  points.right = points.center.shift(0, shoulderWidth / 2).shift(270, backTopPanelHeight)
  paths.shoulderSeam = new Path().move(points.right).line(points.center).hide()

  return paths.shoulderSeam
}

function draftBackTop({
  Path,
  Point,
  paths,
  points,
  macro,
  measurements,
  options,
  store,
  part,
  sa,
}) {
  const shoulderDrop = sd
  const shoulderWidth = sw
  //ToDo define shoulderWidth in terms of measurements.shoulderToShoulder
  shoulderPath(Path, Point, paths, points, store)
  points.centerTop = new Point(0, -shoulderDrop)
  points.rightTop = points.centerTop.shift(0, shoulderWidth / 2)
  paths.topSeam = new Path().move(points.rightTop).line(points.centerTop).hide()
  paths.bottom = paths.shoulderSeam.reverse()
  paths.backTop = new Path().move(points.right).join(paths.topSeam)

  // draw seam allowance if it is provided
  if (sa) {
    paths.felledsa = paths.shoulderSeam
      .reverse()
      .offset(2 * sa)
      .hide()
    points.shift = paths.felledsa.intersectsX(0.0)[0]
    const shiftx = paths.felledsa.start().dx(points.shift)
    const shifty = paths.felledsa.start().dy(points.shift)
    paths.felledsa = paths.felledsa.translate(shiftx, shifty)
    console.log('start', paths.bottom.start())
    paths.sa = paths.backTop.offset(sa).join(paths.felledsa).close().attr('class', 'main fabric sa')
  }

  //close the part after adding the different seam allowances
  paths.backTop.line(points.center).join(paths.bottom).close()

  //add cut on fold
  macro('cutonfold', {
    from: points.centerTop,
    to: points.center,
    grainline: false,
  })

  return part
}

function draftBackBottom({ Path, Point, paths, points, store, measurements, options, part }) {
  const backBottomWidth = bbw
  const backLength = bl
  //ToDo define backLength as a function of measurements.hpsToWaistBack
  shoulderPath(Path, Point, paths, points, store)
  points.bottomRight = new Point(backBottomWidth / 2, backLength)
  points.bottomLeft = points.bottomRight.flipX()
  points.bottomCenter = new Point(0, backLength)
  paths.backBottom = new Path().move(points.bottomRight).join(paths.shoulderSeam)
  // save the length of the back side seam for use in the side panel curve
  store.set('backSideSeamLength', paths.backBottom.length() - paths.shoulderSeam.length())
  console.log(store.get('backSideSeamLength'))

  paths.backBottom.line(points.bottomLeft).close()
  return part
}

export const backTop = {
  name: 'fastpack.backTop',
  draft: draftBackTop,
  measurements: [],
}

export const backBottom = {
  name: 'fastpack.backBottom',
  draft: draftBackBottom,
  measurements: [],
}
