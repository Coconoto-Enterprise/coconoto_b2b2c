// /api/delete-record.js
// Deletes a record from a specified table in Supabase

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { table, id } = req.body;
  if (!table || !id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Only allow certain tables for security
  const allowedTables = [
    'book_event_requests',
    'machine_orders',
    'product_orders',
    'service_contacts',
    'husk_sale_requests',
    'waitlist',
  ];
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table' });
  }

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, message: `Record deleted from ${table}` });
}
