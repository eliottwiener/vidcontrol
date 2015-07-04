all: manual manifest
manual: manual.markdown
	markdown manual.markdown > manual.html
manifest: manifest.json
	#re-indent and sort manifest.json
	#depends on jq https://stedolan.github.io/jq/
	jq --monochrome-output --sort-keys --ascii-output . manifest.json > .clean_manifest.json
	mv .clean_manifest.json manifest.json
clean:
	rm manual.html
