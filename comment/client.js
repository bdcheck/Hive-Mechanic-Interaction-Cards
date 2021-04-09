var modules = ["material", 'cards/node', 'jquery'];

define(modules, function (mdc, Node) {
    class CommentNode extends Node {
        constructor(definition, sequence) {
            super(definition, sequence);
        }

        cardIcon() {
            return '<i class="fas fa-sticky-note" style="margin-right: 16px; font-size: 20px; "></i>';
        }

        cardFields() {
            var defaultCard = SendMessageNode.createCard('');

            return [{
                'field': 'comment',
                'type': 'text',
                'multiline': true,
                'label': {
                    'en': 'Comment'
                }
            }, {
                'field': 'comment_description',
                'type': 'readonly',
                'value': {
                    'en': 'This card provides a comment within your game.'
                },
                'width': 7,
                'is_help': true
            }, {
                'field': 'next',
                'type': 'card',
                'width': 5
            }];
        }

        viewBody() {
            return '<div class="mdc-typography--body1" style="margin: 16px;">Comment: ' + this.definition['comment'] + '</div>';
        }

        initialize() {
            super.initialize();

            this.initializeFields();
        }

        issues(sequence) {
            var issues = super.issues(sequence);

            if (this.definition['comment'] == undefined || this.definition['comment'].trim().length == 0) {
                issues.push(['No comment provided.', 'node', this.definition['id']]);
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
                    console.log('comment.js: Unable to resolve ' + id + ' SEQ: ' + this.sequence.definition.id);

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
            return 'Comment';
        }

        static cardName() {
            return 'Comment';
        }

        static createCard(cardName) {
            var card = {
                "name": cardName,
                "context": "(Context goes here...)",
                "comment": "(Comment goes here...)",
                "type": "comment",
                "id": Node.uuidv4(),
                "next": null
            };

            return card;
        }
    }

    Node.registerCard('comment', CommentNode);

    return CommentNode;
});