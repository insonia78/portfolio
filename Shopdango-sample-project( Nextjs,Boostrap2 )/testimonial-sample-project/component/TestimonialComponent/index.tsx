import { useState, useEffect } from "react";
import { setUpTestimonialsCards } from "./functions";

export const TestimonialComponent: any = ({ testimonials = [] }: any) => {
    let [flag, setFlag] = useState(true);
    const _testimonials = testimonials.slice();
    let z: number = 0;

    let i = 0;

    const html = setUpTestimonialsCards(_testimonials)
    const [_html, setTestimonials] = useState(html);

    return (
        <>
            <main style={{ padding: "0.75em 7.6875em 0em 7.6875em" }}>
                <h1>Testimonials</h1>
                <br />
                {_html}
            </main>
        </>
    );
};
