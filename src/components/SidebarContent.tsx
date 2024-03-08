import {Box, Flex, Heading, Text} from '@sanity/ui'
import React, {PropsWithChildren, useCallback, useState} from 'react'
import {useProjectId} from 'sanity'
import {postStepComplete} from '../data/postStepComplete'
import {Step} from '../data/types'
import {StepItem} from './StepItem'

export const SidebarContent: React.FC<
  PropsWithChildren<{
    walkthroughId: string
    header: string
    overline: string
    steps: Step[]
    completedSteps: string[]
  }>
> = ({overline, header, steps, completedSteps = [], walkthroughId}) => {
  const projectId = useProjectId()
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
      postStepComplete({projectId, walkthroughId, completedSteps: completed})
    },
    [isStepComplete],
  )
  return (
    <>
      {/* TITLE HEADER */}
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
      {/* STEPS LIST */}
      <Flex direction={'column'} gap={3} marginBottom={8} style={{position: 'relative'}}>
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
        <div
          style={{
            position: 'absolute',
            width: '0',
            left: '1.25rem',
            top: '1rem',
            bottom: '1rem',
            border: '0.5px solid var(--card-border-color, #e3e4e8)',
            zIndex: '0',
          }}
        />
      </Flex>
      {/* PERSISTENT REMOVAL CALLOUT */}
      <Box
        paddingX={3}
        paddingY={4}
        style={{
          position: 'fixed',
          bottom: '0',
          backgroundColor: 'var(--card-bg-color)',
          boxSizing: 'border-box',
          marginTop: '1rem',
          zIndex: '20',
        }}
      >
        <Text size={1} muted>
          This panel will automatically be removed in the final step of installing the Studio
          locally
        </Text>
      </Box>
    </>
  )
}
