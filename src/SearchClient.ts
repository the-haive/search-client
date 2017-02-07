//import * as merge from 'deepmerge';
import { fetch } from 'domain-task';
import { baseUrl as rootUrl } from 'domain-task/fetch';
import { isWebUri } from 'valid-url';

import { Settings } from './Settings';
import { Matches } from './Matches';
import { Categories } from './Categories';
import { Query } from './Query';

export * from './Categories';
export * from './Category';
export * from './Group';
export * from './Matches';
export * from './MatchItem';
export * from './MetaList';
export * from './OrderBy';
export * from './Query';
export * from './SearchType';
export * from './Settings';

export class SearchClient {
    /** The endpoint url for the autocomplete() call. */
    public autocompleteUrl: string;
    /** The endpoint url for the allCategories() call. */
    public allCategoriesUrl: string;
    /** The endpoint url for the bestBets() call. */
    public bestBetsUrl: string;
    /** The endpoint url for the categorize() call. */
    public categorizeUrl: string;
    /** The endpoint url for the find() call. */
    public findUrl: string;

    private settings: Settings;

    /** 
     * The SearchClient constructor allows you to create a 'search-client' instance that allows
     * execuing find(), categorize(), autocomplete(), bestBets() and allCategories() calls on the 
     * search engine that it connects to.
     * @param baseUrl - The baseUrl for the search-engine, typically 'http:<search-server.domain>/RestService/v3/'
     * @param settings - A settings object for more control of initialization values.
     */
    //constructor(settings: Settings){
    constructor(baseUrl: string, settings?: Settings) {
        if (!isWebUri(baseUrl)) {
            throw new Error('Error: No baseUrl is defined. Please supply a valid baseUrl in the format: '
            + 'http[s]://<domain.com>[:port][/path]. If using default relative endpoints then this should '
            + 'be just the domain.com, without additional path and without trailing slash.');
        }

        // The domain-task fetch needs tis for non-browser environments.
        let match = baseUrl.split('/');
        rootUrl(`${match[0]}//${match[2]}/`);

        this.settings = new Settings(settings);

        this.allCategoriesUrl = baseUrl + (this.settings.url.allCategories || '/search/allcategories');
        this.autocompleteUrl = baseUrl + (this.settings.url.autocomplete || '/autocomplete');
        this.bestBetsUrl = baseUrl + (this.settings.url.bestBets || '/manage/bestbets');
        this.categorizeUrl = baseUrl + (this.settings.url.categorize || '/search/categorize');
        this.findUrl = baseUrl + (this.settings.url.find || '/search/find');
    }

    public find(query: Query, callback?: (matches: Matches) => any): Promise<Matches> {
        query = query || new Query();
        // TODO
        // * Use the passed query to override the current query, which in turn overrides the settings query
        // * If a resultHandler is set then we deliver the results to it via a callback.
        // * We return/fulfill the promise anyhow, so that the caller can use it anyway they want.
        // But, in any case, we store the current-page so that we know how to get page before/after.
        //this.query = merge(this.settings.query, this.query, query);
        // The find query-options also needs to be passed to the rest-style interface.
        const url = `${this.findUrl.toString()}${query.toFindUrlParam()}`;

        return fetch(url, { credentials: "include" })
            .then((response: Response) => {
                if (!response.ok) {
                    throw new Error(`${response.status} ${response.statusText}`);
                }

                return response.json();
            })
            .then((response: Matches) => {
                // At this stage we know that the data received is good
                // TODO: Store the page-ref
                if (callback || this.settings.callback.find) {
                    (callback || this.settings.callback.find)(response);
                }

                return response;
            })
            .catch(error => {
                console.dir(error);

                return Promise.reject(new Error(`'find' failed: ${error.stack}`));
            });
    }

