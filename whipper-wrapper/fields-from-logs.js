module.exports = [
  { name: 'discId', pattern: /^MusicBrainz disc id ([a-z0-9.]+)/i },
  { name: 'artist', pattern: /^Artist *: (.+)/i },
  { name: 'title', pattern: /^Title *: (.+)/i },
  { name: 'duration', pattern: /^Duration *: (.+)/i },
  { name: 'musicBrainzLookupUrl', pattern: /^MusicBrainz lookup URL (.*)/i },
];
