function injectedFunction(isWatching) {
    const video = document.getElementsByTagName("video")[0];
    if (video) {
        if (isWatching) {
            video.play()
        } else {
            video.pause();
        }
    }
}

JEELIZGLANCETRACKER.init({
    // MANDATORY:
    // callback launched when:
    //  * the user is watching (isWatching=true) 
    //  * or when he stops watching (isWatching=false)
    // it can be used to play/pause a video
    callbackTrack: function (isWatching) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: injectedFunction,
                args: [isWatching]
            });
        });
    },

    // FACULTATIVE (default: none):
    // callback launched when then Jeeliz Glance Tracker is ready
    // or if there was an error
    // spec is an object with these attributes:
    //   * <video> video: the video element
    //   * <WebGLContext> GL: the webgl context
    //   * <WebGLTexture> videoTexture: WebGL texture storing the camera video
    //   * <WebGLTexture> videoTextureCut: WebGL texture storing the cropped face
    callbackReady: function (error, spec) {
        if (error) {
            console.log('EN ERROR happens', error);
            return;
        }
        console.log('All is well :)');
    },

    //FACULTATIVE (default: true):
    //true if we display the video of the user
    //with the face detection area on the <canvas> element
    isDisplayVideo: false,

    // MANDATORY:
    // id of the <canvas> HTML element
    canvasId: 'glanceTrackerCanvas',

    // FACULTATIVE (default: internal)
    // sensibility to the head vertical axis rotation
    // float between 0 and 1: 
    // * if 0, very sensitive, the user is considered as not watching
    //   if he slightly turns his head,
    // * if 1, not very sensitive: the user has to turn the head a lot
    //   to loose the detection. 
    sensibility: 0.5,

    // FACULTATIVE (default: current directory)
    // should be given without the NNC.json
    // and ending by /
    // for example ../../
    NNCPath: "scripts/dist/"
});