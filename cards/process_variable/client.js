define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class ProcessVariableNode extends Node {
    static createCard (cardName) {
      const card = {
        name: cardName,
        patterns: [],
        type: 'process-variable',
        id: Node.uuidv4()
      }

      return card
    }

    static cardName () {
      return 'Process Variable'
    }

    cardType () {
      return 'Process Variable'
    }

    cardIcon () {
      return '<i class="fa fa-list-alt" style="margin-right: 16px; font-size: 20px;"></i>'
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

      if (this.definition.not_defined_action !== undefined && this.definition.not_defined_action !== '') {
        summary += '<div class="mdc-typography--body1" style="margin: 16px;">'
        summary += 'If variable is not defined, go to ' + this.definition.not_defined_action + '.'
        summary += '</div>'
      }

      return summary
    }

    cardFields () {
      return [{
        field: 'variable',
        type: 'text',
        multiline: false,
        label: {
          en: 'Variable Name'
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
            en: 'Variable...'
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
        value: {
          en: 'Variable Not Defined:'
        },
        width: 8
      }, {
        field: 'not_defined_action',
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
          en: 'Processes response to prior message and proceeds to the first action to match response'
        },
        is_help: true,
        width: 12
      }]
    }

    oldEditBody () {
      const me = this

      const destinationNodes = me.destinationNodes(me.sequence)

      let body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_variable_name_field" style="width: 100%">' +
                       '    <input class="mdc-text-field__input"style="width: 100%" id="' + this.cardId + '_variable_name_value" />' +
                       '    <div class="mdc-notched-outline">' +
                       '      <div class="mdc-notched-outline__leading"></div>' +
                       '      <div class="mdc-notched-outline__notch">' +
                       '        <label for="' + this.cardId + '_variable_name_value" class="mdc-floating-label">Variable Name</label>' +
                       '      </div>' +
                       '      <div class="mdc-notched-outline__trailing"></div>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="padding-top: 8px;">'
      body += '  <div class="mdc-typography--subtitle2">Patterns</div>'
      body += '</div>'

      for (let i = 0; i < this.definition.patterns.length; i++) {
        const patternDef = this.definition.patterns[i]

        let found = false
        let foundNode

        for (let j = 0; j < destinationNodes.length; j++) {
          const destinationNode = destinationNodes[j]

          if (destinationNode.id === patternDef.action) {
            found = true
            foundNode = destinationNode
          }
        }

        if (found === false) {
          const node = me.sequence.resolveNode(patternDef.action)

          if (node !== null) {
            found = true
            foundNode = node
          }
        }

        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
        body += '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_pattern_value_' + i + '"  style="width: 100%">'
        body += '    <input type="text" class="mdc-text-field__input" id="' + this.cardId + '_pattern_value_' + i + '_value">'
        body += '    <div class="mdc-notched-outline">'
        body += '      <div class="mdc-notched-outline__leading"></div>'
        body += '      <div class="mdc-notched-outline__notch">'
        body += '        <label for="' + this.cardId + '_pattern_value_' + i + '_value" class="mdc-floating-label">Response Matches</label>'
        body += '      </div>'
        body += '      <div class="mdc-notched-outline__trailing"></div>'
        body += '    </div>'
        body += '  </div>'

        if (found) {
          if (foundNode.definition.name !== undefined) {
            body += '<div class="mdc-typography--caption">Action: ' + foundNode.definition.name + '</div>'
          } else {
            body += '<div class="mdc-typography--caption">Action: ' + foundNode.definition.id + '</div>'
          }
        } else {
          body += '<div class="mdc-typography--caption">Click + to add an action.</div>'
        }

        body += '</div>'
        body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">'

        body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_edit_' + i + '">'
        body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>'
        body += '  </button>'

        if (found) {
          body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_click_' + i + '">'
          body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>'
          body += '  </button>'
        }

        body += '</div>'
      }

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7">'
      body += '  <p class="mdc-typography--body1">Pattern Not Found: </p>'
      body += '</div>'
      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="text-align: right;">'

      if (this.definition.not_found_action !== undefined) {
        body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_click_not_found">'
        body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>'
        body += '  </button>'
      }

      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_edit_not_found">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>'
      body += '  </button>'

      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" style="text-align: right;">'
      body += '<button class="mdc-button mdc-button--raised" id="' + this.cardId + '_add_pattern">'
      body += '  <span class="mdc-button__label">Add Pattern</span>'
      body += '</button>'
      body += '</div>'

      body += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 mdc-typography--caption" style="padding-top: 8px;">'
      body += '  Reads variable to and proceeds to the first action to matches.'
      body += '</div>'

      body += '<div class="mdc-dialog" role="alertdialog" aria-modal="true" id="' + this.cardId + '-edit-dialog"  aria-labelledby="' + this.cardId + '-dialog-title" aria-describedby="' + this.cardId + '-dialog-content">'
      body += '  <div class="mdc-dialog__container">'
      body += '    <div class="mdc-dialog__surface">'
      body += '      <h2 class="mdc-dialog__title" id="' + this.cardId + '-dialog-title">Choose Destination</h2>'
      body += '      <div class="mdc-dialog__content" id="' + this.cardId + '-dialog-content">'
      body += this.sequence.chooseDestinationMenu(this.cardId)
      body += '      </div>'
      body += '      <footer class="mdc-dialog__actions">'
      body += '        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="remove">'
      body += '          <span class="mdc-button__label">Remove</span>'
      body += '        </button>'
      body += '        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">'
      body += '          <span class="mdc-button__label">Save</span>'
      body += '        </button>'
      body += '      </footer>'
      body += '    </div>'
      body += '  </div>'
      body += '  <div class="mdc-dialog__scrim"></div>'
      body += '</div>'

      return body
    }

    initialize () {
      super.initialize()

      this.initializeFields()
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

      if (this.definition.not_defined_action !== undefined) {
        if (nextIds.indexOf(this.definition.not_defined_action) === -1) {
          nextIds.push(this.definition.not_defined_action)
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

      if (this.definition.not_defined_action !== undefined) {
        if (this.definition.not_defined_action === oldId) {
          this.definition.not_defined_action = newId

          if (newId === null) {
            delete this.definition.not_defined_action
          }
        }
      }
    }

    issues (sequence) {
      const cardIssues = super.issues(sequence)

      if (this.definition.not_found_action === undefined || this.definition.not_found_action.trim().length === 0) {
        cardIssues.push(['No "match not found" action provided.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.not_defined_action === undefined || this.definition.not_defined_action.trim().length === 0) {
        cardIssues.push(['No "variable not defined" action provided.', 'node', this.definition.id, this.cardName()])
      }

      for (let i = 0; i < this.definition.patterns.length; i++) {
        const pattern = this.definition.patterns[i]

        if (pattern.action === undefined || pattern.action.trim().length === 0) {
          cardIssues.push(['No action provided for pattern "' + pattern.pattern + '".', 'node', this.definition.id, this.cardName()])
        }
      }

      return cardIssues
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
  }

  Node.registerCard('process-variable', ProcessVariableNode)
})
