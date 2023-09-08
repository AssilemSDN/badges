const Jimp = require('jimp')
const {
  isHappyColor,
  makeHappy
} = require('./happy')
const {
  TOLERANCE,
  SIZE_AVATAR
} = require('../config')

// 1 - Resize to 512x512
// 2 - Make a circle with transparent background
// 3 - If needed : Change color to make picture looks happier
// 4 - Make into good format .png
const convertImageToBadge = async (imageFilePathInput, imageFilePathOutput) => {
  try {
    const image = await Jimp.read(imageFilePathInput)
    /* Resize + apply an anti-aliasing circle mask on the picture */
    image.cover(SIZE_AVATAR, SIZE_AVATAR).circle()
    /* Make image looks happier if needed... */
    let totalRed = 0; let totalGreen = 0; let totalBlue = 0; let totalOpaquePixel = 0
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      const alpha = image.bitmap.data[idx + 3]
      if (alpha === 255) {
        const distanceToCenter = Math.sqrt((x - 256) ** 2 + (y - 256) ** 2)
        if (distanceToCenter > (256 + TOLERANCE)) {
          throw Error('Image has opaque pixel outside the circle.')
        }
        totalOpaquePixel++
        totalRed += image.bitmap.data[idx]
        totalGreen += image.bitmap.data[idx + 1]
        totalBlue += image.bitmap.data[idx + 2]
      }
    })
    const isHappy = isHappyColor({ r: totalRed / totalOpaquePixel, g: totalGreen / totalOpaquePixel, b: totalBlue / totalOpaquePixel })
    if (!isHappy.success) {
      makeHappy(image)
    }
    /* Then save into .png */
    if (!imageFilePathOutput.endsWith('.png')) {
      imageFilePathOutput += '.png'
    }
    image.write(imageFilePathOutput).then(() => {
      return {
        success: true
      }
    })
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
module.exports = { convertImageToBadge }
