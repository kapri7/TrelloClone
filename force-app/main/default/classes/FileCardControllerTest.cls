/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class FileCardControllerTest {
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
    static void testInsertNewFileCard() {
        String file = '[{"name": "Ростер", "url": "https://resourceful-otter-kb7jxk-dev-ed.my.salesfo…et%3A1GVfMyJzT8TL-ehxIbJ7MexX4Gix6qUcJ99CCmJZfscQ", "id": "x003X000001SeAGQA0"}]';
        Id cardId = [SELECT Id FROM Card__c LIMIT 1].Id;
        String source = 'Google';

        Test.startTest();
        List<GoogleFileCard__c> result = FileCardController.addFileCard(file, cardId, source);
        Test.stopTest();

        System.assert(result.size() > 0);
        System.assert(result[0].Card__c == cardId);
    }

    @IsTest
    static void testDeleteFileCard() {
        GoogleFileCard__c fileCard = [SELECT FileId__c,Card__c FROM GoogleFileCard__c LIMIT 1];
        FileCardController.deleteFileCard(fileCard.FileId__c,fileCard.Card__c);
        List<GoogleFileCard__c> dashboards = [SELECT Id FROM GoogleFileCard__c WHERE Id = :fileCard.Id];
        System.assert(dashboards.size() == 0);
    }
}