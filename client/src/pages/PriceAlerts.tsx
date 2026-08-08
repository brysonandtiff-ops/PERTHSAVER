import { useState } from "react";
import { useAuth } from "@/lib/api";
import { AuthRequired } from "@/components/AuthRequired";
import { PageLoader } from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { usePriceAlerts, useCreatePriceAlert, useUpdatePriceAlert, useDeletePriceAlert } from "@/lib/api";
import { Bell, Plus, Trash2, TrendingDown, AlertCircle, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function PriceAlerts() {
  const { data: user, isLoading: authLoading } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  if (authLoading) return <PageLoader />;
  if (!user) return <AuthRequired />;

  const { data, isLoading } = usePriceAlerts();
  const createAlert = useCreatePriceAlert();
  const updateAlert = useUpdatePriceAlert();
  const deleteAlert = useDeletePriceAlert();

  const alerts = data?.alerts || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !targetPrice) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAlert.mutateAsync({
        productName,
        storeName: storeName || null,
        targetPrice,
        currentPrice: currentPrice || null,
      });

      toast({
        title: "Alert Created",
        description: `We'll notify you when ${productName} drops to $${targetPrice}`,
      });

      setProductName("");
      setStoreName("");
      setTargetPrice("");
      setCurrentPrice("");
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
    }
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    try {
      await updateAlert.mutateAsync({
        id,
        data: { isActive: !isActive },
      });
      toast({
        title: isActive ? "Alert Disabled" : "Alert Enabled",
        description: isActive ? "You won't receive notifications for this product" : "You'll receive notifications when the price drops",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAlert.mutateAsync(id);
      toast({
        title: "Alert Deleted",
        description: "Price alert has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert",
        variant: "destructive",
      });
    }
  };

  const activeAlerts = alerts.filter((alert: any) => alert.isActive).length;
  const triggeredAlerts = alerts.filter((alert: any) => {
    const current = parseFloat(alert.currentPrice || "999999");
    const target = parseFloat(alert.targetPrice || "0");
    return current <= target;
  }).length;

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="flex flex-col sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white" data-testid="text-page-title">
              Price Alerts
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/60 mt-1 sm:mt-2" data-testid="text-page-subtitle">
              Get notified when products drop to your target price
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto h-10 sm:h-12 text-xs sm:text-sm touch-target" 
                data-testid="button-add-alert"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Price Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-white/10 text-white" data-testid="dialog-alert-form">
              <DialogHeader>
                <DialogTitle className="text-white">Create Price Alert</DialogTitle>
                <DialogDescription className="text-white/60">
                  We'll notify you when your product reaches your target price
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName" className="text-white">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Avocados, Milk, Bread"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    data-testid="input-product-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-white">Store (Optional)</Label>
                  <Input
                    id="storeName"
                    placeholder="e.g., Woolworths, Coles, ALDI"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    data-testid="input-store-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetPrice" className="text-white">Target Price (AUD) *</Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    step="0.01"
                    placeholder="5.99"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    data-testid="input-target-price"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPrice" className="text-white">Current Price (Optional)</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    step="0.01"
                    placeholder="7.99"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    data-testid="input-current-price"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-white/10 text-white hover:bg-white/5"
                    onClick={() => setIsAddDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    disabled={createAlert.isPending}
                    data-testid="button-save-alert"
                  >
                    {createAlert.isPending ? "Creating..." : "Create Alert"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card className="glass border-white/8" data-testid="card-total-alerts">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">Total Alerts</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-white mt-1" data-testid="text-total-alerts">
                    {alerts.length}
                  </p>
                </div>
                <Bell className="h-10 w-10 text-primary opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-active-alerts">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">Active Alerts</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-primary mt-1" data-testid="text-active-alerts">
                    {activeAlerts}
                  </p>
                </div>
                <AlertCircle className="h-10 w-10 text-primary opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-triggered-alerts">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">Price Met</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-accent mt-1" data-testid="text-triggered-alerts">
                    {triggeredAlerts}
                  </p>
                </div>
                <TrendingDown className="h-10 w-10 text-accent opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Grid */}
        {isLoading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={`skeleton-${i}`} className="glass border-white/8">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-white/10" />
                  <Skeleton className="h-4 w-1/2 bg-white/10 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-white/10" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <Card className="glass border-white/8" data-testid="card-empty-state">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-white mb-2">No Price Alerts Yet</h3>
              <p className="text-white/60 mb-6">
                Start saving by setting up alerts for your favorite products
              </p>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => setIsAddDialogOpen(true)}
                data-testid="button-create-first-alert"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {alerts.map((alert: any) => {
              const current = parseFloat(alert.currentPrice || "0");
              const target = parseFloat(alert.targetPrice || "0");
              const isPriceMet = current > 0 && current <= target;

              return (
                <Card 
                  key={alert.id} 
                  className={`glass border ${isPriceMet ? 'border-green-500/40 bg-green-500/5' : 'border-white/8'} transition-all hover:border-primary/30`}
                  data-testid={`card-alert-${alert.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg flex items-center gap-2" data-testid={`text-alert-product-${alert.id}`}>
                          {alert.productName}
                          {isPriceMet && <TrendingDown className="h-4 w-4 text-green-400" />}
                        </CardTitle>
                        {alert.storeName && (
                          <p className="text-white/50 text-sm mt-1" data-testid={`text-alert-store-${alert.id}`}>
                            {alert.storeName}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDelete(alert.id)}
                        data-testid={`button-delete-${alert.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <p className="text-white/60 text-xs">Target Price</p>
                        <p className="text-xl font-bold text-primary" data-testid={`text-target-price-${alert.id}`}>
                          ${parseFloat(alert.targetPrice).toFixed(2)}
                        </p>
                      </div>
                      {alert.currentPrice && (
                        <div>
                          <p className="text-white/60 text-xs">Current Price</p>
                          <p className="text-xl font-bold text-white" data-testid={`text-current-price-${alert.id}`}>
                            ${parseFloat(alert.currentPrice).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>

                    {isPriceMet && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2" data-testid={`badge-price-met-${alert.id}`}>
                        <TrendingDown className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Price Target Met! 🎯</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-white/60 text-sm">Alert Notifications</span>
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => toggleAlert(alert.id, alert.isActive)}
                        data-testid={`switch-alert-${alert.id}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Alert Preview Banner */}
        {triggeredAlerts > 0 && (
          <Card className="glass border-primary/30 bg-primary/5 mt-8" data-testid="banner-triggered-alerts">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-bold text-white">
                    {triggeredAlerts} {triggeredAlerts === 1 ? 'Alert' : 'Alerts'} Triggered!
                  </h3>
                  <p className="text-white/60 text-sm">
                    Great news! Some products have reached your target price
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
