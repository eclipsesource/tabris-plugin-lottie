# Tabris.js Lottie Plugin

A [Lottie](http://airbnb.io/lottie/) widget for [Tabris.js](https://tabrisjs.com), allowing to show and control lottie animations. This plugin currently supports only Android.

![Lottie widget on Android](assets/screenshots/lottie-android.png)

## Example

The following snippet shows how the `tabris-plugin-lottie` plugin can be used in a Tabris.js app:

```js
new eslottie.LottieView({
  left: 0, right: 0, top: 0, bottom: 0,
  animation: 'lottie-file.json'
}).appendTo(tabris.contentView);
```

A more elaborate example can be found in the [example](example/) folder. It provides a Tabris.js project that demonstrates the various features of the `tabris-plugin-lottie` plugin. Consult the [README](example/README.md) of the example for build instructions.

## Integrating the plugin

The Tabris.js website provides detailed information on how to [integrate custom widgets](https://tabrisjs.com/documentation/latest/build#adding-plugins) in your Tabris.js app. To add the plugin to your app add the following entry in your apps `config.xml`:

```xml
<!-- Not yet on npm -->
<!-- <plugin name="tabris-plugin-lottie" spec="^1.0.0" /> -->
```

To fetch the latest development version use the GitHub URL:

```xml
<plugin name="tabris-plugin-lottie" spec="https://github.com/eclipsesource/tabris-plugin-lottie.git" />
```

## API

The plugin api consists of the `eslottie.LottieView` [`Widget`](http://docs.tabris.com/latest/api/Widget.html) with the following properties, methods and events.

### `eslottie.LottieView`

#### Properties

##### `animation` : _string_ | _ArrayBuffer_

* Loads a Lottie animation from either an uri pointing to a json or zip file, or from an `ArrayBuffer` containing a json or zip file as bytes. After the animation has been loaded the `load` event is fired.
* By default the `autoPlay` property is set to `true`, starting the animation immediatly. Otherwise the animation has to be started explicitly (by e.g. calling `play()`). When not started the first frame is rendered.

##### `autoPlay` : _boolean_, default: `true`

* If set to `true`, the animation starts playing immediately after the animation has been loaded and the `load` event fired.

##### `playing` : _boolean_, read only, default: `false`

* Whether the animation is currently playing. A `playing` value of `true` translates to being in any of the states `play`, `resume` or `repeat`.

##### `state` : _string_, read only, supported values: `play`, `finish`, `pause`, `resume`, `cancel`, `repeat`, default: `finish`

* Represents the current playback state. Using any of the `play()`/`pause()` etc. methods or letting the animation reach the end fires a `stateChanged` event.

##### `speed` : _number_, default: `1`

* Sets the playback speed. If speed < 0, the animation will play backwards.

##### `repeatCount` : _number_ | _Infinity_, default: `0`

* The number of times the animation should be repeated. By default the animation is played only once. To repeat the animation indefinitely the `repeatCount` can be set to `Infinity`.

##### `repeatMode` : _string_, supported values: `restart`, `reverse`, default: `restart`

* Specifies how to repeat the animation. Either by playing it again from the beginning or by playing it backwards when the end has been reached.

##### `scaleMode` : _string_, supported values: `auto`, `fill`, default: `auto`

* The `scaleMode` allows to change the size of the animation when it does not match the bounds of the `LottieView`.
* The default value `auto` scales the animation to match the `Widget` bounds but does not scale the animation up. The
 value `fill` scales the animation to the bounds of the `LottieView`, making it fit inside but not changing its 
 proportions. The two modes work in the same manor as the `scaleMode` in the Tabris.js [`ImageView`](http://docs.tabris
 .com/latest/api/ImageView.html#scalemode).
* To retrieve the size of a loaded animation in dp the `composition` offers the `width` and `height` properties.

##### `scale` : _number_, default: `1`

* Allows to render the animation larger or smaller by multiplying the animation dimension with the `scale` factor. E.g. a `scale` of `0.5` shows the animation at half its size.
* The `scale` factor can also be used when an animation shows performance problems. In such a scenario one could set the `scale` to a value less than 1 (e.g. `0.5`) and set the `scaleMode` to `fill`. This would render the animation shrunken down but display it larger. The results would be less cpu usage but also a degradation of visual quality.

##### `composition` : _object_, read only, default: `null`

* A `composition` provides static meta-data about a loaded animation. It is available after the `load` event has fired. Setting a new `animation` sets the `composition` to `null`. The `composition` provides the following properties:

  * `width` : _number_ - the horizontal size of the animation in dp
  * `height` : _number_ - the vertical size of the animation in dp
  * `frames` : _number_ - the number of total frames in the animation
  * `frameRate` : _number_ - the length of one frame in the animation
  * `duration` : _number: - the total duration of the animation in milliseconds

##### `frame` : _number_, default: `0`

* The current frame that is rendered in the `LottieView`. When the `frame` changes a `frameChanged` event is fired.

##### `minFrame` : _number_, default: `0`

* The `minFrame` specifies the beginning frame when rendering an animation.
* An animation is only rendered between its `minFrame` and `maxFrame` boundaries. This also affects the way an animation is repeated by also limiting its playback to the range given by the `minFrame` and `maxFrame`.
* The limiting boundaries can be used to control an animation that consists of different phases. E.g. a progress spinner which morphs into a checkmark after the work is done.

##### `maxFrame` : _number_, default: `0`

* The `maxFrame` specifies the end frame when rendering an animation. If not provided it is set to `composition.frames` after an animation is loaded, so that by default the entire animation is played.
* An animation is only rendered between its `minFrame` and `maxFrame` boundaries. This also affects the way an animation is repeated by also limiting its playback to the range given by the `minFrame` and `maxFrame`.
* The limiting boundaries can be used to control an animation that consists of different phases. E.g. a progress spinner which morphs into a checkmark after the work is done.

#### Events

##### `load`

* Fired when an `animation` is set and has finished loading. At this point the `composition` property is available.

###### Parameters

* `composition`: _object_
  * Contains static information about the properties of the loaded animation. See the `composition` property for details about the provided information.

##### `stateChanged`

* Fired when the animation is played, paused, resumed, canceled, repeated or finished. The event is fired either when the animation triggered it (by e.g. reaching the animation end) or when manually invoking `play()`/`pause()` etc.

###### Parameters

* `event`: _object_
  * The event objects `value` field contains the new playback state. See the `state` property for details.

##### `frameChanged`

* Fired when the `LottieView` is displaying a new frame.

###### Parameters

* `event`: _object_
  * The event objects `value` field contains the currently rendered frame index. See the `frame` property for details.

#### Methods

##### `play()`

* Starts playing a loaded animation from the first `frame` as given by `minFrame`. Can be invoked before the animation has finished loading, so that the playback will start as soon as possible if `autoPlay` is set to `false`.

##### `pause()`

* Pauses the a running animation and lets the `LottieView` show the current frame.

##### `resume()`

* Continues playback at the current location.

##### `cancel()`

* Stops the current playback and resets the current `frame` to the starting position given by `minFrame`.

## Compatibility

Compatible with [Tabris.js 3.0.0](https://github.com/eclipsesource/tabris-js/releases/tag/v3.0.0)

### Supported platforms

* Android

## Development of the widget

While not required by the consumer or the widget, this repository provides a `project` folder that contains platform specific development artifacts. These artifacts allow to more easily consume the native source code when developing the native parts of the widget.

### Android

The project provides a gradle based build configuration, which also allows to import the project into Android Studio.

In order to reference the Tabris.js specific APIs, the environment variable `TABRIS_ANDROID_PLATFORM` has to point to the Tabris.js Android Cordova platform root directory.

```bash
export TABRIS_ANDROID_PLATFORM=/home/user/tabris-android
```

The environment variable is consumed in the gradle projects [build.gradle](project/android/build.gradle) file.

## Copyright

 See [LICENSE](LICENSE) notice.
