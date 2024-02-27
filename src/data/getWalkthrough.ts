import {Walkthrough} from './types'

export const getWalkthrough = async (params: {
  projectId: string
  pluginVersion: number
}): Promise<Walkthrough | null | undefined> => {
  try {
    const res = await fetch(
      `https://api.sanity.io/v2024-02-23/journey/walkthrough/${params.projectId}?pluginVersion=${params.pluginVersion}`,
      {method: 'get', credentials: 'include'},
    )
    return await res.json()
  } catch (e) {
    console.error(e)
    return undefined
  }
}
