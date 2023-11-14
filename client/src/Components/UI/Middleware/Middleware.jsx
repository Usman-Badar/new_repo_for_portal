/* eslint-disable eqeqeq */
import React from 'react';
const key = 'real secret keys should be long and random';
const encryptor = require('simple-encryptor')(key);

const Middleware = ({admin, children, hasAccess, user, guarded, authorization, authorizationMethod, authorization_key, authorization_value, authorization_expression}) => {
    const userAccess = user.access ? JSON.parse(user.access) : {};
    if (!guarded || userAccess.includes(hasAccess) || (admin && userAccess.includes(0))) {
        if (checkIfUserHasAccess(authorization, authorizationMethod, user, userAccess, authorization_key, authorization_value, authorization_expression))
        return (
            <>
                {children}
            </>
        )
    }else {
        throw new Error("You don't have permission to access this page. If you should have have access to this page, kindly contact the IT administrator.");
    }
}

export default Middleware;

const checkIfUserHasAccess = (authorization, method, user, userAccess, authorization_key, authorization_value, authorization_expression) => {
    if (authorization) {
        if (method === 'arrIncludesUser') {
            if (JSON.parse(authorization_key)) {
                // const arr = JSON.parse(argument);
                return true;
            }else {
                authFailed();
            }
        }else if (method === 'matchAuthKey') {
            const key = encryptor.decrypt(authorization_key);
            if (authorization_expression === 'equal' && key == authorization_value) {
                return true;
            }
            authFailed();
        }
    }else {
        return true;
    }
}

const authFailed = () => {
    throw new Error("Authorization Failed, seems like you don't have permission to access this page.");
}