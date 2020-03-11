/**
 * Created by IvanSteniakin on 3/10/2020.
 */

import { LightningElement, api, track, wire } from "lwc";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class CardDetail extends LightningElement {
  @track card;
  @track openModel;
  @wire(CurrentPageReference) pageRef;
  previousColumnId;
  handleSuccess(event) {

  }
  connectedCallback() {
    registerListener("cardinfoclick", this.handleCardInfoClick, this);

  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }
  handleCardInfoClick(cardInfo){
    this.openModel = true;
    this.card = cardInfo.card;
    this.previousColumn = cardInfo.cardColumn;

  }

  closeModal(){
    this.openModel = false;
  }
  saveMethod(){
    const updatedCard= {
      newCard:this.card,
      oldColumn: this.previousColumn
    };

    fireEvent(this.pageRef,"updatecardinfo",updatedCard);
    this.openModel = false;
  }
  handleNameChange(event){
    this.card.name = event.target.value;
  }
  handleCardColumnChange(event){
    this.card.columnId = event.target.value;
  }
  handleDescriptionChange(event){
    this.card.description = event.target.value;
  }
}