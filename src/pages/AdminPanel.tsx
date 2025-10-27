import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { ArrowLeft, Leaf, Plus } from "lucide-react";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading } = useUserRole();
  
  const [formData, setFormData] = useState({
    name: "",
    scientific_name: "",
    description: "",
    category: "",
    image_url: "",
    benefits: "",
    uses: "",
    growing_conditions: "",
    medicinal_properties: "",
    culinary_uses: "",
    precautions: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const benefits = formData.benefits.split(',').map(b => b.trim()).filter(b => b);
      const uses = formData.uses.split(',').map(u => u.trim()).filter(u => u);

      const { error } = await supabase.from('herbs').insert({
        name: formData.name,
        scientific_name: formData.scientific_name || null,
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url || null,
        benefits,
        uses,
        growing_conditions: formData.growing_conditions || null,
        medicinal_properties: formData.medicinal_properties || null,
        culinary_uses: formData.culinary_uses || null,
        precautions: formData.precautions || null
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Plant added successfully."
      });

      // Reset form
      setFormData({
        name: "",
        scientific_name: "",
        description: "",
        category: "",
        image_url: "",
        benefits: "",
        uses: "",
        growing_conditions: "",
        medicinal_properties: "",
        culinary_uses: "",
        precautions: ""
      });
    } catch (error: any) {
      toast({
        title: "Error adding plant",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Leaf className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Garden
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-6 w-6" />
              Add New Plant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scientific_name">Scientific Name</Label>
                <Input
                  id="scientific_name"
                  value={formData.scientific_name}
                  onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="e.g., medicinal, culinary"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                <Input
                  id="benefits"
                  placeholder="Boosts immunity, Reduces fever"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uses">Uses (comma-separated)</Label>
                <Input
                  id="uses"
                  placeholder="Tea, Cooking, Medicine"
                  value={formData.uses}
                  onChange={(e) => setFormData({ ...formData, uses: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicinal_properties">Medicinal Properties</Label>
                <Textarea
                  id="medicinal_properties"
                  value={formData.medicinal_properties}
                  onChange={(e) => setFormData({ ...formData, medicinal_properties: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="culinary_uses">Culinary Uses</Label>
                <Textarea
                  id="culinary_uses"
                  value={formData.culinary_uses}
                  onChange={(e) => setFormData({ ...formData, culinary_uses: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="growing_conditions">Growing Conditions</Label>
                <Textarea
                  id="growing_conditions"
                  value={formData.growing_conditions}
                  onChange={(e) => setFormData({ ...formData, growing_conditions: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precautions">Precautions</Label>
                <Textarea
                  id="precautions"
                  value={formData.precautions}
                  onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding Plant..." : "Add Plant"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;