import {ChevronDownIcon, Icon, IconSymbol} from '@sanity/icons'
import {Badge, Box, Button, Card, Flex, Text} from '@sanity/ui'
import React, {useState} from 'react'
import {Step as StepProps} from '../data/types'
import {PortableText} from '@portabletext/react'

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
        backgroundColor: 'var(--gray-50, #F6F6F8)',
      }}
    >
      <Icon symbol={symbol as IconSymbol} />
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
      border={open}
      radius={4}
      paddingY={open ? 2 : 1}
      paddingX={2}
      style={{boxSizing: 'border-box'}}
    >
      <Flex direction={'row'} align={'center'}>
        <Flex>
          <IconCircle symbol={icon} isComplete={isComplete} />
        </Flex>
        <Flex flex={1} paddingLeft={2}>
          <Text size={1} weight="medium">
            {title}
          </Text>
        </Flex>
        <Badge tone={badge === 'no-code' ? 'primary' : undefined}>{badge}</Badge>
        <Flex paddingLeft={1}>
          <Button
            size={0}
            mode="bleed"
            padding={2}
            icon={ChevronDownIcon}
            onClick={() => setOpen((x) => !x)}
          />
        </Flex>
      </Flex>
      {open && (
        <PortableText
          value={content}
          components={{block: {normal: ({children}) => <Text size={1}>{children}</Text>}}}
        />
      )}
    </Card>
  )
}
