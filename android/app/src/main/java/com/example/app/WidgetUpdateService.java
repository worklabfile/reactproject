package com.example.app;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;

public class WidgetUpdateService extends Service {
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String doorStatus = intent.getStringExtra(AppWidget.EXTRA_DOOR_STATUS);
            String lightStatus = intent.getStringExtra(AppWidget.EXTRA_LIGHT_STATUS);
            String acStatus = intent.getStringExtra(AppWidget.EXTRA_AC_STATUS);
            String temperature = intent.getStringExtra(AppWidget.EXTRA_TEMPERATURE);
            String humidity = intent.getStringExtra(AppWidget.EXTRA_HUMIDITY);

            Intent updateIntent = new Intent(this, AppWidget.class);
            updateIntent.setAction(AppWidget.ACTION_UPDATE_WIDGET);
            
            if (doorStatus != null) updateIntent.putExtra(AppWidget.EXTRA_DOOR_STATUS, doorStatus);
            if (lightStatus != null) updateIntent.putExtra(AppWidget.EXTRA_LIGHT_STATUS, lightStatus);
            if (acStatus != null) updateIntent.putExtra(AppWidget.EXTRA_AC_STATUS, acStatus);
            if (temperature != null) updateIntent.putExtra(AppWidget.EXTRA_TEMPERATURE, temperature);
            if (humidity != null) updateIntent.putExtra(AppWidget.EXTRA_HUMIDITY, humidity);

            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(this);
            ComponentName componentName = new ComponentName(this, AppWidget.class);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(componentName);
            updateIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, appWidgetIds);

            sendBroadcast(updateIntent);
        }
        return START_NOT_STICKY;
    }
} 