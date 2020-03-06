/**
 * Created by IvanSteniakin on 3/5/2020.
 */

public with sharing class LogItemController {
    @AuraEnabled(Cacheable=true)
    public static LogItem__c[] getAllLogItems() {
        return [
                SELECT Date__c,Message__c
                FROM LogItem__c
                ORDER BY Date__c
        ];
    }
    @AuraEnabled
    public static LogItem__c insertNewLogItem(LogItem__c logItem) {
        System.debug(JSON.serialize(logItem));
        insert logItem;
        return logItem;
    }
}