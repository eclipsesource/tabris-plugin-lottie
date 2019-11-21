import {
  CheckBox,
  Composite,
  contentView,
  ImageView,
  Picker,
  Slider,
  statusBar,
  TextView,
  WidgetCollection
} from 'tabris';

const LOTTIE_FILES = ['veil.json', 'thirsty.json', 'loader.json', 'done_button.json', 'giftbox.json'];

statusBar.set({
  theme: 'dark',
  background: '#00b2a4'
});

contentView.append(
  <WidgetCollection>
    <Composite left={0} right={0} background='#00d2c1' height={56} elevation={4}>
      <ImageView centerX={0} centerY={3} image='resources/lottie-toolbar-logo@3x.png'/>
    </Composite>
    <Picker left={16} right={16} top={['prev()', 16]} itemCount={LOTTIE_FILES.length} selectionIndex={0}
            itemText={(index) => LOTTIE_FILES[index]} onSelect={showAnimation}/>
    <CheckBox id='fetchCheckBox' right={12} top={['prev()', 0]}/>
    <TextView left={16} alignment='right' right={['prev()', 2]} baseline='prev()' text='Load via fetch'/>
    <eslottie.LottieView id='lottieView' left={16} right={16} top={['prev()', 32]} repeatCount={Infinity}
                         background='white' cornerRadius={8} elevation={4}
                         onLoad={initControls} onFrameChanged={updateProgressPosition}
                         onPlayingChanged={togglePlaybackButton}/>
    <Composite top={['prev()', 8]} left={0} right={0}>
      <eslottie.LottieView id='playButton' left={16} width={56} height={56} animation='resources/play-pause.json'
                           minFrame={10} maxFrame={25} highlightOnTouch='true' cornerRadius={28}
                           onTap={toggleLottieViewPlayback}/>
      <Slider id='progressSlider' left={64} right={16} centerY={0} onSelect={updateLottieViewPosition}/>
    </Composite>
  </WidgetCollection>
);

const lottieView = contentView.find('#lottieView').first(eslottie.LottieView);
const progressSlider = contentView.find('#progressSlider').first(Slider);
const playButton = contentView.find('#playButton').first(eslottie.LottieView);
const fetchCheckBox = contentView.find('#fetchCheckBox').first(CheckBox);

contentView.onResize((e) => lottieView.height = e.width - 16 * 2);

showAnimation({index: 0});

function initControls({composition}) {
  updateControlsEnabled(true);
  progressSlider.maximum = composition.frames
}

function updateProgressPosition({value: frame}) {
  progressSlider.selection = frame;
}

function togglePlaybackButton({value: playing}) {
  if (playing) {
    playButton.speed = -Math.abs(playButton.speed);
    playButton.resume();
  } else {
    playButton.speed = Math.abs(playButton.speed);
    playButton.play();
  }
}

function toggleLottieViewPlayback() {
  if (lottieView.playing) {
    lottieView.pause()
  } else {
    lottieView.resume()
  }
}

function updateLottieViewPosition({selection}) {
  if (lottieView.playing) {
    lottieView.pause();
  }
  lottieView.frame = selection;
}

function showAnimation({index}) {
  progressSlider.selection = 0;
  updateControlsEnabled(false);
  if (fetchCheckBox.checked) {
    loadViaFetch(index);
  } else {
    lottieView.animation = 'resources/' + LOTTIE_FILES[index];
  }
}

function updateControlsEnabled(enabled) {
  playButton.enabled = enabled;
  progressSlider.enabled = enabled;
}

function loadViaFetch(index) {
  fetch('resources/' + LOTTIE_FILES[index])
    .then((response) => {
      if (!response.ok) {
        throw response.statusText;
      }
      return response.arrayBuffer()
    })
    .then((animation) => lottieView.animation = animation)
    .catch((error) => console.log('Could not load animation. ' + error));
}
