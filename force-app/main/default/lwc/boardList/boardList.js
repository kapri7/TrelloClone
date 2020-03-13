/**
 * Created by IvanSteniakin on 3/12/2020.
 */

import { LightningElement, track, wire } from "lwc";
import getAllDashboards from "@salesforce/apex/DashboardController.getAllDashboards";

class Dashboard {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

export default class BoardList extends LightningElement {
  @track boards = [];


  @wire(getAllDashboards)
  getDashboardInform(result) {
    if (result.data) {
      for (let i of result.data) {
        const dashboard = new Dashboard(i.Id, i.Name);
        this.boards.push(dashboard);

      }
    }
  }
}