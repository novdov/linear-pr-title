export enum BranchFormat {
  usernameIdentifierTitle = 'username-identifier-title',
  userIdentifier = 'user-identifier',
  identifierTitle = 'identifier-title',
  titleIdentifier = 'titleIdentifier',
  identifier = 'identifier',
  prefixIdentifierTitle = 'prefix/identifier-title',
  prefixIdentifier = 'prefix/identifier'
}

export interface LinearIssueComponent {
  identifier: string
}

const matchBranchName = (
  branchName: string,
  pattern: string
): LinearIssueComponent => {
  const groups = branchName.match(pattern)?.groups
  if (!groups) {
    throw Error('Cannot parse branch name')
  }
  const {identifier} = groups
  return {identifier}
}

export const parseBranchName = (
  branchName: string,
  branchFormat: BranchFormat
): LinearIssueComponent => {
  switch (branchFormat) {
    case BranchFormat.usernameIdentifierTitle: {
      return matchBranchName(
        branchName,
        '(?<username>.*)-(?<identifier>(\\w+)-[0-9]+)-(?<title>.*)'
      )
    }
    case BranchFormat.userIdentifier: {
      return matchBranchName(
        branchName,
        '(?<username>.*)-(?<identifier>(\\w+)-[0-9]+)'
      )
    }
    case BranchFormat.identifierTitle: {
      return matchBranchName(
        branchName,
        '(?<identifier>(\\w+)-[0-9]+)-(?<title>.*)'
      )
    }
    case BranchFormat.titleIdentifier: {
      return matchBranchName(
        branchName,
        '(?<title>.*)-(?<identifier>(\\w+)-[0-9]+)'
      )
    }
    case BranchFormat.identifier: {
      return {identifier: branchName}
    }
    case BranchFormat.prefixIdentifierTitle: {
      const [, suffix] = branchName.split('/')
      return parseBranchName(suffix, BranchFormat.identifierTitle)
    }
    case BranchFormat.prefixIdentifier: {
      const [, suffix] = branchName.split('/')
      return parseBranchName(suffix, BranchFormat.identifier)
    }
  }
}
