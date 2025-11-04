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

import HeroSection from "@/components/HeroSection";


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
      toast({
        title: "Error fetching herbs",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const translateHerbs = async () => {
    const translated: Record<string, Herb> = {};

    for (const herb of herbs) {
      try {
        const response = await supabase.functions.invoke("translate-plant", {
          body: { herb, targetLanguage: i18n.language },
        });

        if (response.data) {
          translated[herb.id] = response.data;
        }
      } catch (error) {
        console.error("Translation failed for herb:", herb.name, error);
      }
    }

    setTranslatedHerbs(translated);
  };

  const filterHerbs = () => {
    const herbsToFilter =
      i18n.language === "en" ? herbs : herbs.map((h) => translatedHerbs[h.id] || h);
    let filtered = herbsToFilter;

    if (searchQuery) {
      filtered = filtered.filter(
        (herb) =>
          herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          herb.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (herb) => herb.category.toLowerCase() === categoryFilter
      );
    }

    setFilteredHerbs(filtered);
  };

  const categories = ["all", ...new Set(herbs.map((h) => h.category.toLowerCase()))];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
  };

  return (
   <HeroSection
  user={user}
  isAdmin={isAdmin}
  navigate={navigate}
  handleSignOut={handleSignOut}
  title={t("title")}
  subtitle={t("subtitle")}
/>


      {/* 🤖 Floating Chat Bot */}
      <FloatingBot />
    </div>
  );
};

export default Index;
