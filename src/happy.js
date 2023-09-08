const {
  SATURATION_THRESHOLD,
  LUMINOSITY_THRESHOLD,
  WARM_THRESHOLD
} = require('../config')

const isHappyColor = ({ r, g, b }) => {
  try {
    const M = Math.max(r, g, b)
    const m = Math.min(r, g, b)
    const warm = r - (r + g + b) / 3
    const luminosity = M / 255 /* between 0 - 1 */
    const saturation = (M - m) / M
    return {
      success: saturation > SATURATION_THRESHOLD && luminosity > LUMINOSITY_THRESHOLD && warm > WARM_THRESHOLD,
      saturation,
      luminosity,
      warm
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

const makeHappy = (imageData) => {
  try {
    imageData.scan(0, 0, imageData.bitmap.width, imageData.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0]
      const g = this.bitmap.data[idx + 1]
      const b = this.bitmap.data[idx + 2]

      /* Adjust warm, luminosity and saturation */
      const M = Math.max(r, g, b)
      const m = Math.min(r, g, b)
      const warm = r - (r + g + b) / 3
      const luminosity = M / 255
      const saturation = (M - m) / M
      const adjustedLuminosity = luminosity + (LUMINOSITY_THRESHOLD)
      const adjustedSaturation = saturation + (SATURATION_THRESHOLD)
      const adjustedWarm = warm + (WARM_THRESHOLD)

      // Convertir les valeurs ajustées en R, G, B
      const adjustedM = adjustedLuminosity * 255
      const adjustedm = adjustedM - adjustedSaturation * adjustedM

      const adjustedR = adjustedM - adjustedWarm
      const adjustedG = adjustedm + adjustedWarm
      const adjustedB = adjustedm - adjustedWarm

      // Mettre à jour les composantes R, G et B du pixel
      this.bitmap.data[idx + 0] = Math.max(0, Math.min(255, adjustedR))
      this.bitmap.data[idx + 1] = Math.max(0, Math.min(255, adjustedG))
      this.bitmap.data[idx + 2] = Math.max(0, Math.min(255, adjustedB))
    })
    return {
      success: true
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

module.exports = {
  isHappyColor,
  makeHappy
}
