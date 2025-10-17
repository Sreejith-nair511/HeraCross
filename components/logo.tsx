"use client"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "icon" | "wordmark" | "full"
}

export default function Logo({ size = "md", variant = "full" }: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: "text-sm" },
    md: { icon: 32, text: "text-lg" },
    lg: { icon: 48, text: "text-2xl" },
  }

  const { icon: iconSize, text: textSize } = sizeMap[size]

  const LogoIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* City skyline grid */}
      <g opacity="0.8">
        <rect x="8" y="24" width="4" height="16" fill="url(#gradient1)" />
        <rect x="16" y="20" width="4" height="20" fill="url(#gradient1)" />
        <rect x="24" y="16" width="4" height="24" fill="url(#gradient1)" />
        <rect x="32" y="22" width="4" height="18" fill="url(#gradient1)" />
        <rect x="40" y="26" width="4" height="14" fill="url(#gradient1)" />
      </g>

      {/* Central AI neural node */}
      <circle cx="24" cy="12" r="6" fill="url(#gradient2)" />

      {/* Neural network connections */}
      <g stroke="url(#gradient2)" strokeWidth="1.5" opacity="0.6">
        <line x1="24" y1="18" x2="16" y2="24" />
        <line x1="24" y1="18" x2="32" y2="24" />
        <line x1="24" y1="18" x2="24" y2="24" />
      </g>

      {/* Connection nodes */}
      <circle cx="16" cy="24" r="2" fill="url(#gradient2)" opacity="0.8" />
      <circle cx="32" cy="24" r="2" fill="url(#gradient2)" opacity="0.8" />
      <circle cx="24" cy="24" r="2" fill="url(#gradient2)" opacity="0.8" />

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#39FF14" />
          <stop offset="100%" stopColor="#00FFFF" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#39FF14" />
          <stop offset="50%" stopColor="#8A2BE2" />
          <stop offset="100%" stopColor="#00FFFF" />
        </linearGradient>
      </defs>
    </svg>
  )

  if (variant === "icon") {
    return <LogoIcon />
  }

  if (variant === "wordmark") {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`${textSize} font-bold bg-gradient-to-r from-neon-green via-neon-violet to-neon-cyan bg-clip-text text-transparent`}
        >
          OpenCity AI Hub
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <LogoIcon />
      <span
        className={`${textSize} font-bold bg-gradient-to-r from-neon-green via-neon-violet to-neon-cyan bg-clip-text text-transparent`}
      >
        OpenCity AI Hub
      </span>
    </div>
  )
}
