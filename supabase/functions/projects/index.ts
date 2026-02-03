import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders
        });
    }
    try {
        // 1. Check Custom API Key
        const apiKey = req.headers.get('x-api-key');
        const validKey = Deno.env.get('GAMEFUND_API_KEY');

        if (!validKey || apiKey !== validKey) {
            return new Response(JSON.stringify({
                error: 'Unauthorized: Invalid or missing API Key'
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 401
            });
        }
        // 2. Authorization (Optional)
        // - If present: User Context (Authentified)
        // - If missing: Anon Context (via PUBLISHABLE_KEY)
        const authHeader = req.headers.get('Authorization')

        // 3. Create Supabase client with User Context
        // We use PUBLISHABLE_KEY as the new standard (replacing Legacy Anon Key)
        // If PUBLISHABLE_KEY is missing (not set yet), we fallback to legacy SUPABASE_ANON_KEY
        const publicParams = Deno.env.get('PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            publicParams,
            { global: { headers: { Authorization: authHeader } } }
        )
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        // GET /projects?id=... -> Get specific project
        if (id) {
            const { data, error } = await supabaseClient.from('projects').select(`
                *,
                creator:profiles!creator_id(id, display_name, avatar_url, bio)
            `).eq('id', id).single();
            if (error) throw error;
            // Enrich data if needed (e.g. stats), but for simple API, returning DB data + relations is often enough.
            // If we want parity with projectService.js, we might need RPC calls here too.
            // Let's do basic stats retrieval via RPC if the user requested it? 
            // For simplicity "in a first step", raw data is good.
            // But the user asked "lire les informations un projet specifique", usually implies full info.
            // Let's optimize: single query with eager loading is efficient.
            return new Response(JSON.stringify(data), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 200
            });
        }
        // GET /projects -> List all projects
        const { data, error } = await supabaseClient.from('projects').select(`
            *,
            creator:profiles!creator_id(id, display_name, avatar_url)
        `).order('created_at', {
            ascending: false
        });
        if (error) throw error;
        return new Response(JSON.stringify(data), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            },
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: error.message
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            },
            status: 400
        });
    }
});
