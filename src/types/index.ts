export interface Client {
  id: string
  name: string
  email: string
  slug: string
  is_active: boolean
  created_at: string
}

export interface ClientConfig {
  id: string
  client_id: string
  theme: 'dark' | 'light'
  scale: number
  logo_url: string
  primary_color: string
  created_at: string
}

export type BlockType = 
  | 'home' | 'course' | 'ebook' | 'text' | 'image'
  | 'chatgpt' | 'assistants' | 'nano_banana'
  | 'gems' | 'social'
  | 'json' | 'writer' | 'editor'
  | 'music' | 'director' | 'img_gen'
  | 'prompts' | 'camera_angles' | 'weather' | 'lighting'
  | 'composition' | 'poses' | 'actions' | 'color_grading'
  | 'costumes' | 'photo_types' | 'emotions'
  | 'products' | 'environments' | 'mockup'
  | 'food_photo' | 'architecture' | 'culture' | 'camera_movements'
  | 'custom_link'

export interface Block {
  id: string
  client_id: string
  type: BlockType
  title: string
  content: string
  order: number
  is_published: boolean
  config: {
    icon?: string
    bg_color?: string
    text_color?: string
    link_url?: string
    video_embed?: string
    is_toggle?: boolean
  }
}

export const BLOCK_TYPES: { type: BlockType; label: string; category: string }[] = [
  { type: 'home', label: 'Home', category: 'Navegação' },
  { type: 'course', label: 'Acessar Curso', category: 'Navegação' },
  { type: 'ebook', label: 'Ebook', category: 'Conteúdo' },
  { type: 'text', label: 'Texto', category: 'Conteúdo' },
  { type: 'image', label: 'Imagem', category: 'Conteúdo' },
  { type: 'chatgpt', label: 'ChatGPT', category: 'IA Tools' },
  { type: 'assistants', label: 'Assistentes GPT', category: 'IA Tools' },
  { type: 'nano_banana', label: 'Nano Banana Pro', category: 'IA Tools' },
  { type: 'gems', label: 'Gems', category: 'Gems' },
  { type: 'social', label: 'Social', category: 'Social' },
  { type: 'json', label: 'JSON', category: 'Developer' },
  { type: 'writer', label: 'Writer', category: 'Developer' },
  { type: 'editor', label: 'Editor', category: 'Developer' },
  { type: 'music', label: 'Music', category: 'Mídia' },
  { type: 'director', label: 'Director', category: 'Mídia' },
  { type: 'img_gen', label: 'Image', category: 'Mídia' },
  { type: 'prompts', label: 'Prompts', category: 'Prompts' },
  { type: 'camera_angles', label: 'Ângulos de Câmera', category: 'Prompts' },
  { type: 'weather', label: 'Clima e Tempo', category: 'Prompts' },
  { type: 'lighting', label: 'Iluminação', category: 'Prompts' },
  { type: 'composition', label: 'Composições', category: 'Prompts' },
  { type: 'poses', label: 'Poses e Orientações', category: 'Prompts' },
  { type: 'actions', label: 'Ações e Movimentos', category: 'Prompts' },
  { type: 'color_grading', label: 'Color Grading', category: 'Prompts' },
  { type: 'costumes', label: 'Figurinos e Estilos', category: 'Prompts' },
  { type: 'photo_types', label: 'Tipos de Fotografia', category: 'Prompts' },
  { type: 'emotions', label: 'Emoções e Expressões', category: 'Prompts' },
  { type: 'products', label: 'Produtos', category: 'Produtos' },
  { type: 'environments', label: 'Ambientes e Cenários', category: 'Produtos' },
  { type: 'mockup', label: 'Mockup', category: 'Produtos' },
  { type: 'food_photo', label: 'Fotografia de Comida', category: 'Produtos' },
  { type: 'architecture', label: 'Arquitetura', category: 'Produtos' },
  { type: 'culture', label: 'Cultura', category: 'Produtos' },
  { type: 'camera_movements', label: 'Movimentos de Câmera', category: 'Produtos' },
  { type: 'custom_link', label: 'Link Personalizado', category: 'Customizado' },
]
