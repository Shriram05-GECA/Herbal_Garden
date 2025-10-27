import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { images } = await req.json();
    const apiKey = Deno.env.get('PLANTID_API_KEY');

    if (!apiKey) {
      throw new Error('PLANTID_API_KEY is not configured');
    }

    console.log('Identifying plant with Plant.id API');

    const response = await fetch('https://api.plant.id/v2/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        images,
        modifiers: ['crops_fast', 'similar_images'],
        plant_language: 'en',
        plant_details: [
          'common_names',
          'taxonomy',
          'url',
          'wiki_description',
          'edible_parts',
          'watering'
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Plant.id API error:', response.status, errorData);
      throw new Error(`Plant.id API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Plant identification successful');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in identify-plant function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
