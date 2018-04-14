# README

functions manipulating 2d matrices used by motte-and-bailey.com

function names might sometimes seem wonky because I don't want to create
confusions with legitimate mathematical terms

this library is in a very early stage and the API will change without warning
until version 1.0 is released

the code should hopefully conform to ES6 standards

## EXAMPLES
look under t/ for examples about how to use it

## BUILD

npm run build
npm run test (also runs build)

## FUNCTIONS

### pgm_to_matrix
in
    * image_data: content of a ascii PGM file
out
    * new 2D array

### normalize_int
see formula http://mathforum.org/library/drmath/view/60433.html ; Math.floor is applied to the result of that formula

in (all integers)
    * item
    * actual_min_value
    * actual_max_value
    * normal_min
    * normal_max
out
    * integer

### slice2d
in
    * original
    * start_x
    * end_x
    * start_y
    * end_y
out
    * new 2d array

### random_matrix
returns a 2d array of the specified size with random numbers between
0 and 1 as values; if a callback is provided that value will be passed though it
and the result used in the cell

in
    * x : integer
    * y : integer
    * callback = (x) => x)

out
    * new 2d array

### resize
creates a new 2d array with adds extra values (as returned by the fill()
callback ) and the original data starting with the specified offset;
allow_cropping permits allows the new size to be smaller than the original or
the offset values to be negative so only part of the original 2d array values
are preserved in the result

in
    * original : 2d array
    * offset : object, such as { x: someValue, y: someOtherValue}
    * new_size : object, such ash { x: 10, y:10 }
    * fill : fill(x, y)
    * allow_cropping: boolean

out
    * new 2d array
fill(x,y) is function expecting the coordinates of the element and returning
a value to be set to each element not existing already in the original

### stretch
similar with scaling using bilinear interpolation, but simpler; values on the
edges are kept on the edges; not using "scale" in the name so it will not create
the wrong expectations

in
    * orig : 2d array of integers
    * new_width : int
    * new_height : int

out
    * new 2d array

### enlarge TODO
similar with scaling using nearest neighbor interpolation but hopefully simpler

in
    * orig: 2d array of integers
    * new_width
    * new_height
out
    * new 2d array

### bundle TODO
creates a new 2D array from a bunch of smaller 2d arrays by placing them one
besides the other with offsets based on a single origin point and custom
spacing between them

### stack TODO
creates a new 2D array of specified size from a bunch of smaller 2d arrays by
placing them one on top of another at specified offsets, adding the values of the
overlapping elements then using that value and the coordinates in the new array
to compute new values for the final result



## DEPENDENCIES

### Production
none

### Development
    * eslint
    * tap
    * webpack
    * webpack-cli
    * pngjs
