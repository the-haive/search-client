window.onload = function() {		
	let searchSettings = {};    
    Promise.all([
        load("./cfg/search-settings.json").then(ss => {
            searchSettings = ss;
        })
    ]).then(() => {                
		IntelliSearch.OidcAuthentication.handleSilentSignin(searchSettings.authentication.responseMode);
	});	
};