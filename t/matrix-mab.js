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

const normalized = matrix.normalize_matrix(result, 0, 16)
tap.equals(normalized[0][0], 16, "0,0 is 16")
tap.equals(normalized[25][25], 0, "25,25 is 0")

const part = matrix.slice2d(normalized, 17, 33, 17, 33)
tap.equals(part.length, 16, "slice is 20 high")
tap.equals(part[0].length, 16, "slice is 20 wide")
tap.equals(part[0][0], 16, "0,0 is 16")
tap.equals(part[1][1], 16, "1,1 is 0")
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


const test_min_max = [
    [-1, 0, 1, 100],
    [-25, 0, 25, 1000]
]

const { min, max } = matrix.get_min_and_max_values(test_min_max)
tap.equals(min,  -25, "min is correct")
tap.equals(max, 1000, "max is correct")

const to_normalize = [ 0,1,2,3,4,5,6 ]
const result_norm = matrix.normalize_array(to_normalize, 0, 16)
tap.equals(result_norm[0], 0,  "first element is correct")
tap.equals(result_norm[1], 2,  "second element is correct")
tap.equals(result_norm[5], 13, "sixth element is correct")
tap.equals(result_norm[6], 16, "last element is correct")

const first = matrix.random_matrix(10,10)
const second = matrix.random_matrix(10,10)
const sum = matrix.add_matrices(first, second)

tap.equals(( first[0][0] + second[0][0]), sum[0][0])
tap.equals(( first[1][2] + second[1][2]), sum[1][2])
tap.equals(( first[3][3] + second[3][3]), sum[3][3])
tap.equals(( first[5][9] + second[5][9]), sum[5][9])
