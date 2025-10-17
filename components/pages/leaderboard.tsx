"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Medal, 
  Award, 
  Download,
  User,
  Calendar,
  Recycle,
  Wallet,
  Coins
} from "lucide-react"
import { downloadCertificate } from "@/lib/certificate-utils"
import { blockchain, type Reward } from "@/lib/blockchain-simulation"

// Mock data for leaderboard
const leaderboardData = [
  { id: 1, name: "Green Warrior", points: 2450, rank: 1, badges: 12, lastActivity: "2 hours ago" },
  { id: 2, name: "Eco Hero", points: 2100, rank: 2, badges: 9, lastActivity: "5 hours ago" },
  { id: 3, name: "Recycle Master", points: 1875, rank: 3, badges: 7, lastActivity: "1 day ago" },
  { id: 4, name: "Sustainable Sam", points: 1650, rank: 4, badges: 6, lastActivity: "1 day ago" },
  { id: 5, name: "Waste Wizard", points: 1420, rank: 5, badges: 5, lastActivity: "2 days ago" },
  { id: 6, name: "Planet Protector", points: 1200, rank: 6, badges: 4, lastActivity: "3 days ago" },
  { id: 7, name: "Eco Enthusiast", points: 950, rank: 7, badges: 3, lastActivity: "4 days ago" },
  { id: 8, name: "Green Guardian", points: 725, rank: 8, badges: 2, lastActivity: "5 days ago" },
  { id: 9, name: "Sustainability Star", points: 500, rank: 9, badges: 1, lastActivity: "1 week ago" },
  { id: 10, name: "Eco Newbie", points: 250, rank: 10, badges: 1, lastActivity: "1 week ago" },
]

// Mock data for user achievements
const userAchievements = [
  { id: 1, title: "First Classification", description: "Classified your first waste item", date: "2023-05-15", points: 50 },
  { id: 2, title: "Eco Warrior", description: "Classified 10 waste items", date: "2023-05-20", points: 100 },
  { id: 3, title: "Recycling Expert", description: "Correctly identified 50 recyclable items", date: "2023-06-01", points: 200 },
  { id: 4, title: "Community Champion", description: "Shared 5 classifications with friends", date: "2023-06-10", points: 150 },
]

