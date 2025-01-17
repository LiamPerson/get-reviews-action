import * as core from '@actions/core'
import { ReviewResponse } from './types'
import { writeFileSync } from 'node:fs'
require('dotenv').config() // Only used in dev!!!

type FailureResponse = {
	message: string
	documentation_url: string
}

const accessToken = core.getInput('GITHUB_TOKEN') || process.env.GITHUB_TOKEN
const pullRequestId = core.getInput('PULL_REQUEST_ID') || process.env.PULL_REQUEST_ID
const githubRepository = core.getInput('GITHUB_REPOSITORY') || process.env.GITHUB_REPOSITORY
const filename = core.getInput('FILE_NAME_OVERRIDE') || 'reviews.json'
const maximumPages = Number(core.getInput('MAXIMUM_PAGES_TO_QUERY')) || 100

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

const getReviewData = async () => {
	let hasMoreData = true
	const limit = 100
	const reviews = []
	for (let page = 1; page <= maximumPages && hasMoreData; page++) {
		const response = await fetch(
			`https://api.github.com/repos/${githubRepository}/pulls/${pullRequestId}/reviews?per_page=${limit}&page=${page}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		)
		if (response.status === 401) {
			throw new Error(
				`Unauthorized: Failed to get reviews. The provided access token does not have the authority to access the reviews at ${githubRepository}`
			)
		}
		const fetchedReviews = (await response.json()) as ReviewResponse[] | FailureResponse

		// Catch failed requests. E.g: failed permissions
		if ('message' in fetchedReviews) {
			throw new Error(`Failed to get reviews: ${fetchedReviews.message}. For more information, see: ${fetchedReviews.documentation_url}`)
		}

		// Check if there are more reviews to get. If we didn't get the full limit, it means there are no more pages and we can exit.
		if (fetchedReviews.length < limit) {
			hasMoreData = false
		}

		reviews.push(...fetchedReviews)
	}

	return reviews
}

const run = async () => {
	const reviews = await getReviewData()

	// Write the json to a file
	console.log('Successfully got all reviews. Dumping all data to: ', filename)
	writeFileSync(filename, JSON.stringify(reviews, null, 2))
	console.log('Successfully dumped all data to: ', filename)
	core.setOutput('reviews_file_path', filename)
}

run()
