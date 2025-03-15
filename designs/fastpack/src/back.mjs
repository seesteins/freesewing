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

function draftBackBottom({
  Path,
  Point,
  paths,
  points,
  store,
  macro,
  measurements,
  options,
  utils,
  sa,
  part,
}) {
  const backBottomWidth = bbw
  const backLength = bl
  //ToDo define backLength as a function of measurements.hpsToWaistBack
  shoulderPath(Path, Point, paths, points, store)
  //define points for backpanel outline
  points.bottomRight = new Point(backBottomWidth / 2, backLength)
  points.bottomCenter = new Point(0, backLength)
  //define paths
  paths.sideSeam = new Path().move(points.bottomRight).line(points.right).hide()
  paths.bottomSeam = new Path().move(points.bottomCenter).line(points.bottomRight).hide()
  // save seam lengths in the store for use in other panels
  store.set('backSideLength', paths.sideSeam.length())
  store.set('backBottomLength', paths.bottomSeam.length())
  //join the paths that have normal sa
  paths.backBottom = paths.bottomSeam.join(paths.sideSeam)
  //calculate sa paths before joining all paths together to accomodate felled seam
  if (sa) {
    paths.sa = paths.backBottom.offset(sa).hide()
    paths.felledSa = paths.shoulderSeam.offset(2 * sa).hide()
    points.felledSaEnd = paths.felledSa.end()
    //calculate a corrected end point for the felled seam.
    const x = points.felledSaEnd.x
    const theta = points.felledSaEnd.angle(paths.felledSa.start())
    points.correctedSa = points.felledSaEnd.shift(theta, -x / Math.cos(utils.deg2rad(theta)))
    //close the seam allowance
    paths.sa = paths.sa
      .join(paths.felledSa)
      .line(points.correctedSa)
      .close()
      .attr('class', 'main fabric sa')
  }
  //finish the panel outline after calculating seam allowances
  paths.backBottom = paths.backBottom.join(paths.shoulderSeam).close()
  //add documentation
  macro('cutonfold', {
    from: points.center,
    to: points.bottomCenter,
    grainline: true,
  })

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
