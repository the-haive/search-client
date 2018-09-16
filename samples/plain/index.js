/**
 * TODO: Search-client categories/filters
 * I am thinking we can create a dictionary, based on the joined array-names as the key,
 * and the value is a tuple that contains the actual category and the parent.
 * That solution would make it fast to identify filters/categories, while at the same
 * time allow iterating up from the leaf to find the displayNames of each category.
 *
 * TODO: UI errors
 * Tune showing errors:
 * https://intellisearch.slack.com/archives/D3TMK937F/p1536833917000100 -->
 * - Ved feil i forbindelse med autocomplete så viser vi en varseltrekant istedetfor spinner ved query-feltet.
 * - Ved feil i forbindelse med henting av søketreff så viser vi en feilmelding i match-listen (liten
 *   varseltrekant pluss tekst, med tilleggsknapp for å se detaljer/rapportere problemet.
 * - Ved feil i forbindelse med henting av kategorier så viser vi en trekant med feilbeskrivelse i kategori-
 *   feltet, med tilleggsknapp for å se detaljer/rapportere problemet.
 * - Men, ved feil i både kategori og matches så viser vi en felles feil-melding.
 */

function load(file) {
    return fetch(file, {
        "Content-Type": "text/json",
        credentials: "include"
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error();
            }
        })
        .then(json => json)
        .catch(err => {
            console.warn(
                `Failed to find/read ${file} on the server. Using empty object as input.`
            );
            return {};
        });
}

window.onload = function() {
    moment.locale(window.navigator.language);
    //////////////////////////////////////////////////////////////////////////////////////////
    // 1. First create a settings object that is sent to the search-engine.
    //    We first try to load a default from the settings file on the server.
    //////////////////////////////////////////////////////////////////////////////////////////
    let searchSettings = {};
    let uiSettings = {};
    Promise.all([
        load("./search-settings.json").then(ss => {
            searchSettings = ss;
        }),
        load("./ui-settings.json").then(ui => {
            uiSettings = ui;
        })
    ]).then(() => {
        setupIntelliSearch(searchSettings, uiSettings);
        setupTabs();
    });
};

