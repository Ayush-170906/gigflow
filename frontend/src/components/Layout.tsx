import { ReactNode } from 'react'
import Navbar from './Navbar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow Top Left */}
      <div className="absolute top-[-120px] left-[-120px] w-[380px] h-[380px] bg-violet-600/20 rounded-full blur-[140px]" />

      {/* Glow Bottom Right */}
      <div className="absolute bottom-[-140px] right-[-140px] w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[160px]" />

      {/* Glow Center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-fuchsia-500/5 rounded-full blur-[140px]" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
          {children}
        </main>
      </div>

    </div>
  )
}