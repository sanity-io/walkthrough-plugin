import {definePlugin} from 'sanity'
import {ActiveToolLayout} from './ActiveToolLayout'

export const walkthroughPlugin = definePlugin(() => {
  return {
    name: 'sanity-plugin-walkthrough',
    studio: {
      components: {
        activeToolLayout: ActiveToolLayout,
      },
    },
  }
})
