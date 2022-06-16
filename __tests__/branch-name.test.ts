import {expect, test} from '@jest/globals'
import {BranchFormat, LinearIssueComponent, parseBranchName} from "../src/branch-format";

test.each([
  ['user-name-id-123-issue title', BranchFormat.usernameIdentifierTitle, {identifier: 'id-123'}],
  ['user-name-id-123', BranchFormat.userIdentifier, {identifier: 'id-123'}],
  ['id-123-issue title', BranchFormat.identifierTitle, {identifier: 'id-123'}],
  ['issue title-id-123', BranchFormat.titleIdentifier, {identifier: 'id-123'}],
  ['id-123', BranchFormat.identifier, {identifier: 'id-123'}],
  ['feature/id-123-issue-title', BranchFormat.prefixIdentifierTitle, {identifier: 'id-123'}],
  ['feature/id-123', BranchFormat.prefixIdentifier, {identifier: 'id-123'}],
])("Test (%s, %s) parsed to expected (%s)", (branchName: string, branchFormat: BranchFormat, expected: LinearIssueComponent) => {
  expect(parseBranchName(branchName, branchFormat)).toEqual(expected)
})
