import { useState, useRef } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const base64Image = await convertImageToBase64(file);

      const response = await fetch("https://api.plant.id/v2/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": import.meta.env.VITE_PLANT_ID_API_KEY,
        },
        body: JSON.stringify({
          images: [base64Image],
          similar_images: true,
        }),
      });

      const data = await response.json();

      if (data?.suggestions?.length > 0) {
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
          description: "Try a clearer image or different angle.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Plant ID error:", error);
      toast({
        title: "Error",
        description: "Unable to identify this plant.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-primary" />
          Plant Scanner
        </CardTitle>
        <CardDescription>
          Tap the camera icon to identify a plant instantly 🌿
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center"
            disabled={isScanning}
          >
            {isScanning ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <Camera className="h-6 w-6 text-primary" />
            )}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
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
              <h3 className="font-bold text-xl text-primary">{result.scientific_name}</h3>
              {result.common_names?.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Common names: {result.common_names.join(", ")}
                </p>
              )}
              {result.probability && (
                <p className="text-sm font-medium">
                  Confidence:{" "}
                  <span className="text-primary font-bold">
                    {(result.probability * 100).toFixed(1)}%
                  </span>
                </p>
              )}
              {result.taxonomy && (
                <div className="text-sm">
                  <p><strong>Family:</strong> {result.taxonomy.family}</p>
                  <p><strong>Genus:</strong> {result.taxonomy.genus}</p>
                </div>
              )}
              {result.wiki_description?.value && (
                <div className="text-sm text-muted-foreground">
                  <p><strong>Description:</strong></p>
                  <p>{result.wiki_description.value}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
