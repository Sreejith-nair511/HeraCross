"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Bell, Lock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import ThemeCustomizer from "@/components/theme-customizer"
import { motion } from "framer-motion"

export default function Settings() {
  const { t } = useLanguage()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="p-6 space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("settings")}</h1>
        <p className="text-muted-foreground mt-1">Configure your preferences and account</p>
      </div>

      {/* User Profile */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t("userProfile")}
            </CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input placeholder="Your name" className="mt-2 bg-input border-border/50" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input placeholder="your@email.com" type="email" className="mt-2 bg-input border-border/50" />
            </div>
            <Button className="bg-neon-green hover:bg-neon-green/90 text-background">{t("save")}</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Theme Customization */}
      <motion.div variants={itemVariants}>
        <ThemeCustomizer />
      </motion.div>

      {/* Notification Preferences */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t("notifications")}
            </CardTitle>
            <CardDescription>Manage your notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Email Notifications</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">System Alerts</label>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Weekly Reports</label>
              <input type="checkbox" className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full border-border/50 bg-transparent">
              Change Password
            </Button>
            <Button variant="outline" className="w-full border-border/50 bg-transparent">
              Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
