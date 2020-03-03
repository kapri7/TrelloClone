/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track, api, wire } from "lwc";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class CardRow extends LightningElement {
  @wire(CurrentPageReference) pageRef;

  @track cards = [];
  @api cardrowname;
  cardNum = 0;

  handleAddCard() {
    this.cards.push(this.cardNum);
    let newCardInfo = {
      cardRow: this.cardrowname,
      cardName: this.cardNum
    };
    fireEvent(this.pageRef, "addcardclick", newCardInfo);
    this.cardNum++;
  }

  handleRemoveCard(event) {
    this.cards.splice(this.cards.indexOf(event.detail), 1);
  }

  handleRemoveRow(){
    const event = new CustomEvent("deleterow", {
      detail: this.cardrowname
    });
    this.dispatchEvent(event);
  }
}