import React, { lazy, useMemo, useState } from 'react';
import './UI.css';

import { Route } from 'react-router-dom';
import { ShowSideBar } from '../../Redux/Actions/Action';
import { useDispatch } from 'react-redux';

const SideBar = lazy( () => import('../EmployeeProtal/Dashboard/Components/SideBar/SideBar') );
const TopBar = lazy( () => import('../EmployeeProtal/Dashboard/Components/TopBar/TopBar') );

const Dashboard = lazy( () => import('./Dashboard/Dashboard') );
const Assets = lazy( () => import('./Assets/Assets') );
const SubAssets = lazy( () => import('./Assets/SubAssets/SubAssets') );
const Items = lazy( () => import('./Items/Items') );
const ItemNames = lazy( () => import('./ItemNames/ItemNames') );

const UI = ( props ) => {
    const dispatch = useDispatch();

    const [ ShowBar, setShowBar ] = useState( false );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const SideBarClose = () => {

        dispatch( ShowSideBar( false ) );

    }

  return (

    <div className="Inventory_Dashboard">

        {/* SideBar Start From Here */}
        {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            useMemo(
                () => {

                    return <SideBar title="INVENTORY" Data={ props.content } show={ShowBar} SideBarClose={ SideBarClose } />

                }, [ShowBar, props.content, SideBarClose]
            )
        }
        {/* SideBar End Here */}

          <div className="Inventory_Dashboard_main_content">
              {/* TopBar Start From Here */}
              {
                  useMemo(
                      () => {

                          const ShowSide = () => {

                              if (ShowBar) {
                                  setShowBar(false);
                              } else {
                                  setShowBar(true);
                              }

                          }

                          return <TopBar sideBarTrue={ShowSide} />

                      }, [ShowBar]
                  )
              }

              <div className="content">

                  <Route exact path='/inventory/dashboard' component={ Dashboard } />

                  <Route exact path='/inventory/assets' component={ Assets } />

                  <Route exact path='/inventory/asset/id=:asset_id&&name=:asset_name&&view=sub_assets' component={ SubAssets } />

                  <Route exact path='/inventory/asset/id=:asset_id&&name=:asset_name&&view=sub_items' component={ Items } />

                  <Route exact path='/inventory/items_names' component={ ItemNames } />
                  <Route exact path='/inventory/new_items_names' component={ ItemNames } />

              </div>

          </div>

    </div>
    
  )

}

export default UI;