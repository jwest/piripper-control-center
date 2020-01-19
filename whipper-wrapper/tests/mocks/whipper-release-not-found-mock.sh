#!/bin/bash

echo "INFO:whipper.command.cd:using configured read offset 6"
echo "INFO:whipper.command.cd:checking device /dev/cdrom"
echo "CDDB disc id: 7407300a"
echo "MusicBrainz disc id kKrMj0RknVuwLKBn1Om8hwcJbu0-"
echo "MusicBrainz lookup URL https://musicbrainz.org/cdtoc/attach?toc=1+22+364477+150+15933+33032+46481+64238+81046+97359+114482+131698+147732+163788+181038+196001+211996+229416+247124+264883+282083+299542+317168+332494+349483&tracks=22&id=kKrMj0RknVuwLKBn1Om8hwcJbu0-"
echo "Disc duration: 00:30:40.293, 10 audio tracks"
echo "WARNING:whipper.common.program:continuing without metadata"
echo "Submit this disc to MusicBrainz at the above URL."
echo ""
echo "INFO:whipper.command.cd:FreeDB identifies disc as ['Airbourne / Boneshaker']"
echo "CRITICAL:whipper.command.cd:unable to retrieve disc metadata, --unknown argument not passed"

>&2 echo "stderr testing!"

exit 1