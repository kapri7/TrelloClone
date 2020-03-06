/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, api, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import getAllCards from "@salesforce/apex/CardController.getAllCards";
import insertNewCard from "@salesforce/apex/CardController.insertNewCard";
import LOG_OBJECT from "@salesforce/schema/Card__c";
import NAME_FIELD from "@salesforce/schema/Card__c.Name";
import ID_FIELD from "@salesforce/schema/Card__c.Id";
import CARDCOLUMN_FIELD from "@salesforce/schema/Card__c.CardColumn__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class CardColumn extends LightningElement {
  @track name = NAME_FIELD;
  @track id = ID_FIELD;
  @track cardcolumn = CARDCOLUMN_FIELD;

  rec = {//todo: add description later
    Name: this.name,
    //Id: this.id,
    CardColumn__c: this.cardcolumn
  };

  @wire(getAllCards)
  getColumnInform(result) {
    if (result.data) {
      for (let i of result.data) {
        this.id = i.Id;// ?
        if(i.CardColumn__c === this.cardcolumnid)
        this.cards.push(i.Name);
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
          //this.rec.Id = "";

          this.id = result.Id;
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "Card created",
              variant: "success"
            })
          );
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

  @wire(CurrentPageReference) pageRef;

  @track cards = [];
  @api cardcolumnname;
  @api cardcolumnid;

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
      detail: this.cardcolumnname
    });

    this.dispatchEvent(event);
  }

  handleDragAndDrop(info) {
    if (info.draggedCard.cardColumn === this.cardcolumnname && info.targetColumn !== this.cardcolumnname) {
      this.cards.splice(this.cards.indexOf(info.draggedCard.cardName), 1);
    } else if (info.targetColumn === this.cardcolumnname && info.draggedCard.cardColumn !== this.cardcolumnname) {
      this.cards.push(info.draggedCard.cardName);
      fireEvent(this.pageRef, "dragdropmenu", info);
    }
  }

  handleCardClick() {
    fireEvent(this.pageRef, "showmodalcard", this.cardcolumnname);

  }

  addCard(newCardInfo) {
    if (newCardInfo.cardColumn === this.cardcolumnname) {
      this.rec.Name = newCardInfo.cardName;
      this.rec.CardColumn__c = this.cardcolumnid;
      this.insertCardItem();
      this.cards.push(newCardInfo.cardName);
      fireEvent(this.pageRef, "addcardclick", newCardInfo);
    }

  }

  handleRemoveCard(event) {
    this.cards.splice(this.cards.indexOf(event.detail), 1);
  }

  handleRemoveColumn() {
    const event = new CustomEvent("deletecolumn", {
      detail: this.cardcolumnname
    });
    this.dispatchEvent(event);
  }
}