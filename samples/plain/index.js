window.onload = function(e) {

    /**
     * 1. First create a settings object that is sent to the serch-engine.
     * This test uses the publically exposed demo searchmanager endpoint.
     */
    let settings = new IntelliSearch.Settings({
        autocomplete: {
            
            //TODO: Enable when the backend has been updated.
            enabled: false, 

            /**
             * Often used to track "loading" spinners. Stop the spinner on success or error.
             * Return false to stop autocomplete queries from being executed.
             */
            cbRequest: function(url, reqInit){
                console.log("cbRequest", "Url: ", url, "ReqInit:", reqInit);
            },
            
            /**
             * Receive and render autocomplete suggestions.
             */
            cbSuccess: function(suggestions){
                console.log("cbSuccess", "Suggestions:", suggestions);
            },
            
            /**
             * Use this to handle errors.
             */
            cbError: function(error){
                console.error("cbError", error);
            },
        },
        find: {
            
            /**
             * Often used to track "loading" spinners. Stop the spinner on success or error.
             * Return false to stop find queries from being executed.
             */
            cbRequest: function(url, reqInit){
                console.log("cbRequest", "Url: ", url, "ReqInit:", reqInit);
            },
            
            /**
             * Receive and render match-results.
             */
            cbSuccess: function(matches){
                console.log("cbSuccess", "Matches:", matches);

                var matchesElm = document.getElementById("matches");
                
                // Clear out old matches
                matchesElm.innerHTML = "";

                if (matches.searchMatches.length > 0) {
                    var ul = document.createElement("ul");
                    matchesElm.appendChild(ul);
    
                    matches.searchMatches.forEach(function (match, smIndex, smArr) {
                        var li = document.createElement('li');
                        ul.appendChild(li);

                        var extracts = "";
                        match.extracts.forEach(function (extract, meIndex, meArr) {
                            extracts += `<div class="extract">${extract}</div>`;
                        });

                        var abstract = `<div class="abstract">${match.abstract}</div>`;

                        li.innerHTML = `
                            <div class="title"><a href="${match.url}" title="${match.title}">${match.title}</a><button title="Show content...">&telrec;</button><span class="relevance" title="Relevance">${match.relevance}</span></div>
                            <div class="id"><span class="sourcename" title="SourceName">${match.sourceName}</span><span class="internal-id" title="InternalId">${match.internalId}</span><span class="item-id" title="ItemId">${match.itemId}</span></div>
                            <div class="extracts">${extracts}</div>
                            ${abstract}
                        `;

                        // Build data to show in the details pane
                        // TODO: Create props output
                        // Create metadata output
                        var metadata = `<li><b>Title: ${match.title}</b><br/><hr/>`;
                        match.metaList.forEach(function(meta, metaIndex, metaArr){
                            metadata += `<li title="${meta.value}"><b>${meta.key}</b>: ${meta.value}</li>`
                        });
                        li.addEventListener("mouseover", function(){
                            document.getElementById("details").innerHTML = `<ul>${metadata}</ul>`;
                        });
                    });
                } else {
                    matchesElm.innerHTML = "No results."
                }
            },

            cbError: function(error){
                console.error("cbError", error);
            },
        },
        categorize: {

            /**
             * Often used to track "loading" spinners. Stop the spinner on success or error.
             * Return false to stop categorize queries from being executed.
             */
            cbRequest: function(url, reqInit){
                console.log("cbRequest", "Url: ", url, "ReqInit:", reqInit);
            },

            /**
             * Receive and render categories.
             */
            cbSuccess: function(categories){
                console.log("cbSuccess", "Categories:", categories);
            },
            cbError: function(error){
                console.error("cbError", error);
            },
        },
    });

    console.log(settings);
    const client = new IntelliSearch.SearchClient("http://searchmanager.demo.intellisearch.no", settings);

    /**
     * 2. Wire up the queryText field and the search-button.
     */
    var queryTextElm = document.getElementById("queryText");
    queryTextElm.addEventListener("input", function(){
        console.log("queryText changed: " + queryTextElm.value)
        client.queryText = queryTextElm.value;
    });
    var searchButtonElm = document.getElementById("go");
    searchButtonElm.addEventListener("click", function(){
        console.log("Search-button clicked");
        client.findAndCategorize();
    });

    /**
     * 3. Wire up other buttons and options on the page:
     * - Search-type
     * - Date-range
     * - Pager
     * - Match ordering
     * - ...
     */

};
