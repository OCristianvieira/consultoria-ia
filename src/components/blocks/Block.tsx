import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, ExternalLink, Play, FileText, Image, MessageSquare, Music, Code, Camera, Sparkles, FileJson, Wand2 } from 'lucide-react'
import type { Block as BlockType } from '../../types'

interface BlockProps {
  block: BlockType
  scale: number
  isAdmin?: boolean
  onEdit?: () => void
}

const iconMap: Record<string, any> = {
  home: FileText,
  course: Play,
  ebook: FileText,
  text: FileText,
  image: Image,
  chatgpt: MessageSquare,
  assistants: MessageSquare,
  nano_banana: Sparkles,
  gems: Sparkles,
  social: MessageSquare,
  json: FileJson,
  writer: FileText,
  editor: Code,
  music: Music,
  director: Camera,
  img_gen: Image,
  prompts: Wand2,
  camera_angles: Camera,
  weather: Camera,
  lighting: Camera,
  composition: Camera,
  poses: Camera,
  actions: Camera,
  color_grading: Camera,
  costumes: Camera,
  photo_types: Camera,
  emotions: Camera,
  products: Camera,
  environments: Camera,
  mockup: Image,
  food_photo: Image,
  architecture: Camera,
  culture: Camera,
  camera_movements: Camera,
  custom_link: ExternalLink,
}

const colorMap: Record<string, string> = {
  home: 'from-blue-500 to-blue-600',
  course: 'from-green-500 to-green-600',
  ebook: 'from-purple-500 to-purple-600',
  text: 'from-gray-500 to-gray-600',
  image: 'from-pink-500 to-pink-600',
  chatgpt: 'from-emerald-500 to-emerald-600',
  assistants: 'from-teal-500 to-teal-600',
  nano_banana: 'from-yellow-500 to-yellow-600',
  gems: 'from-amber-500 to-amber-600',
  social: 'from-cyan-500 to-cyan-600',
  json: 'from-orange-500 to-orange-600',
  writer: 'from-indigo-500 to-indigo-600',
  editor: 'from-violet-500 to-violet-600',
  music: 'from-red-500 to-red-600',
  director: 'from-rose-500 to-rose-600',
  img_gen: 'from-fuchsia-500 to-fuchsia-600',
  prompts: 'from-lime-500 to-lime-600',
  camera_angles: 'from-slate-500 to-slate-600',
  weather: 'from-sky-500 to-sky-600',
  lighting: 'from-yellow-500 to-yellow-600',
  composition: 'from-zinc-500 to-zinc-600',
  poses: 'from-stone-500 to-stone-600',
  actions: 'from-neutral-500 to-neutral-600',
  color_grading: 'from-cyan-500 to-cyan-600',
  costumes: 'from-pink-500 to-pink-600',
  photo_types: 'from-purple-500 to-purple-600',
  emotions: 'from-red-500 to-red-600',
  products: 'from-green-500 to-green-600',
  environments: 'from-emerald-500 to-emerald-600',
  mockup: 'from-blue-500 to-blue-600',
  food_photo: 'from-orange-500 to-orange-600',
  architecture: 'from-slate-500 to-slate-600',
  culture: 'from-indigo-500 to-indigo-600',
  camera_movements: 'from-cyan-500 to-cyan-600',
  custom_link: 'from-gray-500 to-gray-600',
}

export function Block({ block, scale, isAdmin = false, onEdit }: BlockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isToggle = block.config?.is_toggle
  const hasLink = block.config?.link_url
  const hasVideo = block.config?.video_embed

  const scalePercent = scale / 100
  const Icon = iconMap[block.type] || FileText
  const gradient = colorMap[block.type] || 'from-gray-500 to-gray-600'

  const handleClick = () => {
    if (isAdmin && onEdit) {
      onEdit()
      return
    }

    if (isToggle) {
      setIsExpanded(!isExpanded)
    } else if (hasLink) {
      window.open(block.config.link_url, '_blank')
    }
  }

  return (
    <motion.div
      layout
      className="relative"
      style={{ transform: `scale(${scalePercent})`, transformOrigin: 'top left' }}
    >
      <div
        onClick={handleClick}
        className={`
          group relative overflow-hidden rounded-2xl cursor-pointer
          bg-gradient-to-br ${gradient}
          hover:shadow-lg hover:shadow-black/20
          transition-all duration-300
          ${isAdmin ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900' : ''}
        `}
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/15 transition-colors" />
        
        <div className="relative p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate text-base">
                {block.title}
              </h3>
              {block.content && (
                <p className="text-white/70 text-sm truncate mt-0.5">
                  {block.content}
                </p>
              )}
            </div>
            {isToggle && (
              <div className="p-2 rounded-lg bg-white/10">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-white" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white" />
                )}
              </div>
            )}
            {!isToggle && hasLink && (
              <div className="p-2 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <AnimatePresence>
            {isExpanded && (hasVideo || block.content) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-white/20"
              >
                {hasVideo && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/30 mb-3">
                    <iframe
                      src={block.config.video_embed}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {block.content && (
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {block.content}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
