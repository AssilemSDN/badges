const Jimp = require('jimp')
const {
  TOLERANCE,
  SIZE_AVATAR
} = require('../config')
const { isHappyColor } = require('./happy')

// 1 - Check good format
// 2 - Check good size
// 3 - Check circle with transparent background
// 4 - Check 'happy' feeling
const verifyImage = async (imageFilePath) => {
  try {
    /* Load the image using Jimp */
    const image = await Jimp.read(imageFilePath)
    /* 1- Check format .png */
    if (image._originalMime !== Jimp.MIME_PNG) {
      throw Error(`Expected : png, but got : ${image._originalMime}`)
    }
    /* 2- Verify image size */
    if (image.bitmap.width !== SIZE_AVATAR || image.bitmap.height !== SIZE_AVATAR) {
      throw Error(`Image size should be ${SIZE_AVATAR}x${SIZE_AVATAR}, but got : ${image.bitmap.width}x${image.bitmap.height}`)
    }
    /* don't use colorthief library cause transparent pixel on background may have a little impact on the dominant color result */
    let totalRed = 0; let totalGreen = 0; let totalBlue = 0; let totalOpaquePixel = 0
    /* 3- Check if only non-transparent pixels are within a circle + get the average color */
    const radius = SIZE_AVATAR / 2
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      const alpha = image.bitmap.data[idx + 3]
      if (alpha === 255) {
        const distanceToCenter = Math.sqrt((x - radius) ** 2 + (y - radius) ** 2)
        if (distanceToCenter > (radius + TOLERANCE)) {
          throw Error('Image has opaque pixel outside the circle.')
        }
        totalOpaquePixel++
        totalRed += image.bitmap.data[idx]
        totalGreen += image.bitmap.data[idx + 1]
        totalBlue += image.bitmap.data[idx + 2]
      }
    })
    /* 4- Check if picture is happy */
    if (!isHappyColor({ r: totalRed / totalOpaquePixel, g: totalGreen / totalOpaquePixel, b: totalBlue / totalOpaquePixel }).success) {
      throw Error('Image is soooo sad.')
    }
    return {
      success: true,
      message: 'Image is valid.'
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
module.exports = { isHappyColor, verifyImage }
