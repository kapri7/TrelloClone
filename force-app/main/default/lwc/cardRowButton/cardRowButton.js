/**
 * Created by IvanSteniakin on 2/27/2020.
 */

import { LightningElement, wire, api } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent } from "c/pubsub";

export default class CardRowButton extends LightningElement {

  @wire(CurrentPageReference) pageRef;
  @api cardrowname;

  addCardRowClick() {
    const event = new CustomEvent("addcardrowclick", {
      detail: this.cardrowname
    });
    this.dispatchEvent(event);
    fireEvent(this.pageRef, "addcardrowclick", this.cardrowname);
  }
}