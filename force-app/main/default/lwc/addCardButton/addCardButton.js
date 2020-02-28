/**
 * Created by IvanSteniakin on 2/27/2020.
 */

import { LightningElement, wire,api } from "lwc";
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class AddCardButton extends LightningElement {
  @wire(CurrentPageReference) pageRef;
  @api cardrow;
  addCardClick() {
    const event = new CustomEvent('addcardclick', {
      //detail: this.cards
    });
    this.dispatchEvent(event);
    fireEvent(this.pageRef, 'addcardclick',this.cardrow);
  }
}