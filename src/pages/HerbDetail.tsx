import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface Herb {
  name: string;
  scientific_name: string | null;
  description: string;
  category: string;
  benefits: string[];
  uses: string[];
  image_url: string | null;
  growing_conditions: string | null;
  medicinal_properties: string | null;
  culinary_uses: string | null;
  precautions: string | null;
  amazon_link?: string | null;
}

const HerbDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [herb, setHerb] = useState<Herb | null>(null);
  const [translatedHerb, setTranslatedHerb] = useState<Herb | null>(null);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchHerb();
  }, [id]);

  useEffect(() => {
    if (herb && i18n.language !== "en") {
      translateHerb();
    } else {
      setTranslatedHerb(null);
    }
  }, [i18n.language, herb]);

  const fetchHerb = async () => {
    try {
      const { data, error } = await supabase
        .from("herbs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setHerb(data);
    } catch (error) {
      toast({ title: "Error loading herb", variant: "destructive" });
      navigate("/");
    }
  };

  const translateHerb = async () => {
    if (!herb) return;

    try {
      const { data, error } = await supabase.functions.invoke("translate-plant", {
        body: { herb, targetLanguage: i18n.language },
      });

      if (error) throw error;
      setTranslatedHerb(data);
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  if (!herb)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Leaf className="h-12 w-12 animate-spin text-primary" />
      </div>
    );

  const displayHerb = translatedHerb || herb;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-96 overflow-hidden">
        <img
          src={displayHerb.image_url || "/placeholder.svg"}
          alt={displayHerb.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft />
        </Button>

        <div className="absolute bottom-8 left-0 right-0 container mx-auto px-4">
          <Badge className="mb-2">{displayHerb.category}</Badge>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-5xl font-bold text-foreground">
              {displayHerb.name}
            </h1>
            <Button
              variant="default"
              size="icon"
              className="rounded-full"
              title="Buy on Amazon"
              onClick={() =>
                window.open(
                  displayHerb.amazon_link ||
                    `https://www.amazon.in/s?k=${encodeURIComponent(
                      displayHerb.name
                    )}+herb`,
                  "_blank"
                )
              }
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
          {displayHerb.scientific_name && (
            <p className="text-xl italic text-muted-foreground">
              {displayHerb.scientific_name}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("about")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{displayHerb.description}</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("benefits")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {displayHerb.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("uses")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {displayHerb.uses.map((u, i) => (
                  <Badge key={i} variant="secondary">
                    {u}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {displayHerb.medicinal_properties && (
          <Card>
            <CardHeader>
              <CardTitle>{t("medicinalProperties")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {displayHerb.medicinal_properties}
              </p>
            </CardContent>
          </Card>
        )}

        {displayHerb.culinary_uses && (
          <Card>
            <CardHeader>
              <CardTitle>{t("culinaryUses")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {displayHerb.culinary_uses}
              </p>
            </CardContent>
          </Card>
        )}

        {displayHerb.growing_conditions && (
          <Card>
            <CardHeader>
              <CardTitle>{t("growingConditions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {displayHerb.growing_conditions}
              </p>
            </CardContent>
          </Card>
        )}

        {displayHerb.precautions && (
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">
                {t("precautions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {displayHerb.precautions}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HerbDetail;
