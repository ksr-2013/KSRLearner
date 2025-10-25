#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseAuth() {
  try {
    console.log('🔍 Testing Supabase authentication...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔑 Supabase URL:', supabaseUrl);
    console.log('🔑 Service Role Key exists:', !!supabaseKey);
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing Supabase configuration');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
    
    // Test a simple query
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.log('❌ Supabase auth error:', error.message);
    } else {
      console.log('✅ Supabase auth working, found', data.users.length, 'users');
    }
    
  } catch (error) {
    console.error('❌ Error testing Supabase auth:', error.message);
  }
}

testSupabaseAuth();
