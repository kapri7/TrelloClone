/**
 * Created by IvanSteniakin on 4/9/2020.
 */

import { LightningElement, api } from "lwc";

export default class GoogleFileCard extends LightningElement {
  @api googleFile;

  handleRemoveFile() {
    this.dispatchEvent(new CustomEvent("deletefilefromboard", { detail: this.googleFile }));
  }
}