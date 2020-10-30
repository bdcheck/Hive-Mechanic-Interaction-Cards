var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
    class PauseNode extends Node {
        constructor(definition, sequence) {
            super(definition, sequence);
        }

		cardIcon() {
			return '<i class="fas fa-pause" style="margin-right: 16px; font-size: 20px; "></i>';
		}

        editBody() {
            var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_duration_field" style="width: 100%">' + 
                       '    <input class="mdc-text-field__input"style="width: 100%" id="' + this.cardId + '_duration_value" />' + 
                       '    <div class="mdc-notched-outline">' + 
                       '      <div class="mdc-notched-outline__leading"></div>' + 
                       '      <div class="mdc-notched-outline__notch">' + 
                       '        <label for="' + this.cardId + '_cookie_name_value" class="mdc-floating-label">Duration (Seconds)</label>' + 
                       '      </div>' + 
                       '      <div class="mdc-notched-outline__trailing"></div>' + 
                       '    </div>' + 
                       '  </div>' + 
                       '</div>' + 
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 mdc-typography--caption" style="padding-top: 8px;">' +
                       '  The activity will pause for a duration, then resume.' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="padding-top: 8px; text-align: right;">' +
                       '  <button class="mdc-icon-button" id="' + this.cardId + '_next_edit">' +
                       '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>' +
                       '  </button>' + 
                       '  <button class="mdc-icon-button" id="' + this.cardId + '_next_goto">' +
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
            return '<div class="mdc-typography--body1" style="margin: 16px;">Pauses for ' + this.definition['duration'] + ' second(s).</div>';
        }

        initialize() {
            super.initialize();
            
            const me = this;

            const nameField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_duration_field'));
            nameField.value = '' + this.definition['duration'];

            $('#' + this.cardId + '_duration_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_duration_value').val();
                
                me.definition['duration'] = parseInt(value);
                
                me.sequence.markChanged(me.id);
            });

			me.sequence.initializeDestinationMenu(me.cardId, function(selected) {
				me.definition['next'] = selected;

				me.sequence.markChanged(me.id);
				me.sequence.loadNode(me.definition);
			});

            const dialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'));

            $('#' + this.cardId + '_next_edit').on("click", function() {
                dialog.open();
            });

            $('#' + this.cardId + '_next_goto').on("click", function() {
                var destinationNodes = me.destinationNodes(me.sequence);
                
                for (var i = 0; i < destinationNodes.length; i++) {
                    const destinationNode = destinationNodes[i];
                    
                    if (me.definition["next"].endsWith(destinationNode["id"])) {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
                    } else {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
                    }
                }
            });
        }

        issues(sequence) {
            var issues = super.issues(sequence);

            console.log('PAUSE');
            console.log(this.definition);
            
            if (this.definition['duration'] == undefined) {
	            issues.push(['No duration provided.', 'node', this.definition['id'], this.cardName()]);
            }

            if (this.definition['duration'] < 1 || isNaN(this.definition['duration'])) {
	            issues.push(['Invalid duration provided.', 'node', this.definition['id'], this.cardName()]);
            }
            
            return issues;
        }

        updateReferences(oldId, newId) {
            if (this.definition['next'] == oldId) {
                this.definition['next'] = newId;

				if (newId == null) {
					delete this.definition['next'];
				}
            }
        }

        destinationNodes(sequence) {
            var nodes = super.destinationNodes(sequence);

			var id = this.definition['next'];
			
            for (var i = 0; i < this.sequence.definition['items'].length; i++) {
                var item = this.sequence.definition['items'][i];
                
				if (item['id'] == id || (this.sequence['definition']['id'] + "#" + item['id']) == id) {
                    nodes.push(Node.createCard(item, sequence));
                }
            }
           
           	if (nodes.length == 0) {
				var node = this.sequence.resolveNode(id);
				
				if (node != null) {
					nodes.push(node);
				} else {
					delete this.definition['next'];
				}
           	} 

            return nodes;
        }

        cardType() {
            return 'Pause';
        }

        static cardName() {
            return 'Pause';
        }

        static createCard(cardName) {
            var card = {
                "name": cardName, 
                "type": "pause", 
                "duration": "5",
                "id": Node.uuidv4()
            }; 
            
            return card;
        }
    }

    Node.registerCard('pause', PauseNode);
    
    return PauseNode;
});
