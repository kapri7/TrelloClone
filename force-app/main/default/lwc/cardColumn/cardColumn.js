/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, api, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import insertNewCard from "@salesforce/apex/CardController.insertNewCard";
import deleteCard from "@salesforce/apex/CardController.deleteCard";
import updateCard from "@salesforce/apex/CardController.updateCard";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import Id from "@salesforce/user/Id";


class Card {
  constructor(id, name, columnId, description = "", user = "") {
    this.id = id;
    this.name = name;
    this.columnId = columnId;
    this.description = description;
    this.user = user;
  }
}

export default class CardColumn extends LightningElement {

  @wire(CurrentPageReference) pageRef;

  @api googleFileCards;
  @track cards = [];
  @api columninfo;
  @api board;
  @api isMyTasks;
  @api combinedCards;
  connectedCallback() {
    registerListener("draganddrop", this.handleDragAndDrop, this);
    registerListener("addcardname", this.insertCard, this);
    registerListener("updatecardinfo", this.updateCardInfo, this);
    registerListener("addonlymycards", this.reExtractCards, this);
    this.fetchCards(1);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  reExtractCards(){
    this.fetchCards(this.isMyTasks);
  }
  fetchCards(isMyTasks) {
    let cardIds = [];//
    this.cards.length = 0;
    for (let i of this.combinedCards) {
      if (i.CardColumn__c === this.columninfo.id && !cardIds.includes(i.Id)) {
        if (!isMyTasks) {
          if (Id === i.User__c) {
            cardIds.push(i.Id);
            this.cards.push(new Card(i.Id, i.Name, i.CardColumn__c, i.Description__c, i.User__c));
          }
        } else {
          cardIds.push(i.Id);
          this.cards.push(new Card(i.Id, i.Name, i.CardColumn__c, i.Description__c, i.User__c));
        }

      }
    }
  }

  insertCardItem(newCard) {
    insertNewCard({ card: newCard })
      .then(result => {
        const card = new Card(result.Id, result.Name, result.CardColumn__c);
        this.cards.push(card);
      })
      .catch(error => {
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
        console.log("error", JSON.stringify(this.error));
      });
  }

  deleteCardItem(id, itemIndex) {
    deleteCard({ cardId: id })
      .then(result => {
        this.cards.splice(itemIndex, 1);
      })

      .catch(error => {
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
        console.log("error", JSON.stringify(this.error));
      });
  }

  updateCardItem(card, oldColumn = "") {
    updateCard({ cardId: card.Id, newCard: card })
      .then(result => {
        const ind = this.cards.findIndex((element, index, array) => {
          if (element.id === card.Id) {
            return true;
          }
        });
        fireEvent(this.pageRef, "updatecardname", this.cards[ind]);
        if (oldColumn !== "" && card.CardColumn__c !== oldColumn.id) {
          if (this.columninfo.id === oldColumn.id) {

            this.cards.splice(ind, 1);
          } else if (this.columninfo.id === card.CardColumn__c) {
            const info = {
              cardName: card.Name,
              destinationColumn: this.columninfo.name,
              startColumn: oldColumn.name
            };
            fireEvent(this.pageRef, "changecolumn", info);
            this.cards.push(new Card(card.Id, card.Name, card.CardColumn__c, card.Description__c, card.User__c));
          }
        }
      })

      .catch(error => {
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
        console.log("error", JSON.stringify(this.error));
      });
  }

  updateCardInfo(updatedCard) {

    const newCard = {
      Name: updatedCard.newCard.name,
      CardColumn__c: updatedCard.newCard.columnId,
      Description__c: updatedCard.newCard.description,
      Id: updatedCard.newCard.id,
      User__c: updatedCard.newCard.user
    };
    this.updateCardItem(newCard, updatedCard.oldColumn);
  }

  handleDragOver(evt) {
    evt.preventDefault();
  }

  handleItemDrag(evt) {
    const event = new CustomEvent("listitemdrag", {
      detail: evt.detail
    });

    this.dispatchEvent(event);
  }

  handleDrop() {
    const event = new CustomEvent("itemdrop", {
      detail: this.columninfo
    });

    this.dispatchEvent(event);
  }

  handleDragAndDrop(info) {
    info.draggedCard.card.columnId = info.targetColumn.id;

    const newCard = {
      Name: info.draggedCard.card.name,
      CardColumn__c: info.draggedCard.card.columnId,
      Description__c: info.draggedCard.card.description,
      Id: info.draggedCard.card.id,
      User__c: info.draggedCard.card.user
    };
    this.updateCardItem(newCard);

    if (this.isStartColumn(info)) {
      const ind = this.cards.findIndex((element, index, array) => {
        if (element.id === info.draggedCard.card.id) {
          return true;
        }
      });
      this.cards.splice(ind, 1);

    } else if (this.isTargetColumn(info)) {
      this.cards.push(info.draggedCard.card);
      fireEvent(this.pageRef, "dragdropmenu", info);
    }
  }

  isStartColumn(info) {
    return info.draggedCard.cardColumn.id === this.columninfo.id && info.targetColumn.id !== this.columninfo.id;
  }

  isTargetColumn(info) {
    return info.targetColumn.id === this.columninfo.id && info.draggedCard.cardColumn.id !== this.columninfo.id;
  }

  handleCard() {
    const info = {
      cardColumn: this.columninfo,
      board: this.board
    };
    fireEvent(this.pageRef, "showmodalcard", info);
  }

  insertCard(newCardInfo) {
    if (newCardInfo.cardColumn.id === this.columninfo.id) {

      const newCard = {
        Name: newCardInfo.cardName,
        CardColumn__c: this.columninfo.id,
        Description__c: "",
        User__c: ""
      };

      this.insertCardItem(newCard);
      fireEvent(this.pageRef, "addcardclick", newCardInfo);
    }

  }

  handleRemoveCard(event) {
    const ind = this.cards.findIndex((element, index, array) => {
      if (element.id === event.detail.id) {
        return true;
      }
    });
    this.deleteCardItem(event.detail.id, ind);
  }

  handleRemoveColumn() {
    const event = new CustomEvent("deletecolumn", {
      detail: this.columninfo
    });
    this.dispatchEvent(event);
  }
}