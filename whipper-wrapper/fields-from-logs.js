module.exports = [
  { name: 'discId', pattern: /^MusicBrainz disc id ([a-z0-9.]+)/i },
  { name: 'artist', pattern: /^Artist *: (.+)/i },
  { name: 'title', pattern: /^Title *: (.+)/i },
  { name: 'duration', pattern: /^Duration *: (.+)/i },
  { name: 'musicBrainzLookupUrl', pattern: /^MusicBrainz lookup URL (.*)/i },
  { name: 'allTrackNo', pattern: /^Ripping track [0-9]+ of ([0-9]+): .*/i },
  { name: 'trackNo', pattern: /^Ripping track ([0-9]+) of [0-9]+: .*/i },
  { name: 'trackName', pattern: /^Ripping track [0-9]+ of [0-9]+: (.*)/i },
];
