# automatically-set-milestone-to-issue

This action set milestone that is maximum patch version to issue or pull request automatically.

## Inputs

## `github-token`

**Required** Github Token

## `version-prefix`

the prefix of application version. Default `v`

## `version-separator`

the separator of application version. Default `.`


## Outputs

## `milestone-number`

The milestone number that the action set.

## `milestone-title`

The milestone title that the action set.

## Example
```
uses: cgetc/automatically-set-milestone-to-issue@v0.1.2
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
```
