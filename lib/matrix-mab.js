"use strict"
const fs = require('fs');

// https://en.wikipedia.org/wiki/Matrix_(mathematics)

export function pgm_to_matrix( map_image_path ) {

    let lines = fs.readFileSync(
        map_image_path,
        'ascii'
    )
    .split("\n");

    const type = lines.shift()
    if (type != "P2") {
        throw "File is not PGM"
    }
    lines.shift() // remove empty lines or comments
    const size = lines.shift().split(" ")
    console.log("size: ", size)
    const max_value = lines.shift()
    console.log("max value: ", max_value)

    if ( lines[-1] == null) {
        lines.pop()
        console.log("last empty element was null")
    }

    // normalize from 0 to 16
    const normal_min = 0;
    const normal_max = 16;

    const normalized_values = normalize_values(lines, normal_min, normal_max);

    let map_data = new Array()
    while ( normalized_values.length >= size[0] ) {
        map_data.push(normalized_values.splice(0, size[0]))
    }
    console.log("map length: ", map_data.length)

    return map_data
}

function normalize_int (
    item,
    actual_max_value, actual_min_value,
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

function normalize_values ( input_array, normal_min, normal_max ) {

    let actual_max_value = 0;
    let actual_min_value = 0;
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
                actual_max_value,
                actual_min_value,
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


export function random_matrix( x, y) {
    return Array.from(
        Array(y),
        () => Array.from(
            Array(x),
            () => Math.round(Math.random())
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
