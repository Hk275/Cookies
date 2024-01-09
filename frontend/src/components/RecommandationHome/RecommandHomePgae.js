import * as React from 'react';
import Event from '../Event/Event';



export default function RecommandHomePgae() {
    const [lists, setlist] = React.useState([]);
    const jsonstring = JSON.stringify({
        token:sessionStorage.getItem('token'),
        email:sessionStorage.getItem('u_id'),
        //event_id:
      });
      const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
      };
      React.useEffect(() => {
        fetch('http://127.0.0.1:5000/view/history_based_recommedation', requestoption)
        .then((r) => {
            if (r.status === 200) {
            r.json().then((data) => {
                setlist(data);
                console.log(data)
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

