define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class SendMessageNode extends Node {
    cardIcon () {
      return '<i class="fas fa-comment-dots" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      const defaultCard = SendMessageNode.createCard('')

      return [{
        field: 'message',
        type: 'text',
        multiline: true,
        label: {
          en: 'Message'
        },
        default: defaultCard.message
      }, {
        field: 'duration_description',
        type: 'readonly',
        value: {
          en: 'Sends a message, then proceeds to the next card.'
        },
        width: 7,
        is_help: true
      }, {
        field: 'next',
        type: 'card',
        width: 5
      }, {
        field: 'destinations',
        type: 'text',
        multiline: true,
        label: {
          en: 'Destinations'
        },
        advanced: true,
        requiresManager: true
      }]
    }

    viewBody () {
      return '<div class="mdc-typography--body1" style="margin: 16px;">' + this.definition.message + '</div>'
    }

    initialize () {
      super.initialize()

      this.initializeFields()
    }

    issues (sequence) {
      const issues = super.issues(sequence)

      if (this.definition.message === undefined || this.definition.message.trim().length === 0) {
        issues.push(['No message provided.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.next === undefined || this.definition.next === null || this.definition.next.trim().length === 0) {
        issues.push(['No next destination node selected.', 'node', this.definition.id, this.cardName()])
      }

      return issues
    }

    destinationNodes (sequence) {
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
          delete this.definition.next
        }
      }

      return nodes
    }

    updateReferences (oldId, newId) {
      if (this.definition.next === oldId) {
        this.definition.next = newId

        if (newId === null) {
          delete this.definition.next
        }
      }
    }

    setDefaultDestination (defaultId) {
      this.definition.next = defaultId

      if (defaultId === null) {
        delete this.definition.next
      }
    }

    cardType () {
      return 'Send Message'
    }

    static cardName () {
      return 'Send Message'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        context: '(Context goes here...)',
        message: '(Message goes here...)',
        destinations: '',
        type: 'send-message',
        id: Node.uuidv4(),
        next: null
      }

      return card
    }
  }

  Node.registerCard('send-message', SendMessageNode)

  return SendMessageNode
})
