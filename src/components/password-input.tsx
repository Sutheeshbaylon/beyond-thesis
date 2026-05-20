'use client'

import { useState } from 'react'

interface Props {
  id: string
  name: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
}

export default function PasswordInput({ id, name, placeholder = '••••••••', autoComplete, required }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-10 border border-[#E5E5E5] rounded-md text-sm text-[#1A1A1A] bg-white placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#1A1A1A] text-xs select-none"
        tabIndex={-1}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
