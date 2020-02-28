/**
 * Created by IvanSteniakin on 2/25/2020.
 */

import { LightningElement,track,api } from "lwc";

export default class CardRow extends LightningElement {
   @track cards = [];
   @api cardrowname;

   handleButtonClick(){
      this.cards.push('1');
   }
}