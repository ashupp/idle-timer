/**
 * idleTimer
 *
 * If user is idle for idleTime fire callback
 * 
 * @param {object} options
 *    - {function} callback - fired when user is idle
 *    - {function} activeCallback - fired when user is active
 *    - {Number} idleTime - time in milliseconds  
 *    - {iFrameId} optional iframe to which the events should be attached to (only after loaded)
 */

module.exports = idleTimer;

function idleTimer(options) {
  options = options || {};
  var callback = options.callback || function() {};
  var activeCallback = options.activeCallback || function() {};
  var idleTime = options.idleTime || 60000;
  var iFrameId = options.iFrameId || false;
  var isActive = true;
  var timer;

  addOrRemoveEvents('addEventListener');
  activate();

  function addOrRemoveEvents(addOrRemove) {
    if(iFrameId != false){
        document.getElementById(iFrameId).contentWindow.document[addOrRemove]('click', activate);
        document.getElementById(iFrameId).contentWindow.document[addOrRemove]('mousemove', activate);
        document.getElementById(iFrameId).contentWindow.document[addOrRemove]('scroll', activate);
        document.getElementById(iFrameId).contentWindow.document[addOrRemove]('keypress', activate);
        document.getElementById(iFrameId).contentWindow.document[addOrRemove]('touchstart', activate);
    }else{
        window[addOrRemove]('load', activate);
        document[addOrRemove]('click', activate);
        document[addOrRemove]('mousemove', activate);
        document[addOrRemove]('scroll', activate);
        document[addOrRemove]('keypress', activate);
        document[addOrRemove]('touchstart', activate);
    }
  }

  function activate() {
    if (!isActive) {
      isActive = true;
      activeCallback();
    }
    clearTimeout(timer);
    timer = setTimeout(idle, idleTime);
  }

  function idle() {
    if (!isActive) return;
    isActive = false;
    callback();
  }

  function destroy() {
    clearTimeout(timer);
    addOrRemoveEvents('removeEventListener');
  }

  return {
    activate: activate,
    destroy: destroy,
    idle: idle
  };
}
