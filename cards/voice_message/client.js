define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class VoiceMessageNode extends Node {
    cardIcon () {
      return '<i class="fas fa-phone-alt" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    editBody () {
      const body = '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">' +
                       '  <label class="mdc-text-field mdc-text-field--textarea mdc-text-field--outlined" id="' + this.cardId + '_message_field" style="width: 100%; margin-top: 4px;">' +
                       '    <span class="mdc-notched-outline">' +
                       '      <span class="mdc-notched-outline__leading"></span>' +
                       '      <span class="mdc-notched-outline__notch">' +
                       '        <span class="mdc-floating-label" for="' + this.cardId + '_message_value">Message</span>' +
                       '      </span>' +
                       '      <span class="mdc-notched-outline__trailing"></span>' +
                       '    </span>' +
                       '    <span class="mdc-text-field__resizer">' +
                       '      <textarea class="mdc-text-field__input" rows="4" style="width: 100%" id="' + this.cardId + '_message_value"></textarea>' +
                       '    </span>' +
                       '  </label>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 mdc-typography--caption">' +
                       '  <div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_next_call_action" style="width: 100%; margin-top: 4px;">' +
                       '    <div class="mdc-select__anchor">' +
                       '      <span class="mdc-notched-outline">' +
                       '        <span class="mdc-notched-outline__leading"></span>' +
                       '        <span class="mdc-notched-outline__notch">' +
                       '          <span class="mdc-floating-label">Next Call Action</span>' +
                       '        </span>' +
                       '        <span class="mdc-notched-outline__trailing"></span>' +
                       '      </span>' +
                       '      <span class="mdc-select__selected-text-container">' +
                       '        <span class="mdc-select__selected-text"></span>' +
                       '      </span>' +
                       '      <span class="mdc-select__dropdown-icon">' +
                       '        <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">' +
                       '          <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>' +
                       '          <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15"></polygon>' +
                       '        </svg>' +
                       '      </span>' +
                       '    </div>' +
                       '    <div class="mdc-select__menu mdc-menu mdc-menu-surface" role="listbox">' +
                       '      <ul class="mdc-list" role="listbox">' +
                       '          <li class="mdc-list-item" data-value="continue" role="option">' +
                       '            <span class="mdc-list-item__ripple"></span>' +
                       '            <span class="mdc-list-item__text">Continue<span>' +
                       '          </li>' +
                       '          <li class="mdc-list-item" data-value="pause" role="option">' +
                       '            <span class="mdc-list-item__ripple"></span>' +
                       '            <span class="mdc-list-item__text">Pause<span>' +
                       '          </li>' +
                       '          <li class="mdc-list-item" data-value="gather" role="option">' +
                       '            <span class="mdc-list-item__ripple"></span>' +
                       '            <span class="mdc-list-item__text">Gather Response<span>' +
                       '          </li>' +
                       '          <li class="mdc-list-item" data-value="hangup" role="option">' +
                       '            <span class="mdc-list-item__ripple"></span>' +
                       '            <span class="mdc-list-item__text">Hang Up<span>' +
                       '          </li>' +
                       '      </ul>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" id="' + this.cardId + '_pause_container">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_pause_delay" style="width: 100%; margin-top: 4px;">' +
                       '    <input class="mdc-text-field__input"style="width: 100%" id="' + this.cardId + '_pause_delay_value" />' +
                       '    <div class="mdc-notched-outline">' +
                       '      <div class="mdc-notched-outline__leading"></div>' +
                       '      <div class="mdc-notched-outline__notch">' +
                       '        <label for="' + this.cardId + '_pause_delay_value" class="mdc-floating-label">Pause Delay (Seconds)</label>' +
                       '      </div>' +
                       '      <div class="mdc-notched-outline__trailing"></div>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 mdc-typography--caption ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_gather_input_method" style="width: 100%; margin-top: 4px;">' +
                       '    <div class="mdc-select__anchor">' +
                       '      <span class="mdc-notched-outline">' +
                       '        <span class="mdc-notched-outline__leading"></span>' +
                       '        <span class="mdc-notched-outline__notch">' +
                       '          <span class="mdc-floating-label">Input Method</span>' +
                       '        </span>' +
                       '        <span class="mdc-notched-outline__trailing"></span>' +
                       '      </span>' +
                       '      <span class="mdc-select__selected-text-container">' +
                       '        <span class="mdc-select__selected-text"></span>' +
                       '      </span>' +
                       '      <span class="mdc-select__dropdown-icon">' +
                       '        <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">' +
                       '          <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>' +
                       '          <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15"></polygon>' +
                       '        </svg>' +
                       '      </span>' +
                       '    </div>' +
                       '    <div class="mdc-select__menu mdc-menu mdc-menu-surface" role="listbox">' +
                       '      <ul class="mdc-list" role="listbox">' +
                       '          <li class="mdc-list-item" data-value="dtmf" role="option">' +
                       '            <span class="mdc-list-item__ripple"></span>' +
                       '            <span class="mdc-list-item__text">Touch Tone<span>' +
                       '          </li>' +
                       '          <li class="mdc-list-item" data-value="speech" role="option">' +
                       '            <span class="mdc-list-item__ripple"></span>' +
                       '            <span class="mdc-list-item__text">Speech<span>' +
                       '          </li>' +
                       '          <li class="mdc-list-item" data-value="dtmf speech" role="option">' +
                       '            <span class="mdc-list-item__ripple"></span>' +
                       '            <span class="mdc-list-item__text">Touch Tone or Speech<span>' +
                       '          </li>' +
                       '      </ul>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 mdc-typography--caption ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-select mdc-select--outlined" id="' + this.cardId + '_gather_speech_model" style="width: 100%; margin-top: 4px;">' +
                       '    <div class="mdc-select__anchor">' +
                       '      <span class="mdc-notched-outline">' +
                       '        <span class="mdc-notched-outline__leading"></span>' +
                       '        <span class="mdc-notched-outline__notch">' +
                       '          <span class="mdc-floating-label">Speech Model</span>' +
                       '        </span>' +
                       '        <span class="mdc-notched-outline__trailing"></span>' +
                       '      </span>' +
                       '      <span class="mdc-select__selected-text-container">' +
                       '        <span class="mdc-select__selected-text"></span>' +
                       '      </span>' +
                       '      <span class="mdc-select__dropdown-icon">' +
                       '        <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">' +
                       '          <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>' +
                       '          <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15"></polygon>' +
                       '        </svg>' +
                       '      </span>' +
                       '    </div>' +
                       '    <div class="mdc-select__menu mdc-menu mdc-menu-surface" role="listbox">' +
                       '      <ul class="mdc-list" role="listbox">' +
                       '          <li class="mdc-list-item" data-value="default" role="option">' +
                       '            <span class="mdc-list-item__ripple"></span>' +
                       '            <span class="mdc-list-item__text">Default<span>' +
                       '          </li>' +
                       '          <li class="mdc-list-item" data-value="numbers_and_commands" role="option">' +
                       '            <span class="mdc-list-item__ripple"></span>' +
                       '            <span class="mdc-list-item__text">Numbers and Commands<span>' +
                       '          </li>' +
                       '          <li class="mdc-list-item" data-value="phone_call" role="option">' +
                       '            <span class="mdc-list-item__ripple"></span>' +
                       '            <span class="mdc-list-item__text">Phone Call<span>' +
                       '          </li>' +
                       '      </ul>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_gather_timeout" style="width: 100%; margin-top: 4px;">' +
                       '    <input class="mdc-text-field__input"style="width: 100%" id="' + this.cardId + '_gather_timeout_value" />' +
                       '    <div class="mdc-notched-outline">' +
                       '      <div class="mdc-notched-outline__leading"></div>' +
                       '      <div class="mdc-notched-outline__notch">' +
                       '        <label for="' + this.cardId + '_gather_timeout_value" class="mdc-floating-label">Timeout (Seconds)</label>' +
                       '      </div>' +
                       '      <div class="mdc-notched-outline__trailing"></div>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-text-field mdc-text-field--outlined" id="' + this.cardId + '_gather_speech_timeout" style="width: 100%; margin-top: 4px;">' +
                       '    <input class="mdc-text-field__input"style="width: 100%" id="' + this.cardId + '_gather_speech_timeout_value" />' +
                       '    <div class="mdc-notched-outline">' +
                       '      <div class="mdc-notched-outline__leading"></div>' +
                       '      <div class="mdc-notched-outline__notch">' +
                       '        <label for="' + this.cardId + '_gather_speech_timeout_value" class="mdc-floating-label">Speech Timeout (Seconds)</label>' +
                       '      </div>' +
                       '      <div class="mdc-notched-outline__trailing"></div>' +
                       '    </div>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5 ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-form-field">' +
                       '    <div class="mdc-checkbox" style="margin-left: -11px;" id="' + this.cardId + '_gather_profanity_filter">' +
                       '      <input type="checkbox" class="mdc-checkbox__native-control" id="' + this.cardId + '_gather_profanity_filter_value"/>' +
                       '      <div class="mdc-checkbox__background">' +
                       '        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">' +
                       '          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>' +
                       '        </svg>' +
                       '        <div class="mdc-checkbox__mixedmark"></div>' +
                       '      </div>' +
                       '    </div>' +
                       '    <label for="' + this.cardId + '_gather_profanity_filter">Profanity Filter</label>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 ' + this.cardId + '_gather_container">' +
                       '  <div class="mdc-form-field">' +
                       '    <div class="mdc-checkbox" style="margin-left: -11px;" id="' + this.cardId + '_gather_action_empty">' +
                       '      <input type="checkbox" class="mdc-checkbox__native-control" id="' + this.cardId + '_gather_action_empty_value"/>' +
                       '      <div class="mdc-checkbox__background">' +
                       '        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">' +
                       '          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>' +
                       '        </svg>' +
                       '        <div class="mdc-checkbox__mixedmark"></div>' +
                       '      </div>' +
                       '    </div>' +
                       '    <label for="' + this.cardId + '_gather_action_empty">Action on Empty Result</label>' +
                       '  </div>' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-7 mdc-typography--caption" style="padding-top: 8px;">' +
                       '  The message above will be spoken to the user and the system will proceed to the next card.' +
                       '</div>' +
                       '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-5" style="padding-top: 8px; text-align: right;">' +
                       '  <button class="mdc-icon-button" id="' + this.cardId + '_next_edit">' +
                       '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">link</i>' +
                       '  </button>' +
                       '  <button class="mdc-icon-button" id="' + this.cardId + '_next_goto">' +
                       '    <i class="material-icons mdc-icon-button__icon" aria-hidden="true">search</i>' +
                       '  </button>' +
                       '</div>'

      return body
    }

    viewBody () {
      return '<div class="mdc-typography--body1" style="margin: 16px;">' + this.definition.message + '</div>'
    }

    initialize () {
      super.initialize()

      const me = this

      const messageField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_message_field'))
      messageField.value = this.definition.message

      $('#' + this.cardId + '_message_value').on('change keyup paste', function () {
        const value = messageField.value

        me.definition.message = value

        me.sequence.markChanged(me.id)
      })

      const delayField = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_pause_delay'))

      if (this.definition.pause !== undefined) {
        delayField.value = this.definition.pause
      } else {
        delayField.value = ''
      }

      $('#' + this.cardId + '_pause_delay_value').on('change keyup paste', function () {
        const value = delayField.value

        me.definition.pause = value

        me.sequence.markChanged(me.id)
      })

      const gatherTimeout = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_gather_timeout'))

      if (this.definition.timeout !== undefined) {
        gatherTimeout.value = this.definition.timeout
      } else {
        gatherTimeout.value = ''
      }

      $('#' + this.cardId + '_gather_timeout_value').on('change keyup paste', function () {
        const value = gatherTimeout.value

        me.definition.timeout = value

        me.sequence.markChanged(me.id)
      })

      const speechTimeout = mdc.textField.MDCTextField.attachTo(document.getElementById(this.cardId + '_gather_speech_timeout'))

      if (this.definition.speech_timeout !== undefined) {
        speechTimeout.value = this.definition.speech_timeout
      } else {
        speechTimeout.value = ''
      }

      $('#' + this.cardId + '_gather_speech_timeout_value').on('change keyup paste', function () {
        const value = speechTimeout.value

        me.definition.speech_timeout = value

        me.sequence.markChanged(me.id)
      })

      const profanityFilter = mdc.checkbox.MDCCheckbox.attachTo(document.getElementById(this.cardId + '_gather_profanity_filter'))

      if (this.definition.profanity_filter !== undefined) {
        profanityFilter.checked = this.definition.profanity_filter
      } else {
        profanityFilter.checked = false
      }

      $('#' + this.cardId + '_gather_profanity_filter_value').on('change', function () {
        const value = profanityFilter.checked

        me.definition.profanity_filter = value

        me.sequence.markChanged(me.id)
      })

      const actionEmpty = mdc.checkbox.MDCCheckbox.attachTo(document.getElementById(this.cardId + '_gather_action_empty'))

      if (this.definition.action_empty !== undefined) {
        actionEmpty.checked = this.definition.action_empty
      } else {
        actionEmpty.checked = false
      }

      $('#' + this.cardId + '_gather_action_empty_value').on('change', function () {
        const value = actionEmpty.checked

        me.definition.action_empty = value

        me.sequence.markChanged(me.id)
      })

      me.sequence.initializeDestinationMenu(me.cardId, function (selected) {
        me.definition.next = selected

        me.sequence.markChanged(me.id)
        me.sequence.loadNode(me.definition)
      })

      $('#' + this.cardId + '_next_edit').on('click', function () {
        me.sequence.refreshDestinationMenu(function (destination) {
          window.dialogBuilder.chooseDestinationDialog.close()

          me.definition.next = destination

          me.sequence.markChanged(me.id)
          me.sequence.loadNode(me.definition)
        })

        window.dialogBuilder.chooseDestinationDialog.open()
      })

      $('#' + this.cardId + '_next_goto').on('click', function () {
        const destinationNodes = me.destinationNodes(me.sequence)

        for (let i = 0; i < destinationNodes.length; i++) {
          const destinationNode = destinationNodes[i]

          if (me.definition.next.endsWith(destinationNode.id)) {
            $("[data-node-id='" + destinationNode.id + "']").css('background-color', '#ffffff')
          } else {
            $("[data-node-id='" + destinationNode.id + "']").css('background-color', '#e0e0e0')
          }
        }
      })

      const inputMethodField = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_gather_input_method'))

      if (this.definition.input_method !== undefined) {
        inputMethodField.value = this.definition.input_method
      }

      inputMethodField.listen('MDCSelect:change', () => {
        me.definition.input_method = inputMethodField.value

        me.sequence.markChanged(me.id)
      })

      const speechModelField = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_gather_speech_model'))

      if (this.definition.speech_model !== undefined) {
        speechModelField.value = this.definition.speech_model
      }

      speechModelField.listen('MDCSelect:change', () => {
        me.definition.speech_model = speechModelField.value

        me.sequence.markChanged(me.id)
      })

      const nextActionField = mdc.select.MDCSelect.attachTo(document.getElementById(this.cardId + '_next_call_action'))

      if (this.definition.next_action !== undefined) {
        nextActionField.value = this.definition.next_action
      } else {
        nextActionField.value = 'continue'
      }

      $('#' + this.cardId + '_pause_container').hide()
      $('.' + this.cardId + '_gather_container').hide()

      nextActionField.listen('MDCSelect:change', () => {
        console.log('Selected option at index ' + nextActionField.selectedIndex + ' with value "' + nextActionField.value + '"')

        me.definition.next_action = nextActionField.value

        $('#' + this.cardId + '_pause_container').hide()
        $('.' + this.cardId + '_gather_container').hide()

        if (me.definition.next_action === 'pause') {
          $('#' + this.cardId + '_pause_container').show()
        } else if (me.definition.next_action === 'gather') {
          $('.' + this.cardId + '_gather_container').show()
        }

        me.sequence.markChanged(me.id)
      })

      if (nextActionField.value === 'pause') {
        $('#' + this.cardId + '_pause_container').show()
      } else if (me.definition.next_action === 'gather') {
        $('.' + this.cardId + '_gather_container').show()
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

        if (node !== null) {
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

    cardType () {
      return 'Voice Message'
    }

    static cardName () {
      return 'Voice Message'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        context: '(Context goes here...)',
        message: '(Message goes here...)',
        type: 'voice-message',
        id: Node.uuidv4(),
        next: null
      }

      return card
    }
  }

  Node.registerCard('voice-message', VoiceMessageNode)

  return VoiceMessageNode
})
