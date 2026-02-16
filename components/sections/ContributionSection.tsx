'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { GitBranch, GitCommit, Users, Globe, LogIn, LogOut, AlertCircle, Play, Sparkles, RefreshCw } from 'lucide-react'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface GitHubStats {
  totalContributions: number
  privateContributions: number
  publicContributions: number
  publicRepos: number
  privateRepos: number
  forkedRepos: number
  totalPullRequests: number
  totalIssues: number
  commitContributions: number
  currentStreak: number
  longestStreak: number
  lastUpdated?: string
  nextUpdate?: string
}

export function ContributionSection() {
  const { data: session, status } = useSession()
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playgroundMode, setPlaygroundMode] = useState(false)
  const [stats, setStats] = useState<GitHubStats>({
    totalContributions: 0,
    privateContributions: 0,
    publicContributions: 0,
    publicRepos: 0,
    privateRepos: 0,
    forkedRepos: 0,
    totalPullRequests: 0,
    totalIssues: 0,
    commitContributions: 0,
    currentStreak: 0,
    longestStreak: 0,
  })

  useEffect(() => {
    async function fetchGitHubData() {
      setLoading(true)
      setError(null)

      if (playgroundMode && session?.accessToken) {
        // Playground mode - fetch visitor's data
        await fetchUserData()
      } else {
        // Portfolio mode - fetch cached portfolio owner data
        await fetchPortfolioData()
      }

      setLoading(false)
    }

    async function fetchPortfolioData() {
      try {
        const response = await fetch('/api/github/portfolio-data')

        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data')
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        console.log('Portfolio data loaded:', data.cached ? 'from cache' : 'fresh')

        processGitHubData(data.data.viewer, data.lastUpdated, data.nextUpdate)

      } catch (error) {
        console.error('Error fetching portfolio data:', error)
        setError('Failed to load portfolio data')
      }
    }

    async function fetchUserData() {
      try {
        const response = await fetch('/api/github/contributions')

        if (!response.ok) {
          throw new Error('Failed to fetch your data')
        }

        const data = await response.json()

        if (data.error || !data.data || !data.data.viewer) {
          throw new Error(data.error || 'Invalid response')
        }

        console.log('User data loaded')

        processGitHubData(data.data.viewer)

      } catch (error) {
        console.error('Error fetching user data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load your data')
      }
    }

    function processGitHubData(viewer: any, lastUpdated?: string, nextUpdate?: string) {
      const collection = viewer.contributionsCollection
      const calendar = collection.contributionCalendar

      // Process contribution calendar
      const contributionData: ContributionDay[] = []

      if (calendar.weeks && Array.isArray(calendar.weeks)) {
        calendar.weeks.forEach((week: any) => {
          if (week.contributionDays && Array.isArray(week.contributionDays)) {
            week.contributionDays.forEach((day: any) => {
              let level = 0
              const count = day.contributionCount || 0

              if (count > 0) level = 1
              if (count >= 3) level = 2
              if (count >= 6) level = 3
              if (count >= 10) level = 4

              contributionData.push({
                date: day.date,
                count: count,
                level,
              })
            })
          }
        })
      }

      setContributions(contributionData)

      const { currentStreak, longestStreak } = calculateStreaks(contributionData)

      const repos = viewer.repositories?.nodes || []
      const publicRepos = repos.filter((r: any) => !r.isPrivate && !r.isFork).length
      const privateRepos = repos.filter((r: any) => r.isPrivate).length
      const forkedRepos = repos.filter((r: any) => r.isFork).length

      const totalContribs = calendar.totalContributions || 0
      const privateContribs = collection.restrictedContributionsCount || 0
      const publicContribs = totalContribs - privateContribs

      setStats({
        totalContributions: totalContribs,
        privateContributions: privateContribs,
        publicContributions: publicContribs,
        publicRepos,
        privateRepos,
        forkedRepos,
        totalPullRequests: viewer.pullRequests?.totalCount || 0,
        totalIssues: viewer.issues?.totalCount || 0,
        commitContributions: collection.totalCommitContributions || 0,
        currentStreak,
        longestStreak,
        lastUpdated,
        nextUpdate,
      })
    }

    fetchGitHubData()
  }, [session, playgroundMode])

  const calculateStreaks = (data: ContributionDay[]) => {
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = data.length - 1; i >= 0; i--) {
      const day = data[i]
      const dayDate = new Date(day.date)
      dayDate.setHours(0, 0, 0, 0)

      const daysDiff = Math.floor((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24))

      if (day.count > 0 && daysDiff === currentStreak) {
        currentStreak++
      } else if (daysDiff > currentStreak) {
        break
      }
    }

    data.forEach(day => {
      if (day.count > 0) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    })

    return { currentStreak, longestStreak }
  }

  const groupByWeeks = (data: ContributionDay[]) => {
    const weeks: ContributionDay[][] = []
    let currentWeek: ContributionDay[] = []

    data.forEach((day) => {
      currentWeek.push(day)

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }


  const handlePlaygroundToggle = () => {
    if (!session) {
      signIn('github', {
        callbackUrl: `${window.location.origin}?playground=true`,
      })
    } else {
      signOut({
        callbackUrl: window.location.origin,
      })
    }
  }

  const weeks = groupByWeeks(contributions)

  const colors = {
    0: 'bg-muted/20',
    1: 'bg-accent/30',
    2: 'bg-accent/50',
    3: 'bg-accent/70',
    4: 'bg-accent',
  }

  const inPlaygroundMode = playgroundMode && session

  const primaryStats = [
    {
      icon: GitCommit,
      label: 'Public Contributions',
      value: stats.publicContributions.toLocaleString(),
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: GitBranch,
      label: 'Private Contributions',
      value: stats.privateContributions.toLocaleString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Users,
      label: 'Public Repositories',
      value: stats.publicRepos.toLocaleString(),
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Globe,
      label: 'Private Repositories',
      value: stats.privateRepos.toLocaleString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  const secondaryStats = [
    {
      label: 'Pull Requests',
      value: stats.totalPullRequests.toLocaleString(),
    },
    {
      label: 'Issues',
      value: stats.totalIssues.toLocaleString(),
    },
    {
      label: 'Commits',
      value: stats.commitContributions.toLocaleString(),
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
    },
    {
      label: 'Longest Streak',
      value: `${stats.longestStreak} days`,
    },
  ]

  return (
      <section id="contributions" className="relative py-24 md:py-32 bg-card">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="mb-12">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
                <div className="flex-1">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    GitHub <span className="text-accent">Activity</span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {loading ? (
                        'Loading contribution data...'
                    ) : inPlaygroundMode ? (
                        <>Your {stats.totalContributions.toLocaleString()} contributions ({stats.publicContributions.toLocaleString()} public, {stats.privateContributions.toLocaleString()} private) across {stats.publicRepos + stats.privateRepos} repositories.</>
                    ) : (
                        <>{stats.totalContributions.toLocaleString()} contributions ({stats.publicContributions.toLocaleString()} public, {stats.privateContributions.toLocaleString()} private) in the last year across {stats.publicRepos + stats.privateRepos} repositories.</>
                    )}
                  </p>
                  {!loading && stats.lastUpdated && !inPlaygroundMode && (
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                        <RefreshCw className="w-3 h-3" />
                        Last updated: {new Date(stats.lastUpdated).toLocaleDateString()} •
                        Auto-refreshes every 24 hours
                      </p>
                  )}
                </div>

                {/* Playground Toggle */}
                {inPlaygroundMode && (
                    <button
                        onClick={handlePlaygroundToggle}
                        className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all duration-300 font-medium whitespace-nowrap"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Exit Playground</span>
                    </button>
                )}
              </div>

              {/* Mode Indicator */}
              {inPlaygroundMode && (
                  <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/30 rounded-lg p-4 flex items-center gap-3">
                    <Play className="w-5 h-5 text-accent flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-accent">🎮 Playground Mode Active</p>
                      <p className="text-xs text-muted-foreground">
                        You're viewing your own GitHub statistics. Click "Exit Playground" to return to the portfolio.
                      </p>
                    </div>
                  </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-500 mb-1">Error Loading Data</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
            )}

            {/* Primary Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {primaryStats.map((stat, index) => (
                  <div
                      key={index}
                      className="group bg-background border border-border rounded-lg p-6 hover:border-accent/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
              ))}
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {secondaryStats.map((stat, index) => (
                  <div
                      key={index}
                      className="bg-background border border-border rounded-lg p-4 hover:border-accent/30 transition-all duration-300"
                  >
                    <div className="text-xl font-bold text-accent mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
              ))}
            </div>

            {/* Contribution Graph */}
            <div className="bg-background border border-border rounded-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Contribution Graph</h3>
                <div className="text-sm text-muted-foreground">
                  Last 12 months
                </div>
              </div>

              {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-pulse text-muted-foreground">Loading contributions...</div>
                  </div>
              ) : contributions.length > 0 ? (
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-1 min-w-max">
                      {weeks.map((week, weekIndex) => (
                          <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((day, dayIndex) => {
                              const date = new Date(day.date)
                              const formattedDate = date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })

                              return (
                                  <div
                                      key={`${weekIndex}-${dayIndex}`}
                                      className={`w-3 h-3 rounded-sm ${colors[day.level as keyof typeof colors]} hover:ring-2 hover:ring-accent hover:scale-125 transition-all cursor-pointer`}
                                      title={`${formattedDate}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                                  />
                              )
                            })}
                          </div>
                      ))}
                    </div>
                  </div>
              ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    No contribution data available
                  </div>
              )}

              {/* Legend */}
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                        <div
                            key={level}
                            className={`w-3 h-3 rounded-sm ${colors[level as keyof typeof colors]}`}
                        />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">More</span>
                </div>
                <a
                    href="https://github.com/Bilal2001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline font-medium text-sm flex items-center gap-2 group"
                >
                  View on GitHub
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

            {/* Playground CTA - Only show when NOT in playground mode */}
            {!inPlaygroundMode && (
                <div className="relative overflow-hidden bg-gradient-to-br from-accent/20 via-primary/10 to-accent/20 border-2 border-accent/40 rounded-xl p-8">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-accent/40">
                        <Sparkles className="w-8 h-8 text-accent" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold">Try It Yourself!</h3>
                        <span className="px-2 py-1 bg-accent text-background text-xs font-semibold rounded-full">
                      Interactive
                    </span>
                      </div>
                      <p className="text-muted-foreground mb-4 max-w-2xl">
                        Want to see your own GitHub contribution stats? Enter playground mode and sign in with GitHub to explore your personal activity, including private contributions, repositories, pull requests, and more!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handlePlaygroundToggle}
                            className="group px-6 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <Play className="w-5 h-5" />
                          <span>Launch Playground</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground px-4">
                          <LogIn className="w-4 h-4" />
                          <span>Sign in with GitHub • Free • No data stored</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </section>
  )
}