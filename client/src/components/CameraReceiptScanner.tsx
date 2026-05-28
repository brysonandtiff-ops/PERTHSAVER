import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RotateCcw, Check, Loader2, Upload, Image as ImageIcon, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ScanResult {
  storeName: string;
  total: number;
  items: Array<{ name: string; price: number }>;
  date: string;
}

interface CameraReceiptScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete: (result: ScanResult) => void;
}

export function CameraReceiptScanner({ open, onOpenChange, onScanComplete }: CameraReceiptScannerProps) {
  const [mode, setMode] = useState<"camera" | "preview" | "processing">("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please use file upload instead.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageData);
    setMode("preview");
    stopCamera();
  }, [stopCamera]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target?.result as string);
      setMode("preview");
    };
    reader.readAsDataURL(file);
  };

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setMode("camera");
    startCamera();
  }, [startCamera]);

  const processReceipt = async () => {
    if (!capturedImage) return;
    
    setMode("processing");
    setIsProcessing(true);
    
    try {
      const response = await fetch("/api/receipts/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ imageData: capturedImage }),
      });
      
      if (!response.ok) throw new Error("Failed to process receipt");
      
      const result = await response.json();
      onScanComplete(result);
      onOpenChange(false);
      
      toast({
        title: "Receipt Scanned",
        description: `Found ${result.items?.length || 0} items totaling $${result.total?.toFixed(2) || "0.00"}`,
      });
    } catch (error) {
      console.error("Receipt processing error:", error);
      toast({
        title: "Processing Error",
        description: "Could not process receipt. Please try again or enter manually.",
        variant: "destructive",
      });
      setMode("preview");
    } finally {
      setIsProcessing(false);
    }
  };

  // Start camera when dialog opens
  useEffect(() => {
    if (open && mode === "camera") {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [open, mode, startCamera, stopCamera]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      stopCamera();
      setCapturedImage(null);
      setMode("camera");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-slate-900/95 to-slate-950/95 border-purple-500/20 backdrop-blur-xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-white/10">
          <DialogTitle className="text-white flex items-center gap-2">
            <Receipt className="h-5 w-5 text-purple-400" />
            Scan Receipt
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative aspect-[3/4] bg-black">
          <AnimatePresence mode="wait">
            {mode === "camera" && (
              <motion.div
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  data-testid="camera-video"
                />
                
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-8 border-2 border-white/30 rounded-lg" />
                  <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-purple-400 rounded-tl-lg" />
                  <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-purple-400 rounded-tr-lg" />
                  <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
                  <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
                </div>
                
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white/60 text-sm text-center mb-3">
                    Position receipt within frame
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-12 w-12 rounded-full border-white/20 text-white hover:bg-white/10"
                      data-testid="button-upload-receipt"
                    >
                      <Upload className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={captureImage}
                      className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg shadow-purple-500/30"
                      data-testid="button-capture"
                    >
                      <Camera className="h-7 w-7" />
                    </Button>
                    <div className="w-12" />
                  </div>
                </div>
              </motion.div>
            )}
            
            {mode === "preview" && capturedImage && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img
                  src={capturedImage}
                  alt="Captured receipt"
                  className="w-full h-full object-contain bg-black"
                  data-testid="preview-image"
                />
                
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white/60 text-sm text-center mb-3">
                    Is the receipt clear and readable?
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={retakePhoto}
                      className="border-white/20 text-white hover:bg-white/10"
                      data-testid="button-retake"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake
                    </Button>
                    <Button
                      onClick={processReceipt}
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                      data-testid="button-process"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Process
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {mode === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-4"
                >
                  <Loader2 className="h-12 w-12 text-purple-400" />
                </motion.div>
                <p className="text-white font-medium mb-2">Processing Receipt...</p>
                <p className="text-white/60 text-sm">AI is extracting items and prices</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
          data-testid="input-file-upload"
        />
      </DialogContent>
    </Dialog>
  );
}
