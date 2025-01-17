import { readFileSync } from 'fs'

// Get approvers & review info
const reviewsFile = readFileSync('./reviews.json')
console.log('Got reviews file. Checking for reviews!')
const reviews = JSON.parse(reviewsFile.toString())
console.log('Got reviews!', reviews)
console.log('Checking for approvals ...')
const approvers = reviews.filter((review) => review.state === 'APPROVED').map((review) => review.user.login)
const approversUnique = [...new Set(approvers)]

console.log('Approvers', approversUnique)
