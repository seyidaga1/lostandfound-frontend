import "./Menu.css"


export default function Menu() {
    return (
        <div className="menu">
            <nav className="secondary-nav">
                <div className="secondary-nav-container">
                    <a className="nav-link" onClick={() => {document.getElementsByClassName("hero-section")[0].scrollIntoView({ behavior: "smooth"})}}>
                        Ana Səhifə
                    </a>
                    <a className="nav-link" onClick={() => {document.getElementsByClassName("category-section")[0].scrollIntoView({ behavior: "smooth"})}}>
                        Kateqoriyalar
                    </a>
                    <a  className="nav-link" onClick={() => {document.getElementsByClassName("stats-section")[0].scrollIntoView({ behavior: "smooth"})}}>
                        Statistika
                    </a>
                    <a className="nav-link" onClick={() => {document.getElementsByClassName("about-section")[0].scrollIntoView({ behavior: "smooth"})}}>
                        Haqqımızda
                    </a>
                    <a className="nav-link">
                        Əlaqə
                    </a>
                </div>
            </nav>
        </div>
    )
}

{/* <li >HOME</li>
          <li >CATEGORIES</li>
          <li >STATISTICS</li>
          <li >ABOUT</li> */}