/**
 * Created by IvanSteniakin on 4/27/2020.
 */

global class MockHttpResponseGenerator implements HttpCalloutMock {
    static final String LIST_FILES_URL = 'https://api.dropboxapi.com/2/files/list_folder';
    static final String SHARED_LINKS_URL = 'https://api.dropboxapi.com/2/sharing/list_shared_links';
    static final String CREATE_SHARE_LINK_URL = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';
    Map<String, String> requestSetBody;

    global MockHttpResponseGenerator(Map<String, String> requestSetBody) {
        this.requestSetBody = requestSetBody;
    }
    global HttpResponse respond(HttpRequest req) {

        System.assertEquals('POST', req.getMethod());

        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setStatusCode(200);

        if (req.getEndpoint() == LIST_FILES_URL) {

            res.setBody(requestSetBody.get('listFiles'));

        } else if (req.getEndpoint() == SHARED_LINKS_URL) {

            res.setBody(requestSetBody.get('sharedLink'));

        } else if (req.getEndpoint() == CREATE_SHARE_LINK_URL) {
            res.setBody(requestSetBody.get('createdShareLink'));
        }

        return res;
    }
}