import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Save, Trash2, GripVertical, Sun, Moon, Eye, EyeOff } from 'lucide-react'
import { useStore } from '../../store'
import { Button } from '../../components/ui/Button'
import { Input, TextArea, Select } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { BLOCK_TYPES, type Block, type BlockType } from '../../types'

export function AdminClientEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    clients, 
    currentConfig, 
    blocks, 
    fetchClientBlocks,
    createBlock, 
    updateBlock, 
    deleteBlock,
    reorderBlocks,
    updateClientConfig 
  } = useStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [blockForm, setBlockForm] = useState({
    type: 'custom_link' as BlockType,
    title: '',
    content: '',
    link_url: '',
    video_embed: '',
    is_toggle: false,
    is_published: true,
  })
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  useEffect(() => {
    if (id) {
      const client = clients.find(c => c.id === id)
      if (client) {
        fetchClientBlocks(client.id)
      }
    }
  }, [id, clients])

  const client = clients.find(c => c.id === id)

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Cliente não encontrado</p>
      </div>
    )
  }

  const handleOpenModal = (block?: Block) => {
    if (block) {
      setEditingBlock(block)
      setBlockForm({
        type: block.type,
        title: block.title,
        content: block.content,
        link_url: block.config?.link_url || '',
        video_embed: block.config?.video_embed || '',
        is_toggle: block.config?.is_toggle || false,
        is_published: block.is_published,
      })
    } else {
      setEditingBlock(null)
      setBlockForm({
        type: 'custom_link',
        title: '',
        content: '',
        link_url: '',
        video_embed: '',
        is_toggle: false,
        is_published: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleSaveBlock = async () => {
    const blockData = {
      client_id: client.id,
      type: blockForm.type,
      title: blockForm.title,
      content: blockForm.content,
      order: editingBlock ? editingBlock.order : blocks.length,
      is_published: blockForm.is_published,
      config: {
        link_url: blockForm.link_url,
        video_embed: blockForm.video_embed,
        is_toggle: blockForm.is_toggle,
      },
    }

    if (editingBlock) {
      await updateBlock(editingBlock.id, blockData)
    } else {
      await createBlock(blockData as any)
    }
    setIsModalOpen(false)
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    
    const newBlocks = [...blocks]
    const [draggedItem] = newBlocks.splice(dragIndex, 1)
    newBlocks.splice(index, 0, draggedItem)
    reorderBlocks(newBlocks)
    setDragIndex(index)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  const handleConfigChange = async (key: string, value: any) => {
    await updateClientConfig(client.id, { [key]: value })
  }

  const groupedBlocks = BLOCK_TYPES.reduce((acc, block) => {
    if (!acc[block.category]) acc[block.category] = []
    acc[block.category].push(block)
    return acc
  }, {} as Record<string, typeof BLOCK_TYPES>)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-gray-400">Personalize os entregáveis do cliente</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Bloco
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Blocos</h2>
              
              {blocks.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Nenhum bloco adicionado</p>
                  <Button onClick={() => handleOpenModal()} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar primeiro bloco
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`
                        flex items-center gap-3 p-4 rounded-xl bg-gray-700/50 
                        border border-gray-600 cursor-move
                        ${dragIndex === index ? 'opacity-50' : ''}
                      `}
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium">{block.title}</p>
                        <p className="text-sm text-gray-400">{block.type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateBlock(block.id, { is_published: !block.is_published })}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          {block.is_published ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenModal(block)}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Excluir este bloco?')) {
                              deleteBlock(block.id)
                            }
                          }}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Configurações</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tema
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfigChange('theme', 'dark')}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                        currentConfig?.theme === 'dark' 
                          ? 'border-indigo-500 bg-indigo-500/20' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </button>
                    <button
                      onClick={() => handleConfigChange('theme', 'light')}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                        currentConfig?.theme === 'light' 
                          ? 'border-indigo-500 bg-indigo-500/20' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Escala: {currentConfig?.scale || 100}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={currentConfig?.scale || 100}
                    onChange={(e) => handleConfigChange('scale', parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <Input
                  label="Cor Principal"
                  type="color"
                  value={currentConfig?.primary_color || '#6366f1'}
                  onChange={(e) => handleConfigChange('primary_color', e.target.value)}
                />

                <Input
                  label="URL do Logo"
                  placeholder="https://exemplo.com/logo.png"
                  value={currentConfig?.logo_url || ''}
                  onChange={(e) => handleConfigChange('logo_url', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Biblioteca de Blocos</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(groupedBlocks).map(([category, types]) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {types.map((bt) => (
                        <button
                          key={bt.type}
                          onClick={() => {
                            setBlockForm(prev => ({ ...prev, type: bt.type, title: bt.label }))
                            setEditingBlock(null)
                            setIsModalOpen(true)
                          }}
                          className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                          {bt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlock ? 'Editar Bloco' : 'Adicionar Bloco'}
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Tipo de Bloco"
            value={blockForm.type}
            onChange={(e) => setBlockForm({ ...blockForm, type: e.target.value as BlockType })}
            options={BLOCK_TYPES.map(bt => ({ value: bt.type, label: bt.label }))}
          />

          <Input
            label="Título"
            value={blockForm.title}
            onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
            placeholder="Título do bloco"
          />

          <TextArea
            label="Conteúdo (texto)"
            value={blockForm.content}
            onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
            placeholder="Conteúdo adicional..."
            rows={4}
          />

          <Input
            label="URL de Link Externo"
            value={blockForm.link_url}
            onChange={(e) => setBlockForm({ ...blockForm, link_url: e.target.value })}
            placeholder="https://..."
          />

          <Input
            label="Embed de Vídeo (YouTube/Vimeo)"
            value={blockForm.video_embed}
            onChange={(e) => setBlockForm({ ...blockForm, video_embed: e.target.value })}
            placeholder="https://www.youtube.com/embed/..."
          />

          <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={blockForm.is_toggle}
              onChange={(e) => setBlockForm({ ...blockForm, is_toggle: e.target.checked })}
              className="w-5 h-5 rounded accent-indigo-500"
            />
            <span>Ativar modo Toggle (expandir ao clicar)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={blockForm.is_published}
              onChange={(e) => setBlockForm({ ...blockForm, is_published: e.target.checked })}
              className="w-5 h-5 rounded accent-indigo-500"
            />
            <span>Publicar bloco</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveBlock} disabled={!blockForm.title}>
              Salvar Bloco
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
