package com.example.app;

import android.content.Intent;
import android.net.Uri;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }

    @Override
    protected void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIntent(getIntent());
    }

    private void handleIntent(Intent intent) {
        if (intent != null && intent.getData() != null) {
            Uri uri = intent.getData();
            if ("com.example.app".equals(uri.getScheme())) {
                String host = uri.getHost();
                if ("widget".equals(host)) {
                    String doorStatus = uri.getQueryParameter("door");
                    String lightStatus = uri.getQueryParameter("light");
                    String acStatus = uri.getQueryParameter("ac");
                    String temperature = uri.getQueryParameter("temperature");
                    String humidity = uri.getQueryParameter("humidity");

                    Intent updateIntent = new Intent(this, WidgetUpdateService.class);
                    if (doorStatus != null) updateIntent.putExtra(AppWidget.EXTRA_DOOR_STATUS, doorStatus);
                    if (lightStatus != null) updateIntent.putExtra(AppWidget.EXTRA_LIGHT_STATUS, lightStatus);
                    if (acStatus != null) updateIntent.putExtra(AppWidget.EXTRA_AC_STATUS, acStatus);
                    if (temperature != null) updateIntent.putExtra(AppWidget.EXTRA_TEMPERATURE, temperature);
                    if (humidity != null) updateIntent.putExtra(AppWidget.EXTRA_HUMIDITY, humidity);

                    startService(updateIntent);
                }
            }
        }
    }
}
