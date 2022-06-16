import * as core from '@actions/core'
import * as github from '@actions/github'
import {BranchFormat} from './parser'
import {LinearClient} from '@linear/sdk'
import {updatePrTitle} from './updater'

async function run(): Promise<void> {
  const context = github.context
  const token = core.getInput('gh-token')
  const linearApiKey = core.getInput('linear-api-key')
  const branchFormat = core.getInput('branch-format') as BranchFormat

  const octokit = github.getOctokit(token)
  const linearClient = new LinearClient({apiKey: linearApiKey})

  core.info(`Updating PR title of ${context.issue}`)

  try {
    const {owner, repo, number} = context.issue

    const updatedPr = await updatePrTitle({
      octokit,
      linearClient,
      branchName: github.context.ref,
      branchFormat,
      owner,
      repo,
      pullNumber: number
    })

    core.info(`Updated PR title to ${updatedPr.title}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
