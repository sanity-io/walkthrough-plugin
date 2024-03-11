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
      className="sm:hidden"
      padding={2}
      paddingBottom={0}
      borderLeft
      style={{
        width: '400px',
        overflowY: 'scroll',
        boxSizing: 'border-box',
        position: 'relative',
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
    <Grid
      columns={2}
      height={'fill'}
      style={{gridTemplateColumns: '1fr auto', gridAutoFlow: 'column'}}
    >
      <div>{props.renderDefault(props)}</div>
      <SidebarContainer />
    </Grid>
  )
}
