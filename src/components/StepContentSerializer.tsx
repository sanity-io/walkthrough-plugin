import {PortableText} from '@portabletext/react'
import {CheckmarkIcon, ClipboardIcon, Icon, IconSymbol, LinkIcon} from '@sanity/icons'
import {useTelemetry} from '@sanity/telemetry/react'
import {Box, Button, Card, Code, Heading, Stack, Text, useTheme} from '@sanity/ui'
import React, {ReactNode, useMemo, useState} from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import {LoadingBlock, PortableTextBlock, useClient, useProjectId} from 'sanity'
import {useRouter} from 'sanity/router'
import useSWR from 'swr'
import {QuickstartCodeCopied, QuickstartLinkClicked} from '../data/telemetry'
import {useStep} from './StepItem'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {a11yDark, a11yLight} from 'react-syntax-highlighter/dist/esm/styles/hljs'

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

function Link(props: {children: ReactNode; url: string; withIcon: boolean; newTab: boolean}) {
  const {children, url, withIcon, newTab} = props
  const stepContext = useStep()
  const router = useRouter()
  const telemetry = useTelemetry()
  return (
    <a
      href={url}
      target={newTab ? '_blank' : undefined}
      rel="noreferrer"
      onClick={(e) => {
        if (!newTab) {
          e.preventDefault()
          router.navigateUrl({path: url})
        }
        telemetry.log(QuickstartLinkClicked, {
          projectId: stepContext.projectId,
          stepId: stepContext.stepId,
          stepName: stepContext.stepName,
          targetText: props?.children as string,
          targetUrl: props?.url,
        })
      }}
    >
      {children}
      {withIcon && (
        <span style={{paddingLeft: '0.75em'}}>
          <LinkIcon style={{color: 'var(--card-link-color)'}} />
        </span>
      )}
    </a>
  )
}

function GROQExample(params: Record<string, string>) {
  const projectId = useProjectId()
  const client = useClient({apiVersion: 'v2024-02-23'})
  const queryParams = new URLSearchParams(params).toString()
  const {data, isLoading} = useSWR(`/projects/${projectId}/groq?${queryParams}`, () =>
    client.request({
      uri: `/journey/projects/${projectId}/groq?${queryParams}`,
      method: 'get',
      withCredentials: true,
    }),
  )
  const code = useMemo(() => {
    if (data) {
      let groqQuery = Object.values(data)?.[0] as string
      if (params?.comment) {
        groqQuery = `// ${params.comment}\n${groqQuery}`
      }

      return groqQuery
    }
    return ''
  }, [data, params?.comment])

  return <CodeBlock code={code} language="groq" loading={isLoading} />
}

function CTAButton(props: {text: string; href: string; icon: IconSymbol; newTab: boolean}) {
  const projectId = useProjectId()
  const sanitizedHref = props?.href.replace('{{PROJECT_ID}}', projectId)
  const stepContext = useStep()
  const telemetry = useTelemetry()
  const router = useRouter()
  return (
    <div>
      <Button
        as={'a'}
        href={sanitizedHref}
        target={props?.newTab ? '_blank' : undefined}
        onClick={(e) => {
          if (!props?.newTab) {
            e.preventDefault()
            router.navigateUrl({path: sanitizedHref})
          }
          telemetry.log(QuickstartLinkClicked, {
            projectId,
            stepId: stepContext.stepId,
            stepName: stepContext.stepName,
            targetText: props?.text,
            targetUrl: props?.href,
          })
        }}
        text={props?.text}
        icon={props?.icon && <Icon symbol={props.icon} />}
        mode={'default'}
        tone={'primary'}
      />
    </div>
  )
}

function InlineIcon(props: {children: ReactNode; symbol: string}) {
  const {children, symbol} = props
  return (
    <>
      <Icon
        symbol={(symbol as IconSymbol) || 'rocket'}
        style={{
          display: 'inline',
          fontSize: 'calc(21 / 16 * 1rem) !important',
          margin: '-0.375rem 0 !important',
          paddingLeft: '0.25em',
          paddingRight: '0.25em',
        }}
      />

      {children}
    </>
  )
}

function CodeBlock(props: {loading?: boolean; code: string; language: string; filename?: string}) {
  const {code = '', language, filename = '', loading = false} = props
  const projectId = useProjectId()
  const [isCopied, setCopied] = useState(false)
  const client = useClient({apiVersion: 'v2024-02-23'})
  const theme = useTheme()
  const isDark = theme?.sanity?.color?.dark
  const {data, isLoading} = useSWR(
    `/projects/${projectId}/groqDefault`,
    () =>
      client.request({
        uri: `/journey/projects/${projectId}/groq?simpleProjection=true&includeProjection=true`,
        method: 'get',
        withCredentials: true,
      }) as Promise<Record<string, string> | undefined>,
  )
  const stepContext = useStep()
  const telemetry = useTelemetry()

  const sanitizedCodeSnippet = useMemo(() => {
    let sanitizedExample = code.replaceAll('{{PROJECT_ID}}', `${projectId}`)
    if (!(isLoading || loading) && data) {
      sanitizedExample = sanitizedExample.replaceAll('{{GROQ_QUERY}}', Object.values(data)?.[0])
    }

    return sanitizedExample
  }, [isLoading, loading, data, projectId, code])

  const onCopy = (text: string) => {
    setCopied(true)
    setTimeout(() => setCopied(false), 5000)
    telemetry.log(QuickstartCodeCopied, {
      projectId,
      stepId: stepContext.stepId,
      stepName: stepContext.stepName,
      copiedContent: text,
    })
  }

  return (
    <CopyToClipboard text={sanitizedCodeSnippet} onCopy={onCopy}>
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
            <Box>
              <Code size={0}>{filename}</Code>
            </Box>
          )}

          {loading ? (
            <LoadingBlock />
          ) : (
            <SyntaxHighlighter
              language={language}
              style={isDark ? a11yDark : a11yLight}
              customStyle={{
                overflowX: 'initial',
                background: 'none',
                marginBottom: '0',
                padding: '0',
              }}
            >
              {`${language == 'sh' ? `$ ` : ''}${sanitizedCodeSnippet}`}
            </SyntaxHighlighter>
          )}
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
          },
          types: {
            code: ({value}) => (
              <CodeBlock code={value?.code} language={value?.language} filename={value?.filename} />
            ),
            groqExample: ({value}) => <GROQExample {...value} />,
            ctaButton: ({value}) => <CTAButton {...value} />,
          },
          list: {
            bullet: ({children}) => <UnorderedList>{children}</UnorderedList>,
            number: ({children}) => <OrderedList>{children}</OrderedList>,
          },
          listItem: {
            bullet: ({children}) => <ListItem>{children}</ListItem>,
            number: ({children}) => <ListItem>{children}</ListItem>,
          },
          marks: {
            customLink: ({value, children}) => (
              <Link url={value?.url} withIcon={value?.withIcon} newTab={value?.newTab}>
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
