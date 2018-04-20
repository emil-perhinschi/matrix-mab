"use strict"

// need to read the image data separately
export function pgm_to_matrix( image_data ) {

    let lines = image_data.split("\n")
    const type = lines.shift()
    if (type != "P2") {
        throw "File is not PGM"
    }
    lines.shift() // remove empty lines or comments
    const size = lines.shift().split(" ")
    const max_value = lines.shift()

    if ( lines[lines.length - 1] == null) {
        lines.pop()
    }

    let map_data = new Array()
    while ( lines.length >= size[0] ) {
        map_data.push(
            Array.from(
                lines.splice(0, size[0]),
                (x) => parseInt(x)
            )
        )
    }

    return map_data
}

export function normalize_matrix(
    orig,
    normal_min = 0, normal_max = 16,
    normalize_function // this shoud be a callback
    ) {
    const { min, max } = get_min_and_max_values(orig)
    if (typeof normalize_function !== "function") {
        normalize_function = (value) => normalize_int(
            Math.round(Number(value)),
            min, max,
            normal_min, normal_max
        )
    }

    return Array.from(
        orig,
        function(row) {
            return Array.from(
                row,
                function(item) {
                    return normalize_function(item)
                }
            )
        }
    )
}

export function get_min_and_max_values(matrix) {
    let min = 0
    let max = 0
    const check_row = function(row) {
        row.forEach(
            function(item) {
                const int_value = Number(item)
                min = min <= int_value ? min : int_value
                max = max >= int_value ? max : int_value
            }
        )
    }
    matrix.forEach( check_row )
    return { min: min, max: max }
}


export function normalize_int (
    item,
    actual_min_value, actual_max_value,
    normal_min, normal_max) {

    if ( normal_min === normal_max ) {
        console.log(normal_min, normal_max)
        throw " the normal min and max values are equal"
    }
    // http://mathforum.org/library/drmath/view/60433.html
    // 1 + (x-A)*(10-1)/(B-A)
    return Math.floor(
        normal_min +
            (item - actual_min_value)
            * (normal_max - normal_min)
            / (actual_max_value - actual_min_value)
    )
}

export function normalize_array ( input_array, normal_min, normal_max ) {

    let actual_max_value = 0
    let actual_min_value = 0
    input_array.map(
        function(item) {
            const item_int = parseInt(item)
            actual_max_value =
                item_int > actual_max_value
                    ? item_int : actual_max_value
            actual_min_value =
                item_int < actual_min_value
                    ? item_int : actual_min_value
        }
    )

    return input_array.map(
        function(item) {
            return normalize_int(
                parseInt(item),
                actual_min_value,
                actual_max_value,
                normal_min,
                normal_max
            )
        }
    )
}

export function slice2d(original, start_x, end_x, start_y, end_y) {

    if (start_x >= end_x)
        throw "start_x should be smaller than end_x"
    if (start_y >= end_y)
        throw "start_y should be smaller than end_y"

    return Array.from(
        original.slice(start_y, end_y),
        (row) => row.slice(start_x, end_x)
    )
}


export function random_matrix( x, y, callback = (x) => x) {
    return Array.from(
        Array(y),
        () => Array.from(
            Array(x),
            () => callback( Math.round( Math.random() ) )
        )
    )
}

// fill : (x,y) => do_something_based_on_x_and_y_or_just_return_a_value()
// allow_cropping: permit the original to be placed partially outside the new
//    matrix, thus cropping the parts which stay outside
export function resize(original, offset, new_size, fill, allow_cropping) {
    if (allow_cropping === false) {
        if (offset.x < 0 || offset.y < 0) {
            throw "cropping is not allowed and the offset coordinates are negative"
        }
        if (
            original.length > new_size.y
            || original[0].length > new_size.x
        ) {
            throw "cropping is not allowed and the new size is smaller than the original"
        }

        if (
            original.length + offset.y > new_size.y
            || original[0].length + offset.x > new_size.x
        ) {
            throw "cropping is not allowed and the offset"
                + " pushes the original outside the new size"
        }
    }

    return Array.from(
        Array(new_size.y),
        (y_value, y) => Array.from(
            Array(new_size.x),
            function (x_value, x) {
                if ( original[y - offset.y] !== undefined
                    && original[y - offset.y][x - offset.x] !== undefined ) {
                    return original[y - offset.y][x - offset.x]
                }
                return fill(x, y)
            }
        )
    )
}

