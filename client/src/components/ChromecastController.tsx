import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAppPreferences } from "@/context/AppPreferencesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, WifiOff, Tv, Plus, Trash2, Radio } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function ChromecastController() {
  const { preferences, addCastDevice, removeCastDevice, connectCastDevice, disconnectCastDevice } = useAppPreferences();
  const [isScanning, setIsScanning] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<any[]>([]);

  const startCastDiscovery = async () => {
    setIsScanning(true);
    try {
      // Check if Cast API is available
      if ("chrome" in window && "cast" in (window as any).chrome) {
        // Native Chromecast discovery would happen here
        // For now, we'll simulate device discovery
        const simulatedDevices = [
          { id: "cast-device-1", name: "Living Room TV", isConnected: false },
          { id: "cast-device-2", name: "Bedroom TV", isConnected: false },
          { id: "cast-device-3", name: "Kitchen Speaker", isConnected: false },
        ];
        setAvailableDevices(simulatedDevices);
        toast({
          title: "Devices Found",
          description: `Found ${simulatedDevices.length} Chromecast devices`,
        });
      } else {
        toast({
          title: "Chromecast Not Available",
          description: "Please use a Chromium-based browser to discover Cast devices",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Discovery Failed",
        description: "Could not scan for Chromecast devices",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddDevice = (device: any) => {
    addCastDevice(device);
    setAvailableDevices(availableDevices.filter((d) => d.id !== device.id));
    toast({
      title: "Device Added",
      description: `${device.name} added to your devices`,
    });
  };

  const handleConnect = (deviceId: string) => {
    connectCastDevice(deviceId);
    toast({
      title: "Connected",
      description: "Casting device connected successfully",
    });
  };

  const handleDisconnect = () => {
    disconnectCastDevice();
    toast({
      title: "Disconnected",
      description: "Casting device disconnected",
    });
  };

  return (
    <div className="space-y-6">
      {/* Scan for devices */}
      <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-purple-400" />
            Discover Devices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-white/60">
            Scan your network for available Chromecast and Cast-enabled devices
          </p>
          <motion.button
            onClick={startCastDiscovery}
            disabled={isScanning}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-teal-500 text-background font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isScanning ? "Scanning..." : "Scan for Devices"}
          </motion.button>

          {/* Available devices */}
          {availableDevices.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-semibold text-white">Available Devices:</h4>
              {availableDevices.map((device) => (
                <motion.div
                  key={device.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <Tv className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-white">{device.name}</span>
                  </div>
                  <motion.button
                    onClick={() => handleAddDevice(device)}
                    className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connected devices */}
      <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-400" />
            My Devices ({preferences.chromecastDevices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {preferences.chromecastDevices.length === 0 ? (
            <p className="text-sm text-white/60">No devices added yet. Scan to discover devices.</p>
          ) : (
            <div className="space-y-3">
              {preferences.chromecastDevices.map((device) => {
                const isSelected = preferences.selectedCastDevice?.id === device.id;
                return (
                  <motion.div
                    key={device.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      isSelected
                        ? "bg-purple-500/15 border-purple-500/50"
                        : "bg-white/5 border-white/10"
                    } hover:border-purple-500/70`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Tv className={`h-5 w-5 ${isSelected ? "text-purple-400" : "text-white/40"}`} />
                        <div>
                          <p className="text-sm font-semibold text-white">{device.name}</p>
                          <p className="text-xs text-white/50">
                            {isSelected ? "Connected" : "Ready to connect"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!isSelected ? (
                          <motion.button
                            onClick={() => handleConnect(device.id)}
                            className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-xs font-semibold transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Connect
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={handleDisconnect}
                            className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-semibold transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Disconnect
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => removeCastDevice(device.id)}
                          className="p-1.5 rounded-lg bg-white/10 text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
