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

        cardFields() {
            var defaultCard = SendPictureNode.createCard('');

            return [{
                'field': 'image',
                'type': 'image-url',
                'label': {
                    'en': 'Image URL'
                }
            }, {
                'field': 'next',
                'type': 'card'
            }];
        }

        viewBody() {
            return '<div class="mdc-typography--body1" style="margin: 16px;"><img src="' + this.definition['image'] + '" style="max-width: 100%;"></div>';
        }

        initialize() {
            super.initialize();

            this.initializeFields();
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
