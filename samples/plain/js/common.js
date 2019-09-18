function load(file) {
    return fetch(file, {
        cache: "no-store",
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