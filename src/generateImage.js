const Jimp = require('jimp')
const { isHappyColor } = require ('./verifyImage')

const generateImage = (options = {}) => {
  try {
    const currentDirectory = __dirname
    const {
      imageFileName,
      goodSize = true,
      happy = true,
      circle = true,
      format = 'png'
    } = options
    /* Check imageFilename format*/
    if (fileName.includes('/')) {
      throw new Error('Le nom de fichier ne doit pas contenir le caractère "/".')
    }
    /* Generate 512x512 or smaller random size image (max 511x511), transparent background or no */
    const image = new Jimp(goodSize ? 512 : Math.floor(Math.random() * 462) + 50, goodSize ? 512 : Math.floor(Math.random() * 462) + 50, circle ? 0x00000000 : 0xFFFFFFFF)
    /* Add some happy or sad feeling */
    const generateColor = () => {
      let r, g, b
      if (happy) {
        do {
          r = Math.floor(Math.random() * 256)
          g = Math.floor(Math.random() * 256)
          b = Math.floor(Math.random() * 256)
        } while (!isHappyColor(r, g, b))
        
      } else {
        do {
          r = Math.floor(Math.random() * 256)
          g = Math.floor(Math.random() * 256)
          b = Math.floor(Math.random() * 256)
        } while (isHappyColor(r, g, b))
      }
      return Jimp.rgbaToInt(r, g, b, 255) /* 100% Opaque color */
    }
    /* Color only in the circle or everything */
    const color = generateColor()
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      if (!circle) {
        image.setPixelColor(color, x, y)
      } 
      else {
        const centerX = Math.floor(image.bitmap.width / 2)
        const centerY = Math.floor(image.bitmap.height / 2)
        const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
        /* Only color inside the circle */
        if (distanceFromCenter <= 256) {
          image.setPixelColor(color, x, y)
        }
      }
    })
    image.write(`${currentDirectory}/../examples/generated/${imageFileName}.${format}`)
    return {
      success: true,
      message: `L'image a été écrite ici : ${currentDirectory}/../examples/generated/${imageFileName}.${format}`
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
  
}

module.exports = { generateImage }