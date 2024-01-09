import * as React from 'react';
import Event from './Event';

/**
 * This components are used in Home page to view 
 */

export default function Upcoming() {
    
    const requestoption = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        };
        const [lists, setlist] = React.useState([]);
        React.useEffect(() => {
        fetch('http://127.0.0.1:5000/view/get_nextmonth_homepage_list', requestoption)
        .then((r) => {
            if (r.status === 200) {
            r.json().then((data) => {
                setlist(data);
            });
            } else {
            r.json().then((data) => {
            });
            }
        })
        }, [])
    
    return (

        <>
                {lists.map((list, idx) => {
                                {
                            return (
                                <>
                                <Event lists = {list}/>
                                </>
                                
                            )
                            }
                        }
                        )
                        }
    </>
    );
  }

