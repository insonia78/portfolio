import React, { Component } from 'react';

import Aux from '../_Aux/_Aux';
//import classes from './Layout.css';
//import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
//import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Questionare from './../../component/Questionare/Questionare';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    render () {
        return (
            <Aux>
                <Questionare />
            </Aux>
        )
    }
}

export default Layout;