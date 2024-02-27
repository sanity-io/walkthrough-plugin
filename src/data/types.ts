import {PortableTextBlock} from 'sanity'

export type Walkthrough = {
  _id: string
  completedSteps: string[]
  pluginVersion: string
  flow: {
    _id: string
    name: string
    header: string
    overline: string
    steps: {
      _id: string
      title: string
      icon: string
      badge: string
      content: PortableTextBlock
    }
  }
}

export interface ResponseError extends Error {
  status?: number
  info?: Record<string, unknown>
}
