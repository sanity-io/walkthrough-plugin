import {
  CheckmarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseCircleIcon,
  Icon,
  IconSymbol,
} from '@sanity/icons'
import {useTelemetry} from '@sanity/telemetry/react'
import {Badge, Box, Button, Card, Flex, Text} from '@sanity/ui'
import React, {useContext, useMemo} from 'react'
import {useProjectId} from 'sanity'
import {QuickstartStepClicked} from '../data/telemetry'
import {Step as StepProps} from '../data/types'
import {StepContentSerializer} from './StepContentSerializer'

const IconCircle: React.FC<{isComplete: boolean; symbol: string}> = ({isComplete, symbol}) => {
  return (
    <Box
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '25px',
        width: '25px',
        borderRadius: '50%',
        fontSize: '21px',
        backgroundColor: isComplete
          ? 'var(--card-focus-ring-color,#556bfc)'
          : 'var(--card-code-bg-color, #F6F6F8)',
        color: isComplete ? 'white' : undefined,
      }}
    >
      {isComplete ? <CheckmarkIcon /> : <Icon symbol={symbol as IconSymbol} />}
    </Box>
  )
}

const StepContext = React.createContext<{
  stepId?: string
  stepName?: string
  projectId?: string
}>({})

export const useStep = () => useContext(StepContext)

export const StepItem: React.FC<
  StepProps & {
    open: boolean
    isComplete: boolean
    toggleComplete: (id: string) => void
    disableExpansion: boolean
    onClick: () => void
  }
> = ({
  _id,
  badge,
  content,
  open,
  icon,
  title,
  isComplete,
  toggleComplete,
  onClick,
  disableExpansion = false,
}) => {
  const projectId = useProjectId()
  const telemetry = useTelemetry()
  const stepContextValue = useMemo(
    () => ({stepId: _id, stepName: title, projectId}),
    [_id, title, projectId],
  )

  const handleClick = () => {
    telemetry.log(QuickstartStepClicked, {
      stepCompleted: isComplete,
      ...stepContextValue,
    })
    onClick()
  }

  return (
    <StepContext.Provider value={stepContextValue}>
      <Card
        radius={4}
        paddingY={open ? 2 : 1}
        paddingX={2}
        className={`box-border z-10 border border-solid border-transparent transition-all ${!disableExpansion && 'hover:border-[var(--card-border-color)]'} ${open && 'border-[var(--card-border-color)]'}`}
      >
        <Flex
          direction={'row'}
          align={'center'}
          onClick={disableExpansion ? undefined : handleClick}
          className={disableExpansion ? undefined : 'hover:cursor-pointer'}
        >
          <Flex>
            <IconCircle symbol={icon} isComplete={isComplete} />
          </Flex>
          <Flex flex={1} paddingLeft={2} className="select-none">
            <Text size={1} weight="medium">
              {title}
            </Text>
          </Flex>
          {badge && <Badge tone={badge === 'No code' ? 'primary' : undefined}>{badge}</Badge>}
          <Flex paddingLeft={1}>
            <Button
              size={0}
              mode="bleed"
              padding={2}
              icon={open ? ChevronUpIcon : ChevronDownIcon}
              style={{
                transitionProperty: 'opacity',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDuration: '150ms',
                opacity: disableExpansion ? '0' : undefined,
              }}
            />
          </Flex>
        </Flex>
        {open && (
          <>
            <StepContentSerializer content={content} />
            <Flex justify={'flex-end'}>
              <Button
                padding={2}
                fontSize={1}
                text={isComplete ? 'Mark as incomplete' : 'Mark as complete'}
                icon={isComplete ? CloseCircleIcon : CheckmarkIcon}
                tone={isComplete ? 'default' : 'primary'}
                mode={'ghost'}
                onClick={() => {
                  toggleComplete(_id)
                }}
              />
            </Flex>
          </>
        )}
      </Card>
    </StepContext.Provider>
  )
}
