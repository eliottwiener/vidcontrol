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
var main = function(){
	"use strict";
	document.getElementById("save_button").addEventListener("click", function(){save();});
	document.getElementById("add_button").addEventListener("click", function(){add_row(default_ruleset, false);});
	document.getElementById("clear_button").addEventListener("click", function(){load();});
	var default_ruleset = {
		"regex": ".*",
		"controls": "page",
		"autoplay": "page",
		"mute": "page",
		"loop": "page",
		"preload": "page",
		"priority": 0,
	};
	var create_select = function(attribute, choices, selection){
		var select = document.createElement("select");
		select.className = attribute;
		choices.forEach(function(i){
			var option = document.createElement("option");
			option.text = i;
			if(i === selection){
				option.selected = true;
			}
			select.appendChild(option);
		});
		return select
	}
	var binary_attribute_choices = ["true", "false", "page"];
	var preload_choices = ["none", "metadata", "auto", "page"];
	var element_creators = {
		"regex": function(regex){
			var textfield = document.createElement("input");
			textfield.type = "text";
			textfield.className = "regex";
			textfield.value = regex;
			return textfield;
		},
		"controls": function(selection){
			return create_select(
				"controls",
				binary_attribute_choices,
				selection);
		},
		"autoplay": function(selection){
			return create_select(
				"autoplay",
				binary_attribute_choices,
				selection);
		},
		"mute": function(selection){
			return create_select(
				"mute",
				binary_attribute_choices,
				selection);
		},
		"loop": function(selection){
			return create_select(
				"loop",
				binary_attribute_choices,
				selection);
		},
		"preload": function(selection){
			return create_select(
				"preload",
				preload_choices,
				selection);
		},
		"priority": function(priority){
			var number_field = document.createElement("input")
			number_field.type = "number";
			number_field.className = "priority";
			number_field.value = priority;
			return number_field;
		},
		"delete": function(){
			var delete_button = document.createElement("button");
			delete_button.addEventListener("click", function(){delete_button.parentNode.parentNode.remove()});
			delete_button.textContent = "Delete";
			return delete_button;
		}
	}
	var row_order = [
		"regex",
		"controls",
		"autoplay",
		"mute",
		"loop",
		"preload",
		"priority",
		"delete",
	];
	var binary_attributes = [
		"controls",
		"autoplay",
		"mute",
		"loop",
	]
	var add_row = function(ruleset, from_load) {
		var changed = function(){
			tr.style.backgroundColor = "yellow";
			save_status.textContent = "Unsaved changes";
		}
		var tr = document.createElement("tr");
		row_order.forEach(function(i){
			var td = document.createElement("td");
			var element = element_creators[i](ruleset[i]);
			var save_status = document.getElementById("save_status");
			element.addEventListener("change", changed);
			td.appendChild(element);
			tr.appendChild(td);
		});
		if(!from_load){
			changed();
		}
		document.getElementById("rulesets_table").appendChild(tr);
	}
	var extract_ruleset = function(row){
		var ruleset = {};
		row_order.forEach(function(r){
			if(r != "delete"){
				ruleset[r] = row.getElementsByClassName(r)[0].value;
			}
		});
		return ruleset;
	}
	var extract_rulesets = function(){
		var rulesets = [];
		var rows = document.getElementById("rulesets_table").children;
		for(var i = 0; i < rows.length; i++){
			rulesets.push(extract_ruleset(rows[i]))
		}
		return rulesets;
	}
	var save = function() {
		var extracted_rulesets = extract_rulesets()
		if(validate_rulesets(extracted_rulesets)){
			chrome.storage.sync.set({
				"rulesets": extracted_rulesets,
			}, function() {
				var save_status = document.getElementById("save_status");
				save_status.textContent = "Changes saved.";
				load();
			});
		}
	}
	var load = function() {
		clear_rulesets_table();
		chrome.storage.sync.get("rulesets", function(items) {
			if(items["rulesets"]){
				items["rulesets"].forEach(function(ruleset){
					add_row(ruleset, true);
				});
			}
			var save_status = document.getElementById("save_status");
			save_status.textContent = "Saved";
		});
	}
	var clear_rulesets_table = function(){
		var rulesets_table = document.getElementById("rulesets_table");
		while (rulesets_table.firstChild) {
			rulesets_table.removeChild(rulesets_table.firstChild);
		}
	}
	var validate_rulesets = function(){
		var rulesets_table = document.getElementById("rulesets_table");
		for(var i = 0; i < rulesets_table.children.length; i++){
			var row = rulesets_table.children[i];
			var ruleset = extract_ruleset(row);
			row.style.backgroundColor = "";
			if(!valid_ruleset(ruleset)){
				row.style.backgroundColor = "red";
				return false;
			}
		}
		return true;
	}
	var valid_ruleset = function(ruleset){
		binary_attributes.forEach(function(attr){
			if(binary_attribute_choices.indexOf(ruleset[attr]) == -1){
				invalid_ruleset_error(attr + " must be one of: " + binary_attribute_choices.join(", "));
				return false;
			}
		});
		if(preload_choices.indexOf(ruleset["preload"]) == -1){
			invalid_ruleset_error("preload must be one of: " + preload_choices.join(", "));
			return false;
		}
		try {
			new RegExp(ruleset["regex"]);
		} catch(e) {
			invalid_ruleset_error("regex is invalid: " + e);
			return false;
		}
		if(isNaN(parseFloat(ruleset["priority"]))){
			invalid_ruleset_error("priority must be a number");
			return false;
		}
		return true;
	}
	var invalid_ruleset_error = function(error){
		var save_status = document.getElementById("save_status");
		save_status.textContent = "Save failed due to invalid ruleset: " + error;
	}
	load();
}
document.addEventListener("DOMContentLoaded", main);
