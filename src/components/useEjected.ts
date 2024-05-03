import {useClient} from 'sanity'
import {useStep} from './StepItem'
import useSWR from 'swr'
import {useCallback, useEffect} from 'react'
import {useTelemetry} from '@sanity/telemetry/react'
import {QuickstartStepCompleted} from '../data/telemetry'

export function useEjected(toggleComplete: () => void) {
  //   Use the sanity client to determine whether we're on a staging
  //  or production project
  const client = useClient()
  const isStaging = client.getUrl('').includes('work')

  const {stepName, isComplete, projectId, stepId, slug} = useStep()
  const telemetry = useTelemetry()

  const {data, isLoading} = useSWR(
    'project-cli-ejected',
    () =>
      fetch(`https://api.sanity.${isStaging ? 'work' : 'io'}/v1/projects/${projectId}`, {
        credentials: 'include',
      }).then((resp) => resp.json()),
    //   Poll the endpoint every 5 minutes
    {refreshInterval: 300000},
  )
  const isEjected = data?.metadata?.cliInitializedAt

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
    if (slug === 'eject-with-cli' && !isLoading && isEjected) {
      markComplete()
    }
  }, [slug, isLoading, isEjected, markComplete])
}
