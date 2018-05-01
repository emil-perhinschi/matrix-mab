# README

functions manipulating 2d matrices I use to generate random maps

function names might sometimes seem wonky because I don't want to create
confusions with legitimate mathematical terms

this library is in a very early stage and the API will change without warning
until version 1.0 is released

the code should hopefully conform to ES6 specs; if it does not then it's a bug

## EXAMPLES
look under t/ for examples about how to use it

## BUILD

npm run build
npm run test (also runs build)

## FUNCTIONS

### add_matrices
in

  * first: 2d array
  * second: 2d array same size as first

out

  * 2d array, each element sum of the elements with the same indices in the arguments

### pgm_to_matrix
in

  * image_data: content of a ascii PGM file

out

  * new 2D array

### normalize_matrix
by default it will adjust the values to a scale between 0 and 16, but you
can provide other normal_min and normal_max values, and you can provide a
function; the default uses normalize_int below

in

  * 2d array
  * normal_min // default 0
  * normal_max // default 16
  * normalize_function // this should be a callback

out

  * new 2d array

### get_min_and_max_values
returns the min and the max values in the matrix as an object, such as { min: 0, max: 255 }

in

  * 2d array

out

  * object, ex. { min: 1, max: 33 }

### normalize_array
elements are parseInt-ed before being changed; the result contains only integers

in

  * 1d array
  * normal_min
  * normal_max

out

  * 1d array

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

fill(x,y) is function expecting the coordinates of the element and returning
a value to be set to each element not existing already in the original


in

  * original : 2d array
  * offset : object, such as { x: someValue, y: someOtherValue}
  * new_size : object, such ash { x: 10, y:10 }
  * fill : fill(x, y)
  * allow_cropping: boolean

out

  * new 2d array

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

### squeeze TODO
downscale 2d arrays

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
