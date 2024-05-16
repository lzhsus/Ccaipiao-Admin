import qs from 'qs'

export const query = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
})
