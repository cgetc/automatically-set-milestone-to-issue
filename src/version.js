class Version {
    constructor(versions) {
        this.versions = versions
    }

    getPatchVersion() {
        return this.versions[this.versions.length - 1]
    }

    compare(value) {
        const a = this.versions
        const b = value.versions
        for (let i = 0; i < a.length; ++i) {
            if (a[i] > b[i]) {
                return 1
            } else if (a[i] < b[i]) {
                return -1
            }
        }
        return 0
    }

    toString() {
        return this.versions.toString()
    }
}

module.exports = Version
