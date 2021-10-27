var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
    class ArithmeticNode extends Node {
        constructor(definition, sequence) {
            super(definition, sequence);
            this.nextCardFields = ["next", "next_error"]
        }

        cardIcon() {
            return '<i class="fas fa-less-than " style="margin-right: 16px; font-size: 20px; "></i>';
        }

        cardFields() {
            return [
                {
                'field': 'first_variable',
                'type': 'text',
                'multiline': false,
                'label': {
                    'en': 'Name'
                }
            },  {
                'field': 'first_scope',
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
                'field': 'operator',
                'type': 'choice',
                'label': {
                    'en': 'Operator'
                }, 'options': [{
                    'value': 'addition',
                    'label': {
                        'en': 'Addition (+)'
                    }
                }, {
                    'value': 'subtraction',
                    'label': {
                        'en': 'Subtraction (-)'
                    }
                }, {
                    'value': 'multiplication',
                    'label': {
                        'en': 'Multiplication (*)'
                    }
                },
                {
                    'value': 'division',
                    'label': {
                        'en': 'Division (/)'
                    }
                }]
            },
                {
                'field': 'second_variable',
                'type': 'text',
                'multiline': false,
                'label': {
                    'en': 'Value'
                }
            },{
                'field': 'second_scope',
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
            },
                {
                'field': 'description',
                'type': 'readonly',
                'value': {
                    'en': 'Evaluates an arthimetic operation'
                },
                'width': 7,
                'is_help': true
            },

                {
                'field': 'next',
                'type': 'card',
                'width': 5
            },
                  {
                    'field':'next_error',
                    "type": 'card',
                    'width': 5
                }
            ];
        }
        viewBody() {
            return '<div class="mdc-typography--body1" style="margin: 16px;">' + this.definition['first_variable'] + ' ' + this.definition['operator']+' ' + this.definition['second_variable'] + '</div>';
        }

        initialize() {
            super.initialize();

            this.initializeFields();
        }

        issues(sequence) {
            var issues = super.issues(sequence);

            if (this.definition['first_variable'] == undefined || this.definition['first_variable'].trim().length == 0) {
                issues.push(['First variable name was not provided.', 'node', this.definition['id'], this.cardName()]);
            }

            if (this.definition['second_variable'] == undefined || this.definition['second_variable'].trim().length == 0) {
                issues.push(['Second variable name was not provided.', 'node', this.definition['id'], this.cardName()]);
            }
            if (this.definition['operator'] == undefined || this.definition['operator'].trim().length == 0) {
                issues.push(['Arithemtic operator was not provided.', 'node', this.definition['id'], this.cardName()]);
            }

            if (this.definition['next'] == undefined || this.definition['next'] == null || this.definition['next'].trim().length == 0) {
                issues.push(['No setup if statement evaluates to true destination node selected.', 'node', this.definition['id'], this.cardName()]);
            }
             if (this.definition['next_error'] == undefined || this.definition['next_error'] == null || this.definition['next_error'].trim().length == 0) {
                issues.push(['No setup ff statement evaluates to false', 'node', this.definition['id'], this.cardName()]);
            }

            return issues;
        }

        updateReferences(oldId, newId) {
                for(let item of this.nextCardFields) {
                    if (this.definition[item] == oldId) {
                        this.definition[item] = newId;

                        if (newId == null) {
                            console.log('arithmetic-variable.js: Unable to resolve ' + id + ' SEQ: ' + this.sequence.definition.id);

                            delete this.definition[item];
                        }
                        break;
                    }
                }


        }

           destinationNodes(sequence) {
            var nodes = super.destinationNodes();

            var nextIds = [];

            for(const it of this.nextCardFields) {
                var id = this.definition[it]
                nextIds.push(id)
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
        cardType() {
            return 'arithmetic-operator';
        }

        static cardName() {
            return 'Arithmetic Operator';
        }

        static createCard(cardName) {
            var card = {
                "name": cardName,
                "type": "arithmetic-operator",
                "first_variable": "variable-name",
                "first_scope": "scope",
                "second_variable": "variable-name",
                "second_scope": "scope",
                "operator": "arithmetic-operator",
                "id": Node.uuidv4()
            };

            return card;
        }
    }

    Node.registerCard('arithmetic-operator', ArithmeticNode);

    return ArithmeticNode;
});
