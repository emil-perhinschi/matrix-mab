const matrix = require("matrix-mab.js")
const tap = require("tap")

const first = [
    [1],[2],[2],
    [1.1],[3],[2.2],
    [1],[5],[2.3]
]

const second = [
    [1000],[2],[2],
    [1.1],[3],[2.2],
    [1],[5],[2.3]
]

const third = [
    [1],[2],[2],
    [1.1],[3],[2.2],
    [1],[5],[2.3]
]
tap.ok(matrix.are_equal(first,first))
tap.ok(!matrix.are_equal(first,second))
tap.ok(!matrix.are_equal(second,third))
tap.ok(matrix.are_equal(first,third))
