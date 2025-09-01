import React, { useState } from "react";

const TruncatedName = ({ name }) => {
    const [expanded, setExpanded] = useState(false);

    // longueur max
    const MAX_LENGTH = 15;

    // si le nom est court, on l'affiche tel quel
    if (name.length <= MAX_LENGTH) {
        return <span>{name}</span>;
    }

    return (
        <span>
            {expanded ? name : name.substring(0, MAX_LENGTH) + "..."}{" "}
            <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-500 underline ml-1"
                style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                }}
            >
                {expanded ? "voir moins" : "voir plus"}
            </button>
        </span>
    );
};

export default TruncatedName;
