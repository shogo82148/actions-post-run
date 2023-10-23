# Post Run Action

[![build-test](https://github.com/shogo82148/actions-post-run/actions/workflows/test.yml/badge.svg)](https://github.com/shogo82148/actions-post-run/actions/workflows/test.yml)

A simple GitHub action that allows you to execute commands on place and in post-run, once a workflow job has ended.

## Usage

```yaml
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - uses: shogo82148/actions-post-run
        with:
          post: |
            echo "Some scripts, once a workflow job has ended."
      - run: echo "some other scripts"
```
