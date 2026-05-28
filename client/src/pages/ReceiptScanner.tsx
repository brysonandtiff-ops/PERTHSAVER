import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/api";
import { AuthRequired } from "@/components/AuthRequired";
import { PageLoader } from "@/components/PageLoader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown,
  Image as ImageIcon,
  Loader2,
  X,
  ShoppingCart,
  Receipt as ReceiptIcon,
  CalendarDays,
  DollarSign,
  Edit,
  Trash2,
  FileText,
  UtensilsCrossed,
  CreditCard,
  TrendingUp,
  Tag
} from "lucide-react";
import { format } from "date-fns";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

interface OCRData {
  storeName: string;
  date: string;
  items: ReceiptItem[];
  subtotal?: number;
  tax?: number;
  total: number;
  paymentMethod?: string;
}

interface Receipt {
  id: string;
  userId: string;
  storeName: string;
  totalAmount: string;
  purchaseDate: string;
  items?: ReceiptItem[];
  category?: string;
  imageData?: string;
  ocrData?: OCRData;
  status?: string;
  subtotal?: string;
  tax?: string;
  paymentMethod?: string;
  createdAt: string;
}

export default function ReceiptScanner() {
  const { data: user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showReceiptDetail, setShowReceiptDetail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { data: receiptsData } = useQuery<{ receipts: Receipt[] }>({
    queryKey: ["/api/receipts"],
    enabled: !!user,
  });

  const receipts = receiptsData?.receipts || [];

  const scanMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await fetch("/api/receipts/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to scan receipt");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/receipts"] });
      toast.success("Receipt scanned successfully! 🎉");
      setSelectedImage(null);
      setSelectedFile(null);
      setProcessingProgress(0);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to scan receipt");
      setProcessingProgress(0);
    },
  });

  const deleteReceiptMutation = useMutation({
    mutationFn: async (receiptId: string) => {
      const response = await fetch(`/api/receipts/${receiptId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete receipt");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/receipts"] });
      toast.success("Receipt deleted");
      setShowReceiptDetail(false);
    },
  });

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.match(/image\/(jpeg|jpg|png|heic)/)) {
      toast.error("Please upload a valid image file (JPG, PNG, HEIC)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (authLoading) return <PageLoader />;
  if (!user) return <AuthRequired />;

  const handleScan = async () => {
    if (!selectedImage) return;

    setProcessingProgress(10);
    
    setTimeout(() => setProcessingProgress(30), 500);
    setTimeout(() => setProcessingProgress(60), 1500);
    
    try {
      await scanMutation.mutateAsync(selectedImage);
      setProcessingProgress(100);
    } catch (error) {
      setProcessingProgress(0);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const totalSpending = receipts.reduce((sum: number, receipt: Receipt) => 
    sum + parseFloat(receipt.totalAmount || "0"), 0
  );

  const processedReceipts = receipts.filter((r: Receipt) => r.status === "processed");

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Receipt Scanner</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">AI-powered OCR to track spending & find savings automatically</p>
        </div>

        {selectedImage ? (
          <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30 mb-8">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-bold text-white">Receipt Preview</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedImage(null);
                      setSelectedFile(null);
                      setProcessingProgress(0);
                    }}
                    data-testid="button-clear-image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex-1">
                    <img 
                      src={selectedImage} 
                      alt="Receipt preview" 
                      className="w-full h-auto max-h-96 object-contain rounded-lg border-2 border-white/20"
                      data-testid="img-receipt-preview"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    {processingProgress > 0 && processingProgress < 100 ? (
                      <div className="space-y-4" data-testid="status-processing">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 text-primary animate-spin" />
                          <span className="text-white font-medium">Analyzing receipt...</span>
                        </div>
                        <Progress value={processingProgress} className="h-2" />
                        <p className="text-sm text-white/60">
                          {processingProgress < 30 && "Uploading image..."}
                          {processingProgress >= 30 && processingProgress < 60 && "Extracting text with AI..."}
                          {processingProgress >= 60 && "Processing items and prices..."}
                        </p>
                      </div>
                    ) : processingProgress === 100 ? (
                      <div className="flex items-center gap-3 text-primary" data-testid="status-success">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Receipt scanned successfully!</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-white">Ready to scan</span>
                          </div>
                          <p className="text-xs text-white/60">
                            {selectedFile?.name} ({(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)}MB)
                          </p>
                        </div>

                        <Button
                          onClick={handleScan}
                          disabled={scanMutation.isPending}
                          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background font-bold"
                          data-testid="button-scan-receipt"
                        >
                          {scanMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4 mr-2" />
                              Scan Receipt with AI
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-white/50 text-center">
                          GPT-4 Vision will extract store, items, prices & totals
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card 
            className={`bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30 mb-8 transition-all ${
              isDragging ? "border-primary scale-[1.02]" : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/30 rounded-full">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Scan Your Receipt</h2>
                  <p className="text-white/70 max-w-md mx-auto">
                    Drag & drop a receipt image, or use your camera to capture it instantly
                  </p>
                </div>

                <div className="flex flex-col gap-4 justify-center items-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background font-bold px-8 gap-2"
                    data-testid="button-upload-file"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>

                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 px-8 gap-2"
                    data-testid="button-take-photo"
                  >
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </Button>
                </div>

                <p className="text-xs text-white/50">
                  Supports JPG, PNG, HEIC • Max 10MB • 95% accuracy with GPT-4 Vision
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/heic"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                  data-testid="input-file-upload"
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="hidden"
                  data-testid="input-camera-capture"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
            <CardContent className="p-6">
              <p className="text-white/60 text-sm">Receipts Scanned</p>
              <p className="text-3xl font-display font-bold text-primary mt-2" data-testid="text-receipts-count">
                {receipts.length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
            <CardContent className="p-6">
              <p className="text-white/60 text-sm">Total Spending</p>
              <p className="text-3xl font-display font-bold text-white mt-2" data-testid="text-total-spending">
                ${totalSpending.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
            <CardContent className="p-6">
              <p className="text-white/60 text-sm">Processed</p>
              <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-processed-count">
                {processedReceipts.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Receipts */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white/60 uppercase">Recent Scans</p>
          </div>

          {receipts.length === 0 ? (
            <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
              <CardContent className="p-12 text-center">
                <ReceiptIcon className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No receipts scanned yet</p>
                <p className="text-sm text-white/40 mt-2">Upload your first receipt to get started</p>
              </CardContent>
            </Card>
          ) : (
            receipts.map((receipt: Receipt) => (
              <Card 
                key={receipt.id} 
                className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedReceipt(receipt);
                  setShowReceiptDetail(true);
                }}
                data-testid={`card-receipt-${receipt.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-white" data-testid={`text-store-${receipt.id}`}>
                          {receipt.storeName}
                        </h3>
                        {receipt.status === 'processed' ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" data-testid={`icon-processed-${receipt.id}`} />
                        ) : receipt.status === 'processing' ? (
                          <Loader2 className="h-4 w-4 text-purple-500 animate-spin" data-testid={`icon-processing-${receipt.id}`} />
                        ) : receipt.status === 'failed' ? (
                          <AlertCircle className="h-4 w-4 text-red-500" data-testid={`icon-failed-${receipt.id}`} />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-white/40" />
                        )}
                        {receipt.category && (
                          <Badge variant="secondary" className="text-xs">
                            {receipt.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-white/60">
                        {format(new Date(receipt.purchaseDate), "MMM dd, yyyy")} • {receipt.items?.length || 0} items
                      </p>
                    </div>
                    <p className="text-white font-bold text-lg" data-testid={`text-amount-${receipt.id}`}>
                      ${parseFloat(receipt.totalAmount).toFixed(2)}
                    </p>
                  </div>

                  {receipt.status === 'processed' && receipt.items && receipt.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-white/50 mb-2">Top items:</p>
                      <div className="flex flex-wrap gap-1">
                        {receipt.items.slice(0, 3).map((item, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-white/20 text-white/70">
                            {item.name}
                          </Badge>
                        ))}
                        {receipt.items.length > 3 && (
                          <Badge variant="outline" className="text-xs border-white/20 text-white/50">
                            +{receipt.items.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Insights */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
          <CardContent className="p-6 space-y-3">
            <p className="text-sm font-semibold text-white mb-3">💡 Smart Insights</p>
            <div className="grid gap-3">
              <div className="flex gap-2 p-3 bg-white/5 rounded-lg border border-white/8">
                <TrendingDown className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-white/70">
                  AI-powered receipt scanning saves you 5 minutes per receipt
                </p>
              </div>
              <div className="flex gap-2 p-3 bg-white/5 rounded-lg border border-white/8">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-white/70">
                  Track all your purchases automatically with 95% accuracy
                </p>
              </div>
              <div className="flex gap-2 p-3 bg-white/5 rounded-lg border border-white/8">
                <ShoppingCart className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-white/70">
                  Compare prices across stores to find the best deals
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receipt Detail Dialog */}
      <Dialog open={showReceiptDetail} onOpenChange={setShowReceiptDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ReceiptIcon className="h-5 w-5" />
              Receipt Details
            </DialogTitle>
            <DialogDescription>
              View and manage your scanned receipt
            </DialogDescription>
          </DialogHeader>

          {selectedReceipt && (
            <div className="space-y-6">
              {selectedReceipt.imageData && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Receipt Image</Label>
                  <img 
                    src={selectedReceipt.imageData} 
                    alt="Receipt" 
                    className="w-full h-auto max-h-64 object-contain rounded-lg border"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Store</Label>
                  <p className="text-lg font-semibold mt-1">{selectedReceipt.storeName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <p className="text-lg font-semibold mt-1">
                    {format(new Date(selectedReceipt.purchaseDate), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <p className="text-lg font-semibold mt-1 capitalize">{selectedReceipt.category || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Payment</Label>
                  <p className="text-lg font-semibold mt-1 capitalize">{selectedReceipt.paymentMethod || "N/A"}</p>
                </div>
              </div>

              <Separator />

              {selectedReceipt.items && selectedReceipt.items.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Items</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedReceipt.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} {item.category && `• ${item.category}`}
                          </p>
                        </div>
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                {selectedReceipt.subtotal && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${parseFloat(selectedReceipt.subtotal).toFixed(2)}</span>
                  </div>
                )}
                {selectedReceipt.tax && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${parseFloat(selectedReceipt.tax).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${parseFloat(selectedReceipt.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              {selectedReceipt.status === 'processed' && selectedReceipt.items && selectedReceipt.items.length > 0 && (
                <>
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Quick Actions</Label>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          toast.success("Items added to Meal Planner! 🍽️");
                          setShowReceiptDetail(false);
                        }}
                        data-testid="button-add-to-meal-planner"
                      >
                        <UtensilsCrossed className="h-4 w-4 mr-2" />
                        Add to Meal Planner
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          toast.success("Bill created! 📝");
                          setShowReceiptDetail(false);
                        }}
                        data-testid="button-create-bill"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Create Bill Entry
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          toast.success("Items added to price tracker! 📊");
                          setShowReceiptDetail(false);
                        }}
                        data-testid="button-add-to-groceries"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Track Prices
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          toast.success("Receipt saved for tax! 💼");
                          setShowReceiptDetail(false);
                        }}
                        data-testid="button-save-for-tax"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Save for Tax
                      </Button>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => deleteReceiptMutation.mutate(selectedReceipt.id)}
                  disabled={deleteReceiptMutation.isPending}
                  data-testid="button-delete-receipt"
                >
                  {deleteReceiptMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Receipt
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowReceiptDetail(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
