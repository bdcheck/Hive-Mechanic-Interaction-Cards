var modules = ["material", 'cards/node', 'jquery'];

define(modules, function (mdc, Node) {
    class VoiceMessageNode extends Node {
        constructor(definition, sequence) {
            super(definition, sequence);
        }

		cardIcon() {
			return '<i class="fas fa-phone-alt" style="margin-right: 16px; font-size: 20px; "></i>';
		}

        editBody() {
            var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">' +
                       '  <div class="mdc-text-field mdc-text-field--textarea" id="' + this.cardId + '_message_field" style="width: 100%">' + 
                       '    <textarea class="mdc-text-field__input" rows="2" style="width: 100%" id="' + this.cardId + '_message_value"></textarea>' + 
                       '    <div class="mdc-notched-outline">' + 
                       '      <div class="mdc-notched-outline__leading"></div>' + 
                       '      <div class="mdc-notched-outline__notch">' + 
                       '        <label for="' + this.cardId + '_message_value" class="mdc-floating-label">Message</label>' + 
                       '      </div>' + 
                       '      <div class="mdc-notched-outline__trailing"></div>' + 
                       '    </div>' + 
                       '  </div>' + 
                       '</div>' + 
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">' +
                       '  <div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_next_call_action" style="width: 100%;">' +
                       '    <div class="mdc-select__anchor" style="width: 100%">' +
                       '      <i class="mdc-select__dropdown-icon"></i>' +
                       '      <div class="mdc-select__selected-text" aria-labelledby="outlined-select-label"></div>' +
                       '      <div class="mdc-notched-outline">' +
                       '        <div class="mdc-notched-outline__leading"></div>' +
                       '        <div class="mdc-notched-outline__notch">' +
                       '          <label id="outlined-select-label" class="mdc-floating-label">Next Call Action</label>' +
                       '        </div>' +
                       '        <div class="mdc-notched-outline__trailing"></div>' +
                       '      </div>' +
                       '    </div>' +
                       '    <div class="mdc-select__menu mdc-menu mdc-menu-surface">' +
                       '      <ul class="mdc-list">' +
                       '        <li class="mdc-list-item" data-value="continue">Continue</li>' +
                       '        <li class="mdc-list-item" data-value="pause">Pause</li>' +
                       '        <li class="mdc-list-item" data-value="gather">Gather Response</li>' +
                       '        <li class="mdc-list-item" data-value="hangup">Hang Up</li>' +
                       '      </ul>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" id="' + this.cardId + '_pause_container">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_pause_delay"  style="width: 100%">' +
                       '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_pause_delay_value">' +
                       '    <div class="mdc-notched-outline">' +
                       '      <div class="mdc-notched-outline__leading"></div>' +
                       '      <div class="mdc-notched-outline__notch">' +
                       '        <label for="' + this.cardId + '_pause_delay_value" class="mdc-floating-label">Pause Delay (Seconds)</label>' +
                       '      </div>' +
                       '      <div class="mdc-notched-outline__trailing"></div>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_gather_input_method" style="width: 100%;">' +
                       '    <div class="mdc-select__anchor" style="width: 100%">' +
                       '      <i class="mdc-select__dropdown-icon"></i>' +
                       '      <div class="mdc-select__selected-text" aria-labelledby="outlined-select-label"></div>' +
                       '      <div class="mdc-notched-outline">' +
                       '        <div class="mdc-notched-outline__leading"></div>' +
                       '        <div class="mdc-notched-outline__notch">' +
                       '          <label id="outlined-select-label" class="mdc-floating-label">Input Method</label>' +
                       '        </div>' +
                       '        <div class="mdc-notched-outline__trailing"></div>' +
                       '      </div>' +
                       '    </div>' +
                       '    <div class="mdc-select__menu mdc-menu mdc-menu-surface">' +
                       '      <ul class="mdc-list">' +
                       '        <li class="mdc-list-item" data-value="dtmf">Touch Tone</li>' +
                       '        <li class="mdc-list-item" data-value="speech">Speech</li>' +
                       '        <li class="mdc-list-item" data-value="dtmf speech">Touch Tone or Speech</li>' +
                       '      </ul>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_gather_speech_model" style="width: 100%;">' +
                       '    <div class="mdc-select__anchor" style="width: 100%">' +
                       '      <i class="mdc-select__dropdown-icon"></i>' +
                       '      <div class="mdc-select__selected-text" aria-labelledby="outlined-select-label"></div>' +
                       '      <div class="mdc-notched-outline">' +
                       '        <div class="mdc-notched-outline__leading"></div>' +
                       '        <div class="mdc-notched-outline__notch">' +
                       '          <label id="outlined-select-label" class="mdc-floating-label">Speech Model</label>' +
                       '        </div>' +
                       '        <div class="mdc-notched-outline__trailing"></div>' +
                       '      </div>' +
                       '    </div>' +
                       '    <div class="mdc-select__menu mdc-menu mdc-menu-surface">' +
                       '      <ul class="mdc-list">' +
                       '        <li class="mdc-list-item" data-value="default">Default</li>' +
                       '        <li class="mdc-list-item" data-value="numbers_and_commands">Numbers and Commands</li>' +
                       '        <li class="mdc-list-item" data-value="phone_call">Phone Call</li>' +
                       '      </ul>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5 ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_gather_timeout"  style="width: 100%">' +
                       '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_gather_timeout_value">' +
                       '    <div class="mdc-notched-outline">' +
                       '      <div class="mdc-notched-outline__leading"></div>' +
                       '      <div class="mdc-notched-outline__notch">' +
                       '        <label for="' + this.cardId + '_gather_timeout_value" class="mdc-floating-label">Timeout</label>' +
                       '      </div>' +
                       '      <div class="mdc-notched-outline__trailing"></div>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_gather_speech_timeout"  style="width: 100%">' +
                       '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_gather_speech_timeout_value">' +
                       '    <div class="mdc-notched-outline">' +
                       '      <div class="mdc-notched-outline__leading"></div>' +
                       '      <div class="mdc-notched-outline__notch">' +
                       '        <label for="' + this.cardId + '_gather_timeout_value" class="mdc-floating-label">Speech Timeout (Seconds)</label>' +
                       '      </div>' +
                       '      <div class="mdc-notched-outline__trailing"></div>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5 ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-form-field">' + 
                       '    <div class="mdc-checkbox" style="margin-left: -11px;" id="' + this.cardId + '_gather_profanity_filter">' +
                       '      <input type="checkbox" class="mdc-checkbox__native-control" id="' + this.cardId + '_gather_profanity_filter_value"/>' +
                       '      <div class="mdc-checkbox__background">' +
                       '        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">' +
                       '          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>' +
                       '        </svg>' +
                       '        <div class="mdc-checkbox__mixedmark"></div>' +
                       '      </div>' +
                       '    </div>' +
                       '    <label for="' + this.cardId + '_gather_profanity_filter">Profanity Filter</label>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-form-field">' + 
                       '    <div class="mdc-checkbox" style="margin-left: -11px;" id="' + this.cardId + '_gather_action_empty">' +
                       '      <input type="checkbox" class="mdc-checkbox__native-control" id="' + this.cardId + '_gather_action_empty_value"/>' +
                       '      <div class="mdc-checkbox__background">' +
                       '        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">' +
                       '          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>' +
                       '        </svg>' +
                       '        <div class="mdc-checkbox__mixedmark"></div>' +
                       '      </div>' +
                       '    </div>' +
                       '    <label for="' + this.cardId + '_gather_action_empty">Action on Empty Result</label>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 mdc-typography--caption" style="padding-top: 8px;">' +
                       '  The message above will be spoken to the user and the system will proceed to the next card.' +
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
    			       '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>' +
	    		       '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content">';

            body += this.sequence.chooseDestinationMenu(this.cardId);
			body += '      </div>';
			body += '      <footer class="mdc-dialog__actions">';
			body += '        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">';
			body += '          <span class="mdc-button__label">Save</span>';
			body += '        </button>';
			body += '      </footer>';
			body += '    </div>';
			body += '  </div>';
			body += '  <div class="mdc-dialog__scrim"></div>';
			body += '</div>';
			
			return body;
        }

        viewBody() {
			return '<div class="mdc-typography--body1" style="margin: 16px;">' + this.definition['message'] + '</div>';
        }

        initialize() {
			super.initialize();
			
			const me = this;

			const messageField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_message_field'));
			messageField.value = this.definition['message'];

			$('#' + this.cardId + '_message_value').on("change keyup paste", function() {
				var value = messageField.value;
				
				me.definition['message'] = value;
				
				me.sequence.markChanged(me.id);
			});

			const delayField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_pause_delay'));
			
			if (this.definition['pause'] != undefined) {
				delayField.value = this.definition['pause'];
			} else {
				delayField.value = '';
			}

			$('#' + this.cardId + '_pause_delay_value').on("change keyup paste", function() {
				var value = delayField.value;
				
				me.definition['pause'] = value;
				
				me.sequence.markChanged(me.id);
			});

			const gatherTimeout = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_gather_timeout'));
			
			if (this.definition['timeout'] != undefined) {
				gatherTimeout.value = this.definition['timeout'];
			} else {
				gatherTimeout.value = '';
			}

			$('#' + this.cardId + '_gather_timeout_value').on("change keyup paste", function() {
				var value = gatherTimeout.value;
				
				me.definition['timeout'] = value;
				
				me.sequence.markChanged(me.id);
			});

			const speechTimeout = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_gather_speech_timeout'));
			
			if (this.definition['speech_timeout'] != undefined) {
				speechTimeout.value = this.definition['speech_timeout'];
			} else {
				speechTimeout.value = '';
			}

			$('#' + this.cardId + '_gather_speech_timeout_value').on("change keyup paste", function() {
				var value = speechTimeout.value;
				
				me.definition['speech_timeout'] = value;
				
				me.sequence.markChanged(me.id);
			});
			
			const profanityFilter = mdc.checkbox.MDCCheckbox.attachTo(document.getElementById(this.cardId + '_gather_profanity_filter'));

			if (this.definition['profanity_filter'] != undefined) {
				profanityFilter.checked = this.definition['profanity_filter'];
			} else {
				profanityFilter.checked = false;
			}

			$('#' + this.cardId + '_gather_profanity_filter_value').on("change", function() {
				var value = profanityFilter.checked;
				
				me.definition['profanity_filter'] = value;
				
				me.sequence.markChanged(me.id);
			});

			const actionEmpty = mdc.checkbox.MDCCheckbox.attachTo(document.getElementById(this.cardId + '_gather_action_empty'));

			if (this.definition['action_empty'] != undefined) {
				actionEmpty.checked = this.definition['action_empty'];
			} else {
				actionEmpty.checked = false;
			}

			$('#' + this.cardId + '_gather_action_empty_value').on("change", function() {
				var value = actionEmpty.checked;
				
				me.definition['action_empty'] = value;
				
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
				
				var found = false;
				
				for (var i = 0; i < destinationNodes.length; i++) {
					const destinationNode = destinationNodes[i];

                    if (me.definition["next"].endsWith(destinationNode["id"])) {
						$("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
					} else {
						$("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
					}
				}
			});

            const inputMethodField = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_gather_input_method'));

            if (this.definition["input_method"] != undefined) {
				inputMethodField.value = this.definition["input_method"];
            }

			inputMethodField.listen('MDCSelect:change', () => {
				me.definition["input_method"] = inputMethodField.value;

				me.sequence.markChanged(me.id);
			});

            const speechModelField = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_gather_speech_model'));

            if (this.definition["speech_model"] != undefined) {
				speechModelField.value = this.definition["speech_model"];
            }

			speechModelField.listen('MDCSelect:change', () => {
				me.definition["speech_model"] = speechModelField.value;

				me.sequence.markChanged(me.id);
			});

            const nextActionField = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_next_call_action'));
            
            if (this.definition["next_action"] != undefined) {
				nextActionField.value = this.definition["next_action"];
            } else {
				nextActionField.value = 'continue';
            }

            $("#" + this.cardId + "_pause_container").hide();
			$("." + this.cardId + "_gather_container").hide();

			nextActionField.listen('MDCSelect:change', () => {
				console.log('Selected option at index ' + nextActionField.selectedIndex + ' with value "' + nextActionField.value + '"');
		
				me.definition["next_action"] = nextActionField.value;

	            $("#" + this.cardId + "_pause_container").hide();
				$("." + this.cardId + "_gather_container").hide();

				if (me.definition["next_action"] == "pause") {
					$("#" + this.cardId + "_pause_container").show();
				} else if (me.definition["next_action"] == "gather") {
					$("." + this.cardId + "_gather_container").show();
				}

				me.sequence.markChanged(me.id);
			});

            if (nextActionField.value == "pause") {
	            $("#" + this.cardId + "_pause_container").show();
			} else if (me.definition["next_action"] == "gather") {
				$("." + this.cardId + "_gather_container").show();
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

		updateReferences(oldId, newId) {
			if (this.definition['next'] == oldId) {
				this.definition['next'] = newId;
				
				if (newId == null) {
					delete this.definition['next'];
				}
			}
		}

		cardType() {
			return 'Voice Message';
		}
		
		static cardName() {
			return 'Voice Message';
		}

		static createCard(cardName) {
			var card = {
				"name": cardName, 
				"context": "(Context goes here...)", 
				"message": "(Message goes here...)", 
				"type": "voice-message", 
				"id": Node.uuidv4(),
				"next": null
			}; 
			
			return card;
		}
    }

    Node.registerCard('voice-message', VoiceMessageNode);
    
    return VoiceMessageNode;
});
