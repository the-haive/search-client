// We want the doc-site to have both the README and the GETTING_STARTED markdown documents as it's index page.
var fs = require('fs');

var tmp = './tmp/';
if (!fs.existsSync(tmp)) {
    fs.mkdirSync(tmp);
}

var dir = tmp + 'docs/';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// When joining the two md-files we need to ensure that there is at least one empty line inbetween them
fs.writeFileSync(dir + 'dummy.txt', '\n');


var concat = require('concat-files');
concat(['./README.md', dir + 'dummy.txt', './GETTING_STARTED.md'], dir + 'INDEX.md', function(err) {
    if (err) throw err;
    console.log("Created INDEX.md for use in the documentation.");
});
