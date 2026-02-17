import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ExternalLink, Trash2, Edit, Send, Copy, Check } from 'lucide-react'
import { useStore } from '../../store'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'

export function AdminClients() {
  const navigate = useNavigate()
  const { clients, fetchClients, createClient, deleteClient, sendMagicLink, loading } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', email: '' })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [sendingLink, setSendingLink] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleCreate = async () => {
    if (!newClient.name || !newClient.email) return
    await createClient(newClient.name, newClient.email)
    setNewClient({ name: '', email: '' })
    setIsModalOpen(false)
  }

  const handleSendLink = async (email: string, slug: string) => {
    setSendingLink(slug)
    try {
      await sendMagicLink(email, slug)
      alert('Link de acesso enviado!')
    } catch (err) {
      alert('Erro ao enviar link')
    }
    setSendingLink(null)
  }

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${slug}`)
    setCopiedId(slug)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-gray-400 mt-1">Gerencie seus clientes e entregáveis</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Nenhum cliente encontrado</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Criar primeiro cliente
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{client.name}</h3>
                      <p className="text-gray-400 text-sm">{client.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                          {client.slug}
                        </code>
                        <button
                          onClick={() => handleCopyLink(client.slug)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          {copiedId === client.slug ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendLink(client.email, client.slug)}
                      disabled={sendingLink === client.slug}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      {sendingLink === client.slug ? 'Enviando...' : 'Enviar Link'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/admin/${client.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/${client.slug}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este cliente?')) {
                          deleteClient(client.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Criar Novo Cliente"
      >
        <div className="space-y-4">
          <Input
            label="Nome do Cliente"
            placeholder="Ex: João Silva"
            value={newClient.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewClient({ ...newClient, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="cliente@exemplo.com"
            value={newClient.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewClient({ ...newClient, email: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!newClient.name || !newClient.email}>
              Criar Cliente
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
