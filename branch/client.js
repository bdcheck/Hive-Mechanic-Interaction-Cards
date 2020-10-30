var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
    class BranchNode extends Node {
        constructor(definition, sequence) {
            super(definition, sequence);
        }

        initialize() {
            super.initialize();
            
            var me = this;

			me.sequence.initializeDestinationMenu(me.cardId, function(selected) {
				if (me.selectedBranch >= 0 && event.detail.action == "remove") {
					me.definition['branches'].splice(me.selectedBranch, 1);
					
					me.sequence.markChanged(me.id);

					me.sequence.loadNode(me.definition);
				} else {
					if (me.selectedBranch >= 0) {
						me.definition['branches'][me.selectedBranch]["action"] = selected;

						me.sequence.markChanged(me.id);
						me.sequence.loadNode(me.definition);
					}
				}
			});

			const dialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'));

			dialog.listen('MDCDialog:closed', (event) => {
				if (me.selectedBranch >= 0 && event.detail.action == "remove") {
					me.definition['branches'].splice(me.selectedBranch, 1);
					
					me.sequence.markChanged(me.id);

					me.sequence.loadNode(me.definition);
				}
			});

            for (var i = 0; i < this.definition['branches'].length; i++) {
                const branch = this.definition['branches'][i];
                
                const identifier = this.cardId + '_branch_value_' + i;

                const currentIndex = i;

                $('#' + this.cardId + '_branch_click_' + i).on("click", function() {
                    var destinationNodes = me.destinationNodes(me.sequence);
                    
                    for (var i = 0; i < destinationNodes.length; i++) {
						const destinationNode = destinationNodes[i];

						if (branch["action"].endsWith(destinationNode["id"])) {
							$("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
						} else {
							$("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
						}
                    }
                });

                $('#' + this.cardId + '_branch_edit_' + i).on("click", function() {
                	me.selectedBranch = currentIndex;
                	
	                $('#' + me.cardId + '-edit-dialog [data-mdc-dialog-action="remove"]').show();
					
					dialog.open();
                });
            }

            $('#' + this.cardId + '_add_branch').on("click", function() {
                me["definition"]["branches"].push({
                    "action": ""
                });

                me.sequence.loadNode(me.definition);    
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

            const modeField = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_mode'));
            
            if (this.definition["mode"] != undefined) {
                modeField.value = this.definition["mode"];
            }
            
            modeField.listen('MDCSelect:change', () => {
                me.definition["mode"] = modeField.value;

                me.sequence.markChanged(me.id);
            });
        }

        destinationNodes(sequence) {
            var nodes = super.destinationNodes();

            var nextIds = [];

            for (var i = 0; i < this.definition['branches'].length; i++) {
                var branch = this.definition['branches'][i];
                
                if (nextIds.indexOf(branch['action']) == -1) {
	                nextIds.push(branch['action']);
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

		updateReferences(oldId, newId) {
            for (var i = 0; i < this.definition['branches'].length; i++) {
                var branch = this.definition['branches'][i];
                
                if (branch['action'] == oldId) {
	                branch['action'] = newId;
	                
	                if (newId == null) {
						delete branch['action'];
					}
                }
            }
		}

        /* Error / validity checking */
        issues(sequence) {
            var issues = super.issues(sequence);
            
            for (var i = 0; i < this.definition['branches'].length; i++) {
                var branch = this.definition['branches'][i];
                
				if (branch['action'] == undefined || branch['action'].trim().length == 0) {
					issues.push(['No action provided for branch "' + (i + 1) + '".', 'node', this.definition['id'], this.cardName()]);
				}
            }
            
            if (this.definition['branches'].length == 0) {
					issues.push(['No branches defined.', 'node', this.definition['id'], this.cardName()]);
            }
            
            return issues;
        }
        
        cardType() {
            return 'Branch';
        }
        
        viewBody() {
        	var summary = ""; 
        	
            for (var i = 0; i < this.definition['branches'].length; i++) {
                var branch = this.definition['branches'][i];
                
                summary += '<div class="mdc-typography--body1" style="margin: 16px;">' +  (i + 1) + '. ' + this.lookupCardName(branch["action"]) + '</div>';
            }
            
            return summary;
        }

		cardIcon() {
			return '<i class="fas fa-spell-check" style="margin-right: 16px; font-size: 20px; "></i>';
		}

        editBody() {
            var body = '';
            var me = this;

            var destinationNodes = me.destinationNodes(me.sequence);

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
            body += '<div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_mode" style="width: 100%">';
            body += '  <div class="mdc-select__anchor" style="width: 100%">';
            body += '    <i class="mdc-select__dropdown-icon"></i>';
            body += '    <div class="mdc-select__selected-text" aria-labelledby="outlined-select-label"></div>';
            body += '    <div class="mdc-notched-outline">';
            body += '      <div class="mdc-notched-outline__leading"></div>';
            body += '      <div class="mdc-notched-outline__notch">';
            body += '        <label id="outlined-select-label" class="mdc-floating-label">Mode</label>';
            body += '      </div>';
            body += '      <div class="mdc-notched-outline__trailing"></div>';
            body += '    </div>';
            body += '  </div>';
            body += '  <div class="mdc-select__menu mdc-menu mdc-menu-surface">';
            body += '    <ul class="mdc-list">';
            body += '      <li class="mdc-list-item" data-value="random" aria-selected="true">Random</li>';
            body += '      <li class="mdc-list-item" data-value="random-no-repeat" aria-selected="true">Random (No Repeat)</li>';
            body += '      <li class="mdc-list-item" data-value="sequential" aria-selected="true">Sequential (Round Robin)</li>';
            body += '    </ul>';
            body += '  </div>';
            body += '</div>';
            body += '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
            body += '<div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_scope" style="width: 100%">';
            body += '  <div class="mdc-select__anchor" style="width: 100%">';
            body += '    <i class="mdc-select__dropdown-icon"></i>';
            body += '    <div class="mdc-select__selected-text" aria-labelledby="outlined-select-label"></div>';
            body += '    <div class="mdc-notched-outline">';
            body += '      <div class="mdc-notched-outline__leading"></div>';
            body += '      <div class="mdc-notched-outline__notch">';
            body += '        <label id="outlined-select-label" class="mdc-floating-label">Scope</label>';
            body += '      </div>';
            body += '      <div class="mdc-notched-outline__trailing"></div>';
            body += '    </div>';
            body += '  </div>';
            body += '  <div class="mdc-select__menu mdc-menu mdc-menu-surface">';
            body += '    <ul class="mdc-list">';
            body += '      <li class="mdc-list-item" data-value="session" aria-selected="true">Session</li>';
            body += '      <li class="mdc-list-item" data-value="player" aria-selected="true">Player</li>';
            body += '      <li class="mdc-list-item" data-value="game" aria-selected="true">Game</li>';
            body += '    </ul>';
            body += '  </div>';
            body += '</div>';
            body += '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 8px;">';
            body += '  <div class="mdc-typography--subtitle2">Branches</div>';
            body += '</div>';
            
            for (var i = 0; i < this.definition['branches'].length; i++) {
                var branch = this.definition['branches'][i];

                var found = false;
                var foundNode = undefined;

				var id = branch["action"];
                
                for (var j = 0; j < destinationNodes.length; j++) {
                    const destinationNode = destinationNodes[j];
				
					if (destinationNode["id"] == id || (this.sequence['definition']['id'] + "#" + destinationNode["id"]) == id) {
                        found = true;
                        foundNode = destinationNode;
                    }
                }

                if (found == false) {
                	var node = me.sequence.resolveNode(id);
                	
                	if (node != null) {
                        found = true;
                        foundNode = node;
                	}
                }

                body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">';
                body += '<div class="mdc-typography--body1" style="margin: 16px;">' + this.lookupCardName(branch["action"]) + '</div>';
                body += '</div>';

                body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6" style="text-align: right;">';
                body += '  <button class="mdc-icon-button" id="' + this.cardId + '_branch_edit_' + i + '">';
                body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>'; 
                body += '  </button>';
                
                if (found) {
                    body += '  <button class="mdc-icon-button" id="' + this.cardId + '_branch_click_' + i + '">';
                    body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>';
                    body += '  </button>';
                }

                body += '</div>';
            }

			body += '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="text-align: right;">';
            body += '<button class="mdc-button mdc-button--raised" id="' + this.cardId + '_add_branch">';
            body += '  <span class="mdc-button__label">Add Branch</span>';
            body += '</button>';
            body += '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 mdc-typography--caption" style="padding-top: 8px;">';
            body += '  Directs activity to a destination chosen from a set of options.';
            body += '</div>';

            body += '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">';
            body += '  <div class="mdc-dialog__container">';
            body += '    <div class="mdc-dialog__surface">';
            body += '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>';
            body += '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content">';
            body += me.sequence.chooseDestinationMenu(this.cardId);
            body += '      </div>';
            body += '      <footer class="mdc-dialog__actions">';
            body += '        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="remove">';
            body += '          <span class="mdc-button__label">Remove Branch</span>';
            body += '        </button>';
            body += '        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">';
            body += '          <span class="mdc-button__label">Continue</span>';
            body += '        </button>';
            body += '      </footer>';
            body += '    </div>';
            body += '  </div>';
            body += '  <div class="mdc-dialog__scrim"></div>';
            body += '</div>';
            
            return body;
        }

		static cardName() {
			return 'Branch';
		}

		static createCard(cardName) {
			var card = {
				"name": cardName, 
				"scope": "game",
				"mode": "sequential",
				"branches": [{}, {}], 
				"type": "branch", 
				"id": Node.uuidv4()
			}; 
			
			return card;
		}
    }

    Node.registerCard('branch', BranchNode);
    
    return BranchNode;
});