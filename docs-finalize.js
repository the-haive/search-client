// We want the docs html documents to have links that use 'master' in the path instead of the git hash (to avoid having the docs change with every commit).

const replace = require("replace-in-file");

const options = {
    files: ["docs/**/*.html"],
    from: /<a href="https:\/\/github\.com\/the-haive\/search\-client\/blob\/(\w+)\/src\//gi,
    to: '<a href="https://github.com/the-haive/search-client/blob/master/src/',
    encoding: "utf8"
};

try {
    let changedFiles = replace.sync(options);
    console.log("Fixed docs github path:", changedFiles.join(", "));
} catch (error) {
    console.error("Error occurred:", error);
}
