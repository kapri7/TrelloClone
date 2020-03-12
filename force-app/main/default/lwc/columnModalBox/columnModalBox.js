/**
 * Created by IvanSteniakin on 3/5/2020.
 */

import { LightningElement, track, wire, api } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";

export default class ColumnModalBox extends LightningElement {
  @track openModel;
  @track columnName = "";
  @wire(CurrentPageReference) pageRef;
  @api board;

  connectedCallback() {
    registerListener("showmodalcolumn", this.openModal, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleColumnNameChange(event) {
    this.columnName = event.target.value;
  }

  openModal(board) {
    if(this.board.id === board.id)
    this.openModel = true;
  }

  closeModal() {
    this.openModel = false;
    this.columnName = "";
  }

  saveMethod() {
    if (this.columnName !== "") {
      const columnInfo = {
        name: this.columnName,
        dashboard: this.board.id
      };
      fireEvent(this.pageRef, "addcolumnname", columnInfo);
      this.columnName = "";
      this.closeModal();
    }
  }
}