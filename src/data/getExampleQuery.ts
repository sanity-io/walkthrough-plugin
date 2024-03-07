import {ResponseError} from './types'

export const getExampleQuery = async (params: {
  projectId: string
}): Promise<Record<string, string> | null | undefined> => {
  try {
    // can't use the studio's sanity client (i.e. useClient) for these calls
    // because the prefixed URL doesn't allow the personalization forge
    // access to the userId - only the projectUserId
    const res = await fetch(
      `https://${params.projectId}.api.sanity.work/v2024-02-23/journey/projects/${params.projectId}/groq?simpleProjection=true&includeProjection=true`,
      {method: 'get', credentials: 'include'},
    )
    if (res.status > 200) {
      const error = new Error(
        'An error occured when fetching the example GROQ query.',
      ) as ResponseError
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
