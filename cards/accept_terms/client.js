define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class AcceptTermsNode extends Node {
    cardIcon () {
      return '<i class="fas fa-user-check" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      return [{
        field: 'description',
        type: 'readonly',
        value: {
          en: 'Marks the terms & conditions as accepted for this activity.'
        },
        width: 7,
        is_help: true
      }, {
        field: 'next',
        type: 'card',
        width: 5
      }]
    }

    viewBody () {
      return '<div class="mdc-typography--body1" style="margin: 16px;">Accept terms & conditions.</div>'
    }

    initialize () {
      super.initialize()

      this.initializeFields()
    }

    issues (sequence) {
      const issues = super.issues(sequence)

      if (this.definition.next === undefined || this.definition.next === null || this.definition.next.trim().length === 0) {
        issues.push(['No next destination node selected.', 'node', this.definition.id, this.cardName()])
      }

      return issues
    }

    updateReferences (oldId, newId) {
      if (this.definition.next === oldId) {
        this.definition.next = newId

        if (newId === null) {
          console.log('accept-terms.js: Unable to resolve ' + oldId + ' SEQ: ' + this.sequence.definition.id)

          delete this.definition.next
        }
      }
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

    cardType () {
      return 'Accept Terms'
    }

    static cardName () {
      return 'Accept Terms'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        type: 'accept-terms',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('accept-terms', AcceptTermsNode)

  return AcceptTermsNode
})
