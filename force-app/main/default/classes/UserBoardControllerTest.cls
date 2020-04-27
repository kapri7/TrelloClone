/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class UserBoardControllerTest {
    static final Integer recordsNumber = 5;

    @TestSetup
    static void setup() {
        List<Dashboard__c> dashboards = new List<Dashboard__c>();
        for (Integer i = 0; i < recordsNumber; i++) {
            dashboards.add(new Dashboard__c(Name = 'TestDashboard' + i.format()));
        }
        insert dashboards;

        List<UserBoard__c> userBoards = new List<UserBoard__c>();
        for (Integer i = 0; i < recordsNumber; i++) {
            userBoards.add(new UserBoard__c(Name = 'Test' + i.format(),
                    Dashboard__c = dashboards[i].Id, User__c = '0053X00000BlcrsQAB'));
        }
        insert userBoards;
    }

    @IsTest
    static void testAddUserToBoard() {
        Dashboard__c dashboard = [SELECT Id FROM Dashboard__c LIMIT 1];
        UserBoard__c result = UserBoardController.addUserToBoard(dashboard.Id,'0053X00000BlcrsQAB');

        System.assert(result.Id != null);
    }

    @IsTest
    static void testGetUserBoards() {
        List<UserBoard__c> userBoards = UserBoardController.getUserBoards();
        System.assert(userBoards.size() == recordsNumber);
    }

    @IsTest
    static void testDeleteCard() {
        Dashboard__c dashboard = [SELECT Id FROM Dashboard__c LIMIT 1];
        UserBoardController.deleteUserBoard('0053X00000BlcrsQAB', dashboard.Id);
        List<UserBoard__c> result = [SELECT Id,Dashboard__c FROM UserBoard__c WHERE Dashboard__c = :dashboard.Id];
        System.assert(result.size() == 0);
    }
}