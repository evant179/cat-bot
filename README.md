# cat-bot

## Ideas

### v1
- Twitter bot that automatically uploads images from a source on a defined time interval
- Source of images will be S3

### v2
- Have a staging folder for photos awaiting to be flagged as safe to upload

## Implementation Details
- Scrub image metadata

## Local Development

### Prerequisites

Setup `node`:
```
nvm install 13.14.0
nvm use 13.14.0
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

TODO