    public categorize(query: Query, callback?: (categories: Categories) => any): Promise<Categories> {
        query = query || new Query();
        // TODO
        // * Use the query to set the url params
        // * If a resultHandler is set then we deliver the results to it via a callback.
        // * We return/fulfill the promise anyhow, so that the caller can use it anyway they want.
        //this.query = merge(this.settings.query, this.query, query);

        const url = `${this.categorizeUrl.toString()}${query.toCategorizeUrlParam()}`;
        return fetch(url, { credentials: "include" })
            .then((response: Response) => {
                if (!response.ok) {
                    throw new Error(`${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then((response: Categories) => {
                if (callback || this.settings.callback.categorize) {
                    (callback || this.settings.callback.categorize)(response);
                }

                return response;
            })
            .catch(error => {
                return Promise.reject(new Error("When calling 'categorize': " + error));
            });
    }

    // allCategories(): Promise<Categories>{
    //     // * If a resultHandler is set then we deliver the results to it via a callback.
    //     // * We return/fulfill the promise anyhow, so that the caller can use it anyway they want.

    //     return fetch(this.allCategoriesUrl.toString(), { credentials: "include" })
    //         .then((response) => {
    //             if (!response.ok){
    //                 throw Error(response.statusText);
    //             }
    //             return response.json();
    //         })
    //         .then((response:Categories) => {
    //             if (this.settings.allCategories.handler)
    //                 this.settings.allCategories.handler(response);
    //             return response;
    //         })
    //         .catch(error => {
    //             throw Error("Error when calling 'allCategories': " + error);
    //         });
    // }

    // bestBets(query: Query): Promise<any[]>{
    //     // * If a resultHandler is set then we deliver the results to it via a callback.
    //     // * We return/fulfill the promise anyhow, so that the caller can use it anyway they want.
    //     this.query = merge(this.settings.query, this.query, query);

    //     return fetch(this.bestBetsUrl.toString(), { credentials: "include" })
    //         .then((response) => {
    //             if (!response.ok){
    //                 throw Error(response.statusText);
    //             }
    //             return response.json();
    //         })
    //         .then((response:any[]) => {
    //             if (this.settings.bestBets.handler)
    //                 this.settings.bestBets.handler(response);
    //             return response;
    //         })
    //         .catch(error => {
    //             throw Error("Error when calling 'bestBets': " + error);
    //         });
    // }

    // page(n:number){}

    // pageNext(){}

    // pagePrevious(){}

    // pageFirst(){return this.page(0);}

    // filterAdd(name: string){}

    // filterRemove(){}

    // filterContains(){}
}

// 		this.page = {
// 			_data: <FindMatchesData>{},
// 			next: () => {
// 				return new Promise<FindMatches>( (resolve, reject) => {
// 					this.page._data.params = this.page._data.original.params;
// 					this.page._data.params.page = this.page._data.original.params.page + 1;
// 					this.find(this.page._data.original.query, this.page._data.params)
//                     .then( response => {
// 						resolve(response);
// 					});
// 				});
// 			},
// 			previous: () => {
// 				return new Promise<FindMatches>( (resolve, reject) => {
// 					this.page._data.params = this.page._data.original.params;
// 					this.page._data.params.page = this.page._data.original.params.page - 1;
// 					this.find(this.page._data.original.query, this.page._data.params)
//                     .then( response => {
// 						resolve(response);
// 					});
// 				});
// 			},
// 			number: (n) => {
// 				return new Promise<FindMatches>( (resolve, reject) => {
// 					this.page._data.params = this.page._data.original.params;
// 					this.page._data.params.page = n;
// 					this.find(this.page._data.original.query, this.page._data.params)
//                     .then( response => {
// 						resolve(response);
// 					});
// 				});
// 			},
// 			first: () => {
// 				return new Promise<FindMatches>( (resolve, reject) => {
// 					this.page._data.params = this.page._data.original.params;
// 					this.page._data.params.page = 1;
// 					this.find(this.page._data.original.query, this.page._data.params)
//                     .then( response => {
// 						resolve(response);
// 					});
// 				});
// 			},
// 			last: () => {
// 				return new Promise<FindMatches>( (resolve, reject) => {
// 					this.page._data.params = this.page._data.original.params;
// 					this.page._data.params.page = this.page._data.estimatedPageCount;
                    
//                     this.find(this.page._data.original.query, this.page._data.params)
//                     .then( response => {
// 						resolve(response);
// 					});
// 				});
// 			}
// 		};
        
// 		this.categories = {
// 			_data: {},
// 			count: () => {
// 				return this.categories._data.matchCount;
// 			}
// 		};
        
// 		this.filters = {
// 			_data: {},
// 			add: (name) => {
// 				this.filters._data[name] = name;
// 			},
// 			remove: (name) => {
// 				if (!this.filters._data[name]) { return false; }
// 				this.filters._data[name].delete();
// 			},
// 			empty: () => {
// 				this.filters._data = {};
// 			},
// 			toString: () => {
// 				let filtersArr = [];
// 				for (let i in this.filters._data) {
// 					if (!this.filters._data[i] || !this.filters._data.hasOwnProperty(i)) { continue; }
// 					filtersArr.push(this.filters._data[i]);
// 				}
// 				return filtersArr.join(';');
// 			}
// 		};
        
// 		this.suggestions = {
// 			_data: {},
// 			count: () => {
// 				return this.suggestions._data.suggestions.length;
// 			},
// 			get: () => {
// 				return this.suggestions._data.suggestions || [];
// 			}
// 		};
        
// 		if (this.settings.searchField && settings.searchFieldOptions) {
//             let options = this.settings.searchFieldOptions;
            
//             if (options.execute) {
//                 this.settings.searchField.addEventListener('keyup', (e) => {
//                     if (options.execute.findAndCategorize) {
//                         if (options.execute.findAndCategorize.onEnter) {
//                             if (e.keyCode == 13) {
//                                 this.search(this.settings.searchField.value);
//                             }
//                         }
//                         if (options.execute.findAndCategorize.onWhitespace) {
                            
//                         }
//                         if (options.execute.findAndCategorize.onWordCharacter) {
                            
//                         }
//                     }
//                     if (options.execute.autocomplete) {
//                         if (options.execute.autocomplete.minLength) {
//                             if (this.settings.searchField.value.length >= options.execute.autocomplete.minLength) {
//                                 this.suggest(this.settings.searchField.value);
//                             }
//                         }
//                     }
//                 });
//             }
// 		}
// 	}

// 	/**
// 	 * Execute both Find and Categorize
// 	 * @method Search
// 	 * @memberof IntelliSearch
// 	 * @param {string} query - The search query
// 	 * @param {Function} [findHandlerOverride=null] - A custom function to be used for handling the Find
// 	 * @param {Function} [categorizeHandlerOverride=null] - A custom function to be used for handling the Categorize
// 	 * @returns {Promise}
// 	 */
// 	search(query:string = null, findHandlerOverride:Function = null, categorizeHandlerOverride:Function = null) {

// 		// TODO: Need to find a way to get handler overrides to work without losing context of `this` in the Promise.all call
// 		// let findHandler = findHandlerOverride || this.Find;
// 		// let categorizeHandler = categorizeHandlerOverride || this.Categorize;

// 		return new Promise( (resolve, reject) => {
// 			Promise.all([this.find(query), this.categorize(query)])
//             .then( (data) => {
// 				resolve(data);
// 			})
//             .catch( (error) => {
// 				reject(Error(error));
// 			});
// 		});
// 	}

// 	/**
// 	 * Suggest autocomplete entries for a query
// 	 * @method
// 	 * @memberof IntelliSearch
// 	 * @param {string} query - The search query
// 	 * @param {Object} [params] - Search parameters
// 	 * @returns {Promise}
// 	 */
// 	suggest(query:string = null, params = {}) {
        
// 		let paramsStr = '';
// 		for (let key in params) {
// 			if (paramsStr != '') { paramsStr += '&'; }
// 			paramsStr += key + '=' + encodeURIComponent(params[key]);
// 		}
// 		let url = this.settings.autocompleteUrl + query + (paramsStr != '' ? '?' + paramsStr : '');
// 		let request = new Request(url, this.settings.request);

// 		return new Promise( (resolve, reject) => {
// 			fetch(request)
//             .then(response => {
// 				return response.json();
// 			})
//             .then(data => {
// 				let newData = {
// 					suggestions: data,
// 					original: { query, params, url }
// 				};
// 				this.suggestions._data = newData;
// 				resolve(this.suggestions);
// 			});
// 		});

// 	}

// 	/**
// 	 * Execute a find
// 	 * @method
// 	 * @memberof IntelliSearch
// 	 * @param {string} query - The search query
// 	 * @param {Object} [params] - Search parameters
// 	 * @returns {Promise}
// 	 */
// 	find(query:string = null, params: FindQueryParams = {}) {

// 		let filters = this.filters.toString();
// 		if (filters != '') { params.filters = filters; }

// 		let paramsStr = '';
// 		for (let key in params) {
// 			paramsStr += '&';
// 			paramsStr += key + '=' + encodeURIComponent(params[key]);
// 		}

// 		let url = this.settings.findUrl + query + paramsStr;
// 		let request = new Request(url, this.settings.request);

// 		return new Promise<FindMatches>( (resolve, reject) => {
// 			fetch(request)
//             .then(response => {
// 				return response.json();
// 			})
//             .then(data => {
// 				let pageSize = params.pageSize || params.s || 10;
// 				let estimatedPageCount = Math.ceil(data.EstimatedMatchCount / pageSize);
// 				let original = { query, params, url };
// 				original.params.pageNum = data.original.params.pageNum || 1;
// 				this.page._data = {
//                     params: data.params,
//                     original: { query, params, url },
//                     estimatedPageCount: Math.ceil(data.EstimatedMatchCount / pageSize),
//                     matches: data
//                 };
// 				resolve(this.page);
// 			});
// 		});
// 	}

// 	/**
// 	 * Execute a Categorize
// 	 * @method
// 	 * @memberof IntelliSearch
// 	 * @param {string} query - The search query
// 	 * @param {Object} [params] - Search parameters
// 	 * @returns {Promise}
// 	 */
// 	categorize(query:string = null, params: CategorizeQueryParams = {}) {

// 		let filters = this.filters.toString();
// 		if (filters != '') { params.filters = filters; }

// 		let paramsStr = '';
// 		for (let key in params) {
// 			paramsStr += '&';
// 			paramsStr += key + '=' + encodeURIComponent(params[key]);
// 		}
// 		paramsStr = paramsStr.replace("%7C", "|");
// 		let url = this.settings.categorizeUrl + query + paramsStr;
// 		let request = new Request(url, this.settings.request);
    
// 		return new Promise( (resolve, reject) => {
// 			fetch(request)
//             .then(response => {
// 				return response.json();
// 			})
//             .then(data => {
// 				data.original = { query, params, url };
// 				this.categories._data = data;
// 				resolve(this.categories);
// 			});
// 		});

// 	}

// 	/**
// 	 * Get all categories that contain any document
// 	 * @method 
// 	 * @memberof IntelliSearch
// 	 * @returns {Promise}
// 	 */
// 	getAllCategories() {

// 		let url = this.settings.allCategoriesUrl;
// 		let request = new Request(url, this.settings.request);

// 		return new Promise( (resolve, reject) => {
// 			fetch(request)
//             .then(response => {
// 				return response.json();
// 			})
//             .then(data => {
// 				resolve(data);
// 			});
// 		});
// 	}
// }

function isNullOrWhitespace(input: string): boolean {
  return !input || !input.trim();
}
