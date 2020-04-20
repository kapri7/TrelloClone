public class FileParser {

    public String name;
    public String url;
    public String id;


    public static FileParser parse(String json) {
        return (FileParser) System.JSON.deserialize(json, FileParser.class);
    }
}