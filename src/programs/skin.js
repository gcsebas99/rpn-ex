const APP_MESSAGE = [
  '-BR-',
  'Type the number according to the skin you want to set:',
  '-BR-',
  '1 - Default (traditional terminal)',
  '2 - Retro gaming (for those with nostalgic feelings)',
  '-BR-',
  'if you want to quit type "exit"', 
  '-BR-',
];

/**
 * Skin
 * Allow skin change in terminal
 */
const Skin = () => {

  const init = () => {
    return [
      '-BR-',
      'Welcome to Skin App!', 
      ...APP_MESSAGE,
    ];
  };

  const processInput = text => {
    const trimmedText = text.trim();
    if(trimmedText === 'exit') {
      return ['Closing Skin app...', 'HALT'];
    }
    switch(trimmedText) {
      case '1':
        return [['Setting Default skin!', ...APP_MESSAGE], 'SKIN=0'];
      case '2':
        return [['Setting Retro gaming skin!', ...APP_MESSAGE], 'SKIN=1'];
      default:
        return [['value not recognized!', ...APP_MESSAGE], ''];
    }
  };

  /**
   * program interface
   */
  return {
    displayName: 'skin',
    init: init,
    processInput: processInput,
  }
};

export default Skin;