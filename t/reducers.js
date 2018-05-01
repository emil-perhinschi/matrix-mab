const matrix = require("matrix-mab.js")
const tap = require("tap")

tap.equals(
    3,
    matrix.sum_elements([
        [1, 0, 1],
        [0, 1, 0]
    ])
)

tap.equals(
    9,
    matrix.sum_elements([
        [1, 0, 1],
        [0, 1, 0],
        [2, 2, 2]
    ])
)


tap.equals(
    1244,
    matrix.sum_elements([
        [2, 0, 2],
        [0, 2, 0],
        [2, 2, 1234]
    ])
)

tap.throws(
    () => matrix.sum_elements([
        [2, 0, 2],
        [0, 2, 0],
        [2, 2, "1234"]
    ])
)


const window = matrix.resize(
    [
        [1,1,1, 1,1,1,1],
        [1,1,1, 1,1,1,1],
        [1,1,1,10,1,1,1],
        [1,1,1, 1,1,1,1],
        [1,1,1, 1,1,1,1]
    ],
    {"x": -1, "y": -1},
    {x: 3, y: 3},
    () => 0,
    true
)
tap.equals(window[0][0], 0)
tap.equals(window[1][1], 1)
tap.equals(window[2][2], 1)

const averaged = matrix.moving_average(
    [
        [1,1,1, 1,1,1,1],
        [1,1,1, 1,1,1,1],
        [1,1,1,10,1,1,1],
        [1,1,1, 1,1,1,1],
        [1,1,1, 1,1,1,1]
    ],
    1
)

tap.equals(0.4444444444444444, averaged[0][0])
tap.equals(2, averaged[2][3])

const replaced = matrix.replace_elements(
    [
        [1,1,1, 1,1,1,1],
        [1,1,1, 1,1,1,1],
        [1,1,1,10,1,1,1],
        [1,1,1, 1,1,1,1],
        [1,1,1, 1,1,1,1]
    ],
    (i) => i < 3,
    () => 0
)
tap.equals(0, replaced[0][0])
tap.equals(10, replaced[2][3])
