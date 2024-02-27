export const postStepComplete = async (params: {
  projectId: string
  walthroughId: string
  completedSteps: string
}): Promise<string[] | null | undefined> => {
  try {
    const res = await fetch(
      `https://api.sanity.io/v2024-02-23/journey/walkthrough/${params.projectId}/${params.walthroughId}`,
      {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({completedSteps: params.completedSteps}),
      },
    )
    return await res.json()
  } catch (e) {
    console.error(e)
    return undefined
  }
}
