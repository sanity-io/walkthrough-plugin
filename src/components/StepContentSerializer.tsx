import {PortableText} from '@portabletext/react'
import {Icon, IconSymbol, LinkIcon, ClipboardIcon, CheckmarkIcon} from '@sanity/icons'
import {Box, Button, Card, Heading, Stack, Text, Code} from '@sanity/ui'
import React, {ReactNode, useState} from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import {PortableTextBlock} from 'sanity'

function NormalBlock(props: {children: ReactNode}) {
  const {children} = props

  return (
    <Box>
      <Text size={1}>{children}</Text>
    </Box>
  )
}

function ListItem(props: {children: ReactNode}) {
  const {children} = props

  return (
    <Text size={1}>
      <li>{children}</li>
    </Text>
  )
}

function List(props: {children: ReactNode}) {
  const {children} = props

  return (
    <Stack space={4} paddingLeft={4} as={'ul'} style={{listStyle: 'disc'}}>
      {children}
    </Stack>
  )
}

function HeadingBlock(props: {children: ReactNode}) {
  const {children} = props
  return (
    <Box>
      <Heading size={2} as="h2">
        {children}
      </Heading>
    </Box>
  )
}

function Link(props: {children: ReactNode; url: string; withIcon: boolean}) {
  const {children, url, withIcon} = props
  return (
    <a href={url}>
      {children}
      {withIcon && (
        <span style={{paddingLeft: '0.75em'}}>
          <LinkIcon style={{color: 'var(--card-link-color)'}} />
        </span>
      )}
    </a>
  )
}

function GROQExample() {
  return <CodeBlock language="groq">Copyable GROQ Example</CodeBlock>
}

function InlineIcon(props: {children: ReactNode; symbol: string}) {
  const {children, symbol} = props
  return (
    <span>
      <span style={{paddingRight: '0.75em'}}>
        <Icon symbol={(symbol as IconSymbol) || 'rocket'} />
      </span>
      {children}
    </span>
  )
}

function CodeBlock(props: {children: ReactNode; language: string}) {
  const {children, language} = props
  const [isCopied, setCopied] = useState(false)
  const onCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 5000)
  }

  return (
    <CopyToClipboard text={children as string} onCopy={onCopy}>
      <Card
        border
        padding={3}
        radius={2}
        style={{position: 'relative', boxSizing: 'border-box', cursor: 'pointer'}}
        className="hover:opacity-80 transition-opacity"
      >
        <Button
          style={{position: 'absolute', top: '0', right: '0'}}
          icon={isCopied ? CheckmarkIcon : ClipboardIcon}
          tone={isCopied ? 'positive' : 'default'}
          size={0}
          mode="bleed"
        />
        <Code size={1}>
          <span>{language == 'sh' && `$ `}</span>
          {children}
        </Code>
      </Card>
    </CopyToClipboard>
  )
}

export const StepContentSerializer: React.FC<{content: PortableTextBlock}> = ({content}) => {
  return (
    <Stack space={4} paddingLeft={5} paddingRight={2} paddingBottom={2} paddingTop={5}>
      <PortableText
        value={content}
        components={{
          block: {
            normal: ({children}) => <NormalBlock>{children}</NormalBlock>,
            h2: ({children}) => <HeadingBlock>{children}</HeadingBlock>,
            groq: () => <GROQExample />,
          },
          types: {
            code: ({value}) => <CodeBlock language={value?.language}>{value.code}</CodeBlock>,
          },
          list: {
            bullet: ({children}) => <List>{children}</List>,
          },
          listItem: {
            bullet: ({children}) => <ListItem>{children}</ListItem>,
          },
          marks: {
            customLink: ({value, children}) => (
              <Link url={value?.url} withIcon={value?.withIcon}>
                {children}
              </Link>
            ),
            inlineIcon: ({value, children}) => (
              <InlineIcon symbol={value?.symbol}>{children}</InlineIcon>
            ),
          },
        }}
      />
    </Stack>
  )
}
