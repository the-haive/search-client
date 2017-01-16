import * as merge from 'deepmerge';
import { fetch } from 'domain-task';

import Settings from './Settings';
import Matches from './Matches';
import Categories from './Categories';
import Query from './Query';
import Filters from './Filters';
import Suggestions from './Suggestions';

export { Settings, Matches, Categories, Query, Filters, Suggestions };

export default class SearchClient {
    private settings: Settings;

	/** The endpoint url for the autocomplete() call. */
	public autocompleteUrl: URL;
	/** The endpoint url for the allCategories() call. */
	public allCategoriesUrl: URL;
	/** The endpoint url for the bestBets() call. */
	public bestBetsUrl: URL;
	/** The endpoint url for the categorize() call. */
	public categorizeUrl: URL;
	/** The endpoint url for the find() call. */
	public findUrl: URL;

	/** The query settings for the search. */
	public query: Query; 

	/** 
	 * The SearchClient constructor allows you to create a 'search-client' instance that allows
	 * execuing find(), categorize(), autocomplete(), bestBets() and allCategories() calls on the 
	 * search engine that it connects to.
	 */
    constructor(settings: Settings){
		if (isNullOrWhitespace(settings.baseUrl)) {
			throw new Error('Error: No baseUrl is defined. Please supply a valid baseUrl.');
		}

		this.settings = {...settings};
		this.allCategoriesUrl = new URL(settings.allCategories.url || `${settings.baseUrl}/search/allcategories`);
		this.autocompleteUrl = new URL(settings.autocomplete.url || `${settings.baseUrl}/autocomplete`);
		this.bestBetsUrl = new URL(settings.bestBets.url || `${settings.baseUrl}/manage/bestbets`);
		this.categorizeUrl = new URL(settings.categorize.url || `${settings.baseUrl}/search/categorize`);
		this.findUrl = new URL(settings.find.url || `${settings.baseUrl}/search/find`);
	}

	find(query: Query) : Promise<Matches> {
		// TODO
		// * Use the passed query to override the current query, which in turn overrides the settings query
		// * If a resultHandler is set then we deliver the results to it via a callback.
		// * We return/fulfill the promise anyhow, so that the caller can use it anyway they want.
		// But, in any case, we store the current-page so that we know how to get page before/after.
		this.query = merge(this.settings.query, this.query, query);

		return fetch(this.settings.find.url.toString(), { credentials: "include" })
			.then((response) => {
				if (!response.ok){
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then((response:Matches) => {
				// At this stage we know that the data received is good
				// TODO: Store the page-ref

				if (this.settings.find.handler)
					this.settings.find.handler(response);
				return response;
			})
			.catch(error => {
				throw Error("Error when calling 'find': " + error);
			});
	}

	categorize(query: Query) : Promise<Categories>{
		// TODO
		// * Use the query to set the url params
		// * If a resultHandler is set then we deliver the results to it via a callback.
		// * We return/fulfill the promise anyhow, so that the caller can use it anyway they want.
		this.query = merge(this.settings.query, this.query, query);

		return fetch(this.settings.categorize.url.toString(), { credentials: "include" })
			.then((response) => {
				if (!response.ok){
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then((response:Categories) => {
				if (this.settings.categorize.handler)
					this.settings.categorize.handler(response);
				return response;
			})
			.catch(error => {
				throw Error("Error when calling 'categorize': " + error);
			});
	}

	allCategories(): Promise<Categories>{
		// * If a resultHandler is set then we deliver the results to it via a callback.
		// * We return/fulfill the promise anyhow, so that the caller can use it anyway they want.

		return fetch(this.settings.allCategories.url.toString(), { credentials: "include" })
			.then((response) => {
				if (!response.ok){
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then((response:Categories) => {
				if (this.settings.allCategories.handler)
					this.settings.allCategories.handler(response);
				return response;
			})
			.catch(error => {
				throw Error("Error when calling 'allCategories': " + error);
			});
	}

	bestBets(query: Query): Promise<any[]>{
		// * If a resultHandler is set then we deliver the results to it via a callback.
		// * We return/fulfill the promise anyhow, so that the caller can use it anyway they want.
		this.query = merge(this.settings.query, this.query, query);

		return fetch(this.settings.bestBets.url.toString(), { credentials: "include" })
			.then((response) => {
				if (!response.ok){
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then((response:any[]) => {
				if (this.settings.bestBets.handler)
					this.settings.bestBets.handler(response);
				return response;
			})
			.catch(error => {
				throw Error("Error when calling 'bestBets': " + error);
			});
	}

	page(n:number){}

	pageNext(){}

	pagePrevious(){}

	pageFirst(){return this.page(0);}

	filterAdd(name: string){}

	filterRemove(){}

	filterContains(){}
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