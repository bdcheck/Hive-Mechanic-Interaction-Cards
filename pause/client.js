var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
    class PauseNode extends Node {
        constructor(definition, sequence) {
            super(definition, sequence);
        }

        cardIcon() {
            return '<i class="fas fa-pause" style="margin-right: 16px; font-size: 20px;"></i>';
        }
        
        cardFields() {
            var defaultCard = PauseNode.createCard('');
            
            return [{
            	'comment': 'This does X, Y, & Z.',
                'field': 'duration',
                'type': 'integer',
                'input': 'text',
                'label': {
                    'en': 'Duration (Seconds)'
                },
                'width': 7,
                'default': parseInt(defaultCard['duration']),
            }, {
                'field': 'next',
                'type': 'card',
                'width': 5
            }, {
                'field': 'duration_description',
                'type': 'readonly',
                'value': {
                    'en': 'The activity will pause for a duration, then resume.'
                },
                'is_help': true
            }];
        }

        viewBody() {
            return '<div class="mdc-typography--body1" style="margin: 16px;">Pauses for ' + this.definition['duration'] + ' second(s).</div>';
        }

        initialize() {
            super.initialize();
            
            this.initializeFields();
        }

        issues(sequence) {
            var issues = super.issues(sequence);

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
            return PauseNode.cardName();
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
