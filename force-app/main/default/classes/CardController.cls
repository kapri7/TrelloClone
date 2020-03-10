/**
 * Created by IvanSteniakin on 3/5/2020.
 */

public with sharing class CardController {
    @AuraEnabled(Cacheable=true)
    public static Card__c[] getAllCards() {
        return [
                SELECT Id,Name,Description__c,CardColumn__c
                FROM Card__c
                ORDER BY CreatedDate
        ];
    }
    @AuraEnabled
    public static Card__c insertNewCard(Card__c card) {
        System.debug(JSON.serialize(card));
        insert card;
        return card;
    }

    @AuraEnabled
    public static Card__c updateCard(Id cardId, Card__c newCard) {
        System.debug(JSON.serialize(cardId));
        Card__c card = [SELECT Id,Name,Description__c,CardColumn__c FROM Card__c WHERE Id = :cardId];
        card.Name = newCard.Name;
        card.CardColumn__c = newCard.CardColumn__c;
        card.Description__c = newCard.Description__c;
        update card;
        return card;
    }

    @AuraEnabled
    public static void deleteCard(Id cardId) {
        System.debug(JSON.serialize(cardId));
        Card__c card = [SELECT Id FROM Card__c WHERE Id = :cardId];
        delete card;
    }
}