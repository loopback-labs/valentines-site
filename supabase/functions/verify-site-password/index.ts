import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { site_id, password } = await req.json();

    if (!site_id || !password) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Missing site_id or password' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Use service role key to access password_hash (not exposed to clients)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get the password_hash from the base table (not the public view)
    const { data, error } = await supabase
      .from('valentine_sites')
      .select('password_hash')
      .eq('id', site_id)
      .eq('is_published', true)
      .eq('password_protected', true)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Site not found or not password protected' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Compare passwords
    // Note: Currently passwords are stored as plain text, 
    // so we do a simple comparison. For production, use bcrypt.
    const valid = password === data.password_hash;

    return new Response(
      JSON.stringify({ valid }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (err) {
    console.error('Error verifying password:', err);
    return new Response(
      JSON.stringify({ valid: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
