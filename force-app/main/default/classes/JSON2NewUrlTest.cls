/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class JSON2NewUrlTest {

    // This test method should give 100% coverage
    @IsTest
    static void testParse() {
        String json = '{\".tag\": \"file\", \"url\": \"https://www.dropbox.com/s/mdut2kwjn6pgd0f/Untitled.docx?dl=0\", \"id\": \"id:75lEn1DcpEAAAAAAAAAADA\", \"name\": \"Untitled.docx\", \"path_lower\": \"/untitled.docx\", \"link_permissions\": {\"resolved_visibility\": {\".tag\": \"public\"}, \"requested_visibility\": {\".tag\": \"public\"}, \"can_revoke\": true, \"visibility_policies\": [{\"policy\": {\".tag\": \"public\"}, \"resolved_policy\": {\".tag\": \"public\"}, \"allowed\": true}, {\"policy\": {\".tag\": \"team_only\"}, \"resolved_policy\": {\".tag\": \"team_only\"}, \"allowed\": false, \"disallowed_reason\": {\".tag\": \"user_not_on_team\"}}, {\"policy\": {\".tag\": \"password\"}, \"resolved_policy\": {\".tag\": \"password\"}, \"allowed\": false, \"disallowed_reason\": {\".tag\": \"user_account_type\"}}], \"can_set_expiry\": false, \"can_remove_expiry\": true, \"allow_download\": true, \"can_allow_download\": true, \"can_disallow_download\": false, \"allow_comments\": true, \"team_restricts_comments\": false, \"audience_options\": [{\"audience\": {\".tag\": \"public\"}, \"allowed\": true}, {\"audience\": {\".tag\": \"team\"}, \"allowed\": false, \"disallowed_reason\": {\".tag\": \"user_not_on_team\"}}, {\"audience\": {\".tag\": \"password\"}, \"allowed\": false, \"disallowed_reason\": {\".tag\": \"user_account_type\"}}]}, \"preview_type\": \"doc\", \"client_modified\": \"2020-04-20T20:31:20Z\", \"server_modified\": \"2020-04-20T20:31:20Z\", \"rev\": \"015a3bec827dba100000001ba797340\", \"size\": 11602}';
        JSON2NewUrl r = JSON2NewUrl.parse(json);
        System.assert(r != null);

        json = '{\"TestAMissingObject\": { \"TestAMissingArray\": [ { \"TestAMissingProperty\": \"Some Value\" } ] } }';
        JSON2NewUrl.Link_permissions objLink_permissions = new JSON2NewUrl.Link_permissions(System.JSON.createParser(json));
        System.assert(objLink_permissions != null);
        System.assert(objLink_permissions.resolved_visibility == null);
        System.assert(objLink_permissions.requested_visibility == null);
        System.assert(objLink_permissions.can_revoke == null);
        System.assert(objLink_permissions.visibility_policies == null);
        System.assert(objLink_permissions.can_set_expiry == null);
        System.assert(objLink_permissions.can_remove_expiry == null);
        System.assert(objLink_permissions.allow_download == null);
        System.assert(objLink_permissions.can_allow_download == null);
        System.assert(objLink_permissions.can_disallow_download == null);
        System.assert(objLink_permissions.allow_comments == null);
        System.assert(objLink_permissions.team_restricts_comments == null);
        System.assert(objLink_permissions.audience_options == null);

        json = '{\"TestAMissingObject\": { \"TestAMissingArray\": [ { \"TestAMissingProperty\": \"Some Value\" } ] } }';
        JSON2NewUrl objJSON2Apex = new JSON2NewUrl(System.JSON.createParser(json));
        System.assert(objJSON2Apex != null);
        System.assert(objJSON2Apex.x_tag == null);
        System.assert(objJSON2Apex.url == null);
        System.assert(objJSON2Apex.id == null);
        System.assert(objJSON2Apex.name == null);
        System.assert(objJSON2Apex.path_lower == null);
        System.assert(objJSON2Apex.link_permissions == null);
        System.assert(objJSON2Apex.preview_type == null);
        System.assert(objJSON2Apex.client_modified == null);
        System.assert(objJSON2Apex.server_modified == null);
        System.assert(objJSON2Apex.rev == null);
        System.assert(objJSON2Apex.size == null);

        json = '{\"TestAMissingObject\": { \"TestAMissingArray\": [ { \"TestAMissingProperty\": \"Some Value\" } ] } }';
        JSON2NewUrl.Visibility_policies objVisibility_policies = new JSON2NewUrl.Visibility_policies(System.JSON.createParser(json));
        System.assert(objVisibility_policies != null);
        System.assert(objVisibility_policies.policy == null);
        System.assert(objVisibility_policies.resolved_policy == null);
        System.assert(objVisibility_policies.allowed == null);
        System.assert(objVisibility_policies.disallowed_reason == null);

        json = '{\"TestAMissingObject\": { \"TestAMissingArray\": [ { \"TestAMissingProperty\": \"Some Value\" } ] } }';
        JSON2NewUrl.Audience_options objAudience_options = new JSON2NewUrl.Audience_options(System.JSON.createParser(json));
        System.assert(objAudience_options != null);
        System.assert(objAudience_options.audience == null);
        System.assert(objAudience_options.allowed == null);
        System.assert(objAudience_options.disallowed_reason == null);

        json = '{\"TestAMissingObject\": { \"TestAMissingArray\": [ { \"TestAMissingProperty\": \"Some Value\" } ] } }';
        JSON2NewUrl.Resolved_visibility objResolved_visibility = new JSON2NewUrl.Resolved_visibility(System.JSON.createParser(json));
        System.assert(objResolved_visibility != null);
        System.assert(objResolved_visibility.x_tag == null);
    }
}