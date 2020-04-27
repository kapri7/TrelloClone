/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class CardColumnControllerTest {

    static final Integer recordsNumber = 5;

    @TestSetup
    static void setup() {
        List<Dashboard__c> dashboards = new List<Dashboard__c>();
        for (Integer i = 0; i < recordsNumber; i++) {
            dashboards.add(new Dashboard__c(Name = 'TestDashboard' + i.format()));
        }
        insert dashboards;

        List<CardColumn__c> cardColumns = new List<CardColumn__c>();
        for (Integer i = 0; i < recordsNumber; i++) {
            cardColumns.add(new CardColumn__c(Name = 'TestCardColumn' + i.format(), Dashboard__c = dashboards[i].Id));
        }
        insert cardColumns;


    }

    @IsTest
    static void testInsert() {
        CardColumn__c cardColumn = new CardColumn__c();
        cardColumn.Dashboard__c = [SELECT Id FROM Dashboard__c LIMIT 1].Id;
        cardColumn.Name = 'Test';


        Test.startTest();
        CardColumn__c result = CardColumnController.insertNewColumn(cardColumn);
        Test.stopTest();

        System.assert(result.Name == 'Test');
        System.assert(result.Dashboard__c == cardColumn.Dashboard__c);
        System.assert(result.Id != null);
    }

    @IsTest
    static void testDelete() {
        CardColumn__c cardColumn = [SELECT Id FROM CardColumn__c LIMIT 1];
        CardColumnController.deleteColumn(cardColumn.Id);
        List<CardColumn__c> cardColumn2 = [SELECT Id FROM CardColumn__c WHERE Id = :cardColumn.Id];
        System.assert(cardColumn2.size() == 0);
    }
}