const SATURATION_THRESHOLD = process.env.SATURATION_THRESHOLD || 0.7
const LUMINOSITY_THRESHOLD = process.env.LUMINOSITY_THRESHOLD || 0.8
const WARM_THRESHOLD = process.env.WARM_THRESHOLD || 80
const TOLERANCE = process.env.TOLERANCE || 1 /* Some anti-aliasing treatment make outlines "blurry", so it's better to make our verification more tolerant */
const SIZE_AVATAR = process.env.SIZE_AVATAR || 512

module.exports = {
  SATURATION_THRESHOLD,
  LUMINOSITY_THRESHOLD,
  WARM_THRESHOLD,
  TOLERANCE,
  SIZE_AVATAR
}
