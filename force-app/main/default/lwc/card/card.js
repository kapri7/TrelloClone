/**
 * Created by IvanSteniakin on 2/24/2020.
 */

import { LightningElement, api, wire } from "lwc";
import { fireEvent,registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class Card extends LightningElement {
  @api card;
  @wire(CurrentPageReference) pageRef;
  @api board;
  @api cardColumn;
  @api googleFileCards;
  connectedCallback() {
    registerListener("updatecardname", this.handleUpdateCardName, this);
  }
  handleUpdateCardName(card){
    if(this.card.id === card.id)
    this.card = card;
  }
  disconnectedCallback() {
    unregisterAllListeners(this);
  }
  deleteCard() {
    const event = new CustomEvent("deletecardclick", {
      detail: this.card
    });
    this.dispatchEvent(event);
    const cardInfo = {
      card: this.card,
      cardColumn: this.cardColumn
    };
    fireEvent(this.pageRef, "deletecardclick", cardInfo);
  }

  itemDragStart() {
    const cardInfo = {
      card: this.card,
      cardColumn: this.cardColumn
    };
    const event = new CustomEvent('itemdrag', {
      detail: cardInfo
    });

    this.dispatchEvent(event);
  }

  selectCardInfo(){
    const cardInfo = {
      card: this.card,
      cardColumn: this.cardColumn
    };
    fireEvent(this.pageRef, "cardinfoclick", cardInfo);
  }


}