const Jimp = require('jimp')
const { isHappyColor } = require('./happy')
const {
  SIZE_AVATAR
} = require('../config')
const path = require('path')

const generateImage = async (options = {}) => {
  try {
    const {
      imageFileName,
      directoryPath = `${__dirname}/../examples/generated/`,
      goodSize = true,
      happy = true,
      circle = true,
      format = 'png'
    } = options
    /* Check imageFilename format */
    if (imageFileName.includes('/')) {
      throw new Error('File name should not contains "/".')
    }
    /* Generate SIZE_AVATAR x SIZE_AVATAR or smaller random size image (max 511x511), transparent background or no */
    const image = new Jimp(goodSize ? SIZE_AVATAR : Math.floor(Math.random() * (SIZE_AVATAR - 49)) + 50, goodSize ? SIZE_AVATAR : Math.floor(Math.random() * (SIZE_AVATAR - 49)) + 50, circle ? 0x00000000 : 0xFFFFFFFF)
    /* Add some happy or sad feeling */
    const generateColor = () => {
      let r, g, b
      if (happy) {
        do {
          r = Math.floor(Math.random() * 256)
          g = Math.floor(Math.random() * 256)
          b = Math.floor(Math.random() * 256)
        } while (!isHappyColor({ r, g, b }).success)
      } else {
        do {
          r = Math.floor(Math.random() * 256)
          g = Math.floor(Math.random() * 256)
          b = Math.floor(Math.random() * 256)
        } while (isHappyColor({ r, g, b }).success)
      }
      return Jimp.rgbaToInt(r, g, b, 255) /* 100% Opaque color */
    }
    /* Color only in the circle or everything */
    const color = generateColor()
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y) => {
      if (!circle) {
        image.setPixelColor(color, x, y)
      } else {
        const centerX = Math.floor(image.bitmap.width / 2)
        const centerY = Math.floor(image.bitmap.height / 2)
        const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
        /* Only color inside the circle */
        if (distanceFromCenter <= SIZE_AVATAR / 2) {
          image.setPixelColor(color, x, y)
        }
      }
    })
    const imagePath = path.join(directoryPath, `${imageFileName}.${format}`)
    image.write(imagePath).then(() => {
      return {
        success: true,
        imageFilePath: imagePath
      }
    })
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

module.exports = { generateImage }
