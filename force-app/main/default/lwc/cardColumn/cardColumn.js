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
import LOG_OBJECT from "@salesforce/schema/Card__c";
import NAME_FIELD from "@salesforce/schema/Card__c.Name";
import ID_FIELD from "@salesforce/schema/Card__c.Id";
import CARDCOLUMN_FIELD from "@salesforce/schema/Card__c.CardColumn__c";
import DESCRIPTION_FIELD from "@salesforce/schema/Card__c.Description__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";


class Card {
  constructor(id, name, columnId) {
    this.id = id;
    this.name = name;
    this.columnId = columnId;
  }
}

export default class CardColumn extends LightningElement {
  @track name = NAME_FIELD;
  @track id = ID_FIELD;
  @track cardcolumn = CARDCOLUMN_FIELD;
  @track description = DESCRIPTION_FIELD;

  rec = {
    Name: this.name,
    CardColumn__c: this.cardcolumn,
    Description__c: this.description
  };

  @wire(getAllCards)
  getCardInform(result) {
    if (result.data) {
      for (let i of result.data) {
        this.id = i.Id;
        if (i.CardColumn__c === this.columninfo.id) {
          let card = new Card(i.Id, i.Name, i.CardColumn__c);
          this.cards.push(card);
        }

      }
    }
  }

  insertCardItem() {
    insertNewCard({ card: this.rec })
      .then(result => {
        this.message = result;
        this.error = undefined;
        if (this.message !== undefined) {
          this.rec.Name = "";
          this.rec.CardColumn__c = "";
          this.rec.Description__c = "";
        }

        console.log(JSON.stringify(result));
        console.log("result", this.message);
      })
      .catch(error => {
        this.message = undefined;
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
        console.log(JSON.stringify(result));
        console.log("result", this.message);
      })

      .catch(error => {
        this.message = undefined;
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

  updateCardItem(id) {
    updateCard({ cardId: id, newCard: this.rec })
      .then(result => {
        this.rec.Name = "";
        this.rec.CardColumn__c = "";
        this.rec.Description__c = "";
        console.log(JSON.stringify(result));
        console.log("result", this.message);
      })

      .catch(error => {
        this.message = undefined;
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

  @wire(CurrentPageReference) pageRef;

  @track cards = [];
  @api columninfo;

  connectedCallback() {
    registerListener("draganddrop", this.handleDragAndDrop, this);
    registerListener("addcardname", this.addCard, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
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
    this.rec.Name = info.draggedCard.card.name;
    this.rec.CardColumn__c = info.draggedCard.card.columnId;
    this.rec.Description__c = "";

    this.updateCardItem(info.draggedCard.card.id);

    if (info.draggedCard.cardColumn.id === this.columninfo.id && info.targetColumn.id !== this.columninfo.id) {
      let ind = this.cards.findIndex((element, index, array) => {
        if (element.id === info.draggedCard.card.id) {
          return true;
        }
      });
      this.cards.splice(ind, 1);
    } else if (info.targetColumn.id === this.columninfo.id && info.draggedCard.cardColumn.id !== this.columninfo.id) {
      this.cards.push(info.draggedCard.card);
      fireEvent(this.pageRef, "dragdropmenu", info);
    }
  }

  handleCardClick() {
    fireEvent(this.pageRef, "showmodalcard", this.columninfo);

  }

  addCard(newCardInfo) {
    if (newCardInfo.cardColumn.id === this.columninfo.id) {
      this.rec.Name = newCardInfo.cardName;
      this.rec.CardColumn__c = this.columninfo.id;
      this.insertCardItem();
      let card = new Card(this.id, newCardInfo.cardName, this.columninfo.id);
      this.cards.push(card);
      fireEvent(this.pageRef, "addcardclick", newCardInfo);
    }

  }

  handleRemoveCard(event) {
    let ind = this.cards.findIndex((element, index, array) => {
      if (element.id === event.detail.id) {
        return true;
      }
    });
    this.deleteCardItem(event.detail.id, ind);
    //this.cards.splice(ind, 1);
  }

  handleRemoveColumn() {
    const event = new CustomEvent("deletecolumn", {
      detail: this.columninfo
    });
    this.dispatchEvent(event);
  }
}