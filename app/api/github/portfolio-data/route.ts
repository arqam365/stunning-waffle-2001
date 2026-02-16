import { NextResponse } from 'next/server'

// This will store your cached data in memory
// In production, use Redis, Vercel KV, or a database
let cachedData: any = null
let lastFetchTime: number = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function GET() {
    try {
        const now = Date.now()

        // Check if we have valid cached data
        if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
            console.log('Returning cached portfolio data')
            return NextResponse.json({
                ...cachedData,
                cached: true,
                lastUpdated: new Date(lastFetchTime).toISOString(),
                nextUpdate: new Date(lastFetchTime + CACHE_DURATION).toISOString()
            })
        }

        // Fetch fresh data using your personal access token
        console.log('Fetching fresh portfolio data from GitHub...')

        if (!process.env.GITHUB_PERSONAL_TOKEN) {
            throw new Error('GITHUB_PERSONAL_TOKEN not configured')
        }

        const query = `
      query {
        viewer {
          login
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
            restrictedContributionsCount
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            totalRepositoryContributions
          }
          repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
            totalCount
            nodes {
              name
              isPrivate
              isFork
              owner {
                login
              }
            }
          }
          pullRequests(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
            totalCount
          }
          issues(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
            totalCount
          }
        }
      }
    `

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_PERSONAL_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        })

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`)
        }

        const data = await response.json()

        if (data.errors) {
            console.error('GraphQL errors:', data.errors)
            throw new Error(data.errors[0]?.message || 'GraphQL query failed')
        }

        if (!data.data || !data.data.viewer) {
            throw new Error('Invalid response structure from GitHub')
        }

        // Cache the data
        cachedData = data
        lastFetchTime = now

        console.log('Portfolio data fetched and cached successfully')

        return NextResponse.json({
            ...data,
            cached: false,
            lastUpdated: new Date(lastFetchTime).toISOString(),
            nextUpdate: new Date(lastFetchTime + CACHE_DURATION).toISOString()
        })

    } catch (error) {
        console.error('Error fetching portfolio data:', error)

        // If we have cached data, return it even if expired
        if (cachedData) {
            console.log('Returning stale cached data due to error')
            return NextResponse.json({
                ...cachedData,
                cached: true,
                stale: true,
                error: error instanceof Error ? error.message : 'Unknown error',
                lastUpdated: new Date(lastFetchTime).toISOString()
            })
        }

        return NextResponse.json(
            {
                error: 'Failed to fetch portfolio data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

// Optional: Add a route to manually refresh the cache
export async function POST() {
    try {
        // Reset cache
        cachedData = null
        lastFetchTime = 0

        // Fetch fresh data
        const result = await GET()
        return result
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to refresh cache' },
            { status: 500 }
        )
    }
}