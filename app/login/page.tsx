"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Zap, User, Lock } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import ThemeToggle from "@/components/theme-toggle"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  
  // Safely use theme context with fallback
  const themeContext = useTheme()
  const isDark = themeContext?.isDark ?? false

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate login process
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful login
      if (email && password) {
        // Redirect to dashboard
        router.push("/")
      } else {
        setError("Please enter valid credentials")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-md border border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-neon-green to-neon-cyan rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-background" />
          </div>
          <CardTitle className="text-2xl font-bold">OpenCity AI Hub</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/20 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input border-border/50"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-input border-border/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 text-neon-green border-border/50 rounded focus:ring-neon-green"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-foreground">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-neon-green hover:text-neon-green/90"
                onClick={() => alert("Password reset functionality would be implemented here")}
              >
                Forgot password?
              </button>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-neon-green hover:bg-neon-green/90 text-background"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                className="text-neon-green hover:text-neon-green/90 font-medium"
                onClick={() => alert("Sign up functionality would be implemented here")}
              >
                Sign up
              </button>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © 2025 OpenCity AI Hub. All rights reserved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}