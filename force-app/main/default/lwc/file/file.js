/**
 * Created by IvanSteniakin on 4/10/2020.
 */

import { LightningElement, api } from "lwc";

export default class File extends LightningElement {
  @api file;

  handleSelectFile() {
    const event = new CustomEvent('selectfile', {
      detail: this.file
    });

    this.dispatchEvent(event);
  }
}