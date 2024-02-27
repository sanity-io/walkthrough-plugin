import {Box, Card, Flex, Text} from '@sanity/ui'
import {ActiveToolLayoutProps, useProjectId} from 'sanity'
import useSWR from 'swr'
import {getWalkthrough} from './data/getWalkthrough'
import pluginVersion from './pluginVersion'

export function SidebarPanel() {
  const projectId = useProjectId()
  const {data} = useSWR(`/walkthrough/${projectId}`, () =>
    getWalkthrough({projectId, pluginVersion}),
  )

  if (!data) return null
  return (
    <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="primary">
      <Text size={2} style={{paddingBottom: '3em'}}>
        {data.flow.overline}
      </Text>
      <Text size={4} style={{paddingBottom: '3em'}}>
        {data.flow.header}
      </Text>
      {data && <pre>{JSON.stringify({steps: data.flow.steps})}</pre>}
    </Card>
  )
}

export function ActiveToolLayout(props: ActiveToolLayoutProps) {
  return (
    <Flex height={'fill'}>
      <Box flex={1}>{props.renderDefault(props)}</Box>
      <SidebarPanel />
    </Flex>
  )
}
