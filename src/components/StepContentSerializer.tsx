import {PortableText} from '@portabletext/react'
import {CheckmarkIcon, ClipboardIcon, Icon, IconSymbol, LinkIcon} from '@sanity/icons'
import {Box, Button, Card, Code, Heading, Stack, Text} from '@sanity/ui'
import React, {ReactNode, useCallback, useState} from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import {LoadingBlock, PortableTextBlock, useClient, useProjectId} from 'sanity'
import useSWR from 'swr'

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

function UnorderedList(props: {children: ReactNode}) {
  const {children} = props

  return (
    <Stack space={4} paddingLeft={4} as={'ul'} style={{listStyle: 'disc'}}>
      {children}
    </Stack>
  )
}

function OrderedList(props: {children: ReactNode}) {
  const {children} = props

  return (
    <Stack space={4} paddingLeft={4} as={'ol'} style={{listStyle: 'decimal'}}>
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
    <a href={url} target="_blank" rel="noreferrer">
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
  const projectId = useProjectId()
  const client = useClient({apiVersion: 'v2024-02-23'})
  const {data, isLoading} = useSWR(`/projects/${projectId}/groq`, () =>
    client.request({
      uri: `/journey/projects/${projectId}/groq?simpleProjection=true&includeProjection=true`,
      method: 'get',
      withCredentials: true,
    }),
  )

  return (
    <CodeBlock language="groq">
      {isLoading && <LoadingBlock />}
      {data && Object.values(data)?.[0]}
    </CodeBlock>
  )
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

function CodeBlock(props: {children: ReactNode; language: string; filename?: string}) {
  const {children, language, filename = ''} = props
  const projectId = useProjectId()
  const [isCopied, setCopied] = useState(false)
  const client = useClient({apiVersion: 'v2024-02-23'})
  const {data, isLoading} = useSWR(
    `/projects/${projectId}/groq`,
    () =>
      client.request({
        uri: `/journey/projects/${projectId}/groq?simpleProjection=true&includeProjection=true`,
        method: 'get',
        withCredentials: true,
      }) as Promise<Record<string, string> | undefined>,
  )

  const sanitizedCodeSample = useCallback(
    (code: string | ReactNode) => {
      if (typeof code !== 'string') return code
      const sanitizedExample = code.replaceAll('{{PROJECT_ID}}', `"${projectId}"`)
      if (!isLoading && data)
        sanitizedExample.replaceAll('{{GROQ_QUERY}}', Object.values(data)?.[0])
      return sanitizedExample
    },
    [isLoading, data, projectId],
  )
  const onCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 5000)
  }

  return (
    <CopyToClipboard text={children as string} onCopy={onCopy}>
      <Card
        border
        radius={2}
        style={{
          position: 'relative',
          boxSizing: 'border-box',
          cursor: 'pointer',
          backgroundColor: 'var(--card-code-bg-color, #f6f6f8)',
          margin: '0 -0.25rem 0 -1.75rem',
        }}
        className="hover:opacity-80 transition-opacity"
      >
        <Box padding={3} marginRight={5} overflow={'auto'}>
          <Button
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              zIndex: '10',
              backgroundColor: 'var(--card-code-bg-color, #f6f6f8)',
            }}
            icon={isCopied ? CheckmarkIcon : ClipboardIcon}
            tone={isCopied ? 'positive' : 'default'}
            size={0}
            mode="bleed"
          />
          {filename && (
            <Box paddingBottom={5}>
              <Code size={0}>{filename}</Code>
            </Box>
          )}
          <Code size={1}>
            <span>{language == 'sh' && `$ `}</span>
            {sanitizedCodeSample(children)}
          </Code>
        </Box>
      </Card>
    </CopyToClipboard>
  )
}

export const StepContentSerializer: React.FC<{content: PortableTextBlock}> = ({content}) => {
  return (
    <Stack space={4} paddingLeft={5} paddingRight={2} paddingBottom={4} paddingTop={5}>
      <PortableText
        value={content}
        components={{
          block: {
            normal: ({children}) => <NormalBlock>{children}</NormalBlock>,
            h2: ({children}) => <HeadingBlock>{children}</HeadingBlock>,
            groq: () => <GROQExample />,
          },
          types: {
            code: ({value}) => (
              <CodeBlock language={value?.language} filename={value?.filename}>
                {value.code}
              </CodeBlock>
            ),
          },
          list: {
            bullet: ({children}) => <UnorderedList>{children}</UnorderedList>,
            number: ({children}) => <OrderedList>{children}</OrderedList>,
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
