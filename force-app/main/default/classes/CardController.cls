/**
 * Created by IvanSteniakin on 3/5/2020.
 */

public with sharing class CardController {
    @AuraEnabled(Cacheable=true)
    public static Card__c[] getAllCards() {
        return [
                SELECT Id,Name,Description__c,CardColumn__c
                FROM Card__c
        ];
    }
    @AuraEnabled
    public static Card__c insertNewCard(Card__c card) {
        System.debug(JSON.serialize(card));
        insert card;
        return card;
    }
}