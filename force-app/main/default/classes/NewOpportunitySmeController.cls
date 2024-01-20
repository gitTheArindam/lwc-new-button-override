public with sharing class NewOpportunitySmeController {
    @AuraEnabled(cacheable=true)
    public static List<String> getDepartments(String opportunityId) {
        List<String> result = new List<String>();
        try {
            Set<String> departments = new Set<String>();
            List<Opportunity> opportunities = new List<Opportunity>();

            if (String.isNotBlank(opportunityId)) {
                opportunities = [
                    SELECT Id, AccountId
                    FROM Opportunity
                    WHERE Id = :opportunityId AND AccountId != NULL
                    WITH USER_MODE
                    LIMIT 1
                ];

                if (!opportunities.isEmpty()) {
                    String accountId = opportunities[0]?.AccountId;

                    for (Contact con : [
                        SELECT Id, Department__c
                        FROM Contact
                        WHERE AccountId = :accountId AND Department__c != NULL
                        WITH USER_MODE
                    ]) {
                        departments.add(con?.Department__c);
                    }
                }
            }
            result.addAll(departments);
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
        return result;
    }
}
