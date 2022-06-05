# cat-bot

https://twitter.com/daily_cat_bot

Twitter bot that tweets images from a S3 bucket on a defined time interval

## Local Development

### Prerequisites

Setup `node`:
```
nvm install 14.19.2
nvm use 14.19.2
```
Setup `direnv`:
- https://github.com/direnv/direnv
- Windows specific steps: https://gist.github.com/rmtuckerphx/4ace28c1605300462340ffa7b7001c6d

Setup local environment variables:
1. Using the sample, create your `.envrc` file (don't commit this!):
    ```
    cp .envrc_sample .envrc
    ```
2. Edit your `.envrc` file by replacing `add_me` with your desired values
3. Load your environment:
    ```
    direnv allow
    ```

### Scripts
Running the lambda locally:
```
npm run dev-test
```

Running the unit tests:
```
npm t
```

Running the linter:
```
npm run lint
```

### Docs to read:
- Twitter dev docs: https://developer.twitter.com/en/docs/platform-overview
- Reference to setup List/Get/Put S3 permissions: https://github.com/serverless/examples/blob/master/aws-node-fetch-file-and-store-in-s3/serverless.yml
- Node.js and the AWS SDK: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html
