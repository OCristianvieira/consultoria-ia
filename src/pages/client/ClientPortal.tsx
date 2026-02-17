import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '../../store'
import { Block } from '../../components/blocks/Block'

export function ClientPortal() {
  const { slug } = useParams()
  const { currentClient, currentConfig, blocks, fetchClientBySlug, loading } = useStore()
  const [clientLoading, setClientLoading] = useState(true)

  useEffect(() => {
    const loadClient = async () => {
      if (slug) {
        await fetchClientBySlug(slug)
      }
      setClientLoading(false)
    }
    loadClient()
  }, [slug, fetchClientBySlug])

  if (clientLoading || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentConfig?.theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    )
  }

  if (!currentClient) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-400">Cliente não encontrado</p>
        </div>
      </div>
    )
  }

  const isDark = currentConfig?.theme !== 'light'
  const scale = currentConfig?.scale || 100

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          {currentConfig?.logo_url ? (
            <img 
              src={currentConfig.logo_url} 
              alt={currentClient.name}
              className="h-16 mx-auto mb-4"
            />
          ) : (
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
              {currentClient.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-3xl font-bold">{currentClient.name}</h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Sua central de entregáveis
          </p>
        </div>

        {blocks.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Nenhum entregável disponível ainda.
            </p>
          </div>
        ) : (
          <div 
            className="space-y-4"
            style={{ 
              transform: `scale(${scale / 100})`, 
              transformOrigin: 'top center',
              marginBottom: `${(scale - 100) * 2}px`
            }}
          >
            {blocks.map((block) => (
              <Block 
                key={block.id} 
                block={block} 
                scale={scale} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
