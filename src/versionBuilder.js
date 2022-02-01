const Version = require('./version')

class VersionBuilder {
    constructor(prefix, separator) {
        this.prefix = prefix
        this.separator = separator
    }

    build(string) {
        if (string.startsWith(this.prefix)) {
            const versions = string.substring(this.prefix.length).split(this.separator)
            if (versions && versions.length) {
                return new Version(versions.map(n => parseInt(n)))
            }
        }
    }
}
module.exports = VersionBuilder
