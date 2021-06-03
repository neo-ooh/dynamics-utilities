const supports = require("../supports.json");

class Context {
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

    return ""
  };

  isBroadSignPlayer() {
    return this.getPlayer() === 'broadsign';
  }

  isPiSignagePlayer() {
    return this.getPlayer() === 'pisignage'
  }

  /**
   * Gives the dimensions in pixels of the frame in which we are to show.
   * @return {number[]} An array with the width and height in pixels
   */
  getResolution() {
    if(this.isBroadSignPlayer()) {
      // In the case of BroadSign, dimensions are given through the BroadSign object.
      return window.BroadSignObject.frame_resolution.split('x').map(Number);
    }

    // Otherwise, we simply pass back the window dimensions.
    return [window.innerWidth, window.innerHeight]
  };

  getSupport(fallback = null) {
    // Is a design given to us in the URL ?
    const design = new URLSearchParams(window.location.search).get("design")
    const hintedSupport = supports.filter(support => support.name === design)

    const [width, height] = this.getResolution();

    if(hintedSupport.length > 0) {
      // We have a match, return it with scale informations
      return {
        ...hintedSupport[0],
        scale: Math.min(Math.min(width / hintedSupport[0].width, height / hintedSupport[0].height))
      }
    }

    // We will use the screen resolution to deduce the current support.
    // We check our list of predefined support to find one that matches the current screen dimensions
    let matchingSupports = supports.filter(s => s.width === width && w.height === height);
    if(matchingSupports.length > 0) {
      return {
        ...matchingSupports[0]
      }
    }

    // No support matched using the screen dimensions. We will try again using the ratio
    const aspectRatio = height/width;
    matchingSupports = supports.filter(s => (s.height / s.width) === aspectRatio);

    if(matchingSupports.length > 0) {
      // We have a match, return it with scale informations
      return {
        ...matchingSupports[0],
        scale: Math.min(Math.min(width / matchingSupports[0].width, height / matchingSupports[0].height))
      }
    }

    // No support could be found, do we have a fallback one ?
    if(fallback) {
      return {
        ...fallback,
        scale: Math.min(Math.min(width / fallback.width, height / fallback.height))
      }
    }

    return null;
  }

  /**
   * This method provides information on the current context the script is running in. The idea is to abstract most if not all vendor-specific operation/properties from the dynamics themselves.
   *
   * This method provides different informations
   *
   * @returns {{ player: string }}
   */
  getContext() {
    const ctx = {};

    // First task is to determine the current player we are running in.
    ctx.player     = this.getPlayer();
    ctx.resolution = this.getResolution();

  };
}

module.exports.Context = Context
