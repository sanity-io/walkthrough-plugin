import {CheckmarkIcon, ChevronDownIcon, Icon, IconSymbol} from '@sanity/icons'
import {Badge, Box, Button, Card, Flex, Text} from '@sanity/ui'
import React, {useState} from 'react'
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

export const StepItem: React.FC<StepProps & {startOpen: boolean; isComplete: boolean}> = ({
  badge,
  content,
  startOpen,
  icon,
  title,
  isComplete,
}) => {
  const [open, setOpen] = useState(startOpen)

  return (
    <Card
      radius={4}
      paddingY={open ? 2 : 1}
      paddingX={2}
      className={`box-border border border-solid border-transparent transition-all hover:border-[var(--card-border-color)] ${open && 'border-[var(--card-border-color)]'}`}
    >
      <Flex
        direction={'row'}
        align={'center'}
        onClick={() => setOpen((x) => !x)}
        className="hover:cursor-pointer"
      >
        <Flex>
          <IconCircle symbol={icon} isComplete={isComplete} />
        </Flex>
        <Flex flex={1} paddingLeft={2}>
          <Text size={1} weight="medium">
            {title}
          </Text>
        </Flex>
        <Badge tone={badge === 'No code' ? 'primary' : undefined}>{badge}</Badge>
        <Flex paddingLeft={1}>
          <Button
            size={0}
            mode="bleed"
            padding={2}
            icon={ChevronDownIcon}
            style={{
              transitionProperty: 'opacity',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDuration: '150ms',
            }}
          />
        </Flex>
      </Flex>
      {open && <StepContentSerializer content={content} />}
    </Card>
  )
}
