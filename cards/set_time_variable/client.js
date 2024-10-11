define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class SetTimeVariableNode extends Node {
    cardIcon () {
      return '<i class="fas fa-download" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      return [{
        field: 'variable',
        type: 'text',
        multiline: false,
        label: {
          en: 'Name'
        }
      }, {
        field: 'value',
        type: 'text',
        multiline: false,
        label: {
          en: 'Value'
        },
        validator: function(value) {
          if (value.is_valid) {
            return null
          }

          return `Invalid because "${value} is not in a format that can be parsed as a date.`
        }
      }, {
        field: 'variable-description',
        type: 'readonly',
        value: {
          en: 'Value can be "[NOW]" for the current time, a standard string ("2024-01-01 01:00:00"), a Unix timestamp (e.g. 1726854543), just the time ("12:00pm"), or just the date ("2024-07-04").'
        }
      }, {
        field: 'adjustment',
        type: 'choice',
        label: {
          en: 'Adjustment'
        },
        options: [{
          value: 'none',
          label: {
            en: 'None'
          }
        }, {
          value: 'add',
          label: {
            en: 'Add to value'
          }
        }, {
          value: 'subtract',
          label: {
            en: 'Subtract from value'
          }
        }]
      }, {
        field: 'quantity',
        type: 'integer',
        multiline: false,
        label: {
          en: 'Quantity'
        },
        width: 6
      }, {
        field: 'units',
        type: 'choice',
        width: 6,
        label: {
          en: 'Units'
        },
        options: [{
          value: 'seconds',
          label: {
            en: 'Seconds'
          }
        }, {
          value: 'minutes',
          label: {
            en: 'Minutes'
          }
        }, {
          value: 'hours',
          label: {
            en: 'Hours'
          }
        }, {
          value: 'days',
          label: {
            en: 'Days'
          }
        }, {
          value: 'weeks',
          label: {
            en: 'Weeks'
          }
        }, {
          value: 'months',
          label: {
            en: 'Months'
          }
        }, {
          value: 'years',
          label: {
            en: 'Years'
          }
        }]
      }, {
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
          en: 'Sets a time variable in the given scope, then proceeds to the next card.'
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
      return '<div class="mdc-typography--body1" style="margin: 16px;">' + this.definition.variable + ' = ' + this.definition.value + '</div>'
    }

    initialize () {
      super.initialize()

      this.initializeFields()
    }

    issues (sequence) {
      const issues = super.issues(sequence)

      if (this.definition.variable === undefined || this.definition.variable.trim().length === 0) {
        issues.push(['No variable name provided.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.value === undefined || this.definition.value.trim().length === 0) {
        issues.push(['No value provided.', 'node', this.definition.id, this.cardName()])
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
      return 'Set Time Variable'
    }

    static cardName () {
      return 'Set Time Variable'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        type: 'set-time-variable',
        variable: 'my-time-variable',
        adjustment: 'none',
        value: '[NOW]',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('set-time-variable', SetTimeVariableNode)

  return SetTimeVariableNode
})
