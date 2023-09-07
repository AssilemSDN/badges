const Jimp = require('jimp')

// 2 - Resize to 512x512
// 3 - Make a circle with transparent background
// 4 - Change color to make picture looks happier
// 1 - Make into good format .png
const convertImageToBadge = async (imageFilePathInput, imageFilePathOutput) => {
  try {
    /* Resize */
    const image = await Jimp.read (imageFilePathInput)
    image.resize(512,512)
    /* Apply an antialiasing circle mask on the picture */
    image.circle().write (imageFilePathOutput)
    /* Make image looks happier ... */

    /* Then save into .png */
    if (!imageFilePathOutput.endsWith('.png')) {
      imageFilePathOutput += '.png'
    }
    image.write (imageFilePathOutput)
  } catch (e) {
    return e.message
  }
}
module.exports = { convertImageToBadge }


// convertImageToBadge(`${__dirname}/../examples/generated/bad-size/example1.png`,`${__dirname}/../examples/generated/bad-size/example1-corrected.png` ).then((result) => {
//     console.log('ok')
// })