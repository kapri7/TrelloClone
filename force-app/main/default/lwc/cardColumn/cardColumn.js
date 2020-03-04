/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, api, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class CardColumn extends LightningElement {
  @wire(CurrentPageReference) pageRef;

  @track cards = [];
  @api cardcolumnname;
  cardNum = 0;

  connectedCallback() {
    registerListener("draganddrop", this.handleDragAndDrop, this);
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

  handleDrop(evt) {
    const event = new CustomEvent('itemdrop', {
      detail: this.cardcolumnname
    });

    this.dispatchEvent(event);
  }

  handleDragAndDrop(info){
    if(info.targetColumn ===  this.cardcolumnname){
      this.cards.push(info.draggedCard.cardName);
      fireEvent(this.pageRef, "dragdropmenu", info);
    }
    else if(info.draggedCard.cardColumn === this.cardcolumnname && info.targetColumn !==  this.cardcolumnname){
      this.cards.splice(this.cards.indexOf(info.draggedCard.cardName), 1);
    }
  }

  addCardClick() {
    this.cards.push(this.cardNum);
    const newCardInfo = {
      cardColumn: this.cardcolumnname,
      cardName: this.cardNum
    };
    fireEvent(this.pageRef, "addcardclick", newCardInfo);
    this.cardNum++;
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