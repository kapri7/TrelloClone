/**
 * Created by IvanSteniakin on 3/26/2020.
 */

public with sharing class UserBoardController {
    @AuraEnabled
    public static UserBoard__c addUserToBoard(Id dashboardId,Id userID) {
        System.debug(JSON.serialize(dashboardId));
        UserBoard__c boardUser= new UserBoard__c();
        boardUser.User__c = userID;
        boardUser.Dashboard__c = dashboardId;
        boardUser.Name = 'default';
        insert boardUser;
        return boardUser;
    }

    @AuraEnabled
    public static List<UserBoard__c> getUserBoards(){
        return [SELECT Name,User__c,Dashboard__c FROM UserBoard__c];
    }

    @AuraEnabled
    public static void deleteUserBoard(Id userId, Id dashboardId){//deletes all duplicates too(if available)
        List<UserBoard__c> userBoards = [SELECT User__c,Dashboard__c FROM UserBoard__c WHERE Dashboard__c =: dashboardId AND User__c =: userId];
        delete userBoards;
    }
}