import React from "react"

type itemProps = { text: string, id: string };
const ResultItem = ({ text, id }: itemProps) => (
    <li data-id={id}>{text}</li>
)

export default ResultItem;
