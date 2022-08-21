const AccountResolver = {
    account: () => {
        return [{
            id: 'string',
            username: 'string',
            email: 'string',
            createdAt: 'Date',
            updatedAt: 'Date',
            active: true,
        }]
    },

}

export default AccountResolver;