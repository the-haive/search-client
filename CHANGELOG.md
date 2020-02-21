# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.3.1"></a>
## [1.3.1](https://github.com/the-haive/search-client/compare/v1.3.0...v1.3.1) (2020-01-17)


### Bug Fixes

* **filters:** Fix bug where reset() in some cases did not clear filters. ([204aa92](https://github.com/the-haive/search-client/commit/204aa92))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/the-haive/search-client/compare/v1.2.0...v1.3.0) (2019-12-21)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/the-haive/search-client/compare/v1.1.3...v1.2.0) (2019-11-29)



<a name="1.1.3"></a>
## [1.1.3](https://github.com/the-haive/search-client/compare/v1.1.2...v1.1.3) (2019-11-13)


### Bug Fixes

* Allow filters to be added in the settings as a part of the query property on search-client initialization ([0c96c6e](https://github.com/the-haive/search-client/commit/0c96c6e))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/the-haive/search-client/compare/v1.1.1...v1.1.2) (2019-10-16)


### Bug Fixes

* Add url-polyfill for IE11 + make minified version default ([81b32ab](https://github.com/the-haive/search-client/commit/81b32ab))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/the-haive/search-client/compare/v1.1.0...v1.1.1) (2019-10-04)


### Bug Fixes

* clears stale oidc state entries after succesful signin ([a6f50d5](https://github.com/the-haive/search-client/commit/a6f50d5))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/the-haive/search-client/compare/v1.0.3...v1.1.0) (2019-09-18)


### Features

* Adds response mode option and state persistance to oidc authentication. ([d7b1a01](https://github.com/the-haive/search-client/commit/d7b1a01))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/the-haive/search-client/compare/v1.0.2...v1.0.3) (2019-09-17)


### Features

* Reduce package size by removing moment-locales during build ([e4104b2](https://github.com/the-haive/search-client/commit/e4104b2))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/the-haive/search-client/compare/v1.0.1...v1.0.2) (2019-09-11)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/IntelliSearch/search-client/compare/v1.0.0...v1.0.1) (2018-11-07)


### Bug Fixes

* **sample:** Set proper caching strategies for the various page resources. ([a2ea81b](https://github.com/IntelliSearch/search-client/commit/a2ea81b))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/IntelliSearch/search-client/compare/v1.0.0-rc.5...v1.0.0) (2018-11-05)


### Bug Fixes

* **search-client:** Added `categorizationType` to `SearchClient` class. Added and fixed unit-tests. ([9d01cdb](https://github.com/IntelliSearch/search-client/commit/9d01cdb))



<a name="1.0.0-rc.5"></a>
# [1.0.0-rc.5](https://github.com/IntelliSearch/search-client/compare/v1.0.0-rc.4...v1.0.0-rc.5) (2018-10-19)


### Features

* **search-client:** Added callback for when the query has changed, with info on whether the results are valid for the current query. ([599820b](https://github.com/IntelliSearch/search-client/commit/599820b))



<a name="1.0.0-rc.4"></a>
# [1.0.0-rc.4](https://github.com/IntelliSearch/search-client/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2018-10-17)


### Bug Fixes

* Trying to fix problem with webpack not creating the right code for the browser target. ([8a8fbb7](https://github.com/IntelliSearch/search-client/commit/8a8fbb7))
* **search-ui:** Always scroll to top of match-list after paging. ([d8b6f29](https://github.com/IntelliSearch/search-client/commit/d8b6f29))


### Features

* **search-ui:** Can use ui-settings to control whether or not to be able to show categoryPresentation config and settings config. By default off. ([60e70bf](https://github.com/IntelliSearch/search-client/commit/60e70bf))
* **search-ui:** Search-as-you-type not triggering after delay, and no min-length for query. ([e055027](https://github.com/IntelliSearch/search-client/commit/e055027))



<a name="1.0.0-rc.3"></a>
# [1.0.0-rc.3](https://github.com/IntelliSearch/search-client/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2018-10-16)


### Bug Fixes

* Fixes [#14](https://github.com/IntelliSearch/search-client/issues/14), [#15](https://github.com/IntelliSearch/search-client/issues/15), [#16](https://github.com/IntelliSearch/search-client/issues/16) ([12b7783](https://github.com/IntelliSearch/search-client/commit/12b7783))



<a name="1.0.0-rc.2"></a>
# [1.0.0-rc.2](https://github.com/IntelliSearch/search-client/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2018-10-16)


### Bug Fixes

* Fix for toggleCategoryExpansion. Refactored CategoryPresentation. Docs generated. ([8fac8b8](https://github.com/IntelliSearch/search-client/commit/8fac8b8))
* **docs:** Minor versioning error, and adjust doc build command ([6221860](https://github.com/IntelliSearch/search-client/commit/6221860))
* **query:** Changed query property setters to use coerced value equality checks (instead of referential equality checks) ([7762312](https://github.com/IntelliSearch/search-client/commit/7762312))



<a name="1.0.0-rc.1"></a>
# [1.0.0-rc.1](https://github.com/IntelliSearch/search-client/compare/v1.0.0-beta.4...v1.0.0-rc.1) (2018-10-11)


### Bug Fixes

* Fix for toggleCategoryExpansion. Refactored CategoryPresentation. Docs generated. ([8fac8b8](https://github.com/IntelliSearch/search-client/commit/8fac8b8))
* **docs:** Minor versioning error, and adjust doc build command ([6221860](https://github.com/IntelliSearch/search-client/commit/6221860))



<a name="1.0.0-beta.4"></a>
# [1.0.0-beta.4](https://github.com/IntelliSearch/search-client/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2018-05-14)


### Bug Fixes

* The requestObject() method now uses pure JSON object for controlling headers. ([a4b0deb](https://github.com/IntelliSearch/search-client/commit/a4b0deb))



<a name="1.0.0-beta.3"></a>
# [1.0.0-beta.3](https://github.com/IntelliSearch/search-client/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2018-04-10)


### Bug Fixes

* Corrected the documentation for the SearchClient.uiLanguageCode setter. ([edbdec5](https://github.com/IntelliSearch/search-client/commit/edbdec5))



<a name="1.0.0-beta.2"></a>
# [1.0.0-beta.2](https://github.com/IntelliSearch/search-client/compare/v1.0.0-beta.0...v1.0.0-beta.2) (2018-04-10)


### Bug Fixes

* Update various dependencies to avoid issue when using library as a typescript library. ([1516266](https://github.com/IntelliSearch/search-client/commit/1516266))


### Features

* Added missing property for setting uiLangageCode. ([60c84e3](https://github.com/IntelliSearch/search-client/commit/60c84e3))



<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/IntelliSearch/search-client/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2018-03-26)


### Bug Fixes

* Update various dependencies to avoid issue when using library as a typescript library. ([1516266](https://github.com/IntelliSearch/search-client/commit/1516266))



<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/IntelliSearch/search-client/compare/v0.10.3...v1.0.0-beta.0) (2018-03-21)


### Features

* Support for REST interface v4 ([cd8772e](https://github.com/IntelliSearch/search-client/commit/cd8772e))



<a name="0.10.3"></a>
## [0.10.3](https://github.com/IntelliSearch/search-client/compare/v0.10.2...v0.10.3) (2017-07-14)


### Bug Fixes

* **Query:** The matchPage defaults to 1 (not 0). ([6c2b1c9](https://github.com/IntelliSearch/search-client/commit/6c2b1c9))



<a name="0.10.2"></a>
## [0.10.2](https://github.com/IntelliSearch/search-client/compare/v0.10.1...v0.10.2) (2017-03-29)


### Bug Fixes

* **Filters:** Fixes an issue where the filter url does not serialize properly when calling the backend. ([ae15ff0](https://github.com/IntelliSearch/search-client/commit/ae15ff0))



<a name="0.10.1"></a>
## [0.10.1](https://github.com/IntelliSearch/search-client/compare/v0.10.0...v0.10.1) (2017-03-29)


### Bug Fixes

* **Query:** The query props are now conditional, allowing esier construct of the settings object. ([ed617e7](https://github.com/IntelliSearch/search-client/commit/ed617e7))



<a name="0.10.0"></a>
# [0.10.0](https://github.com/IntelliSearch/search-client/compare/v0.9.4...v0.10.0) (2017-03-27)


### Features

* **filters:** New filter-structure for easier and more powerful usage of the categories chosen to be filters. ([ee045df](https://github.com/IntelliSearch/search-client/commit/ee045df))



<a name="0.9.4"></a>
## [0.9.4](https://github.com/IntelliSearch/search-client/compare/v0.9.3...v0.9.4) (2017-03-23)


### Bug Fixes

* Fixed defaults for OrderBy [#5](https://github.com/IntelliSearch/search-client/issues/5). dateFrom and dateTo can be set independently of each other. ([4cf2b9b](https://github.com/IntelliSearch/search-client/commit/4cf2b9b))



<a name="0.9.3"></a>
## [0.9.3](https://github.com/IntelliSearch/search-client/compare/v0.9.2...v0.9.3) (2017-03-20)


### Bug Fixes

* FIxed an important problem with how settings were applied to parent classes. Added more tests. Some documentation improvements. ([b483bb0](https://github.com/IntelliSearch/search-client/commit/b483bb0))



<a name="0.9.2"></a>
## [0.9.2](https://github.com/IntelliSearch/search-client/compare/v0.9.1...v0.9.2) (2017-03-17)


### Bug Fixes

* Fixed problem with bad url for lookups ([cde0fdd](https://github.com/IntelliSearch/search-client/commit/cde0fdd))



<a name="0.9.1"></a>
## [0.9.1](https://github.com/IntelliSearch/search-client/compare/v0.9.0...v0.9.1) (2017-03-17)


### Bug Fixes

* Missing json data-file, and fixed mutable data-set ([8bf908c](https://github.com/IntelliSearch/search-client/commit/8bf908c))



<a name="0.9.0"></a>
# [0.9.0](https://github.com/IntelliSearch/search-client/compare/v0.8.3...v0.9.0) (2017-03-17)


### Features

* Implemented support for clientCategoryFilters ([83eae6f](https://github.com/IntelliSearch/search-client/commit/83eae6f))



<a name="0.8.3"></a>
## [0.8.3](https://github.com/IntelliSearch/search-client/compare/v0.8.2...v0.8.3) (2017-03-15)



<a name="0.8.2"></a>
## [0.8.2](https://github.com/IntelliSearch/search-client/compare/v0.8.1...v0.8.2) (2017-03-15)



<a name="0.8.1"></a>
## [0.8.1](https://github.com/IntelliSearch/search-client/compare/v0.8.0...v0.8.1) (2017-03-14)



<a name="0.8.0"></a>
# [0.8.0](https://github.com/IntelliSearch/search-client/compare/v0.7.0...v0.8.0) (2017-03-14)


### Features

* Simplifying interface for main use. Some refactoring of properties. Support for passing in REST version (2 and 3). ([2e009b0](https://github.com/IntelliSearch/search-client/commit/2e009b0))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/IntelliSearch/search-client/compare/v0.6.3...v0.7.0) (2017-03-13)


### Features

* All services inherit BaseCall, cbBusy() -> cbRequest(), deferpdate(), jwt-simple instead of jsonwebtoken, documentation, lots of tests. ([e6b8eda](https://github.com/IntelliSearch/search-client/commit/e6b8eda))



<a name="0.6.3"></a>
## [0.6.3](https://github.com/IntelliSearch/search-client/compare/v0.6.2...v0.6.3) (2017-03-07)



<a name="0.6.2"></a>
## [0.6.2](https://github.com/IntelliSearch/search-client/compare/v0.6.1...v0.6.2) (2017-03-07)


### Bug Fixes

* More documentation and trigger fixes. ([c4da914](https://github.com/IntelliSearch/search-client/commit/c4da914))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/IntelliSearch/search-client/compare/v0.6.0...v0.6.1) (2017-03-06)


### Bug Fixes

* Fixed the defaults for settings and triggers - again. This time properly (famous last words...). ([d4a2259](https://github.com/IntelliSearch/search-client/commit/d4a2259))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/IntelliSearch/search-client/compare/v0.5.1...v0.6.0) (2017-03-06)


### Features

* Support for three different callbacks (busy, success and error) instead of just one.  ([f8f1627](https://github.com/IntelliSearch/search-client/commit/f8f1627))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/IntelliSearch/search-client/compare/v0.5.0...v0.5.1) (2017-03-06)


### Bug Fixes

* Better way of setting up settings for SearchClient and operational interfaces. ([49b54ae](https://github.com/IntelliSearch/search-client/commit/49b54ae))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/IntelliSearch/search-client/compare/v0.4.8...v0.5.0) (2017-03-04)


### Features

* Improved architecture. ([6df4d51](https://github.com/IntelliSearch/search-client/commit/6df4d51))



<a name="0.4.8"></a>
## [0.4.8](https://github.com/IntelliSearch/search-client/compare/v0.4.7...v0.4.8) (2017-02-23)


### Bug Fixes

* Made the fetch call send url separately ([af966b4](https://github.com/IntelliSearch/search-client/commit/af966b4))



<a name="0.4.7"></a>
## [0.4.7](https://github.com/IntelliSearch/search-client/compare/v0.4.6...v0.4.7) (2017-02-23)


### Bug Fixes

* Cannot have const url ([cd8e5c1](https://github.com/IntelliSearch/search-client/commit/cd8e5c1))



<a name="0.4.6"></a>
## [0.4.6](https://github.com/IntelliSearch/search-client/compare/v0.4.5...v0.4.6) (2017-02-23)


### Bug Fixes

* New build chain to make sure proper module and that we are testing the final code. ([a771d1e](https://github.com/IntelliSearch/search-client/commit/a771d1e))



<a name="0.4.5"></a>
## [0.4.5](https://github.com/IntelliSearch/search-client/compare/v0.4.4...v0.4.5) (2017-02-20)


### Bug Fixes

* Minor tuning, removing illegal optional properties in classes. ([6704523](https://github.com/IntelliSearch/search-client/commit/6704523))



<a name="0.4.4"></a>
## [0.4.4](https://github.com/IntelliSearch/search-client/compare/v0.4.3...v0.4.4) (2017-02-20)


### Bug Fixes

* Make the search-client.d.ts be generated as module ([d05fff1](https://github.com/IntelliSearch/search-client/commit/d05fff1))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/IntelliSearch/search-client/compare/v0.4.2...v0.4.3) (2017-02-19)


### Bug Fixes

* Upgraded domain-task to fix fetch headers not set ([94bcda4](https://github.com/IntelliSearch/search-client/commit/94bcda4))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/IntelliSearch/search-client/compare/v0.4.1...v0.4.2) (2017-02-15)


### Bug Fixes

* Better way of adding authorization headers ([323bf8e](https://github.com/IntelliSearch/search-client/commit/323bf8e))
* Minor issue with what settings object to accept as param for autocomplete, find and categorize ([b49123a](https://github.com/IntelliSearch/search-client/commit/b49123a))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/IntelliSearch/search-client/compare/v0.4.0...v0.4.1) (2017-02-15)


### Bug Fixes

* Autocomplete-url fix and more robust baseUrl. Added more tests. ([d223961](https://github.com/IntelliSearch/search-client/commit/d223961))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/IntelliSearch/search-client/compare/v0.3.1...v0.4.0) (2017-02-10)


### Features

* adds use of jwt authentication (will not renew or fetch tokens) ([91c9d7c](https://github.com/IntelliSearch/search-client/commit/91c9d7c))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/IntelliSearch/search-client/compare/v0.3.0...v0.3.1) (2017-02-10)


### Bug Fixes

* autocomplete, find and categorize failed when merging settings with active options. Autocomplete also didi not handle options as it should. ([c0821dc](https://github.com/IntelliSearch/search-client/commit/c0821dc))



<a name="0.3.0"></a>
# 0.3.0 (2017-02-10)


### Features

* implements all search-service REST interfaces. Note: autocomplete, bestBets and allCategories needs testing. ([54a8eb1](https://github.com/IntelliSearch/search-client/commit/54a8eb1))



<a name="0.2.0">First version with new repo and project layout</a>
# 0.2.0 (2017-02-04)
