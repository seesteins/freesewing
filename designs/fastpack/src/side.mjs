import { backBottom, backTop } from './back.mjs'
const in_to_mm = 25.4
const db = 4.823 * in_to_mm
const dt = 7.166 * in_to_mm

function draftSide({ Path, Point, paths, points, store, sa, measurements, options, part }) {
  //set sizing constants (might change later)
  const sideCurveLength = store.get('backSideSeamLength')
  const backTopPanelHeight = store.get('backTopPanelHeight')
  const depthBottom = db
  const depthTop = dt
  //define points
  points.topCurve = new Point(0, 0)
  points.backCurveTopCP = points.topCurve.shift(248.74, 0.40068 * sideCurveLength)
  points.bottomCurve = new Point(0, 0.98777 * sideCurveLength)
  points.backCurveBottomCP = points.bottomCurve.shift(90, 0.425 * sideCurveLength)
  points.bottomFront = points.bottomCurve.shift(180, depthBottom)
  points.frontBottomCurveCP = points.bottomFront.shift(292.866, 0.24888 * depthBottom)
  points.backBottomCurveCP = points.bottomCurve.shift(242.783, 0.21905 * depthBottom)
  points.topFront = points.topCurve.shift(180, depthTop)
  points.topBack = points.topCurve.shift(90, backTopPanelHeight)
  const frontStraightLen = new Path().move(points.topFront).line(points.bottomFront).hide().length()
  points.frontCurveTopCP = points.topFront.shift(272.006, 0.38372 * frontStraightLen)
  points.frontCurveBottomCP = points.bottomFront.shift(106.908, 0.20954 * frontStraightLen)
  //set paths
  paths.backCurve = new Path()
    .move(points.bottomCurve)
    .curve(points.backCurveBottomCP, points.backCurveTopCP, points.topCurve)
    .hide()
  paths.bottomCurve = new Path()
    .move(points.bottomFront)
    .curve(points.frontBottomCurveCP, points.backBottomCurveCP, points.bottomCurve)
    .hide()
  paths.frontCurve = new Path()
    .move(points.topFront)
    .curve(points.frontCurveTopCP, points.frontCurveBottomCP, points.bottomFront)
    .hide()
  paths.sidePanel = new Path()
    .move(points.topCurve)
    .line(points.topBack)
    .join(paths.frontCurve, paths.bottomCurve, paths.backCurve)
    .close()
    .addClass('main fabric')

  //add seam allowance
  if (sa) paths.sa = paths.sidePanel.offset(sa).addClass('main fabric sa')
  return part
}

export const side = {
  name: 'fastpack.side',
  draft: draftSide,
  after: [backBottom, backTop],
  measurements: [],
}
