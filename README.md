# Haive SearchClient

[![NPM](https://nodei.co/npm/search-client.png?compact=true)](https://npmjs.com/package/search-client)
[![NPM Downloads](https://img.shields.io/npm/dt/search-client.svg)](https://npmjs.com/package/search-client)
[![Build Status](https://semaphoreci.com/api/v1/spiralis/search-client/branches/master/shields_badge.svg)](https://semaphoreci.com/spiralis/search-client)

## Project links

- <a href="https://the-haive.github.io/search-client/">Documentation</a>
- <a href="https://www.npmjs.com/package/search-client">Node Package Manager</a>
- <a href="https://www.jsdelivr.com/package/npm/search-client">CDN at JSDelivr</a>
- <a href="https://github.com/the-haive/search-client">GitHub repository</a>
- <a href="https://github.com/the-haive/search-client/issues">Issues</a>
- <a href="https://github.com/the-haive/search-client/blob/master/CHANGELOG.md">Changelog</a>

## About

The SearchClient library makes it easy to hook up your search-UI to a Haive SearchManager instance (see the app-search features of [Haive App Search here](https://haive.ai/solutions/application-search/)).

The package handles all the backend web-services so that you can focus on the user interface instead.

The SearchClient wraps and manages all the Haive SearchManager REST web-services:

- **Autocomplete** - Lookups query-text and suggests words to help write the query.
- **Find** - Searches the index based on the current query (query-text, filters, ...).
- **Categorize** - Generates a category tree with counts based on the current query (query-text, filters, ...)

In addition, it also handles a OpenID authentication.

## Use in NPM projects

For projects that consumes npm packages natively you add this package as you would add any other npm-package:

    > npm install --save search-client

Since we have implemented the search-client in Typescript all the data-types and signatures are available for your IDE to use as intellisense. Please also use the documentation available in the generated API-documentation in the search-client doc-folder (typically ./node_modules/search-client/doc/index.html).

## Use in browser (via script-tag)

For web-pages that needs to have a script-tag embedded you can fetch the file(s) needed via the jsDelivr cdn, like this:

    <script src="//cdn.jsdelivr.net/npm/search-client@{version}/dist/IntelliSearch.min.js"></script>

\- where `{version}` is to be replaced with the actual version you want.

**CDN version aliases:**

We strongly recommend that you use the full version id for production sites. For development sites we do recommend the same, but we also see that using a version alias might be handy in some cases.

- `latest`
  You *can* use the jsdelivr version alias `latest` to always just get the latest version. Just be warned that your site is at high risk of breaking when new versions of the search-client are released. If the search-client library is updated and somehow is no longer compatible with your code, then your site will potentially break and stop working.

- `<Major>` (i.e. `1`)
  This means that it will get the latest version for the given major version. Note that the same warning as for `latest` applies, although this is less risky than just getting any `latest` version.

- `<Major.Minor>` (i.e. `1.1`)
  This means that it will get the latest version for the given major.minor version. Note that the same warning as for `latest` applies, although this is less risky than both of the above options.

**Note:** You can replace `dist` with `es` to get different builds of the library too. For browser script you should use `dist` as that version is in UMD format.
A benefit to using the npm system is the inclusion of `map`-files. These are available for the `es` and `lib` versions only. Next to the browser-bundles in the project you can find accompanying `.map` files that browsers are able to utilize in order to give a better debugging experience.

## License

<a href="../LICENSE">LICENCE</a>
