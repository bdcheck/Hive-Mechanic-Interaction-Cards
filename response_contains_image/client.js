var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
    class ReponseContainsImageNode extends Node {
        constructor(definition, sequence) {
            super(definition, sequence);
        }

        editBody() {
            var me = this;

            var destinationNodes = me.destinationNodes(me.sequence);

            var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 mdc-typography--caption" style="padding-top: 8px;">' +
                       '  Response DOES contain image:' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="padding-top: 8px; text-align: right;">' +
                       '  <button class="mdc-icon-button" id="' + this.cardId + '_has_image_edit">' +
                       '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>' +
                       '  </button>' + 
                       '  <button class="mdc-icon-button" id="' + this.cardId + '_has_image_goto">' +
                       '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>' +
                       '  </button>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 mdc-typography--caption" style="padding-top: 8px;">' +
                       '  Response DOES NOT contain image:' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="padding-top: 8px; text-align: right;">' +
                       '  <button class="mdc-icon-button" id="' + this.cardId + '_no_image_edit">' +
                       '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>' +
                       '  </button>' + 
                       '  <button class="mdc-icon-button" id="' + this.cardId + '_no_image_goto">' +
                       '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>' +
                       '  </button>' +
                       '</div>' +
                       '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">' +
                       '  <div class="mdc-dialog__container">' +
                       '    <div class="mdc-dialog__surface">' +
                       '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>';

            body += this.sequence.chooseDestinationMenu(this.cardId);
            body += '    </div>';
            body += '  </div>';
            body += '</div>';
            
            return body;
        }

        viewBody() {
        	var summary = ""; 

			summary += '<div class="mdc-typography--body1" style="margin: 16px;">';
        	
            if (this.definition['has_image_action'] != undefined) {
		    	summary += "If last message included an image, go to " + this.definition['has_image_action'] + '. ';
            }

            if (this.definition['no_image_action'] != undefined) {
		    	summary += "If last message did not include an image, go to " + this.definition['no_image_action'] + '. ';
            }
            
			summary += '</div>';
            return summary;
        }
        
        initialize() {
            super.initialize();
            
            var me = this;

			me.sequence.initializeDestinationMenu(me.cardId, function(selected) {
				me.definition[self.action_key] = selected;

				me.sequence.markChanged(me.id);
				me.sequence.loadNode(me.definition);
			});

			const dialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'));

            $('#' + this.cardId + '_has_image_edit').on("click", function() {
            	self.action_key = 'has_image_action';
            	
                dialog.open();
            });

            $('#' + this.cardId + '_has_image_goto').on("click", function() {
                var destinationNodes = me.destinationNodes(me.sequence);
                
                for (var i = 0; i < destinationNodes.length; i++) {
                    const destinationNode = destinationNodes[i];
                    
                    if (me.definition["has_image_action"].endsWith(destinationNode["id"])) {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
                    } else {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
                    }
                }
            });

            $('#' + this.cardId + '_no_image_edit').on("click", function() {
             	self.action_key = 'no_image_action';
            	
               dialog.open();
            });

            $('#' + this.cardId + '_no_image_goto').on("click", function() {
                var destinationNodes = me.destinationNodes(me.sequence);
                
                for (var i = 0; i < destinationNodes.length; i++) {
                    const destinationNode = destinationNodes[i];
                    
                    if (me.definition["no_image_action"].endsWith(destinationNode["id"])) {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
                    } else {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
                    }
                }
            });
        }

        destinationNodes(sequence) {
            var nodes = super.destinationNodes();

            var nextIds = [];
            
            if (this.definition['has_image_action'] != undefined) {
				nextIds.push(this.definition['has_image_action']);
            }

            if (this.definition['no_image_action'] != undefined) {
				nextIds.push(this.definition['no_image_action']);
            }

            for (var i = 0; i < nextIds.length; i++) {
                var id = nextIds[i];

                var pushed = false;

                for (var j = 0; j < sequence.definition['items'].length; j++) {
                    var item = sequence.definition['items'][j];

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

		updateReferences(oldId, newId) {
            if (this.definition['has_image_action'] != undefined) {
                if (this.definition['has_image_action'] == oldId) {
	                this.definition['has_image_action'] = newId;
                }
			}

            if (this.definition['no_image_action'] != undefined) {
                if (this.definition['no_image_action'] == oldId) {
	                this.definition['no_image_action'] = newId;
                }
			}
		}
        
        cardType() {
            return 'Response Contains Image?';
        }

		static cardName() {
			return 'Response Contains Image?';
		}

		static createCard(cardName) {
			var card = {
				"name": cardName, 
				"type": "response-contains-image", 
				"id": Node.uuidv4()
			}; 

			return card;
		}
    }

    Node.registerCard('response-contains-image', ReponseContainsImageNode);
});
