#!/bin/bash

echo "INFO:whipper.command.cd:using configured read offset 6"
echo "INFO:whipper.command.cd:checking device /dev/cdrom"
echo "CDDB disc id: 7407300a"
echo "MusicBrainz disc id EXBOGqIv3kyBD7MFtN2djbtQteA-"
echo "MusicBrainz lookup URL https://musicbrainz.org ; use MusicBrainz server at host[:port]/cdtoc/attach?toc=1+10+138172+150+15907+31804+45701+57296+72532+83266+95846+105313+126155&tracks=10&id=EXBOGqIv3kyBD7MFtN2djbtQteA-"
echo "Disc duration: 00:30:40.293, 10 audio tracks"
echo "WARNING:whipper.common.program:continuing without metadata"
echo "Submit this disc to MusicBrainz at the above URL."
echo ""
echo "INFO:whipper.command.cd:FreeDB identifies disc as ['Airbourne / Boneshaker']"
echo "CRITICAL:whipper.command.cd:unable to retrieve disc metadata, --unknown argument not passed"

exit 1