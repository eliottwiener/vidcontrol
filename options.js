var main = function(){
	"use strict";
	var next_row_index = 0;
	var rulesets_table = document.getElementById("rulesets");
	var save_button = document.getElementById("save");
	save_button.addEventListener("click", function(){save();});
	var save_status = document.getElementById("save_status");
	var add_button = document.getElementById("add");
	add_button.addEventListener("click", function(){add_row(default_ruleset)});
	var clear_button = document.getElementById("clear");
	clear_button.addEventListener("click", function(){load();});
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
			var row_index = next_row_index;
			var delete_button = document.createElement("button");
			delete_button.addEventListener("click", function(){delete_row(row_index)});
			delete_button.textContent = "Delete";
			return delete_button;
		}
	}
	var make_row_id = function(row_index){
		var id = "row-" + row_index;
		return id;
	}
	var delete_row = function(row_index){
		var row = document.getElementById(make_row_id(row_index));
		row.parentNode.removeChild(row);
		next_row_index -= 1;
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
	var add_row = function(ruleset) {
		var tr = document.createElement("tr");
		tr.className = "ruleset-row";
		tr.id = make_row_id(next_row_index);
		row_order.forEach(function(i){
			var td = document.createElement("td");
			var element = element_creators[i](ruleset[i]);
			td.appendChild(element);
			tr.appendChild(td);
		});
		rulesets_table.appendChild(tr);
		next_row_index += 1;
	}
	var extract_rulesets = function(){
		var rows = document.getElementsByClassName("ruleset-row");
		var extracted_rulesets = [];
		for(var i = 0; i < rows.length; i++){
			var row = {};
			row_order.forEach(function(r){
				if(r != "delete"){
					row[r] = rows[i].getElementsByClassName(r)[0].value;
				}
			});
			extracted_rulesets.push(row);
		}
		return extracted_rulesets;
	}
	var save = function() {
		var extracted_rulesets = extract_rulesets()
		if(validate_rulesets(extracted_rulesets)){
			chrome.storage.sync.set({
				"rulesets": extracted_rulesets,
			}, function() {
				save_status.textContent = "Changes saved.";
				load();
			});
		}
	}
	var load = function() {
		chrome.storage.sync.get("rulesets", function(items) {
			remove_all_children(rulesets_table);
			next_row_index = 0;
			if(items["rulesets"]){
				items["rulesets"].forEach(function(ruleset){
					add_row(ruleset);
				});
			}
			save_status.textContent = "Saved";
		});
	}
	var remove_all_children = function(node){
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}
	var validate_rulesets = function(rulesets){
		for(var i = 0; i < rulesets.length; i++){
			var row = document.getElementById(make_row_id(i))
			row.style.backgroundColor = "";
			if(!valid_ruleset(rulesets[i])){
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
		save_status.textContent = "Save failed due to invalid ruleset: " + error;
	}
	load();
}
document.addEventListener("DOMContentLoaded", main);
