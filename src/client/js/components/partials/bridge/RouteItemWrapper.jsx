import React from 'react';
import RouteItemView from "./RouteItemView";
import RouteItemMobileView from "./RouteItemMobileView";

export default function RouteItemWrapper(props) {
  const routeItem = props.data;

  return (
    <div className="bridge-route-item-wrapper">
      <input type="radio" name="answer"/>
      <RouteItemView data={routeItem}/>
      <RouteItemMobileView data={routeItem}/>
    </div>
  );
}
