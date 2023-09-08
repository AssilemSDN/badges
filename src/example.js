const { convertImageToBadge } = require('./convertImageToBadge')
const { generateImage } = require('./generateImage')
const { verifyImage } = require('./verifyImage')
const fs = require('fs')
const path = require('path')

/* That's an example of how using those functions */

const directories = [
  `${__dirname}/../examples/generated/ok`,
  `${__dirname}/../examples/generated/bad-format`,
  `${__dirname}/../examples/generated/bad-size`,
  `${__dirname}/../examples/generated/bad-circle`,
  `${__dirname}/../examples/generated/not-happy`,
  `${__dirname}/../examples/non-generated`
]

const generate = async () => {
  try {
    const MAX_ITERATIONS = 1
    /* Generate images */
    const generateImagesPromises = []
    for (let i = 0; i < MAX_ITERATIONS; ++i) {
      generateImagesPromises.push(generateImage({ imageFileName: `example${i}`, directoryPath: directories[0] }))
      generateImagesPromises.push(generateImage({ imageFileName: `example${i}`, format: 'jpg', directoryPath: directories[1] }))
      generateImagesPromises.push(generateImage({ imageFileName: `example${i}`, goodSize: false, directoryPath: directories[2] }))
      generateImagesPromises.push(generateImage({ imageFileName: `example${i}`, circle: false, directoryPath: directories[3] }))
      generateImagesPromises.push(generateImage({ imageFileName: `example${i}`, happy: false, directoryPath: directories[4] }))
    }
    await Promise.all(generateImagesPromises)
    /* Generate badges */
    const convertImageToBadgePromises = []
    directories.forEach((directory) => {
      fs.readdir(directory, (err, files) => {
        if (err) {
          throw Error('Erreur lors de la lecture du répertoire :', err)
        }
        const imageFiles = files.filter((file) => {
          return file.endsWith('.jpg') || file.endsWith('.png')
        })
        imageFiles.forEach((file) => {
          const basename = path.basename(file, path.extname(file))
          const fileImageInput = path.join(directory, file)
          const fileImageOutput = path.join(directory, `${basename}-avatar`)
          convertImageToBadgePromises.push(convertImageToBadge(fileImageInput, fileImageOutput))
        })
      })
    })
    await Promise.all(convertImageToBadgePromises)
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
const verify = async () => {
  try {
    directories.forEach((directory) => {
      fs.readdir(directory, (err, files) => {
        if (err) {
          throw Error('Erreur lors de la lecture du répertoire :', err)
        }
        const imageFiles = files.filter((file) => {
          return file.endsWith('.jpg') || file.endsWith('.png')
        })
        imageFiles.forEach((file) => {
          const fileImage = path.join(directory, file)
          verifyImage(fileImage).then((res) => {
            console.log(directory, file, res)
          })
        })
      })
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
// generate()
verify()
