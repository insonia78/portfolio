import React from "react";
import Cookies from "js-cookie";
import logo from "../public/images/logo.png";

class SideBar extends React.Component {
  componentDidMount() {
    fetch("/api/v1/store-data/currency", { method: "GET" }).then((data) => {
      if (data.hasOwnProperty("status") && data.status === "success") {
        Cookies.set("shopCurrency", data.data);
      } else {
        Cookies.set("shopCurrency", "USD");
      }
    });
  }

  render() {
    return (
      <div
        className="nk-sidebar nk-sidebar-fixed is-light "
        data-content="sidebarMenu"
      >
        <div className="nk-sidebar-element nk-sidebar-head">
          <div className="nk-sidebar-brand">
            <a href="/" className="logo-link nk-sidebar-logo">
              <img className="logo-img" src={logo} alt="logo" />
            </a>
          </div>
          <div className="nk-menu-trigger mr-n2">
            <a
              href="#"
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none"
              data-target="sidebarMenu"
            >
              <em className="icon ni ni-arrow-left"></em>
            </a>
            <a
              href="#"
              className="nk-nav-compact nk-quick-nav-icon d-none d-xl-inline-flex"
              data-target="sidebarMenu"
            >
              <em className="icon ni ni-menu"></em>
            </a>
          </div>
        </div>
        <div className="nk-sidebar-element">
          <div className="nk-sidebar-content">
            <div className="nk-sidebar-menu" data-simplebar>
              <ul className="nk-menu">
                {this.props.menuItems.map((menuItem) => {
                  return (
                    <li className="nk-menu-item" key={menuItem.path}>
                      <a href={menuItem.path} className="nk-menu-link">
                        <span className="nk-menu-icon">
                          <em className={"icon ni ni-" + menuItem.icon}></em>
                        </span>
                        <span className="nk-menu-text">{menuItem.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SideBar;
