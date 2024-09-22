import { useState, useEffect } from "react";
import { createPagination } from "./functions";

export const PaginationComponent: any = ({ data = [], setPagination = new Function(), pagination = {} }: any) => {


    const groups: number = Math.round(data.length / 5);

    return (
        <>
            <div                
                style={{
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center",
                    flexWrap: "wrap",

                }}>
                {
                    createPagination(setPagination, data, pagination)
                }


            </div>
        </>
    );
};