import {useEjected} from './useEjected'
import {useInvitedMembers} from './useInvitedMember'
import {usePublishedDocument} from './usePublishedDocument'

export function StepAutoCompletion({onStepCompletion}: {onStepCompletion: () => void}) {
  usePublishedDocument(onStepCompletion)
  useInvitedMembers(onStepCompletion)
  useEjected(onStepCompletion)
  return null
}
