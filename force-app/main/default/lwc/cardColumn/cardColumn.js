/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, api, wire } from "lwc";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class CardColumn extends LightningElement {
  @wire(CurrentPageReference) pageRef;

  @track cards = [];
  @api cardcolumnname;
  cardNum = 0;

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

  handleRemoveColumn(){
    const event = new CustomEvent("deletecolumn", {
      detail: this.cardcolumnname
    });
    this.dispatchEvent(event);
  }
}