define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
  class ReponseContainsImageNode extends Node {
    cardFields () {
      return [{
        type: 'readonly',
        value: {
          en: 'Response DOES contain image:'
        },
        is_help: true,
        width: 8
      }, {
        field: 'has_image_action',
        type: 'card',
        width: 4
      }, {
        type: 'readonly',
        value: {
          en: 'Response DOES NOT contain image:'
        },
        is_help: true,
        width: 8
      }, {
        field: 'no_image_action',
        type: 'card',
        width: 4
      }]
    }

    viewBody () {
      let summary = ''

      summary += '<div class="mdc-typography--body1" style="margin: 16px;">'

      if (this.definition.has_image_action !== undefined) {
        summary += 'If last message included an image, go to ' + this.definition.has_image_action + '. '
      }

      if (this.definition.no_image_action !== undefined) {
        summary += 'If last message did not include an image, go to ' + this.definition.no_image_action + '. '
      }

      summary += '</div>'
      return summary
    }

    initialize () {
      super.initialize()

      this.initializeFields()
    }

    destinationNodes (sequence) {
      const nodes = super.destinationNodes()

      const nextIds = []

      if (this.definition.has_image_action !== undefined) {
        nextIds.push(this.definition.has_image_action)
      }

      if (this.definition.no_image_action !== undefined) {
        nextIds.push(this.definition.no_image_action)
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
      if (this.definition.has_image_action !== undefined) {
        if (this.definition.has_image_action === oldId) {
          this.definition.has_image_action = newId
        }
      }

      if (this.definition.no_image_action !== undefined) {
        if (this.definition.no_image_action === oldId) {
          this.definition.no_image_action = newId
        }
      }
    }

    cardType () {
      return 'Response Contains Image?'
    }

    static cardName () {
      return 'Response Contains Image?'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        type: 'response-contains-image',
        id: Node.uuidv4()
      }

      return card
    }
  }

  Node.registerCard('response-contains-image', ReponseContainsImageNode)
})
