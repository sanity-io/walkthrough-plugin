import {Card, Grid} from '@sanity/ui'
import {ActiveToolLayoutProps, LoadingBlock, useClient, useProjectId} from 'sanity'
import useSWR from 'swr'
import {SidebarContent} from './components/SidebarContent'
import {Walkthrough} from './data/types'
import pluginVersion from './pluginVersion'
import {useEffect} from 'react'
import {useTelemetry} from '@sanity/telemetry/react'
import {QuickstartPluginLoaded} from './data/telemetry'

export function SidebarContainer() {
  const projectId = useProjectId()
  const client = useClient({apiVersion: 'v2024-02-23'})
  const telemetry = useTelemetry()
  const {data, error, isLoading} = useSWR(`/walkthrough/${projectId}`, () => {
    return client.request({
      uri: `/journey/walkthroughs/${projectId}?pluginVersion=${pluginVersion}`,
      method: 'get',
      withCredentials: true,
    }) as Promise<Walkthrough | undefined>
  })

  useEffect(() => {
    if (isLoading) return
    let errorOccurred
    if (!data || error) {
      errorOccurred = 'Error loading plugin content'
    }
    telemetry.log(QuickstartPluginLoaded, {errorOccurred})
  }, [data, error, isLoading])

  if (!isLoading && (!data || error)) return null
  return (
    <Card
      className="!hidden md:!block"
      padding={2}
      paddingBottom={0}
      borderLeft
      style={{
        width: '400px',
        overflowY: 'hidden',
        position: 'relative',
      }}
    >
      {isLoading && <LoadingBlock />}
      {data && (
        <SidebarContent
          overline={data.flow.overline}
          header={data.flow.header}
          footer={data.flow.footer}
          steps={data.flow.steps}
          walkthroughId={data._id}
          completedSteps={data.completedSteps}
        />
      )}
    </Card>
  )
}

export function ActiveToolLayout(props: ActiveToolLayoutProps) {
  return (
    <Grid
      columns={2}
      height={'fill'}
      style={{gridTemplateColumns: '1fr auto', gridAutoFlow: 'column'}}
    >
      <div style={{overflowY: 'auto'}}>{props.renderDefault(props)}</div>
      <SidebarContainer />
    </Grid>
  )
}
