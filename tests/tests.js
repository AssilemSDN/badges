const { verifyImage } = require('../src/verifyImage')


for (let i = 0; i < 10; ++i) {
  verifyImage(`${__dirname}/../examples/generated/good/example${i}.png` ).then((result) => {
    console.log(i, `good/example${i}`, result)
  })
  // verifyImage(`${__dirname}/../examples/generated/bad-happy/example${i}.png` ).then((result) => {
  //   console.log(i, `good/example${i}`, result)
  // })
  // verifyImage(`${__dirname}/../examples/generated/bad-size/example${i}.png` ).then((result) => {
  //   console.log(i, `good/example${i}`, result)
  // })
  // verifyImage(`${__dirname}/../examples/generated/bad-format/example${i}.png` ).then((result) => {
  //   console.log(i, `good/example${i}`, result)
  // })
  // verifyImage(`${__dirname}/../examples/generated/bad-circle/example${i}.png` ).then((result) => {
  //   console.log(i, `good/example${i}`, result)
  // })
}