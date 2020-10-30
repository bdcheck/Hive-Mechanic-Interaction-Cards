var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
	class SendPictureNode extends Node {
		constructor(definition, sequence) {
			super(definition, sequence);
	
			this.messageId = Node.uuidv4();
			this.nextButtonId = Node.uuidv4();
		}

		cardIcon() {
			return '<i class="fas fa-image" style="margin-right: 16px; font-size: 20px; "></i>';
		}

		editBody() {
			var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
			body += '  <img src="' + this.definition['image'] + '" id="' + this.messageId + '_preview" style="max-width: 100%;">';
			body += '</div>';
			body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">';
			body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.messageId + '" style="width: 100%">';
			body += '    <input class="mdc-text-field__input" type="text" id="' + this.messageId + '_value">';
			body += '    <div class="mdc-notched-outline">';
			body += '      <div class="mdc-notched-outline__leading"></div>';
			body += '      <div class="mdc-notched-outline__notch">';
			body += '        <label for="' + this.messageId + '_value" class="mdc-floating-label">Image URL</label>';
			body += '      </div>';
			body += '      <div class="mdc-notched-outline__trailing"></div>';
			body += '    </div>';
			body += '  </div>';
			body += '</div>';
			body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">';
			body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_edit">';
            body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>';
    		body += '  </button>';
			body += '  <button class="mdc-icon-button" id="' + this.cardId + '_next_goto">';
			body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>';
			body += '  </button>';
			body += '</div>';
            body += '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">';
            body += '  <div class="mdc-dialog__container">';
            body += '    <div class="mdc-dialog__surface">';
            body += '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>';
			body += '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content">';
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
			return '<div class="mdc-typography--body1" style="margin: 16px;"><img src="' + this.definition['image'] + '" style="max-width: 100%;"></div>';
		}

		initialize() {
			super.initialize();
			
			const me = this;
	
			const messageField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.messageId));
			messageField.value = this.definition['image'];
	
			$('#' + this.messageId + '_value').change(function(eventObj) {
				var value = $('#' + me.messageId + '_value').val();
		
				me.definition['image'] = value;
		
				$('#' + me.messageId + '_preview').attr('src', value);

				me.sequence.markChanged(me.id);
			});

			me.sequence.initializeDestinationMenu(me.cardId, function(selected) {
				me.definition['next'] = selected;

				me.sequence.markChanged(me.id);
				me.sequence.loadNode(me.definition);
			});

			const dialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'));

			dialog.listen('MDCDialog:closed', (event) => {
				this.definition['next'] = destination.value;

				me.sequence.markChanged(me.id);
				me.sequence.loadNode(me.definition);
			});

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
		}

        issues(sequence) {
            var issues = super.issues(sequence);
            
            if (this.definition['image'] == undefined || this.definition['image'].trim().length == 0) {
	            issues.push(['No image URL provided.', 'node', this.definition['id']]);
            }

            if (this.definition['next'] == undefined || this.definition['next'] == null || this.definition['next'].trim().length == 0) {
	            issues.push(['No next destination node selected.', 'node', this.definition['id']]);
            }
            
            return issues;
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
				    console.log('send_picture.js: Unable to resolve ' + id + ' SEQ: ' + this.sequence.definition.id);

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
			return 'Send Picture';
		}
		
		static cardName() {
			return 'Send Picture';
		}

		static createCard(cardName) {
			var card = {
				"name": cardName, 
				"type": "send-picture", 
				"image": "https://via.placeholder.com/150",
				"id": Node.uuidv4()
			}; 
			
			return card;
		}
	}
	
	Node.registerCard('send-picture', SendPictureNode);
});
