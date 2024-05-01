import {usePublishedDocument} from './usePublishedDocument'

export function StepAutoCompletion({onStepCompletion}: {onStepCompletion: () => void}) {
  usePublishedDocument(onStepCompletion)
  return <></>
}
