-- Create herbs table with detailed information
CREATE TABLE public.herbs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  benefits TEXT[] DEFAULT '{}',
  uses TEXT[] DEFAULT '{}',
  image_url TEXT,
  growing_conditions TEXT,
  medicinal_properties TEXT,
  culinary_uses TEXT,
  precautions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.herbs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read herbs (public data)
CREATE POLICY "Anyone can view herbs" 
ON public.herbs 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_herbs_updated_at
BEFORE UPDATE ON public.herbs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample herbs data
INSERT INTO public.herbs (name, scientific_name, description, category, benefits, uses, image_url, growing_conditions, medicinal_properties, culinary_uses, precautions) VALUES
('Basil', 'Ocimum basilicum', 'A fragrant herb with sweet, aromatic leaves commonly used in cooking and traditional medicine.', 'Culinary', ARRAY['Anti-inflammatory', 'Antioxidant', 'Stress relief'], ARRAY['Cooking', 'Tea', 'Essential oil'], 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800', 'Warm, sunny location with well-drained soil', 'Contains essential oils with antimicrobial properties, helps reduce inflammation and oxidative stress', 'Perfect for pesto, salads, pasta dishes, and Italian cuisine', 'Generally safe, but essential oil should be used with caution'),
('Lavender', 'Lavandula angustifolia', 'A beautiful purple flowering herb known for its calming fragrance and therapeutic properties.', 'Medicinal', ARRAY['Calming', 'Sleep aid', 'Pain relief', 'Antimicrobial'], ARRAY['Aromatherapy', 'Tea', 'Sachets', 'Topical'], 'https://images.unsplash.com/photo-1611419010196-870f7e6e56e7?w=800', 'Full sun, dry to medium moisture, well-drained soil', 'Reduces anxiety and promotes relaxation, helps with insomnia and headaches', 'Used in baking, herbal teas, and as a garnish', 'May cause drowsiness; avoid if pregnant or nursing'),
('Peppermint', 'Mentha × piperita', 'A hybrid mint with a cool, refreshing flavor used widely in cooking and medicine.', 'Medicinal', ARRAY['Digestive aid', 'Headache relief', 'Respiratory health'], ARRAY['Tea', 'Cooking', 'Essential oil'], 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800', 'Partial shade, moist soil, spreads aggressively', 'Relieves IBS symptoms, reduces nausea, soothes digestive issues', 'Tea, mojitos, salads, desserts, and Middle Eastern dishes', 'May worsen acid reflux; avoid with GERD'),
('Chamomile', 'Matricaria chamomilla', 'A gentle herb with daisy-like flowers, cherished for its soothing and calming effects.', 'Medicinal', ARRAY['Calming', 'Anti-inflammatory', 'Sleep aid'], ARRAY['Tea', 'Compress', 'Aromatherapy'], 'https://images.unsplash.com/photo-1563618969806-3b8c0ad3474e?w=800', 'Full sun, well-drained soil, tolerates poor conditions', 'Promotes sleep, reduces anxiety, soothes stomach issues and skin inflammation', 'Primarily used in teas and herbal infusions', 'May cause allergic reactions in people sensitive to ragweed'),
('Rosemary', 'Rosmarinus officinalis', 'A woody, fragrant herb with needle-like leaves, excellent for memory and cooking.', 'Culinary', ARRAY['Memory enhancement', 'Antioxidant', 'Hair health'], ARRAY['Cooking', 'Tea', 'Hair rinse'], 'https://images.unsplash.com/photo-1584279862469-8fd87d8834a2?w=800', 'Full sun, well-drained soil, drought tolerant once established', 'Improves circulation, enhances memory and concentration, anti-inflammatory', 'Roasted meats, potatoes, breads, and Mediterranean cuisine', 'High doses may affect pregnancy; use moderately'),
('Turmeric', 'Curcuma longa', 'A golden-yellow rhizome with powerful anti-inflammatory and antioxidant properties.', 'Medicinal', ARRAY['Anti-inflammatory', 'Antioxidant', 'Joint health'], ARRAY['Cooking', 'Tea', 'Supplements'], 'https://images.unsplash.com/photo-1615485500834-bc10199bc6dd?w=800', 'Warm, humid climate, rich, well-drained soil', 'Contains curcumin which reduces inflammation and oxidative damage', 'Curries, golden milk, rice dishes, and South Asian cuisine', 'May interfere with blood thinners; consult doctor if on medication'),
('Ginger', 'Zingiber officinale', 'A spicy root with warming properties, excellent for digestion and nausea relief.', 'Medicinal', ARRAY['Digestive aid', 'Anti-nausea', 'Anti-inflammatory'], ARRAY['Cooking', 'Tea', 'Supplements'], 'https://images.unsplash.com/photo-1599639957043-f3aa5c986398?w=800', 'Warm, humid climate, partial shade, rich soil', 'Reduces nausea, improves digestion, has anti-inflammatory effects', 'Stir-fries, teas, baking, and Asian cuisine', 'May interact with blood thinners and diabetes medications'),
('Aloe Vera', 'Aloe barbadensis miller', 'A succulent plant with gel-filled leaves known for healing and moisturizing properties.', 'Medicinal', ARRAY['Skin healing', 'Moisturizing', 'Digestive support'], ARRAY['Topical', 'Juice', 'Gel'], 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=800', 'Bright indirect light, well-drained sandy soil, minimal water', 'Soothes burns, promotes wound healing, supports digestive health', 'Limited culinary use; mainly consumed as juice', 'May cause laxative effects; not recommended for pregnant women');