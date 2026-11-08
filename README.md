# blog

Hugo site for [blog.guesant.net](https://blog.guesant.net), using [Typo](https://github.com/tomfran/typo).

Requires Docker and Compose. See [Tooling](docs/tooling.md) for the quality checks and image pins.

The build publishes `lobby.json`, a static public index consumed by the Lobby at build time. Markdown remains the editorial source. Entries expose only title, plain-text summary, language, canonical URL, tags, categories and dates. Drafts, future, expired, private, disabled and explicitly nonpublic posts are excluded.

Use `content_id` for an identifier that survives file moves, `language` for the content language and `editorial_type: case` for a project case. Without `content_id`, the identifier is derived from the source path. The check command verifies the export with isolated fixtures.

```sh
docker compose -f .docker/compose.yaml run --build --rm --service-ports hugo
docker compose -f .docker/compose.yaml run --build --rm --entrypoint just hugo check
```
