# VidControl Manual
## Basic concept
VidControl allows you to configure the attributes of &lt;video&gt; tags (AKA HTML5 video) on
any page, independent of the settings set by the page. VidControl makes changes to videos present on the page initially, and videos added later to the page. However, VidControl will not be able to stop other scripts from changing video attributes after it makes its changes.
## Rulesets
In the options menu for VidControl, you will see a table of "rulesets". These
rulesets control *which* pages to make video-related attribute changes to, and
*what* changes should be made to the videos on those pages. The highest
priority ruleset that matches the page domain will be applied.
### Ruleset modification
#### Saving rulesets
Any changes to rulesets must be saved before they can take effect.
lost.
Click the "Save changes" button to save changes.
Closing the options menu without saving will cause your unsaved changes to be
After saving, running tabs and/or windows will need to be manually reloaded to
reflect changes.
#### Adding a ruleset
A new ruleset may be added by clicking the "Add new ruleset" button. This will
append a new row onto the rulesets table. You may then fill in the ruleset
options as desired.
#### Changing a ruleset
To change a ruleset, just edit the ruleset's options in its row.
#### Deleting a ruleset
To delete a ruleset, press the "Delete" button on its row.
### Ruleset options
#### [regex](#regex)
A [JavaScript regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) that determines which pages the ruleset may apply to.
#### [autoplay](#autoplay) [controls](#controls) [loop](#loop) [mute](#mute) [preload](#preload)
These options merely control attributes of the &lt;video&gt;. Please reference [the descriptions of these options on the Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) for more details. Note that settings for the "preload" attribute will have a limited effect on videos in the DOM on page load, as they may have already loaded or started loading before VidControl is run.
#### [priority](#priority)
The priority associated with this ruleset. For a given page, the highest
priority ruleset with a regex matching the page domain will be applied.
