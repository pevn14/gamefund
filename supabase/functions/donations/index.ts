import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Check Custom API Key
        const apiKey = req.headers.get('x-api-key')
        const validKey = Deno.env.get('GAMEFUND_API_KEY')

        if (!validKey || apiKey !== validKey) {
            return new Response(JSON.stringify({ error: 'Unauthorized: Invalid or missing API Key' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        // 2. Authorization (Optional)
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

        const url = new URL(req.url)
        const projectId = url.searchParams.get('projectId')

        // GET /donations?projectId=...
        if (projectId) {
            const { data, error } = await supabaseClient
                .from('donations')
                .select(`
              *,
              donor:profiles!donor_id(id, display_name, avatar_url)
            `)
                .eq('project_id', projectId)
                .order('created_at', { ascending: false })

            if (error) throw error

            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        // If no projectId, maybe return error or list all (limited)?
        // User asked "lister les donations sur un projet particulier".
        // I'll return an empty list or error if no projectId is provided to be safe.
        throw new Error('Missing projectId parameter')

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
