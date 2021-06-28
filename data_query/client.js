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
    class DataQueryNode extends Node {
        /*
         * Static class method for creating a new card with a definition from the template 
         * provided below.
         */

        static createCard(cardName) {
            var card = {
                "name": cardName, 
                "conditions": [], 
                "unavailable_data_action": null,
                "type": "data-query", 
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
            return 'Data Query';
        }

        cardType() {
            return 'Data Query';
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
            var summary = "TODO"; 
            
            return summary;
        }

        cardFields() {
            var defaultCard = DataQueryNode.createCard('');
            
            return [{
                'field': 'processor',
                'type': 'choice',
                'label': {
                    'en': 'Data Processor'
                }, 'options': '/builder/data-processor-options.json'
            }, {
                'field': 'scope',
                'type': 'choice',
                'label': {
                    'en': 'Scope'
                }, 'options': [{
                    'value': 'session',
                    'label': {
                        'en': 'Session'
                    }
                }, {
                    'value': 'player',
                    'label': {
                        'en': 'Player'
                    }
                }, {
                    'value': 'game',
                    'label': {
                        'en': 'Game'
                    }
                }]
            }, {
				'type': 'readonly',
				'value': {
					'en': 'Next:',
				},
				'width': 8
			}, {
				'field': 'next',
				'type': 'card',
				'width': 4
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

            if (this.definition['next'] != undefined) {
                if (nextIds.indexOf(this.definition['next']) == -1) {
                    nextIds.push(this.definition['next']);
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
            if (this.definition['next'] != undefined) {
                if (this.definition['next'] == oldId) {
                    this.definition['next'] = newId;

                    if (newId == null) {
                        delete this.definition['next'];
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
            
            if (this.definition['next'] == undefined || this.definition['next'].trim().length == 0) {
                issues.push(['No "next" action provided.', 'node', this.definition['id'], this.cardName()]);
            }
            
            return issues;
        }
    }

    /*
     * Registers with the overall system that this card type is ready for use.
     */

    Node.registerCard('data-query', DataQueryNode);
});
