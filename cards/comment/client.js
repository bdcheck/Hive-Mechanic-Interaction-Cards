define(['material', 'cards/node', 'marked', 'purify', 'jquery'], function (mdc, Node, marked, purify) {
  class CommentNode extends Node {
    cardIcon () {
      return '<i class="fas fa-sticky-note" style="margin-right: 16px; font-size: 20px; "></i>'
    }

    cardFields () {
      return [{
        field: 'comment',
        type: 'readonly',
        style: 'body1',
        value: {
          en: purify.sanitize(marked.parse(this.definition.comment))
        },
        add_class: this.definition.id + '_view_comment'
      }, {
        field: 'next_field',
        type: 'readonly',
        value: {
          en: 'Next:'
        },
        width: 7,
        is_help: true
      }, {
        field: 'next',
        type: 'card',
        width: 5
      }]
    }

    updateCommentDisplay (commentText) {
      $('.' + this.definition.id + '_view_comment').html('<div>' + purify.sanitize(marked.parse(commentText)) + '</div>')

      super.updateCommentDisplay(commentText)
    }

    style () {
      return 'background-color: #FDFEDE; margin-bottom: 10px;'
    }

    readOnlyStyle () {
      return 'background-color: #FDFEDE;'
    }

    showComment () {
      return false
    }

    viewBody () {
      return '<div class="mdc-typography--body1" style="margin: 16px;">Comment: ' + purify.sanitize(marked.parse(this.definition.comment)) + '</div>'
    }

    initialize () {
      super.initialize()

      this.initializeFields()
    }

    issues (sequence) {
      const issues = super.issues(sequence)

      if (this.definition.comment === undefined || this.definition.comment.trim().length === 0) {
        issues.push(['No comment provided.', 'node', this.definition.id])
      }

      if (this.definition.next === undefined || this.definition.next === null || this.definition.next.trim().length === 0) {
        issues.push(['No next destination node selected.', 'node', this.definition.id])
      }

      return issues
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

        if (node != null) {
          nodes.push(node)
        } else {
          console.log('comment.js: Unable to resolve ' + id + ' SEQ: ' + this.sequence.definition.id)

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
      return 'Editor\'s Note'
    }

    static cardName () {
      return 'Editor\'s Note'
    }

    static createCard (cardName) {
      const card = {
        name: cardName,
        context: '(Context goes here...)',
        comment: 'To edit this note-to-self, use the three dots at top right and edit the card comment. (All other cards also have "comment" abilities too, by the way!)',
        type: 'comment',
        id: Node.uuidv4(),
        next: null
      }

      return card
    }
  }

  Node.registerCard('comment', CommentNode)

  return CommentNode
})
