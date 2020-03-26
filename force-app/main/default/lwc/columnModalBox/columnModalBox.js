/**
 * Created by IvanSteniakin on 3/5/2020.
 */

import { LightningElement, track, wire, api } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";

export default class ColumnModalBox extends LightningElement {
  @track openModal;
  @track columnName = "";
  @wire(CurrentPageReference) pageRef;
  @api board;

  connectedCallback() {
    registerListener("showmodalcolumn", this.open, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleColumnNameChange(event) {
    this.columnName = event.target.value;
  }

  open(board) {
    if(this.board.id === board.id)
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
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