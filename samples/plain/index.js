window.onload = function(e) {

    /**
     * 1. First create a settings object that is sent to the search-engine.
     * This test uses the publicly exposed demo SearchManager endpoint.
     */
    let settings = new IntelliSearch.Settings({
        autocomplete: {
            //enabled: false, //TODO: Enable when the backend has been updated.
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
        },
        query: {
            clientId: 'plain-sample',
            matchGenerateContent: true,
            matchGrouping: true
        }
    });

    console.log(settings);

    const client = new IntelliSearch.SearchClient("http://searchmanager.demo.intellisearch.no", settings);

    /**
     * 2. Wire up the queryText field and the search-button.
     */
    var queryTextElm = document.getElementById("query-text");
    queryTextElm.addEventListener("input", function(){
        console.log("queryText changed: " + queryTextElm.value);
        client.queryText = queryTextElm.value;
    });

    var searchButtonElm = document.getElementById("go");
    searchButtonElm.addEventListener("click", function(){
        console.log("Search-button clicked");
        client.findAndCategorize();
    });

    /**
     * 3. Wire up other buttons, options and areas on the page:
     * - Search-type
     * - Date-range
     * - Pager
     * - Match ordering
     * - ...
     */
    var suggestionsElm = document.getElementById("suggestions");
    var didYouMeanContainerElm = document.getElementById("did-you-mean-container");
    var didYouMeanOptionsElm = document.getElementById("did-you-mean");
    var propBtn = document.getElementById("btn-properties");
    var metaBtn = document.getElementById("btn-metadata");
    propBtn.addEventListener("click", function(){
        propElm.style.display = "initial";
        metaElm.style.display = "none";
    });
    metaBtn.addEventListener("click", function(){
        propElm.style.display = "none";
        metaElm.style.display = "initial";
    });

    var categoriesElm = document.getElementById("categories");
    var categorizeStatsElm = document.getElementById("categorize-stats");
    var matchesElm = document.getElementById("matches");
    var findStatsElm = document.getElementById("find-stats");
    var detailsElm = document.getElementById("detail-types");
    var titleElm = document.getElementById("title");
    var propElm = document.getElementById("properties");
    var metaElm = document.getElementById("metadata");

    /////////////////////////////////////////////
    // 4. Implement callbacks
    /////////////////////////////////////////////

    // Autocomplete callbacks ///////////////////

    /**
     * Often used to track "loading" spinners. Stop the spinner on success or error.
     * Return false to stop autocomplete queries from being executed.
     */
    function handleAutocompleteRequest(url, reqInit) {
        console.log("handleAutocompleteRequest", "Url: ", url, "ReqInit:", reqInit);
    }

    /**
     * Receive and render autocomplete suggestions and to stop load-spinners.
     */
    function handleAutocompleteSuccess(suggestions) {
        console.log("handleAutocompleteSuccess", "Suggestions:", suggestions);
        suggestionsElm.innerHTML = "";
        suggestions.forEach((suggestion, i, a) => {
            var option = document.createElement("option");
            option.value = suggestion;
            suggestionsElm.appendChild(option);
        });
    }

    /**
     * Use this to handle errors and to stop load-spinners.
     */
    function handleAutocompleteError(error){
        console.error("handleAutocompleteError", error);
    }

    // Find callbacks ///////////////////////////

    /**
     * Often used to track "loading" spinners. Stop the spinner on success or error.
     * Return false to stop autocomplete queries from being executed.
     */
    function handleFindRequest(url, reqInit) {
        console.log("handleFindRequest", "Url: ", url, "ReqInit:", reqInit);
    }

    /**
     * Receive and render find matches and to stop load-spinners.
     */
    function handleFindSuccess(matches) {
        console.log("handleFindSuccess", "Matches:", matches);

        findStatsElm.innerHTML = `<span>Hits: ${matches.estimatedMatchCount}</span>`;

        didYouMeanContainerElm.style.display = "none";
        didYouMeanOptionsElm.innerHTML = "";
        if (matches.didYouMeanList.length > 0) {
            matches.didYouMeanList.forEach((didYouMean, i, a) => {
                var li = document.createElement("li");
                li.innerHTML = didYouMean;
                li.addEventListener("click", function (){
                    queryTextElm.value = didYouMean; // Update the user interface
                    client.queryText = didYouMean; // Update the client (since the UI does not fire an event for the previous change)
                    queryTextElm.focus(); // Set the focus to the query-field.
                });
                didYouMeanOptionsElm.appendChild(li);
            });
            didYouMeanContainerElm.style.display = "block";
        }

        // Clear out old matches
        matchesElm.innerHTML = "";

        function createMatch(match, index, arr) {
            var li = document.createElement('li');

            // Build title
            var title = `<a class="title" href="${match.url}" title="${match.title}">${match.title}</a>`;

            // Build showButton (if contents are delivered)
            var showContentButton = match.content.length > 0 ? `<button title="Show content...">&telrec;</button>` : "";

            // Build relevance
            var relevance = `<span class="relevance" title="Relevance (${match.relevance})">${parseInt(match.relevance)}</span>`;

            // Build modification date
            var modificationDate = `<span class="date" title="Modification date">${new Date(match.date).toLocaleDateString()}</span>`;

            // Build extracts
            var extracts = "";
            match.extracts.forEach(function (extract, meIndex, meArr) {
                extracts += `<div class="extract">${extract}</div>`;
            });
            extracts = extracts.length > 0 ? `<div class="extracts">${extracts}</div>` : "";

            // Build abstract
            var abstract = match.abstract.length > 0 ? `<div class="abstract">${match.abstract}</div>` : "";

            // Build match-item
            li.innerHTML = `
                <div class="headline">
                    ${title}
                    <div class="rel-date-wrapper">
                        ${showContentButton}
                        ${relevance}
                        ${modificationDate}
                    </div>
                </div>
                ${extracts}
                ${abstract}
            `;

            // If we have content then we have button, so lets bind it up to the click event to show tehe content.
            // TODO: Show this in proper dialog (div over the others), as the alert shows a limited number of characters of the item only.
            if (match.content.length > 0) {
                li.getElementsByTagName('button')[0].addEventListener("click", function() {
                    alert(match.content.join('\n'));
                });
            }

            // Build the content that is to be displayed in the details pane.

            // Build title
            var detailTitle = `<span title="${match.title}">Title: ${match.title}</span>`;

            // Build properties
            var categories = "</br>";
            match.categories.forEach(function(cat, catIndex, catArr){
                // Iterate all categories to create a list
                categories += `&nbsp;-&nbsp;${cat}<br/>`;
            });

            var properties = `
                <li><b>InternalId</b>: ${match.internalId}</li>
                <li><b>ItemId</b>: ${match.itemId}</li>
                <li><b>SourceName</b>: ${match.sourceName}</li>
                <li><b>InstanceId</b>: ${match.instanceId}</li>
                <li><b>ParentInternalId</b>: ${match.parentInternalId}</li>
                <li><b>ParentLevel</b>: ${match.parentLevel}</li>
                <li><b>IndexManagerNode</b>: ${match.indexManagerNode}</li>
                <li><b>IsTrueMatch</b>: ${match.isTrueMatch}</li>
                <li><b>Categories</b>: ${categories}</li>
                `;

            // Build metadata
            var metadata = "";
            match.metaList.forEach(function(meta, metaIndex, metaArr){
                // Iterate all metadatas to create a list
                metadata += `<li title="${meta.value}"><b>${meta.key}</b>: ${meta.value}</li>`;
            });

            // Bind up hover action to write content (properties and metadata) into the details pane
            li.addEventListener("mouseover", function(){
                titleElm.innerHTML = detailTitle;
                detailsElm.style.display = "initial";
                propElm.innerHTML = `<ul>${properties}</ul>`;
                metaElm.innerHTML = `<ul>${metadata}</ul>`;
            });

            return li;
        }

        if (matches.searchMatches.length > 0) {
            var ul = document.createElement("ul");
            matchesElm.appendChild(ul);

            matches.searchMatches.forEach(function (match, index, arr) {
                var li = createMatch(match, index, arr);
                ul.appendChild(li);
            });
        } else {
            findStatsElm.innerHTML = "";
            matchesElm.innerHTML = "No matches.";
            detailsElm.style.display = "none";
            titleElm.innerHTML = "";
            propElm.innerHTML = "";
            metaElm.innerHTML = "";
        }
    }

    /**
     * Use this to handle errors and to stop load-spinners.
     */
    function handleFindError(error){
        console.error("handleFindError", error);
        findStatsElm.innerHTML = "";
        matchesElm.innerHTML = "No matches.";
        detailsElm.style.display = "none";
        titleElm.innerHTML = "";
        propElm.innerHTML = "";
        metaElm.innerHTML = "";
    }

    // Categorize callbacks ///////////////////////////

    /**
     * Often used to track "loading" spinners. Stop the spinner on success or error.
     * Return false to stop autocomplete queries from being executed.
     */
    function handleCategorizeRequest(url, reqInit) {
        console.log("handleCategorizeRequest", "Url: ", url, "ReqInit:", reqInit);
    }

    /**
     * Receive and render autocomplete suggestions and to stop load-spinners.
     */
    function handleCategorizeSuccess(categories) {
        console.log("handleCategorizeSuccess", "Categories:", categories);
        categorizeStatsElm.innerHTML = `
            <span>Hits: ${categories.isEstimatedCount ? '~' : ''}${categories.matchCount}</span>
        `;

        categoriesElm.innerHTML = "";

        function createCategoryNode(category, index, arr) {
            var categoryLiElm = document.createElement("li");
            var title = `<span class="title ${category.count > 0 ? 'is-match' : ''}">${category.displayName}</span>`;
            var count = category.count > 0 ? `<span class="count">${category.count}</span>` : '';
            categoryLiElm.innerHTML = `<div>${title}${count}</div>`;
            if (category.children.length > 0) {
                var catUlElm = document.createElement("ul");
                categoryLiElm.appendChild(catUlElm);
                category.children.forEach(function (childCat, cIndex, cArr){
                    var li = createCategoryNode(childCat, cIndex, cArr);
                    catUlElm.appendChild(li);
                });
            }
            return categoryLiElm;
        }

        if (categories.groups.length > 0) {
            var ul = document.createElement("ul");
            categoriesElm.appendChild(ul);

            categories.groups.forEach(function (group, index, arr) {
                // Create the group-node
                var groupLiElm = document.createElement("li");
                groupLiElm.innerHTML=`${group.displayName}`;
                if (group.categories.length > 0) {
                    var catUlElm = document.createElement("ul");
                    groupLiElm.appendChild(catUlElm);
                    group.categories.forEach(function (category, cIndex, cArr){
                        var li = createCategoryNode(category, cIndex, cArr);
                        catUlElm.appendChild(li);
                    });
                }
                ul.appendChild(groupLiElm);
            });
        } else {
            categorizeStatsElm.innerHTML = "";
            categoriesElm.innerHTML = "No categories.";
        }
    }

    /**
     * Use this to handle errors and to stop load-spinners.
     */
    function handleCategorizeError(error){
        console.error("handleCategorizeError", error);
        categorizeStatsElm.innerHTML = "";
        categoriesElm.innerHTML = "No categories.";
    }

}
