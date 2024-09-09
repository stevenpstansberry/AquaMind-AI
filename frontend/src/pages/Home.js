

import { healthCheck } from "../services/APIServices";
import React, { useState, useEffect } from 'react';




function Home(){

    const [healthState, setHealthState] = useState(null);

    useEffect(() => {
        setHealthState(healthCheck());
    }, []);







    return (
        <div>
            home
        </div>

    )
}

export default Home;