import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()

import { Autocomplete, AutocompleteTriggers, IAutocompleteSettings } from '.'
import { Query } from '../Common'

describe('Autocomplete basics', () => {
    it('Should have imported Autocomplete class defined', () => {
        expect(typeof Autocomplete).toBe('function')
    })

    it('Should be able to create Autocomplete instance', () => {
        const autocomplete = new Autocomplete('http://localhost:9950/')
        const pAutocomplete = autocomplete as any

        expect(typeof autocomplete).toBe('object')
        expect(autocomplete instanceof Autocomplete).toBeTruthy()
        expect(pAutocomplete.settings).toBeDefined()
        expect(pAutocomplete.settings.enabled).toEqual(true)
        expect(pAutocomplete.settings.cbError).toBeUndefined()
        expect(pAutocomplete.settings.cbRequest).toBeUndefined()
        expect(pAutocomplete.settings.cbSuccess).toBeUndefined()
        expect(pAutocomplete.settings.triggers).toBeDefined()
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(
            true
        )
        expect(pAutocomplete.settings.url).toEqual(
            'http://localhost:9950/RestService/v4/autocomplete'
        )
    })

    it('Should not throw, even for invalid urls. Not perfect, but avoids an additional dependency.', () => {
        let autocomplete = new Autocomplete('file://localhost:9950')
        expect(typeof autocomplete).toBe('object')

        autocomplete = new Autocomplete('http:+//localhost:9950')
        expect(typeof autocomplete).toBe('object')
    })

    it('Should be able to pass an AutocompleteSettings instance with additional settings', () => {
        const settings = {} as IAutocompleteSettings
        settings.baseUrl = 'http://localhost:9950/'
        settings.cbError = jest.fn()
        settings.cbSuccess = jest.fn()
        settings.enabled = false
        settings.triggers = new AutocompleteTriggers()
        settings.basePath = '/test'

        const autocomplete = new Autocomplete(settings)
        const pAutocomplete = autocomplete as any

        expect(typeof pAutocomplete.auth).toBe('object')
        expect(pAutocomplete.settings.baseUrl).toEqual('http://localhost:9950')
        expect(pAutocomplete.settings.enabled).toEqual(false)
        expect(pAutocomplete.settings.cbError).toBeDefined()
        expect(pAutocomplete.settings.cbRequest).toBeUndefined()
        expect(pAutocomplete.settings.cbSuccess).toBeDefined()
        expect(pAutocomplete.settings.triggers).toBeDefined()
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(
            true
        )
        expect(pAutocomplete.settings.url).toEqual(
            'http://localhost:9950/test/autocomplete'
        )
    })

    it('Should be able to pass a manual object settings as AutocompleteSettings', () => {
        const settings = {
            baseUrl: 'http://localhost:9950/',
            cbError: (error: any) => {
                /* dummy */
            },
            cbSuccess: (data: string[]) => {
                /* dummy */
            },
            enabled: false,
            triggers: new AutocompleteTriggers(),
            basePath: '/test',
        } as IAutocompleteSettings

        const autocomplete = new Autocomplete(settings)
        const pAutocomplete = autocomplete as any

        expect(typeof pAutocomplete.auth).toBe('object')
        expect(pAutocomplete.settings.baseUrl).toEqual('http://localhost:9950')
        expect(pAutocomplete.settings.enabled).toEqual(false)
        expect(pAutocomplete.settings.cbError).toBeDefined()
        expect(pAutocomplete.settings.cbRequest).toBeUndefined()
        expect(pAutocomplete.settings.cbSuccess).toBeDefined()
        expect(pAutocomplete.settings.triggers).toBeDefined()
        expect(pAutocomplete.settings.triggers.maxSuggestionsChanged).toEqual(
            true
        )
        expect(pAutocomplete.settings.url).toEqual(
            'http://localhost:9950/test/autocomplete'
        )
    })

    it('Should be able to get some autocomplete suggestions', async () => {
        fetchMock.resetMocks()

        fetchMock.mockResponse(
            JSON.stringify(['queryTextForMe', 'queryTextForYou'])
        )

        const cbRequest = jest.fn((url, reqInit) => {
            expect(typeof url).toBe('string')
            expect(typeof reqInit).toBe('object')
        }) as unknown

        const cbSuccess = jest.fn(suggestions => {
            expect(suggestions.length).toBe(2)
            expect(suggestions).toContain('queryTextForMe')
            expect(suggestions).toContain('queryTextForYou')
        }) as unknown

        const settings = {
            baseUrl: 'http://localhost:9950/',
            cbRequest,
            cbSuccess,
        } as IAutocompleteSettings

        const autocomplete = new Autocomplete(settings, null, fetch)
        try {
            await autocomplete.fetch()
        } catch (error) {
            fail(error)
        }
        expect(settings.cbRequest).toHaveBeenCalled()
        expect(settings.cbSuccess).toHaveBeenCalled()
    })

    it('Should be able to stop an Autocomplete using cbRequest', async () => {
        fetchMock.resetMocks()

        fetchMock.mockResponse(
            JSON.stringify(['queryTextForMe', 'queryTextForYou'])
        )

        const settings = {
            baseUrl: 'http://localhost:9950/',
            cbRequest: jest.fn((url, reqInit) => {
                expect(typeof url).toBe('string')
                expect(typeof reqInit).toBe('object')
                // Stop the request
                return false
            }),
            cbSuccess: jest.fn(),
        } as IAutocompleteSettings

        const autocomplete = new Autocomplete(settings, null, fetch)
        try {
            autocomplete.fetch()
        } catch (error) {
            fail(error)
        }
        expect(settings.cbRequest).toHaveBeenCalled()
        expect(settings.cbSuccess).not.toHaveBeenCalled()
    })

    it('Should be able to create response when changing queryText', () => {
        jest.useFakeTimers()
        // Not caring about the response, just to allow the fetch to complete.
        fetchMock.resetMocks()
        fetchMock.mockResponse(
            JSON.stringify(['queryTextForMe', 'queryTextForYou'])
        )
        const cbSuccess = jest.fn(suggestions => {
            expect(suggestions.length).toBe(2)
            expect(suggestions).toContain('queryTextForMe')
            expect(suggestions).toContain('queryTextForYou')
        }) as unknown
        const cbError = jest.fn((suppressCallbacks, error, url, reqInit) => {
            fail('Should not have thrown an error.')
        }) as unknown

        const settings = {
            baseUrl: 'http://localhost:9950/',
            cbSuccess,
            cbError,
        } as IAutocompleteSettings

        const autocomplete = new Autocomplete(settings, null, fetch)
        const newQuery = new Query()
        newQuery.queryText = 'queryText'
        autocomplete.queryTextChanged('', newQuery)
        expect(fetch).toHaveBeenCalledTimes(0)
        jest.runAllTimers()
        expect(fetch).toHaveBeenCalledTimes(1)
    })
})
