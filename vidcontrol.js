/*
VidControl: a Chromium extension that provides advanced control over <video> tags
Copyright (C) 2015 Eliott Wiener

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
(function(){
	"use strict";

	var pick_ruleset = function(rulesets){
		var matching_rulesets = [];
		rulesets.forEach(function(r){
			var re = new RegExp("^"+r["regex"]+"$");
			if(re.test(window.location.host)){
				matching_rulesets.push(r);
			}
		});
		if(matching_rulesets.length != 0){
			matching_rulesets.sort(function(a,b){
				return a["priority"] < b["priority"]
			});
			run_ruleset(matching_rulesets[0]);
		}
	}

	var load = function() {
		chrome.storage.sync.get("rulesets", function(items) {
			if(items["rulesets"]){
				pick_ruleset(items["rulesets"])
			}
		});
	}

	var apply_settings = function(video, ruleset){
		console.log("applying " + JSON.stringify(ruleset));
		if(ruleset["autoplay"] !== "page"){
			if(ruleset["autoplay"] === "true"){
				video["autoplay"] = true;
				video.play();
			} else if(ruleset["autoplay"] === "false"){
				video["autoplay"] = false;
				video.pause();
				video.currentTime = 0;
			}
		}
		["controls", "mute", "loop"].forEach(function(attr){
			if(ruleset[attr] !== "page"){
				if(ruleset[attr] === "true"){
					video[attr] = true;
				} else if(ruleset[attr] === "false"){
					video[attr] = false;
				}
			}
		});
		if(ruleset["preload"] !== "page"){
			video["preload"] = ruleset["preload"];
		}
	}

	var new_videos_observer = function(ruleset){
		var mo = new MutationObserver(function(mutations){
			mutations.forEach(function(mutation, this_observer){
				for (var i = 0; i < mutation.addedNodes.length; i++){
					process_new_videos(mutation.addedNodes[i], ruleset);
				}
			});
		});
		return mo;
	}
	var new_videos_observer_options = {
		childList: true,
		subtree: true,
	}

	var process_new_videos = function(node, ruleset){
		if(node.getElementsByTagName){
			var videos = node.getElementsByTagName("video");
			videos = Array.prototype.slice.call(videos);
			if(node.tagName === "VIDEO"){
				videos.push(node);
			}
			console.log("found " + videos.length +" new videos");
			videos.forEach(function(v){
				apply_settings(v, ruleset);
			});
		}
	}

	var run_ruleset = function(ruleset){
		process_new_videos(document, ruleset);
		new_videos_observer(ruleset).observe(document, new_videos_observer_options);
	}

	load();
})();
