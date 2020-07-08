const ERROR = Object.freeze({
    INTERNAL_ERROR: {
        statusCode: 500,
        status: {
            code: "SCH50",
            message: "Internal Error in the service",
            identifier: null,
            date: null
        }
    },
    NO_SEARCH_PARAMETERS_FOUND: {
        statusCode: 404,
        status: {
            code: "SCH40",
            message: "No valid parameters for the search",
            identifier: null,
            date: null
        }
    },
    INVALID_REQUEST: {
        statusCode: 400,
        status: {
            code: "SCH42",
            message: "The suplied parameters are invalid",
            identifier: null,
            date: null
        }
    }
});

module.exports = ERROR;
