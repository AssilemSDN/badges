const Jimp = require('jimp')

/* Check is a color is 'happy', based on subjective criteria */
const isHappyColor = (r, g, b) => {
  const saturationThreshold = 0.7
  const luminosityThreshold = 0.8
  const warmThreshold = 80

  const M = Math.max(r, g, b)
  const m = Math.min(r, g, b)

  const warm = r - (r + g + b) / 3 
  const luminosity = M / 255 
  const saturation = (M - m) / M

  return saturation > saturationThreshold && luminosity > luminosityThreshold && warm > warmThreshold
}

// 1 - Check good format 
// 2 - Check good size 
// 3 - Check circle with transparent background 
// 4 - Check 'happy' feeling 
const verifyImage = async (imageFilePath) => {
  try {
    /* Some anti-aliasing treatment make outlines "blurry", so it's better to make our verification more tolerant */
    const tolerance = 1
    console.log('LA')
    /* Load the image using Jimp */
    const image = await Jimp.read(imageFilePath)

    /* 1- Check format .png */
    if (image._originalMime !== Jimp.MIME_PNG) {
      throw Error (`Expected : png, but got : ${image._originalMime}`)
    }

    /* 2- Verify image size is 512x512 */
    if (image.bitmap.width !== 512 || image.bitmap.height !== 512) {
      throw Error (`Image size should be 512x512, but got : ${image.bitmap.width}x${image.bitmap.height}`)
    }

    /* don't use colorthief library cause transparent pixel on background may have a little impact on the dominant color result */
    let totalRed = 0, totalGreen = 0, totalBlue = 0, totalOpaquePixel = 0
    /* 3- Check if only non-transparent pixels are within a circle + find the dominant color */
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      
      const alpha = image.bitmap.data[idx + 3]
      if (alpha === 255) {
        const distanceToCenter = Math.sqrt((x - 256) ** 2 + (y - 256) ** 2)
        if (distanceToCenter > (256 + tolerance) ) {
          throw Error (`Image has opaque pixel outside the circle.`)
        }
        totalOpaquePixel ++
        totalRed += image.bitmap.data[idx]
        totalGreen += image.bitmap.data[idx + 1]
        totalBlue += image.bitmap.data[idx + 2]
      }
    })
    /* 4- Check if picture is happy */
    if (!isHappyColor(totalRed/totalOpaquePixel, totalGreen/totalOpaquePixel, totalBlue/totalOpaquePixel)) {
      throw Error (`Image is soooo sad.`)
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
