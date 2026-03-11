package com.locationtracker

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript.
   */
  override fun getMainComponentName(): String = "LocationTracker"

  /**
   * Returns the instance of the [ReactActivityDelegate].
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      object : ReactActivityDelegate(this, mainComponentName) {
        override fun getLaunchOptions(): Bundle? = Bundle()
      }
}
