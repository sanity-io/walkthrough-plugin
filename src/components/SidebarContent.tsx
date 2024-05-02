import {useTelemetry} from '@sanity/telemetry/react'
import {Box, Button, Card, Code, Flex, Heading, Stack, Text, useToast} from '@sanity/ui'
import React, {PropsWithChildren, useCallback, useState} from 'react'
import {useClient, useProjectId} from 'sanity'
import {QuickstartCodeCopied, QuickstartCompleted, QuickstartStepCompleted} from '../data/telemetry'
import {Step} from '../data/types'
import {StepItem} from './StepItem'
import {CheckmarkIcon, ClipboardIcon} from '@sanity/icons'
import CopyToClipboard from 'react-copy-to-clipboard'

const ACTIVE_STEP = 'walkthrough-plugin:activeStep'

export const SidebarContent: React.FC<
  PropsWithChildren<{
    walkthroughId: string
    header: string
    overline: string
    footer: string
    steps: Step[]
    completedSteps: string[]
  }>
> = ({overline, header, footer, steps, completedSteps = [], walkthroughId}) => {
  const projectId = useProjectId()
  const client = useClient({apiVersion: 'v2024-02-23'})
  const telemetry = useTelemetry()

  const [completed, setCompleted] = useState(completedSteps)
  const [activeStep, setActiveStep] = useState<string>(
    localStorage.getItem(ACTIVE_STEP) ||
      steps.map((s) => s._id).filter((id) => !completed.includes(id))[1],
  )

  const isStepComplete = useCallback(
    (id: string) => {
      return completed.includes(id)
    },
    [completed],
  )

  const toggleOpen = useCallback(
    (id: string) => {
      if (activeStep == id) {
        localStorage.setItem(ACTIVE_STEP, '')
        setActiveStep('')
      } else {
        localStorage.setItem(ACTIVE_STEP, id)
        setActiveStep(id)
      }
    },
    [activeStep],
  )

  const toggleComplete = useCallback(
    (id: string) => {
      const isCompleted = isStepComplete(id)
      let newCompletedSteps = [...completed]

      if (isCompleted) {
        newCompletedSteps = newCompletedSteps.filter((s) => s !== id)
      } else {
        newCompletedSteps.push(id)
        telemetry.log(QuickstartStepCompleted, {
          projectId,
          stepId: id,
          stepName: steps.find((s) => s._id == id)?.title,
        })

        // +1 because first step is always complete
        if (newCompletedSteps.length++ === steps.length)
          telemetry.log(QuickstartCompleted, {projectId})
      }
      setCompleted(newCompletedSteps)

      client.request({
        uri: `/journey/walkthroughs/${projectId}/${walkthroughId}`,
        method: 'post',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {completedSteps: newCompletedSteps.filter(Boolean)},
      })
    },
    [isStepComplete, completed, steps],
  )
  return (
    <Box style={{overflowY: 'scroll', height: '100%'}} id="step-scroll-container">
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
          let nextId
          if (index + 1 <= steps.length - 1) nextId = steps[index + 1]._id
          return (
            <StepItem
              key={s._id}
              {...s}
              nextId={nextId}
              open={activeStep == s._id}
              isComplete={isComplete}
              toggleComplete={toggleComplete}
              toggleOpen={toggleOpen}
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
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          backgroundColor: 'var(--card-bg-color)',
          boxSizing: 'border-box',
          zIndex: '20',
          borderTop: '0.5px solid var(--card-border-color)',
        }}
      >
        <Stack space={4}>
          <Text size={1} muted>
            {footer}
          </Text>
          <CopyableCodeBlock />
        </Stack>
      </Box>
    </Box>
  )
}

function CopyableCodeBlock() {
  const toast = useToast()
  const projectId = useProjectId()
  const [isCopied, setCopied] = useState(false)
  const telemetry = useTelemetry()
  const sanitizedCodeSnippet = `npm create sanity@latest -- --quickstart "h5kquzzf"`.replaceAll(
    '{{PROJECT_ID}}',
    `"${projectId}"`,
  )
  const onCopy = (text: string) => {
    setCopied(true)
    setTimeout(() => setCopied(false), 5000)
    toast.push({
      status: 'info',
      title: 'Command copied',
      description:
        'Open your terminal. Paste and run the command, and follow the instructions from there. ',
    })
    telemetry.log(QuickstartCodeCopied, {
      projectId,
      stepId: 'footer',
      stepName: 'footer',
      copiedContent: text,
    })
  }
  return (
    <CopyToClipboard text={sanitizedCodeSnippet} onCopy={onCopy}>
      <Card
        radius={2}
        style={{
          boxSizing: 'border-box',
          cursor: 'pointer',
          backgroundColor: 'var(--card-code-bg-color, #f6f6f8)',
        }}
        className="hover:opacity-80 transition-opacity"
      >
        <Flex
          style={{
            position: 'relative',
          }}
          align={'baseline'}
        >
          <Box
            style={{overflowX: 'auto', display: 'inline-flex'}}
            paddingY={2}
            paddingLeft={2}
            paddingRight={5}
            className="no-scrollbar fade-out-right"
          >
            <Code size={1}>{sanitizedCodeSnippet}</Code>
          </Box>
          <Button
            style={{backgroundColor: 'var(--card-code-bg-color, #f6f6f8)'}}
            icon={isCopied ? CheckmarkIcon : ClipboardIcon}
            tone={isCopied ? 'positive' : 'default'}
            size={0}
            mode="bleed"
          />
        </Flex>
      </Card>
    </CopyToClipboard>
  )
}
