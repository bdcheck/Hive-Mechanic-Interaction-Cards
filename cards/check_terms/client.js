define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class CheckTermsNode extends Node {
    cardIcon () {
      return '<i class="fas fa-question-circle" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      return [{
        field: 'description',
        type: 'readonly',
        value: {
          en: 'If the user has accepted the terms & conditions:'
        },
        width: 7,
        is_help: true
      }, {
        field: 'accepted',
        type: 'card',
        width: 5
      }, {
        field: 'description',
        type: 'readonly',
        value: {
          en: 'If the user has not accepted the terms & conditions:'
        },
        width: 7,
        is_help: true
      }, {
        field: 'not_accepted',
        type: 'card',
        width: 5
      }]
    }

    viewBody () {
      return '<div class="mdc-typography--body1" style="margin: 16px;">Check Terms Acceptance & Conditions.</div>'
    }

    initialize () {
      super.initialize()

      this.initializeFields()
    }

    issues (sequence) {
      const issues = super.issues(sequence)

      if (this.definition.accepted === undefined || this.definition.accepted === null || this.definition.accepted.trim().length === 0) {
        issues.push(['No next destination node selected for terms acceptance.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.not_accepted === undefined || this.definition.not_accepted === null || this.definition.not_accepted.trim().length === 0) {
        issues.push(['No next destination node selected for missing acceptance.', 'node', this.definition.id, this.cardName()])
      }

      return issues
    }

    updateReferences (oldId, newId) {
      if (this.definition.accepted === oldId) {
        this.definition.accepted = newId

        if (newId === null) {
          console.log('check-terms.js: Unable to resolve ' + oldId + ' SEQ: ' + this.sequence.definition.id)

          delete this.definition.accepted
        }
      }

      if (this.definition.not_accepted === oldId) {
        this.definition.not_accepted = newId

        if (newId === null) {
          console.log('check-terms.js: Unable to resolve ' + oldId + ' SEQ: ' + this.sequence.definition.id)

          delete this.definition.not_accepted
        }
      }
    }

    destinationNodes (sequence) {
      const nodes = super.destinationNodes(sequence)

      const acceptedId = this.definition.accepted

      let found = false

      for (let i = 0; i < this.sequence.definition.items.length; i++) {
        const item = this.sequence.definition.items[i]

        if (item.id === acceptedId || (this.sequence.definition.id + '#' + item.id) === acceptedId) {
          nodes.push(Node.createCard(item, sequence))

          found = true
        }
      }

      if (found == false) {
        const acceptedNode = this.sequence.resolveNode(acceptedId)

        if (acceptedNode != null) {
          nodes.push(acceptedNode)
        } else {
          delete this.definition.accepted
        }
      }

      const notAcceptedId = this.definition.not_accepted

      found = false

      for (let i = 0; i < this.sequence.definition.items.length; i++) {
        const item = this.sequence.definition.items[i]

        if (item.id === notAcceptedId || (this.sequence.definition.id + '#' + item.id) === notAcceptedId) {
          nodes.push(Node.createCard(item, sequence))

          found = true
        }
      }

      if (found == false) {
        const notAcceptedNode = this.sequence.resolveNode(notAcceptedId)

        if (notAcceptedNode != null) {
          nodes.push(notAcceptedNode)
        } else {
          delete this.definition.not_accepted
        }
      }

      return nodes
    }

    cardType () {
      return 'Check Terms Acceptance'
    }

    static cardName () {
      return 'Check Terms Acceptance'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        type: 'check-terms',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('check-terms', CheckTermsNode)

  return CheckTermsNode
})
