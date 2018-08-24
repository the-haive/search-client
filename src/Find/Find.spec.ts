//import * as fetch from 'jest-fetch-mock';
const fetchAny = fetch as any;

import { Find, FindSettings, FindTriggers } from '.';
import { Matches } from '../Data';

describe('Find basics', () => {

  beforeEach(() => {
    fetchAny.resetMocks();
  });

  it('Should have imported Find class defined', () => {
    expect(typeof Find).toBe('function');
  });

  it('Should be able to create Find instance', () => {
    let find = new Find('http://localhost:9950/');
    let pFind = find as any;

    expect(typeof find).toBe('object');
    expect(find instanceof Find).toBeTruthy();
    expect(pFind.settings.enabled).toEqual(true);
    expect(pFind.settings.cbError).toBeUndefined();
    expect(pFind.settings.cbRequest).toBeUndefined();
    expect(pFind.settings.cbSuccess).toBeUndefined();
    expect(pFind.settings.triggers).toBeDefined();
    expect(pFind.settings.triggers.filterChanged).toEqual(true);
    expect(pFind.settings.url).toEqual('search/find');
  });

  it('Should throw for invalid Urls', () => {
    expect(() => {
        let find = new Find('file://localhost:9950');
        expect(typeof find).toBe('object');
    }).toThrow();

    expect(() => {
        let find = new Find('http:+//localhost:9950');
        expect(typeof find).toBe('object');
    }).toThrow();
  });

  it('Should be able to pass a default FindSettings instance', () => {
    let find = new Find('http://localhost:9950/', new FindSettings());
    let pFind = find as any;

    expect(typeof pFind.auth).toBe('object');
    expect(pFind.settings.enabled).toEqual(true);
    expect(pFind.settings.cbError).toBeUndefined();
    expect(pFind.settings.cbRequest).toBeUndefined();
    expect(pFind.settings.cbSuccess).toBeUndefined();
    expect(pFind.settings.triggers).toBeDefined();
    expect(pFind.settings.triggers.filterChanged).toEqual(true);
    expect(pFind.settings.url).toEqual('search/find');
  });

  it('Should be able to pass an FindSettings instance with additional settings', () => {
    let settings = new FindSettings();
    settings.cbError = jest.fn();
    settings.cbSuccess = jest.fn();
    settings.enabled = false;
    settings.triggers = new FindTriggers();
    settings.url = '/test';

    let find = new Find('http://localhost:9950/', settings);
    let pFind = find as any;

    expect(typeof pFind.auth).toBe('object');
    expect(find.baseUrl).toEqual('http://localhost:9950/RestService/v4');
    expect(pFind.settings.enabled).toEqual(false);
    expect(pFind.settings.cbError).toBeDefined();
    expect(pFind.settings.cbRequest).toBeUndefined();
    expect(pFind.settings.cbSuccess).toBeDefined();
    expect(pFind.settings.triggers).toBeDefined();
    expect(pFind.settings.triggers.filterChanged).toEqual(true);
    expect(pFind.settings.url).toEqual('test');
  });

  it('Should be able to pass a manual object settings as FindSettings', () => {
    let settings = {
      cbError: (error: any) => { /* dummy */},
      cbSuccess: (data: Matches) => { /* dummy */},
      enabled: false,
      triggers: new FindTriggers(),
      url: '/test',
    } as FindSettings;

    let find = new Find('http://localhost:9950/', settings);
    let pFind = find as any;

    expect(typeof pFind.auth).toBe('object');
    expect(find.baseUrl).toEqual('http://localhost:9950/RestService/v4');
    expect(pFind.settings.enabled).toEqual(false);
    expect(pFind.settings.cbError).toBeDefined();
    expect(pFind.settings.cbRequest).toBeUndefined();
    expect(pFind.settings.cbSuccess).toBeDefined();
    expect(pFind.settings.triggers).toBeDefined();
    expect(pFind.settings.triggers.filterChanged).toEqual(true);
    expect(pFind.settings.url).toEqual('test');
  });

  it('Should be able to Find some results', () => {
    // Not caring about the response, just to allow the fetch to complete.
    fetchAny.mockResponse(JSON.stringify({ }));
    let settings = { 
      cbRequest: jest.fn((url, reqInit) => {
        expect(typeof url).toBe('string');
        expect(typeof reqInit).toBe('object');
        return true;
      }),
    } as FindSettings;

    let find = new Find('http://localhost:9950/', settings);
    find.fetch().then(response => {
      expect(typeof response).toBe('object');
    }).catch(error => {
      fail('Should not fail');
    }).then(() => {
      expect(settings.cbRequest).toHaveBeenCalled();
    });
  });

  it('Should be able to stop a Find using cbRequest', () => {
    // Not caring about the response, just to allow the fetch to complete.
    fetchAny.mockResponse(JSON.stringify({ }));
    let settings = { 
      cbRequest: jest.fn((url, reqInit) => {
        expect(typeof url).toBe('string');
        expect(typeof reqInit).toBe('object');
        // Stop the request
        return false;
      }),
    } as FindSettings;

    let find = new Find('http://localhost:9950/', settings);
    find.fetch().then(response => {
      expect(response).toBeNull();
    }).catch(error => {
      fail('Should not yield an error');
    }).then(() => {
      expect(settings.cbRequest).toHaveBeenCalled();
    });
  });

});
