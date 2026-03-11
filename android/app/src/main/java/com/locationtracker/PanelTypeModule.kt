package com.locationtracker

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class PanelTypeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "PanelType"

  override fun getConstants(): MutableMap<String, Any> {
    return mutableMapOf(
        "panel" to BuildConfig.APP_PANEL,
        "apiBaseUrl" to BuildConfig.API_BASE_URL
    )
  }
}