export function stretch(orig, new_width, new_height) {
    const height = orig.length
    const spacing = (new_height - 1)/( height - 1 )
    const stretched_coordinates = Array.from(
        Array(height),
        (value, i) => (i * spacing)
    )

    let orig_coordinates = 0
    let next_coordinates = stretched_coordinates[orig_coordinates]
    // let prev_coordinates = 0
    const sparse = Array.from(
        Array(new_height),
        function(undef, i) {
            if (
                next_coordinates - i <= (next_coordinates % 1) // less than the fractional part
            ) {
                const stretched_row = stretch_row(orig[orig_coordinates], new_width)
                // prev_coordinates = next_coordinates
                orig_coordinates += 1
                next_coordinates = stretched_coordinates[orig_coordinates]
                return stretched_row
            } else {
                return Array.from(
                    Array(new_width),
                    () => null
                )
            }
        }
    )

    const stretched = Array.from(
        sparse,
        (row, y) => Array.from(
            sparse[y],
            function(cell, x) {
                if (cell === null ) {
                    return evaluate_neighbours(sparse, x, y)
                } else {
                    return cell
                }
            }
        )
    )

    return stretched
}

function evaluate_neighbours(matrix, x, y) {

    if (x !== parseInt(x)) { throw "x is not an integer" }
    if (y !== parseInt(y)) { throw "x is not an integer" }

    let top_value = 0
    let bottom_value = 0
    // we're in the top or bottom row:
    //   that is wrong, the algorithm keeps the original
    //   data for the borders on the new borders so it should not happen
    if (
        typeof(matrix[y - 1]) === "undefined"
        ||
        typeof(matrix[y + 1]) === "undefined"
    ) {
        throw "we're in the top row, there should be no "
    }

    let top = 1 // distance to the first not null row
    while (top < matrix.length) {
        if (matrix[y - top ][x] !== null) {
            top_value = Number(matrix[y - top ][x])
            break
        }
        top += 1
    }

    let bottom = 1
    while (bottom < matrix.length) {
        if (matrix[y + bottom][x] !== null) {
            bottom_value = Number(matrix[y + bottom][x])
            if (isNaN(bottom_value)) {
                console.error({
                    y: y,
                    bottom: bottom,
                    x: x,
                    wrong: matrix[y + bottom][x],
                    length: matrix[0].length,
                    height: matrix.length
                })
                throw "bottom value isNaN, something is very wrong"
            }
            break
        }
        bottom += 1
    }

    const slope = (bottom_value - top_value)/(top + bottom)
    const value = top_value + slope * (top)
    if ( isNaN(value) ) {
        console.error({
            top_value: top_value,
            top: top,
            bottom: bottom,
            bottom_value: bottom_value,
            slope: slope,
            value: value
        })
        throw "got a NaN result, something is very wrong"
    }
    return value
}


function stretch_row(orig, new_size) {

    const spacing = (new_size - 1)/( orig.length - 1 )
    const stretched_coordinates = Array.from(
        Array(orig.length),
        (value,i) => (i * spacing)
    )

    let orig_coordinates = 0
    let next_coordinates = stretched_coordinates[orig_coordinates]
    let prev_coordinates = 0
    const stretched = Array.from(
        Array(new_size),
        function(undef, i) {
            if (
                next_coordinates - i <= (next_coordinates % 1) // less than the fractional part
            ) {
                const value = orig[orig_coordinates]
                prev_coordinates = next_coordinates
                orig_coordinates += 1
                next_coordinates = stretched_coordinates[orig_coordinates]
                return value
            } else {
                const slope =
                    Number(orig[orig_coordinates] - orig[orig_coordinates - 1])
                    /
                    Number(next_coordinates - prev_coordinates)
                const value =  Number(orig[orig_coordinates - 1]) + Number( slope * (i - prev_coordinates) )
                return value

            }
        }
    )
    return stretched
}


export function enlarge(orig, new_width, new_height) {
    const height = orig.length
    const spacing = (new_height - 1)/( height - 1 )
    const stretched_coordinates = Array.from(
        Array(height),
        (value, i) => (i * spacing)
    )

    let orig_coordinates = 0
    let next_coordinates = stretched_coordinates[orig_coordinates]
    // let prev_coordinates = 0
    const sparse = Array.from(
        Array(new_height),
        function(undef, i) {
            if (
                next_coordinates - i <= (next_coordinates % 1) // less than the fractional part
            ) {
                const stretched_row = stretch_row(orig[orig_coordinates], new_width)
                // prev_coordinates = next_coordinates
                orig_coordinates += 1
                next_coordinates = stretched_coordinates[orig_coordinates]
                return stretched_row
            } else {
                return Array.from(
                    Array(new_width),
                    () => null
                )
            }
        }
    )

    const stretched = Array.from(
        sparse,
        (row, y) => Array.from(
            sparse[y],
            function(cell, x) {
                if (cell === null ) {
                    return evaluate_neighbours(sparse, x, y)
                } else {
                    return cell
                }
            }
        )
    )

    return stretched
}
