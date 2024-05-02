import {useClient} from 'sanity'
import {useStep} from './StepItem'
import useSWR from 'swr'
import {useCallback, useEffect} from 'react'
import {useTelemetry} from '@sanity/telemetry/react'
import {QuickstartStepCompleted} from '../data/telemetry'

export function useInvitedMembers(toggleComplete: () => void) {
  //   Use the sanity client to determine whether we're on a staging
  //  or production project
  const client = useClient()
  const isStaging = client.getUrl('').includes('work')

  const {stepName, isComplete, projectId, stepId} = useStep()
  const telemetry = useTelemetry()

  const {data: invitedMembers, isLoading} = useSWR(
    'invited-members',
    () =>
      fetch(`https://api.sanity.${isStaging ? 'work' : 'io'}/vX/invitations/project/${projectId}`, {
        credentials: 'include',
      }).then((resp) => resp.json()),
    //   Poll the endpoint every 5 minutes
    {refreshInterval: 300000},
  )
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
    if (stepName === 'Invite a team member' && !isLoading && invitedMembers?.length) {
      markComplete()
    }
  }, [stepName, isLoading, invitedMembers, markComplete])
}
