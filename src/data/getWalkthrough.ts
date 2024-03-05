import {ResponseError, Walkthrough} from './types'

export const getWalkthrough = async (params: {
  projectId: string
  pluginVersion: number
}): Promise<Walkthrough | null | undefined> => {
  try {
    // can't use the studio's sanity client (i.e. useClient) for these calls
    // because the prefixed URL doesn't allow the personalization forge
    // access to the userId - only the projectUserId
    const res = await fetch(
      `https://api.sanity.work/v2024-02-23/journey/walkthroughs/${params.projectId}?pluginVersion=${params.pluginVersion}`,
      {method: 'get', credentials: 'include'},
    )
    if (res.status > 200) {
      const error = new Error('An error occured when fetching the walkthrough.') as ResponseError
      error.status = res.status
      error.info = await res.json()
      throw error
    }
    return await res.json()
  } catch (e) {
    console.error(e)
    return undefined
  }
}