function setupIntelliSearch(searchSettings, uiSettings) {
    //////////////////////////////////////////////////////////////////////////////////////////
    // 2. We then override this by adding any defined values here.
    //    Note: Should only add the callback methods.
    //////////////////////////////////////////////////////////////////////////////////////////
    let searchOverrideSettings = {
        authentication: {
            cbRequest: handleAuthenticationRequest,
            cbSuccess: handleAuthenticationSuccess,
            cbError: handleAuthenticationError
        },
        autocomplete: {
            cbRequest: handleAutocompleteRequest,
            cbSuccess: handleAutocompleteSuccess,
            cbError: handleAutocompleteError
        },
        find: {
            cbRequest: handleFindRequest,
            cbSuccess: handleFindSuccess,
            cbError: handleFindError
        },
        categorize: {
            cbRequest: handleCategorizeRequest,
            cbSuccess: handleCategorizeSuccess,
            cbError: handleCategorizeError
        }
    };

    let mergedSettings = mergeDeep(searchSettings, searchOverrideSettings);
    searchSettings = new IntelliSearch.Settings(mergedSettings);

    //////////////////////////////////////////////////////////////////////////////////////////
    // 3. Set up the ui settings.
    //    These provide a simple means to controlling the rendering.
    //////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////
    // 4. If needed, tune the rendering templates to adjust the output according to your wishes.
    //    These provide a simple means to controlling the rendering.
    //////////////////////////////////////////////////////////////////////////////////////////

    // prettier-ignore
    const render = {
        match: {
            // Required
            stats: (matches) => {
                if (matches.estimatedMatchCount > 0) {
                    return `
                        <span>About ${matches.estimatedMatchCount} matches</span>
                    `;
                } else {
                    return "No matches";
                }
            },
            pager: {
                label : () => `
                    <span>Goto page:</span>
                `,
                prev: (i, disabled) => `
                    <span title="${disabled ? "" : "Previous page"}">《</span>
                `,
                first: (i) => `
                    <span title="First page">${i}</span>
                `,
                page: (i, selected) => `
                    <span title="${selected ? "" : "Goto page ${i}"}">${i}</span>
                `,
                last: (i) => `
                    <span title="Last page">${i}</span>
                `,
                next: (i, disabled) => `
                    <span title="${disabled ? "" : "Next page"}">》</span>
                `,
                ellipsis: () => `
                    …
                `,
            },
            // Required
            item: (match) => `
                <div class="item">
                    ${render.match.title(match.title, match.url)}
                    ${render.match.modDate(match.date)}
                    ${render.match.abstracts(match.abstracts)}
                    ${render.match.extracts(match.extracts)}
                    ${render.match.categories(match.categories)}
                </div>
            `,
            // The rest are optional and depends on references in the above
            categories: (categories) => uiSettings.match.categories.show && categories && categories.length > 0
                ? `
                    <div class="categories" title="Categories associated with the match">
                        ${collect(
                            categories,
                            (category) => {
                                if (excluded(category, uiSettings.match.categories.exclude)) {
                                    return "";
                                } else {
                                    const catName = getLocalizedCategoryName(client, category);
                                    const shortCatName = truncateMiddleEllipsis(catName, 20);
                                    let isFilterClass = client.isFilter(category.split("|")) ? " is-filter" : "";
                                    return `<span class="category${isFilterClass}" data-category="${category}" title="${catName}">${shortCatName}</span>`;
                                }
                            })}
                    </div>
                    `
                : ``
            ,
            abstracts: (abstracts) => abstracts && abstracts.length > 0
                ? `
                    <div class="abstracts" title="Match abstract, ingress or similar">
                        ${collect(abstracts, (abstract) => `<span class="abstract">${abstract}</span>`)}
                    </div>
                  `
                : ``
            ,
            extracts: (extracts) => extracts && extracts.length > 0
                ? `
                    <div class="extracts" title="Extract of where the item has matches">
                        ${collect(extracts, (extract) => `<span class="extract">${extract}</span>`)}
                    </div>
                  `
                : ``
            ,
            modDate: (dateString) => {
                let date = moment(new Date(dateString));
                return `<span class="date" title="Modified: ${date.format("dddd, MMMM Do YYYY, hh:mm:ss")}">[~ ${date.fromNow()}]</span>`;
            },
            title: (title, url) => `
                <a class="title" href="${url}" title="${title}">${title}</a>
            `,
        },
        details: {
            title: (match) => `
                <span class="title">${match.title}</span>
            `,
            // Required
            content: (content) => `
                <p>${content.join("</p><p>")}</p>
            `,
            // Required
            properties: (match) => `
                ${render.details.itemProperties(match)}
                ${render.details.itemMetadata(match.metaList)}
                ${render.details.itemCategories(match.categories)}
            `,
            itemProperties: (match) => {
                if (!uiSettings.details.properties.show) return "";
                let items = [];
                for (let property in match) {
                    if (match.hasOwnProperty(property)) {
                        if (!excluded(property, uiSettings.details.properties.exclude)) {
                            items.push(property);
                        }
                    }
                }
                return `
                    <h2>Properties</h2>
                    <dl class="properties">
                        ${collect(items, (prop) => `
                            <dt title="${prop}">${prop}</dt>
                            <dd title="${match[prop]}">${match[prop]}</dd>
                        `)}
                    </dl>
                `;
            },
            itemMetadata: (metadata) => {
                if (!uiSettings.details.metadata.show) return "";
                let items = [];
                for (let meta of metadata) {
                    if (!excluded(meta.key, uiSettings.details.metadata.exclude)) {
                        items.push(meta);
                    }
                }
                return `
                    <h2>Metadata</h2>
                    <dl class="metadata">
                        ${collect(items, (meta) => `
                            <dt title="${meta.key}">${meta.key}</dt>
                            <dd title="${meta.value}">${meta.value}</dd>
                        `)}
                    </dl>
                `;
            },
            itemCategories: (categories) => {
                if (!uiSettings.details.categories.show) return "";
                let items = [];
                for (let category of categories) {
                    if (!excluded(category, uiSettings.details.categories.exclude)) {
                            items.push(category);
                    }
                }
                return `
                    <h2>Categories</h2>
                    <ul class="categories">
                        ${collect(items, (cat) => {
                            const catName = getLocalizedCategoryName(client, cat);
                            return `
                                <li title="${catName}">${catName}</li>
                            `;
                        })}
                    </ul>
                `;
            },
        },
        error: {
            find: (error, stack) => `
                <h4>Find:</h4>
                <ul>
                    <li>
                        <span class="key">Message:</span>
                        <span class="message">${error.message}</span>
                    </li>
                    <li>
                        <span class="key">Stacktrace:</span><br/>
                        <span class="stacktrace">${stack}</span>
                    </li>
                    <li>
                        <span class="key">Internal stacktrace:</span><br/>
                        <span class="stacktrace">${error.stack}</span>
                    </li>
                </ul>
            `,
            categorize: (error, stack) => `
                <h4>Categorize:</h4>
                <ul>
                    <li>
                        <span class="key">Message:</span>
                        <span class="message">${error.message}</span>
                    </li>
                    <li>
                        <span class="key">Stacktrace:</span><br/>
                        <span class="stacktrace">${stack}</span>
                    </li>
                    <li>
                        <span class="key">Internal stacktrace:</span><br/>
                        <span class="stacktrace">${error.stack}</span>
                    </li>
                </ul>
            `,
            generic: (error, stack) => `
                <h4>Generic:</h4>
                <ul>
                    <li>
                        <span class="key">Message:</span>
                        <span class="message">${error.message}</span>
                    </li>
                    <li>
                        <span class="key">Stacktrace:</span><br/>
                        <span class="stacktrace">${stack}</span>
                    </li>
                    <li>
                        <span class="key">Internal stacktrace:</span><br/>
                        <span class="stacktrace">${error.stack}</span>
                    </li>
                </ul>
            `,
        },
    };

    let genericErrorElm = document.getElementById("generic-error");
    window.onError = function(message, source, lineno, colno, error) {
        containerElm.classList.remove(
            "matches-loading",
            "categories-loading",
            "welcome"
        );
        containerElm.classList.add("error");

        stacktrace(stack => {
            console.error("handleCategorizeError", error.message, stack);
            genericErrorElm.innerHTML = render.error.generic(error, stack);
        });
    };
    //////////////////////////////////////////////////////////////////////////////////////////
    // 5. Initialize the client engine
    //    Wrapping the creation as it is used also when the reset-button is clicked.
    //////////////////////////////////////////////////////////////////////////////////////////

    // For debugging
    // console.log("Client settings", searchSettings);
    // console.log("User interface settings", uiSettings);
    // console.log("Render templates", render);

    // prettier-ignore
    // Sets up the client that connects to the IntelliSearch backend using the aforementioned settings
    let client = new IntelliSearch.SearchClient(searchSettings);
    if (searchSettings.authentication.enabled && !client.authenticationToken) {
        document.getElementById("container").classList.add("auth-pending");
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // 6. Wire up the queryText field, reset and search-button.
    //    Using input type="input", with separate reset and search button.
    //    Detecting changes, enter, reset-click and search-click.
    //////////////////////////////////////////////////////////////////////////////////////////

    let queryTextElm = document.getElementById("query-text");

    // This reports changes in the query, but does not detect enter
    queryTextElm.addEventListener("input", function() {
        //console.log("queryText changed: " + queryTextElm.value);
        if (queryTextElm.value.length > 0) {
            resetBtn.classList.remove("hidden");
        } else {
            resetBtn.classList.add("hidden");
        }
        client.queryText = queryTextElm.value;

        adjustQueryTextFontSize();
    });

    let styleFontSize = window
        .getComputedStyle(queryTextElm, null)
        .getPropertyValue("font-size");
    let maxFontSize = parseFloat(styleFontSize);

    function adjustQueryTextFontSize() {
        let maxLength = 500; // When inpt is this long...
        let minFontSize = 8; // ...we use this percentage as the smallest font.

        let increments = (maxFontSize - minFontSize) / maxLength;

        let reduction =
            Math.min(queryTextElm.value.length, maxLength) * increments;
        queryTextElm.style.fontSize = maxFontSize - reduction + "px";
    }

    let awesompleteItemSelected = false;
    // Only added to reliably detect enter across browsers
    queryTextElm.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            if (awesompleteItemSelected) {
                // Suppress the enter keypress if the focus is on the autocomplete dialog
                event.preventDefault();
                return;
            }
            let mod = checkIntellidebugMod(event, queryTextElm);
            //console.log(`queryText ${mod}Enter detected:`, queryTextElm.value);
            let query = {
                ...client.query,
                ...{ queryText: queryTextElm.value }
            };
            client.forceUpdate(query, false); //No need to update autocomplete
            event.preventDefault();
        }
    });

    // We use input type="input", instead of type="search". This is because the reset X that appears on the latter field
    // for type="search" is not reliably firing events across browsers. With type="input" we make our own reset button.
    let resetBtn = document.getElementById("reset");
    let containerElm = document.getElementById("container");
    resetBtn.addEventListener("click", () => {
        //console.log("UI reset");
        client.reset();
        containerElm.className = "welcome";
        queryTextElm.value = "";
    });

    // We also want the search button to force a
    let searchButtonElm = document.getElementById("go");
    searchButtonElm.addEventListener("click", event => {
        let mod = checkIntellidebugMod(event, queryTextElm);
        //console.log(`Search-button ${mod}clicked:`, queryTextElm.value);
        let query = {
            ...client.query,
            ...{ queryText: queryTextElm.value }
        };
        client.forceUpdate(query, false); //No need to update autocomplete
    });

    // Set up the autocomplete library
    let awesomplete = new Awesomplete(queryTextElm);

    queryTextElm.addEventListener("awesomplete-highlight", event => {
        awesompleteItemSelected = true;
    });
    queryTextElm.addEventListener("awesomplete-selectcomplete", event => {
        awesompleteItemSelected = false;
        client.queryText = event.text.value;
    });
    queryTextElm.addEventListener("awesomplete-close", event => {
        awesompleteItemSelected = false;
    });

    //////////////////////////////////////////////////////////////////////////////////////////
    // 7. Wire up other buttons, options and areas on the page:
    //    - Search-type
    //    - Date-range
    //    - Pager
    //    - Match ordering
    //    - ...
    //////////////////////////////////////////////////////////////////////////////////////////
    let searchTypeAllElm = document.getElementById("search-type-all");
    searchTypeAllElm.addEventListener("click", function() {
        client.searchType = IntelliSearch.SearchType.Keywords;
    });

    let searchTypeAnyElm = document.getElementById("search-type-any");
    searchTypeAnyElm.addEventListener("click", function() {
        client.searchType = IntelliSearch.SearchType.Relevance;
    });

    searchTypeAllElm.checked =
        client.searchType === IntelliSearch.SearchType.Keywords;
    searchTypeAnyElm.checked =
        client.searchType === IntelliSearch.SearchType.Relevance;

    let matchesHeader = document.getElementById("matches-header");

    let orderByRelevanceElm = document.getElementById("option-relevance");
    orderByRelevanceElm.addEventListener("click", function() {
        client.matchOrderBy = IntelliSearch.OrderBy.Relevance;
    });

    let orderByDateElm = document.getElementById("option-date");
    orderByDateElm.addEventListener("click", function() {
        client.matchOrderBy = IntelliSearch.OrderBy.Date;
    });

    let didYouMeanContainerElm = document.getElementById(
        "did-you-mean-container"
    );
    let didYouMeanOptionsElm = document.getElementById("did-you-mean");

    let categoriesTreeElm = document.getElementById("categories-tree");

    let matchesListElm = document.getElementById("matches-list");
    let matchesStatsElm = document.getElementById("matches-stats");
    let matchesOrderElm = document.getElementById("matches-order");
    let matchesPagerElm = document.getElementById("matches-pager");
    let matchesPagerItemsLabelElm = document.getElementById(
        "matches-pager-label"
    );
    let matchesPagerItemsElm = document.getElementById("matches-pager-items");

    // Details
    let detailsElm = document.getElementById("details");
    let detailsCloseElm = detailsElm.getElementsByClassName("close")[0];
    detailsCloseElm.addEventListener("click", () => {
        containerElm.classList.toggle("no-details");
    });
    let detailsHeaderElm = document.getElementById("details-header");
    let detailsTitleElm = document.getElementById("details-title");
    let detailsContentElm = document.getElementById("details-content");
    let detailsPropertiesElm = document.getElementById("details-properties");
    let detailsOptionContent = document.getElementById(
        "details-option-content"
    );
    let detailsOptionProperties = document.getElementById(
        "details-option-properties"
    );

    if (searchSettings.query.matchGenerateContent) {
        detailsOptionContent.addEventListener("click", function() {
            detailsElm.classList.add("content");
            detailsElm.classList.remove("properties");
        });
        detailsOptionProperties.addEventListener("click", function() {
            detailsElm.classList.add("properties");
            detailsElm.classList.remove("content");
        });
    } else {
        detailsOptionContent.checked = false;
        detailsOptionProperties.checked = true;
        detailsElm.classList.add("properties");
        detailsElm.classList.remove("content");
        document.getElementById("details-types").style.display = "none";
    }
    if (!uiSettings.details.show) {
        containerElm.classList.add("no-details");
    }

    let matchesErrorElm = document.getElementById("matches-error");
    let categoriesErrorElm = document.getElementById("categories-error");

    let loadingSuggestions = document.getElementById("spinner");

    let aboutElm = document.getElementById("about");
    let helpElm = document.getElementById("help");
    let settingsElm = document.getElementById("settings");

    let menu = document.getElementById("menu");
    let menuBtn = document.getElementById("menu-button");
    menuBtn.addEventListener("click", () => {
        menu.classList.toggle("show");
    });

    window.INTS_OpenDialog = function(dialog) {
        containerElm.classList.add(dialog);
    };
    window.INTS_CloseDialog = function(dialog) {
        containerElm.classList.remove(dialog);
    };

    let menuOptionHelp = document.getElementById("menu-option-help");
    menuOptionHelp.addEventListener("click", () =>
        window.INTS_OpenDialog("help")
    );

    let helpCloseElm = document.getElementById("help-close-button");
    helpCloseElm.addEventListener("click", () =>
        window.INTS_CloseDialog("help")
    );

    let menuOptionToggleDetails = document.getElementById(
        "menu-option-toggle-details"
    );
    menuOptionToggleDetails.addEventListener("click", () => {
        containerElm.classList.toggle("no-details");
    });

    let menuOptionSettings = document.getElementById("menu-option-settings");
    menuOptionSettings.addEventListener("click", () => {
        if (containerElm.classList.toggle("settings")) {
            renderSettings();
        }
    });

    let settingsCloseElm = document.getElementById("settings-close-button");
    settingsCloseElm.addEventListener("click", () => {
        containerElm.classList.remove("settings");
    });

    let categoryConfigurationCloseElm = document.getElementById(
        "category-configuration-close-button"
    );
    categoryConfigurationCloseElm.addEventListener("click", () => {
        containerElm.classList.remove("category-configuration");
    });

    let menuOptionAbout = document.getElementById("menu-option-about");
    menuOptionAbout.addEventListener("click", () =>
        window.INTS_OpenDialog("about")
    );

    let aboutCloseElm = document.getElementById("about-close-button");
    aboutCloseElm.addEventListener("click", () =>
        window.INTS_CloseDialog("about")
    );

    // Close the drop-down menu if the user clicks outside of it
    window.addEventListener("click", event => {
        if (!event.target.matches("#menu-button")) {
            menu.classList.remove("show");
        }
    });

    //////////////////////////////////////////////////////////////////////////////////////////
    // 8. Implement callbacks, that in turn render the ui
    //////////////////////////////////////////////////////////////////////////////////////////

    /*** Authentication callbacks *************************************************************/

    function handleAuthenticationRequest(url, reqInit) {
        //console.log("handleAuthenticationRequest", url, reqInit);
    }

    function handleAuthenticationSuccess(result) {
        containerElm.classList.remove("auth-pending");
        //console.log("handleAuthenticationSuccess", "Result:", result);
    }

    function handleAuthenticationError(error) {
        stacktrace(stack => {
            console.error("handleAuthenticationError", error.message, stack);
        });
        containerElm.classList.remove("auth-pending");
        containerElm.classList.add("auth-error");
        // TODO: Write details on error to dialog?
    }

    /*** Autocomplete callbacks *************************************************************/

    /**
     * Often used to track "loading" spinners. Stop the spinner on success or error.
     * Return false to stop autocomplete queries from being executed.
     */
    function handleAutocompleteRequest(url, reqInit) {
        //console.log("handleAutocompleteRequest", url, reqInit);
        loadingSuggestions.style.visibility = "visible";
    }

    /**
     * Receive and render autocomplete suggestions and to stop load-spinners.
     */
    function handleAutocompleteSuccess(suggestions) {
        // console.log("handleAutocompleteSuccess", "Suggestions:", suggestions);
        suggestions = suggestions.filter(s => s !== `${queryTextElm.value} `);
        awesomplete.list = suggestions;
        loadingSuggestions.style.visibility = "hidden";
    }

    /**
     * Use this to handle errors and to stop load-spinners.
     */
    function handleAutocompleteError(error) {
        loadingSuggestions.style.visibility = "hidden";

        stacktrace(stack => {
            console.error("handleAutocompleteError", error.message, stack);
        });
    }

    /*** Find callbacks *********************************************************************/

    /**
     * Often used to track "loading" spinners. Stop the spinner on success or error.
     * Return false to stop autocomplete queries from being executed.
     */
    function handleFindRequest(url, reqInit) {
        //console.log("handleFindRequest", "Url: ", url, "ReqInit:", reqInit);
        containerElm.classList.add("matches-loading");
    }

    /**
     * Receive and render find matches and to stop load-spinners.
     */
    function handleFindSuccess(matches) {
        // console.log("handleFindSuccess", "Matches:", matches);
        containerElm.classList.remove("welcome", "matches-loading", "error");

        detailsHeaderElm.style.visibility = "hidden";
        detailsTitleElm.innerHTML = "";
        detailsContentElm.innerHTML = "";
        detailsPropertiesElm.innerHTML = "";
        detailsElm.classList.add("showhelp");

        didYouMeanContainerElm.style.display = "none";
        didYouMeanOptionsElm.innerHTML = "";

        matchesStatsElm.innerHTML = render.match.stats(matches);

        if (matches.didYouMeanList.length > 0) {
            matches.didYouMeanList.forEach((didYouMean, i, a) => {
                let li = document.createElement("li");
                li.innerHTML = didYouMean;
                li.addEventListener("click", function() {
                    queryTextElm.value = didYouMean; // Update the user interface
                    client.queryText = didYouMean; // Update the client (since the UI does not fire an event for the previous change)
                    queryTextElm.focus(); // Set the focus to the query-field.
                });
                didYouMeanOptionsElm.appendChild(li);
            });
            didYouMeanContainerElm.style.display = "block";
        }

        // Clear out old matches
        matchesListElm.innerHTML = "";

        function createMatch(match, index, arr) {
            let li = document.createElement("li");
            li.innerHTML = render.match.item(match);

            // Detect if categories are rendered within the matches.
            if (uiSettings.match.categories.show) {
                // Expects the match-categories to have the class "category", in order to link them.
                let categoryChipElms = li.getElementsByClassName("category");
                for (var i = 0; i < categoryChipElms.length; i++) {
                    let categoryChipElm = categoryChipElms[i];
                    // Expects the category-chips to have custom `data-categoryName="namePartA,namePartB"` attributes that indicate the real categoryName.
                    if (!categoryChipElm.dataset.category) {
                        continue;
                    }
                    let categoryName = categoryChipElm.dataset.category.split(
                        "|"
                    );
                    categoryChipElm.addEventListener("click", () => {
                        client.filterToggle(categoryName);
                    });
                }
            }

            // Bind up hover action to write content (properties and metadata) into the details pane
            li.addEventListener("mouseenter", function() {
                li.parentNode.childNodes.forEach(sli => {
                    sli.classList.remove("current");
                });
                li.classList.add("current");
                detailsElm.classList.remove("showhelp");
                detailsTitleElm.innerHTML = render.details.title(match);
                detailsContentElm.innerHTML = render.details.content(
                    match.content
                );
                detailsPropertiesElm.innerHTML = render.details.properties(
                    match
                );
                detailsHeaderElm.style.visibility = "visible";
            });
            return li;
        }

        if (matches.searchMatches.length > 0) {
            if (matches.searchMatches.length > 1) {
                matchesOrderElm.classList.add("show");
            } else {
                matchesOrderElm.classList.remove("show");
            }
            containerElm.classList.remove("welcome");
            matchesHeader.classList.add("has-data");
            containerElm.classList.remove("no-matches");
            let ul = document.createElement("ul");
            matchesListElm.appendChild(ul);

            matches.searchMatches.forEach(function(match, index, arr) {
                let li = createMatch(match, index, arr);
                ul.appendChild(li);
            });

            matchesPagerItemsElm.innerHTML = "";

            let pagerSize = uiSettings.match.pager.size;
            currentPage = client.matchPage;
            let pageMin = 1;
            let pageMax = Math.ceil(
                matches.estimatedMatchCount / client.matchPageSize
            );
            let pages = [];
            pages.push(currentPage);
            let offset = 1;
            while (pages.length < pagerSize) {
                let pageRight = currentPage + offset;
                let pageLeft = currentPage - offset;
                if (pageRight > pageMax && pageLeft < pageMin) break;
                if (pages.length < pagerSize && pageRight <= pageMax)
                    pages.push(pageRight);
                if (pages.length < pagerSize && pageLeft >= pageMin)
                    pages.push(pageLeft);
                offset++;
            }
            pages.sort((a, b) => a - b);

            if (pageMax > 1) {
                matchesPagerElm.classList.add("show");
            } else {
                matchesPagerElm.classList.remove("show");
            }

            matchesPagerItemsLabelElm.innerHTML = render.match.pager.label(
                matches
            );

            if (uiSettings.match.pager.addPrev) {
                // Add a prev-page link
                let li = document.createElement("li");
                li.classList.add("prev");
                let disabled = currentPage <= pageMin;
                li.innerHTML = render.match.pager.prev(
                    Math.max(pageMin, currentPage - 1),
                    disabled
                );
                if (disabled) {
                    li.classList.add("disabled");
                } else {
                    li.addEventListener(
                        "click",
                        () => {
                            client.matchPagePrev();
                        },
                        false
                    );
                }
                matchesPagerItemsElm.appendChild(li);
            }

            if (uiSettings.match.pager.addFirst && !pages.includes(pageMin)) {
                // Add a first-page link
                let li = document.createElement("li");
                li.innerHTML = render.match.pager.first(pageMin);
                li.classList.add("first");
                li.addEventListener(
                    "click",
                    () => {
                        client.matchPage = 1;
                    },
                    false
                );
                matchesPagerItemsElm.appendChild(li);

                let ellipsis = document.createElement("li");
                ellipsis.classList.add("ellipsis");
                ellipsis.appendChild(document.createTextNode("…"));
                matchesPagerItemsElm.appendChild(ellipsis);
            }

            pages.forEach(pageNum => {
                let li = document.createElement("li");
                let selected = pageNum === currentPage;
                li.innerHTML = render.match.pager.page(pageNum, selected);
                li.classList.add("page");
                if (selected) {
                    li.classList.add("selected");
                } else {
                    li.addEventListener(
                        "click",
                        () => {
                            client.matchPage = pageNum;
                        },
                        false
                    );
                }
                matchesPagerItemsElm.appendChild(li);
            });

            if (
                uiSettings.match.pager.addLast &&
                !pages.includes(pageMax) &&
                pageMax > 0
            ) {
                // Add a last-page link
                let ellipsis = document.createElement("li");
                ellipsis.classList.add("ellipsis");
                ellipsis.innerHTML = render.match.pager.ellipsis();
                matchesPagerItemsElm.appendChild(ellipsis);

                let li = document.createElement("li");
                li.innerHTML = render.match.pager.last(pageMax);
                li.classList.add("last");
                li.addEventListener(
                    "click",
                    () => {
                        client.matchPage = pageMax;
                    },
                    false
                );
                matchesPagerItemsElm.appendChild(li);
            }

            if (uiSettings.match.pager.addNext) {
                // Add a prev-page link
                let li = document.createElement("li");
                li.classList.add("next");
                let disabled = currentPage >= pageMax;
                li.innerHTML = render.match.pager.next(
                    Math.min(pageMax, currentPage + 1),
                    disabled
                );
                if (disabled) {
                    li.classList.add("disabled");
                } else {
                    li.addEventListener(
                        "click",
                        () => {
                            client.matchPageNext();
                        },
                        false
                    );
                }
                matchesPagerItemsElm.appendChild(li);
            }
        } else {
            matchesOrderElm.classList.remove("show");
            matchesPagerElm.classList.remove("show");
            matchesStatsElm.innerHTML = "";
            containerElm.classList.add("no-matches");
            matchesListElm.innerHTML = "No matches.";
        }
    }

    /**
     * Use this to handle errors and to stop load-spinners.
     */
    function handleFindError(error) {
        containerElm.classList.remove(
            "matches-loading",
            "categories-loading",
            "welcome"
        );
        containerElm.classList.add("error");
        detailsHeaderElm.style.visibility = "hidden";

        stacktrace(stack => {
            console.error("handleFindError", error, stack);
            matchesErrorElm.innerHTML = render.error.find(error, stack);
        });

        matchesStatsElm.innerHTML = "";
        matchesListElm.innerHTML = "No matches.";
        detailsTitleElm.innerHTML = "";
        detailsContentElm.innerHTML = "";
        detailsPropertiesElm.innerHTML = "";
        matchesHeader.classList.remove("has-data");
    }

    /*** Categorize callbacks ***************************************************************/

    /**
     * Often used to track "loading" spinners. Stop the spinner on success or error.
     * Return false to stop autocomplete queries from being executed.
     */
    function handleCategorizeRequest(url, reqInit) {
        // console.log("handleCategorizeRequest", "Url: ", url, "ReqInit:", reqInit);
        containerElm.classList.add("categories-loading");
    }

    /**
     * Receive and render autocomplete suggestions and to stop load-spinners.
     */
    function handleCategorizeSuccess(categories) {
        // console.log("handleCategorizeSuccess", "Categories:", categories);
        containerElm.classList.remove("categories-loading", "error");
        categoriesTreeElm.innerHTML = "";

        function createCategoryNode(category, index, arr) {
            let categoryLiElm = document.createElement("li");
            let isFilter = client.isFilter(category);
            if (isFilter) {
                categoryLiElm.classList.add("is-filter");
            } else if (client.hasChildFilter(category)) {
                categoryLiElm.classList.add("has-filter");
            }
            if (category.count > 0) {
                categoryLiElm.classList.add("has-matches");
            }
            categoryLiElm.classList.add(
                category.expanded ? "expanded" : "collapsed"
            );
            categoryLiElm.classList.add(
                category.children.length > 0 ? "has-children" : "is-leaf"
            );

            let toggle = `<span class="toggle"></span>`;
            let title = `<span class="title">${category.displayName}</span>`;
            let count =
                category.count > 0 || isFilter
                    ? `<span class="count">${category.count}</span>`
                    : "";
            categoryLiElm.title = category.displayName;

            categoryLiElm.innerHTML = `<div class="entry">${toggle}<span class="link">${title}${count}<span></div>`;

            let toggleElm = categoryLiElm.getElementsByClassName("toggle")[0];
            toggleElm.addEventListener("click", function(e) {
                let result = client.toggleCategoryExpansion(category);
                // console.log(
                //     `Toggled expansion for category '${
                //         category.displayName
                //     }'. Expanded = ${result}`,
                //     client.clientCategoryExpansion
                // );
            });

            let linkElm = categoryLiElm.getElementsByClassName("link")[0];
            linkElm.addEventListener("click", function(e) {
                let closestLi = e.target.closest("li");
                if (closestLi === categoryLiElm) {
                    let added = client.filterToggle(category);
                    closestLi.classList.toggle("is-filter");
                    // console.log(
                    //     `Filter ${category.displayName} was ${
                    //         added ? "added" : "removed"
                    //     }. Current filters:`,
                    //     client.filters
                    // );
                }
            });
            if (category.children.length > 0) {
                let catUlElm = document.createElement("ul");
                categoryLiElm.appendChild(catUlElm);
                category.children.forEach(function(childCat, cIndex, cArr) {
                    let li = createCategoryNode(childCat, cIndex, cArr);
                    catUlElm.appendChild(li);
                });
            }
            return categoryLiElm;
        }

        if (categories.groups.length > 0) {
            let ul = document.createElement("ul");
            categoriesTreeElm.appendChild(ul);

            categories.groups.forEach(function(group, index, arr) {
                // Create the group-node
                let groupLiElm = document.createElement("li");
                let title = `<span class="title">${group.displayName}</span>`;
                let toggle = `<span class="toggle"></span>`;
                groupLiElm.innerHTML = `<div class="entry">${toggle}${title}</div>`;
                groupLiElm.classList.add(
                    group.expanded ? "expanded" : "collapsed"
                );
                groupLiElm.classList.add(
                    group.categories.length > 0 ? "has-children" : "is-leaf"
                );

                let toggleElm = groupLiElm.getElementsByClassName("toggle")[0];
                toggleElm.addEventListener("click", function(e) {
                    let result = client.toggleCategoryExpansion(group);
                    // console.log(
                    //     `Toggled expansion for group '${
                    //         group.displayName
                    //     }'. Expanded = ${result}`,
                    //     client.clientCategoryExpansion
                    // );
                });
                if (group.categories.length > 0) {
                    let catUlElm = document.createElement("ul");
                    groupLiElm.appendChild(catUlElm);
                    group.categories.forEach(function(category, cIndex, cArr) {
                        let li = createCategoryNode(category, cIndex, cArr);
                        catUlElm.appendChild(li);
                    });
                }
                ul.appendChild(groupLiElm);
            });
            // } else {
            //     categoriesTreeElm.innerHTML = "No categories.";
        }
        if (categories.matchCount == 0 && client.filters.length > 0) {
            let text = document.createElement("p");
            text.innerHTML =
                "<strong>No results with current filters!</strong>";

            let button = document.createElement("button");
            button.innerHTML = "Remove filters";
            button.addEventListener("click", () => {
                client.filters = [];
            });

            let help = document.createElement("div");
            help.classList.add("no-matches-with-filters");
            help.appendChild(text);
            help.appendChild(button);

            categoriesTreeElm.appendChild(help);
        }
    }

    /**
     * Use this to handle errors and to stop load-spinners.
     */
    function handleCategorizeError(error) {
        containerElm.classList.remove(
            "matches-loading",
            "categories-loading",
            "welcome"
        );
        containerElm.classList.add("error");

        stacktrace(stack => {
            console.error("handleCategorizeError", error.message, stack);
            categoriesErrorElm.innerHTML = render.error.categorize(
                error,
                stack
            );
        });

        categoriesTreeElm.innerHTML = "";
    }

    // Render settings dialog.
    function renderSettings() {
        // TODO
        return;
    }
}

