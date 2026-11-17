import { SearchUrlBuilder } from './SearchUrlBuilder'

describe('SearchUrlBuilder', () => {
  it('encodes query values so reserved characters stay in the search term', () => {
    const url = new SearchUrlBuilder('search').withSearchTerm('50% a#b&c+d').withPage(0).buildUrl()
    expect(url).toBe('search?searchterm=50%25%20a%23b%26c%2Bd&page=0')
  })

  it('encodes a filter URL once', () => {
    const url = new SearchUrlBuilder('search')
      .withFiltertUrl('value-sets', 'http://x/vs a')
      .buildUrl()
    expect(url).toBe('search?value-sets=http%3A%2F%2Fx%2Fvs%20a')
  })
})
