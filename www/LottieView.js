class LottieView extends tabris.Widget {

  constructor(properties) {
    super(properties);
    this._state = 'finish';
    this.composition = null;
    this.on('stateChanged', ({state}) => this._state = state);
    this.on('animationChanged', () => this._handleAutoPlay());
    this.on('load', () => {}); // required to get this.composition in this._trigger()
  }

  get _nativeType() {
    return 'com.eclipsesource.lottie.LottieView';
  }

  get state() {
    return this._state;
  }

  play() {
    this._triggerPlayingChangeEvent('play');
    this._nativeCall('play');
  }

  cancel() {
    this._triggerPlayingChangeEvent('cancel');
    this._nativeCall('cancel');
  }

  pause() {
    this._triggerPlayingChangeEvent('pause');
    this._nativeCall('pause');
  }

  resume() {
    this._triggerPlayingChangeEvent('resume');
    this._nativeCall('resume');
  }

  _trigger(name, event) {
    if (name === 'stateChanged') {
      let result = this._triggerChangeEvent('state', event.state);
      this._triggerPlayingChangeEvent(event.state);
      return result;
    } else if (name === 'frameChanged') {
      return this._triggerChangeEvent('frame', event.frame);
    } else if (name === 'load') {
      this.composition = this._nativeGet('composition');
      return super._trigger('load', {composition: this.composition});
    }
    return super._trigger(name, event);
  }

  _beforePropertyChange(property, value) {
    if (property === 'animation') {
      this.composition = null;
    }
    super._beforePropertyChange(property, value);
  }

  _listen(name, listening) {
    if (name === 'stateChanged' || name === 'frameChanged') {
      this._nativeListen(name, listening);
    } else {
      super._listen(name, listening);
    }
  }

  _triggerPlayingChangeEvent(state) {
    const playingState = state === 'play' || state === 'resume' || state === 'repeat';
    if (this.playing !== playingState) {
      super._triggerChangeEvent('playing', playingState);
    }
  }

  _handleAutoPlay() {
    if (this.autoPlay) {
      this.play();
    }
  }

}

tabris.NativeObject.defineProperties(LottieView.prototype, {
  animation: {type: 'any', default: null},
  autoPlay: {type: 'boolean', default: true},
  speed: {type: 'number', default: 1},
  playing: {type: 'boolean', nocache: true, readonly: true},
  repeatCount: {
    type: {
      encode(value) {
        return isFinite(value) ? value : -1;
      }
    },
    default: 0
  },
  repeatMode: {choice: ['restart', 'reverse'], type: 'string', default: 'restart'},
  scaleMode: {choice: ['auto', 'fill'], type: 'string', default: 'auto'},
  scale: {type: 'number', default: 1},
  frame: {type: 'number', nocache: true},
  minFrame: {type: 'number', nocache: true},
  maxFrame: {type: 'number', nocache: true}
});

tabris.NativeObject.defineEvents(LottieView.prototype, {
  load: {native: true},
  update: {native: true},
});

module.exports = LottieView;
