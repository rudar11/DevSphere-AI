import React, { createContext, useState, useContext } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};



// app routes(app.jsx file me) ke andar jitne bhi components honge unn sabhi ke pass access hoga kiska iss particular user ka jo line number 8 par hai upper deak 