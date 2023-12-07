import { createElement } from 'react'
import useSWR from 'swr'
import { fetcher } from './use-fetcher'

export const useSwrFetch = (args: any) => {
  const { shouldFetch = false, defaultData = {} } = args || {}
  let { data, error } = useSWR(shouldFetch ? args : null, fetcher, {
    // revalidateIfStale: false,
    // revalidateOnFocus: false,
    // revalidateOnReconnect: false
  })

  if (error) {
    error = createElement('div', null, 'Failed to load')
    return {
      error
    }
  }

  if (!data) {
    data = data || defaultData
  }

  return {
    data
  }
}
