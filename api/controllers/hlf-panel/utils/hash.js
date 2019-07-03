const sha256 = require('js-sha256');

module.exports = {
    hashDocument: function (document) {
        return sha256(document);
    }
};