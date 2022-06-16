import { expect, test } from "@jest/globals";
import { BranchFormat, LinearIssue, parseBranchName } from "../src/parser";

test.each([
  ['user-name-id-123-issue title', BranchFormat.usernameIdentifierTitle, {id: 'ID-123'}],
  ['user-name-id-123', BranchFormat.userIdentifier, {id: 'ID-123'}],
  ['id-123-issue title', BranchFormat.identifierTitle, {id: 'ID-123'}],
  ['issue title-id-123', BranchFormat.titleIdentifier, {id: 'ID-123'}],
  ['id-123', BranchFormat.identifier, {id: 'ID-123'}],
  ['feature/id-123-issue-title', BranchFormat.prefixIdentifierTitle, {id: 'ID-123'}],
  ['feature/id-123', BranchFormat.prefixIdentifier, {id: 'ID-123'}],
])("Test (%s, %s) parsed to expected (%s)", (branchName: string, branchFormat: BranchFormat, expected: LinearIssue) => {
  expect(parseBranchName(branchName, branchFormat)).toEqual(expected)
})
