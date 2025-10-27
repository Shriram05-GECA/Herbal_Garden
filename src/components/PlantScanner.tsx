import { useState, useRef } from "react";
import { Camera, Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface PlantIdentification {
  common_names?: string[];
  scientific_name?: string;
  probability?: number;
  wiki_description?: { value?: string };
  taxonomy?: {
    family?: string;
    genus?: string;
  };
}

export const PlantScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<PlantIdentification | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsScanning(true);
    setResult(null);

    try {
      const base64Image = await convertImageToBase64(file);

      const { data, error } = await supabase.functions.invoke('identify-plant', {
        body: { images: [base64Image] }
      });

      if (error) throw error;

      if (data?.suggestions && data.suggestions.length > 0) {
        const topResult = data.suggestions[0];
        setResult({
          common_names: topResult.plant_details?.common_names || [],
          scientific_name: topResult.plant_name,
          probability: topResult.probability,
          wiki_description: topResult.plant_details?.wiki_description,
          taxonomy: topResult.plant_details?.taxonomy,
        });
        toast({
          title: "Plant Identified!",
          description: `Found: ${topResult.plant_name}`,
        });
      } else {
        toast({
          title: "No Match Found",
          description: "Could not identify this plant. Try a clearer image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Plant identification error:', error);
      toast({
        title: "Identification Failed",
        description: "Failed to identify plant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-primary" />
          Plant Scanner
        </CardTitle>
        <CardDescription>
          Upload or take a photo to identify any plant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
            disabled={isScanning}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Plant to identify"
              className="w-full rounded-lg max-h-96 object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isScanning && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Identifying plant...</span>
          </div>
        )}

        {result && (
          <Card className="bg-muted">
            <CardContent className="pt-6 space-y-3">
              <div>
                <h3 className="font-bold text-xl text-primary">{result.scientific_name}</h3>
                {result.common_names && result.common_names.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Common names: {result.common_names.join(', ')}
                  </p>
                )}
              </div>
              
              {result.probability && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Confidence:</span>
                  <span className="text-sm text-primary font-bold">
                    {(result.probability * 100).toFixed(1)}%
                  </span>
                </div>
              )}

              {result.taxonomy && (
                <div className="text-sm">
                  <p><span className="font-medium">Family:</span> {result.taxonomy.family}</p>
                  <p><span className="font-medium">Genus:</span> {result.taxonomy.genus}</p>
                </div>
              )}

              {result.wiki_description?.value && (
                <div className="text-sm">
                  <p className="font-medium mb-1">Description:</p>
                  <p className="text-muted-foreground line-clamp-4">
                    {result.wiki_description.value}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
