/**
 * Created by IvanSteniakin on 3/5/2020.
 */

import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";

export default class ColumnModalBox extends LightningElement {
  @track openModel;
  @track columnName = "";
  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    registerListener("showmodalcolumn", this.openModal, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleColumnNameChange(event) {
    this.columnName = event.target.value;
  }

  openModal() {
    this.openModel = true;
  }

  closeModal() {
    this.openModel = false;
  }

  saveMethod() {
    if (this.columnName !== "") {

      fireEvent(this.pageRef, "addcolumnname", this.columnName);
      this.columnName = "";
      this.closeModal();
    }
  }
}