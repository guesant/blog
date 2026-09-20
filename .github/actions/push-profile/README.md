# Push profile README

This action reads the public profile and resume data from the Laravel `public-site` API and writes a deterministic Markdown README in the consuming repository.

```yaml
- uses: guesant/portfolio/.github/actions/push-profile@main
  with:
    api-url: https://guesant.net/api/v1/public-site
    locale: en
    output: README.md
```

The API response is public and does not require a token. The optional `email` input is not populated automatically because the generated README is public.
