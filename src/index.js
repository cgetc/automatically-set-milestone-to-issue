const core = require('@actions/core')
const github = require('@actions/github')
const VersionBuilder = require('./versionBuilder')

async function run(octokit, context, versionPrefix, versionSeparator) {
    const { owner, repo } = context.repo
    const { data: milestones } = await octokit.rest.issues.listMilestones({
        owner,
        repo,
    })
    const versionBuilder = new VersionBuilder(versionPrefix, versionSeparator)
    milestones.forEach(m => {
        const version = versionBuilder.build(m.title)
        if (version) {
            m._version = version
        }
    })
    const matchedMilestones = milestones.filter(m => m._version).sort((a, b) => a._version.compare(b._version))
    if (!matchedMilestones) {
        throw new Error('No matched milestones.')
    }

    var milestoneIndex = matchedMilestones.findIndex(m => m._version.getPatchVersion() === 0)
    if (milestoneIndex > 0) {
        milestoneIndex--  // nearest minor version
    } else if (milestoneIndex < 0) {
        milestoneIndex = matchedMilestones.length - 1  // max patch version
    }

    const milestone = matchedMilestones[milestoneIndex]
    const { issue, pull_request } = context.payload
    return octokit.rest.issues.update({
        milestone: milestone.number,
        issue_number: (issue || pull_request).number,
        owner,
        repo,
    })
}

async function main() {
    try {
        const octokit = github.getOctokit(core.getInput('github-token'))
        const versionPrefix = core.getInput('version-prefix')
        const versionSeparator = core.getInput('version-separator')
        const overwrite = core.getInput('overwrite')

        const { issue, pull_request } = github.context.payload;
        console.log(github.context.payload);//debug

        if (overwrite || (issue || pull_request).milestone) {
            console.log("A milestone exists. Do nothing.");
            return;
        }

        const { data: { milestone } } = await run(octokit, github.context, versionPrefix, versionSeparator)
        core.setOutput('milestone-number', milestone.number)
        core.setOutput('milestone-title', milestone.title)
    } catch (error) {
        core.setFailed(error.message)
    }
}
main()