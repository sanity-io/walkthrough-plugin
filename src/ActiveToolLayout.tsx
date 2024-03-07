import {Card, Grid} from '@sanity/ui'
import {ActiveToolLayoutProps, LoadingBlock, useProjectId} from 'sanity'
import useSWR from 'swr'
import {SidebarContent} from './components/SidebarContent'
import {getWalkthrough} from './data/getWalkthrough'
import pluginVersion from './pluginVersion'

export function SidebarContainer() {
  const projectId = useProjectId()
  const {data, error, isLoading} = useSWR(`/walkthrough/${projectId}`, () =>
    getWalkthrough({projectId, pluginVersion}),
  )

  if (!isLoading && (!data || error)) return null
  return (
    <Card
      padding={2}
      borderLeft
      style={{
        width: '370px',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {isLoading && <LoadingBlock />}
      {data && (
        <SidebarContent
          overline={data.flow.overline}
          header={data.flow.header}
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
    <Grid columns={2} height={'fill'} style={{gridTemplateColumns: '1fr auto'}}>
      {props.renderDefault(props)}
      <SidebarContainer />
    </Grid>
  )
}
