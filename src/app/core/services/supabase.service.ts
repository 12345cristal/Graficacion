import { createClient } from '@supabase/supabase-js';
import { Injectable } from '@angular/core';

const SUPABASE_URL = 'https://ujbcqihbnexagykeyvoa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-59IvKEvcdaFi-iFDiSRRQ_rdiT5KoR';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client = createClient(SUPABASE_URL, SUPABASE_KEY);
}