export default function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState("all-time")
  const [rewards, setRewards] = useState<Reward[]>([])
  const [walletBalance, setWalletBalance] = useState(0)
  const currentUser = leaderboardData[3] // Simulate current user

  // Initialize blockchain simulation
  useEffect(() => {
    // Get user rewards
    const userRewards = blockchain.getUserRewards("user-001")
    setRewards(userRewards)
    
    // Get wallet balance
    const balance = blockchain.getBalance("user-001")
    setWalletBalance(balance)
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2: return <Medal className="w-5 h-5 text-gray-400" />
      case 3: return <Award className="w-5 h-5 text-amber-700" />
      default: return <span className="text-sm font-bold">#{rank}</span>
    }
  }

  const handleDownloadCertificate = (language: 'en' | 'kn') => {
    const certificateData = {
      userName: currentUser.name,
      achievement: "Eco Warrior",
      date: new Date().toLocaleDateString(),
      points: currentUser.points,
      certificateId: `ECO-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    
    downloadCertificate(certificateData, 'html', language);
  }

  const handleClaimReward = async (rewardId: string) => {
    try {
      const transaction = blockchain.claimReward(rewardId, "user-001")
      if (transaction) {
        // Update UI
        const updatedRewards = rewards.map(r => 
          r.id === rewardId ? {...r, status: 'claimed' as const} : r
        )
        setRewards(updatedRewards)
        
        // Update balance
        const balance = blockchain.getBalance("user-001")
        setWalletBalance(balance)
        
        alert(`Reward claimed successfully! Transaction ID: ${transaction.id}`)
      }
    } catch (error) {
      console.error("Failed to claim reward:", error)
      alert("Failed to claim reward. Please try again.")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leaderboard & Rewards</h1>
        <p className="text-muted-foreground mt-1">Track your progress and compete with others in waste classification</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4 text-neon-green" />
              Your Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">#{currentUser.rank}</div>
            <p className="text-xs text-muted-foreground mt-1">Global ranking</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-neon-cyan" />
              Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{currentUser.points}</div>
            <p className="text-xs text-muted-foreground mt-1">Total points earned</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Medal className="w-4 h-4 text-neon-violet" />
              Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{currentUser.badges}</div>
            <p className="text-xs text-muted-foreground mt-1">Achievements unlocked</p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4 text-destructive" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{walletBalance.toFixed(2)} OCOIN</div>
            <p className="text-xs text-muted-foreground mt-1">Blockchain rewards</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Global Leaderboard</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={timeFilter === "week" ? "bg-neon-green/20 border-neon-green" : ""}
                  onClick={() => setTimeFilter("week")}
                >
                  This Week
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={timeFilter === "month" ? "bg-neon-green/20 border-neon-green" : ""}
                  onClick={() => setTimeFilter("month")}
                >
                  This Month
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={timeFilter === "all-time" ? "bg-neon-green/20 border-neon-green" : ""}
                  onClick={() => setTimeFilter("all-time")}
                >
                  All Time
                </Button>
              </div>
            </CardTitle>
            <CardDescription>Top contributors to waste classification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((user) => (
                <div 
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    user.id === currentUser.id 
                      ? "bg-neon-green/10 border-neon-green" 
                      : "bg-card/50 border-border/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center">
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {user.name}
                        {user.id === currentUser.id && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {user.lastActivity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.points} pts</div>
                    <div className="text-xs text-muted-foreground">{user.badges} badges</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements and Rewards */}
        <div className="space-y-6">
          <Card className="bg-card/40 backdrop-blur-md border border-border/50">
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Badges and rewards you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 bg-card/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-neon-green" />
                    </div>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {achievement.date}
                      </div>
                    </div>
                    <div className="ml-auto font-bold text-neon-green">+{achievement.points}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card className="bg-card/40 backdrop-blur-md border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-neon-cyan" />
                Blockchain Rewards
              </CardTitle>
              <CardDescription>Claim your cryptocurrency rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rewards.length > 0 ? (
                  rewards.map((reward) => (
                    <div 
                      key={reward.id} 
                      className={`p-3 rounded-lg border ${
                        reward.status === 'claimed' 
                          ? 'bg-card/50 border-border/50' 
                          : 'bg-neon-cyan/10 border-neon-cyan'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{reward.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {reward.points} points → {reward.amount.toFixed(2)} OCOIN
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={reward.status === 'claimed' ? 'outline' : 'default'}
                          className={reward.status === 'claimed' ? '' : 'bg-neon-cyan hover:bg-neon-cyan/90 text-background'}
                          onClick={() => reward.status !== 'claimed' && handleClaimReward(reward.id)}
                          disabled={reward.status === 'claimed'}
                        >
                          {reward.status === 'claimed' ? 'Claimed' : 'Claim'}
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(reward.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Coins className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No rewards available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Download Certificate */}
          <Card className="bg-card/40 backdrop-blur-md border border-border/50">
            <CardHeader>
              <CardTitle>Download Certificate</CardTitle>
              <CardDescription>Share your environmental impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-neon-green/10 to-neon-cyan/10 rounded-lg border border-neon-green/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-neon-green" />
                    <span className="font-medium">Eco Warrior Certificate</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Recognize your contribution to waste classification and environmental protection.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-neon-green hover:bg-neon-green/90 text-background"
                      onClick={() => handleDownloadCertificate('en')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      English
                    </Button>
                    <Button 
                      className="flex-1 bg-neon-cyan hover:bg-neon-cyan/90 text-background"
                      onClick={() => handleDownloadCertificate('kn')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      ಕನ್ನಡ
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}