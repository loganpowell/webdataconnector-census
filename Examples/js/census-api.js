(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "B01001_001E",
            alias: "Total Population",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "NAME",
            alias: "State",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "state",
            alias: "FIPS ID",
            dataType: tableau.dataTypeEnum.int
        }];

        var tableSchema = {
            id: "CensusStats",
            alias: "2016 ACS1 Data: Total Population By State",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.census.gov/data/2016/acs/acs1?get=B01001_001E,NAME&for=state:*", function(resp) {
            var feat = resp,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "B01001_001E": feat[i][0],
                    "NAME": feat[i][1],
                    "state": feat[i][2],
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
