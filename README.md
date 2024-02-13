# get-reviews-action

Gets the reviews associated with a specified pull request from the GitHub API

# Developers

To test this action simply:

1. Add the following to your `.env` file:

```sh
GITHUB_TOKEN=your_github_token
GITHUB_REPOSITORY=some/repository
PULL_REQUEST_ID=1337 # or some other pull request id
```

2. Run the following command:

```bash
npx ts-node src/index.ts
```
