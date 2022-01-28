define(['material', 'cards/node', 'jquery'], function(mdc, Node) {
  class SetImageSound extends Node {
    constructor(definition, sequence) {
      super(definition, sequence)

      this.messageId = Node.uuidv4()
      this.nextButtonId = Node.uuidv4()
    }

    cardIcon() {
      return '<i class="fas fa-image" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields() {
      return [{
        field: 'image',
        type: 'image-url',
        label: {
          en: 'Image URL'
        }
      },
      {
        field: 'sound',
        type: 'sound-url',
        label: {
          en: 'Sound URL'
        }
      },{
        field: 'scope',
        type: 'choice',
        label: {
          en: 'Scope'
        },
        options: [{
          value: 'session',
          label: {
            en: 'Session'
          }
        }, {
          value: 'player',
          label: {
            en: 'Player'
          }
        }, {
          value: 'game',
          label: {
            en: 'Game'
          }
        }]
      }, {
        field: 'description',
        type: 'readonly',
        value: {
          en: 'Sets a variable in the given scope, then proceeds to the next card.'
        },
        width: 7,
        is_help: true
      },
      {
        field: 'next',
        type: 'card'
      }]
    }

    viewBody() {
      return '<div class="mdc-typography--body1" style="margin: 16px;"><img src="' + this.definition.image + '" style="max-width: 100%;"><audio src="' + this.definition.sound + '"</div>'
    }

    initialize() {
      super.initialize()

      this.initializeFields()
    }

    issues(sequence) {
      const issues = super.issues(sequence)

      if (this.definition.image === undefined || this.definition.image.trim().length === 0) {
        issues.push(['No image URL provided.', 'node', this.definition.id])
      }
      if (this.definition.sound === undefined || this.definition.image.trim().length === 0) {
        issues.push(['No image URL provided.', 'node', this.definition.id])
      }
      if (this.definition.next === undefined || this.definition.next === null || this.definition.next.trim().length === 0) {
        issues.push(['No next destination node selected.', 'node', this.definition.id])
      }

      return issues
    }

    destinationNodes(sequence) {
      const nodes = super.destinationNodes(sequence)

      const id = this.definition.next

      for (let i = 0; i < this.sequence.definition.items.length; i++) {
        const item = this.sequence.definition.items[i]

        if (item.id === id || (this.sequence.definition.id + '#' + item.id) === id) {
          nodes.push(Node.createCard(item, sequence))
        }
      }

      if (nodes.length === 0) {
        const node = this.sequence.resolveNode(id)

        if (node != null) {
          nodes.push(node)
        } else {
          console.log('set_image_sound.js: Unable to resolve ' + id + ' SEQ: ' + this.sequence.definition.id)

          delete this.definition.next
        }
      }

      return nodes
    }

    updateReferences(oldId, newId) {
      if (this.definition.next === oldId) {
        this.definition.next = newId

        if (newId === null) {
          delete this.definition.next
        }
      }
    }

    cardType() {
      return 'set-image-sound'
    }

    static cardName() {
      return 'Set Image Sound'
    }

    static createCard(cardName) {
      const card = {
        name: cardName,
        type: 'set-image-sound',
        image: 'https://via.placeholder.com/150',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('set-image-sound', SetImageSound)
})