function checkIntellidebugMod(event, queryTextElm) {
    let mod = "";
    if (event.shiftKey) {
        mod = "Shift-";
        queryTextElm.value = queryTextElm.value.replace(
            /\s?:intellidebug/gi,
            ""
        );
    }
    if (event.ctrlKey) {
        if (!queryTextElm.value.match(/:intellidebug/)) {
            queryTextElm.value += " :intellidebug";
            mod = "Ctrl-";
        }
    }
    return mod;
}

function setupTabs() {
    var tabContainerElms = document.getElementsByClassName("tab-container");
    for (let i = 0; i < tabContainerElms.length; i++) {
        let tabContainerElm = tabContainerElms[i];
        for (let j = 0; j < tabContainerElm.children.length; j++) {
            let tabElm = tabContainerElm.children[j];
            if (tabElm.id.length === 0) continue;
            const tabContentId = `tab-${tabElm.id}`;
            let tabContent = document.getElementById(tabContentId);
            if (!tabContent) {
                console.error(
                    `Missing tab content id='${tabContentId}' (as referenced by <${
                        tabElm.tagName
                    } id="${tabElm.id}">)`
                );
                continue;
            }
            tabElm.addEventListener("click", () => {
                // Remove sibling tabContents "current"
                for (let k = 0; k < tabElm.parentElement.children.length; k++) {
                    let t = tabElm.parentElement.children[k];
                    t.classList.remove("current");
                }
                // Add this' related tabContent "current"
                tabElm.classList.add("current");

                // Remove sibling tab's "current"
                for (
                    let k = 0;
                    k < tabContent.parentElement.children.length;
                    k++
                ) {
                    let c = tabContent.parentElement.children[k];
                    c.classList.remove("current");
                }
                // Add this tab "current"
                tabContent.classList.add("current");
            });
        }
    }
}
// Utility template-helper to collect output from a map iterator.
function collect(collection, action) {
    return collection.map(action).join("");
}

