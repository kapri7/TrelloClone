/**
 * Created by IvanSteniakin on 3/18/2020.
 */

import { api, LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";

export default class BoardDetail extends LightningElement {

  @track openModel;
  @wire(CurrentPageReference) pageRef;
  @api board;
  handleSuccess(event) {

  }

  connectedCallback() {
    registerListener("boardinfoclick", this.handleBoardInfoClick, this);

  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleBoardInfoClick(board) {
    if (board.id === this.board.id) {
      this.openModel = true;
    }
  }

  closeModal() {
    this.openModel = false;
  }

  saveMethod() {
    fireEvent(this.pageRef, "updateboardinfo", this.board);
    this.closeModal()
  }

  handleNameChange(event) {
    this.board.name = event.target.value;
  }


  handleDescriptionChange(event) {
    this.board.description = event.target.value;
  }
}