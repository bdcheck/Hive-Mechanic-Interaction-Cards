/*
 * Loads the necessary modules required for operation.
 * 
 * material: Material Design for the Web (MDC-Web). Provides UI elements used in the 
 *           construction of card interfaces.
 * 
 * cards/node: Card node base class. Hive Mechanic class that provides the commonly-used
 *             elements for all cards, including basic layout, lifecycle management, 
 *             change tracking, and more.
 *
 * jquery: jQuery JavaScript library providing various utility functions.
 */

var modules = ["material", 'cards/node', 'jquery'];

define(modules, function (mdc, Node) {
    class ProcessResponseNode extends Node {
        /*
         * Static class method for creating a new card with a definition from the template 
         * provided below.
         */

        static createCard(cardName) {
            var card = {
                "name": cardName, 
                "patterns": [], 
                "timeout": {
                    "duration": 15,
                    "units": "minute", 
                    "action": null
                },
                "type": "process-response", 
                "id": Node.uuidv4()
            }; 
            
            return card;
        }
        
        /*
         * Standard constructor used to create card and set up the superclass.
         */
         
        constructor(definition, sequence) {
            super(definition, sequence);
        }
        
        /*
         * Defines human-readable card name and card type. 
         * (TODO: Check if this can be simplified to one method...)
         */

        static cardName() {
            return 'Process Response';
        }

        cardType() {
            return 'Process Response';
        }
        
        /*
         * Provides HTML necessary to populate the card icon portion of the interface.
         */

        cardIcon() {
            return '<i class="fas fa-spell-check" style="margin-right: 16px; font-size: 20px; "></i>';
        }
        
        /*
         * Provides the HTML content for use in view-only contexts where the card's 
         * function can be summarized, primarily source and destination lists in the UI.
         */

        viewBody() {
            var summary = ""; 
            
            for (var i = 0; i < this.definition['patterns'].length; i++) {
                var patternDef = this.definition['patterns'][i];
                
                var humanized = this.humanizePattern(patternDef["pattern"], patternDef["action"]);
                
                summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + humanized + '</div>';
            }
            
            if (this.definition['not_found_action'] != undefined && this.definition['not_found_action'] != '') {
                var action = this.lookupCardName(this.definition['not_found_action']);

                summary += '<div class="mdc-typography--body1" style="margin: 16px;">';
                summary += "If responses doesn't match a prior pattern, go to <em>" + action + '</em>.';
                summary += '</div>';
            }
            
            if (this.definition['timeout'] != undefined) {
                if (this.definition['timeout']['action'] != undefined && this.definition['timeout']['action'] != '') {
                    var action = this.lookupCardName(this.definition['timeout']['action']);

                    summary += '<div class="mdc-typography--body1" style="margin: 16px;">';
                    summary += "If no responses is received within " + this.definition['timeout']["duration"] + " " + this.definition['timeout']["units"] + "(s), go to <em>" + action + "</em>.";
                    summary += '</div>';
                }
            }
            
            return summary;
        }

        cardFields() {
            return [{
                'field': 'patterns',
                'type': 'list',
                'label': {
                	'en': 'Patterns'
                },
                'template': [{
					'field': 'pattern',
					'type': 'pattern',
					'operation_label': {
						'en': 'Response...'
					}, 
					'operation_width': 8,
					'content_label': {
						'en': 'Text...'
					},
					'content_width': 8
				}, {
					'field': 'action',
					'type': 'card',
					'width': 4
				}, {
					'type': 'readonly',
					'value': '----',
					'width': 12
	            }],
	        	'add_item_label': {
	        		'en': 'Add Pattern'
	        	}
            }, {
				'type': 'readonly',
				'value': {
					'en': 'Pattern Not Found:',
				},
				'width': 8
			}, {
				'field': 'not_found_action',
				'type': 'card',
				'width': 4
			}, {
				'type': 'readonly',
				'value': '----',
				'width': 12
            }, {
                'field': 'timeout',
                'type': 'structure',
                'label': {
                	'en': 'Timeout Parameters'
                },
                'fields': [{
					'field': 'duration',
					'type': 'integer',
					'input': 'text',
					'label': {
						'en': 'Duration.'
					},
					'width': 4
				}, {
					'field': 'units',
					'type': 'choice',
					'label': {
						'en': 'Unit'
					}, 'options': [{
						'value': 'second',
						'label': {
							'en': 'Seconds'
						}
					}, {
						'value': 'minute',
						'label': {
							'en': 'Minutes'
						}
					}, {
						'value': 'hour',
						'label': {
							'en': 'Hours'
						}
					}, {
						'value': 'day',
						'label': {
							'en': 'Days'
						}
					}],
					'width': 4
				}, {
					'field': 'action',
					'type': 'card',
					'width': 4
				}]
			}, {
				'type': 'readonly',
				'value': '----',
				'is_help': true,
				'width': 12
            }, {
				'type': 'readonly',
				'value': {
					'en': 'Processes response to prior message and proceeds to the first action to match response'
				},
				'is_help': true,
				'width': 12
            }];
        }

        /*
         * "Wires up" the editable HTML content so that changes and updates are reflected
         * in the user interface.
         * 
         * This is a separate function than <code>editBody</code>, given that the UI 
         * elements cannot be activated until <em>after</em> they are embedded in the 
         * browser's HTML DOM.
         */

        initialize() {
            super.initialize();
            
            this.initializeFields();
        }

        /*
         * Provides a list of destination nodes that this node can lead to, depending on
         * the relevant interaction sequence.
         *
         * Indirectly used by <code>Node.sourceNodes</code> to <em>also</em> generate a 
         * list of source nodes as well.
         */

        destinationNodes(sequence) {
            var nodes = super.destinationNodes();

            var nextIds = [];

            for (var i = 0; i < this.definition['patterns'].length; i++) {
                var pattern = this.definition['patterns'][i];
                
                if (nextIds.indexOf(pattern['action']) == -1) {
                    nextIds.push(pattern['action']);
                }
            }

            if (this.definition['not_found_action'] != undefined) {
                if (nextIds.indexOf(this.definition['not_found_action']) == -1) {
                    nextIds.push(this.definition['not_found_action']);
                }
            }
            
            if (this.definition['timeout'] != undefined) {
                if (this.definition['timeout']['action'] != undefined) {
                    if (nextIds.indexOf(this.definition['timeout']['action']) == -1) {
                        nextIds.push(this.definition['timeout']['action']);
                    }
                }
            }

            for (var i = 0; i < nextIds.length; i++) {
                var id = nextIds[i];
                
                var pushed = false;

                for (var j = 0; j < this.sequence.definition['items'].length; j++) {
                    var item = this.sequence.definition['items'][j];

                    if (item['id'] == id || (this.sequence['definition']['id'] + "#" + item['id']) == id) {
                        var node = Node.createCard(item, sequence);

                        nodes.push(node);
                        
                        pushed = true;
                    }
                }
                
                if (pushed == false) {
                    var node = this.sequence.resolveNode(id);
                
                    if (node != null) {
                        nodes.push(node);
                    }
                } 
            }

            return nodes;
        }

        /*
         * In the event that a referenced node identifier is updated elsewhere, replaces
         * instances of the old node ID with the new node ID so that users do not have to 
         * reconnect nodes after an ID change.
         */

        updateReferences(oldId, newId) {
            for (var i = 0; i < this.definition['patterns'].length; i++) {
                var pattern = this.definition['patterns'][i];
                
                if (pattern['action'] == oldId) {
                    pattern['action'] = newId;

                    if (newId == null) {
                        delete pattern['action'];
                    }
                }
            }

            if (this.definition['not_found_action'] != undefined) {
                if (this.definition['not_found_action'] == oldId) {
                    this.definition['not_found_action'] = newId;

                    if (newId == null) {
                        delete this.definition['not_found_action'];
                    }
                }
            }

            if (this.definition['timeout'] != undefined) {
                if (this.definition['timeout']['action'] != undefined) {
                    if (this.definition['timeout']['action'] == oldId) {
                        this.definition['timeout']['action'] = newId;

                        if (newId == null) {
                            delete this.definition['timeout']['action'];
                        }
                    }
                }
            }
        }

        /*
         * Identifies any outstanding issues with the configuration of the node that might
         * impair expected operation. Used to populate the warning issues list when saving
         * the activity.
         */

        issues(sequence) {
            var issues = super.issues(sequence);
            
            if (this.definition['not_found_action'] == undefined || this.definition['not_found_action'].trim().length == 0) {
                issues.push(['No "not found" action provided.', 'node', this.definition['id'], this.cardName()]);
            }

//            if (this.definition['timeout'] == undefined || this.definition['timeout']['action'] == undefined || this.definition['timeout']['action'].trim().length == 0) {
//              issues.push(['No "timeout" action provided.', 'node', this.definition['id'], this.cardName()]);
//            }

            for (var i = 0; i < this.definition['patterns'].length; i++) {
                var pattern = this.definition['patterns'][i];
                
                if (pattern['action'] == undefined || pattern['action'].trim().length == 0) {
                    issues.push(['No action provided for pattern "' + pattern['pattern'] + '".', 'node', this.definition['id'], this.cardName()]);
                }
            }
            
            return issues;
        }

        /*
         * Translates Python regular expressions into human-readable text describing the 
         * pattern's operation.
         */
        
        humanizePattern(pattern, action) {
            if (action == undefined || action == "?" || action == null || action == "") {
                action = "?";
            }
            
            action = this.lookupCardName(action);

            if (pattern.startsWith("^[") && pattern.endsWith("]")) {
                var matches = [];
                
                for (var i = 2; i < pattern.length - 1; i++) {
                    matches.push("" + pattern[i]);
                }
                
                var humanized = "";
                
                for (var i = 0; i < matches.length; i++) {
                    if (humanized.length > 0) {
                        if (i < matches.length - 1) {
                            humanized += ", ";
                        } else if (matches.length > 2){
                            humanized += ", or ";
                        } else {
                            humanized += " or ";
                        }
                    }
                    
                    humanized += "\"" + matches[i] + "\"";
                }
                
                return "If response starts with " + humanized + ", go to <em>" + action + '</em>.';
            } else if (pattern== ".*") {
                return "If response is anything, go to <em>" + action + '</em>.';
            } else {
                return "If response is \"" + pattern + "\", go to <em>" + action + '</em>.';
            }
            
            return "If responses matches \"" + pattern + "\", go to <em>" + action + '</em>.';
        }
    }

    /*
     * Registers with the overall system that this card type is ready for use.
     */

    Node.registerCard('process-response', ProcessResponseNode);
});
