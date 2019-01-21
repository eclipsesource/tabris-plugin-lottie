package com.eclipsesource.lottie

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.util.JsonReader
import android.widget.ImageView.ScaleType.CENTER_CROP
import android.widget.ImageView.ScaleType.CENTER_INSIDE
import com.airbnb.lottie.LottieAnimationView
import com.airbnb.lottie.LottieDrawable.*
import com.eclipsesource.tabris.android.*
import com.eclipsesource.tabris.android.internal.nativeobject.view.ViewHandler
import com.eclipsesource.v8.V8Object

@Suppress("PARAMETER_NAME_CHANGED_ON_OVERRIDE")
class LottieViewHandler(private val scope: ActivityScope) : ViewHandler<LottieAnimationView>(scope) {

  override val type = "com.eclipsesource.lottie.LottieView"

  override val properties by lazy {
    super.properties + listOf<Property<LottieAnimationView, *>>(
        StringProperty("animation", {
          if (it != null) {
            if (it.startsWith("http", ignoreCase = true)) {
              setAnimationFromUrl(it)
            } else {
              val uri = scope.uriBuilder.build(it).toString()
              val assetStream = scope.context.assets.open(uri.removePrefix("file:///android_asset/"))
              setAnimation(JsonReader(assetStream.reader()), uri)
            }
          }
        }),
        StringProperty("animationJson", { setAnimationFromJson(it, null) }),
        FloatProperty("speed", { speed = it ?: 1f }),
        FloatProperty("playing") { isAnimating },
        StringProperty("repeatMode", { repeatMode = if (it == "reverse") REVERSE else RESTART }),
        IntProperty("repeatCount", { repeatCount = if (it == -1) INFINITE else it ?: 0 }),
        IntProperty("frame", { frame = it ?: 0 }, { frame }),
        IntProperty("minFrame", { setMinFrame(it ?: 0) }, { minFrame }),
        IntProperty("maxFrame", { setMaxFrame(it ?: Int.MAX_VALUE) }, { maxFrame }),
        FloatProperty("progress", { progress = it ?: 0f }, { progress }),
        FloatProperty("minProgress", { setMinProgress(it ?: 0f) }),
        FloatProperty("maxProgress", { setMaxProgress(it ?: Float.MAX_VALUE) }),
        StringProperty("scaleMode", { scaleType = if (it == "fill") CENTER_CROP else CENTER_INSIDE }),
        FloatProperty("scale", { scale = it ?: 1f })
    )
  }

  override fun create(id: String, properties: V8Object) = LottieAnimationView(scope.activity).apply {
    enableMergePathsForKitKatAndAbove(true)
  }

  override fun listen(id: String, lottieView: LottieAnimationView, event: String, listen: Boolean) {
    super.listen(id, lottieView, event, listen)
    when (event) {
      "animationLoaded" -> listenAnimationLoaded(lottieView, listen)
      "animationUpdated" -> listenAnimationUpdated(lottieView, listen)
      "animationStateChanged" -> listenAnimationStateChanged(lottieView, listen)
    }
  }

  private fun listenAnimationLoaded(lottieView: LottieAnimationView, listen: Boolean) {
    if (listen) {
      lottieView.addLottieOnCompositionLoadedListener { notifyEvent(lottieView, "animationLoaded") }
    } else {
      lottieView.removeAllLottieOnCompositionLoadedListener()
    }
  }

  private fun listenAnimationUpdated(lottieView: LottieAnimationView, listen: Boolean) {
    if (listen) {
      lottieView.addAnimatorUpdateListener { notifyEvent(lottieView, "animationUpdated", it.animatedFraction) }
    } else {
      lottieView.removeAllUpdateListeners()
    }
  }

  private fun listenAnimationStateChanged(lottieView: LottieAnimationView, listen: Boolean) {
    if (listen) {
      lottieView.addAnimatorListener(object : AnimatorListenerAdapter() {
        override fun onAnimationStart(animation: Animator?) = notifyStateChanged("start")
        override fun onAnimationEnd(animation: Animator?) = notifyStateChanged("end")
        override fun onAnimationPause(animation: Animator?) = notifyStateChanged("pause")
        override fun onAnimationResume(animation: Animator?) = notifyStateChanged("resume")
        override fun onAnimationCancel(animation: Animator?) = notifyStateChanged("cancel")
        override fun onAnimationRepeat(animation: Animator?) = notifyStateChanged("repeat")
        private fun notifyStateChanged(value: String) = notifyEvent(lottieView, "animationStateChanged", value)
      })
    } else {
      lottieView.removeAllAnimatorListeners()
    }
  }

  private fun notifyEvent(lottieView: LottieAnimationView, event: String, value: Any? = null) {
    scope.remoteObject(lottieView)?.notify(event, "value", value)
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