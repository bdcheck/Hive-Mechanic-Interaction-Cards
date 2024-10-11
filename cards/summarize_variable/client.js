define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class SummarizeVariableNode extends Node {
    cardIcon () {
      return '<i class="fas fa-percent" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      return [{
        field: 'variable',
        type: 'text',
        multiline: false,
        label: {
          en: 'Variable to Summarize'
        }
      }, {
        field: 'scope',
        type: 'choice',
        label: {
          en: 'Variable Scope'
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
        field: 'operation',
        type: 'choice',
        label: {
          en: 'Summary Operation'
        },
        options: [{
          value: 'mean',
          label: {
            en: 'Mean'
          }
        }, {
          value: 'median',
          label: {
            en: 'Median'
          }
        }, {
          value: 'mode',
          label: {
            en: 'Mode'
          }
        }, {
          value: 'count',
          label: {
            en: 'Count'
          }
        }, {
          value: 'sum',
          label: {
            en: 'Sum'
          }
        }, {
          value: 'minimum',
          label: {
            en: 'Minimum'
          }
        }, {
          value: 'maximum',
          label: {
            en: 'Maximum'
          }
        }]
      }, {
        field: 'summary',
        type: 'text',
        multiline: false,
        label: {
          en: 'Summary Variable'
        }
      }, {
        field: 'summary_scope',
        type: 'choice',
        label: {
          en: 'Summary Scope'
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
          en: 'Summarize variables across a given scope and store the result, then proceeds to the next card.'
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
      if (this.definition.variable !== undefined) {
        return `<div class="mdc-typography--body1" style="margin: 16px;">Summarize (${this.definition.operation}) ${this.definition.variable} (${this.definition.scope}) and store in ${this.definition.summary}.</div>`
      }

      return `<div class="mdc-typography--body1" style="margin: 16px;">Summarize variable.</div>`
    }

    initialize () {
      super.initialize()

      this.initializeFields()
    }

    issues (sequence) {
      const issues = super.issues(sequence)

      if (this.definition.variable === undefined || this.definition.variable.trim().length === 0) {
        issues.push(['No variable to summarize provided.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.summary === undefined || this.definition.summary.trim().length === 0) {
        issues.push(['No variable to store summary provided.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.next === undefined || this.definition.next === null || this.definition.next.trim().length === 0) {
        issues.push(['No next destination node selected.', 'node', this.definition.id, this.cardName()])
      }

      return issues
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
      return 'Summarize Variable'
    }

    static cardName () {
      return 'Summarize Variable'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        type: 'summarize-variable',
        scope: 'player',
        operation: 'sum',
        summary_scope: 'session',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('summarize-variable', SummarizeVariableNode)

  return SummarizeVariableNode
})
