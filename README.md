# cat-bot

Twitter bot that tweets images from a S3 bucket on a defined time interval

## Ideas

### v1
- Source of images will be S3
    - Scrub image metadata

### v2
- Have a staging folder for photos awaiting to be flagged as safe to upload

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

### How to Run

```
npm run dev-test
```


### Docs to read:
- Twitter dev docs: https://developer.twitter.com/en/docs/platform-overview