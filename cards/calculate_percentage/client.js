define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  // Validates that the input string is a valid date formatted as "mm/dd/yyyy"
  // https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
  function isValidDate (dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) { return false }

    // Parse the date parts to integers
    const parts = dateString.split('/')
    const day = parseInt(parts[1], 10)
    const month = parseInt(parts[0], 10)
    const year = parseInt(parts[2], 10)

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month === 0 || month > 12) { return false }

    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) { monthLength[1] = 29 }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1]
  };

  class CalculatePercentageNode extends Node {
    cardIcon () {
      return '<i class="fas fa-calculator" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      return [{
        field: 'variable',
        type: 'text',
        multiline: false,
        label: {
          en: 'Name'
        }
      },

      {
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
        field: 'start_time',
        type: 'text',
        multiline: false,
        label: {
          en: 'Start Date in (mm/dd/yyyy) format (optional)'
        }
      }, {
        field: 'player_latest_answer',
        type: 'choice',
        label: {
          en: 'Restrict Player to latest answer (optional)'
        },
        options: [
          {
            value: 'True',
            label: {
              en: 'Yes'
            }
          }, {
            value: 'False',
            label: {
              en: 'No'
            }
          }
        ]

      },
      {
        field: 'description',
        type: 'readonly',
        value: {
          en: 'Calculates number of answers and percentage that are the same.'
        },
        width: 7,
        is_help: true
      },
      {
        field: 'next',
        type: 'card',
        width: 5
      }]
    }

    viewBody () {
      return '<div class="mdc-typography--body1" style="margin: 16px;">' +
                this.definition.variable +
                ' returns ' +
                this.definition.variable +
                '_cp_total, ' +
                this.definition.variable +
                '_cp_matched, and ' +
                this.definition.variable +
                '_cp_percentage </div>'
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
      if (this.definition.start_time && !isValidDate(this.definition.start_time)) {
        issues.push(['Date is invalid', 'node', this.definition.id, this.cardName()])
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
          console.log('calculate-percentage.js: Unable to resolve ' + oldId + ' SEQ: ' + this.sequence.definition.id)

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

        if (node !== null) {
          nodes.push(node)
        } else {
          delete this.definition.next
        }
      }

      return nodes
    }

    cardType () {
      return 'Calculate Percentage'
    }

    static cardName () {
      return 'Calculate Percentage'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        type: 'calculate-percentage',
        variable: 'variable-name',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('calculate-percentage', CalculatePercentageNode)

  return CalculatePercentageNode
})
