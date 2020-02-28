/**
 * Created by IvanSteniakin on 2/27/2020.
 */

import { LightningElement, wire } from "lwc";
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class CardRowButton extends LightningElement {

  @wire(CurrentPageReference) pageRef;

  addCardRowClick() {
    const event = new CustomEvent('addcardrowclick', {
      //detail: this.cards
    });
    this.dispatchEvent(event)
    fireEvent(this.pageRef, 'addcardrowclick', 'result.data');
  }
}