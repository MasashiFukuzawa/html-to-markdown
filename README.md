# Html To Markdown

<img src="https://img.shields.io/crates/l/bat.svg" alt="license">

## Setup

```sh
git clone git@github.com:MasashiFukuzawa/html-to-markdown.git
cd html-to-markdown
okteto up api
curl http://localhost:8080/api\?url\="https://github.com" -H 'Content-Type: application/json'
```

Enjoy!

### Prerequisites

- You must have an Okteto account.
- You must be able to run the Okteto CLI locally

### Commands

```sh
okteto deploy --build --wait
```

## Reference

This API is running on [okteto](https://www.okteto.com/), and implemented the base part with reference to the following repositories.

https://github.com/okteto/movies-with-compose
