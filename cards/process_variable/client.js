define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class ProcessVariableNode extends Node {
    cardFields () {
      return [{
        field: 'variable',
        type: 'text',
        label: {
          en: 'Variable'
        }
      }, {
        field: 'patterns',
        type: 'list',
        label: {
          en: 'Patterns'
        },
        template: [{
          field: 'pattern',
          type: 'pattern',
          operation_label: {
            en: 'Value...'
          },
          operation_width: 8,
          content_label: {
            en: 'Text...'
          },
          content_width: 8
        }, {
          field: 'action',
          type: 'card',
          width: 4
        }, {
          type: 'readonly',
          value: '----',
          width: 12
        }],
        add_item_label: {
          en: 'Add Pattern'
        }
      }, {
        type: 'readonly',
        value: {
          en: 'Pattern Not Found:'
        },
        width: 8
      }, {
        field: 'not_found_action',
        type: 'card',
        width: 4
      }, {
        type: 'readonly',
        value: '----',
        is_help: true,
        width: 12
      }, {
        type: 'readonly',
        value: {
          en: 'Evaluates variable and proceeds to the first action to match its value'
        },
        is_help: true,
        width: 12
      }]
    }

    viewBody () {
      let summary = ''

      for (let i = 0; i < this.definition.patterns.length; i++) {
        const patternDef = this.definition.patterns[i]

        const humanized = this.humanizePattern(patternDef.pattern, patternDef.action)

        summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + humanized + '</div>'
      }

      if (this.definition.not_found_action !== undefined && this.definition.not_found_action !== '') {
        summary += '<div class="mdc-typography--body1" style="margin: 16px;">'
        summary += "If variable doesn't match a prior pattern, go to " + this.definition.not_found_action + '.'
        summary += '</div>'
      }

      return summary
    }

    initialize () {
      super.initialize()

      this.initializeFields()
    }

    issues (sequence) {
      const issues = super.issues(sequence)

      if (this.definition.not_found_action === undefined || this.definition.not_found_action.trim().length === 0) {
        issues.push(['No "not found" action provided.', 'node', this.definition.id, this.cardName()])
      }

      for (let i = 0; i < this.definition.patterns.length; i++) {
        const pattern = this.definition.patterns[i]

        if (pattern.action === undefined || pattern.action.trim().length === 0) {
          issues.push(['No action provided for pattern "' + pattern.pattern + '".', 'node', this.definition.id, this.cardName()])
        }
      }

      return issues
    }

    destinationNodes (sequence) {
      const nodes = super.destinationNodes()

      const nextIds = []

      for (let i = 0; i < this.definition.patterns.length; i++) {
        const pattern = this.definition.patterns[i]

        if (nextIds.indexOf(pattern.action) === -1) {
          nextIds.push(pattern.action)
        }
      }

      if (this.definition.not_found_action !== undefined) {
        if (nextIds.indexOf(this.definition.not_found_action) === -1) {
          nextIds.push(this.definition.not_found_action)
        }
      }

      for (let i = 0; i < nextIds.length; i++) {
        const id = nextIds[i]

        let pushed = false

        for (let j = 0; j < sequence.definition.items.length; j++) {
          const item = sequence.definition.items[j]

          if (item.id === id || (this.sequence.definition.id + '#' + item.id) === id) {
            const node = Node.createCard(item, sequence)

            nodes.push(node)

            pushed = true
          }
        }

        if (pushed === false) {
          const node = this.sequence.resolveNode(id)

          if (node !== null) {
            nodes.push(node)
          }
        }
      }

      return nodes
    }

    updateReferences (oldId, newId) {
      for (let i = 0; i < this.definition.patterns.length; i++) {
        const pattern = this.definition.patterns[i]

        if (pattern.action === oldId) {
          pattern.action = newId

          if (newId === null) {
            delete pattern.action
          }
        }
      }

      if (this.definition.not_found_action !== undefined) {
        if (this.definition.not_found_action === oldId) {
          this.definition.not_found_action = newId

          if (newId === null) {
            delete this.definition.not_found_action
          }
        }
      }
    }

    cardType () {
      return 'Process Variable'
    }

    humanizePattern (pattern, action) {
      if (action === undefined || action === '?' || action === null || action === '') {
        action = '?'
      }

      if (pattern.startsWith('^[') && pattern.endsWith(']')) {
        const matches = []

        for (let i = 2; i < pattern.length - 1; i++) {
          matches.push('' + pattern[i])
        }

        let humanized = ''

        for (let i = 0; i < matches.length; i++) {
          if (humanized.length > 0) {
            if (i < matches.length - 1) {
              humanized += ', '
            } else if (matches.length > 2) {
              humanized += ', or '
            } else {
              humanized += ' or '
            }
          }

          humanized += '"' + matches[i] + '"'
        }

        return 'If variable value starts with ' + humanized + ', go to ' + action + '.'
      } else if (pattern === '.*') {
        return 'If variable value is anything, go to ' + action + '.'
      } else {
        return 'If variable value is "' + pattern + '", go to ' + action + '.'
      }
    }

    static cardName () {
      return 'Process Variable'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        patterns: [],
        type: 'process-variable',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('process-variable', ProcessVariableNode)
})
