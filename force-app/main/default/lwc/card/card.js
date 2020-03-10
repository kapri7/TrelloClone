/**
 * Created by IvanSteniakin on 2/24/2020.
 */

import { LightningElement, api, wire } from "lwc";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class Card extends LightningElement {
  @api card;
  @wire(CurrentPageReference) pageRef;

  @api cardcolumn;

  deleteCardClick() {
    const event = new CustomEvent("deletecardclick", {
      detail: this.card
    });
    this.dispatchEvent(event);
    let cardInfo = {
      card: this.card,
      cardColumn: this.cardcolumn
    };
    fireEvent(this.pageRef, "deletecardclick", cardInfo);
  }

  itemDragStart() {
    const cardInfo = {
      card: this.card,
      cardColumn: this.cardcolumn
    };
    const event = new CustomEvent('itemdrag', {
      detail: cardInfo
    });

    this.dispatchEvent(event);
  }


}