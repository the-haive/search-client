import {
    AuthenticationSettings,
    IAuthenticationSettings,
} from './AuthenticationSettings'
import { AuthenticationTriggers } from './AuthenticationTriggers'
import { OidcAuthentication } from './OidcAuthentication'

describe('Authentication basics', () => {
    it('Should have imported Authentication class defined', () => {
        expect(typeof OidcAuthentication).toBe('function')
    })

    it('Should be able to create Authentication instance', () => {
        const authentication = new OidcAuthentication('http://localhost:9950/')
        const pAuthentication = authentication as any

        expect(typeof authentication).toBe('object')
        expect(authentication instanceof OidcAuthentication).toBeTruthy()
        expect(pAuthentication.settings.baseUrl).toEqual(
            'http://localhost:9950'
        )
        const settings = pAuthentication.settings as IAuthenticationSettings
        expect(settings).toBeDefined()
        expect(settings.enabled).toBeFalsy()

        expect(settings.cbError).toBeUndefined()
        expect(settings.cbRequest).toBeUndefined()
        expect(settings.cbSuccess).toBeUndefined()
        expect(settings.token).toBeUndefined()
        expect(settings.triggers).toBeDefined()
        expect(settings.triggers.expiryOverlap).toEqual(60)

        expect(settings.clientId).toBeUndefined()
        expect(settings.responseType).toBeUndefined()
        expect(settings.scope).toBeUndefined()

        expect(settings.silentRedirectUri).toBeUndefined()
        expect(settings.redirectUri).toBeUndefined()
        expect(settings.postLogoutRedirectUri).toBeUndefined()

        expect(settings.url).toEqual('http://localhost:9950/auth/login')
    })

    it('Should throw for invalid Urls', () => {
        expect(() => {
            const authentication = new OidcAuthentication(
                'file://localhost:9950'
            )
            expect(typeof authentication).toBe('object')
        }).toThrow()

        expect(() => {
            const authentication = new OidcAuthentication(
                'http:+//localhost:9950'
            )
            expect(typeof authentication).toBe('object')
        }).not.toThrow()
    })

    it('Should be able to pass a default AuthenticationSettings instance', () => {
        const authSettings = {} as IAuthenticationSettings
        authSettings.baseUrl = 'http://localhost:9950/'
        const authentication = new OidcAuthentication(authSettings)
        const pAuthentication = authentication as any
        const settings = pAuthentication.settings as IAuthenticationSettings

        expect(typeof pAuthentication.auth).toBe('object')
        expect(settings).toBeDefined()
        expect(settings.enabled).toBeFalsy()
        expect(settings.cbError).toBeUndefined()
        expect(settings.cbRequest).toBeUndefined()
        expect(settings.cbSuccess).toBeUndefined()
        expect(settings.token).toBeUndefined()
        expect(settings.triggers.expiryOverlap).toEqual(60)
        expect(pAuthentication.settings.url).toEqual(
            'http://localhost:9950/auth/login'
        )

        expect(settings.clientId).toBeUndefined()
        expect(settings.responseType).toBeUndefined()
        expect(settings.scope).toBeUndefined()

        expect(settings.silentRedirectUri).toBeUndefined()
        expect(settings.redirectUri).toBeUndefined()
        expect(settings.postLogoutRedirectUri).toBeUndefined()
    })

    it('Should be able to pass an AuthenticationSettings instance with additional settings', () => {
        const settings = new AuthenticationSettings('http://dummy')
        settings.cbError = jest.fn()
        settings.cbSuccess = jest.fn()
        settings.enabled = false
        settings.triggers = new AuthenticationTriggers()
        settings.basePath = '/test'

        const authentication = new OidcAuthentication(settings)
        const pAuthentication = authentication as any
        const settings2 = pAuthentication.settings as IAuthenticationSettings

        expect(typeof pAuthentication.auth).toBe('object')
        expect(settings2.baseUrl).toEqual('http://dummy')
        expect(settings2).toBeDefined()
        expect(settings2.enabled).toEqual(false)
        expect(settings2.cbError).toBeDefined()
        expect(settings2.cbRequest).toBeUndefined()
        expect(settings2.cbSuccess).toBeDefined()
        expect(settings2.token).toBeUndefined()
        expect(settings2.triggers).toBeDefined()
        expect(settings2.triggers.expiryOverlap).toEqual(60)
        expect(settings2.token).toBeUndefined()
        expect(settings2.url).toEqual('http://dummy/test/auth/login')

        expect(settings2.clientId).toBeUndefined()
        expect(settings2.responseType).toBeUndefined()
        expect(settings2.scope).toBeUndefined()

        expect(settings2.silentRedirectUri).toBeUndefined()
        expect(settings2.redirectUri).toBeUndefined()
        expect(settings2.postLogoutRedirectUri).toBeUndefined()
    })

    it('Should be able to pass a manual object settings as AuthenticationSettings', () => {
        const settings = {
            baseUrl: 'http://localhost:9950',
            cbError: (error: any) => {
                /* dummy */
            },
            cbRequest: (url: string, reqInit: RequestInit) => false,
            cbSuccess: (token: string) => {
                /* dummy */
            },
            enabled: false,
            triggers: new AuthenticationTriggers(),
            basePath: '/test',
        } as AuthenticationSettings

        const authentication = new OidcAuthentication(settings)
        const pAuthentication = authentication as any
        const settings2 = pAuthentication.settings as IAuthenticationSettings

        expect(typeof pAuthentication.auth).toBe('object')
        expect(pAuthentication.settings.baseUrl).toEqual(
            'http://localhost:9950'
        )
        expect(settings2).toBeDefined()
        expect(settings2.enabled).toEqual(false)
        expect(settings2.cbError).toBeDefined()
        expect(settings2.cbRequest).toBeDefined()
        expect(settings2.cbSuccess).toBeDefined()
        expect(settings2.token).toBeUndefined()
        expect(settings2.triggers).toBeDefined()
        expect(settings2.triggers.expiryOverlap).toEqual(60)
        expect(settings2.token).toBeUndefined()
        expect(settings2.url).toEqual('http://localhost:9950/test/auth/login')

        expect(settings2.clientId).toBeUndefined()
        expect(settings2.responseType).toBeUndefined()
        expect(settings2.scope).toBeUndefined()

        expect(settings2.silentRedirectUri).toBeUndefined()
        expect(settings2.redirectUri).toBeUndefined()
        expect(settings2.postLogoutRedirectUri).toBeUndefined()
    })

    it('Should be able to pass object settings as AuthenticationSettings', async () => {
        let actualUrl: string
        const settings = {
            baseUrl: 'http://localhost:9950/',
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url
                return false
            }),
            cbSuccess: jest.fn(),
        } as IAuthenticationSettings
        const authentication = new OidcAuthentication(settings)
        const pAuthentication = authentication as any
        const settings2 = pAuthentication.settings as IAuthenticationSettings

        expect(settings2).toBeDefined()
        expect(settings2.enabled).toBeFalsy()
        expect(settings2.baseUrl).toEqual('http://localhost:9950')
        expect(settings2.cbRequest).toBeDefined()
        expect(settings2.cbSuccess).toBeDefined()
        expect(settings2.url).toEqual('http://localhost:9950/auth/login')

        expect(settings2.clientId).toBeUndefined()
        expect(settings2.responseType).toBeUndefined()
        expect(settings2.scope).toBeUndefined()

        expect(settings2.silentRedirectUri).toBeUndefined()
        expect(settings2.redirectUri).toBeUndefined()
        expect(settings2.postLogoutRedirectUri).toBeUndefined()

        try {
            const response = await authentication.fetch()
            expect(response).toBeNull()
        } catch (error) {
            fail('Did not expect to throw error')
        }
        expect(settings.cbRequest).toHaveBeenCalled()
        expect(actualUrl).toEqual('http://localhost:9950/auth/login')
    })

    it('Should be able to pass new AuthenticationSettings object', async () => {
        let actualUrl: string
        const settings = new AuthenticationSettings({
            baseUrl: 'http://localhost:9950/',
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url
                return false
            }),
            cbSuccess: jest.fn(),
        })

        const authentication = new OidcAuthentication(settings)
        const pAuthentication = authentication as any
        const settings2 = pAuthentication.settings as IAuthenticationSettings

        expect(settings2).toBeDefined()
        expect(settings2.enabled).toBeFalsy()
        expect(settings2.baseUrl).toEqual('http://localhost:9950')
        expect(settings2.cbRequest).toBeDefined()
        expect(settings2.cbSuccess).toBeDefined()
        expect(settings2.url).toEqual('http://localhost:9950/auth/login')

        expect(settings2.clientId).toBeUndefined()
        expect(settings2.responseType).toBeUndefined()
        expect(settings2.scope).toBeUndefined()

        expect(settings2.silentRedirectUri).toBeUndefined()
        expect(settings2.redirectUri).toBeUndefined()
        expect(settings2.postLogoutRedirectUri).toBeUndefined()

        try {
            const response = await authentication.fetch()
            expect(response).toBeNull()
        } catch (error) {
            fail('Did not expect to throw error')
        }
        expect(settings.cbRequest).toHaveBeenCalled()
        expect(actualUrl).toEqual('http://localhost:9950/auth/login')
    })

    it('Should be able to pass anonymous object settings', async () => {
        let actualUrl: string
        const settings = {
            baseUrl: 'http://localhost:9950/',
            cbRequest: jest.fn((url: string, reqInit: RequestInit) => {
                actualUrl = url
                return false
            }),
            cbSuccess: jest.fn(),
        }

        const authentication = new OidcAuthentication(settings)
        const pAuthentication = authentication as any
        const settings2 = pAuthentication.settings as IAuthenticationSettings

        expect(settings2).toBeDefined()
        expect(settings2.enabled).toBeFalsy()
        expect(settings2.baseUrl).toEqual('http://localhost:9950')
        expect(settings2.cbRequest).toBeDefined()
        expect(settings2.cbSuccess).toBeDefined()
        expect(settings2.url).toEqual('http://localhost:9950/auth/login')

        expect(settings2.clientId).toBeUndefined()
        expect(settings2.responseType).toBeUndefined()
        expect(settings2.scope).toBeUndefined()

        expect(settings2.silentRedirectUri).toBeUndefined()
        expect(settings2.redirectUri).toBeUndefined()
        expect(settings2.postLogoutRedirectUri).toBeUndefined()

        try {
            const response = await authentication.fetch()
            expect(response).toBeNull()
        } catch (error) {
            fail('Did not expect to throw error')
        }
        expect(settings.cbRequest).toHaveBeenCalled()
        expect(actualUrl).toEqual('http://localhost:9950/auth/login')
    })
})
