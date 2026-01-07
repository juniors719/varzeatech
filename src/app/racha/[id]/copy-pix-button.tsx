'use client'

interface CopyPixButtonProps {
  pixKey: string
}

export function CopyPixButton({ pixKey }: CopyPixButtonProps) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(pixKey)
        alert('Chave Pix copiada!')
      }}
      className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded transition-colors text-sm font-medium"
    >
      Copiar
    </button>
  )
}
