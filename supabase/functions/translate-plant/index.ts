import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { herb, targetLanguage } = await req.json();

    const languageNames: Record<string, string> = {
      hi: 'Hindi',
      bn: 'Bengali',
      te: 'Telugu',
      ta: 'Tamil',
      mr: 'Marathi',
      es: 'Spanish',
      fr: 'French',
    };

    if (targetLanguage === 'en') {
      return new Response(JSON.stringify(herb), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Translate the following plant/herb information to ${languageNames[targetLanguage] || targetLanguage}. Maintain the same structure and return ONLY a valid JSON object with these exact fields translated:

{
  "name": "${herb.name}",
  "scientific_name": "${herb.scientific_name || ''}",
  "description": "${herb.description}",
  "category": "${herb.category}",
  "benefits": ${JSON.stringify(herb.benefits)},
  "uses": ${JSON.stringify(herb.uses)},
  "growing_conditions": "${herb.growing_conditions || ''}",
  "medicinal_properties": "${herb.medicinal_properties || ''}",
  "culinary_uses": "${herb.culinary_uses || ''}",
  "precautions": "${herb.precautions || ''}"
}

Return ONLY the JSON object with all text translated to ${languageNames[targetLanguage] || targetLanguage}. Keep scientific_name in Latin. Do not include any explanation or markdown formatting.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const translatedText = data.choices[0].message.content;
    
    const jsonMatch = translatedText.match(/\{[\s\S]*\}/);
    const translatedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(translatedText);

    return new Response(JSON.stringify({ ...herb, ...translatedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Translation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Translation failed';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
