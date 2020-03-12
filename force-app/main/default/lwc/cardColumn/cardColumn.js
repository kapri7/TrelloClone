/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, api, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import getAllCards from "@salesforce/apex/CardController.getAllCards";
import insertNewCard from "@salesforce/apex/CardController.insertNewCard";
import deleteCard from "@salesforce/apex/CardController.deleteCard";
import updateCard from "@salesforce/apex/CardController.updateCard";
import { ShowToastEvent } from "lightning/platformShowToastEvent";


class Card {
  constructor(id, name, columnId, description = "") {
    this.id = id;
    this.name = name;
    this.columnId = columnId;
    this.description = description;
  }
}

export default class CardColumn extends LightningElement {

  @wire(CurrentPageReference) pageRef;

  @track cards = [];
  @api columninfo;
  @api board;
  connectedCallback() {
    registerListener("draganddrop", this.handleDragAndDrop, this);
    registerListener("addcardname", this.insertCard, this);
    registerListener("updatecardinfo", this.updateCardInfo, this);
    this.handleActive();
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }
  handleActive(){
    getAllCards()
      .then(result => {
        for (let i of result) {
          if (i.CardColumn__c === this.columninfo.id) {
            const card = new Card(i.Id, i.Name, i.CardColumn__c, i.Description__c);
            this.cards.push(card);
          }

        }
      })
  }

  /*
  @wire(getAllCards)
  getCardInform(result) {
    if (result.data) {
      for (let i of result.data) {
        if (i.CardColumn__c === this.columninfo.id) {
          const card = new Card(i.Id, i.Name, i.CardColumn__c, i.Description__c);
          this.cards.push(card);
        }

      }
    }
  }*/

  insertCardItem(newCard) {
    insertNewCard({ card: newCard })
      .then(result => {
        const card = new Card(result.Id, result.Name, result.CardColumn__c);
        this.cards.push(card);
        //console.log(JSON.stringify(result));
        //console.log("result", this.message);
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
        //console.log(JSON.stringify(result));
        //console.log("result", this.message);
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
            this.cards.push(new Card(card.Id, card.Name, card.CardColumn__c, card.Description__c));
          }
        }
        // console.log(JSON.stringify(result));
        // console.log("result", this.message);
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
      Id: updatedCard.newCard.id
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
      Id: info.draggedCard.card.id
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
      board : this.board
    };
    fireEvent(this.pageRef, "showmodalcard", info);
  }

  insertCard(newCardInfo) {
    if (newCardInfo.cardColumn.id === this.columninfo.id) {

      const newCard = {
        Name: newCardInfo.cardName,
        CardColumn__c: this.columninfo.id,
        Description__c: ""
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