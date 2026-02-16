import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        console.log('Session:', session ? 'Authenticated' : 'Not authenticated')

        if (!session?.accessToken) {
            return NextResponse.json(
                { error: 'Not authenticated', details: 'No access token in session' },
                { status: 401 }
            )
        }

        console.log('Access token present:', !!session.accessToken)

        // Corrected GraphQL query - removed invalid 'privacy' parameter
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

        console.log('Making request to GitHub GraphQL API...')

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        })

        console.log('GitHub API response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('GitHub API error:', errorText)
            return NextResponse.json(
                {
                    error: 'GitHub API request failed',
                    status: response.status,
                    details: errorText
                },
                { status: response.status }
            )
        }

        const data = await response.json()

        console.log('GitHub API response received')

        // Log for debugging
        if (data.errors) {
            console.error('GraphQL errors:', JSON.stringify(data.errors, null, 2))
            return NextResponse.json(
                {
                    error: 'GraphQL query failed',
                    details: data.errors,
                    message: data.errors[0]?.message || 'Unknown GraphQL error'
                },
                { status: 500 }
            )
        }

        if (!data.data || !data.data.viewer) {
            console.error('Invalid response structure:', JSON.stringify(data, null, 2))
            return NextResponse.json(
                {
                    error: 'Invalid response structure',
                    details: 'Missing data.viewer in response',
                    received: data
                },
                { status: 500 }
            )
        }

        console.log('Success! Returning data for user:', data.data.viewer.login)

        return NextResponse.json(data)
    } catch (error) {
        console.error('Unexpected error in API route:', error)
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        )
    }
}