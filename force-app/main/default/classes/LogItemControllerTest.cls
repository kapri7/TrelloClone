/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class LogItemControllerTest {
    static final Integer recordsNumber = 5;

    @TestSetup
    static void setup() {
        List<Dashboard__c> dashboards = new List<Dashboard__c>();
        for (Integer i = 0; i < recordsNumber; i++) {
            dashboards.add(new Dashboard__c(Name = 'TestDashboard' + i.format()));
        }
        insert dashboards;

    }
    @IsTest
    static void insertNewLogItem() {
        Dashboard__c dashboard = [SELECT Id FROM Dashboard__c LIMIT 1];
        LogItem__c logItem = new LogItem__c(Name = 'TestDashboard', Dashboard__c = dashboard.Id, Message__c = 'Message!');

        LogItem__c resItem = LogItemController.insertNewLogItem(logItem);
        System.assert(resItem.Name == 'TestDashboard');
        System.assert(resItem.Id != null);
    }
}