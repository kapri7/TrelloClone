/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class CardControllerTest {

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
    }

    @IsTest
    static void testInsertNewCard() {
        Card__c card = new Card__c();
        card.CardColumn__c = [SELECT Id FROM CardColumn__c LIMIT 1].Id;
        card.Name = 'Test';


        Test.startTest();
        Card__c result = CardController.insertNewCard(card);
        Test.stopTest();

        System.assert(result.Name == 'Test');
        System.assert(result.CardColumn__c == card.CardColumn__c);
        System.assert(result.Id != null);
    }

    @IsTest
    static void testUpdateCard() {
        Card__c card = [SELECT Id FROM Card__c LIMIT 1];
        CardColumn__c cardColumn = [SELECT Id FROM CardColumn__c][2];

        Card__c newCard = new Card__c();
        newCard.Name = 'Updated test';
        newCard.CardColumn__c = cardColumn.Id;
        Card__c result = CardController.updateCard(card.Id,newCard);

        System.assert(result.Name == newCard.Name);
        System.assert(result.CardColumn__c == newCard.CardColumn__c);
    }

    @IsTest
    static void testDeleteCard() {
        Card__c card = [SELECT Id FROM Card__c LIMIT 1];
        CardController.deleteCard(card.Id);
        List<Card__c> card2 = [SELECT Id FROM Card__c WHERE Id = :card.Id];
        System.assert(card2.size() == 0);
    }
}