class LottieView extends tabris.Widget {

  constructor(properties) {
    super(properties);
    this._state = 'finish';
    this.composition = null;
    this.on('stateChanged', ({state}) => this._state = state);
    this.on('load', () => {}); // required to get this.composition in this._trigger()
  }

  get _nativeType() {
    return 'com.eclipsesource.lottie.LottieView';
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
}

tabris.NativeObject.defineProperties(LottieView.prototype, {
  animation: {
    type: 'any',
    set(name, value) {
      this.composition = null;
      this._nativeSet(name, value);
      if (this.autoPlay) {
        this.play();
      }
    }
  },
  autoPlay: {type: 'boolean', default: true},
  speed: {type: 'number', default: 1},
  state: {
    type: ['choice', ['play', 'finish', 'pause', 'resume', 'cancel', 'repeat']],
    readonly: true,
    get() {return this._state}
  },
  playing: {type: 'boolean', nocache: true, readonly: true},
  repeatCount: {
    type: 'any',
    default: 0,
    set(name, value) {
      this._nativeSet(name, isFinite(value) ? value : -1)
    }
  },
  repeatMode: {type: ['choice', ['restart', 'reverse']], default: 'restart'},
  scaleMode: {type: ['choice', ['auto', 'fill']], default: 'auto'},
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
