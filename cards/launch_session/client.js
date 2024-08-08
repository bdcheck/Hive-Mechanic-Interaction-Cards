/*
 * Loads the necessary modules required for operation.
 *
 * material: Material Design for the Web (MDC-Web). Provides UI elements used in the
 *           construction of card interfaces.
 *
 * cards/node: Card node base class. Hive Mechanic class that provides the commonly-used
 *             elements for all cards, including basic layout, lifecycle management,
 *             change tracking, and more.
 *
 * jquery: jQuery JavaScript library providing various utility functions.
 */

define(['material', 'cards/node', 'jquery'], function (mdc, Node) {
    class LaunchSessionNode extends Node {
      /*
       * Static class method for creating a new card with a definition from the template
       * provided below.
       */

      static createCard (cardName) {
        const card = {
          name: cardName,
          player: '',
          activity: '',
          type: 'launch-session',
          id: Node.uuidv4()
        }

        return card
      }

      viewBody () {
        return `<div class="mdc-typography--body1" style="margin: 16px;">Start new session of "${this.definition.activity}" for ${this.definition.player}.</div>`
      }

      /*
       * Defines human-readable card name and card type.
       * (TODO: Check if this can be simplified to one method...)
       */

      static cardName () {
        return 'Launch Session'
      }

      cardType () {
        return 'Launch Session'
      }

      /*
       * Provides HTML necessary to populate the card icon portion of the interface.
       */

      cardIcon () {
        return '<i class="fas fa-code-branch" style="margin-right: 16px; font-size: 20px; "></i>'
      }

      /*
       * Provides the HTML content for use in view-only contexts where the card's
       * function can be summarized, primarily source and destination lists in the UI.
       */


      cardFields () {
        return [{
          field: 'activity',
          type: 'choice',
          label: {
            en: 'Activity'
          },
          options: '/builder/activity-options.json'
        }, {
            field: 'player',
            type: 'text',
            multiline: false,
            label: {
              en: 'Player'
            }
        }, {
          type: 'readonly',
          value: {
            en: 'Next:'
          },
          width: 8
        }, {
          field: 'next',
          type: 'card',
          width: 4
        }]
      }

      /*
       * "Wires up" the editable HTML content so that changes and updates are reflected
       * in the user interface.
       *
       * This is a separate function than <code>editBody</code>, given that the UI
       * elements cannot be activated until <em>after</em> they are embedded in the
       * browser's HTML DOM.
       */

      initialize () {
        super.initialize()

        this.initializeFields()
      }

      /*
       * Provides a list of destination nodes that this node can lead to, depending on
       * the relevant interaction sequence.
       *
       * Indirectly used by <code>Node.sourceNodes</code> to <em>also</em> generate a
       * list of source nodes as well.
       */

      destinationNodes (sequence) {
        const nodes = super.destinationNodes()

        const nextIds = []

        if (this.definition.next !== undefined) {
          if (nextIds.indexOf(this.definition.next) === -1) {
            nextIds.push(this.definition.next)
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

      /*
       * In the event that a referenced node identifier is updated elsewhere, replaces
       * instances of the old node ID with the new node ID so that users do not have to
       * reconnect nodes after an ID change.
       */

      updateReferences (oldId, newId) {
        if (this.definition.next !== undefined) {
          if (this.definition.next === oldId) {
            this.definition.next = newId

            if (newId === null) {
              delete this.definition.next
            }
          }
        }
      }

      setDefaultDestination (defaultId) {
        this.definition.next = defaultId

        if (defaultId === null) {
          delete this.definition.next
        }
      }

      /*
       * Identifies any outstanding issues with the configuration of the node that might
       * impair expected operation. Used to populate the warning issues list when saving
       * the activity.
       */

      issues (sequence) {
        const issues = super.issues(sequence)

        if (this.definition.next === undefined || this.definition.next.trim().length === 0) {
          issues.push(['No "next" action provided.', 'node', this.definition.id, this.cardName()])
        }

        return issues
      }
    }

    /*
     * Registers with the overall system that this card type is ready for use.
     */

    Node.registerCard('launch-session', LaunchSessionNode)
  })
