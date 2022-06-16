import {BranchFormat, parseBranchName} from './parser'
import {Issue, LinearClient} from '@linear/sdk'
import {GitHub} from '@actions/github/lib/utils'
import {Endpoints} from '@octokit/types'

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

type UpdatePullResponse =
  Endpoints['PATCH /repos/{owner}/{repo}/pulls/{pull_number}']['response']

export const updatePrTitle = async ({
  octokit,
  linearClient,
  branchName,
  branchFormat,
  owner,
  repo,
  pullNumber
}: UpdatePrTitleParams): Promise<UpdatePullResponse['data']> => {
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
