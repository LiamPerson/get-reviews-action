# What does it do?

Dumps to a JSON file, all the reviews associated with a specified pull request from the GitHub API.

## Usage

Simply add the action to your GitHub Action / Workflow.

```yaml
- name: Get GitHub Pull Request Reviewers
  # Versions come from https://github.com/LiamPerson/get-reviews-action/releases
  uses: LiamPerson/get-reviews-action@SPECIFY_ME # Specify the version you want by writing in a tag from the link above. E.g: v1.0
```

The output will be a file called `reviews.json` in the root of your repository.

### Types

The types in this JSON file are defined here: [Please see `ReviewResponse` type.](./src/types.ts)

## Gotchas

Please ensure that you run this action _AFTER_ any action that would modify files in the working directory as such actions may end up deleting the output from this action!

Such actions include: `actions/checkout@v2`!

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
