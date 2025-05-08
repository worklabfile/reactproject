package com.example.app;

import android.content.Intent;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "StatusNotification")
public class StatusNotificationPlugin extends Plugin {
    private StatusNotificationService service;

    @PluginMethod
    public void startService(PluginCall call) {
        Intent serviceIntent = new Intent(getContext(), StatusNotificationService.class);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            getContext().startForegroundService(serviceIntent);
        } else {
            getContext().startService(serviceIntent);
        }
        service = new StatusNotificationService();
        call.resolve();
    }

    @PluginMethod
    public void updateStatus(PluginCall call) {
        String doorStatus = call.getString("doorStatus");
        String lightStatus = call.getString("lightStatus");
        String temperature = call.getString("temperature");

        if (service != null) {
            service.updateStatus(doorStatus, lightStatus, temperature);
            call.resolve();
        } else {
            call.reject("Service not started");
        }
    }

    @PluginMethod
    public void stopService(PluginCall call) {
        Intent serviceIntent = new Intent(getContext(), StatusNotificationService.class);
        getContext().stopService(serviceIntent);
        service = null;
        call.resolve();
    }
} 