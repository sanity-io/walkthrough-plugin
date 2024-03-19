import {defineEvent} from '@sanity/telemetry'

interface WalkthroughStepContext {
  stepId: string
  stepName: string
  projectId: string
}

export const QuickstartStepCompleted = defineEvent<WalkthroughStepContext>({
  name: 'Quickstart Step Completed',
  version: 1,
  description: 'User completed a step in the quickstart plugin checklist',
})

export const QuickstartPluginLoaded = defineEvent<{errorOccurred: string}>({
  name: 'Quickstart Plugin Loaded',
  version: 1,
  description: 'User logged into studio with Quickstart Plugin',
})

export const QuickstartCompleted = defineEvent<{projectId: string}>({
  name: 'Quickstart Completed',
  version: 1,
  description: 'User completed all items in the quickstart plugin checklist',
})

export const QuickstartStepClicked = defineEvent<WalkthroughStepContext & {stepCompleted: boolean}>(
  {
    name: 'Quickstart Step Clicked',
    version: 1,
    description: 'User clicked on a step in the quickstart plugin checklist',
  },
)

export const QuickstartLinkClicked = defineEvent<
  WalkthroughStepContext & {targetText: string; targetUrl: string}
>({
  name: 'Quickstart Link Clicked',
  version: 1,
  description: 'User clicked on a link in the quickstart plugin checklist',
})

export const QuickstartCodeCopied = defineEvent<WalkthroughStepContext & {copiedContent: string}>({
  name: 'Quickstart Code Copied',
  version: 1,
  description: 'User copied a code snippet in the quickstart plugin checklist',
})
