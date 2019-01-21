const {contentView} = require('tabris');

const lottieView = new eslottie.LottieView({
  centerX: 0, centerY: 0, width: 256, height: 256,
  repeatCount: -1,
  animation: 'https://assets.lottiefiles.com/datafiles/HN7OcWNnoqje6iXIiZdWzKxvLIbfeCGTmvXmEm1h/data.json',
  background: '#fafafa',
}).appendTo(contentView)
  .onAnimationLoaded((e) => console.log('animation loaded'))
  // .onAnimationUpdated((e) => console.log('animation updated ' + e.value))
  .onAnimationStateChanged((e) => console.log('state changed: ' + e.value));

lottieView.play();

// fetch('resources/happy-new-year.json')
//   .then((response) => {
//     if (!response.ok) {
//       throw response.statusText;
//     }
//     return response.text()
//   })
//   .then((animation) => {
//     lottieView.animationJson = animation;
//     lottieView.play();
//   })
//   .catch((error) => console.log('Could not load animation. ' + error));
