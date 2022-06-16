export type BranchFormat =
  | 'username-identifier-title'
  | 'user-identifier'
  | 'identifier-title'
  | 'title-identifier'
  | 'identifier'
  | 'prefix/identifier-title'
  | 'prefix/identifier'

export interface LinearIssue {
  id: string
}

const identifierToId = (identifier: string): string => {
  return identifier.toUpperCase()
}

const matchBranchName = (branchName: string, pattern: string): LinearIssue => {
  const groups = branchName.match(pattern)?.groups
  if (!groups) {
    throw Error('Cannot parse branch name')
  }
  const {identifier} = groups
  return {id: identifierToId(identifier)}
}

export const parseBranchName = (
  branchName: string,
  branchFormat: BranchFormat
): LinearIssue => {
  switch (branchFormat) {
    case 'username-identifier-title': {
      return matchBranchName(
        branchName,
        '(?<username>.*)-(?<identifier>(\\w+)-[0-9]+)-(?<title>.*)'
      )
    }
    case 'user-identifier': {
      return matchBranchName(
        branchName,
        '(?<username>.*)-(?<identifier>(\\w+)-[0-9]+)'
      )
    }
    case 'identifier-title': {
      return matchBranchName(
        branchName,
        '(?<identifier>(\\w+)-[0-9]+)-(?<title>.*)'
      )
    }
    case 'title-identifier': {
      return matchBranchName(
        branchName,
        '(?<title>.*)-(?<identifier>(\\w+)-[0-9]+)'
      )
    }
    case 'identifier': {
      return {id: identifierToId(branchName)}
    }
    case 'prefix/identifier-title': {
      const [, suffix] = branchName.split('/')
      return parseBranchName(suffix, 'identifier-title')
    }
    case 'prefix/identifier': {
      const [, suffix] = branchName.split('/')
      return parseBranchName(suffix, 'identifier')
    }
  }
}
