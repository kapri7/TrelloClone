/**
 * Created by IvanSteniakin on 3/12/2020.
 */

import { LightningElement, track, wire } from "lwc";
import getAllLogItems from "@salesforce/apex/LogItemController.getAllLogItems";
import deleteDashboard from "@salesforce/apex/DashboardController.deleteDashboard";
import updateDashboard from "@salesforce/apex/DashboardController.updateDashboard";
import getUserBoards from "@salesforce/apex/UserBoardController.getUserBoards";
import getAllData from "@salesforce/apex/TrelloController.getAllData";
import getGoogleFileCards from "@salesforce/apex/GoogleFileCardController.getGoogleFileCards";
import getGoogleFiles from "@salesforce/apex/GoogleDriveController.getGoogleFiles";
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
import Id from "@salesforce/user/Id";
import { CurrentPageReference } from "lightning/navigation";

export class Dashboard {
  constructor(id, name, description = "") {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export default class BoardList extends LightningElement {
  @track boards = [];
  @wire(CurrentPageReference) pageRef;
  @track combinedCardList;
  @track googleFileCards;
  @track googleFiles;
  logItems = [];
  connectedCallback() {
    this.getAll();
    registerListener("updateboardinfo", this.updateBoard, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  getAll() {
    getAllData()
      .then(result => {
        console.log(result);
        this.googleFileCards = result['GoogleFileCard'];
        console.log(this.googleFileCards);
        this.googleFiles = result['ItemsGoogleDrive'];
        console.log(this.googleFiles);
        this.logItems = result['LogItem'];
        console.log(this.logItems);
        this.combinedCardList = result['CardColumnDashboard'];
        console.log(this.combinedCardList);
        this.extractBoards(this.combinedCardList);
      });
  }

  extractBoards(combined) {
    let boardIds = [];
    let boards =[];
    for (let i of combined) {
      if (!boardIds.includes(i.CardColumn__r.Dashboard__c)) {
        boardIds.push(i.CardColumn__r.Dashboard__c);
        boards.push(new Dashboard(i.CardColumn__r.Dashboard__c, i.CardColumn__r.Dashboard__r.Name, i.CardColumn__r.Dashboard__r.Description__c));
      }
    }

    getUserBoards()
      .then(userBoards => {
        for (let board of boards) {
          for (let userboard of userBoards) {
            if (board.id === userboard.Dashboard__c && userboard.User__c === Id) {
              const dashboard = new Dashboard(board.id, board.name, board.description);
              this.boards.push(dashboard);
              break;
            }
          }
        }
      });

  }

  updateBoard(newBoard) {
    const boardToUpdate = {
      Name: newBoard.name,
      Description__c: newBoard.description,
      Id: newBoard.id
    };
    updateDashboard({ newDashboard: boardToUpdate })
      .then(result => {
        const ind = this.boards.findIndex((element, index, array) => {
          if (element.id === result.Id) {
            return true;
          }
        });
        this.boards[ind].name = result.Name;
        this.boards[ind].description = result.Description__c;

        //this.boards.length = 0;
        //this.getDashboardInform();
      });


  }

  handleNewBoard(event) {
    const board = new Dashboard(event.detail.Id, event.detail.Name);
    this.boards.push(board);
  }

  handleDeleteBoard(event) {
    deleteDashboard({ dashboardId: event.detail })
      .then(result => {
        const ind = this.boards.findIndex((element, index, array) => {
          if (element.id === event.detail) {
            return true;
          }
        });
        this.boards.splice(ind, 1);
      });
  }
}