define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class ComparisonCardsNode extends Node {
    constructor (definition, sequence) {
      super(definition, sequence)
      this.nextCardFields = ['next_true', 'next_false', 'next_error']
    }

    cardIcon () {
      return '<i class="fas fa-less-than " style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      return [
        {
          field: 'first_variable',
          type: 'text',
          multiline: false,
          label: {
            en: 'Name'
          }
        }, {
          field: 'operator',
          type: 'choice',
          label: {
            en: 'Operator'
          },
          options: [{
            value: 'equals',
            label: {
              en: 'Equals (==)'
            }
          }, {
            value: 'not_equals',
            label: {
              en: 'Not Equals (!=)'
            }
          }, {
            value: 'less_than',
            label: {
              en: 'Less Than (<)'
            }
          },
          {
            value: 'greater_than',
            label: {
              en: 'Greater Than (>)'
            }
          }]
        }, {
          field: 'second_variable',
          type: 'text',
          multiline: false,
          label: {
            en: 'Value'
          }
        }, {
          field: 'true_label',
          type: 'readonly',
          value: {
            en: 'Comparison is true:'
          },
          width: 7
        }, {
          field: 'next_true',
          width: 5,
          type: 'card'
        }, {
          field: 'false_label',
          type: 'readonly',
          value: {
            en: 'Comparison is false:'
          },
          width: 7
        }, {
          field: 'next_false',
          type: 'card',
          width: 5
        }, {
          field: 'error_label',
          type: 'readonly',
          value: {
            en: 'Error:'
          },
          width: 7
        }, {
          field: 'next_error',
          type: 'card',
          width: 5
        }, {
          field: 'description',
          type: 'readonly',
          value: {
            en: 'Compares two variables with given logic operators.  Numbers and dates are allowed'
          },
          width: 12,
          is_help: true
        }
      ]
    }

    viewBody () {
      return '<div class="mdc-typography--body1" style="margin: 16px;">' + this.definition.first_variable + ' ' + this.definition.operator + ' ' + this.definition.second_variable + '</div>'
    }

    initialize () {
      super.initialize()

      this.initializeFields()
    }

    issues (sequence) {
      const issues = super.issues(sequence)

      if (this.definition.first_variable === undefined || this.definition.first_variable.trim().length === 0) {
        issues.push(['First variable name was not provided.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.second_variable === undefined || this.definition.second_variable.trim().length === 0) {
        issues.push(['Second variable name was not provided.', 'node', this.definition.id, this.cardName()])
      }
      if (this.definition.operator === undefined || this.definition.operator.trim().length === 0) {
        issues.push(['Logic operator was not provided.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.next_true === undefined || this.definition.next_true === null || this.definition.next_true.trim().length === 0) {
        issues.push(['No setup if statement evaluates to true destination node selected.', 'node', this.definition.id, this.cardName()])
      }

      if (this.definition.next_false === undefined || this.definition.next_false === null || this.definition.next_false.trim().length === 0) {
        issues.push(['No setup if statement evaluates to false', 'node', this.definition.id, this.cardName()])
      }
      if (this.definition.next_error === undefined || this.definition.next_error === null || this.definition.next_error.trim().length === 0) {
        issues.push(['No setup if statement evaluates to false', 'node', this.definition.id, this.cardName()])
      }

      return issues
    }

    updateReferences (oldId, newId) {
      for (const item of this.nextCardFields) {
        if (this.definition[item] === oldId) {
          this.definition[item] = newId

          if (newId === null) {
            console.log('logic-variable.js: Unable to resolve ' + oldId + ' SEQ: ' + this.sequence.definition.id)

            delete this.definition[item]
          }
          break
        }
      }
    }

    destinationNodes (sequence) {
      const nodes = super.destinationNodes()

      const nextIds = []

      for (const it of this.nextCardFields) {
        const id = this.definition[it]
        nextIds.push(id)
      }

      for (let i = 0; i < nextIds.length; i++) {
        const id = nextIds[i]

        let pushed = false

        for (let j = 0; j < this.sequence.definition.items.length; j++) {
          const item = this.sequence.definition.items[j]

          if (item.id === id || (this.sequence.definition.id + '#' + item.id) === id) {
            const node = Node.createCard(item, sequence)

            nodes.push(node)

            pushed = true
          }
        }

        if (pushed === false) {
          const node = this.sequence.resolveNode(id)

          if (node != null) {
            nodes.push(node)
          }
        }
      }

      return nodes
    }

    cardType () {
      return 'Comparison Branch'
    }

    static cardName () {
      return 'Comparison Branch'
    }

    setDefaultDestination (defaultId) {
      if (defaultId !== null) {
        this.definition.next_true = defaultId
      } else {
        delete this.definition.next_true
      }
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        type: 'comparison-operator',
        first_variable: 'variable-name',
        second_variable: 'variable-name',
        operator: 'comparison-operator',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('comparison-operator', ComparisonCardsNode)

  return ComparisonCardsNode
})
