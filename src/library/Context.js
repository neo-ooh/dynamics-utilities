import addresser from 'addresser';
import supports  from './supports.json';

class Context {
  /**
   * Get the type of the player. The player type will either be 'broadsign' or undefined if the player type could not be determined
   * @return {string|undefined}
   */
  getPlayer() {
    if (!this.playerType) {
      this.playerType = this.__inferPlayerType();
    }

    return this.playerType;
  };

  __inferPlayerType() {
    // The BroadSign player injects a BroadSign object in the page, it is then easy to tell we are running in a player
    if (typeof navigator !== 'undefined' && typeof window.BroadSignObject !== 'undefined') {
      return 'broadsign';
    }

    return undefined;
  };

  /**
   * Tell if the current player is a BroadSign player
   * @return {boolean}
   */
  isBroadSignPlayer() {
    return this.getPlayer() === 'broadsign';
  }

  /**
   * Tell if the current player is a PiSignage player.
   * @warning This method always return false as of now because there is no reliable way of differentiating a PiSignage player from a basic browser.
   * @return {boolean}
   */
  isPiSignagePlayer() {
    return this.getPlayer() === 'pisignage';
  }

  /**
   * Gives the dimensions in pixels of the frame in which we are to show.
   * @return {number[]} An array with the width and height in pixels
   */
  getResolution() {
    if (this.isBroadSignPlayer()) {
      // In the case of BroadSign, dimensions are given through the BroadSign object.
      return window.BroadSignObject.frame_resolution.split('x').map(Number);
    }

    // Otherwise, we simply pass back the window dimensions.
    return [ window.innerWidth, window.innerHeight ];
  };

  /**
   * Retyrb the support details for the current run.
   * @param fallback The name of a support to return in case no support could be inferred
   * @return {null|{ name: string, width: number, height: number, design: string, scale: number }}
   */
  getSupport(fallback = null) {
    // Is a design given to us in the URL ?
    const design        = this.getParam('design')
    const hintedSupport = supports.filter(support => support.name === design);

    const [ width, height ] = this.getResolution();

    if (hintedSupport.length > 0) {
      // We have a match, return it with scale informations
      return {
        ...hintedSupport[0],
        scale: Math.min(Math.min(width / hintedSupport[0].width, height / hintedSupport[0].height)),
      };
    }

    // We will use the screen resolution to deduce the current support.
    // We check our list of predefined support to find one that matches the current screen dimensions
    let matchingSupports = supports.filter(s => s.width === width && s.height === height);
    if (matchingSupports.length > 0) {
      return {
        ...matchingSupports[0],
      };
    }

    // No support matched using the screen dimensions. We will try again using the ratio
    const aspectRatio = height / width;
    matchingSupports  = supports.filter(s => (s.height / s.width) === aspectRatio);

    if (matchingSupports.length > 0) {
      // We have a match, return it with scale informations
      return {
        ...matchingSupports[0],
        scale: Math.min(Math.min(width / matchingSupports[0].width, height / matchingSupports[0].height)),
      };
    }

    // No support could be found, do we have a fallback one ?
    if (fallback) {
      const fallbackSupport = supports.filter(s => s.name === fallback)[0];

      return {
        ...fallbackSupport,
        scale: Math.min(Math.min(width / fallbackSupport.width, height / fallbackSupport.height)),
      };
    }

    return null;
  }

  /**
   * Convenient method to get a URL paramater.
   * @param param name of the param in the URI
   * @return {string|null} The parameter value or null if it doesn't exist
   */
  getParam(param) {
    return (new URLSearchParams(window.location.search)).get(param);
  }

  /**
   * Get the components (country, province, city) of the current player location as an array
   * @return {[string, string, string]} [country, province, city]
   */
  getLocation() {
    // Start by checking if the country, province and city url parameters are provided. They act as override above all other methods for specifying the location
    const [ country, province, city ] = [ this.getParam('country'), this.getParam('province'), this.getParam('city') ];

    if (country && province && city) {
      return [ country, province, city ];
    }

    if (this.isBroadSignPlayer()) {
      // BroadSign includes the address of the player in its BroadSign object.
      // We just have to extract the components we need using an adress parser
      const address = window.BroadSignObject.display_unit_address;

      const components = addresser.parseAddress(address);

      return [ 'CA', components.stateAbbreviation, components.placeName ];
    }

    throw 'Could not found location data';
  }

  /**
   * Provides the latitude and longitude of the current player. If not able to get this information, this function defaults to Winnipeg coordinate as middle ground
   * @return {{lng: number, lat: number}}
   */
  getGeoLocation() {
    // Try to provide the geolocation of the current player.
    // Depending on the player type and the current dynamic, different strategy can be used to get the geocode

    if (this.isBroadSignPlayer()) {
      // Broadsign Provides the player geolocation in its BroadSign object
      const [lat, lng] = window.BroadSignObject.display_unit_lat_long.split(',');
      return { lat: Number(lat), lng: Number(lng) }
    }

    // If not a broadsign player, we will check if there is lat and lng information attached to our url
    const [lat, lng] = [this.getParam('lat'), this.getParam('lng')];

    if(lat && lng) {
      return { lat: Number(lat), lng: Number(lng) }
    }

    // If there wasn't any geocoding information provided in the url, then we default to a location in the center of Canada (Winnipeg)
    return { lat: 49.895077, lng: -97.138451 };
  }
}

export default Context;
