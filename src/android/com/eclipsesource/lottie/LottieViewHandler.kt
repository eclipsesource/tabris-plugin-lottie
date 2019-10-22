package com.eclipsesource.lottie

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.widget.ImageView.ScaleType.CENTER_CROP
import android.widget.ImageView.ScaleType.CENTER_INSIDE
import com.airbnb.lottie.LottieAnimationView
import com.airbnb.lottie.LottieDrawable.*
import com.eclipsesource.tabris.android.*
import com.eclipsesource.tabris.android.internal.ktx.toByteArray
import com.eclipsesource.tabris.android.internal.ktx.toDip
import com.eclipsesource.tabris.android.internal.nativeobject.view.ViewHandler
import com.eclipsesource.v8.V8ArrayBuffer
import com.eclipsesource.v8.V8Object

@Suppress("PARAMETER_NAME_CHANGED_ON_OVERRIDE")
class LottieViewHandler(private val scope: ActivityScope) : ViewHandler<LottieAnimationView>(scope) {

  override val type = "com.eclipsesource.lottie.LottieView"

  override val properties by lazy {
    super.properties + listOf<Property<LottieAnimationView, *>>(
        AnyProperty("animation", { setAnimationFromAny(it) }),
        FloatProperty("speed", { speed = it ?: 1f }),
        FloatProperty("playing") { isAnimating },
        StringProperty("repeatMode", { repeatMode = if (it == "reverse") REVERSE else RESTART }),
        IntProperty("repeatCount", { repeatCount = if (it == -1) INFINITE else it ?: 0 }),
        StringProperty("scaleMode", { scaleType = if (it == "fill") CENTER_CROP else CENTER_INSIDE }),
        FloatProperty("scale", { scale = it ?: 1f }),
        IntProperty("frame", { frame = it ?: 0 }, { frame }),
        IntProperty("minFrame", { setMinFrame(it ?: 0) }, { minFrame }),
        IntProperty("maxFrame", { setMaxFrame(it ?: Int.MAX_VALUE) }, { maxFrame }),
        AnyProperty("composition") {
          composition?.run {
            mapOf(
                "width" to bounds.width().toDip(scope),
                "height" to bounds.height().toDip(scope),
                "frames" to durationFrames,
                "duration" to duration,
                "frameRate" to frameRate
            )
          }
        })
  }

  private fun LottieAnimationView.setAnimationFromAny(animation: Any?) {
    when (animation) {
      is V8ArrayBuffer -> setAnimationFromJson(String(animation.toByteArray()), null)
      is String -> {
        if (animation.startsWith("http", ignoreCase = true)) {
          setAnimationFromUrl(animation)
        } else {
          val uri = scope.uriBuilder.build(animation).toString()
          if (uri.startsWith("file:///android_asset/")) {
            val assetStream = scope.context.assets.open(uri.removePrefix("file:///android_asset/"))
            setAnimation(assetStream, uri)
          } else {
            setAnimationFromUrl(uri)
          }
        }
      }
    }
  }

  override fun create(id: String, properties: V8Object) = LottieAnimationView(scope.activity).apply {
    enableMergePathsForKitKatAndAbove(true)
  }

  override fun listen(id: String, lottieView: LottieAnimationView, event: String, listen: Boolean) {
    super.listen(id, lottieView, event, listen)
    when (event) {
      "load" -> listenLoad(lottieView, listen)
      "frameChanged" -> listenFrameChanged(lottieView, listen)
      "stateChanged" -> listenStateChanged(lottieView, listen)
    }
  }

  private fun listenLoad(lottieView: LottieAnimationView, listen: Boolean) {
    if (listen) {
      lottieView.addLottieOnCompositionLoadedListener {
        scope.remoteObject(lottieView)?.notify("load")
      }
    } else {
      lottieView.removeAllLottieOnCompositionLoadedListener()
    }
  }

  private fun listenFrameChanged(lottieView: LottieAnimationView, listen: Boolean) {
    if (listen) {
      lottieView.addAnimatorUpdateListener {
        scope.remoteObject(lottieView)?.notify("frameChanged", "frame", lottieView.frame)
      }
    } else {
      lottieView.removeAllUpdateListeners()
    }
  }

  private fun listenStateChanged(lottieView: LottieAnimationView, listen: Boolean) {
    if (listen) {
      lottieView.addAnimatorListener(object : AnimatorListenerAdapter() {
        override fun onAnimationStart(animation: Animator?) = notifyStateChanged("play")
        override fun onAnimationEnd(animation: Animator?) = notifyStateChanged("finish")
        override fun onAnimationPause(animation: Animator?) = notifyStateChanged("pause")
        override fun onAnimationResume(animation: Animator?) = notifyStateChanged("resume")
        override fun onAnimationCancel(animation: Animator?) = notifyStateChanged("cancel")
        override fun onAnimationRepeat(animation: Animator?) = notifyStateChanged("repeat")
        private fun notifyStateChanged(value: String) {
          scope.remoteObject(lottieView)?.notify("stateChanged", "state", value)
        }
      })
    } else {
      lottieView.removeAllAnimatorListeners()
    }
  }

  override fun call(lottieView: LottieAnimationView, method: String, properties: V8Object): Any? {
    return when (method) {
      "play" -> lottieView.playAnimation()
      "cancel" -> lottieView.cancelAnimation()
      "pause" -> lottieView.pauseAnimation()
      "resume" -> lottieView.resumeAnimation()
      else -> super.call(lottieView, method, properties)
    }
  }

}