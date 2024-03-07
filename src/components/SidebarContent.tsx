import {Flex, Heading, Text} from '@sanity/ui'
import React, {PropsWithChildren, useCallback, useState} from 'react'
import {Step} from '../data/types'
import {StepItem} from './StepItem'

export const SidebarContent: React.FC<
  PropsWithChildren<{header: string; overline: string; steps: Step[]; completedSteps: string[]}>
> = ({overline, header, steps, completedSteps = []}) => {
  const [completed, setCompleted] = useState(completedSteps)
  const isStepComplete = useCallback(
    (id: string) => {
      return completed.includes(id)
    },
    [completed],
  )
  const toggleComplete = useCallback(
    (id: string) => {
      const isCompleted = isStepComplete(id)
      if (isCompleted) {
        setCompleted((x) => x.filter((s) => s !== id))
      } else {
        setCompleted((x) => {
          x.push(id)
          return [...x]
        })
      }
    },
    [isStepComplete],
  )
  return (
    <>
      <Flex direction={'column'} gap={4} padding={3}>
        <Flex>
          <Text size={1} weight="semibold">
            {overline}
          </Text>
        </Flex>
        <Flex paddingBottom={3}>
          <Heading size={2} as={'h1'}>
            {header}
          </Heading>
        </Flex>
      </Flex>

      <Flex direction={'column'} gap={3}>
        {steps.map((s, index) => {
          const isComplete = index == 0 || isStepComplete(s._id)
          const isPreviousComplete = index == 1 || isStepComplete(steps[Math.max(index - 1, 0)]._id)
          return (
            <StepItem
              key={s._id}
              {...s}
              startOpen={isPreviousComplete && !isComplete}
              isComplete={isComplete}
              toggleComplete={toggleComplete}
              disableExpansion={index == 0}
            />
          )
        })}
      </Flex>
    </>
  )
}
