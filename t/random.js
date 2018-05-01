const tap = require("tap")
const matrix = require("matrix-mab.js")
const width = 400
const height = 400

tap.doesNotThrow(() => test_array(), 'array stretching does not throw')
tap.doesNotThrow(() => test_matrix(), 'matrix stretching does not throw')

function test_array() {
    const blarg = matrix.random_array(40)

    const norm = matrix.normalize_array(blarg, 0, 16)

    const blarg_str = matrix.stretch_row(norm, 400)
}

function test_matrix() {
    const width = 400
    const height = 400
    const mask = matrix.random_matrix(
        40,
        40
    )

    const mask_normalized = matrix.normalize_matrix(mask, 0, 16)
    const mask_scaled = matrix.stretch(mask_normalized, width, height)
}
