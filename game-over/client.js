var modules = ["material", 'cards/node', 'jquery', ];

define(modules, function (mdc, Node) {
	class GameOverNode extends Node {
		constructor(definition, sequence) {
			super(definition, sequence);
	
			this.messageId = Node.uuidv4();
			this.nextButtonId = Node.uuidv4();
		}

		cardIcon() {
			return '<i class="fas fa-comment-slash" style="margin-right: 16px; font-size: 20px; "></i>';
		}

		editBody() {
			var body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">';
            body +=    '  <div class="mdc-dialog__scrim"></div>';
            body +=    '</div>';
            
            return body;
		}

		viewBody() {
			return '<div class="mdc-typography--body1" style="margin: 16px;">Game Over</div>';
		}

		initialize() {
			super.initialize();
		}

        destinationNodes(sequence) {
            var nodes = super.destinationNodes(sequence);

            return nodes;
        }

		updateReferences(oldId, newId) {
			// Do nothing.
		}
		
		cardType() {
			return 'Game Over';
		}
		
		static cardName() {
			return 'Game Over';
		}

		static createCard(cardName) {
			var card = {
				"name": cardName, 
				"type": "game-over", 
				"id": Node.uuidv4()
			}; 
			
			return card;
		}
	}
	
	Node.registerCard('game-over', GameOverNode);
});
