import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  return (
    <Select value={i18n.language} onValueChange={(value) => i18n.changeLanguage(value)}>
      <SelectTrigger className="w-32">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
        <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
        <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
        <SelectItem value="mr">मराठी (Marathi)</SelectItem>
      </SelectContent>
    </Select>
  );
};
