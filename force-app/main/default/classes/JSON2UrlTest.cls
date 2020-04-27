/**
 * Created by IvanSteniakin on 4/27/2020.
 */

@IsTest
private class JSON2UrlTest {

    @IsTest
    static void testParse() {
        String json = '{\"links\": [{\".tag\": \"file\", \"url\": \"https://www.dropbox.com/s/894omr2jejhorox/Get%20Started%20with%20Dropbox.pdf?dl=0\", \"id\": \"id:75lEn1DcpEAAAAAAAAAABg\", \"name\": \"Get Started with Dropbox.pdf\", \"path_lower\": \"/get started with dropbox.pdf\", \"link_permissions\": {\"resolved_visibility\": {\".tag\": \"public\"}, \"requested_visibility\": {\".tag\": \"public\"}, \"can_revoke\": true, \"visibility_policies\": [{\"policy\": {\".tag\": \"public\"}, \"resolved_policy\": {\".tag\": \"public\"}, \"allowed\": true}, {\"policy\": {\".tag\": \"team_only\"}, \"resolved_policy\": {\".tag\": \"team_only\"}, \"allowed\": false, \"disallowed_reason\": {\".tag\": \"user_not_on_team\"}}, {\"policy\": {\".tag\": \"password\"}, \"resolved_policy\": {\".tag\": \"password\"}, \"allowed\": false, \"disallowed_reason\": {\".tag\": \"user_account_type\"}}], \"can_set_expiry\": false, \"can_remove_expiry\": true, \"allow_download\": true, \"can_allow_download\": true, \"can_disallow_download\": false, \"allow_comments\": true, \"team_restricts_comments\": false, \"audience_options\": [{\"audience\": {\".tag\": \"public\"}, \"allowed\": true}, {\"audience\": {\".tag\": \"team\"}, \"allowed\": false, \"disallowed_reason\": {\".tag\": \"user_not_on_team\"}}, {\"audience\": {\".tag\": \"password\"}, \"allowed\": false, \"disallowed_reason\": {\".tag\": \"user_account_type\"}}]}, \"preview_type\": \"doc\", \"client_modified\": \"2020-04-07T10:27:46Z\", \"server_modified\": \"2020-04-07T10:27:46Z\", \"rev\": \"015a2b0d5b1564f00000001ba797340\", \"size\": 1102331}], \"has_more\": false}';
        JSON2Url r = JSON2Url.parse(json);
        System.assert(r != null);

        json = '{\"TestAMissingObject\": { \"TestAMissingArray\": [ { \"TestAMissingProperty\": \"Some Value\" } ] } }';
        JSON2Url.Link_permissions objLink_permissions = new JSON2Url.Link_permissions(System.JSON.createParser(json));
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
        JSON2Url objJSON2Apex = new JSON2Url(System.JSON.createParser(json));
        System.assert(objJSON2Apex != null);
        System.assert(objJSON2Apex.links == null);
        System.assert(objJSON2Apex.has_more == null);

        json = '{\"TestAMissingObject\": { \"TestAMissingArray\": [ { \"TestAMissingProperty\": \"Some Value\" } ] } }';
        JSON2Url.Visibility_policies objVisibility_policies = new JSON2Url.Visibility_policies(System.JSON.createParser(json));
        System.assert(objVisibility_policies != null);
        System.assert(objVisibility_policies.policy == null);
        System.assert(objVisibility_policies.resolved_policy == null);
        System.assert(objVisibility_policies.allowed == null);
        System.assert(objVisibility_policies.disallowed_reason == null);

        json = '{\"TestAMissingObject\": { \"TestAMissingArray\": [ { \"TestAMissingProperty\": \"Some Value\" } ] } }';
        JSON2Url.Links objLinks = new JSON2Url.Links(System.JSON.createParser(json));
        System.assert(objLinks != null);
        System.assert(objLinks.x_tag == null);
        System.assert(objLinks.url == null);
        System.assert(objLinks.id == null);
        System.assert(objLinks.name == null);
        System.assert(objLinks.path_lower == null);
        System.assert(objLinks.link_permissions == null);
        System.assert(objLinks.preview_type == null);
        System.assert(objLinks.client_modified == null);
        System.assert(objLinks.server_modified == null);
        System.assert(objLinks.rev == null);
        System.assert(objLinks.size == null);

        json = '{\"TestAMissingObject\": { \"TestAMissingArray\": [ { \"TestAMissingProperty\": \"Some Value\" } ] } }';
        JSON2Url.Audience_options objAudience_options = new JSON2Url.Audience_options(System.JSON.createParser(json));
        System.assert(objAudience_options != null);
        System.assert(objAudience_options.audience == null);
        System.assert(objAudience_options.allowed == null);
        System.assert(objAudience_options.disallowed_reason == null);

        json = '{\"TestAMissingObject\": { \"TestAMissingArray\": [ { \"TestAMissingProperty\": \"Some Value\" } ] } }';
        JSON2Url.Resolved_visibility objResolved_visibility = new JSON2Url.Resolved_visibility(System.JSON.createParser(json));
        System.assert(objResolved_visibility != null);
        System.assert(objResolved_visibility.x_tag == null);
    }
}