/*
 *
 *
 * @type {{default?}|boolean}
 */

const isBroadSignPlayer = require('./isBroadSignPlayer')
const supports = require('./supports')

/**
 * This methods detects the current support in which this application is running.
 * The return value is an object containing the following properties:
 *  - `name`: The three capital letter name of the support
 *  - `width`: The basic width of this support in pixels
 *  - `height`: The basic height of this support
 *  - `design`: The preffered design to use with this support. This is used for supports using designs from another support
 *  - `scale`: The scaling factor if the current support match the returned support aspect ratio but doesn't have the same dimensions
 *
 *  The returned informations may not match perfectly the current support as it assumes a different screen size, but same aspect
 *  ratio is considered the same support. The scale property is provided to help adjust content size.
 *
 *  In case the application is running in a BroadSign Player, the dimensions used will be the one provided by BroadSign directly.
 *  otherwise, this method uses the `navigator.window` inner dimensions.
 *
 *  The method has multiple way of inferring the current support. By giving it an hint in the form of the name of a support,
 *  you can override other detection methods if the hint match a registered support
 *
 *  If the method cannot infer a support, a default, fallback, support will be given instead. This is set as the first supports
 *  in the list of known supports, but can be overriden in the methods parameters.
 *
 * @param hint
 * @param fallbackSupport
 * @returns {{
 *  name: string,
 *  design: string,
 *  height: number,
 *  width: number,
 *  scale: number
 *  }}
 */
module.exports = function (hint = null, fallbackSupport = supports[0]) {
  // Filter known supports by the given hint
  const hintedSupport = supports.filter(support => support.name === hint)

  // Get the current screens dimensions
  const [screenWidth, screenHeight] = isBroadSignPlayer ?
    window.BroadSignObject.display_unit_resolution.split('x').map(Number) : // Get dimensions from broadsign
    [window.innerWidth, window.innerHeight] // Get dimensions from the navigator

  // If a support matched, return this one
  if (hintedSupport.length > 0) {
    return {
      scale: screenWidth / hintedSupport[0].width,
      ...hintedSupport[0]
    }
  }

  // Calculate the current support aspect ration
  const aspectRatio = screenHeight / screenWidth

  // Check if any of the registered supports perfectly match
  const perfectSupports = supports.filter(support => support.height === screenHeight && support.width === screenWidth)

  // Is there a match ?
  if (perfectSupports.length > 0) {
    // There is a perfect match, return it with a scale at 1.0
    return {
      scale: 1.0,
      ...perfectSupports[0]
    }
  }

  // Check if any of the registered supports has the same aspect ratio
  const matchingSupports = supports.filter(support => support.height / support.width === aspectRatio)

  // Is there a match ?
  if (matchingSupports.length === 0) {
    return {
      scale: 1.0,
      ...fallbackSupport
    } // No known support can be associated with this screen, return the fallback support
  }

  // Return the matching support with the scale difference
  return {
    scale: screenWidth / matchingSupports[0].width,
    ...matchingSupports[0]
  }
}