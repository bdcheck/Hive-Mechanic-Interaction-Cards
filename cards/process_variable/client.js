define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class ProcessVariableNode extends Node {
    editBody () {
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

      body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_edit_not_found">'
      body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>'
      body += '  </button>'

      if (this.definition.not_found_action !== undefined) {
        body += '  <button class="mdc-icon-button" id="' + this.cardId + '_pattern_click_not_found">'
        body += '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>'
        body += '  </button>'
      }

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

      const nameField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_variable_name_field'))

      if (this.definition.variable === undefined) {
        this.definition.variable = ''
      }

      nameField.value = this.definition.variable

      $('#' + this.cardId + '_variable_name_value').on('change keyup paste', function () {
        const value = $('#' + me.cardId + '_variable_name_value').val()

        me.definition.variable = value

        me.sequence.markChanged(me.id)
      })

      const me = this

      me.sequence.initializeDestinationMenu(me.cardId, function (selected) {
        if (me.selectedPattern >= 0 && event.detail.action === 'remove') {
          me.definition.patterns.splice(me.selectedPattern, 1)

          me.sequence.markChanged(me.id)

          me.sequence.loadNode(me.definition)
        } else {
          if (me.selectedPattern >= 0) {
            me.definition.patterns[me.selectedPattern].action = selected

            me.sequence.markChanged(me.id)
            me.sequence.loadNode(me.definition)
          } else { // Not found
            me.definition.not_found_action = selected

            me.sequence.markChanged(me.id)
            me.sequence.loadNode(me.definition)
          }
        }
      })

      //          const destination = mdc.select.MDCSelect.attachTo(document.getElementById(me.cardId + '_destination'));
      //
      //          destination.listen('MDCSelect:change', () => {
      //              console.log('Selected option at index ' + destination.selectedIndex + ' with value "' + destination.value + '"');
      //
      //                if (destination.value === 'add_card') {
      //                    me.sequence.addCard(me.cardId, function(node_id) {
      //                        console.log("ADDED: ", node_id);
      //                    });
      //                }
      //          });

      const dialog = mdc.dialog.MDCDialog.attachTo(document.getElementById(me.cardId + '-edit-dialog'))

      dialog.listen('MDCDialog:closed', (event) => {
        if (me.selectedPattern >= 0 && event.detail.action === 'remove') {
          me.definition.patterns.splice(me.selectedPattern, 1)

          me.sequence.markChanged(me.id)

          me.sequence.loadNode(me.definition)
          //              } else {
          //                  if (me.selectedPattern >= 0) {
          //                      me.definition['patterns'][me.selectedPattern]["action"] = destination.value;
          //
          //                      me.sequence.markChanged(me.id);
          //                      me.sequence.loadNode(me.definition);
          //                  } else if (me.selectedPattern === -1) { // Not found
          //                      me.definition["not_found_action"] = destination.value;
          //
          //                      me.sequence.markChanged(me.id);
          //                      me.sequence.loadNode(me.definition);
          //                  }
        }
      })

      for (let i = 0; i < this.definition.patterns.length; i++) {
        const patternDef = this.definition.patterns[i]

        const identifier = this.cardId + '_pattern_value_' + i

        const patternField = mdc.textField.MDCTextField.attachTo(document.getElementById(identifier))

        patternField.value = patternDef.pattern

        $('#' + identifier).on('change keyup paste', function () {
          const value = $('#' + identifier + '_value').val()

          patternDef.pattern = value

          me.sequence.markChanged(me.id)
        })

        const currentIndex = i

        $('#' + this.cardId + '_pattern_click_' + i).on('click', function () {
          const destinationNodes = me.destinationNodes(me.sequence)

          for (let i = 0; i < destinationNodes.length; i++) {
            const destinationNode = destinationNodes[i]

            if (patternDef.action.endsWith(destinationNode.id)) {
              $("[data-node-id='" + destinationNode.id + "']").css('background-color', '#ffffff')
            } else {
              $("[data-node-id='" + destinationNode.id + "']").css('background-color', '#e0e0e0')
            }
          }
        })

        $('#' + this.cardId + '_pattern_edit_' + i).on('click', function () {
          me.selectedPattern = currentIndex

          $('#' + me.cardId + '-edit-dialog [data-mdc-dialog-action="remove"]').show()

          dialog.open()
        })
      }

      $('#' + this.cardId + '_pattern_edit_not_found').on('click', function () {
        me.selectedPattern = -1

        $('#' + me.cardId + '-edit-dialog [data-mdc-dialog-action="remove"]').hide()

        dialog.open()
      })

      $('#' + this.cardId + '_add_pattern').on('click', function () {
        me.definition.patterns.push({
          action: '',
          pattern: '?'
        })

        me.sequence.loadNode(me.definition)
        me.sequence.markChanged(me.id)
      })

      $('#' + this.cardId + '_pattern_click_not_found').on('click', function () {
        const destinationNodes = me.destinationNodes(me.sequence)

        for (let i = 0; i < destinationNodes.length; i++) {
          const destinationNode = destinationNodes[i]

          if (me.definition.not_found_action.endsWith(destinationNode.id)) {
            $("[data-node-id='" + destinationNode.id + "']").css('background-color', '#ffffff')
          } else {
            $("[data-node-id='" + destinationNode.id + "']").css('background-color', '#e0e0e0')
          }
        }
      })
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
      console.log('DEST NODES: 1')

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

      console.log('DEST NODES: ' + nodes)

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
