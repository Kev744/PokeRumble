import React, {useEffect, useState} from 'react';
import './Record.css';
import {encryptStorage} from "./utils/storage";

const Record = () => {

    const MapLang = new Map([[0, ["French", "fr"]], [1, ["English/International", "uk"]], [2,["German", "ge"]]]);

    const [recordData, setDataRecord] = useState([])

    const sortData = (data, nb) => {
        const initialData = Array.from({length : nb}, () => [])

        data.reduce((acc, elem) => {acc[parseInt(elem.lang,10)].push(elem);
                                    return acc},initialData)
        return initialData.map(x => x.sort(function(a,b) {
            return a.nbPok - b.nbPok === 0 ? -a.time + b.time : -a.nbPok + b.nbPok
        }))
    }

    function timerToISOHours(timer) {
        const hours = Math.floor(timer/3600)
        const minutes = Math.floor(timer/60) % 60
        const seconds = timer % 60
        return String(`${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`)
    }

    const getPosition = (email) => {
        return recordData.map((x) => {
            const id =  x.findIndex((row) => row.email === email)
            return id === -1 ? null : {...x[id], pos: id + 1}
        })
    }

    useEffect(() => {
        fetch("/server/record")
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    setDataRecord(sortData(data.message, 3));
                } else {
                    console.error("Unexpected response structure:", data);
                }
            })
            .catch(err => console.log("Error fetching record data:", err));
    }, []);
    return (
        <div className={"tablesRecord"}>
            {recordData.map((lang, index) => (
                <table key={index}>
                    {/* Leaderboard Header with Image and Caption */}


                    {/* Table Headers */}
                    <thead>
                    <tr className="wrapTitleImg">
                        <td> <img src={require(`./language_image/${MapLang.get(index)[1]}.png`)} alt={"Leaderboard"} /> </td>
                        <td id='categoryCountry'> {MapLang.get(index)[0]}'s leaderboard </td>
                    </tr>
                    <tr>
                        <th>Position</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Total Pokemon</th>
                        <th>Personal Time</th>
                    </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                    {/* Display up to 15 users */}
                    {lang.slice(0, 15).map((field, pos) => (
                        <tr key={pos}>
                            <td data-label="Position">{pos + 1}</td>
                            <td data-label="Nickname">{field.nickname}</td>
                            <td data-label="Email">
                                {field.email.substring(0, 3)}
                                {"*".repeat(field.email.length - 3)}
                            </td>
                            <td data-label="Number of Pokemon">{field.nbPok}</td>
                            <td data-label="Personal Time">{timerToISOHours(field.timer)}</td>
                        </tr>
                    ))}

                    {/* Placeholder for Exceeding Users */}
                    {lang.length > 15 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                ...and {lang.length - 15} more users
                            </td>
                        </tr>
                    )}

                    {/* Highlight the current user's position if available */}
                    {getPosition(encryptStorage.getItem("dataRecord", false))[index] && (
                        <tr id="myPosition">
                            {(() => {
                                const x = getPosition(encryptStorage.getItem("dataRecord", false))[index];
                                return (
                                    <>
                                        <td>{x.pos}</td>
                                        <td>{x.nickname}</td>
                                        <td>{x.email}</td>
                                        <td>{x.nbPok}</td>
                                        <td>{timerToISOHours(x.timer)}</td>
                                    </>
                                );
                            })()}
                        </tr>
                    )}
                    </tbody>
                </table>
            ))}

        </div>
    )
}

export default Record;