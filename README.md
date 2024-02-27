# sanity-plugin-onboarding

> This is a **Sanity Studio v3** plugin.

## Development

Create a dummy test studio and see [this guide](https://arc.net/l/quote/paovovjp) for information about how to develop/test the plugin locally.

## Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {walkthroughPlugin} from 'sanity-plugin-onboarding'

export default defineConfig({
  //...
  plugins: [walkthoughPlugin()],
})
```

## License

[MIT](LICENSE) © Sanity

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