// Utility helper to exclude items
function excluded(item, regexExclusionPatterns) {
    for (const exclude of regexExclusionPatterns) {
        var regParts = exclude.match(/^\/(.*?)\/([gim]*)$/);
        let regex;
        if (regParts) {
            // the parsed pattern had delimiters and modifiers. handle them.
            regex = new RegExp(regParts[1], regParts[2]);
        } else {
            // we got pattern string without delimiters
            regex = new RegExp(regex);
        }
        const match = regex.test(item);
        if (match) return true;
    }
    return false;
}

// Lookup the actual categoryName in the category-tree. Used to get the real category-names in the match and in the details.
function getLocalizedCategoryName(client, category) {
    // TODO: Add a SearchClient method to show the full path DisplayName for a category.
    const catId = category.split("|");
    const cat = client.findCategory(catId);
    let name = cat ? cat.displayName : category;
    return name.split("|").join(" / ");
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

// Truncate the rendering of category-titles in the matches.
// TODO: Render first and last part in full, then just split the middle part, if longer than i.e. 5 chars.
function truncateMiddleEllipsis(fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;

    separator = separator || "...";

    let sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    return (
        fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars)
    );
}

function stacktrace(action) {
    StackTrace.get(error, { offline: true })
        .then(stackframes => {
            // Remove the topmost three frames, as they are artificial.
            stackframes = stackframes.slice(3);
            return stackframes.map(function(sf) {
                return sf.toString();
            });
        })
        .then(action)
        .catch(err =>
            console.error("Unable to create stacktrace", err.message)
        );
}
