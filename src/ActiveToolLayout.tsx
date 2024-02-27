import {Box, Card, Flex, Text} from '@sanity/ui'
import {ActiveToolLayoutProps} from 'sanity'

export function SidebarPanel() {
  return (
    <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="primary">
      <Text size={4} style={{paddingBottom: '3em'}}>
        Get Started
      </Text>
      <Text>This is a right sidebar. </Text>
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
