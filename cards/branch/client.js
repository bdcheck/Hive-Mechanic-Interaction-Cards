define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class BranchNode extends Node {
    initialize () {
      super.initialize()

      this.initializeFields()
    }

    destinationNodes (sequence) {
      const nodes = super.destinationNodes()

      const nextIds = []

      for (let i = 0; i < this.definition.branches.length; i++) {
        const branch = this.definition.branches[i]

        if (nextIds.indexOf(branch.action) === -1) {
          nextIds.push(branch.action)
        }
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

    updateReferences (oldId, newId) {
      for (let i = 0; i < this.definition.branches.length; i++) {
        const branch = this.definition.branches[i]

        if (branch.action === oldId) {
          branch.action = newId

          if (newId === null) {
            delete branch.action
          }
        }
      }
    }

    setDefaultDestination (defaultId) {
      this.definition.branches.append({
        action: defaultId
      })
    }

    /* Error / validity checking */
    issues (sequence) {
      const issues = super.issues(sequence)

      for (let i = 0; i < this.definition.branches.length; i++) {
        const branch = this.definition.branches[i]

        if (branch.action === undefined || branch.action.trim().length === 0) {
          issues.push(['No action provided for branch "' + (i + 1) + '".', 'node', this.definition.id, this.cardName()])
        }
      }

      if (this.definition.branches.length === 0) {
        issues.push(['No branches defined.', 'node', this.definition.id, this.cardName()])
      }

      return issues
    }

    cardType () {
      return 'Branch'
    }

    viewBody () {
      let summary = ''

      for (let i = 0; i < this.definition.branches.length; i++) {
        const branch = this.definition.branches[i]

        if (branch.action !== undefined) {
          summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + (i + 1) + '. ' + this.lookupCardName(branch.action) + '</div>'
        } else {
          summary += '<div class="mdc-typography--body1" style="margin: 16px;">' + (i + 1) + '. ' + this.fetchLocalizedConstant('no_action_defined') + '</div>'
        }
      }

      return summary
    }

    addTerms (terms) {
      terms.no_action_defined = {
        en: 'No action defined&#8230;'
      }
    }

    cardIcon () {
      return '<i class="fas fa-code-branch" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      return [{
        field: 'mode',
        type: 'choice',
        label: {
          en: 'Mode'
        },
        options: [{
          value: 'random',
          label: {
            en: 'Random'
          }
        }, {
          value: 'random-no-repeat',
          label: {
            en: 'Random (No Repeat)'
          }
        }, {
          value: 'sequential',
          label: {
            en: 'Sequential'
          }
        }],
        width: 6
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
        }],
        width: 6
      }, {
        field: 'branches',
        type: 'list',
        label: {
          en: 'Patterns'
        },
        template: [{
          type: 'readonly',
          value: {
            en: 'Branch'
          },
          width: 8
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
          en: 'Add Branch'
        }
      }]
    }

    static cardName () {
      return 'Branch'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        scope: 'game',
        mode: 'sequential',
        branches: [{}, {}],
        type: 'branch',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('branch', BranchNode)

  return BranchNode
})
