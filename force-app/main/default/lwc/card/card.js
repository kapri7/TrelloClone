/**
 * Created by IvanSteniakin on 2/24/2020.
 */

import { LightningElement, api, wire } from "lwc";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class Card extends LightningElement {
  @api cardname;
  @wire(CurrentPageReference) pageRef;

  @api cardcolumnname;

  deleteCardClick() {
    const event = new CustomEvent("deletecardclick", {
      detail: this.cardname
    });
    this.dispatchEvent(event);
    let cardInfo = {
      cardName: this.cardname,
      cardColumn: this.cardcolumnname
    };
    fireEvent(this.pageRef, "deletecardclick", cardInfo);
  }

  itemDragStart() {
    const cardInfo = {
      cardName: this.cardname,
      cardColumn: this.cardcolumnname
    };
    const event = new CustomEvent('itemdrag', {
      detail: cardInfo
    });

    this.dispatchEvent(event);
  }


}