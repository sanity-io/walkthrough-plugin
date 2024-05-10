import {useCallback, useEffect} from 'react'
import {useClient} from 'sanity'
import {useStep} from './StepItem'
import {Subscription} from 'rxjs'
import useSWR from 'swr'
import {useTelemetry} from '@sanity/telemetry/react'
import {QuickstartStepCompleted} from '../data/telemetry'

export function usePublishedDocument(toggleComplete: () => void) {
  const client = useClient()
  const {stepName, isComplete, projectId, stepId, slug} = useStep()
  const {data: projectDocuments, isLoading} = useSWR('project-documents', () =>
    client.fetch('*[!(_type match "system.**") && !(_id match "drafts.")]{}'),
  )
  const telemetry = useTelemetry()

  const markComplete = useCallback(() => {
    if (!isComplete) {
      toggleComplete()
      // Run tracking
      telemetry.log(QuickstartStepCompleted, {
        projectId,
        stepId,
        stepName,
      })
    }
  }, [telemetry, isComplete, stepId, stepName, projectId, toggleComplete])

  useEffect(() => {
    let subscription: Subscription | undefined
    if (slug === 'publish-a-document' && !isLoading) {
      if (projectDocuments?.length) {
        markComplete()
      } else {
        subscription = client
          .listen('*[!(_type match "system.**") && !(_id match "drafts.")]{}')
          .subscribe((update) => {
            if (update.result) {
              markComplete()
            }
          })
      }
    }

    return () => {
      if (subscription) subscription.unsubscribe()
    }
  }, [client, slug, markComplete, isLoading, projectDocuments])
}
