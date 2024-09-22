import { useState, useEffect } from "react";
import { setUpCards } from "./functions";

export const CardComponent: any = ({ data = [] , pagination = {}}:any) => {
        
    const html = setUpCards(pagination,data)
    
    return (
        <>
            <main style={{ padding: "0.75em 7.6875em 0em 7.6875em" }}>
                <h1>Data</h1>
                {html}
                <br />
                
            </main>
        </>
    );
};