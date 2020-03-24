/**
 * Created by IvanSteniakin on 3/23/2020.
 */

import { api, LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import addUserToBoard from "@salesforce/apex/DashboardController.addUserToBoard";

export default class UsersOnBoard extends LightningElement {
  @track openModel;
  @wire(CurrentPageReference) pageRef;
  @api board;
  @track user;

  connectedCallback() {
    registerListener("showmodaluserboard", this.openModal, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }


  openModal(boardId) {
    if (this.board.id === boardId)
      this.openModel = true;
  }

  closeModal() {
    this.openModel = false;
  }

  handleUserChange(event) {
    this.user = event.target.value;
  }

  saveMethod() {
    if (this.user !== "") {
      this.closeModal();
      addUserToBoard({dashboardId:this.board.id,userID:this.user})
    }
  }
}