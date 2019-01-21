class LottieView extends tabris.Widget {

  get _nativeType() {
    return 'com.eclipsesource.lottie.LottieView';
  }

  play() {
    this._nativeCall('play');
  }

  cancel() {
    this._nativeCall('cancel');
  }

  pause() {
    this._nativeCall('pause');
  }

  resume() {
    this._nativeCall('resume');
  }

}

tabris.NativeObject.defineProperties(LottieView.prototype, {
  animation: {type: 'string'},
  animationJson: {type: 'string'},
  speed: {type: 'number', default: 1},
  playing: {type: 'boolean', nocache: true, readonly: true},
  repeatCount: {type: 'number', default: 0},
  repeatMode: {type: ['choice', ['restart', 'reverse']], default: 'restart'},
  frame: {type: 'number', nocache: true},
  minFrame: {type: 'number', nocache: true},
  maxFrame: {type: 'number', nocache: true},
  progress: {type: 'number', nocache: true},
  minProgress: {type: 'number', default: 0},
  maxProgress: {type: 'number', default: 1},
  scaleMode: {type: ['choice', ['auto', 'fill']], default: 'auto'},
  scale: {type: 'number', default: 1},
});

tabris.NativeObject.defineEvents(LottieView.prototype, {
  animationLoaded: {native: true},
  animationUpdated: {native: true},
  animationStateChanged: {native: true}
});

module.exports = LottieView;
