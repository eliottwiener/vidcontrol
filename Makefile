# VidControl: a Chromium extension that provides advanced control over <video> tags
# Copyright (C) 2015 Eliott Wiener
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
all: clean manual manifest zip
manual: README.markdown
	markdown README.markdown > manual.html
manifest: manifest.json
	#re-indent and sort manifest.json
	#depends on jq https://stedolan.github.io/jq/
	jq --monochrome-output --sort-keys --ascii-output . manifest.json > .clean_manifest.json
	mv .clean_manifest.json manifest.json
clean:
	rm manual.html vidcontrol.zip
zip: clean manual manifest
	zip vidcontrol *
