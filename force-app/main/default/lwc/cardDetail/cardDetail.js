/**
 * Created by IvanSteniakin on 3/10/2020.
 */

import { LightningElement, api, track, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class CardDetail extends LightningElement {
  @track card;
  @track openModal;
  @wire(CurrentPageReference) pageRef;
  previousColumn;
  @api board;
  handleSuccess(event) {

  }

  connectedCallback() {
    registerListener("cardinfoclick", this.handleCardInfoClick, this);

  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleCardInfoClick(cardInfo) {
    if (cardInfo.cardColumn.board === this.board.id) {
      this.openModal = true;
      this.card = cardInfo.card;
      this.previousColumn = cardInfo.cardColumn;
    }
  }

  closeModal() {
    this.openModal = false;
  }

  saveMethod() {
    const updatedCard = {
      newCard: this.card,
      oldColumn: this.previousColumn
    };

    fireEvent(this.pageRef, "updatecardinfo", updatedCard);
    this.openModal = false;
  }

  handleNameChange(event) {
    this.card.name = event.target.value;
  }

  handleCardColumnChange(event) {
    this.card.columnId = event.target.value;
  }

  handleDescriptionChange(event) {
    this.card.description = event.target.value;
  }

  handleUserChange(event){
    this.card.user = event.target.value;
  }
}