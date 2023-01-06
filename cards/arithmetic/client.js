define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class ArithmeticNode extends Node {
    constructor (definition, sequence) {
      super(definition, sequence)
      this.nextCardFields = ['next', 'next_error']
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
            en: 'Input #1'
          }
        }, {
          field: 'operator',
          type: 'choice',
          label: {
            en: 'Operator'
          },
          options: [{
            value: 'addition',
            label: {
              en: 'Addition (+)'
            }
          }, {
            value: 'subtraction',
            label: {
              en: 'Subtraction (-)'
            }
          }, {
            value: 'multiplication',
            label: {
              en: 'Multiplication (*)'
            }
          },
          {
            value: 'division',
            label: {
              en: 'Division (/)'
            }
          }]
        },
        {
          field: 'second_variable',
          type: 'text',
          multiline: false,
          label: {
            en: 'Input #2'
          }
        },
        {
          field: 'variable_to_save',
          type: 'text',
          multiline: false,
          label: {
            en: 'Destination variable'
          }
        },
        {
          field: 'next_desc',
          type: 'readonly',
          value: {
            en: 'Next Card'
          },
          width: 7
        },
        {
          field: 'next',
          type: 'card',
          width: 5
        },
        {
          field: 'next_error_desc',
          type: 'readonly',
          value: {
            en: 'OPTIONAL: Evaluation encountered an error'
          },
          width: 7
        },
        {
          field: 'next_error',
          type: 'card',
          width: 5
        },
        {
          field: 'description',
          type: 'readonly',
          value: {
            en: 'Evaluates an arithmetic operation'
          },
          width: 7,
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
        issues.push(['Arithmetic operator was not provided.', 'node', this.definition.id, this.cardName()])
      }
      if (this.definition.variable_to_save === undefined || this.definition.variable_to_save.trim().length === 0) {
        issues.push(['Variable name to save was not provided.', 'node', this.definition.id, this.cardName()])
      }
      if (this.definition.next === undefined || this.definition.next === null || this.definition.next.trim().length === 0) {
        issues.push(['No setup if statement evaluates to true destination node selected.', 'node', this.definition.id, this.cardName()])
      }

      return issues
    }

    updateReferences (oldId, newId) {
      for (const item of this.nextCardFields) {
        if (this.definition[item] === oldId) {
          this.definition[item] = newId

          if (newId === null) {
            console.log('arithmetic-variable.js: Unable to resolve ' + oldId + ' SEQ: ' + this.sequence.definition.id)

            delete this.definition[item]
          }
          break
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

          if (node !== null) {
            nodes.push(node)
          }
        }
      }

      return nodes
    }

    cardType () {
      return 'arithmetic-operator'
    }

    static cardName () {
      return 'Arithmetic Operator'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        type: 'arithmetic-operator',
        first_variable: 'variable-name',
        second_variable: 'variable-name',
        operator: 'arithmetic-operator',
        variable_to_save: 'variable-name',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('arithmetic-operator', ArithmeticNode)

  return ArithmeticNode
})
