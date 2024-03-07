import {Flex, Heading, Text} from '@sanity/ui'
import React, {PropsWithChildren} from 'react'
import {Step} from '../data/types'
import {StepItem} from './StepItem'

export const SidebarContent: React.FC<
  PropsWithChildren<{header: string; overline: string; steps: Step[]}>
> = ({overline, header, steps}) => {
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
        {steps.map((s, index) => (
          <StepItem key={s._id} {...s} startOpen={false} isComplete={index == 0 || false} />
        ))}
      </Flex>
    </>
  )
}
