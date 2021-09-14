var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
    class CalculatePercentageNode extends Node {
        constructor(definition, sequence) {
            super(definition, sequence);
        }

        cardIcon() {
            return '<i class="fas fa-download" style="margin-right: 16px; font-size: 20px; "></i>';
        }

        cardFields() {
            return [{
                'field': 'variable',
                'type': 'text',
                'multiline': false,
                'label': {
                    'en': 'Name'
                }
            },
              {
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
                }]},{
                'field': 'description',
                'type': 'readonly',
                'value': {
                    'en': 'Calculates number of answers and percentage that are the same.'
                },
                'width': 7,
                'is_help': true
            },
                {
                'field': 'next',
                'type': 'card',
                'width': 5
            }];
        }


        viewBody() {
            return '<div class="mdc-typography--body1" style="margin: 16px;">' + this.definition['variable'] + ' = ' + this.definition['value'] + '</div>';
        }

        initialize() {
            super.initialize();

            this.initializeFields();
        }

        issues(sequence) {
            var issues = super.issues(sequence);

            if (this.definition['variable'] == undefined || this.definition['variable'].trim().length == 0) {
                issues.push(['No variable name provided.', 'node', this.definition['id'], this.cardName()]);
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
                    console.log('calculate-percentage.js: Unable to resolve ' + id + ' SEQ: ' + this.sequence.definition.id);

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
            return 'Calculate Percentage';
        }

        static cardName() {
            return 'Calculate Percentage';
        }

        static createCard(cardName) {
            var card = {
                "name": cardName,
                "type": "calculate-percentage",
                "variable": "variable-name",
                "value": "variable-value",
                "id": Node.uuidv4()
            };

            return card;
        }
    }

    Node.registerCard('calculate-percentage', CalculatePercentageNode);

    return CalculatePercentageNode;
});
