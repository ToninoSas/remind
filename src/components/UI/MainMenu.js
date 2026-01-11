import { useContext, useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Button,
  OverlayTrigger,
  Popover,
  Offcanvas,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import PatientContext from "../../context/patients-context";
import Modal from "./Modal";
import styles from "./MainMenu.module.css";

// Import immagini
import logo from "../../logo8.png";
import user from "../../profilo1.png";
import patient from "../../paziente.png";
import game from "../../gioco2.png";
import questions from "../../domanda3.png";
import Box from "../../box.png";

function MainMenu(props) {
  const auth_ctx = useContext(AuthContext);
  const patients_ctx = useContext(PatientContext);
  const navigate = useNavigate();

  // Stato per gestire la larghezza della finestra
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1200);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabSelect = (selectedTab) => {
    if (selectedTab === "Pazienti") {
      patients_ctx.cercaPaziente("");
      navigate(`/pazienti/${auth_ctx.utenteLoggatoUID}`, { replace: true });
    } else if (selectedTab === "Giochi") {
      navigate(`/giochi/${auth_ctx.utenteLoggatoUID}`, { replace: true });
    }
  };

  // Contenuto del menu riutilizzabile sia per Desktop che per Mobile
  const menuContent = (
    <Nav className="flex-column w-100">
      <div className={styles.wrapper_flex}>
        <OverlayTrigger
          rootClose
          trigger="click"
          placement="bottom"
          overlay={
            <Popover id="popover-profile">
              <Popover.Body style={{ maxWidth: "250px" }}>
                <p className={styles.utente_loggato_FULLNAME}>
                  {auth_ctx.nomeUtenteLoggato} {auth_ctx.cognomeUtenteLoggato}
                </p>
                <p className={styles.utente_loggato}>
                  {auth_ctx.utenteLoggato}
                </p>
                <button
                  className={styles.logout_button}
                  onClick={auth_ctx.onLogoutClick}
                  style={{ width: "100%" }}
                >
                  Log Out
                </button>
              </Popover.Body>
            </Popover>
          }
        >
          <Button className={styles.profile_button}>
            <img className={styles.profile_image} src={user} alt="Profile" />
            <span className={styles.brand_text}>
              {auth_ctx.nomeUtenteLoggato} {auth_ctx.cognomeUtenteLoggato}
            </span>
          </Button>
        </OverlayTrigger>
      </div>

      {auth_ctx.tipoAccount !== "Paziente" && (
        <Link
          className={styles.link_reset}
          to={`/pazienti/${auth_ctx.utenteLoggatoUID}`}
        >
          <div
            className={`${styles.menu_option} ${
              props.selected === "PAZIENTI" ? styles.menu_option_SELECTED : ""
            }`}
            onClick={() => handleTabSelect("Pazienti")}
          >
            <img className={styles.image_option} src={patient} alt="pazienti" />
            <div className={styles.menu_text_option}>Pazienti</div>
          </div>
        </Link>
      )}

      <Link
        className={styles.link_reset}
        to={`/giochi/${auth_ctx.utenteLoggatoUID}`}
      >
        <div
          className={`${styles.menu_option} ${
            props.selected === "GIOCHI" ? styles.menu_option_SELECTED : ""
          }`}
          onClick={() => handleTabSelect("Giochi")}
        >
          <img className={styles.image_option} src={game} alt="giochi" />
          <div className={styles.menu_text_option}>
            {auth_ctx.tipoAccount === "Paziente" ? "I Miei Giochi" : "Giochi"}
          </div>
        </div>
      </Link>

      {auth_ctx.tipoAccount !== "Paziente" && (
        <Link
          className={styles.link_reset}
          to={`/domande/${auth_ctx.utenteLoggatoUID}`}
        >
          <div
            className={`${styles.menu_option} ${
              props.selected === "DOMANDE" ? styles.menu_option_SELECTED : ""
            }`}
          >
            <img
              className={styles.image_option}
              src={questions}
              alt="domande"
            />
            <div className={styles.menu_text_option}>Domande</div>
          </div>
        </Link>
      )}

      <Link
        className={styles.link_reset}
        to={`/box-dei-ricordi/${auth_ctx.utenteLoggatoUID}`}
      >
        <div
          className={`${styles.menu_option} ${
            props.selected === "BOX DEI RICORDI"
              ? styles.menu_option_SELECTED
              : ""
          }`}
        >
          <img
            className={styles.image_option}
            src={Box}
            alt="Box dei ricordi"
          />
          <div className={styles.menu_text_option}>Box dei ricordi</div>
        </div>
      </Link>
    </Nav>
  );

  return (
    <>
      <Navbar expand="xl" className={styles.wrap_menu} variant="dark">
        <div className={styles.navbar_header_container}>
          <Navbar.Brand as={Link} to="/" className={styles.brand_container}>
            <img className={styles.menu_image} src={logo} alt="CogniCare" />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            className={styles.hamburger_custom}
          />
        </div>

        {/* Desktop Sidebar Content */}
        {isDesktop ? (
          <div className={styles.desktop_only_content}>{menuContent}</div>
        ) : (
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasLabel"
            placement="start"
            className={styles.offcanvas_custom}
          >
            <Offcanvas.Header closeButton closeVariant="white">
              <Offcanvas.Title id="offcanvasLabel">
                <img src={logo} alt="Logo" style={{ height: "40px" }} />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>{menuContent}</Offcanvas.Body>
          </Navbar.Offcanvas>
        )}
      </Navbar>

      {/* Mobile Offcanvas Content */}

      {auth_ctx.utenteLoggato !== null && auth_ctx.logoutModal && (
        <Modal
          testoModale={"Sei sicuro di voler effettuare il logout?"}
          CONFERMA={() => {
            auth_ctx.onLogout();
            sessionStorage.clear();
            navigate("/");
          }}
          ANNULLA={() => auth_ctx.cancelLogout()}
        />
      )}
    </>
  );
}

export default MainMenu;
