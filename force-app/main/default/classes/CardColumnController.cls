/**
 * Created by IvanSteniakin on 3/5/2020.
 */

public with sharing class CardColumnController {
    @AuraEnabled(Cacheable=true)
    public static CardColumn__c[] getAllColumns() {
        return [
                SELECT Id,Name,Dashboard__c
                FROM CardColumn__c
                ORDER BY CreatedDate
        ];
    }
    @AuraEnabled
    public static CardColumn__c insertNewColumn(CardColumn__c cardColumn) {
        System.debug(JSON.serialize(cardColumn));
        insert cardColumn;
        return cardColumn;
    }

    @AuraEnabled
    public static void deleteColumn(Id cardColumnId) {
        System.debug(JSON.serialize(cardColumnId));
        CardColumn__c cardColumn = [SELECT Id FROM CardColumn__c WHERE Id = :cardColumnId];
        delete cardColumn;
    }
}