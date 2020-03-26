/**
 * Created by IvanSteniakin on 3/26/2020.
 */

import { LightningElement, api } from "lwc";

export default class UserBoard extends LightningElement {
  @api userBoard;

  handleRemoveUser() {
    this.dispatchEvent(new CustomEvent("deleteuserfromboard", { detail: this.userBoard }));
  }
}