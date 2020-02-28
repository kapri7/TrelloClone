/**
 * Created by IvanSteniakin on 2/27/2020.
 */

import { LightningElement, api } from "lwc";

export default class ActionItem extends LightningElement {
  @api
  actionitem;

  @api
  today;
}