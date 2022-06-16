import {BranchFormat, parseBranchName} from './parser'
import {Issue, LinearClient} from '@linear/sdk'
import {GitHub} from '@actions/github/lib/utils'

interface UpdatePrTitleParams {
  octokit: InstanceType<typeof GitHub>
  linearClient: LinearClient
  branchName: string
  branchFormat: BranchFormat
  owner: string
  repo: string
  pullNumber: number
}

const getPrTitle = (linearIssue: Issue): string => {
  return `${linearIssue.id} ${linearIssue.title}`
}

export const updatePrTitle = async ({
  octokit,
  linearClient,
  branchName,
  branchFormat,
  owner,
  repo,
  pullNumber
}: UpdatePrTitleParams) => {
  const {id: linearIssueId} = parseBranchName(branchName, branchFormat)
  const linearIssue = await linearClient.issue(linearIssueId)

  const {data} = await octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: pullNumber,
    title: getPrTitle(linearIssue)
  })
  return data
}
