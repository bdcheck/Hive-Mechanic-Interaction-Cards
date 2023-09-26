define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class GameOverNode extends Node {
    constructor (definition, sequence) {
      super(definition, sequence)

      this.messageId = Node.uuidv4()
      this.nextButtonId = Node.uuidv4()
    }

    cardIcon () {
      return '<i class="fas fa-comment-slash" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      return [{
        type: 'readonly',
        value: '----',
        is_help: true,
        width: 12
      }, {
        type: 'readonly',
        value: {
          en: 'Reaching this element marks the dialog as finished.'
        },
        is_help: true,
        width: 12
      }]
    }

    viewBody () {
      return '<div class="mdc-typography--body1" style="margin: 16px;">End Session</div>'
    }

    initialize () {
      super.initialize()

      this.initializeFields()
    }

    destinationNodes (sequence) {
      const nodes = super.destinationNodes(sequence)

      return nodes
    }

    updateReferences (oldId, newId) {
      // Do nothing.
    }

    setDefaultDestination (defaultId) {
      // Do nothing.
    }

    cardType () {
      return 'End Session'
    }

    static cardName () {
      return 'End Session'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        type: 'game-over',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('game-over', GameOverNode)
})