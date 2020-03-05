/**
 * Created by IvanSteniakin on 3/5/2020.
 */

public with sharing class LogItemController {
    @AuraEnabled(Cacheable=true)
    public static LogItem__c[] getAllLogItems() {
        return [SELECT Id, Date__c,Message__c
        FROM LogItem__c];
    }
}