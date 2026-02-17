import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Client, ClientConfig, Block } from '../types'

interface AppState {
  user: any | null
  clients: Client[]
  currentClient: Client | null
  currentConfig: ClientConfig | null
  blocks: Block[]
  loading: boolean
  setUser: (user: any) => void
  fetchClients: () => Promise<void>
  fetchClientBySlug: (slug: string) => Promise<Client | null>
  fetchClientBlocks: (clientId: string) => Promise<void>
  createClient: (name: string, email: string) => Promise<Client>
  updateClient: (id: string, data: Partial<Client>) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  updateClientConfig: (clientId: string, config: Partial<ClientConfig>) => Promise<void>
  createBlock: (block: Omit<Block, 'id'>) => Promise<Block>
  updateBlock: (id: string, data: Partial<Block>) => Promise<void>
  deleteBlock: (id: string) => Promise<void>
  reorderBlocks: (blocks: Block[]) => Promise<void>
  sendMagicLink: (email: string, clientSlug: string) => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  clients: [],
  currentClient: null,
  currentConfig: null,
  blocks: [],
  loading: false,

  setUser: (user) => set({ user }),

  fetchClients: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      set({ clients: data })
    }
    set({ loading: false })
  },

  fetchClientBySlug: async (slug: string) => {
    set({ loading: true })
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    if (error || !client) {
      set({ loading: false })
      return null
    }

    const { data: config } = await supabase
      .from('client_config')
      .select('*')
      .eq('client_id', client.id)
      .single()

    const { data: blocks } = await supabase
      .from('blocks')
      .select('*')
      .eq('client_id', client.id)
      .eq('is_published', true)
      .order('order', { ascending: true })

    set({ currentClient: client, currentConfig: config, blocks: blocks || [], loading: false })
    return client
  },

  fetchClientBlocks: async (clientId: string) => {
    const { data } = await supabase
      .from('blocks')
      .select('*')
      .eq('client_id', clientId)
      .order('order', { ascending: true })
    set({ blocks: data || [] })
  },

  createClient: async (name: string, email: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString(36)
    
    const { data: client, error } = await supabase
      .from('clients')
      .insert({ name, email, slug, is_active: true })
      .select()
      .single()

    if (error) throw error

    await supabase
      .from('client_config')
      .insert({ 
        client_id: client.id, 
        theme: 'dark', 
        scale: 100, 
        logo_url: '', 
        primary_color: '#6366f1' 
      })

    await get().fetchClients()
    return client
  },

  updateClient: async (id: string, data: Partial<Client>) => {
    await supabase.from('clients').update(data).eq('id', id)
    await get().fetchClients()
  },

  deleteClient: async (id: string) => {
    await supabase.from('clients').delete().eq('id', id)
    await get().fetchClients()
  },

  updateClientConfig: async (clientId: string, config: Partial<ClientConfig>) => {
    const { data: existing } = await supabase
      .from('client_config')
      .select('id')
      .eq('client_id', clientId)
      .single()

    if (existing) {
      await supabase
        .from('client_config')
        .update(config)
        .eq('client_id', clientId)
    } else {
      await supabase
        .from('client_config')
        .insert({ client_id: clientId, ...config })
    }
  },

  createBlock: async (block: Omit<Block, 'id'>) => {
    const { data, error } = await supabase
      .from('blocks')
      .insert(block)
      .select()
      .single()
    
    if (error) throw error
    await get().fetchClientBlocks(block.client_id)
    return data
  },

  updateBlock: async (id: string, data: Partial<Block>) => {
    await supabase.from('blocks').update(data).eq('id', id)
    const { currentClient } = get()
    if (currentClient) {
      await get().fetchClientBlocks(currentClient.id)
    }
  },

  deleteBlock: async (id: string) => {
    await supabase.from('blocks').delete().eq('id', id)
    const { currentClient } = get()
    if (currentClient) {
      await get().fetchClientBlocks(currentClient.id)
    }
  },

  reorderBlocks: async (blocks: Block[]) => {
    for (let i = 0; i < blocks.length; i++) {
      await supabase.from('blocks').update({ order: i }).eq('id', blocks[i].id)
    }
  },

  sendMagicLink: async (email: string, clientSlug: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/${clientSlug}`,
      }
    })
    if (error) throw error
  },
}))
