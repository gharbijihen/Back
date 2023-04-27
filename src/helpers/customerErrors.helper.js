module.exports = {
    HttpErrors: {
        NotFound: {
            message: 'Not Found',
            code: 1000,
        },
        Forbidden: {
            message: 'Forbidden',
            code: 1001,
        },
        Unauthorized: {
            message: 'Unauthorized',
            code: 1002,
        },
    },
    Category: {
        Exist: {
            message: 'This Category is already exists',
            code: 7000,
        },
        NotFound: {
            message: 'Category Not Found',
            code: 7001,
        },

        NameUsed: {
            message: 'This Name is already used',
            code: 7003,
        },
    },
    Element: {
        Exist: {
            message: 'This Element is already exists',
            code: 7000,
        },
        NotFound: {
            message: 'Element Not Found',
            code: 7001,
        },

        NameUsed: {
            message: 'This Name is already used',
            code: 7003,
        },
    },
}
