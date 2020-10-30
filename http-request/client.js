var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
    class HttpRequestNode extends Node {
        constructor(definition, sequence) {
            super(definition, sequence);
        }

        editBody() {
            var me = this;

            var destinationNodes = me.destinationNodes(me.sequence);

            var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_url_field" style="width: 100%">' + 
                       '    <input class="mdc-text-field__input"style="width: 100%" id="' + this.cardId + '_url_value" />' + 
                       '    <div class="mdc-notched-outline">' + 
                       '      <div class="mdc-notched-outline__leading"></div>' + 
                       '      <div class="mdc-notched-outline__notch">' + 
                       '        <label for="' + this.cardId + '_cookie_name_value" class="mdc-floating-label">Remote URL</label>' + 
                       '      </div>' + 
                       '      <div class="mdc-notched-outline__trailing"></div>' + 
                       '    </div>' + 
                       '  </div>' + 
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5">' +
                       '  <div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_http_method">' +
                       '    <div class="mdc-select__anchor" style="width: 100%;">' +
                       '      <i class="mdc-select__dropdown-icon"></i>' +
                       '      <div class="mdc-select__selected-text" aria-labelledby="outlined-select-label"></div>' +
                       '      <span class="mdc-notched-outline">' +
                       '        <span class="mdc-notched-outline__leading"></span>' +
                       '        <span class="mdc-notched-outline__notch">' +
                       '          <span id="outlined-select-label" class="mdc-floating-label">HTTP Method</span>' +
                       '        </span>' +
                       '        <span class="mdc-notched-outline__trailing"></span>' +
                       '      </span>' +
                       '    </div>' +
                       '    <div class="mdc-select__menu mdc-menu mdc-menu-surface" role="listbox">' +
                       '      <ul class="mdc-list">' +
                       '        <li class="mdc-list-item" data-value="get" role="option">GET</li>' +
                       '        <li class="mdc-list-item" data-value="post" role="option">POST</li>' +
                       '      </ul>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 8px;">';
            body += '  <div class="mdc-typography--subtitle2">Request Variables</div>';
            body += '</div>';
            
            if (this.definition['request_variables'] == undefined) {
            	this.definition['request_variables'] = [];
            }
            
            for (var i = 0; i < this.definition['request_variables'].length; i++) {
                var variableDef = this.definition['request_variables'][i];

                body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">';
                body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_variable_name_' + i + '"  style="width: 100%">';
                body += '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_variable_name_' + i + '_value">';
                body += '    <div class="mdc-notched-outline">';
                body += '      <div class="mdc-notched-outline__leading"></div>';
                body += '      <div class="mdc-notched-outline__notch">';
                body += '        <label for="' + this.cardId + '_variable_name_value_' + i + '_value" class="mdc-floating-label">Request Variable</label>';
                body += '      </div>';
                body += '      <div class="mdc-notched-outline__trailing"></div>';
                body += '    </div>';
                body += '  </div>';
                body += '</div>';

                body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">';
                body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_variable_value_' + i + '"  style="width: 100%">';
                body += '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_variable_value_' + i + '_value">';
                body += '    <div class="mdc-notched-outline">';
                body += '      <div class="mdc-notched-outline__leading"></div>';
                body += '      <div class="mdc-notched-outline__notch">';
                body += '        <label for="' + this.cardId + '_variable_value_value_' + i + '_value" class="mdc-floating-label">Value</label>';
                body += '      </div>';
                body += '      <div class="mdc-notched-outline__trailing"></div>';
                body += '    </div>';
                body += '  </div>';
                body += '</div>';
            }

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="text-align: right;">';
            body += '<button class="mdc-button mdc-button--raised" id="' + this.cardId + '_add_request_variable">';
            body += '  <span class="mdc-button__label">Add Request Variable</span>';
            body += '</button>';
            body += '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 8px;">';
            body += '  <div class="mdc-typography--subtitle2">Response Patterns</div>';
            body += '</div>';
            
            for (var i = 0; i < this.definition['patterns'].length; i++) {
                var patternDef = this.definition['patterns'][i];

                var found = false;
                var foundNode = undefined;
                
                for (var j = 0; j < destinationNodes.length; j++) {
                    const destinationNode = destinationNodes[j];
                    
                    if (destinationNode["id"] == patternDef["action"]) {
                        found = true;
                        foundNode = destinationNode;
                    }
                }

                if (found == false) {
                    var node = me.sequence.resolveNode(patternDef["action"]);
                
                    if (node != null) {
                        found = true;
                        foundNode = node;
                    }
                }

                body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">';
                body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_pattern_value_' + i + '"  style="width: 100%">';
                body += '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_pattern_value_' + i + '_value">';
                body += '    <div class="mdc-notched-outline">';
                body += '      <div class="mdc-notched-outline__leading"></div>';
                body += '      <div class="mdc-notched-outline__notch">';
                body += '        <label for="' + this.cardId + '_pattern_value_' + i + '_value" class="mdc-floating-label">Response Matches</label>';
                body += '      </div>';
                body += '      <div class="mdc-notched-outline__trailing"></div>';
                body += '    </div>';
                body += '  </div>';
                
                body += '</div>';
                body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">';

                body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_edit_' + i + '">';
                body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>';
                body += '  </button>';
                
                if (found) {
                    body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_click_' + i + '">';
                    body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>';
                    body += '  </button>';
                }

                body += '</div>';

                if (found) {
                    if (foundNode["definition"]["name"] != undefined) {
                        body += '<div class="mdc-typography--caption layout-grid__cell mdc-layout-grid__cell--span-12">Action: ' + foundNode["definition"]["name"] + '</div>';                
                    } else {
                        body += '<div class="mdc-typography--caption layout-grid__cell mdc-layout-grid__cell--span-12">Action: ' + foundNode["definition"]["id"] + '</div>';                
                    }
                } else {
                    body += '<div class="mdc-typography--caption layout-grid__cell mdc-layout-grid__cell--span-12">Click + to add an action.</div>';                
                }
            }

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="text-align: right;">';
            body += '<button class="mdc-button mdc-button--raised" id="' + this.cardId + '_add_pattern">';
            body += '  <span class="mdc-button__label">Add Pattern</span>';
            body += '</button>';
            body += '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">';
            body += '  <p class="mdc-typography--body1">Not Found Response (404): </p>';
            body += '</div>';
            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">';

            body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_edit_not_found">';
            body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>';
            body += '  </button>';
            
            if (this.definition["not_found_action"] != undefined) {
                body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_click_not_found">';
                body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>';
                body += '  </button>';
            }

            body += '</div>';

            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">';
            body += '  <p class="mdc-typography--body1">Server Error Response (500): </p>';
            body += '</div>';
            body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">';

            body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_edit_server_error">';
            body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>';
            body += '  </button>';
            
            if (this.definition["server_error_action"] != undefined) {
                body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_click_server_error">';
                body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>';
                body += '  </button>';
            }

            body += '</div>';

            body += '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">';
            body += '  <div class="mdc-dialog__container">';
            body += '    <div class="mdc-dialog__surface">';
            body += '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>';
            body += '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content">';
            body += this.sequence.chooseDestinationMenu(this.cardId);
            body += '      </div>';
            body += '      <footer class="mdc-dialog__actions">';
            body += '        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="remove">';
            body += '          <span class="mdc-button__label">Remove</span>';
            body += '        </button>';
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
            var summary = ""; 
            
            for (var i = 0; i < this.definition['patterns'].length; i++) {
                var patternDef = this.definition['patterns'][i];
                
                var humanized = this.humanizePattern(patternDef["pattern"], patternDef["action"]);
                
                summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + humanized + '</div>';
            }

            if (this.definition['not_found_action'] != undefined && this.definition['not_found_action'] != '') {
                summary += '<div class="mdc-typography--body1" style="margin: 16px;">';
                summary += "If cookie doesn't match a prior pattern, go to " + this.definition['not_found_action'] + '.';
                summary += '</div>';
            }
            
            return summary;
        }
        
        initialize() {
            super.initialize();

            const nameField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_url_field'));
            nameField.value = this.definition['url'];

            $('#' + this.cardId + '_url_value').on("change keyup paste", function() {
                var value = $('#' + me.cardId + '_url_value').val();
                
                me.definition['url'] = value;
                
                me.sequence.markChanged(me.id);
            });
            
            var me = this;

            const methodField = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_http_method'));
            
            if (this.definition["http_method"] == undefined) {
            	this.definition["http_method"] = "get";
            }
            
            console.log("METHOD");
            console.log(this.definition["http_method"]);

			methodField.value = this.definition["http_method"];
            
            methodField.listen('MDCSelect:change', () => {
                me.definition["http_method"] = methodField.value;

                me.sequence.markChanged(me.id);
            });

            me.sequence.initializeDestinationMenu(me.cardId, function(selected) {
                if (me.selectedPattern >= 0 && event.detail.action == "remove") {
                    me.definition['patterns'].splice(me.selectedPattern, 1);
                    
                    me.sequence.markChanged(me.id);

                    me.sequence.loadNode(me.definition);
                } else {
                    if (me.selectedPattern >= 0) {
                        me.definition['patterns'][me.selectedPattern]["action"] = selected;

                        me.sequence.markChanged(me.id);
                        me.sequence.loadNode(me.definition);
                    } else if (me.selectedPattern == -1) { // Not found
                        me.definition["not_found_action"] = selected;
                    
                        me.sequence.markChanged(me.id);
                        me.sequence.loadNode(me.definition);
                    } else if (me.selectedPattern == -2) { // Not found
                        me.definition["server_error_action"] = selected;
                    
                        me.sequence.markChanged(me.id);
                        me.sequence.loadNode(me.definition);
                    }
                }
            });

            const dialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'));

            dialog.listen('MDCDialog:closed', (event) => {
                if (me.selectedPattern >= 0 && event.detail.action == "remove") {
                    me.definition['patterns'].splice(me.selectedPattern, 1);
                    
                    me.sequence.markChanged(me.id);

                    me.sequence.loadNode(me.definition);
                }
            });            
            
            if (this.definition['request_variables'] == undefined) {
            	this.definition['request_variables'] = [];
            }

            for (var i = 0; i < this.definition['request_variables'].length; i++) {
                const variableDef = this.definition['request_variables'][i];

				const nameIdentifier = this.cardId + '_variable_name_' + i                ;
				
                const variableNameField = mdc.textField.MDCTextField.attachTo(document.getElementById(nameIdentifier));
                variableNameField.value = variableDef["name"];
                
                $("#" + nameIdentifier).on("change keyup paste", function() {
                    var value = $('#' + nameIdentifier + '_value').val();
                
                    variableDef["name"] = value;
                
                    me.sequence.markChanged(me.id);
                });

				const valueIdentifier = this.cardId + '_variable_value_' + i                ;
				
                const variableValueField = mdc.textField.MDCTextField.attachTo(document.getElementById(valueIdentifier));
                variableValueField.value = variableDef["value"];
                
                $("#" + valueIdentifier).on("change keyup paste", function() {
                    var value = $('#' + valueIdentifier + '_value').val();
                
                    variableDef["value"] = value;
                
                    me.sequence.markChanged(me.id);
                });
            }

            $('#' + this.cardId + '_add_request_variable').on("click", function() {
                me.definition["request_variables"].push({
                    "name": "name",
                    "value": "value"
                });

                me.sequence.loadNode(me.definition);    
                me.sequence.markChanged(me.id);
            });

            for (var i = 0; i < this.definition['patterns'].length; i++) {
                const patternDef = this.definition['patterns'][i];
                
                const identifier = this.cardId + '_pattern_value_' + i;

                const patternField = mdc.textField.MDCTextField.attachTo(document.getElementById(identifier));

                patternField.value = patternDef["pattern"];
                
                $("#" + identifier).on("change keyup paste", function() {
                    var value = $('#' + identifier + '_value').val();
                
                    patternDef["pattern"] = value;
                
                    me.sequence.markChanged(me.id);
                });
                
                const currentIndex = i;

                $('#' + this.cardId + '_pattern_click_' + i).on("click", function() {
                    var destinationNodes = me.destinationNodes(me.sequence);
                    
                    for (var i = 0; i < destinationNodes.length; i++) {
                        const destinationNode = destinationNodes[i];

                        if (patternDef["action"].endsWith(destinationNode["id"])) {
                            $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
                        } else {
                            $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
                        }
                    }
                });

                $('#' + this.cardId + '_pattern_edit_' + i).on("click", function() {
                    me.selectedPattern = currentIndex;
                    
                    var pattern = me.definition["patterns"][currentIndex];
                    
                    $('#' + me.cardId + '-edit-dialog [data-mdc-dialog-action="remove"]').show();
                    
                    dialog.open();
                });
            }


            $('#' + this.cardId + '_pattern_edit_not_found').on("click", function() {
                me.selectedPattern = -1;
                
                $('#' + me.cardId + '-edit-dialog [data-mdc-dialog-action="remove"]').hide();
                
                dialog.open();
            });

            $('#' + this.cardId + '_pattern_edit_server_error').on("click", function() {
                me.selectedPattern = -2;
                
                $('#' + me.cardId + '-edit-dialog [data-mdc-dialog-action="remove"]').hide();
                
                dialog.open();
            });
          
            $('#' + this.cardId + '_add_pattern').on("click", function() {
                me["definition"]["patterns"].push({
                    "action": "",
                    "pattern": "?"
                });

                me.sequence.loadNode(me.definition);    
                me.sequence.markChanged(me.id);
            });

            $('#' + this.cardId + '_pattern_click_not_found').on("click", function() {
                var destinationNodes = me.destinationNodes(me.sequence);
                
                for (var i = 0; i < destinationNodes.length; i++) {
                    const destinationNode = destinationNodes[i];
                    
                    if (me.definition["not_found_action"].endsWith(destinationNode["id"])) {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
                    } else {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
                    }
                }
            });

            $('#' + this.cardId + '_pattern_click_server_error').on("click", function() {
                var destinationNodes = me.destinationNodes(me.sequence);
                
                for (var i = 0; i < destinationNodes.length; i++) {
                    const destinationNode = destinationNodes[i];
                    
                    if (me.definition["server_error_action"].endsWith(destinationNode["id"])) {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#ffffff");
                    } else {
                        $("[data-node-id='" + destinationNode["id"] + "']").css("background-color", "#e0e0e0");
                    }
                }
            });
        }

        issues(sequence) {
            var issues = super.issues(sequence);
            
            if (this.definition['not_found_action'] == undefined || this.definition['not_found_action'].trim().length == 0) {
                issues.push(['No "not found" action provided.', 'node', this.definition['id'], this.cardName()]);
            }

            if (this.definition['server_error_action'] == undefined || this.definition['server_error_action'].trim().length == 0) {
                issues.push(['No "server error" action provided.', 'node', this.definition['id'], this.cardName()]);
            }

            for (var i = 0; i < this.definition['patterns'].length; i++) {
                var pattern = this.definition['patterns'][i];
                
                if (pattern['action'] == undefined || pattern['action'].trim().length == 0) {
                    issues.push(['No action provided for pattern "' + pattern['pattern'] + '".', 'node', this.definition['id'], this.cardName()]);
                }
            }
            
            return issues;
        }

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

            if (this.definition['server_error_action'] != undefined) {
                if (nextIds.indexOf(this.definition['server_error_action']) == -1) {
                    nextIds.push(this.definition['server_error_action']);
                }
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

            if (this.definition['server_error_action'] != undefined) {
                if (this.definition['server_error_action'] == oldId) {
                    this.definition['server_error_action'] = newId;

                    if (newId == null) {
                        delete this.definition['server_error_action'];
                    }
                }
            }
        }
        
        cardType() {
            return 'HTTP Request';
        }
        
        humanizePattern(pattern, action) {
            if (action == undefined || action == "?" || action == null || action == "") {
                action = "?";
            }

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
                
                return "If response starts with " + humanized + ", go to " + action + '.';
            } else if (pattern== ".*") {
                return "If response is anything, go to " + action + '.';
            } else {
                return "If response is \"" + pattern + "\", go to " + action + '.';
            }
            
            return "If response matches \"" + pattern + "\", go to " + action + '.';
        }

        static cardName() {
            return 'HTTP Request';
        }

        static createCard(cardName) {
            var card = {
                "name": cardName, 
                "patterns": [], 
                "timeout": "30", 
                "request_variables": [],
                "http_method": "get",
                "url": "http://www.example.com",
                "type": "http-request", 
                "id": Node.uuidv4()
            }; 
            
            return card;
        }
    }

    Node.registerCard('http-request', HttpRequestNode);
});
