package com.example.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class AppWidget extends AppWidgetProvider {
    public static final String ACTION_UPDATE_WIDGET = "com.example.app.ACTION_UPDATE_WIDGET";
    public static final String EXTRA_DOOR_STATUS = "door_status";
    public static final String EXTRA_LIGHT_STATUS = "light_status";
    public static final String EXTRA_AC_STATUS = "ac_status";
    public static final String EXTRA_TEMPERATURE = "temperature";
    public static final String EXTRA_HUMIDITY = "humidity";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_layout);
        
        // Получаем сохраненные данные
        SharedPreferences prefs = context.getSharedPreferences("SmartHomePrefs", Context.MODE_PRIVATE);
        
        // Обновляем статусы
        String doorStatus = prefs.getString(EXTRA_DOOR_STATUS, "Checking...");
        String lightStatus = prefs.getString(EXTRA_LIGHT_STATUS, "Checking...");
        String acStatus = prefs.getString(EXTRA_AC_STATUS, "Checking...");
        String temperature = prefs.getString(EXTRA_TEMPERATURE, "--");
        String humidity = prefs.getString(EXTRA_HUMIDITY, "--");

        // Устанавливаем значения в виджет
        views.setTextViewText(R.id.status_door, "Door: " + doorStatus);
        views.setTextViewText(R.id.status_light, "Light: " + lightStatus);
        views.setTextViewText(R.id.status_ac, "AC: " + acStatus);
        views.setTextViewText(R.id.status_temperature, "Temperature: " + temperature + "°C");
        views.setTextViewText(R.id.status_humidity, "Humidity: " + humidity + "%");
        
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        
        if (intent.getAction() != null) {
            if (intent.getAction().equals(ACTION_UPDATE_WIDGET)) {
                // Сохраняем новые данные
                SharedPreferences.Editor editor = context.getSharedPreferences("SmartHomePrefs", Context.MODE_PRIVATE).edit();
                
                if (intent.hasExtra(EXTRA_DOOR_STATUS)) {
                    editor.putString(EXTRA_DOOR_STATUS, intent.getStringExtra(EXTRA_DOOR_STATUS));
                }
                if (intent.hasExtra(EXTRA_LIGHT_STATUS)) {
                    editor.putString(EXTRA_LIGHT_STATUS, intent.getStringExtra(EXTRA_LIGHT_STATUS));
                }
                if (intent.hasExtra(EXTRA_AC_STATUS)) {
                    editor.putString(EXTRA_AC_STATUS, intent.getStringExtra(EXTRA_AC_STATUS));
                }
                if (intent.hasExtra(EXTRA_TEMPERATURE)) {
                    editor.putString(EXTRA_TEMPERATURE, intent.getStringExtra(EXTRA_TEMPERATURE));
                }
                if (intent.hasExtra(EXTRA_HUMIDITY)) {
                    editor.putString(EXTRA_HUMIDITY, intent.getStringExtra(EXTRA_HUMIDITY));
                }
                
                editor.apply();

                // Обновляем виджет
                AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
                int[] appWidgetIds = intent.getIntArrayExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS);
                if (appWidgetIds != null) {
                    onUpdate(context, appWidgetManager, appWidgetIds);
                }
            }
        }
    }
} 