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
  handleSuccess(event) {
   // this.contactId = event.detail.id;
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

  }

  closeModal(){
    this.openModel = false;
  }
  saveMethod(){
    fireEvent(this.pageRef,"updatecardinfo",this.card);
    this.openModel = false;
  }
  handlerNameChange(event){
    this.card.name = event.target.value;
  }
  handlerCardColumnChange(event){
    this.card.columnId = event.target.value;
  }
  handlerDescriptionChange(event){
    this.card.description = event.target.value;
  }
}