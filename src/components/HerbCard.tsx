import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface HerbCardProps {
  id: string;
  name: string;
  scientificName: string | null;
  description: string;
  category: string;
  imageUrl: string | null;
  benefits: string[];
}

export const HerbCard = ({ id, name, scientificName, description, category, imageUrl, benefits }: HerbCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={() => navigate(`/herb/${id}`)}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Badge className="absolute top-3 right-3 bg-primary">{category}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
        {scientificName && (
          <p className="text-sm italic text-muted-foreground mb-2">{scientificName}</p>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
        <div className="flex flex-wrap gap-1">
          {benefits.slice(0, 3).map((benefit, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">{benefit}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
