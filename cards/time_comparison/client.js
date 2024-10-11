define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class TimeComparisonNode extends Node {
    cardIcon () {
      return '<i class="fas fa-clock" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      return [{
        field: 'variable',
        type: 'text',
        multiline: false,
        label: {
          en: 'Variable'
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
        field: 'comparison',
        type: 'text',
        multiline: false,
        label: {
          en: 'Comparison Variable'
        }
      }, {
        field: 'comparison_scope',
        type: 'choice',
        label: {
          en: 'Comparison Variable Scope'
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
        field: 'before_description',
        type: 'readonly',
        value: {
          en: 'Variable is before comparison variable:'
        },
        width: 7,
        is_help: true
      }, {
        field: 'before_action',
        type: 'card',
        width: 5
      }, {
        field: 'after_description',
        type: 'readonly',
        value: {
          en: 'Variable is at or after comparison variable:'
        },
        width: 7,
        is_help: true
      }, {
        field: 'after_action',
        type: 'card',
        width: 5
      }, {
        field: 'other_description',
        type: 'readonly',
        value: {
          en: 'Other (variable not set, error, etc.):'
        },
        width: 7,
        is_help: true
      }, {
        field: 'other_action',
        type: 'card',
        width: 5
      }]
    }

    viewBody () {
      return '<div class="mdc-typography--body1" style="margin: 16px;">Compare ' + this.definition.variable + ' and ' + this.definition.comparison + '</div>'
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

      if (this.definition.comparison === undefined || this.definition.comparison.trim().length === 0) {
        issues.push(['No value provided.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.before_action === undefined || this.definition.before_action === null || this.definition.before_action.trim().length === 0) {
        issues.push(['No "before" destination node selected.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.after_action === undefined || this.definition.after_action === null || this.definition.after_action.trim().length === 0) {
        issues.push(['No "after" destination node selected.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.other_action === undefined || this.definition.other_action === null || this.definition.other_action.trim().length === 0) {
        issues.push(['No "other" destination node selected.', 'node', this.definition.id, this.cardName()])
      }

      return issues
    }

    updateReferences (oldId, newId) {
      if (this.definition.before_action === oldId) {
        this.definition.before_action = newId

        if (newId === null) {
          delete this.definition.before_action
        }
      }

      if (this.definition.after_action === oldId) {
        this.definition.after_action = newId

        if (newId === null) {
          delete this.definition.after_action
        }
      }

      if (this.definition.other_action === oldId) {
        this.definition.other_action = newId

        if (newId === null) {
          delete this.definition.other_action
        }
      }
    }

    setDefaultDestination (defaultId) {
      this.definition.before_action = defaultId

      if (defaultId === null) {
        delete this.definition.before_action
      }
    }

    destinationNodes (sequence) {
      const nodes = super.destinationNodes(sequence)

      let id = this.definition.before_action

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
          delete this.definition.before_action
        }
      }

      id = this.definition.after_action

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
          delete this.definition.after_action
        }
      }

      id = this.definition.other_action

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
          delete this.definition.other_action
        }
      }

      return nodes
    }

    cardType () {
      return 'Time Comparison'
    }

    static cardName () {
      return 'Time Comparison'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        type: 'time-comparison',
        variable: '[NOW]',
        scope: 'session',
        comparison: '[NOW]',
        comparison_scope: 'session',
        value: 'variable-value',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('time-comparison', TimeComparisonNode)

  return TimeComparisonNode
})
