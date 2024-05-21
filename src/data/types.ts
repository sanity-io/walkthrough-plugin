import {PortableTextBlock} from 'sanity'

export type Step = {
  _id: string
  title: string
  subtitle: string
  slug: string
  icon: string
  badge: string
  content: PortableTextBlock
}

export type Flow = {
  _id: string
  name: string
  header: string
  overline: string
  footer: string
  steps: Step[]
}

export type Walkthrough = {
  _id: string
  completedSteps: string[]
  pluginVersion: string
  flow: Flow
}

export interface ResponseError extends Error {
  status?: number
  info?: Record<string, unknown>
}
