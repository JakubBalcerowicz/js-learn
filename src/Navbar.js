import { Link, useMatch, useResolvedPath } from "react-router-dom"

import React, {useEffect, useState, useRef} from "react";

document.loggedIn = false

const ipHost = "51.20.120.30"

export default function Navbar(props){

  const [open, setOpen] = useState(false);

  let menuRef = useRef();
  
  useEffect(() => {
    let handler = (e)=>{
      if(!menuRef.current.contains(e.target)){
        setOpen(false);
        console.log(menuRef.current);
      }      
    };

    document.addEventListener("mousedown", handler);

    return() =>{
      document.removeEventListener("mousedown", handler);
    }
  });

  const logoutForm = document.getElementById("logoutForm");
  document.querySelector(".sub-menu-item-js")?.addEventListener("click", function(){
    console.log("wylogowanie")

    logoutForm.submit();

});

    return ( 
        <nav className="nav">
          <Link to="/" className="site-title">
            TreningApp
          </Link>   
            <ul className={props.status ? "userLogged" : ""}  ref={menuRef}>  
              <CustomLink to="/training">Trening</CustomLink>
              <CustomLink to="/trainingPlan">Plan Treningowy</CustomLink>
              <li className="sub-menu" onClick={()=>{setOpen(!open)}}>
                Konto({props.name})   
                  <div className={`dropdown-menu ${open? 'active' : 'inactive'}`}>          
                    <CustomLink className="sub-menu-item" to="/account">Ustawienia konta</CustomLink> 
                    <li>
                      <form action="http://51.20.120.30:5000/logout" method="POST" id="logoutForm">
                        <a className="sub-menu-item sub-menu-item-js">Wyloguj</a>
                      </form>
                    </li>
                    </div>   
                </li>          
            </ul>          
        </nav>
    )
}

function CustomLink({to, children, ...props}){
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({path: resolvedPath.pathname, end:true});
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}







