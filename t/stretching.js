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
