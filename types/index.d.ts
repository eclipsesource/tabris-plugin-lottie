import {Listeners, Widget} from 'tabris';

declare global {

  namespace eslottie {

    export class LottieView extends Widget {

      public readonly onLoad: Listeners<{target: LottieView, composition: Composition}>;
      public readonly onAnimationChanged: Listeners<{target: LottieView, value: any}>;
      public readonly onAutoPlay: Listeners<{target: LottieView, value: boolean}>;
      public readonly onSpeedChanged: Listeners<{target: LottieView, value: number}>;
      public readonly onStateChanged: Listeners<{target: LottieView, value: 'play' | 'finish' | 'pause' | 'resume' | 'cancel' | 'repeat'}>;
      public readonly onPlayingChanged: Listeners<{target: LottieView, value: boolean}>;
      public readonly onRepeatCountChanged: Listeners<{target: LottieView, value: number}>;
      public readonly onRepeatModeChanged: Listeners<{target: LottieView, value: 'restart' | 'reverse'}>;
      public readonly onScaleModeChanged: Listeners<{target: LottieView, value: 'auto' | 'fill'}>;
      public readonly onScaleChanged: Listeners<{target: LottieView, value: number}>;
      public readonly onFrameChanged: Listeners<{target: LottieView, value: number}>;
      public readonly onMinFrameChanged: Listeners<{target: LottieView, value: number}>;
      public readonly onMaxFrameChanged: Listeners<{target: LottieView, value: number}>;
      public readonly onCompositionChanged: Listeners<{target: LottieView, value: Composition}>;

      public animation: any;
      public autoPlay: boolean;
      public speed: number;
      public readonly state: 'play' | 'finish' | 'pause' | 'resume' | 'cancel' | 'repeat';
      public readonly playing: boolean;
      public repeatCount: number;
      public repeatMode: 'restart' | 'reverse';
      public scaleMode: 'auto' | 'fill';
      public scale: number;
      public frame: number;
      public minFrame: number;
      public maxFrame: number;
      public readonly composition: Composition;

      constructor(properties: Partial<LottieView>);

      public play(): void;

      public pause(): void;

      public cancel(): void;

      public resume(): void;

    }

    export type Composition = {
      width: number,
      height: number,
      frames: number,
      frameRate: number,
      duration: number
    };
  }

}

export {};
