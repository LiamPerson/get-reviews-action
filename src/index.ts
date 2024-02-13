import * as core from '@actions/core'
import { ReviewResponse } from './types'
require('dotenv').config() // Only used in dev!!!

const accessToken = core.getInput() || process.env.GITHUB_TOKEN
const pullRequestId = process.env.PULL_REQUEST_ID
const githubRepository = process.env.GITHUB_REPOSITORY

if (!accessToken)
	throw new Error(
		'No "GITHUB_TOKEN" provided. Please ensure you have passed through the `GITHUB_TOKEN` in the GitHub Action calling this custom action.'
	)
if (!pullRequestId)
	throw new Error(
		'No "PULL_REQUEST_ID" provided. Please ensure you have passed through the `PULL_REQUEST_ID` in the GitHub Action calling this custom action.'
	)
if (!githubRepository)
	throw new Error(
		'No "GITHUB_REPOSITORY" provided. Please ensure you have passed through the `GITHUB_REPOSITORY` in the GitHub Action calling this custom action.'
	)

const run = async () => {
	const response = await fetch(`https://api.github.com/repos/${githubRepository}/pulls/${pullRequestId}/reviews`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
	})
	if (response.status === 401) {
		throw new Error(
			`Unauthorized: Failed to get reviews. The provided access token does not have the authority to access the reviews at ${githubRepository}`
		)
	}
	const reviews = (await response.json()) as ReviewResponse[]
	const approvals = reviews.filter((review) => review.state === 'APPROVED').map((review) => review.user.login)
	console.log('approvals', approvals)
	core.setOutput('approvals', JSON.stringify(approvals))
}

run()
