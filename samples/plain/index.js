window.onload = function(e) {

    var detailsElm = document.getElementById("detail-types");
    var titleElm = document.getElementById("title");
    var propElm = document.getElementById("properties");
    var metaElm = document.getElementById("metadata");

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
                detailsElm.style.display = "none";
                
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
                        extracts = extracts.length > 0 ? `<div class="extracts">${extracts}</div>` : "";

                        var abstract = match.abstract.length > 0 ? `<div class="abstract">${match.abstract}</div>` : "";

                        var showContentButton = match.content.length > 0 ? `<button title="Show content...">&telrec;</button>` : "";
                        li.innerHTML = `
                            <div class="headline">
                                <a class="title" href="${match.url}" title="${match.title}">${match.title}</a>
                                <div class="rel-date-wrapper">
                                    ${showContentButton}
                                    <span class="relevance" title="Relevance (${match.relevance})">${parseInt(match.relevance)}</span>
                                    <span class="date" title="Modification date">${new Date(match.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            ${extracts}
                            ${abstract}
                        `;
                        if (match.content.length > 0) {
                            li.getElementsByTagName('button')[0].addEventListener("click", function() {
                                alert(match.content.join('\n'));
                            });
                        }

                        // Build data to show in the details pane
                        var title = `<b>Title: ${match.title}</b>`;

                        var categories = "</br>";
                        match.categories.forEach(function(cat, catIndex, catArr){
                            categories += `&nbsp;-&nbsp;${cat}<br/>`
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

                        var metadata = "";
                        match.metaList.forEach(function(meta, metaIndex, metaArr){
                            metadata += `<li title="${meta.value}"><b>${meta.key}</b>: ${meta.value}</li>`
                        });

                        li.addEventListener("mouseover", function(){
                            titleElm.innerHTML = title;
                            detailsElm.style.display = "initial";
                            propElm.innerHTML = `<ul>${properties}</ul>`;
                            metaElm.innerHTML = `<ul>${metadata}</ul>`;
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
        query: {
            clientId: "plain-sample",
            matchGenerateContent: true,
            matchGrouping: true,
        }
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
    var propBtn = document.getElementById("btnProperties");
    var metaBtn = document.getElementById("btnMetadata");
    propBtn.addEventListener("click", function(){
        propElm.style.display = "initial";
        metaElm.style.display = "none";
    });
    metaBtn.addEventListener("click", function(){
        propElm.style.display = "none";
        metaElm.style.display = "initial";
    });

};
