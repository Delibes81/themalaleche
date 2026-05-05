import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.storage.from('mockups').list();
  if (error) {
    console.error('Error listing mockups:', error);
    return;
  }
  
  console.log(`Found ${data.length} files in mockups bucket.`);
  if (data.length > 0) {
    console.log('Sample file:', data[0]);
    const { data: urlData } = supabase.storage.from('mockups').getPublicUrl(data[0].name);
    console.log('Public URL:', urlData.publicUrl);
    
    // Test fetch
    const response = await fetch(urlData.publicUrl);
    console.log(`Fetch status: ${response.status} ${response.statusText}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    console.log(`Content-Length: ${response.headers.get('content-length')}`);
  }
}

main();
