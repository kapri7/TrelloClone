/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement, track } from "lwc";

export default class CardLayout extends LightningElement {
  @track cardRows = [];

  handleRowButtonClick() {
    this.cardRows.push("1");
  }
}