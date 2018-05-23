function parseChangelogItem(item) {
  const regex = /#\s?(v\d+\.\d+\.?\d*(-(beta|alpha|rc)\.\d+)?)\n##\s?(.*)([\s\S]*)/g;
  const match = regex.exec(item);

  const tagName = match[1];
  const releaseTitle = match[4];
  const description = match[5];
  const releaseDescription = description.trim();

  if (!tagName || !releaseTitle) throw new Error(BADLY_FORMATTED_CHANGELOG);

  const version = tagName.replace('v', '');

  return {
    version,
    releaseTitle,
    releaseDescription,
  };
}

const BADLY_FORMATTED_CHANGELOG = `Your CHANGELOG.md seems to be badly formatted.
Every item should start with:
# v1.0.0
## Release title`;

function parseChangelog(stdOut) {
  try {
    return getItemsAsStrings(stdOut).map(parseChangelogItem);
  } catch (e) {
    throw new Error(BADLY_FORMATTED_CHANGELOG);
  }
}

function getItemsAsStrings(changelog) {
  const items = [];

  const regexMatches = getRegexMatchesForChangelogItems(changelog);

  if (regexMatches.length < 1) throw new Error(BADLY_FORMATTED_CHANGELOG);

  for (let i = 0; i < regexMatches.length; i++) {
    const match = regexMatches[i];
    if (i < regexMatches.length - 1) {
      const nextMatch = regexMatches[i + 1];
      items.push(changelog.substring(match.index, nextMatch.index));
    } else {
      items.push(changelog.substring(match.index));
    }
  }

  return items;
}

function getRegexMatchesForChangelogItems(changelog) {
  const itemVersionRegex = /#\s?(v\d+\.\d+\.?\d*)/g;
  let match;
  const regexMatches = [];
  while ((match = itemVersionRegex.exec(changelog)) !== null) {
    regexMatches.push(match);
  }
  return regexMatches;
}

module.exports = {
  parseChangelog,
  parseChangelogItem,
};
