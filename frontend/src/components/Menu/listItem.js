import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';


const urls = [];

const MainListItems =() => {
    const ishost = sessionStorage.getItem('is_host')
    console.log(ishost)
    return (
    <React.Fragment>
        <ListItemButton onClick={e => {
            window.location.href = '/account'
        }}>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Account Details" />
        </ListItemButton>
        <ListItemButton onClick={e => {
            window.location.href = '/accountedit'
        }}>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Details Edit" />
        </ListItemButton>
        <ListItemButton onClick={e => {
            window.location.href = '/wallet'
        }}>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Wallet" />
        </ListItemButton>
        
        {ishost == 'true' &&  <> 
            <ListItemButton onClick={e => {
                window.location.href = '/pastevents'
            }}>
            <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Past Events" />
            </ListItemButton>
            <ListItemButton onClick={e => {
                window.location.href = '/futureevents'
            }}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Future Events" />
            </ListItemButton>
    
            <ListItemButton onClick={e => {
                window.location.href = '/createnewevent'
            }}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Create New Event" />
            </ListItemButton>
    
            <ListItemButton onClick={e => {
                window.location.href = '/editevent'
            }}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Edit Event" />
            </ListItemButton>
            </>
        }
        
        {ishost == 'false' && <> <ListItemButton onClick={e => {
            window.location.href = '/currentorders'
        }}>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Current Orders" />
        </ListItemButton>
        <ListItemButton onClick={e => {
            window.location.href = '/friends'
        }}>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Friends" />
        </ListItemButton>
        <ListItemButton onClick={e => {
                window.location.href = '/pastbookings'
            }}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Past Bookings" />
            </ListItemButton>
            <ListItemButton onClick={e => {
                window.location.href = '/grouprequests'
            }}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Booking Requests" />
            </ListItemButton>
        </>
        }
    </React.Fragment>
    )
}

export default MainListItems;
