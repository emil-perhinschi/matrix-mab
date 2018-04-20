"use strict"
const matrix = require("matrix-mab.js")
const tap = require("tap")

const orig = matrix.random_matrix(
    10, 10,
    function(x) {
        return matrix.normalize_int(x, 0, 1, 0, 255)
    }
)

tap.equals(orig.length, 10, "got random matrix of width 10")

const new_x = 100
const new_y = 100
const result = matrix.stretch(orig, new_x, new_y)

tap.equals(result.length, 100, "and stretched that matrix to width 10")

// const test_image = "t/circles.pgm"
// const fs = require("fs")
// const PNG = require('pngjs').PNG;
// const image_data = fs.readFileSync(
//     test_image,
//     "ascii"
// )
//
// const image_matrix = matrix.pgm_to_matrix(image_data)
// console.log(image_matrix.length, image_matrix[0].length)
//
//
// debug_preview(image_matrix, 'input.png');
// const stretched = matrix.stretch(image_matrix, 2000,2000)
// debug_preview(stretched, 'ouput.png');
//
// function debug_preview(matrix, filename) {
//
//     var png = new PNG({
//         width: matrix[0].length,
//         height: matrix.length,
//         filterType: -1
//     });
//
//     for (var y = 0; y < png.height; y++) {
//         for (var x = 0; x < png.width; x++) {
//             var idx = (png.width * y + x) << 2;
//             png.data[idx  ] = matrix[y][x];
//             png.data[idx+1] = matrix[y][x];
//             png.data[idx+2] = matrix[y][x];
//             png.data[idx+3] = 255;
//         }
//     }
//
//     png.pack().pipe(fs.createWriteStream(filename));
// }
