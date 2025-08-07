import { useState } from "react";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import CardTypeSelector from "@/components/CardTypeSelector";
import OCRResults from "@/components/OCRResults";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Zap, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCardType, setSelectedCardType] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
    setOcrText(""); // Clear previous results
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setOcrText("");
    setSelectedCardType(null);
  };

  const handleCardTypeSelect = (type: string) => {
    setSelectedCardType(type);
  };

  const handleProcessOCR = async () => {
    if (!selectedFile || !selectedCardType) {
      toast({
        title: "Missing requirements",
        description: "Please select a file and card type before processing.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate OCR processing (replace with actual API call)
    setTimeout(() => {
      const mockText = `Sample OCR Results for ${selectedCardType}:

Name: JOHN SMITH
Date of Birth: 01/15/1990
ID Number: 123456789
Address: 123 Main Street, City, State 12345
Issue Date: 03/15/2020
Expiry Date: 03/15/2030

Note: This is a demo result. In production, this would be replaced with actual OCR processing using your Python backend.`;
      
      setOcrText(mockText);
      setIsProcessing(false);
      
      toast({
        title: "OCR Complete!",
        description: "Text has been successfully extracted from your image.",
      });
    }, 3000);
  };

  const features = [
    {
      icon: Zap,
      title: "Fast OCR Processing",
      description: "Extract text from authentication cards in seconds"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is processed securely and not stored"
    },
    {
      icon: CheckCircle,
      title: "High Accuracy",
      description: "Advanced OCR technology for reliable text extraction"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Authentication Card OCR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Extract text from ID cards, passports, and credit cards with our advanced OCR technology. 
            Fast, secure, and accurate text recognition.
          </p>
        </div>

        {/* Main Upload and Processing Area */}
        <div className="max-w-4xl mx-auto space-y-8">
          <UploadZone 
            onFileUpload={handleFileUpload}
            selectedFile={selectedFile}
            onClearFile={handleClearFile}
          />

          {selectedFile && (
            <CardTypeSelector
              selectedType={selectedCardType}
              onTypeSelect={handleCardTypeSelect}
            />
          )}

          {selectedFile && selectedCardType && (
            <div className="text-center">
              <Button
                onClick={handleProcessOCR}
                disabled={isProcessing}
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground px-8"
              >
                {isProcessing ? "Processing..." : "Start OCR Processing"}
              </Button>
            </div>
          )}

          <OCRResults text={ocrText} isLoading={isProcessing} />
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Our OCR Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
