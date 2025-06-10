import React from 'react';
import './App.css'

const Arrow = (props) => {

    const id = props.id


    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="85 65 200 200" preserveAspectRatio="xMidYMid meet" width="100%" height="50%" id={id} onClick={props.onClick}
             >
            <g display={props.display} cursor={props.display === 'none' ? 'progress' : 'pointer'}>
            <path
                d="M200,100 c-50,-25 -200,75 50,75"
                stroke="black"
                fill="none"
                strokeWidth="12.5"
                markerEnd={`url(#sharpenedHollowArrowhead-${id})`}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="arrow"
            />

            <path
                d="M200,100 c-50,-25 -200,75 50,75"
                stroke="turquoise"
                fill="none"
                strokeWidth="7.5"
                markerEnd={`url(#innerHollowArrowhead-${id})`}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <text x="110"  y="255"
                  style={{fontFamily: 'Arial'}}>
                {props.text}
            </text>
            </g>

            <defs>

                <marker
                    id={`sharpenedHollowArrowhead-${id}`}
                    markerWidth="6"
                    markerHeight="6"
                    refX="3.7"
                    refY="2.85"
                    orient="auto"
                >
                    <polygon
                        points="-0.2 0.3, 5.5 2.9, 0.25 5.5, 2.2 2.85"
                        fill="turquoise"
                        stroke="black"
                        strokeWidth=".1"
                    />
                </marker>

                <marker
                    id={`innerHollowArrowhead-${id}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="3.8"
                    refY="2.7"
                    orient="auto"
                >
                    <polygon
                        points="-1.1 -0.5, 5.9 2.9, 0 5.6, 2 3"
                        fill="turquoise"
                        stroke="turquoise"
                        strokeWidth="0.1"
                    />
                </marker>
            </defs>
        </svg>
    )
}

export default Arrow;