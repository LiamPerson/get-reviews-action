# What does it do?

Dumps to a JSON file, all the reviews associated with a specified pull request from the GitHub API.

## Usage

Simply add the action to your GitHub Action / Workflow.

```yaml
- name: Get GitHub Pull Request Reviewers
  uses: LiamPerson/get-reviews-action@v1.1
```

The output will be a file called `reviews.json` in the root of your repository.

### Types

The types in this JSON file are defined here: [Please see `ReviewResponse` type.](./src/types.ts)

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
