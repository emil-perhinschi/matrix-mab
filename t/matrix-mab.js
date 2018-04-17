const matrix = require("matrix-mab.js")
const fs = require("fs")
const tap = require("tap")

const test_image = "t/test.pgm"

const image_data = fs.readFileSync(
    test_image,
    "ascii"
)

const result = matrix.pgm_to_matrix(image_data)
tap.equals(result.length, 50, "height is correct")
tap.equals(result[0].length, 50, "width is correct")
tap.equals(result[0][0], 16, "0,0 is 16")
tap.equals(result[25][25], 0, "25,25 is 0")

const part = matrix.slice2d(result, 17, 33, 17, 33)
tap.equals(part.length, 16, "slice is 20 high")
tap.equals(part[0].length, 16, "slice is 20 wide")
tap.equals(part[0][0], 16, "0,0 is 16")
tap.equals(part[1][1], 0, "1,1 is 0")
tap.equals(part[15][15], 16, "15,15 is 16")
tap.equals(part[14][14], 0, "14,14 is 0")

const random_matrix = matrix.random_matrix(5,5)
tap.equals(random_matrix.length, 5, "height is 5")
tap.equals(random_matrix[0].length, 5, "width is 5")

const resized = matrix.resize(
    random_matrix,
    { x: 2, y: 2},
    { x: 10, y: 10},
    () => "", // (x, y) => (x+y)/2
    false // allow cropping
)
tap.equals(resized.length, 10, "resized height is right")
tap.equals(resized[0].length, 10, "resized width is right")

const cropped = matrix.resize(
    random_matrix,
    { x: -1, y: -1},
    { x: 10, y: 10},
    () => "",
    true // allow cropping
)
tap.equals(cropped.length, 10, "cropped height is right")
tap.equals(cropped[0].length, 10, "cropped width is right")
