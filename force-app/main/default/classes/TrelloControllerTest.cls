/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class TrelloControllerTest {
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

        List<Card__c> cards = new List<Card__c>();
        for (Integer i = 0; i < recordsNumber; i++) {
            cards.add(new Card__c(Name = 'TestCard' + i.format(), CardColumn__c = cardColumns[i].Id));
        }
        insert cards;

        List<LogItem__c> logItems = new List<LogItem__c>();
        for (Integer i = 0; i < recordsNumber; i++) {
            logItems.add(new LogItem__c(Name = 'TestDashboard', Dashboard__c = dashboards[i].Id, Message__c = 'Message!'));
        }
        insert logItems;

        GoogleFileCard__c fileCard = new GoogleFileCard__c();
        fileCard.Card__c = cards[0].Id;
        fileCard.Name = 'Google';
        fileCard.FileUrl__c = 'https://resourceful-otter-kb7jxk-dev-ed.my.salesfo…00g1k1%3Afile%3A126hYir3jzX_fl14QJekP6Aob25LRNC3p';
        fileCard.FileName__c = 'task.txt';
        fileCard.FileId__c = 'x003X000001SeLoQAK';
        fileCard.Name = 'Google';

        insert fileCard;
    }
    @IsTest
    static void testGetAllData() {
        Map<String, List<SObject>> result = TrelloController.getAllData();

        System.assert(result.get('CardColumnDashboard').size() == recordsNumber);
        System.assert(result.get('GoogleFileCard').size() == 1);
        System.assert(result.get('LogItem').size() == recordsNumber);
    }
}