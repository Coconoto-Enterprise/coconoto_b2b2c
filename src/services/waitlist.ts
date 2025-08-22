// ...existing code...
import { supabase } from '../lib/supabase'

export interface WaitlistEntry {
  id?: string
  name: string
  email: string
  company?: string
  phone: string
  account_type: 'seller' | 'buyer' | 'both'
  country?: string
  state?: string
  city?: string
  business_type?: string
  business_category?: string
  products: string[]
  products_other?: string
  monthly_volume?: string
  years_experience?: string
  primary_use_case?: string
  hear_about_us?: string
  additional_info?: string
  created_at?: string
}

export class WaitlistService {
  static async addToWaitlist(entry: Omit<WaitlistEntry, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([{
          name: entry.name,
          email: entry.email,
          company: entry.company,
          phone: entry.phone,
          account_type: entry.account_type,
          country: entry.country,
          state: entry.state,
          city: entry.city,
          business_type: entry.business_type,
          business_category: entry.business_category,
          products: entry.products,
          products_other: entry.products_other,
          monthly_volume: entry.monthly_volume,
          years_experience: entry.years_experience,
          primary_use_case: entry.primary_use_case,
          hear_about_us: entry.hear_about_us,
          additional_info: entry.additional_info
        }])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      console.error('Network error:', err)
      return { success: false, error: 'Network error occurred' }
    }
  }

  static async getAllEntries(): Promise<{ data: WaitlistEntry[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return { data: null, error: error.message }
      }

      return { data }
    } catch (err) {
      return { data: null, error: 'Network error occurred' }
    }
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking email:', error)
      }

      return !!data
    } catch (err) {
      console.error('Network error:', err)
      return false
    }
  }
}
