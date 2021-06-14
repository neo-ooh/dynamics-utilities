import React          from 'react';
import DynamicContext from './DynamicContext';

/**
 * The playstart listener goal is to tell the dynamic when it is live on screen and should start playing its content. Usually, this happens upon loading, but with BroadSign websites gets preloaded in the background before being displayed.
 * @return {JSX.Element}
 * @constructor
 */
const PlayStartListener = ({ onDisplayStart }) => {
  const { playerType } = React.useContext(DynamicContext);
  const [ displayStarted, setDisplayStarted ] = React.useState(false);

  const handleDisplayStart = React.useCallback(() => {
    setDisplayStarted(true)
  }, [])

  // Set up the proper starting state depending on the player type.
  React.useEffect(() => {
    if(playerType === 'broadsign') {
      document.getElementById('broadsign-holder').addEventListener('click', handleDisplayStart);

      return; // The broadsign holder will send the go live event
    }

    handleDisplayStart()
  })

  // Call the display start callback on display start
  React.useEffect(() => {
    if(displayStarted) {
      onDisplayStart();
    }
  }, [displayStarted])

  return null;
};

export default PlayStartListener;
