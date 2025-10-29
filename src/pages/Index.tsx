import { useState, useEffect } from "react";
import { Search, Leaf, Plus, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HerbCard } from "@/components/HerbCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { PlantScanner } from "@/components/PlantScanner";
import { useUserRole } from "@/hooks/useUserRole";
import FloatingBot from "@/components/FloatingBot";

interface Herb {
  id: string;
  name: string;
  scientific_name: string | null;
  description: string;
  category: string;
  image_url: string | null;
  benefits: string[];
}

const Index = () => {
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [filteredHerbs, setFilteredHerbs] = useState<Herb[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { isAdmin } = useUserRole();
  const [translatedHerbs, setTranslatedHerbs] = useState<Record<string, Herb>>({});

  useEffect(() => {
    fetchHerbs();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    filterHerbs();
  }, [searchQuery, categoryFilter, herbs]);

  useEffect(() => {
    if (i18n.language !== 'en' && herbs.length > 0) {
      translateHerbs();
    }
  }, [i18n.language, herbs]);

  const fetchHerbs = async () => {
    try {
      const { data, error } = await supabase.from("herbs").select("*");
      if (error) throw error;
      setHerbs(data || []);
    } catch (error) {
      toast({ title: "Error fetching herbs", description: "Please try again", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const translateHerbs = async () => {
    const translated: Record<string, Herb> = {};
    
    for (const herb of herbs) {
      try {
        const response = await supabase.functions.invoke('translate-plant', {
          body: { herb, targetLanguage: i18n.language }
        });
        
        if (response.data) {
          translated[herb.id] = response.data;
        }
      } catch (error) {
        console.error('Translation failed for herb:', herb.name, error);
      }
    }
    
    setTranslatedHerbs(translated);
  };

  const filterHerbs = () => {
    const herbsToFilter = i18n.language === 'en' ? herbs : herbs.map(h => translatedHerbs[h.id] || h);
    let filtered = herbsToFilter;
    
    if (searchQuery) {
      filtered = filtered.filter(herb => 
        herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        herb.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(herb => herb.category.toLowerCase() === categoryFilter);
    }
    
    setFilteredHerbs(filtered);
  };

  const categories = ["all", ...new Set(herbs.map(h => h.category.toLowerCase()))];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Button onClick={() => navigate("/admin")} variant="default">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Plant
                    </Button>
                  )}
                  <Button onClick={handleSignOut} variant="outline">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate("/auth")} variant="default">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <Leaf className="h-12 w-12 text-primary animate-pulse" />
            <h1 className="text-5xl font-bold text-foreground">{t('title')}</h1>
          </div>
          <p className="text-center text-xl text-muted-foreground mb-8 animate-fade-in">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <PlantScanner />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t('category')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {t(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <Leaf className="h-12 w-12 animate-spin mx-auto text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHerbs.map(herb => (
              <HerbCard key={herb.id} {...herb} scientificName={herb.scientific_name} imageUrl={herb.image_url} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
