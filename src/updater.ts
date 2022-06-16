import * as core from '@actions/core'
import {BranchFormat, parseBranchName} from './parser'
import {Issue, LinearClient} from '@linear/sdk'
import {Endpoints} from '@octokit/types'
import {GitHub} from '@actions/github/lib/utils'

interface UpdatePrTitleParams {
  octokit: InstanceType<typeof GitHub>
  linearClient: LinearClient
  branchFormat: BranchFormat
  owner: string
  repo: string
  pullNumber: number
}

const getPrTitle = (linearIssue: Issue): string => {
  return `${linearIssue.identifier}: ${linearIssue.title}`
}

type UpdatePullResponse =
  Endpoints['PATCH /repos/{owner}/{repo}/pulls/{pull_number}']['response']

export const updatePrTitle = async ({
  octokit,
  linearClient,
  branchFormat,
  owner,
  repo,
  pullNumber
}: UpdatePrTitleParams): Promise<UpdatePullResponse['data']> => {
  const {data: retrievedPr} = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber
  })
  const {ref} = retrievedPr.head
  core.info(`Ref: ${retrievedPr.head.ref}`)

  const {id: linearIssueId} = parseBranchName(ref, branchFormat)
  const linearIssue = await linearClient.issue(linearIssueId)
  const {data: updatedPr} = await octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: pullNumber,
    title: getPrTitle(linearIssue)
  })
  return updatedPr
}
