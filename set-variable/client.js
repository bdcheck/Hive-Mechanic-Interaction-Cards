var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
    class SetVariableNode extends Node {
        constructor(definition, sequence) {
            super(definition, sequence);
        }

		cardIcon() {
			return '<i class="fas fa-download" style="margin-right: 16px; font-size: 20px; "></i>';
		}

        editBody() {
            var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_variable_name_field" style="width: 100%">' + 
                       '    <input class="mdc-text-field__input"style="width: 100%" id="' + this.cardId + '_variable_name_value" />' + 
                       '    <div class="mdc-notched-outline">' + 
                       '      <div class="mdc-notched-outline__leading"></div>' + 
                       '      <div class="mdc-notched-outline__notch">' + 
                       '        <label for="' + this.cardId + '_variable_name_value" class="mdc-floating-label">Name</label>' + 
                       '      </div>' + 
                       '      <div class="mdc-notched-outline__trailing"></div>' + 
                       '    </div>' + 
                       '  </div>' + 
                       '</div>' + 
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_variable_value_field" style="width: 100%">' + 
                       '    <input class="mdc-text-field__input" style="width: 100%" id="' + this.cardId + '_variable_value_value" />' + 
                       '    <div class="mdc-notched-outline">' + 
                       '      <div class="mdc-notched-outline__leading"></div>' + 
                       '      <div class="mdc-notched-outline__notch">' + 
                       '        <label for="' + this.cardId + '_variable_value_value" class="mdc-floating-label">Value</label>' + 
                       '      </div>' + 
                       '      <div class="mdc-notched-outline__trailing"></div>' + 
                       '    </div>' + 
                       '  </div>' + 
                       '</div>' + 
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">' +
                       '<div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_scope">' +
                       '  <div class="mdc-select__anchor" style="width: 100%;">' +
                       '    <i class="mdc-select__dropdown-icon"></i>' +
                       '    <div class="mdc-select__selected-text" aria-labelledby="outlined-select-label"></div>' +
                       '    <span class="mdc-notched-outline">' +
                       '      <span class="mdc-notched-outline__leading"></span>' +
                       '      <span class="mdc-notched-outline__notch">' +
                       '        <span id="outlined-select-label" class="mdc-floating-label">Scope</span>' +
                       '      </span>' +
                       '      <span class="mdc-notched-outline__trailing"></span>' +
                       '    </span>' +
                       '  </div>' +
                       '  <div class="mdc-select__menu mdc-menu mdc-menu-surface" role="listbox">' +
                       '    <ul class="mdc-list">' +
                       '      <li class="mdc-list-item" data-value="session" role="option">Session</li>' +
                       '      <li class="mdc-list-item" data-value="player" role="option">Player</li>' +
                       '      <li class="mdc-list-item" data-value="game" role="option">Game</li>' +
                       '    </ul>' +
                       '  </div>' +
                       '</div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 mdc-typography--caption" style="padding-top: 8px;">' +
                       '  The variable will be set and the system will proceed to the next action.' +
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
            return '<div class="mdc-typography--body1" style="margin: 16px;">' + this.definition['variable'] + ' = ' + this.definition['value'] + '</div>';
        }

        initialize() {
            super.initialize();
            
            const me = this;

            const nameField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_variable_name_field'));
            nameField.value = this.definition['variable'];

            $('#' + this.cardId + '_variable_name_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_variable_name_value').val();
                
                me.definition['variable'] = value;
                
                me.sequence.markChanged(me.id);
            });

            const valueField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_variable_value_field'));
            valueField.value = this.definition['value'];

            $('#' + this.cardId + '_variable_value_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_variable_value_value').val();
                
                me.definition['value'] = value;
                
                me.sequence.markChanged(me.id);
            });

            const scopeField = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_scope'));
            
            if (this.definition["scope"] != undefined) {
                scopeField.value = this.definition["scope"];
            }
            
            scopeField.listen('MDCSelect:change', () => {
                me.definition["scope"] = scopeField.value;

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

            if (this.definition['variable'] == undefined || this.definition['variable'].trim().length == 0) {
	            issues.push(['No variable name provided.', 'node', this.definition['id'], this.cardName()]);
            }

            if (this.definition['value'] == undefined || this.definition['value'].trim().length == 0) {
	            issues.push(['No value provided.', 'node', this.definition['id'], this.cardName()]);
            }

            if (this.definition['next'] == undefined || this.definition['next'] == null || this.definition['next'].trim().length == 0) {
	            issues.push(['No next destination node selected.', 'node', this.definition['id'], this.cardName()]);
            }
            
            return issues;
        }

        updateReferences(oldId, newId) {
            if (this.definition['next'] == oldId) {
                this.definition['next'] = newId;

				if (newId == null) {
				    console.log('set-variable.js: Unable to resolve ' + id + ' SEQ: ' + this.sequence.definition.id);

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
            return 'Set Variable';
        }

        static cardName() {
            return 'Set Variable';
        }

        static createCard(cardName) {
            var card = {
                "name": cardName, 
                "type": "set-variable", 
                "variable": "variable-name",
                "value": "variable-value",
                "id": Node.uuidv4()
            }; 
            
            return card;
        }
    }

    Node.registerCard('set-variable', SetVariableNode);
    
    return SetVariableNode;
});
