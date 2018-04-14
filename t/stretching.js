"use strict"
const matrix = require("matrix-mab.js")
const tap = require('tap')

const orig = matrix.random_matrix(
    10, 10,
    function(x) {
        return matrix.normalize_int(x, 0, 1, 0, 255)
    }
)

tap.equals(orig.length, 10, 'got random matrix of width 10')
// debug_preview(orig, 'original.png')

const new_x = 100
const new_y = 100
const result = matrix.stretch(orig, new_x, new_y)
// debug_preview(result, 'scaled.png')

tap.equals(result.length, 100, 'and stretched that matrix to width 10')

function debug_preview(matrix, filename) {
    var fs = require('fs'),
    PNG = require('pngjs').PNG;

    var png = new PNG({
        width: matrix[0].length,
        height: matrix.length,
        filterType: -1
    });

    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
            var idx = (png.width * y + x) << 2;
            png.data[idx  ] = matrix[y][x];
            png.data[idx+1] = matrix[y][x];
            png.data[idx+2] = matrix[y][x];
            png.data[idx+3] = 255;
        }
    }

    png.pack().pipe(fs.createWriteStream(filename));
}
